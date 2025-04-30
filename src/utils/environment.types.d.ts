export type EnvVarValidationMode = 'simple' | 'strict';

export interface EnvironmentVariable {
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
