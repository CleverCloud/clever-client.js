import { expect } from 'chai';
import { DisableGrafanaCommand } from '../../../../../src/clients/cc-api/commands/grafana/disable-grafana-command.js';
import { EnableGrafanaCommand } from '../../../../../src/clients/cc-api/commands/grafana/enable-grafana-command.js';
import { GetGrafanaCommand } from '../../../../../src/clients/cc-api/commands/grafana/get-grafana-command.js';
import { ResetGrafanaCommand } from '../../../../../src/clients/cc-api/commands/grafana/reset-grafana-command.js';
import { e2eSupport } from '../e2e-support.js';

describe('grafana commands', function () {
  const support = e2eSupport();

  before(async () => {
    await support.prepare();
  });

  after(async () => {
    await support.cleanup();
  });

  it('should disable grafana', async () => {
    const grafana = await support.client.send(new GetGrafanaCommand({ ownerId: support.organisationId }));
    if (grafana == null) {
      await support.client.send(new EnableGrafanaCommand({ ownerId: support.organisationId }));
    }

    const response = await support.client.send(new DisableGrafanaCommand({ ownerId: support.organisationId }));

    expect(response).to.be.null;
  });

  it('should enable grafana', async () => {
    const grafana = await support.client.send(new GetGrafanaCommand({ ownerId: support.organisationId }));
    if (grafana != null) {
      await support.client.send(new DisableGrafanaCommand({ ownerId: support.organisationId }));
    }

    const response = await support.client.send(new EnableGrafanaCommand({ ownerId: support.organisationId }));

    expect(response.id).to.be.a('number');
  });

  it('should get grafana', async () => {
    const grafana = await support.client.send(new GetGrafanaCommand({ ownerId: support.organisationId }));
    if (grafana == null) {
      await support.client.send(new EnableGrafanaCommand({ ownerId: support.organisationId }));
    }

    const response = await support.client.send(new GetGrafanaCommand({ ownerId: support.organisationId }));

    expect(response.id).to.be.a('number');
  });

  it('should reset grafana', async () => {
    const grafana = await support.client.send(new GetGrafanaCommand({ ownerId: support.organisationId }));
    if (grafana == null) {
      await support.client.send(new EnableGrafanaCommand({ ownerId: support.organisationId }));
    }

    const response = await support.client.send(new ResetGrafanaCommand({ ownerId: support.organisationId }));

    expect(response).to.be.null;
  });
});
