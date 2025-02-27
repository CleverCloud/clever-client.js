export type EnvVarValidationMode = 'simple' | 'strict';

export interface EnvVar {
  name: string;
  value: string;
}

export interface EnvVarParsingError {
  type: number;
  name?: string;
  pos?: {
    line: number;
    column: number;
  };
}
