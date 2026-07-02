import type { GithubApplication } from './github.types.js';

export function transformGithubApplication(payload: any): GithubApplication {
  return {
    id: payload.id,
    owner: payload.owner,
    name: payload.name,
    description: payload.description,
    gitUrl: payload.gitUrl,
    defaultBranch: payload.defaultBranch,
    private: payload.priv,
  };
}
