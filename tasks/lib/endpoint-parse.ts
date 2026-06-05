import { dereference } from '@scalar/openapi-parser';
import type { OpenAPI, OpenAPIV3 } from '@scalar/openapi-types';
import type { Endpoint, EndpointResponse, EndpointType, PathParam, QueryParam } from './endpoint.types.ts';

/**
 * @param openapiObject the openapi object
 * @param pathPrefix the prefix to add to every path found in the openapi
 */
export async function parseEndpoints(
  openapiObject: OpenAPI.Document,
  pathPrefix: string,
): Promise<Record<string, Endpoint>> {
  // `dereference` is synchronous (it returns the result object directly, not a Promise).
  const dereferenced = dereference(openapiObject, { throwOnError: false });

  const result: Record<string, Endpoint> = {};

  Object.entries(dereferenced.schema!.paths!).forEach(([p, methods]) => {
    const path = `${pathPrefix}${p}`;

    if (methods?.$ref) {
      // todo: we don't know how to hande that case
    } else {
      Object.entries(methods).forEach((entry) => {
        const method: string = entry[0];
        const operation = entry[1] as OpenAPIV3.OperationObject;

        //-- normalize ------
        const normalizedPath = normalizePath(path);
        const endpointId = `[${method.toUpperCase()}] ${normalizedPath}`;

        // @ts-expect-error : we are sure the original specification has the same shape as the dereferenced schema
        const operationSpec = dereferenced.specification.paths[p][method] as OpenAPIV3.OperationObject;

        //-- parse query params, pathParams, ... ------

        const queryParams: Array<QueryParam> = [];
        const pathParams: Array<PathParam> = [];
        operation.parameters
          ?.sort((param1, param2) => {
            // todo: sometimes, name and in are null
            const nameCompare = param1.name?.localeCompare(param2.name);
            if (nameCompare === 0) {
              return param1.in?.localeCompare(param2.in);
            }
            return nameCompare;
          })
          .forEach((param, index) => {
            const paramSpec = operationSpec.parameters![index];

            const simpleParam = {
              name: param.name,
              required: param.required,
              type: parseEndpointType(param.schema ?? param, paramSpec.schema ?? paramSpec),
            };

            if (param.in === 'query') {
              queryParams.push(simpleParam);
            } else if (param.in === 'path') {
              pathParams.push(simpleParam);
            } else {
              // todo: cookie, header
            }
          });

        //-- parse responses ------

        // get only the first non error status response
        const responseByStatusCodeEntry = Object.entries(operation.responses ?? {}).find(
          ([code]) => Number(code) >= 200 && Number(code) < 300,
        );

        // todo: warn when there are multiple valid status code entries.

        let response: null | EndpointResponse;
        if (responseByStatusCodeEntry == null) {
          // todo: validation warning
          response = null;
        } else {
          const statusCode = Number(responseByStatusCodeEntry[0]);

          const entries = Object.entries(responseByStatusCodeEntry[1].content ?? {});
          let responseByContentTypeEntry: [string, any] | null | undefined;
          if (entries.length === 0) {
            responseByContentTypeEntry = null;
          } else if (entries.length === 1) {
            responseByContentTypeEntry = entries[0];
          } else if (entries.length > 1) {
            // todo: validation warning

            // if multiple content type we prefer the 'application/json'
            responseByContentTypeEntry = entries.find(([contentType]) => {
              return normalizeContentType(contentType) === 'application/json';
            });

            // if no 'application/json' response, we use the first one
            if (responseByContentTypeEntry == null) {
              // todo: validation warning (it is ok for streams, maybe for login endpoints too?)
              responseByContentTypeEntry = entries[0];
            }
          }

          if (responseByContentTypeEntry == null) {
            response = { statusCode };
          } else {
            const contentType = responseByContentTypeEntry[0];
            const res = responseByContentTypeEntry[1];

            const resultSpec = operationSpec.responses![responseByStatusCodeEntry[0]].content![contentType];
            response = {
              statusCode,
              contentType,
              type: parseEndpointType(res.schema ?? res, resultSpec.schema ?? resultSpec),
            };
          }
        }

        //-- final endpoint description ------

        result[endpointId] = {
          id: endpointId,
          method,
          path,
          normalizedPath,
          operationId: operation.operationId ?? '',
          queryParams,
          pathParams,
          requestBody:
            operation.requestBody != null
              ? parseEndpointType(
                  operation.requestBody,
                  operationSpec.requestBody as OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject,
                )
              : undefined,
          response: response!,
        };
      });
    }
  });

  return result;
}

function normalizePath(pathPattern: string): string {
  return pathPattern.replaceAll(/\{[^}]+}/g, ':XXX');
}

function normalizeContentType(contentType: string): string {
  // todo: warn when contentType has got charset
  return contentType.split(';')[0];
}

function parseEndpointType(
  dereferencedType: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject,
  specificationType: OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject,
): EndpointType {
  if (dereferencedType.$ref != null) {
    return {
      type: 'broken',
      ref: dereferencedType.$ref,
    };
  }
  return {
    type: 'not-broken',
    schema: dereferencedType,
    ref: specificationType.$ref,
  };
}
