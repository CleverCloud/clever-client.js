import { describe, expectTypeOf, it } from 'vitest';
import { ListLogDrainCommand } from '../../../../../../src/clients/cc-api/commands/log-drain/list-log-drain-command.js';
import type {
  AuditLogDrain,
  LogDrain,
} from '../../../../../../src/clients/cc-api/commands/log-drain/log-drain.types.js';
import type { CcApiSimpleCommand } from '../../../../../../src/clients/cc-api/lib/cc-api-command.js';

/** What `client.send()` resolves to for a given command, without sending anything. */
function outputOf<CommandInput, CommandOutput>(
  _command: CcApiSimpleCommand<CommandInput, CommandOutput>,
): CommandOutput {
  return undefined as CommandOutput;
}

describe('ListLogDrainCommand', () => {
  // the command is generic for this: only the input says whether an audit log drain can come back
  it('should type its output after the scope its input asks for', () => {
    expectTypeOf(outputOf(new ListLogDrainCommand({ applicationId: 'app_x' }))).toEqualTypeOf<Array<LogDrain>>();
    expectTypeOf(outputOf(new ListLogDrainCommand({ addonId: 'addon_x', status: ['ENABLED'] }))).toEqualTypeOf<
      Array<LogDrain>
    >();
    expectTypeOf(outputOf(new ListLogDrainCommand({ applicationId: 'app_x', ownerId: 'orga_x' }))).toEqualTypeOf<
      Array<LogDrain>
    >();
    expectTypeOf(outputOf(new ListLogDrainCommand({ ownerId: 'orga_x' }))).toEqualTypeOf<
      Array<LogDrain | AuditLogDrain>
    >();
  });
});
