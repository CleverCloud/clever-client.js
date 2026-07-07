import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { CreateCellarBucketCommand } from '../../../../../src/clients/cc-api/commands/cellar/create-cellar-bucket-command.js';
import { DeleteCellarBucketCommand } from '../../../../../src/clients/cc-api/commands/cellar/delete-cellar-bucket-command.js';
import { DeleteCellarObjectCommand } from '../../../../../src/clients/cc-api/commands/cellar/delete-cellar-object-command.js';
import { GetCellarBucketCommand } from '../../../../../src/clients/cc-api/commands/cellar/get-cellar-bucket-command.js';
import { GetCellarCredentialsCommand } from '../../../../../src/clients/cc-api/commands/cellar/get-cellar-credentials-command.js';
import { GetCellarCredentialsPresignedUrlCommand } from '../../../../../src/clients/cc-api/commands/cellar/get-cellar-credentials-presigned-url-command.js';
import { GetCellarInfoCommand } from '../../../../../src/clients/cc-api/commands/cellar/get-cellar-info-command.js';
import { GetCellarObjectCommand } from '../../../../../src/clients/cc-api/commands/cellar/get-cellar-object-command.js';
import { GetCellarObjectDownloadUrlCommand } from '../../../../../src/clients/cc-api/commands/cellar/get-cellar-object-download-url-command.js';
import { GetCellarObjectUploadUrlCommand } from '../../../../../src/clients/cc-api/commands/cellar/get-cellar-object-upload-url-command.js';
import { ListCellarBucketCommand } from '../../../../../src/clients/cc-api/commands/cellar/list-cellar-bucket-command.js';
import { ListCellarObjectCommand } from '../../../../../src/clients/cc-api/commands/cellar/list-cellar-object-command.js';
import { RenewCellarCredentialsCommand } from '../../../../../src/clients/cc-api/commands/cellar/renew-cellar-credentials-command.js';
import { e2eSupport } from '../e2e-support.js';

const CELLAR_PROVIDER_ID = 'cellar-addon';
const CELLAR_PLAN_ID = 'plan_84c85ee3-5fdb-4aca-a727-298ddc14b766';

// bucket names live in a storage namespace shared across the whole Cellar cluster, so suffix with
// a timestamp to avoid clashing with buckets left over from a previous/concurrent test run
function uniqueBucketName(suffix: string): string {
  return `test-cellar-bucket-${suffix}-${Date.now()}`;
}

