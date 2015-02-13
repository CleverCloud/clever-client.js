var methods = {
  "/addons/providers": [{
    "verb": "GET",
    "name": "getAddonProviders",
    "params": []
  }],
  "/authorize": [{
    "verb": "POST",
    "name": "authorize",
    "params": []
  }],
  "/cleverapps/{name}": [{
    "verb": "GET",
    "name": "checkDomainAvailability",
    "params": [{
      "name": "name",
      "style": "template"
    }]
  }],
  "/coldstart": [{
    "verb": "GET",
    "name": "coldStart",
    "params": []
  }],
  "/github": [{
    "verb": "GET",
    "name": "startGithub",
    "params": []
  }],
  "/github/applications": [{
    "verb": "GET",
    "name": "getGithubApplications",
    "params": []
  }],
  "/github/callback": [{
    "verb": "GET",
    "name": "githubCallback",
    "params": [{
      "name": "Cookie",
      "style": "header"
    }, {
      "name": "code",
      "style": "query"
    }, {
      "name": "state",
      "style": "query"
    }, {
      "name": "error",
      "style": "query"
    }, {
      "name": "error_description",
      "style": "query"
    }, {
      "name": "error_uri",
      "style": "query"
    }]
  }],
  "/github/emails": [{
    "verb": "GET",
    "name": "getGithubEmails",
    "params": []
  }],
  "/github/keys": [{
    "verb": "GET",
    "name": "getGithubKeys",
    "params": []
  }],
  "/github/link": [{
    "verb": "DELETE",
    "name": "unlinkGithub",
    "params": []
  }, {
    "verb": "GET",
    "name": "linkGithub",
    "params": [{
      "name": "transactionId",
      "style": "query"
    }, {
      "name": "redirectUrl",
      "style": "query"
    }]
  }],
  "/github/login": [{
    "verb": "GET",
    "name": "githubLogin",
    "params": [{
      "name": "redirectUrl",
      "style": "query"
    }, {
      "name": "fromAuthorize",
      "style": "query"
    }]
  }],
  "/github/redeploy": [{
    "verb": "POST",
    "name": "redeployApp",
    "params": [{
      "name": "User-Agent",
      "style": "header"
    }, {
      "name": "X-Github-Event",
      "style": "header"
    }, {
      "name": "X-Hub-Signature",
      "style": "header"
    }]
  }],
  "/github/signup": [{
    "verb": "GET",
    "name": "githubSignup",
    "params": [{
      "name": "redirectUrl",
      "style": "query"
    }, {
      "name": "fromAuthorize",
      "style": "query"
    }]
  }, {
    "verb": "POST",
    "name": "finsihGithubSignup",
    "params": [{
      "name": "transactionId",
      "style": "query"
    }, {
      "name": "name",
      "style": "query"
    }, {
      "name": "otherId",
      "style": "query"
    }, {
      "name": "otherEmail",
      "style": "query"
    }, {
      "name": "password",
      "style": "query"
    }, {
      "name": "autoLink",
      "style": "query"
    }, {
      "name": "terms",
      "style": "query"
    }]
  }],
  "/github/username": [{
    "verb": "GET",
    "name": "getGithubUsername",
    "params": []
  }],
  "/internal/activeMails": [{
    "verb": "GET",
    "name": "getActiveMails",
    "params": []
  }],
  "/internal/applications": [{
    "verb": "GET",
    "name": "getApplications",
    "params": []
  }],
  "/internal/applications/{appId}": [{
    "verb": "DELETE",
    "name": "deleteApplication",
    "params": [{
      "name": "appId",
      "style": "template"
    }]
  }, {
    "verb": "GET",
    "name": "getApplication",
    "params": [{
      "name": "appId",
      "style": "template"
    }]
  }],
  "/internal/applications/{appId}/downscale": [{
    "verb": "POST",
    "name": "downscaleApplication",
    "params": [{
      "name": "appId",
      "style": "template"
    }]
  }],
  "/internal/applications/{appId}/forceRedeploy": [{
    "verb": "POST",
    "name": "forceRedeployApplication",
    "params": [{
      "name": "appId",
      "style": "template"
    }, {
      "name": "down",
      "style": "query"
    }]
  }],
  "/internal/applications/{appId}/instances": [{
    "verb": "POST",
    "name": "changeApplicationInstances",
    "params": [{
      "name": "appId",
      "style": "template"
    }]
  }],
  "/internal/applications/{appId}/instances/{instanceId}": [{
    "verb": "PUT",
    "name": "replaceApplicationInstance",
    "params": [{
      "name": "appId",
      "style": "template"
    }, {
      "name": "instanceId",
      "style": "template"
    }]
  }],
  "/internal/applications/{appId}/ownerId": [{
    "verb": "GET",
    "name": "getApplicationOwnerId",
    "params": [{
      "name": "appId",
      "style": "template"
    }]
  }],
  "/internal/applications/{appId}/redeploy": [{
    "verb": "POST",
    "name": "redeployApplication",
    "params": [{
      "name": "appId",
      "style": "template"
    }, {
      "name": "down",
      "style": "query"
    }, {
      "name": "cause",
      "style": "query"
    }]
  }],
  "/internal/applications/{appId}/undeploy": [{
    "verb": "POST",
    "name": "undeployApplication",
    "params": [{
      "name": "appId",
      "style": "template"
    }]
  }],
  "/internal/applications/{appId}/upscale": [{
    "verb": "POST",
    "name": "upscaleApplication",
    "params": [{
      "name": "appId",
      "style": "template"
    }]
  }],
  "/internal/applications/{appId}/vhosts/{domain}": [{
    "verb": "DELETE",
    "name": "removeDomain",
    "params": [{
      "name": "appId",
      "style": "template"
    }, {
      "name": "domain",
      "style": "template"
    }]
  }, {
    "verb": "PUT",
    "name": "addDomain",
    "params": [{
      "name": "appId",
      "style": "template"
    }, {
      "name": "domain",
      "style": "template"
    }]
  }],
  "/internal/coupons": [{
    "verb": "POST",
    "name": "createCoupon",
    "params": []
  }],
  "/internal/coupons/{name}": [{
    "verb": "GET",
    "name": "getCoupon",
    "params": [{
      "name": "name",
      "style": "template"
    }]
  }],
  "/internal/dropcounts": [{
    "verb": "GET",
    "name": "getAllDropCount",
    "params": []
  }],
  "/internal/dropcounts/{ownerId}": [{
    "verb": "GET",
    "name": "getDropAccount",
    "params": [{
      "name": "ownerId",
      "style": "template"
    }]
  }, {
    "verb": "POST",
    "name": "addDrops",
    "params": [{
      "name": "ownerId",
      "style": "template"
    }]
  }],
  "/internal/heroku/{ownerId}/providers": [{
    "verb": "POST",
    "name": "uploadManifest",
    "params": [{
      "name": "ownerId",
      "style": "template"
    }]
  }],
  "/internal/instances": [{
    "verb": "GET",
    "name": "getInstances",
    "params": []
  }],
  "/internal/instances/{type}-{version}": [{
    "verb": "GET",
    "name": "getInstance",
    "params": [{
      "name": "type",
      "style": "template"
    }, {
      "name": "version",
      "style": "template"
    }]
  }, {
    "verb": "PUT",
    "name": "createInstance",
    "params": [{
      "name": "type",
      "style": "template"
    }, {
      "name": "version",
      "style": "template"
    }]
  }],
  "/internal/invoices": [{
    "verb": "GET",
    "name": "getInvoices",
    "params": [{
      "name": "owner",
      "style": "query"
    }]
  }, {
    "verb": "POST",
    "name": "createPendingInvoice",
    "params": []
  }],
  "/internal/invoices/links": [{
    "verb": "GET",
    "name": "getLinks",
    "params": [{
      "name": "before",
      "style": "query"
    }]
  }],
  "/internal/invoices/pdf": [{
    "verb": "GET",
    "name": "getPdfInvoices",
    "params": [{
      "name": "from",
      "style": "query"
    }, {
      "name": "status",
      "style": "query"
    }]
  }],
  "/internal/invoices/{invId}": [{
    "verb": "GET",
    "name": "getHtmlInvoice",
    "params": [{
      "name": "invId",
      "style": "template"
    }]
  }],
  "/internal/invoices/{invId}.pdf": [{
    "verb": "GET",
    "name": "getPdfInvoice",
    "params": [{
      "name": "invId",
      "style": "template"
    }]
  }],
  "/internal/invoices/{invoice}/credit": [{
    "verb": "PUT",
    "name": "generateCreditNote",
    "params": [{
      "name": "invoice",
      "style": "template"
    }]
  }],
  "/internal/invoices/{invoice}/refund": [{
    "verb": "PUT",
    "name": "refundInvoice",
    "params": [{
      "name": "invoice",
      "style": "template"
    }]
  }],
  "/internal/oauth1consumers": [{
    "verb": "POST",
    "name": "createOAuth1Consumer",
    "params": []
  }],
  "/internal/organisations": [{
    "verb": "GET",
    "name": "getOrganisations",
    "params": []
  }],
  "/internal/owners/{ownerId}": [{
    "verb": "GET",
    "name": "getOwner",
    "params": [{
      "name": "ownerId",
      "style": "template"
    }]
  }],
  "/internal/owners/{ownerId}/applications": [{
    "verb": "GET",
    "name": "getOwnerApplications",
    "params": [{
      "name": "ownerId",
      "style": "template"
    }]
  }],
  "/internal/owners/{ownerId}/keys": [{
    "verb": "GET",
    "name": "getUserSshKeys",
    "params": [{
      "name": "ownerId",
      "style": "template"
    }]
  }],
  "/internal/packages": [{
    "verb": "GET",
    "name": "getAvailablePackages",
    "params": [{
      "name": "currency",
      "style": "query"
    }]
  }, {
    "verb": "POST",
    "name": "createPackage",
    "params": []
  }],
  "/internal/packages/{packageId}": [{
    "verb": "DELETE",
    "name": "deletePackage",
    "params": [{
      "name": "packageId",
      "style": "template"
    }]
  }, {
    "verb": "PUT",
    "name": "editPackage",
    "params": [{
      "name": "packageId",
      "style": "template"
    }]
  }],
  "/internal/paymentplans": [{
    "verb": "POST",
    "name": "createInternalPaymentPlan",
    "params": []
  }],
  "/internal/pending": [{
    "verb": "GET",
    "name": "getPendingUsers",
    "params": []
  }],
  "/internal/prices/{currency}": [{
    "verb": "PUT",
    "name": "setExchangeRate",
    "params": [{
      "name": "currency",
      "style": "template"
    }]
  }],
  "/internal/users": [{
    "verb": "GET",
    "name": "getUsers",
    "params": [{
      "name": "email",
      "style": "query"
    }]
  }],
  "/internal/users/{userId}/email": [{
    "verb": "GET",
    "name": "getEmail",
    "params": [{
      "name": "userId",
      "style": "template"
    }]
  }],
  "/internal/users/{userId}/keys/{name}": [{
    "verb": "DELETE",
    "name": "deleteSshKey",
    "params": [{
      "name": "name",
      "style": "template"
    }, {
      "name": "userId",
      "style": "template"
    }]
  }],
  "/invoice/external/{bid}": [{
    "verb": "POST",
    "name": "updateInvoice",
    "params": [{
      "name": "bid",
      "style": "template"
    }]
  }],
  "/newsfeeds/blog": [{
    "verb": "GET",
    "name": "getBlogFeed",
    "params": []
  }],
  "/newsfeeds/engineering": [{
    "verb": "GET",
    "name": "getEngineeringFeed",
    "params": []
  }],
  "/oauth/access_token": [{
    "verb": "POST",
    "name": "postAccessTokenRequest",
    "params": [{
      "name": "oauth_consumer_key",
      "style": "query"
    }, {
      "name": "oauth_token",
      "style": "query"
    }, {
      "name": "oauth_signature_method",
      "style": "query"
    }, {
      "name": "oauth_signature",
      "style": "query"
    }, {
      "name": "oauth_timestamp",
      "style": "query"
    }, {
      "name": "oauth_nonce",
      "style": "query"
    }, {
      "name": "oauth_version",
      "style": "query"
    }, {
      "name": "oauth_verifier",
      "style": "query"
    }, {
      "name": "oauth_callback",
      "style": "query"
    }, {
      "name": "oauth_token_secret",
      "style": "query"
    }, {
      "name": "oauth_callback_confirmed",
      "style": "query"
    }]
  }],
  "/oauth/authorize": [{
    "verb": "GET",
    "name": "authorizeForm",
    "params": [{
      "name": "Cookie",
      "style": "header"
    }, {
      "name": "Cookie",
      "style": "header"
    }, {
      "name": "oauth_token",
      "style": "query"
    }]
  }, {
    "verb": "POST",
    "name": "authorizeToken",
    "params": [{
      "name": "Cookie",
      "style": "header"
    }, {
      "name": "Cookie",
      "style": "header"
    }, {
      "name": "almighty",
      "style": "query"
    }, {
      "name": "access_organisations",
      "style": "query"
    }, {
      "name": "manage_organisations",
      "style": "query"
    }, {
      "name": "manage_organisations_services",
      "style": "query"
    }, {
      "name": "manage_organisations_applications",
      "style": "query"
    }, {
      "name": "manage_organisations_members",
      "style": "query"
    }, {
      "name": "access_organisations_bills",
      "style": "query"
    }, {
      "name": "access_organisations_credit_count",
      "style": "query"
    }, {
      "name": "access_organisations_consumption_statistics",
      "style": "query"
    }, {
      "name": "access_personal_information",
      "style": "query"
    }, {
      "name": "manage_personal_information",
      "style": "query"
    }, {
      "name": "manage_ssh_keys",
      "style": "query"
    }, {
      "name": "manage_services",
      "style": "query"
    }, {
      "name": "manage_applications",
      "style": "query"
    }, {
      "name": "access_bills",
      "style": "query"
    }, {
      "name": "access_credit_count",
      "style": "query"
    }, {
      "name": "access_consumption_statistics",
      "style": "query"
    }]
  }],
  "/oauth/request_token": [{
    "verb": "POST",
    "name": "postReqTokenRequest",
    "params": [{
      "name": "oauth_consumer_key",
      "style": "query"
    }, {
      "name": "oauth_token",
      "style": "query"
    }, {
      "name": "oauth_signature_method",
      "style": "query"
    }, {
      "name": "oauth_signature",
      "style": "query"
    }, {
      "name": "oauth_timestamp",
      "style": "query"
    }, {
      "name": "oauth_nonce",
      "style": "query"
    }, {
      "name": "oauth_version",
      "style": "query"
    }, {
      "name": "oauth_verifier",
      "style": "query"
    }, {
      "name": "oauth_callback",
      "style": "query"
    }, {
      "name": "oauth_token_secret",
      "style": "query"
    }, {
      "name": "oauth_callback_confirmed",
      "style": "query"
    }]
  }],
  "/organisations": [{
    "verb": "GET",
    "name": "getUserOrganisationss",
    "params": [{
      "name": "user",
      "style": "query"
    }]
  }, {
    "verb": "POST",
    "name": "createOrganisation",
    "params": []
  }],
  "/organisations/{id}": [{
    "verb": "DELETE",
    "name": "deleteOrganisation",
    "params": [{
      "name": "id",
      "style": "template"
    }]
  }, {
    "verb": "GET",
    "name": "getOrganisation",
    "params": [{
      "name": "id",
      "style": "template"
    }]
  }, {
    "verb": "PUT",
    "name": "editOrganisation",
    "params": [{
      "name": "id",
      "style": "template"
    }]
  }],
  "/organisations/{id}/addonproviders/{providerId}": [{
    "verb": "GET",
    "name": "getProviderInfos",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "providerId",
      "style": "template"
    }]
  }, {
    "verb": "PUT",
    "name": "updateProviderInfos",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "providerId",
      "style": "template"
    }]
  }],
  "/organisations/{id}/addonproviders/{providerId}/features": [{
    "verb": "GET",
    "name": "getProviderFeatures",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "providerId",
      "style": "template"
    }]
  }, {
    "verb": "POST",
    "name": "addProviderFeature",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "providerId",
      "style": "template"
    }]
  }],
  "/organisations/{id}/addonproviders/{providerId}/features/{featureId}": [{
    "verb": "DELETE",
    "name": "deleteProviderFeature",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "featureId",
      "style": "template"
    }, {
      "name": "providerId",
      "style": "template"
    }]
  }],
  "/organisations/{id}/addonproviders/{providerId}/plans": [{
    "verb": "GET",
    "name": "getProviderPlans",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "providerId",
      "style": "template"
    }]
  }, {
    "verb": "POST",
    "name": "addProviderPlan",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "providerId",
      "style": "template"
    }]
  }],
  "/organisations/{id}/addonproviders/{providerId}/plans/{planId}": [{
    "verb": "DELETE",
    "name": "deleteProviderPlan",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "providerId",
      "style": "template"
    }, {
      "name": "planId",
      "style": "template"
    }]
  }, {
    "verb": "GET",
    "name": "getProviderPlan",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "providerId",
      "style": "template"
    }, {
      "name": "planId",
      "style": "template"
    }]
  }, {
    "verb": "PUT",
    "name": "editProviderPlan",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "providerId",
      "style": "template"
    }, {
      "name": "planId",
      "style": "template"
    }]
  }],
  "/organisations/{id}/addonproviders/{providerId}/testers": [{
    "verb": "POST",
    "name": "addBetaTester",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "providerId",
      "style": "template"
    }]
  }],
  "/organisations/{id}/addons": [{
    "verb": "GET",
    "name": "getAddons",
    "params": [{
      "name": "id",
      "style": "template"
    }]
  }, {
    "verb": "POST",
    "name": "provisionAddon",
    "params": [{
      "name": "id",
      "style": "template"
    }]
  }],
  "/organisations/{id}/addons/{addonId}": [{
    "verb": "DELETE",
    "name": "deprovisionAddon",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "addonId",
      "style": "template"
    }]
  }, {
    "verb": "GET",
    "name": "getAddon",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "addonId",
      "style": "template"
    }]
  }, {
    "verb": "PUT",
    "name": "changePlan",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "addonId",
      "style": "template"
    }]
  }],
  "/organisations/{id}/addons/{addonId}/applications": [{
    "verb": "GET",
    "name": "getApplicationsLinkedToAddon",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "addonId",
      "style": "template"
    }]
  }],
  "/organisations/{id}/addons/{addonId}/payment-method": [{
    "verb": "PUT",
    "name": "changePaymentMethod",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "addonId",
      "style": "template"
    }]
  }],
  "/organisations/{id}/addons/{addonId}/sso": [{
    "verb": "GET",
    "name": "getSSOData",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "addonId",
      "style": "template"
    }]
  }],
  "/organisations/{id}/addons/{addonId}/tags": [{
    "verb": "GET",
    "name": "getAddonTags",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "addonId",
      "style": "template"
    }]
  }],
  "/organisations/{id}/addons/{addonId}/tags/{tag}": [{
    "verb": "DELETE",
    "name": "deleteAddonTag",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "tag",
      "style": "template"
    }, {
      "name": "addonId",
      "style": "template"
    }]
  }, {
    "verb": "PUT",
    "name": "addAddonTag",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "tag",
      "style": "template"
    }, {
      "name": "addonId",
      "style": "template"
    }]
  }],
  "/organisations/{id}/applications": [{
    "verb": "GET",
    "name": "getAllApplications",
    "params": [{
      "name": "id",
      "style": "template"
    }]
  }, {
    "verb": "POST",
    "name": "addApplication",
    "params": [{
      "name": "id",
      "style": "template"
    }]
  }],
  "/organisations/{id}/applications/{appId}": [{
    "verb": "DELETE",
    "name": "deleteApplication",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "appId",
      "style": "template"
    }]
  }, {
    "verb": "GET",
    "name": "getApplication",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "appId",
      "style": "template"
    }]
  }, {
    "verb": "PUT",
    "name": "editApplication",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "appId",
      "style": "template"
    }]
  }],
  "/organisations/{id}/applications/{appId}/addons": [{
    "verb": "GET",
    "name": "getAddonsLinkedToApplication",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "appId",
      "style": "template"
    }]
  }, {
    "verb": "POST",
    "name": "linkAddonToApplication",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "appId",
      "style": "template"
    }]
  }],
  "/organisations/{id}/applications/{appId}/addons/{addonId}": [{
    "verb": "DELETE",
    "name": "unlinkAddonFromApplication",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "appId",
      "style": "template"
    }, {
      "name": "addonId",
      "style": "template"
    }]
  }],
  "/organisations/{id}/applications/{appId}/deployments": [{
    "verb": "GET",
    "name": "getApplicationDeploymentsForOrga",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "appId",
      "style": "template"
    }, {
      "name": "limit",
      "style": "query"
    }, {
      "name": "offset",
      "style": "query"
    }]
  }],
  "/organisations/{id}/applications/{appId}/deployments/{deploymentId}/instances": [{
    "verb": "DELETE",
    "name": "getApplicationDeploymentsForOrga",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "appId",
      "style": "template"
    }, {
      "name": "deploymentId",
      "style": "template"
    }]
  }],
  "/organisations/{id}/applications/{appId}/env": [{
    "verb": "GET",
    "name": "getApplicationEnv",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "appId",
      "style": "template"
    }]
  }, {
    "verb": "PUT",
    "name": "editApplicationEnvironment",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "appId",
      "style": "template"
    }]
  }],
  "/organisations/{id}/applications/{appId}/env/{envName}": [{
    "verb": "DELETE",
    "name": "removeApplicationEnv",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "appId",
      "style": "template"
    }, {
      "name": "envName",
      "style": "template"
    }]
  }, {
    "verb": "PUT",
    "name": "editApplicationEnv",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "appId",
      "style": "template"
    }, {
      "name": "envName",
      "style": "template"
    }]
  }],
  "/organisations/{id}/applications/{appId}/instance": [{
    "verb": "PUT",
    "name": "changeApplicationType",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "appId",
      "style": "template"
    }, {
      "name": "type",
      "style": "query"
    }, {
      "name": "version",
      "style": "query"
    }]
  }],
  "/organisations/{id}/applications/{appId}/instances": [{
    "verb": "DELETE",
    "name": "undeployApplication",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "appId",
      "style": "template"
    }]
  }, {
    "verb": "GET",
    "name": "getApplicationInstances",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "appId",
      "style": "template"
    }]
  }, {
    "verb": "POST",
    "name": "redeployApplication",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "appId",
      "style": "template"
    }]
  }],
  "/organisations/{id}/applications/{appId}/logs": [{
    "verb": "GET",
    "name": "getApplicationLogss",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "appId",
      "style": "template"
    }, {
      "name": "order",
      "style": "query"
    }, {
      "name": "since",
      "style": "query"
    }]
  }],
  "/organisations/{id}/applications/{appId}/tags": [{
    "verb": "GET",
    "name": "getApplicationTags",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "appId",
      "style": "template"
    }]
  }],
  "/organisations/{id}/applications/{appId}/tags/{tag}": [{
    "verb": "DELETE",
    "name": "deleteApplicationTag",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "appId",
      "style": "template"
    }, {
      "name": "tag",
      "style": "template"
    }]
  }, {
    "verb": "PUT",
    "name": "addApplicationTag",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "appId",
      "style": "template"
    }, {
      "name": "tag",
      "style": "template"
    }]
  }],
  "/organisations/{id}/applications/{appId}/vhosts": [{
    "verb": "GET",
    "name": "getVhosts",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "appId",
      "style": "template"
    }]
  }],
  "/organisations/{id}/applications/{appId}/vhosts/favourite": [{
    "verb": "DELETE",
    "name": "unmarkFavouriteVhost",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "appId",
      "style": "template"
    }]
  }, {
    "verb": "GET",
    "name": "getFavouriteVhost",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "appId",
      "style": "template"
    }]
  }, {
    "verb": "PUT",
    "name": "markFavouriteVhost",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "appId",
      "style": "template"
    }]
  }],
  "/organisations/{id}/applications/{appId}/vhosts/{domain}": [{
    "verb": "DELETE",
    "name": "removeVhost",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "appId",
      "style": "template"
    }, {
      "name": "domain",
      "style": "template"
    }]
  }, {
    "verb": "PUT",
    "name": "addVhost",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "appId",
      "style": "template"
    }, {
      "name": "domain",
      "style": "template"
    }]
  }],
  "/organisations/{id}/avatar": [{
    "verb": "PUT",
    "name": "setOrgaAvatar",
    "params": [{
      "name": "id",
      "style": "template"
    }]
  }, {
    "verb": "PUT",
    "name": "setOrgaAvatarFromSource",
    "params": [{
      "name": "id",
      "style": "template"
    }]
  }],
  "/organisations/{id}/consumptions": [{
    "verb": "GET",
    "name": "getAmount",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "appId",
      "style": "query"
    }, {
      "name": "from",
      "style": "query"
    }, {
      "name": "to",
      "style": "query"
    }]
  }],
  "/organisations/{id}/credits": [{
    "verb": "GET",
    "name": "getAmount",
    "params": [{
      "name": "id",
      "style": "template"
    }]
  }],
  "/organisations/{id}/instances": [{
    "verb": "GET",
    "name": "getInstancesForAllApps",
    "params": [{
      "name": "id",
      "style": "template"
    }]
  }],
  "/organisations/{id}/members": [{
    "verb": "GET",
    "name": "getOrganisationMembers",
    "params": [{
      "name": "id",
      "style": "template"
    }]
  }, {
    "verb": "POST",
    "name": "addOrganisationMember",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "invitationKey",
      "style": "query"
    }]
  }],
  "/organisations/{id}/members/{userId}": [{
    "verb": "DELETE",
    "name": "removeOrganisationMember",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "userId",
      "style": "template"
    }]
  }, {
    "verb": "PUT",
    "name": "editOrganisationMember",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "userId",
      "style": "template"
    }]
  }],
  "/organisations/{id}/payment-info": [{
    "verb": "GET",
    "name": "getPaymentInfo",
    "params": [{
      "name": "id",
      "style": "template"
    }]
  }],
  "/organisations/{id}/payments/billings": [{
    "verb": "GET",
    "name": "getInvoices",
    "params": [{
      "name": "id",
      "style": "template"
    }]
  }, {
    "verb": "POST",
    "name": "buyDrops",
    "params": [{
      "name": "id",
      "style": "template"
    }]
  }],
  "/organisations/{id}/payments/billings/{bid}": [{
    "verb": "DELETE",
    "name": "deletePurchaseOrder",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "bid",
      "style": "template"
    }]
  }, {
    "verb": "GET",
    "name": "getInvoice",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "bid",
      "style": "template"
    }]
  }, {
    "verb": "PUT",
    "name": "choosePaymentProvider",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "bid",
      "style": "template"
    }]
  }],
  "/organisations/{id}/payments/billings/{bid}.pdf": [{
    "verb": "GET",
    "name": "getPdfInvoice",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "bid",
      "style": "template"
    }, {
      "name": "token",
      "style": "query"
    }]
  }],
  "/organisations/{id}/payments/recurring": [{
    "verb": "DELETE",
    "name": "deleteRecurrentPayment",
    "params": [{
      "name": "id",
      "style": "template"
    }]
  }, {
    "verb": "GET",
    "name": "getRecurrentPayment",
    "params": [{
      "name": "id",
      "style": "template"
    }]
  }, {
    "verb": "PUT",
    "name": "createRecurrentPayment",
    "params": [{
      "name": "id",
      "style": "template"
    }]
  }],
  "/password_forgotten": [{
    "verb": "GET",
    "name": "getPasswordForgottenForm",
    "params": []
  }, {
    "verb": "POST",
    "name": "askForPasswordResetViaForm",
    "params": [{
      "name": "TesterPass",
      "style": "header"
    }, {
      "name": "login",
      "style": "query"
    }, {
      "name": "drop_tokens",
      "style": "query"
    }]
  }],
  "/password_forgotten/{key}": [{
    "verb": "GET",
    "name": "confirmPasswordResetRequest",
    "params": [{
      "name": "key",
      "style": "template"
    }]
  }, {
    "verb": "POST",
    "name": "resetPasswordForgotten",
    "params": [{
      "name": "key",
      "style": "template"
    }, {
      "name": "pass",
      "style": "query"
    }, {
      "name": "pass2",
      "style": "query"
    }]
  }],
  "/payments/coupons/{name}": [{
    "verb": "GET",
    "name": "getCoupon",
    "params": [{
      "name": "name",
      "style": "template"
    }]
  }],
  "/payments/providers": [{
    "verb": "GET",
    "name": "getAvailablePaymentProviders",
    "params": []
  }],
  "/payments/tokens/bt": [{
    "verb": "GET",
    "name": "getBraintreeToken",
    "params": []
  }],
  "/payments/webhooks/bt": [{
    "verb": "GET",
    "name": "subscriptionEventPing",
    "params": [{
      "name": "bt_challenge",
      "style": "query"
    }]
  }, {
    "verb": "POST",
    "name": "subscriptionEvent",
    "params": [{
      "name": "bt_signature",
      "style": "query"
    }, {
      "name": "bt_payload",
      "style": "query"
    }]
  }],
  "/payments/{bid}/end/bt": [{
    "verb": "POST",
    "name": "endPaymentWithBraintree",
    "params": [{
      "name": "bid",
      "style": "template"
    }]
  }],
  "/ping": [{
    "verb": "GET",
    "name": "ping",
    "params": []
  }],
  "/ping/stats": [{
    "verb": "GET",
    "name": "stats",
    "params": []
  }],
  "/products/countries": [{
    "verb": "GET",
    "name": "getCountries",
    "params": []
  }],
  "/products/countrycodes": [{
    "verb": "GET",
    "name": "getCountryCodes",
    "params": []
  }],
  "/products/instances": [{
    "verb": "GET",
    "name": "getAvailableInstances",
    "params": [{
      "name": "for",
      "style": "query"
    }]
  }],
  "/products/instances/{type}-{version}": [{
    "verb": "GET",
    "name": "getAvailableInstance",
    "params": [{
      "name": "type",
      "style": "template"
    }, {
      "name": "version",
      "style": "template"
    }, {
      "name": "for",
      "style": "query"
    }, {
      "name": "app",
      "style": "query"
    }]
  }],
  "/products/packages": [{
    "verb": "GET",
    "name": "getAvailablePackages",
    "params": [{
      "name": "coupon",
      "style": "query"
    }, {
      "name": "orgaId",
      "style": "query"
    }, {
      "name": "currency",
      "style": "query"
    }]
  }],
  "/products/prices": [{
    "verb": "GET",
    "name": "getExcahngeRates",
    "params": []
  }],
  "/products/zones": [{
    "verb": "GET",
    "name": "getZones",
    "params": []
  }],
  "/self": [{
    "verb": "DELETE",
    "name": "deleteUser",
    "params": []
  }, {
    "verb": "GET",
    "name": "getUser",
    "params": []
  }, {
    "verb": "PUT",
    "name": "editUser",
    "params": []
  }],
  "/self/addons": [{
    "verb": "GET",
    "name": "getAddons",
    "params": []
  }, {
    "verb": "POST",
    "name": "provisionAddon",
    "params": []
  }],
  "/self/addons/{addonId}": [{
    "verb": "DELETE",
    "name": "deprovisionAddon",
    "params": [{
      "name": "addonId",
      "style": "template"
    }]
  }, {
    "verb": "GET",
    "name": "getAddon",
    "params": [{
      "name": "addonId",
      "style": "template"
    }]
  }, {
    "verb": "PUT",
    "name": "changePlan",
    "params": [{
      "name": "addonId",
      "style": "template"
    }]
  }],
  "/self/addons/{addonId}/applications": [{
    "verb": "GET",
    "name": "getApplicationsLinkedToAddon",
    "params": [{
      "name": "addonId",
      "style": "template"
    }]
  }],
  "/self/addons/{addonId}/payment-method": [{
    "verb": "PUT",
    "name": "changePaymentMethod",
    "params": [{
      "name": "addonId",
      "style": "template"
    }]
  }],
  "/self/addons/{addonId}/sso": [{
    "verb": "GET",
    "name": "getSSOData",
    "params": [{
      "name": "addonId",
      "style": "template"
    }]
  }],
  "/self/addons/{addonId}/tags": [{
    "verb": "GET",
    "name": "getAddonTags",
    "params": [{
      "name": "addonId",
      "style": "template"
    }]
  }],
  "/self/addons/{addonId}/tags/{tag}": [{
    "verb": "DELETE",
    "name": "deleteAddonTag",
    "params": [{
      "name": "tag",
      "style": "template"
    }, {
      "name": "addonId",
      "style": "template"
    }]
  }, {
    "verb": "PUT",
    "name": "addAddonTag",
    "params": [{
      "name": "tag",
      "style": "template"
    }, {
      "name": "addonId",
      "style": "template"
    }]
  }],
  "/self/applications": [{
    "verb": "GET",
    "name": "getApplications",
    "params": []
  }, {
    "verb": "POST",
    "name": "addApplication",
    "params": []
  }],
  "/self/applications/{appId}": [{
    "verb": "DELETE",
    "name": "deleteApplication",
    "params": [{
      "name": "appId",
      "style": "template"
    }]
  }, {
    "verb": "GET",
    "name": "getApplication",
    "params": [{
      "name": "appId",
      "style": "template"
    }]
  }, {
    "verb": "PUT",
    "name": "editApplication",
    "params": [{
      "name": "appId",
      "style": "template"
    }]
  }],
  "/self/applications/{appId}/addons": [{
    "verb": "GET",
    "name": "getAddonsLinkedToApplication",
    "params": [{
      "name": "appId",
      "style": "template"
    }]
  }, {
    "verb": "POST",
    "name": "linkAddonToApplication",
    "params": [{
      "name": "appId",
      "style": "template"
    }]
  }],
  "/self/applications/{appId}/addons/{addonId}": [{
    "verb": "DELETE",
    "name": "unlinkAddonFromApplication",
    "params": [{
      "name": "appId",
      "style": "template"
    }, {
      "name": "addonId",
      "style": "template"
    }]
  }],
  "/self/applications/{appId}/deployments": [{
    "verb": "GET",
    "name": "getApplication",
    "params": [{
      "name": "appId",
      "style": "template"
    }, {
      "name": "limit",
      "style": "query"
    }, {
      "name": "offset",
      "style": "query"
    }]
  }],
  "/self/applications/{appId}/deployments/{deploymentId}/instances": [{
    "verb": "DELETE",
    "name": "getApplicationDeploymentsForOrga",
    "params": [{
      "name": "id",
      "style": "template"
    }, {
      "name": "appId",
      "style": "template"
    }, {
      "name": "deploymentId",
      "style": "template"
    }]
  }],
  "/self/applications/{appId}/env": [{
    "verb": "GET",
    "name": "editApplicationEnv",
    "params": [{
      "name": "appId",
      "style": "template"
    }]
  }, {
    "verb": "PUT",
    "name": "editApplicationEnvironment",
    "params": [{
      "name": "appId",
      "style": "template"
    }]
  }],
  "/self/applications/{appId}/env/{envName}": [{
    "verb": "DELETE",
    "name": "removeApplicationEnv",
    "params": [{
      "name": "appId",
      "style": "template"
    }, {
      "name": "envName",
      "style": "template"
    }]
  }, {
    "verb": "PUT",
    "name": "editApplicationEnv",
    "params": [{
      "name": "appId",
      "style": "template"
    }, {
      "name": "envName",
      "style": "template"
    }]
  }],
  "/self/applications/{appId}/instance": [{
    "verb": "PUT",
    "name": "changeApplicationType",
    "params": [{
      "name": "appId",
      "style": "template"
    }, {
      "name": "type",
      "style": "query"
    }, {
      "name": "version",
      "style": "query"
    }]
  }],
  "/self/applications/{appId}/instances": [{
    "verb": "DELETE",
    "name": "undeployApplication",
    "params": [{
      "name": "appId",
      "style": "template"
    }]
  }, {
    "verb": "GET",
    "name": "getApplicationInstances",
    "params": [{
      "name": "appId",
      "style": "template"
    }]
  }, {
    "verb": "POST",
    "name": "redeployApplication",
    "params": [{
      "name": "appId",
      "style": "template"
    }]
  }],
  "/self/applications/{appId}/logs": [{
    "verb": "GET",
    "name": "getApplicationLogs",
    "params": [{
      "name": "appId",
      "style": "template"
    }, {
      "name": "orger",
      "style": "query"
    }, {
      "name": "since",
      "style": "query"
    }]
  }],
  "/self/applications/{appId}/tags": [{
    "verb": "GET",
    "name": "getApplicationTags",
    "params": [{
      "name": "appId",
      "style": "template"
    }]
  }],
  "/self/applications/{appId}/tags/{tag}": [{
    "verb": "DELETE",
    "name": "deleteApplicationTag",
    "params": [{
      "name": "appId",
      "style": "template"
    }, {
      "name": "tag",
      "style": "template"
    }]
  }, {
    "verb": "PUT",
    "name": "addApplicationTag",
    "params": [{
      "name": "appId",
      "style": "template"
    }, {
      "name": "tag",
      "style": "template"
    }]
  }],
  "/self/applications/{appId}/vhosts": [{
    "verb": "GET",
    "name": "getVhosts",
    "params": [{
      "name": "appId",
      "style": "template"
    }]
  }],
  "/self/applications/{appId}/vhosts/favourite": [{
    "verb": "DELETE",
    "name": "unmarkFavouriteVhost",
    "params": [{
      "name": "appId",
      "style": "template"
    }]
  }, {
    "verb": "GET",
    "name": "getFavouriteVhost",
    "params": [{
      "name": "appId",
      "style": "template"
    }]
  }, {
    "verb": "PUT",
    "name": "markFavouriteVhost",
    "params": [{
      "name": "appId",
      "style": "template"
    }]
  }],
  "/self/applications/{appId}/vhosts/{domain}": [{
    "verb": "DELETE",
    "name": "removeVhost",
    "params": [{
      "name": "appId",
      "style": "template"
    }, {
      "name": "domain",
      "style": "template"
    }]
  }, {
    "verb": "PUT",
    "name": "addVhost",
    "params": [{
      "name": "appId",
      "style": "template"
    }, {
      "name": "domain",
      "style": "template"
    }]
  }],
  "/self/avatar": [{
    "verb": "PUT",
    "name": "setUserAvatar",
    "params": []
  }, {
    "verb": "PUT",
    "name": "setUserAvatarFromSource",
    "params": []
  }],
  "/self/change_password": [{
    "verb": "PUT",
    "name": "changeUserPassword",
    "params": []
  }],
  "/self/confirmation_email": [{
    "verb": "GET",
    "name": "getConfirmationEmail",
    "params": []
  }],
  "/self/consumptions": [{
    "verb": "GET",
    "name": "getConsumptions",
    "params": [{
      "name": "appId",
      "style": "query"
    }, {
      "name": "from",
      "style": "query"
    }, {
      "name": "to",
      "style": "query"
    }]
  }],
  "/self/credits": [{
    "verb": "GET",
    "name": "getAmount",
    "params": []
  }],
  "/self/emails": [{
    "verb": "GET",
    "name": "getEmailAddresses",
    "params": []
  }],
  "/self/emails/{email}": [{
    "verb": "DELETE",
    "name": "removeEmailAddress",
    "params": [{
      "name": "email",
      "style": "template"
    }]
  }, {
    "verb": "PUT",
    "name": "addEmailAddress",
    "params": [{
      "name": "email",
      "style": "template"
    }]
  }],
  "/self/id": [{
    "verb": "GET",
    "name": "getId",
    "params": []
  }],
  "/self/instances": [{
    "verb": "GET",
    "name": "getInstancesForAllApps",
    "params": []
  }],
  "/self/intercomhash": [{
    "verb": "GET",
    "name": "getIntercomeSecureModeHash",
    "params": []
  }],
  "/self/keys": [{
    "verb": "GET",
    "name": "getSshKeys",
    "params": []
  }],
  "/self/keys/{key}": [{
    "verb": "DELETE",
    "name": "removeSshKey",
    "params": [{
      "name": "key",
      "style": "template"
    }]
  }, {
    "verb": "PUT",
    "name": "addSshKey",
    "params": [{
      "name": "key",
      "style": "template"
    }]
  }],
  "/self/payment-info": [{
    "verb": "GET",
    "name": "getPaymentInfo",
    "params": []
  }],
  "/self/payments/billings": [{
    "verb": "GET",
    "name": "getInvoices",
    "params": []
  }, {
    "verb": "POST",
    "name": "buyDrops",
    "params": []
  }],
  "/self/payments/billings/{bid}": [{
    "verb": "DELETE",
    "name": "deletePurchaseOrder",
    "params": [{
      "name": "bid",
      "style": "template"
    }]
  }, {
    "verb": "GET",
    "name": "getInvoice",
    "params": [{
      "name": "bid",
      "style": "template"
    }]
  }, {
    "verb": "PUT",
    "name": "choosePaymentProvider",
    "params": [{
      "name": "bid",
      "style": "template"
    }]
  }],
  "/self/payments/billings/{bid}.pdf": [{
    "verb": "GET",
    "name": "getPdfInvoice",
    "params": [{
      "name": "bid",
      "style": "template"
    }, {
      "name": "token",
      "style": "query"
    }]
  }],
  "/self/payments/methods": [{
    "verb": "GET",
    "name": "getUserPaymentMethods",
    "params": []
  }, {
    "verb": "POST",
    "name": "addUserMethod",
    "params": []
  }],
  "/self/payments/methods/{mId}": [{
    "verb": "DELETE",
    "name": "deleteUserCard",
    "params": [{
      "name": "mId",
      "style": "template"
    }]
  }],
  "/self/payments/recurring": [{
    "verb": "DELETE",
    "name": "deleteRecurrentPayment",
    "params": []
  }, {
    "verb": "GET",
    "name": "getRecurrentPayment",
    "params": []
  }, {
    "verb": "PUT",
    "name": "createRecurrentPayment",
    "params": []
  }],
  "/self/tokens": [{
    "verb": "DELETE",
    "name": "revokeAllTokens",
    "params": []
  }, {
    "verb": "GET",
    "name": "getSelfTokens",
    "params": []
  }],
  "/self/tokens/{token}": [{
    "verb": "DELETE",
    "name": "revokeToken",
    "params": [{
      "name": "token",
      "style": "template"
    }]
  }],
  "/self/validate_email": [{
    "verb": "GET",
    "name": "validateEmail",
    "params": [{
      "name": "validationKey",
      "style": "query"
    }]
  }],
  "/session/login": [{
    "verb": "GET",
    "name": "getLoginForm",
    "params": [{
      "name": "secondaryEmailKey",
      "style": "query"
    }, {
      "name": "deletionKey",
      "style": "query"
    }, {
      "name": "fromAuthorize",
      "style": "query"
    }]
  }, {
    "verb": "POST",
    "name": "login",
    "params": [{
      "name": "email",
      "style": "query"
    }, {
      "name": "pass",
      "style": "query"
    }, {
      "name": "from_authorize",
      "style": "query"
    }]
  }],
  "/session/signup": [{
    "verb": "GET",
    "name": "getSignupForm",
    "params": [{
      "name": "invitationKey",
      "style": "query"
    }, {
      "name": "url_next",
      "style": "query"
    }]
  }],
  "/users": [{
    "verb": "GET",
    "name": "getUsers",
    "params": []
  }, {
    "verb": "POST",
    "name": "createUser",
    "params": [{
      "name": "invitationKey",
      "style": "query"
    }, {
      "name": "addonBetaInvitationKey",
      "style": "query"
    }]
  }, {
    "verb": "POST",
    "name": "createUserFromForm",
    "params": [{
      "name": "invitationKey",
      "style": "query"
    }, {
      "name": "addonBetaInvitationKey",
      "style": "query"
    }, {
      "name": "email",
      "style": "query"
    }, {
      "name": "pass",
      "style": "query"
    }, {
      "name": "url_next",
      "style": "query"
    }, {
      "name": "terms",
      "style": "query"
    }]
  }],
  "/users/{id}": [{
    "verb": "GET",
    "name": "getUser",
    "params": [{
      "name": "id",
      "style": "template"
    }]
  }],
  "/users/{id}/applications": [{
    "verb": "GET",
    "name": "getApplications",
    "params": [{
      "name": "id",
      "style": "template"
    }]
  }],
  "/validation/vat/{key}": [{
    "verb": "GET",
    "name": "validate",
    "params": [{
      "name": "key",
      "style": "template"
    }, {
      "name": "action",
      "style": "query"
    }]
  }],
  "/vat_check": [{
    "verb": "GET",
    "name": "checkVat",
    "params": [{
      "name": "country",
      "style": "query"
    }, {
      "name": "vat",
      "style": "query"
    }]
  }],
  "/vendor/apps": [{
    "verb": "GET",
    "name": "listApps",
    "params": [{
      "name": "offset",
      "style": "query"
    }]
  }],
  "/vendor/apps/{addonId}": [{
    "verb": "GET",
    "name": "getApplicationInfo",
    "params": [{
      "name": "addonId",
      "style": "template"
    }]
  }, {
    "verb": "PUT",
    "name": "editApplicationConfiguration",
    "params": [{
      "name": "addonId",
      "style": "template"
    }]
  }]
};

