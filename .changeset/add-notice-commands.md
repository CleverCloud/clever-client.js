---
'@clevercloud/client': patch
---

Add the commands reading the notices the console shows on its pages

`ListHomeNoticeCommand`, `ListOrganisationNoticeCommand`, `ListApplicationNoticeCommand`, `ListAddonNoticeCommand`, `ListAddonCreationListNoticeCommand` (add-on provider list) and `ListAddonCreationConfigurationNoticeCommand` (once a provider is chosen), under `@clevercloud/client/cc-api-commands/notice/`. Each returns the notices already in the user's language, oldest first, and an empty array when there is nothing to show.
