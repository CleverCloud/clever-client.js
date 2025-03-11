import { expect } from 'chai';
import { ApplicationLogStream } from '../esm/streams/application-logs.js';
import { HttpError, NetworkError, ServerError } from '../esm/streams/clever-cloud-sse.js';
import { createStub } from './lib/stub.js';
import { TestSseServer } from './lib/test-sse-server.js';
import { clearTimers, patchTimers, sleep, unpatchTimers } from './lib/timers.js';

const DEBUG_LEVEL = 2;

const SERVER_PORT = 8080;
const ASYNC_TEST_TIMEOUT_MS = 10_000;

describe('ApplicationLogStream', () => {
  before(patchTimers);
  after(unpatchTimers);

  let sseServer;
  let appLogs;

  // Prepare a test SSE server instance for each test
  beforeEach(() => {
    sseServer?.stop();
    sseServer = new TestSseServer(SERVER_PORT);
    sseServer.start();
  });

  // Cleanup server and client
  afterEach(() => {
    appLogs?.close();
    sseServer?.stop();
    // This one may trigger an error if some timeouts or intervals are not cleared
    clearTimers();
  });

  describe('getUrl()', () => {
    it('Without query params', () => {
      const appsLogs = new ApplicationLogStream({
        apiHost: 'http://localhost:' + SERVER_PORT,
        tokens: null,
        ownerId: 'ownerId',
        appId: 'appId',
      });
      const url = appsLogs.getUrl();
      expect(url).to.equal('http://localhost:8080/v4/logs/organisations/ownerId/applications/appId/logs');
    });

    it('With since and until dates', () => {
      const appsLogs = new ApplicationLogStream({
        apiHost: 'http://localhost:' + SERVER_PORT,
        tokens: null,
        ownerId: 'ownerId',
        appId: 'appId',
        since: new Date('2023-12-01T00:00:00.000Z'),
        until: new Date('2023-12-01T01:00:00.000Z'),
      });
      const url = appsLogs.getUrl();
      expect(url).to.equal(
        'http://localhost:8080/v4/logs/organisations/ownerId/applications/appId/logs?since=2023-12-01T00%3A00%3A00.000Z&until=2023-12-01T01%3A00%3A00.000Z',
      );
    });

    it('With instance IDs', () => {
      const appsLogs = new ApplicationLogStream({
        apiHost: 'http://localhost:' + SERVER_PORT,
        tokens: null,
        ownerId: 'ownerId',
        appId: 'appId',
        instanceId: ['aaa', 'bbb', 'ccc'],
      });
      const url = appsLogs.getUrl();
      expect(url).to.equal(
        'http://localhost:8080/v4/logs/organisations/ownerId/applications/appId/logs?instanceId=aaa&instanceId=bbb&instanceId=ccc',
      );
    });

    it('With fields', () => {
      const appsLogs = new ApplicationLogStream({
        apiHost: 'http://localhost:' + SERVER_PORT,
        tokens: null,
        ownerId: 'ownerId',
        appId: 'appId',
        fields: ['aaa', 'bbb', 'ccc'],
      });
      const url = appsLogs.getUrl();
      expect(url).to.equal(
        'http://localhost:8080/v4/logs/organisations/ownerId/applications/appId/logs?fields=aaa&fields=bbb&fields=ccc',
      );
    });

    it('With undefined and null query params', () => {
      const appsLogs = new ApplicationLogStream({
        apiHost: 'http://localhost:' + SERVER_PORT,
        tokens: null,
        ownerId: 'ownerId',
        appId: 'appId',
        deploymentId: undefined,
        filter: null,
      });
      const url = appsLogs.getUrl();
      expect(url).to.equal('http://localhost:8080/v4/logs/organisations/ownerId/applications/appId/logs');
    });
  });

  describe('no retry', () => {
    let callbacks;

    // Prepare an ApplicationLogStream instance with stubbed callbacks for each test
    beforeEach(() => {
      const _ = createApplicationLogStream();
      appLogs = _.appLogs;
      callbacks = _.callbacks;
    });

    it('Send server response with 200 and valid content type should trigger onOpen', async () => {
      await sseServer.acceptRequest();
      await expectCounts(callbacks, { onOpen: 1, onError: 0, onLog: 0, onSuccess: 0, onFailure: 0 });
    });

    it('Send 3 logs should trigger onLog 3 times', async () => {
      await sseServer.acceptRequest();
      await sseServer.sendLogs(['000000', '000001', '000002'], 1000);

      await expectCounts(callbacks, { onOpen: 1, onError: 0, onLog: 3, onSuccess: 0, onFailure: 0 });
      expect(callbacks.onLog.getCall(0).args).to.deep.equal([{ id: '000000', message: 'MSG 000000' }]);
      expect(callbacks.onLog.getCall(1).args).to.deep.equal([{ id: '000001', message: 'MSG 000001' }]);
      expect(callbacks.onLog.getCall(2).args).to.deep.equal([{ id: '000002', message: 'MSG 000002' }]);
    });

    it('Send logs and heartbeats should not timeout', async () => {
      await sseServer.acceptRequest();
      await sseServer.sendHeartbeats(5, 1000);
      await sseServer.sendLogs(['000000', '000001', '000002'], 1000);
      await sseServer.sendHeartbeats(5, 1000);

      await expectCounts(callbacks, { onOpen: 1, onError: 0, onLog: 3, onSuccess: 0, onFailure: 0 });
    });

    it('Close log stream should trigger onSuccess', async () => {
      await sseServer.acceptRequest();
      await sseServer.sendHeartbeats(2, 1000);

      appLogs.close('the reason');
      await expectCounts(callbacks, { onOpen: 1, onError: 0, onLog: 0, onSuccess: 1, onFailure: 0 });
      expect(callbacks.onSuccess.getCall(0).args[0]).to.deep.equal({ reason: 'the reason' });
    });

    it('Pause log stream should not timeout', async () => {
      await sseServer.acceptRequest();
      await sseServer.sendLogs(['000000', '000001', '000002'], 1000);

      // Explicitly wait for logs before pause
      await expectCounts(callbacks, { onOpen: 1, onError: 0, onLog: 3, onSuccess: 0, onFailure: 0 });

      appLogs.pause();
      await sleep(5_000);

      await expectCounts(callbacks, { onOpen: 1, onError: 0, onLog: 3, onSuccess: 0, onFailure: 0 });
    });

    it('Pause log stream, wait and resume should trigger onOpen again, with last event ID', async () => {
      await sseServer.acceptRequest();
      await sseServer.sendLogs(['000000', '000001', '000002'], 1000);

      // Explicitly wait for logs before pause
      await expectCounts(callbacks, { onOpen: 1, onError: 0, onLog: 3, onSuccess: 0, onFailure: 0 });

      appLogs.pause();
      await sleep(5_000);
      appLogs.resume();
      await sseServer.acceptRequest();
      await sseServer.sendLogs(['000003', '000004', '000005'], 1000);

      await expectCounts(callbacks, { onOpen: 2, onError: 0, onLog: 6, onSuccess: 0, onFailure: 0 });
      const lastEventId = await sseServer.getRequestHeader('last-event-id');
      expect(lastEventId).to.equal('000002');
      expect(callbacks.onLog.getCall(3).args).to.deep.equal([{ id: '000003', message: 'MSG 000003' }]);
      expect(callbacks.onLog.getCall(4).args).to.deep.equal([{ id: '000004', message: 'MSG 000004' }]);
      expect(callbacks.onLog.getCall(5).args).to.deep.equal([{ id: '000005', message: 'MSG 000005' }]);
    });

    it('Pause log stream, wait and resume should trigger onOpen again, with last event ID and update limit query param', async () => {
      // Reset setup to specify a limit
      appLogs.close();
      const _ = createApplicationLogStream({
        limit: 10,
      });
      appLogs = _.appLogs;
      callbacks = _.callbacks;

      await sseServer.acceptRequest();
      await sseServer.sendLogs(['000000', '000001', '000002'], 1000);

      // Explicitly wait for logs before pause
      await expectCounts(callbacks, { onOpen: 1, onError: 0, onLog: 3, onSuccess: 0, onFailure: 0 });

      appLogs.pause();
      await sleep(5_000);
      appLogs.resume();
      await sseServer.acceptRequest();

      await expectCounts(callbacks, { onOpen: 2, onError: 0, onLog: 3, onSuccess: 0, onFailure: 0 });
      const lastEventId = await sseServer.getRequestHeader('last-event-id');
      expect(lastEventId).to.equal('000002');
      const limit = await sseServer.getQueryParam('limit');
      expect(limit).to.equal('7');
    });

    it('Close server response should trigger onSuccess if END_OF_STREAM(UNTIL_REACHED) was sent and received', async () => {
      await sseServer.acceptRequest();
      await sseServer.sendLogs(['000000', '000001', '000002'], 1000);
      await sseServer.sendEvent({ event: 'END_OF_STREAM', data: { endedBy: 'UNTIL_REACHED' } });
      await sseServer.closeResponse();

      await expectCounts(callbacks, { onOpen: 1, onError: 0, onLog: 3, onSuccess: 1, onFailure: 0 });
      expect(callbacks.onSuccess.getCall(0).args).to.deep.equal([{ reason: { endedBy: 'UNTIL_REACHED' } }]);
    });

    it('Close server response should trigger onFailure if END_OF_STREAM(UNTIL_REACHED) was NOT sent or received', async () => {
      await sseServer.acceptRequest();
      await sseServer.sendLogs(['000000', '000001', '000002'], 1000);
      await sseServer.closeResponse();

      await expectCounts(callbacks, { onOpen: 1, onError: 0, onLog: 3, onSuccess: 0, onFailure: 1 });
      // TODO should be ServerError
      expectError(callbacks.onFailure.getCall(0).args[0], ServerError);
    });

    // TODO: where is the accept and no logs?
    it('No logs or heartbeats should trigger onFailure', async () => {
      await sseServer.acceptRequest();
      await sseServer.sendLogs(['000000', '000001', '000002'], 1000);
      await sleep(5_000);

      await expectCounts(callbacks, { onOpen: 1, onError: 0, onLog: 3, onSuccess: 0, onFailure: 1 });
      expectError(callbacks.onFailure.getCall(0).args[0], NetworkError);
    });

    // TODO start client after server stop
    it('Stop server directly should trigger onFailure', async () => {
      await sseServer.stop();

      await expectCounts(callbacks, { onOpen: 0, onError: 0, onLog: 0, onSuccess: 0, onFailure: 1 });
      expectError(callbacks.onFailure.getCall(0).args[0], NetworkError);
    });

    it('Send logs and stop server should trigger onFailure', async () => {
      await sseServer.acceptRequest();
      await sseServer.sendLogs(['000000', '000001', '000002'], 1000);

      // Explicitly wait for logs before stop
      await expectCounts(callbacks, { onOpen: 1, onError: 0, onLog: 3, onSuccess: 0, onFailure: 0 });

      await sseServer.stop();

      await expectCounts(callbacks, { onOpen: 1, onError: 0, onLog: 3, onSuccess: 0, onFailure: 1 });
      expectError(callbacks.onFailure.getCall(0).args[0], NetworkError);
    });

    it('Destroy server response should trigger onFailure', async () => {
      await sseServer.acceptRequest();
      await sseServer.sendLogs(['000000', '000001', '000002'], 1000);

      // Explicitly wait for logs before detroy response
      await expectCounts(callbacks, { onOpen: 1, onError: 0, onLog: 3, onSuccess: 0, onFailure: 0 });

      await sseServer.destroyResponse();

      await expectCounts(callbacks, { onOpen: 1, onError: 0, onLog: 3, onSuccess: 0, onFailure: 1 });
      expectError(callbacks.onFailure.getCall(0).args[0], NetworkError);
    });

    it('Send server response with 200 and invalid content type should trigger onFailure', async () => {
      await sseServer.acceptRequestWithBadContentType();
      await expectCounts(callbacks, { onOpen: 0, onError: 0, onLog: 0, onSuccess: 0, onFailure: 1 });
      expectError(callbacks.onFailure.getCall(0).args[0], ServerError);
    });

    it('Send server response with 400 should trigger onFailure', async () => {
      await sseServer.acceptRequestWith400();
      await expectCounts(callbacks, { onOpen: 0, onError: 0, onLog: 0, onSuccess: 0, onFailure: 1 });
      expectError(callbacks.onFailure.getCall(0).args[0], HttpError, { status: 400 });
    });

    it('Send server response with 401 should trigger onFailure', async () => {
      await sseServer.acceptRequestWith401();
      await expectCounts(callbacks, { onOpen: 0, onError: 0, onLog: 0, onSuccess: 0, onFailure: 1 });
      expectError(callbacks.onFailure.getCall(0).args[0], HttpError, { status: 401 });
    });

    it('Send server response with 404 should trigger onFailure', async () => {
      await sseServer.acceptRequestWith404();
      await expectCounts(callbacks, { onOpen: 0, onError: 0, onLog: 0, onSuccess: 0, onFailure: 1 });
      expectError(callbacks.onFailure.getCall(0).args[0], HttpError, { status: 404 });
    });

    it('Send server response with 500 should trigger onFailure', async () => {
      await sseServer.acceptRequestWith500();
      await expectCounts(callbacks, { onOpen: 0, onError: 0, onLog: 0, onSuccess: 0, onFailure: 1 });
      expectError(callbacks.onFailure.getCall(0).args[0], HttpError, { status: 500 });
    });
  });

  describe('2 retry max', () => {
    let callbacks;

    // Prepare an ApplicationLogStream instance with stubbed callbacks and an auto retry (max 2) for each test
    beforeEach(() => {
      const _ = createApplicationLogStream({
        retryConfiguration: {
          enabled: true,
          maxRetryCount: 2,
        },
      });
      appLogs = _.appLogs;
      callbacks = _.callbacks;
    });

    it('Pause log stream should not retry', async () => {
      await sseServer.acceptRequest();
      await sseServer.sendLogs(['000000', '000001', '000002'], 1000);

      // Explicitly wait for logs before pause
      await expectCounts(callbacks, { onOpen: 1, onError: 0, onLog: 3, onSuccess: 0, onFailure: 0 });

      appLogs.pause();
      await sleep(10_000);

      await expectCounts(callbacks, { onOpen: 1, onError: 0, onLog: 3, onSuccess: 0, onFailure: 0 });
    });

    it('Close server response should trigger onError and retry if END_OF_STREAM(UNTIL_REACHED) was NOT sent or received', async () => {
      await sseServer.acceptRequest();
      await sseServer.sendLogs(['000000', '000001', '000002'], 1000);
      await sseServer.closeResponse();

      await expectCounts(callbacks, { onOpen: 1, onError: 1, onLog: 3, onSuccess: 0, onFailure: 0 });
      // TODO SERVER ERROR
      expectError(callbacks.onError.getCall(0).args[0].error, ServerError);

      await sseServer.acceptRequest();
      await expectCounts(callbacks, { onOpen: 2, onError: 1, onLog: 3, onSuccess: 0, onFailure: 0 });
    });

    it('No logs or heartbeats should trigger onError and retry', async () => {
      await sseServer.acceptRequest();
      await expectCounts(callbacks, { onOpen: 1, onError: 1, onLog: 0, onSuccess: 0, onFailure: 0 });
      expect(callbacks.onError.getCall(0).args[0].error).to.be.instanceof(NetworkError);

      await sseServer.acceptRequest();
      await expectCounts(callbacks, { onOpen: 2, onError: 1, onLog: 0, onSuccess: 0, onFailure: 0 });
    });

    it('Stop server directly should trigger onError and retry', async () => {
      await sseServer.stop();

      // Reset setup to start the client after a server stop
      appLogs.close();
      const _ = createApplicationLogStream({
        retryConfiguration: {
          enabled: true,
          maxRetryCount: 2,
        },
        limit: 20,
      });
      appLogs = _.appLogs;
      callbacks = _.callbacks;

      await expectCounts(callbacks, { onOpen: 0, onError: 1, onLog: 0, onSuccess: 0, onFailure: 0 });
      expect(callbacks.onError.getCall(0).args[0].error).to.be.instanceof(NetworkError);

      await sseServer.start();
      await sseServer.acceptRequest();
      await expectCounts(callbacks, { onOpen: 1, onError: 1, onLog: 0, onSuccess: 0, onFailure: 0 });
    });

    it('Destroy server response should trigger onError and retry', async () => {
      await sseServer.destroyResponse();
      await expectCounts(callbacks, { onOpen: 0, onError: 1, onLog: 0, onSuccess: 0, onFailure: 0 });
      expect(callbacks.onError.getCall(0).args[0].error).to.be.instanceof(NetworkError);

      await sseServer.acceptRequest();
      await expectCounts(callbacks, { onOpen: 1, onError: 1, onLog: 0, onSuccess: 0, onFailure: 0 });
    });

    it('Send server response with 200 and invalid content type should trigger onError and retry', async () => {
      await sseServer.acceptRequestWithBadContentType();
      await expectCounts(callbacks, { onOpen: 0, onError: 1, onLog: 0, onSuccess: 0, onFailure: 0 });
      expectError(callbacks.onError.getCall(0).args[0].error, ServerError);

      await sseServer.acceptRequest();
      await expectCounts(callbacks, { onOpen: 1, onError: 1, onLog: 0, onSuccess: 0, onFailure: 0 });
    });

    it('Send server response with 400 should trigger onFailure', async () => {
      await sseServer.acceptRequestWith400();
      await expectCounts(callbacks, { onOpen: 0, onError: 0, onLog: 0, onSuccess: 0, onFailure: 1 });
      expectError(callbacks.onFailure.getCall(0).args[0], HttpError, { status: 400 });
    });

    it('Send server response with 401 should trigger onFailure', async () => {
      await sseServer.acceptRequestWith401();
      await expectCounts(callbacks, { onOpen: 0, onError: 0, onLog: 0, onSuccess: 0, onFailure: 1 });
      expectError(callbacks.onFailure.getCall(0).args[0], HttpError, { status: 401 });
    });

    it('Send server response with 404 should trigger onFailure', async () => {
      await sseServer.acceptRequestWith404();
      await expectCounts(callbacks, { onOpen: 0, onError: 0, onLog: 0, onSuccess: 0, onFailure: 1 });
      expectError(callbacks.onFailure.getCall(0).args[0], HttpError, { status: 404 });
    });

    it('Send server response with 500 should trigger onError and retry', async () => {
      await sseServer.acceptRequestWith500();
      await expectCounts(callbacks, { onOpen: 0, onError: 1, onLog: 0, onSuccess: 0, onFailure: 0 });
      expectError(callbacks.onError.getCall(0).args[0].error, HttpError, { status: 500 });

      await sseServer.acceptRequest();
      await expectCounts(callbacks, { onOpen: 1, onError: 1, onLog: 0, onSuccess: 0, onFailure: 0 });
    });

    it('Multiple "error + successful retry" should trigger onError and onOpen with last event ID and and update limit query param, the max retry should not be reached', async () => {
      // Reset setup to specify a limit
      appLogs.close();
      const _ = createApplicationLogStream({
        retryConfiguration: {
          enabled: true,
          maxRetryCount: 2,
        },
        limit: 20,
      });
      appLogs = _.appLogs;
      callbacks = _.callbacks;

      await sseServer.acceptRequest();
      await sseServer.sendLogs(['000000', '000001', '000002'], 100);
      await expectCounts(callbacks, { onOpen: 1, onError: 0, onLog: 3, onSuccess: 0, onFailure: 0 });

      // Wait for 1st error timeout error
      await expectCounts(callbacks, { onOpen: 1, onError: 1, onLog: 3, onSuccess: 0, onFailure: 0 });
      expect(callbacks.onError.getCall(0).args[0].error).to.be.instanceof(NetworkError);

      // Wait for 1st successful retry with onOpen, retry count is reset
      await sseServer.acceptRequest();
      await sseServer.sendLogs(['000003', '000004', '000005'], 100);
      await expectCounts(callbacks, { onOpen: 2, onError: 1, onLog: 6, onSuccess: 0, onFailure: 0 });
      {
        const lastEventId = await sseServer.getRequestHeader('last-event-id');
        expect(lastEventId).to.equal('000002');
        const limit = await sseServer.getQueryParam('limit');
        expect(limit).to.equal('17');
      }

      // Wait for 2nd error timeout error
      await expectCounts(callbacks, { onOpen: 2, onError: 2, onLog: 6, onSuccess: 0, onFailure: 0 });
      expect(callbacks.onError.getCall(1).args[0].error).to.be.instanceof(NetworkError);

      // Wait for 2nd successful retry with onOpen, retry count is reset
      await sseServer.acceptRequest();
      await sseServer.sendLogs(['000006', '000007', '000008'], 100);
      await expectCounts(callbacks, { onOpen: 3, onError: 2, onLog: 9, onSuccess: 0, onFailure: 0 });
      {
        const lastEventId = await sseServer.getRequestHeader('last-event-id');
        expect(lastEventId).to.equal('000005');
        const limit = await sseServer.getQueryParam('limit');
        expect(limit).to.equal('14');
      }

      // Wait for 3rd error timeout error
      await expectCounts(callbacks, { onOpen: 3, onError: 3, onLog: 9, onSuccess: 0, onFailure: 0 });
      expect(callbacks.onError.getCall(2).args[0].error).to.be.instanceof(NetworkError);

      // Wait for 3rd successful retry with onOpen, retry count is reset
      await sseServer.acceptRequest();
      await sseServer.sendLogs(['000009', '000010', '000011'], 100);
      await expectCounts(callbacks, { onOpen: 4, onError: 3, onLog: 12, onSuccess: 0, onFailure: 0 });
      {
        const lastEventId = await sseServer.getRequestHeader('last-event-id');
        expect(lastEventId).to.equal('000008');
        const limit = await sseServer.getQueryParam('limit');
        expect(limit).to.equal('11');
      }
    });

    it('Multiple "error + successful retry" should trigger onError and onOpen with last event ID, the max retry should not be reached', async () => {
      await sseServer.acceptRequest();
      await sseServer.sendLogs(['000000', '000001', '000002'], 100);
      await expectCounts(callbacks, { onOpen: 1, onError: 0, onLog: 3, onSuccess: 0, onFailure: 0 });

      // Wait for 1st error timeout error
      await expectCounts(callbacks, { onOpen: 1, onError: 1, onLog: 3, onSuccess: 0, onFailure: 0 });
      expect(callbacks.onError.getCall(0).args[0].error).to.be.instanceof(NetworkError);

      // Wait for 1st successful retry with onOpen, retry count is reset
      await sseServer.acceptRequest();
      await sseServer.sendLogs(['000003', '000004', '000005'], 100);
      await expectCounts(callbacks, { onOpen: 2, onError: 1, onLog: 6, onSuccess: 0, onFailure: 0 });
      {
        const lastEventId = await sseServer.getRequestHeader('last-event-id');
        expect(lastEventId).to.equal('000002');
      }

      // Wait for 2nd error timeout error
      await expectCounts(callbacks, { onOpen: 2, onError: 2, onLog: 6, onSuccess: 0, onFailure: 0 });
      expect(callbacks.onError.getCall(1).args[0].error).to.be.instanceof(NetworkError);

      // Wait for 2nd successful retry with onOpen, retry count is reset
      await sseServer.acceptRequest();
      await sseServer.sendLogs(['000006', '000007', '000008'], 100);
      await expectCounts(callbacks, { onOpen: 3, onError: 2, onLog: 9, onSuccess: 0, onFailure: 0 });
      {
        const lastEventId = await sseServer.getRequestHeader('last-event-id');
        expect(lastEventId).to.equal('000005');
      }

      // Wait for 3rd error timeout error
      await expectCounts(callbacks, { onOpen: 3, onError: 3, onLog: 9, onSuccess: 0, onFailure: 0 });
      expect(callbacks.onError.getCall(2).args[0].error).to.be.instanceof(NetworkError);

      // Wait for 3rd successful retry with onOpen, retry count is reset
      await sseServer.acceptRequest();
      await sseServer.sendLogs(['000009', '000010', '000011'], 100);
      await expectCounts(callbacks, { onOpen: 4, onError: 3, onLog: 12, onSuccess: 0, onFailure: 0 });
      {
        const lastEventId = await sseServer.getRequestHeader('last-event-id');
        expect(lastEventId).to.equal('000008');
      }
    });

    it('Multiple "error + failed retry" should trigger onError, reach the max retry and trigger onFailure', async () => {
      // Wait for 1st error timeout error
      await expectCounts(callbacks, { onOpen: 0, onError: 1, onLog: 0, onSuccess: 0, onFailure: 0 });
      expect(callbacks.onError.getCall(0).args[0].error).to.be.instanceof(NetworkError);

      // Wait for 2nd error timeout error
      await expectCounts(callbacks, { onOpen: 0, onError: 2, onLog: 0, onSuccess: 0, onFailure: 0 });
      expect(callbacks.onError.getCall(1).args[0].error).to.be.instanceof(NetworkError);

      // Wait for 3rd error timeout error
      await expectCounts(callbacks, { onOpen: 0, onError: 2, onLog: 0, onSuccess: 0, onFailure: 1 });
      expectError(callbacks.onFailure.getCall(0).args[0], NetworkError);
    });
  });
});

