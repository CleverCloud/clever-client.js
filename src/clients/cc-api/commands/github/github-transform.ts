import type { GithubApplication } from './github.types.ts';

export function transformGithubApplication(payload: any): GithubApplication {
  return {
    id: payload.id,
    owner: payload.owner,
    name: payload.name,
    description: payload.description ?? undefined,
    gitUrl: payload.gitUrl,
    defaultBranch: payload.defaultBranch,
    isPrivate: payload.priv,
  };
}
