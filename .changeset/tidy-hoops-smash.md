---
'@clevercloud/client': patch
---

Release git tags are now prefixed with `v`

Releases are now published with Changesets instead of release-please. The only user-visible consequence is the git tag format: tags are now named `v12.6.1` instead of `12.6.1`. Anything pinning this package by git tag (submodules, install-from-git URLs, CI checkouts) needs to be updated accordingly. The npm package name and its versioning scheme are unchanged.
