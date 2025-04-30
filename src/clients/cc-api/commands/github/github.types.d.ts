export interface GithubApplication {
  id: string;
  owner: string;
  name: string;
  description: string;
  gitUrl: string;
  defaultBranch: string;
  // renamed from priv
  private: boolean;
}
