import { RequestParams } from "./request.types.js";

export interface Warp10RequestParams extends RequestParams {
  body: string;
  responseHandler: (responseBody: any) => any;
}