describe('cellar commands', function () {
  const support = e2eSupport();

  beforeAll(async () => {
    await support.prepare();
  });

  afterEach(async () => {
    await support.deleteAddons();
  });

  afterAll(async () => {
    await support.cleanup();
  });

  it('should get cellar info', async () => {
    const addon = await support.createTestAddon({
      name: 'test-cellar-addon',
      providerId: CELLAR_PROVIDER_ID,
      planId: CELLAR_PLAN_ID,
    });
    const response = await support.client.send(
      new GetCellarInfoCommand({ ownerId: support.organisationId, addonId: addon.realId }),
    );

    expect(response.id).toBe(addon.realId);
    expect(response.addonId).toBe(addon.id);
    expect(response.name).toBe(addon.name);
    expect(response.ownerId).toBe(support.organisationId);
    expect(response.plan).toBeTypeOf('string');
    expect(response.status).toBeTypeOf('string');
    expect(response.creationDate).toBeTypeOf('string');
    expect(response.traffic.inbound).toBeTypeOf('number');
    expect(response.traffic.outbound).toBeTypeOf('number');
    expect(response.buckets.count).toBeTypeOf('number');
    expect(response.buckets.size).toBeTypeOf('number');
    expect(response.buckets.objects).toBeTypeOf('number');
  });

  it('should get cellar credentials', async () => {
    const addon = await support.createTestAddon({
      name: 'test-cellar-addon',
      providerId: CELLAR_PROVIDER_ID,
      planId: CELLAR_PLAN_ID,
    });
    const response = await support.client.send(
      new GetCellarCredentialsCommand({ ownerId: support.organisationId, addonId: addon.realId }),
    );

    expect(response.host).toBeTypeOf('string');
    expect(response.keyId).toBeTypeOf('string');
    expect(response.keySecret).toBeTypeOf('string');
  });

  it('should get cellar credentials presigned url', async () => {
    const addon = await support.createTestAddon({
      name: 'test-cellar-addon',
      providerId: CELLAR_PROVIDER_ID,
      planId: CELLAR_PLAN_ID,
    });
    const response = await support.client.send(
      new GetCellarCredentialsPresignedUrlCommand({ ownerId: support.organisationId, addonId: addon.realId }),
    );

    expect(response.url).toBeTypeOf('string');
    expect(response.url.length).toBeGreaterThan(0);
  });

  it('should renew cellar credentials', async () => {
    const addon = await support.createTestAddon({
      name: 'test-cellar-addon',
      providerId: CELLAR_PROVIDER_ID,
      planId: CELLAR_PLAN_ID,
    });
    const credentials = await support.client.send(
      new GetCellarCredentialsCommand({ ownerId: support.organisationId, addonId: addon.realId }),
    );

    const response = await support.client.send(
      new RenewCellarCredentialsCommand({ ownerId: support.organisationId, addonId: addon.realId }),
    );

    expect(response.host).toBe(credentials.host);
    expect(response.keyId).toBe(credentials.keyId);
    expect(response.keySecret).not.toBe(credentials.keySecret);
  });

  it('should create cellar bucket', async () => {
    const addon = await support.createTestAddon({
      name: 'test-cellar-addon',
      providerId: CELLAR_PROVIDER_ID,
      planId: CELLAR_PLAN_ID,
    });
    const bucketName = uniqueBucketName('create');

    const response = await support.client.send(
      new CreateCellarBucketCommand({ ownerId: support.organisationId, addonId: addon.realId, name: bucketName }),
    );

    expect(response.name).toBe(bucketName);
    expect(response.versioning).toBe('DISABLED');
    expect(response.objectsCount).toBe(0);
    expect(response.sizeInBytes).toBe(0);
    expect(response.createdAt).toBeTypeOf('string');
    expect(response.updatedAt).toBeTypeOf('string');
  });

  it('should create cellar bucket with versioning enabled', async () => {
    const addon = await support.createTestAddon({
      name: 'test-cellar-addon',
      providerId: CELLAR_PROVIDER_ID,
      planId: CELLAR_PLAN_ID,
    });
    const bucketName = uniqueBucketName('versioning');

    const response = await support.client.send(
      new CreateCellarBucketCommand({
        ownerId: support.organisationId,
        addonId: addon.realId,
        name: bucketName,
        versioning: true,
      }),
    );

    expect(response.versioning).toBe('ENABLED');
  });

  it('should get cellar bucket', async () => {
    const addon = await support.createTestAddon({
      name: 'test-cellar-addon',
      providerId: CELLAR_PROVIDER_ID,
      planId: CELLAR_PLAN_ID,
    });
    const bucketName = uniqueBucketName('get');
    await support.client.send(
      new CreateCellarBucketCommand({ ownerId: support.organisationId, addonId: addon.realId, name: bucketName }),
    );

    const response = await support.client.send(
      new GetCellarBucketCommand({ ownerId: support.organisationId, addonId: addon.realId, bucketName }),
    );

    expect(response.name).toBe(bucketName);
    expect(response.versioning).toBe('DISABLED');
    expect(response.objectsCount).toBe(0);
    expect(response.sizeInBytes).toBe(0);
    expect(response.createdAt).toBeTypeOf('string');
    expect(response.updatedAt).toBeTypeOf('string');
  });

  it('should get cellar bucket null', async () => {
    const addon = await support.createTestAddon({
      name: 'test-cellar-addon',
      providerId: CELLAR_PROVIDER_ID,
      planId: CELLAR_PLAN_ID,
    });

    const response = await support.client.send(
      new GetCellarBucketCommand({
        ownerId: support.organisationId,
        addonId: addon.realId,
        bucketName: 'non-existing-bucket',
      }),
    );

    expect(response).toBeNull();
  });

  it('should list cellar buckets', async () => {
    const addon = await support.createTestAddon({
      name: 'test-cellar-addon',
      providerId: CELLAR_PROVIDER_ID,
      planId: CELLAR_PLAN_ID,
    });
    const bucketName = uniqueBucketName('list');
    await support.client.send(
      new CreateCellarBucketCommand({ ownerId: support.organisationId, addonId: addon.realId, name: bucketName }),
    );

    const response = await support.client.send(
      new ListCellarBucketCommand({ ownerId: support.organisationId, addonId: addon.realId }),
    );

    expect(response.total).toBe(response.buckets.length);
    const bucket = response.buckets.find((b) => b.name === bucketName);
    expect(bucket).toBeDefined();
    expect(bucket!.objectsCount).toBe(0);
    expect(bucket!.sizeInBytes).toBe(0);
    expect(bucket!.createdAt).toBeTypeOf('string');
    expect(bucket!.updatedAt).toBeTypeOf('string');
  });

  it('should delete cellar bucket', async () => {
    const addon = await support.createTestAddon({
      name: 'test-cellar-addon',
      providerId: CELLAR_PROVIDER_ID,
      planId: CELLAR_PLAN_ID,
    });
    const bucketName = uniqueBucketName('delete');
    await support.client.send(
      new CreateCellarBucketCommand({ ownerId: support.organisationId, addonId: addon.realId, name: bucketName }),
    );

    const response = await support.client.send(
      new DeleteCellarBucketCommand({ ownerId: support.organisationId, addonId: addon.realId, bucketName }),
    );

    expect(response).toBeUndefined();

    const getResponse = await support.client.send(
      new GetCellarBucketCommand({ ownerId: support.organisationId, addonId: addon.realId, bucketName }),
    );
    expect(getResponse).toBeNull();
  });

  it('should list cellar bucket objects', async () => {
    const addon = await support.createTestAddon({
      name: 'test-cellar-addon',
      providerId: CELLAR_PROVIDER_ID,
      planId: CELLAR_PLAN_ID,
    });
    const bucketName = uniqueBucketName('list-objects');
    await support.client.send(
      new CreateCellarBucketCommand({ ownerId: support.organisationId, addonId: addon.realId, name: bucketName }),
    );

    const response = await support.client.send(
      new ListCellarObjectCommand({ ownerId: support.organisationId, addonId: addon.realId, bucketName }),
    );

    expect(response.content).toEqual([]);
    expect(response.directories).toEqual([]);
    expect(response.cursor).toBeNull();
  });

  it('should get cellar bucket object null', async () => {
    const addon = await support.createTestAddon({
      name: 'test-cellar-addon',
      providerId: CELLAR_PROVIDER_ID,
      planId: CELLAR_PLAN_ID,
    });
    const bucketName = uniqueBucketName('get-object-null');
    await support.client.send(
      new CreateCellarBucketCommand({ ownerId: support.organisationId, addonId: addon.realId, name: bucketName }),
    );

    const response = await support.client.send(
      new GetCellarObjectCommand({
        ownerId: support.organisationId,
        addonId: addon.realId,
        bucketName,
        objectKey: 'non-existing-object.txt',
      }),
    );

    expect(response).toBeNull();
  });

  it('should get cellar bucket object upload url', async () => {
    const addon = await support.createTestAddon({
      name: 'test-cellar-addon',
      providerId: CELLAR_PROVIDER_ID,
      planId: CELLAR_PLAN_ID,
    });
    const bucketName = uniqueBucketName('upload-url');
    await support.client.send(
      new CreateCellarBucketCommand({ ownerId: support.organisationId, addonId: addon.realId, name: bucketName }),
    );

    const response = await support.client.send(
      new GetCellarObjectUploadUrlCommand({
        ownerId: support.organisationId,
        addonId: addon.realId,
        bucketName,
        objectKey: 'test-object.txt',
      }),
    );

    expect(response.url).toBeTypeOf('string');
    expect(response.url.length).toBeGreaterThan(0);
  });

  // uploading the object body is out of scope for this client (see GetCellarObjectUploadUrlCommand doc), but the
  // e2e test does it anyway with a raw fetch (mirroring cc-cellar-explorer.client.js) so it can exercise the get /
  // download-url / delete commands against a real object instead of only their 404 paths
  it('should get, get a download url for, and delete a cellar bucket object', async () => {
    const addon = await support.createTestAddon({
      name: 'test-cellar-addon',
      providerId: CELLAR_PROVIDER_ID,
      planId: CELLAR_PLAN_ID,
    });
    const bucketName = uniqueBucketName('object-lifecycle');
    const objectKey = 'test-object.txt';
    await support.client.send(
      new CreateCellarBucketCommand({ ownerId: support.organisationId, addonId: addon.realId, name: bucketName }),
    );
    const uploadUrl = await support.client.send(
      new GetCellarObjectUploadUrlCommand({
        ownerId: support.organisationId,
        addonId: addon.realId,
        bucketName,
        objectKey,
      }),
    );
    const uploadResponse = await fetch(uploadUrl.url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: 'hello cellar',
    });
    expect(uploadResponse.ok).toBe(true);

    const object = await support.client.send(
      new GetCellarObjectCommand({ ownerId: support.organisationId, addonId: addon.realId, bucketName, objectKey }),
    );

    expect(object.key).toBe(objectKey);
    expect(object.name).toBe(objectKey);
    expect(object.contentLength).toBeGreaterThan(0);
    expect(object.eTag).toBeTypeOf('string');
    expect(object.updatedAt).toBeTypeOf('string');
    expect(object.tags).toEqual([]);
    expect(object.acl).toBeInstanceOf(Array);
    expect(object.metadata).toEqual({});

    const downloadUrl = await support.client.send(
      new GetCellarObjectDownloadUrlCommand({
        ownerId: support.organisationId,
        addonId: addon.realId,
        bucketName,
        objectKey,
      }),
    );

    expect(downloadUrl.url).toBeTypeOf('string');
    expect(downloadUrl.expiresAt).toBeTypeOf('string');

    const deleteResponse = await support.client.send(
      new DeleteCellarObjectCommand({ ownerId: support.organisationId, addonId: addon.realId, bucketName, objectKey }),
    );

    expect(deleteResponse).toBeUndefined();

    const afterDelete = await support.client.send(
      new GetCellarObjectCommand({ ownerId: support.organisationId, addonId: addon.realId, bucketName, objectKey }),
    );

    expect(afterDelete).toBeNull();
  });
});
