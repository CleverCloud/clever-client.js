import { OpenAPIV3 } from '@scalar/openapi-types';

export type EndpointsSource = EndpointsSourceRemote | EndpointsSourceLocal;

interface _EndpointsSource {
  id: string;
  target: CcClientTarget;
  pathPrefix: string;
}

export interface EndpointsSourceRemote extends _EndpointsSource {
  type: 'url';
  url: string;
}

export interface EndpointsSourceLocal extends _EndpointsSource {
  type: 'file';
  path: string;
}

export type CcClientTarget = 'api' | 'auth-backend' | 'redis-http';

export interface Endpoint {
  id: string;
  method: string;
  path: string;
  normalizedPath: string;
  operationId: string;
  pathParams: Array<PathParam>;
  queryParams: Array<QueryParam>;
  requestBody?: EndpointType;
  response: EndpointResponse;
}

export interface PathParam {
  name: string;
  required: boolean;
  type: EndpointType;
}

export interface QueryParam {
  name: string;
  required: boolean;
  type: EndpointType;
}

export interface EndpointResponse {
  statusCode: number;
  contentType?: string;
  type?: EndpointType;
}

export type EndpointType = EndpointTypeBroken | EndpointTypeNotBroken;

export interface EndpointTypeBroken {
  type: 'broken';
  ref: string;
}

export interface EndpointTypeNotBroken {
  type: 'not-broken';
  ref?: string;
  schema: OpenAPIV3.SchemaObject;
}

export interface AnalyzedOpenapi {
  versionedOpenapi: VersionedOpenapi;
  previous?: {
    versionedOpenapi: VersionedOpenapi;
    endpoints: Record<string, Endpoint>;
  };
  endpoints: Record<string, Endpoint>;
  diff: OpenapiDiff;
}

export interface VersionedOpenapi {
  source: EndpointsSource;
  date: string;
  openapi: OpenAPIV3.Document;
}

export interface OpenapiDiff {
  hasDiff: boolean;
  addedEndpoints?: Array<Endpoint>;
  deletedEndpoints?: Array<Endpoint>;
  modifiedEndpoints?: Array<Endpoint>;
}

export interface CommandDetail {
  sourceId: string;
  endpointId: string;
  isUsed: boolean;
  namespace: string;
  target: string;
  action: string;
  commandClassName: string;
  comment: string;
}
