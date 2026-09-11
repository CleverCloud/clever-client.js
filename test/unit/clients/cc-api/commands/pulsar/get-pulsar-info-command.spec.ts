import { describe, expect, it } from 'vitest';
import { GetPulsarInfoCommand } from '../../../../../../src/clients/cc-api/commands/pulsar/get-pulsar-info-command.js';

describe('GetPulsarInfoCommand', () => {
  // neither route takes an owner, and resolving one costs an organisation summary fetch
  it('should only resolve the add-on id', () => {
    const command = new GetPulsarInfoCommand({ addonId: 'addon_x' });

    expect(command.getIdsToResolve()).toEqual({ addonId: 'REAL_ADDON_ID' });
  });
});
