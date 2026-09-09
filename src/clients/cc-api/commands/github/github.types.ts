/**
 * A GitHub repository the linked account gives access to, as the API exposes it when picking a source for an
 * application.
 */
export interface GithubApplication {
  /** Identifier of the repository on GitHub. */
  id: string;
  /** GitHub user or organisation owning the repository. */
  owner: string;
  /** Name of the repository. */
  name: string;
  /** Description of the repository, as set on GitHub. */
  description: string;
  /** URL to clone the repository from. */
  gitUrl: string;
  /** Branch deployed when none is specified. */
  defaultBranch: string;
  /**
   * Whether the repository is private on GitHub.
   * @renamedFrom `priv`
   */
  isPrivate: boolean;
}
