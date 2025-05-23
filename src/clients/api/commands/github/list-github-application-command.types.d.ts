export type ListGithubApplicationCommandOutput = Array<GithubApplication>;

export interface GithubApplication {
  id: string;
  owner: string;
  name: string;
  description: string;
  gitUrl: string;
  defaultBranch: string;
  priv: boolean;
}
