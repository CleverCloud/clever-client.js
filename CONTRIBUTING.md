# How to contribute?

##  We have precise rules for commit message format

Commit messages must respect [conventional commit](https://www.conventionalcommits.org).

Possible types are `fix:`, `feat:`, `build:`, `chore:`, `ci:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`.

The scope should be the name of the component affected.
If many components are affected, consider the following options:
* split into multiple commits
* use the main module.
* avoid specifying any scope and add some details instead. However, you must understand that details won't be dumped into the CHANGELOG.

If none of these options suits your need, you can follow [this how-to](https://github.com/googleapis/release-please#what-if-my-pr-contains-multiple-fixes-or-features) that will let you generate multiple CHANGELOG entries with one single commit.

To help you respect the rules, you should install a commit linter with the following command:

```shell
cd ${PATH_TO_THE_REPOSITORY_ROOT}
git config core.hooksPath '.githooks'
```