var Owner = (function() {
  var Owner = function(client, settings) {
    var owner = function(ownerId) {
      return ownerId && ownerId.indexOf("orga_") == 0 ? client.organisations._ : client.self;
    };

    return owner;
  };

  return Owner;
})();


var Session = (function(_, querystring) {
  var Session = function(client, settings) {
    var session = {};

    session.getOAuthParams = function(params, token_secret) {
      return _.extend({
        oauth_consumer_key: settings.API_CONSUMER_KEY,
        oauth_signature_method: "PLAINTEXT",
        oauth_signature: settings.API_CONSUMER_SECRET + "&" + (token_secret || ""),
        oauth_timestamp: Math.floor(Date.now()/1000),
        oauth_nonce: Math.floor(Math.random()*1000000)
      }, params);
    };

    session.login = typeof window == "undefined" ? function(){} : function() {
      var res = client.oauth.request_token.post().withHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      }).send(querystring.encode(session.getOAuthParams({
        oauth_callback: window.location.href
      })));

      res.onValue(function(data) {
        var parsed = querystring.decode(data);

        if(typeof localStorage != "undefined") {
          localStorage.consumer_oauth_token = parsed.oauth_token;
          localStorage.consumer_oauth_token_secret = parsed.oauth_token_secret;
        }

        window.location = settings.API_HOST + "/oauth/authorize?oauth_token=" + encodeURIComponent(parsed.oauth_token);
      });
    };

    session.getAccessTokenFromQueryString = typeof window == "undefined" ? function(){} : function() {
      var params = querystring.decode(window.location.search.slice(1));

      params.consumer_oauth_token = typeof localStorage != "undefined" ? localStorage.consumer_oauth_token : "";
      params.consumer_oauth_token_secret = typeof localStorage != "undefined" ? localStorage.consumer_oauth_token_secret : "";

      return session.getAccessToken(params);
    };

    session.getAccessToken = function(params) {
      var res = client.oauth.access_token.post().withHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      }).send(querystring.encode(session.getOAuthParams(params, params.consumer_oauth_token_secret)));

      var s_accessTokens = res.map(function(data) {
        return querystring.decode(data);
      });

      s_accessTokens.onValue(function(tokens) {
        if(typeof localStorage != "undefined") {
          localStorage.user_oauth_token = tokens.oauth_token;
          localStorage.user_oauth_token_secret = tokens.oauth_token_secret;
        }
      });

      return s_accessTokens;
    };

    session.getAuthorization = function(tokens) {
      if(tokens.user_oauth_token && tokens.user_oauth_token_secret) {
        var params = session.getOAuthParams({oauth_token: tokens.user_oauth_token}, tokens.user_oauth_token_secret);
        return  ["OAuth realm=\"http://ccapi.cleverapps.io/v2/oauth\"",
                "oauth_consumer_key=\"" + params.oauth_consumer_key + "\"",
                "oauth_token=\"" + params.oauth_token + "\"",
                "oauth_signature_method=\"" + params.oauth_signature_method + "\"",
                "oauth_signature=\"" + params.oauth_signature + "\"",
                "oauth_timestamp=\"" + params.oauth_timestamp + "\"",
                "oauth_nonce=\"" + params.oauth_nonce + "\""].join(", ");
      }
      else {
        return "";
      }
    };

    session.remove = function() {
      if(typeof localStorage != "undefined") {
        localStorage.removeItem("consumer_oauth_token");
        localStorage.removeItem("consumer_oauth_token_secret");
        localStorage.removeItem("user_oauth_token");
        localStorage.removeItem("user_oauth_token_secret");
      }
    };

    return session;
  };

  return Session;
})(
  typeof require == "function" && require("lodash") ? require("lodash") : _,
  typeof require == "function" && require("querystring") ? require("querystring") : querystring
);


var CleverAPI = (function(_, WadlClient) {
  var CleverAPI = function(settings) {
    _.defaults(settings, {
      API_HOST: "https://api.clever-cloud.com/v2"
    });

    var headers = !settings.API_AUTHORIZATION ? {} : {
      "Authorization": settings.API_AUTHORIZATION,
      "Content-Type": "application/json"
    };

    var client = WadlClient.buildClient(methods, {
      host: settings.API_HOST,
      headers: headers,
      parse: true
    });

    client.owner = Owner(client, settings);
    client.session = Session(client, settings);

    return client;
  };

  if(typeof module != "undefined" && module.exports) {
    module.exports = CleverAPI;
  }

  return CleverAPI;
})(
  typeof require == "function" && require("lodash") ? require("lodash") : _,
  typeof require == "function" && require("wadl-client") ? require("wadl-client") : WadlClient
);
