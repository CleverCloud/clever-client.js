/**
 * @import { Endpoint, QueryParam, PathParam, EndpointType, EndpointResponse } from './endpoint.types.js'
 * @import { OpenAPI } from '@scalar/openapi-types'
 * @import { OpenAPIV3 } from '@scalar/openapi-types'
 */
import { dereference } from '@scalar/openapi-parser';

/**
 * @param {OpenAPI.Document} openapiObject the openapi object
 * @param {string} pathPrefix the prefix to add to every path found in the openapi
 * @returns {Promise<Record<string, Endpoint>>}
 */
export async function parseEndpoints(openapiObject, pathPrefix) {
  /** @type {{specification?: OpenAPI.Document, schema?: OpenAPI.Document}} */
  const dereferenced = await dereference(openapiObject, { throwOnError: false });

  /** @type {Record<string, Endpoint>} */
  const result = {};

  Object.entries(dereferenced.schema.paths).forEach(([p, methods]) => {
    const path = `${pathPrefix}${p}`;

    if (methods.$ref) {
      // todo: we don't know how to hande that case
    } else {
      Object.entries(methods).forEach((entry) => {
        /** @type {string} */
        const method = entry[0];
        /** @type {OpenAPIV3.OperationObject} */
        const operation = entry[1];

        //-- normalize ------
        const normalizedPath = normalizePath(path);
        const endpointId = `[${method.toUpperCase()}] ${normalizedPath}`;

        // @ts-ignore : we are sure the original specification has the same shape as the dereferenced schema
        const operationSpec = /** @type {OpenAPIV3.OperationObject}*/ (dereferenced.specification.paths[p][method]);

        //-- parse query params, pathParams, ... ------

        /** @type {Array<QueryParam>} */
        const queryParams = [];
        /** @type {Array<PathParam>} */
        const pathParams = [];
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
            const paramSpec = operationSpec.parameters[index];

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
        const responseByStatusCodeEntry = Object.entries(operation.responses).find(
          ([code]) => Number(code) >= 200 && Number(code) < 300,
        );

        // todo: warn when there are multiple valid status code entries.

        /** @type {null|EndpointResponse} */
        let response;
        if (responseByStatusCodeEntry == null) {
          // todo: validation warning
          response = null;
        } else {
          const statusCode = Number(responseByStatusCodeEntry[0]);

          const entries = Object.entries(responseByStatusCodeEntry[1].content ?? {});
          let responseByContentTypeEntry;
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

            const resultSpec = operationSpec.responses[responseByStatusCodeEntry[0]].content[contentType];
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
          operationId: operation.operationId,
          queryParams,
          pathParams,
          requestBody:
            operation.requestBody != null ? parseEndpointType(operation.requestBody, operationSpec.requestBody) : null,
          response,
        };
      });
    }
  });

  return result;
}

/**
 * @param {string} pathPattern
 * @returns {string}
 */
function normalizePath(pathPattern) {
  return pathPattern.replaceAll(/\{[^}]+}/g, ':XXX');
}

/**
 * @param {string} contentType
 * @returns {string}
 */
function normalizeContentType(contentType) {
  // todo: warn when contentType has got charset
  return contentType.split(';')[0];
}

/**
 *
 * @param {OpenAPIV3.ReferenceObject|OpenAPIV3.SchemaObject} dereferencedType
 * @param {OpenAPIV3.ReferenceObject|OpenAPIV3.SchemaObject} specificationType
 * @returns {EndpointType}
 */
function parseEndpointType(dereferencedType, specificationType) {
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
