import { HeadersBuilder } from '../../../../lib/request/headers-builder.js';
import type { CcRequestConfigPartial, CcRequestParams } from '../../../../types/request.types.js';
import { CcApiCompositeCommand, CcApiSimpleCommand } from '../../lib/cc-api-command.js';
import type { CcApiComposer } from '../../types/cc-api.types.js';
import { GetCellarObjectUploadUrlCommand } from './get-cellar-object-upload-url-command.js';
import type { UploadCellarObjectCommandInput } from './upload-cellar-object-command.types.js';

const DEFAULT_CONTENT_TYPE = 'application/octet-stream';

/**
 * Uploads an object into a Cellar bucket.
 *
 * The content is sent to a presigned URL pointing at https://api.clever-cloud.com, so that second
 * request leaves the client configuration behind: it reaches the API directly even when the client
 * is set up to go through `api-bridge`, it does not carry the authentication set on the client, and
 * in a browser it is a cross-origin request.
 *
 * @endpoint [POST] /v4/cellar/organisations/:XXX/cellar/:XXX/buckets/:XXX/objects/:XXX/presigned-url
 * @endpoint [POST] /v4/cellar/organisations/:XXX/cellar/:XXX/buckets/:XXX/objects/upload/:XXX
 * @group Cellar
 * @version 4
 */
export class UploadCellarObjectCommand extends CcApiCompositeCommand<UploadCellarObjectCommandInput, undefined> {
  async compose(params: UploadCellarObjectCommandInput, composer: CcApiComposer): Promise<undefined> {
    const { url } = await composer.send(
      new GetCellarObjectUploadUrlCommand({
        ownerId: params.ownerId,
        addonId: params.addonId,
        bucketName: params.bucketName,
        objectKey: params.objectKey,
      }),
    );

    return composer.send(
      new UploadCellarObjectInnerCommand({ url, content: params.content, contentType: getContentType(params) }),
    );
  }
}

function getContentType(params: UploadCellarObjectCommandInput): string {
  if (params.contentType != null && params.contentType.length > 0) {
    return params.contentType;
  }

  // a `Blob` built from raw bytes has an empty `type`, which is no more informative than the default
  if (params.content instanceof Blob && params.content.type.length > 0) {
    return params.content.type;
  }

  return DEFAULT_CONTENT_TYPE;
}

interface UploadCellarObjectInnerCommandInput {
  url: string;
  content: Blob | string;
  contentType: string;
}

/**
 * Sends the object content to the presigned URL obtained from the API.
 *
 * @endpoint [POST] /v4/cellar/organisations/:XXX/cellar/:XXX/buckets/:XXX/objects/upload/:XXX
 * @group Cellar
 */
class UploadCellarObjectInnerCommand extends CcApiSimpleCommand<UploadCellarObjectInnerCommandInput, undefined> {
  // `params.url` is absolute, so the client leaves it untouched and the upload never goes through
  // `api-bridge`. It could not: the presigned URL authenticates with a biscuit, where `api-bridge`
  // expects every `authorization` query param to be a base64 bearer token, prefixed with `"Bearer "`.
  toRequestParams(params: UploadCellarObjectInnerCommandInput): Partial<CcRequestParams> {
    return {
      method: 'POST',
      url: params.url,
      headers: new HeadersBuilder().contentType(params.contentType).build(),
      body: params.content,
    };
  }

  transformCommandOutput(): undefined {
    return undefined;
  }

  // the presigned URL carries its own credentials, and the client would add its own on top of them
  // whenever it is configured on the origin the URL points to
  isAuthEnabled(): boolean {
    return false;
  }

  // the URL points at the API rather than at the page origin, so from a browser the request is cross-origin
  getRequestConfig(): CcRequestConfigPartial {
    return { cors: true };
  }
}
