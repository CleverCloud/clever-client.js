import { normalizeDate, sortBy } from '../../../../lib/utils.js';
import type { ListMigrationPreorderCommandOutput } from './list-migration-preorder-command.types.js';
import type { Migration, MigrationStep } from './migration.types.js';

export function transformMigration(payload: any): Migration {
  return {
    id: payload.migrationId,
    requestedAt: normalizeDate(payload.requestDate)!,
    steps: payload.steps.map(
      (step: any): MigrationStep => ({
        value: step.value,
        status: step.status,
        message: step.message,
        startsAt: normalizeDate(step.startDate)!,
        endsAt: normalizeDate(step.endDate),
      }),
    ),
    status: payload.status,
  };
}

export function transformMigrationPreorder(response: any): ListMigrationPreorderCommandOutput {
  return {
    ownerId: response.ownerId,
    target: response.target,
    emittedAt: normalizeDate(response.emissionDate)!,
    name: response.name,
    company: response.company,
    vat: response.VAT,
    type: response.type,
    lines: sortBy(
      response.lines?.map((line: any) => ({
        type: line.type,
        description: line.description,
        quantity: line.quantity,
        vat: line.tva,
        priceUnitHt: line.price_unit_ht,
        priceTotalHt: line.price_total_ht,
        pack: line.pack ?? undefined,
        dropQuantity: line.dropQuantity,
        coupon: line.coupon ?? undefined,
        discount: line.discount,
      })) ?? [],
      'priceTotalHt',
    ),
  };
}
