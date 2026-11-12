import type { AddonId } from '../../types/cc-api.types.ts';
import type { MateriaInfo } from './materia.types.ts';

/**
 * Identifies the Materia KV add-on to retrieve the details of. The owner is resolved automatically when omitted.
 */
export type GetMateriaInfoCommandInput = AddonId;

/**
 * The details of the Materia KV add-on.
 */
export type GetMateriaInfoCommandOutput = MateriaInfo;
