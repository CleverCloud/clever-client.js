import type { AddonId } from '../../types/cc-api.types.js';
import type { MateriaInfo } from './materia.types.js';

/**
 * Identifies the Materia KV add-on to retrieve the details of. The owner is resolved automatically when omitted.
 */
export type GetMateriaInfoCommandInput = AddonId;

/**
 * The details of the Materia KV add-on.
 */
export type GetMateriaInfoCommandOutput = MateriaInfo;
