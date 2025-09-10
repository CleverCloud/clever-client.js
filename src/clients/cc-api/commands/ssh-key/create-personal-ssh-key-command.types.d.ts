import type { SshKey } from './ssh-key.types.js';

export interface CreatePersonalSshKeyCommandInput {
  name: string;
  key: string;
}

export type CreatePersonalSshKeyCommandOutput = SshKey;