// Set up a ApplicationLogStream with a series of stubbed callbacks
function createApplicationLogStream(options = {}) {
  const appLogs = new ApplicationLogStream({
    apiHost: 'http://localhost:' + SERVER_PORT,
    tokens: null,
    ownerId: 'ownerId',
    appId: 'appId',
    ...options,
  });

  const onOpen = createStub(() => {
    DEBUG_LEVEL > 0 && console.log('onOpen');
  });
  const onError = createStub((ev) => {
    DEBUG_LEVEL > 0 && console.error(`onError (${ev.error.constructor.name}) ${ev.error.message}`);
    DEBUG_LEVEL > 1 && console.error(ev.error);
  });
  const onLog = createStub((log) => {
    DEBUG_LEVEL > 0 && console.log('onLog', log);
  });
  const onSuccess = createStub((reason) => {
    DEBUG_LEVEL > 0 && console.log('onSuccess', reason);
  });
  const onFailure = createStub((e) => {
    DEBUG_LEVEL > 0 && console.error(`onFailure (${e.constructor.name}) ${e.message}`);
    DEBUG_LEVEL > 1 && console.error(e);
  });

  appLogs.on('open', onOpen.handler).on('error', onError.handler).onLog(onLog.handler);

  appLogs.start().then(onSuccess.handler).catch(onFailure.handler);

  return {
    appLogs,
    callbacks: {
      onOpen,
      onError,
      onLog,
      onSuccess,
      onFailure,
    },
  };
}

// Give it an object of named stubbed callbacks and wait for the given expected count of calls
// Fails if timeoutLimit it reached
async function expectCounts(callbacks, counts) {
  const limit = new Date().getTime() + ASYNC_TEST_TIMEOUT_MS;

  let shouldContinue = true;

  while (shouldContinue) {
    const now = new Date().getTime();
    if (now > limit) {
      const countDetails = Object.fromEntries(Object.entries(callbacks).map(([name, cb]) => [name, cb.callCount]));
      throw new Error('Timeout error on "expectCounts": ' + JSON.stringify(countDetails));
    }

    shouldContinue = Object.entries(counts).some(([name, expectedCount]) => {
      if (callbacks[name].callCount > expectedCount) {
        throw new Error(`Callback "${name}" was called ${callbacks[name].callCount} times instead of ${expectedCount}`);
      }
      return callbacks[name].callCount !== expectedCount;
    });

    if (shouldContinue) {
      await sleep(20);
    }
  }
}

function expectError(error, theClass, properties = {}) {
  expect(error).to.be.instanceof(theClass);
  for (const [name, value] of Object.entries(properties)) {
    expect(error[name]).to.equal(value);
  }
}
