var methods = {
  "swagger": "2.0",
  "schemes": ["http"],
  "host": "api.clever-cloud.com",
  "basePath": "/v2",
  "paths": {
    "/application/{appId}/environment": {
      "get": {
        "responses": {
          "default": {
            "description": "getEnv"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "token",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "updateEnv"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "token",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/authorize": {
      "post": {
        "responses": {
          "default": {
            "description": "authorize"
          }
        }
      }
    },
    "/cleverapps/{name}": {
      "get": {
        "responses": {
          "default": {
            "description": "checkDomainAvailability"
          }
        },
        "parameters": [{
          "name": "name",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/coldstart": {
      "get": {
        "responses": {
          "default": {
            "description": "coldStart"
          }
        }
      }
    },
    "/github": {
      "get": {
        "responses": {
          "default": {
            "description": "startGithub"
          }
        }
      }
    },
    "/github/applications": {
      "get": {
        "responses": {
          "default": {
            "description": "getGithubApplications"
          }
        }
      }
    },
    "/github/callback": {
      "get": {
        "responses": {
          "default": {
            "description": "githubCallback"
          }
        },
        "parameters": [{
          "name": "Cookie",
          "required": false,
          "in": "header",
          "type": "string"
        }, {
          "name": "code",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "state",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "error",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "error_description",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "error_uri",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/github/emails": {
      "get": {
        "responses": {
          "default": {
            "description": "getGithubEmails"
          }
        }
      }
    },
    "/github/keys": {
      "get": {
        "responses": {
          "default": {
            "description": "getGithubKeys"
          }
        }
      }
    },
    "/github/link": {
      "delete": {
        "responses": {
          "default": {
            "description": "unlinkGithub"
          }
        }
      },
      "get": {
        "responses": {
          "default": {
            "description": "linkGithub"
          }
        },
        "parameters": [{
          "name": "transactionId",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "redirectUrl",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/github/login": {
      "get": {
        "responses": {
          "default": {
            "description": "githubLogin"
          }
        },
        "parameters": [{
          "name": "redirectUrl",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "fromAuthorize",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "invitationKey",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/github/redeploy": {
      "post": {
        "responses": {
          "default": {
            "description": "redeployApp"
          }
        },
        "parameters": [{
          "name": "User-Agent",
          "required": false,
          "in": "header",
          "type": "string"
        }, {
          "name": "X-Github-Event",
          "required": false,
          "in": "header",
          "type": "string"
        }, {
          "name": "X-Hub-Signature",
          "required": false,
          "in": "header",
          "type": "string"
        }]
      }
    },
    "/github/signup": {
      "get": {
        "responses": {
          "default": {
            "description": "githubSignup"
          }
        },
        "parameters": [{
          "name": "redirectUrl",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "fromAuthorize",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "invitationKey",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      },
      "post": {
        "responses": {
          "default": {
            "description": "finsihGithubSignup"
          }
        },
        "parameters": [{
          "name": "transactionId",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "name",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "otherId",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "otherEmail",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "password",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "autoLink",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "terms",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "invitationKey",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/github/username": {
      "get": {
        "responses": {
          "default": {
            "description": "getGithubUsername"
          }
        }
      }
    },
    "/invoice/external/paypal/{bid}": {
      "delete": {
        "responses": {
          "default": {
            "description": "cancelPaypalTransaction"
          }
        },
        "parameters": [{
          "name": "bid",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "authorizePaypalTransaction"
          }
        },
        "parameters": [{
          "name": "bid",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/invoice/external/{bid}": {
      "post": {
        "responses": {
          "default": {
            "description": "updateInvoice"
          }
        },
        "parameters": [{
          "name": "bid",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/newsfeeds/blog": {
      "get": {
        "responses": {
          "default": {
            "description": "getBlogFeed"
          }
        }
      }
    },
    "/newsfeeds/engineering": {
      "get": {
        "responses": {
          "default": {
            "description": "getEngineeringFeed"
          }
        }
      }
    },
    "/oauth/access_token": {
      "post": {
        "responses": {
          "default": {
            "description": "postAccessTokenRequest"
          }
        },
        "parameters": [{
          "name": "oauth_consumer_key",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_token",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_signature_method",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_signature",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_timestamp",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_nonce",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_version",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_verifier",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_callback",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_token_secret",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_callback_confirmed",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/oauth/access_token_query": {
      "post": {
        "responses": {
          "default": {
            "description": "postAccessTokenRequestQuery"
          }
        },
        "parameters": [{
          "name": "oauth_consumer_key",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_token",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_signature_method",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_signature",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_timestamp",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_nonce",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_version",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_verifier",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_callback",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_token_secret",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_callback_confirmed",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/oauth/authorize": {
      "get": {
        "responses": {
          "default": {
            "description": "authorizeForm"
          }
        },
        "parameters": [{
          "name": "Cookie",
          "required": false,
          "in": "header",
          "type": "string"
        }, {
          "name": "oauth_token",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      },
      "post": {
        "responses": {
          "default": {
            "description": "authorizeToken"
          }
        },
        "parameters": [{
          "name": "Cookie",
          "required": false,
          "in": "header",
          "type": "string"
        }, {
          "name": "almighty",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "access_organisations",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "manage_organisations",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "manage_organisations_services",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "manage_organisations_applications",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "manage_organisations_members",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "access_organisations_bills",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "access_organisations_credit_count",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "access_organisations_consumption_statistics",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "access_personal_information",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "manage_personal_information",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "manage_ssh_keys",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/oauth/request_token": {
      "post": {
        "responses": {
          "default": {
            "description": "postReqTokenRequest"
          }
        },
        "parameters": [{
          "name": "oauth_consumer_key",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_token",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_signature_method",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_signature",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_timestamp",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_nonce",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_version",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_verifier",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_callback",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_token_secret",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_callback_confirmed",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/oauth/request_token_query": {
      "post": {
        "responses": {
          "default": {
            "description": "postReqTokenRequestQueryString"
          }
        },
        "parameters": [{
          "name": "oauth_consumer_key",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_token",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_signature_method",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_signature",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_timestamp",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_nonce",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_version",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_verifier",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_callback",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_token_secret",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "oauth_callback_confirmed",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/oauth/rights": {
      "get": {
        "responses": {
          "default": {
            "description": "getAvailableRights"
          }
        }
      }
    },
    "/organisations": {
      "get": {
        "responses": {
          "default": {
            "description": "getUserOrganisationss"
          }
        },
        "parameters": [{
          "name": "user",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      },
      "post": {
        "responses": {
          "default": {
            "description": "createOrganisation"
          }
        }
      }
    },
    "/organisations/{id}": {
      "delete": {
        "responses": {
          "default": {
            "description": "deleteOrganisation"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "get": {
        "responses": {
          "default": {
            "description": "getOrganisation"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "editOrganisation"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/addonproviders": {
      "get": {
        "responses": {
          "default": {
            "description": "getProvidersInfo"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "post": {
        "responses": {
          "default": {
            "description": "createProvider"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/addonproviders/{providerId}": {
      "get": {
        "responses": {
          "default": {
            "description": "getProviderInfo"
          }
        },
        "parameters": [{
          "name": "providerId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "updateProviderInfos"
          }
        },
        "parameters": [{
          "name": "providerId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/addonproviders/{providerId}/features": {
      "get": {
        "responses": {
          "default": {
            "description": "getProviderFeatures"
          }
        },
        "parameters": [{
          "name": "providerId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "post": {
        "responses": {
          "default": {
            "description": "addProviderFeature"
          }
        },
        "parameters": [{
          "name": "providerId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/addonproviders/{providerId}/features/{featureId}": {
      "delete": {
        "responses": {
          "default": {
            "description": "deleteProviderFeature"
          }
        },
        "parameters": [{
          "name": "providerId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "featureId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/addonproviders/{providerId}/plans": {
      "get": {
        "responses": {
          "default": {
            "description": "getProviderPlans"
          }
        },
        "parameters": [{
          "name": "providerId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "post": {
        "responses": {
          "default": {
            "description": "addProviderPlan"
          }
        },
        "parameters": [{
          "name": "providerId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/addonproviders/{providerId}/plans/{planId}": {
      "delete": {
        "responses": {
          "default": {
            "description": "deleteProviderPlan"
          }
        },
        "parameters": [{
          "name": "providerId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "planId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "get": {
        "responses": {
          "default": {
            "description": "getProviderPlan"
          }
        },
        "parameters": [{
          "name": "providerId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "planId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "editProviderPlan"
          }
        },
        "parameters": [{
          "name": "providerId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "planId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/addonproviders/{providerId}/plans/{planId}/features/{featureName}": {
      "delete": {
        "responses": {
          "default": {
            "description": "deleteProviderPlanFeature"
          }
        },
        "parameters": [{
          "name": "featureName",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "providerId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "planId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "editProviderPlanFeature"
          }
        },
        "parameters": [{
          "name": "featureName",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "providerId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "planId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/addonproviders/{providerId}/sso": {
      "get": {
        "responses": {
          "default": {
            "description": "getSSOData"
          }
        },
        "parameters": [{
          "name": "providerId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/addonproviders/{providerId}/tags": {
      "get": {
        "responses": {
          "default": {
            "description": "getProviderTags"
          }
        },
        "parameters": [{
          "name": "providerId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/addonproviders/{providerId}/testers": {
      "post": {
        "responses": {
          "default": {
            "description": "addBetaTester"
          }
        },
        "parameters": [{
          "name": "providerId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/addons": {
      "get": {
        "responses": {
          "default": {
            "description": "getAddons"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "post": {
        "responses": {
          "default": {
            "description": "provisionAddon"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/addons/preorders": {
      "post": {
        "responses": {
          "default": {
            "description": "preorderAddon"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/addons/{addonId}": {
      "delete": {
        "responses": {
          "default": {
            "description": "deprovisionAddon"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "addonId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "get": {
        "responses": {
          "default": {
            "description": "getAddon"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "addonId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "updateAddonInfo"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "addonId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/addons/{addonId}/applications": {
      "get": {
        "responses": {
          "default": {
            "description": "getApplicationsLinkedToAddon"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "addonId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/addons/{addonId}/env": {
      "get": {
        "responses": {
          "default": {
            "description": "getAddonEnv"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "addonId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/addons/{addonId}/plan": {
      "put": {
        "responses": {
          "default": {
            "description": "changePlan"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "addonId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/addons/{addonId}/sso": {
      "get": {
        "responses": {
          "default": {
            "description": "getSSOData"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "addonId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/addons/{addonId}/tags": {
      "get": {
        "responses": {
          "default": {
            "description": "getAddonTags"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "addonId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/addons/{addonId}/tags/{tag}": {
      "delete": {
        "responses": {
          "default": {
            "description": "deleteAddonTag"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "tag",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "addonId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "addAddonTag"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "tag",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "addonId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/applications": {
      "get": {
        "responses": {
          "default": {
            "description": "getAllApplications"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "post": {
        "responses": {
          "default": {
            "description": "addApplication"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/applications/{appId}": {
      "delete": {
        "responses": {
          "default": {
            "description": "deleteApplication"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "get": {
        "responses": {
          "default": {
            "description": "getApplication"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "editApplication"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/applications/{appId}/addons": {
      "get": {
        "responses": {
          "default": {
            "description": "getAddonsLinkedToApplication"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "post": {
        "responses": {
          "default": {
            "description": "linkAddonToApplication"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/applications/{appId}/addons/env": {
      "get": {
        "responses": {
          "default": {
            "description": "getEnvOfAddonsLinkedToApplication"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/applications/{appId}/addons/{addonId}": {
      "delete": {
        "responses": {
          "default": {
            "description": "unlinkAddonFromApplication"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "addonId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/applications/{appId}/branch": {
      "put": {
        "responses": {
          "default": {
            "description": "setApplicationBranch"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/applications/{appId}/branches": {
      "get": {
        "responses": {
          "default": {
            "description": "getApplicationBranches"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/applications/{appId}/dependencies": {
      "get": {
        "responses": {
          "default": {
            "description": "getApplicationDependencies"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/applications/{appId}/dependencies/env": {
      "get": {
        "responses": {
          "default": {
            "description": "getApplicationDependenciesEnv"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/applications/{appId}/dependencies/{dependencyId}": {
      "delete": {
        "responses": {
          "default": {
            "description": "deleteApplicationDependency"
          }
        },
        "parameters": [{
          "name": "dependencyId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "addApplicationDependency"
          }
        },
        "parameters": [{
          "name": "dependencyId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/applications/{appId}/dependents": {
      "get": {
        "responses": {
          "default": {
            "description": "getApplicationDependents"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/applications/{appId}/deployments": {
      "get": {
        "responses": {
          "default": {
            "description": "getApplicationDeploymentsForOrga"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "limit",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "offset",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "action",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/applications/{appId}/deployments/{deploymentId}/instances": {
      "delete": {
        "responses": {
          "default": {
            "description": "getApplicationDeploymentsForOrga"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "deploymentId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/applications/{appId}/env": {
      "get": {
        "responses": {
          "default": {
            "description": "getApplicationEnv"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "editApplicationEnvironment"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/applications/{appId}/env/{envName}": {
      "delete": {
        "responses": {
          "default": {
            "description": "removeApplicationEnv"
          }
        },
        "parameters": [{
          "name": "envName",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "editApplicationEnv"
          }
        },
        "parameters": [{
          "name": "envName",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/applications/{appId}/exposed_env": {
      "get": {
        "responses": {
          "default": {
            "description": "getExposedEnv"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "updateExposedEnv"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/applications/{appId}/instances": {
      "delete": {
        "responses": {
          "default": {
            "description": "undeployApplication"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "get": {
        "responses": {
          "default": {
            "description": "getApplicationInstances"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "post": {
        "responses": {
          "default": {
            "description": "redeployApplication"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "commit",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "useCache",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/applications/{appId}/instances/{instanceId}": {
      "get": {
        "responses": {
          "default": {
            "description": "getApplicationInstance"
          }
        },
        "parameters": [{
          "name": "instanceId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/applications/{appId}/tags": {
      "get": {
        "responses": {
          "default": {
            "description": "getApplicationTags"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/applications/{appId}/tags/{tag}": {
      "delete": {
        "responses": {
          "default": {
            "description": "deleteApplicationTag"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "tag",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "addApplicationTag"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "tag",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/applications/{appId}/vhosts": {
      "get": {
        "responses": {
          "default": {
            "description": "getVhosts"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/applications/{appId}/vhosts/favourite": {
      "delete": {
        "responses": {
          "default": {
            "description": "unmarkFavouriteVhost"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "get": {
        "responses": {
          "default": {
            "description": "getFavouriteVhost"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "markFavouriteVhost"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/applications/{appId}/vhosts/{domain}": {
      "delete": {
        "responses": {
          "default": {
            "description": "removeVhost"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "domain",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "addVhost"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "domain",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/avatar": {
      "put": {
        "responses": {
          "default": {
            "description": "setOrgaAvatar\nsetOrgaAvatarFromSource"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/consumers": {
      "get": {
        "responses": {
          "default": {
            "description": "getConsumers"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "post": {
        "responses": {
          "default": {
            "description": "createConsumer"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/consumers/{key}": {
      "delete": {
        "responses": {
          "default": {
            "description": "deleteConsumer"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "key",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "get": {
        "responses": {
          "default": {
            "description": "getConsumer"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "key",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "updateConsumer"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "key",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/consumers/{key}/secret": {
      "get": {
        "responses": {
          "default": {
            "description": "getConsumerSecret"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "key",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/consumptions": {
      "get": {
        "responses": {
          "default": {
            "description": "getAmount"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "appId",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "from",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "to",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "for",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/credits": {
      "get": {
        "responses": {
          "default": {
            "description": "getAmount"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/instances": {
      "get": {
        "responses": {
          "default": {
            "description": "getInstancesForAllApps"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/members": {
      "get": {
        "responses": {
          "default": {
            "description": "getOrganisationMembers"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "post": {
        "responses": {
          "default": {
            "description": "addOrganisationMember"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "invitationKey",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/members/{userId}": {
      "delete": {
        "responses": {
          "default": {
            "description": "removeOrganisationMember"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "userId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "editOrganisationMember"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "userId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/payment-info": {
      "get": {
        "responses": {
          "default": {
            "description": "getPaymentInfo"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/payments/billings": {
      "get": {
        "responses": {
          "default": {
            "description": "getInvoices"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "post": {
        "responses": {
          "default": {
            "description": "buyDrops"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/payments/billings/unpaid": {
      "get": {
        "responses": {
          "default": {
            "description": "getUnpaidInvoices"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/payments/billings/{bid}": {
      "delete": {
        "responses": {
          "default": {
            "description": "deletePurchaseOrder"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "bid",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "get": {
        "responses": {
          "default": {
            "description": "getInvoice"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "bid",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "choosePaymentProvider"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "bid",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/payments/billings/{bid}.pdf": {
      "get": {
        "responses": {
          "default": {
            "description": "getPdfInvoice"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "bid",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "token",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/payments/fullprice/{price}": {
      "get": {
        "responses": {
          "default": {
            "description": "priceWithTax"
          }
        },
        "parameters": [{
          "name": "price",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/payments/methods": {
      "get": {
        "responses": {
          "default": {
            "description": "getPaymentMethods"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "post": {
        "responses": {
          "default": {
            "description": "addPaymentMethod"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/payments/methods/default": {
      "get": {
        "responses": {
          "default": {
            "description": "getDefaultMethod"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "setDefaultMethod"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/payments/methods/{mId}": {
      "delete": {
        "responses": {
          "default": {
            "description": "deletePaymentMethod"
          }
        },
        "parameters": [{
          "name": "mId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/payments/monthlyinvoice": {
      "get": {
        "responses": {
          "default": {
            "description": "getMonthlyInvoice"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/payments/monthlyinvoice/maxcredit": {
      "put": {
        "responses": {
          "default": {
            "description": "setMaxCreditsPerMonth"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/organisations/{id}/payments/recurring": {
      "delete": {
        "responses": {
          "default": {
            "description": "deleteRecurrentPayment"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "get": {
        "responses": {
          "default": {
            "description": "getRecurrentPayment"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/password_forgotten": {
      "get": {
        "responses": {
          "default": {
            "description": "getPasswordForgottenForm"
          }
        }
      },
      "post": {
        "responses": {
          "default": {
            "description": "askForPasswordResetViaForm"
          }
        },
        "parameters": [{
          "name": "login",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "drop_tokens",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/password_forgotten/{key}": {
      "get": {
        "responses": {
          "default": {
            "description": "confirmPasswordResetRequest"
          }
        },
        "parameters": [{
          "name": "key",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "post": {
        "responses": {
          "default": {
            "description": "resetPasswordForgotten"
          }
        },
        "parameters": [{
          "name": "key",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "pass",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "pass2",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/payments/coupons/{name}": {
      "get": {
        "responses": {
          "default": {
            "description": "getCoupon"
          }
        },
        "parameters": [{
          "name": "name",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/payments/providers": {
      "get": {
        "responses": {
          "default": {
            "description": "getAvailablePaymentProviders"
          }
        }
      }
    },
    "/payments/tokens/stripe": {
      "get": {
        "responses": {
          "default": {
            "description": "getStripeToken"
          }
        }
      }
    },
    "/payments/{bid}/end/stripe": {
      "post": {
        "responses": {
          "default": {
            "description": "endPaymentWithStripe"
          }
        },
        "parameters": [{
          "name": "bid",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/ping": {
      "get": {
        "responses": {
          "default": {
            "description": "ping"
          }
        }
      }
    },
    "/ping/stats": {
      "get": {
        "responses": {
          "default": {
            "description": "stats"
          }
        }
      }
    },
    "/products/addonproviders": {
      "get": {
        "responses": {
          "default": {
            "description": "getAddonProviders"
          }
        }
      }
    },
    "/products/addonproviders/{provider_id}": {
      "get": {
        "responses": {
          "default": {
            "description": "getAddonProvider"
          }
        },
        "parameters": [{
          "name": "provider_id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/products/countries": {
      "get": {
        "responses": {
          "default": {
            "description": "getCountries"
          }
        }
      }
    },
    "/products/countrycodes": {
      "get": {
        "responses": {
          "default": {
            "description": "getCountryCodes"
          }
        }
      }
    },
    "/products/instances": {
      "get": {
        "responses": {
          "default": {
            "description": "getAvailableInstances"
          }
        },
        "parameters": [{
          "name": "for",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/products/instances/{type: [^-]+}-{version}": {
      "get": {
        "responses": {
          "default": {
            "description": "getInstance"
          }
        },
        "parameters": [{
          "name": "type",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "version",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "for",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "app",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/products/mfa_kinds": {
      "get": {
        "responses": {
          "default": {
            "description": "getMFAKinds"
          }
        }
      }
    },
    "/products/packages": {
      "get": {
        "responses": {
          "default": {
            "description": "getAvailablePackages"
          }
        },
        "parameters": [{
          "name": "coupon",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "orgaId",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "currency",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/products/prices": {
      "get": {
        "responses": {
          "default": {
            "description": "getExcahngeRates"
          }
        }
      }
    },
    "/products/zones": {
      "get": {
        "responses": {
          "default": {
            "description": "getZones"
          }
        }
      }
    },
    "/self": {
      "delete": {
        "responses": {
          "default": {
            "description": "deleteUser"
          }
        }
      },
      "get": {
        "responses": {
          "default": {
            "description": "getUser"
          }
        }
      },
      "put": {
        "responses": {
          "default": {
            "description": "editUser"
          }
        }
      }
    },
    "/self/addons": {
      "get": {
        "responses": {
          "default": {
            "description": "getAddons"
          }
        }
      },
      "post": {
        "responses": {
          "default": {
            "description": "provisionAddon"
          }
        }
      }
    },
    "/self/addons/preorders": {
      "post": {
        "responses": {
          "default": {
            "description": "preorderAddon"
          }
        }
      }
    },
    "/self/addons/{addonId}": {
      "delete": {
        "responses": {
          "default": {
            "description": "deprovisionAddon"
          }
        },
        "parameters": [{
          "name": "addonId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "get": {
        "responses": {
          "default": {
            "description": "getAddon"
          }
        },
        "parameters": [{
          "name": "addonId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "renameAddon"
          }
        },
        "parameters": [{
          "name": "addonId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/addons/{addonId}/applications": {
      "get": {
        "responses": {
          "default": {
            "description": "getApplicationsLinkedToAddon"
          }
        },
        "parameters": [{
          "name": "addonId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/addons/{addonId}/env": {
      "get": {
        "responses": {
          "default": {
            "description": "getAddonEnv"
          }
        },
        "parameters": [{
          "name": "addonId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/addons/{addonId}/plan": {
      "put": {
        "responses": {
          "default": {
            "description": "changePlan"
          }
        },
        "parameters": [{
          "name": "addonId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/addons/{addonId}/sso": {
      "get": {
        "responses": {
          "default": {
            "description": "getSSOData"
          }
        },
        "parameters": [{
          "name": "addonId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/addons/{addonId}/tags": {
      "get": {
        "responses": {
          "default": {
            "description": "getAddonTags"
          }
        },
        "parameters": [{
          "name": "addonId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/addons/{addonId}/tags/{tag}": {
      "delete": {
        "responses": {
          "default": {
            "description": "deleteAddonTag"
          }
        },
        "parameters": [{
          "name": "tag",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "addonId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "addAddonTag"
          }
        },
        "parameters": [{
          "name": "tag",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "addonId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/applications": {
      "get": {
        "responses": {
          "default": {
            "description": "getApplications"
          }
        }
      },
      "post": {
        "responses": {
          "default": {
            "description": "addApplication"
          }
        }
      }
    },
    "/self/applications/{appId}": {
      "delete": {
        "responses": {
          "default": {
            "description": "deleteApplication"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "get": {
        "responses": {
          "default": {
            "description": "getApplication"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "editApplication"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/applications/{appId}/addons": {
      "get": {
        "responses": {
          "default": {
            "description": "getAddonsLinkedToApplication"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "post": {
        "responses": {
          "default": {
            "description": "linkAddonToApplication"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/applications/{appId}/addons/env": {
      "get": {
        "responses": {
          "default": {
            "description": "getEnvOfAddonsLinkedToApplication"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/applications/{appId}/addons/{addonId}": {
      "delete": {
        "responses": {
          "default": {
            "description": "unlinkAddonFromApplication"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "addonId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/applications/{appId}/branch": {
      "put": {
        "responses": {
          "default": {
            "description": "setApplicationBranch"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/applications/{appId}/branches": {
      "get": {
        "responses": {
          "default": {
            "description": "getApplicationBranches"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/applications/{appId}/dependencies": {
      "get": {
        "responses": {
          "default": {
            "description": "getApplicationDependencies"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/applications/{appId}/dependencies/env": {
      "get": {
        "responses": {
          "default": {
            "description": "getApplicationDependenciesEnv"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/applications/{appId}/dependencies/{dependencyId}": {
      "delete": {
        "responses": {
          "default": {
            "description": "deleteApplicationDependency"
          }
        },
        "parameters": [{
          "name": "dependencyId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "addApplicationDependency"
          }
        },
        "parameters": [{
          "name": "dependencyId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/applications/{appId}/dependents": {
      "get": {
        "responses": {
          "default": {
            "description": "getApplicationDependents"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/applications/{appId}/deployments": {
      "get": {
        "responses": {
          "default": {
            "description": "getApplicationDeployments"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "limit",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "offset",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "action",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/self/applications/{appId}/deployments/{deploymentId}/instances": {
      "delete": {
        "responses": {
          "default": {
            "description": "cancelDeploy"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "deploymentId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/applications/{appId}/env": {
      "get": {
        "responses": {
          "default": {
            "description": "editApplicationEnv"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "editApplicationEnvironment"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/applications/{appId}/env/{envName}": {
      "delete": {
        "responses": {
          "default": {
            "description": "removeApplicationEnv"
          }
        },
        "parameters": [{
          "name": "envName",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "editApplicationEnv"
          }
        },
        "parameters": [{
          "name": "envName",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/applications/{appId}/exposed_env": {
      "get": {
        "responses": {
          "default": {
            "description": "getExposedEnv"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "updateExposedEnv"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/applications/{appId}/instances": {
      "delete": {
        "responses": {
          "default": {
            "description": "undeployApplication"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "get": {
        "responses": {
          "default": {
            "description": "getApplicationInstances"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "post": {
        "responses": {
          "default": {
            "description": "redeployApplication"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "commit",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "useCache",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/self/applications/{appId}/instances/{instanceId}": {
      "get": {
        "responses": {
          "default": {
            "description": "getApplicationInstance"
          }
        },
        "parameters": [{
          "name": "instanceId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/applications/{appId}/tags": {
      "get": {
        "responses": {
          "default": {
            "description": "getApplicationTags"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/applications/{appId}/tags/{tag}": {
      "delete": {
        "responses": {
          "default": {
            "description": "deleteApplicationTag"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "tag",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "addApplicationTag"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "tag",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/applications/{appId}/vhosts": {
      "get": {
        "responses": {
          "default": {
            "description": "getVhosts"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/applications/{appId}/vhosts/favourite": {
      "delete": {
        "responses": {
          "default": {
            "description": "unmarkFavouriteVhost"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "get": {
        "responses": {
          "default": {
            "description": "getFavouriteVhost"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "markFavouriteVhost"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/applications/{appId}/vhosts/{domain}": {
      "delete": {
        "responses": {
          "default": {
            "description": "removeVhost"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "domain",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "addVhost"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "domain",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/avatar": {
      "put": {
        "responses": {
          "default": {
            "description": "setUserAvatar\nsetUserAvatarFromSource"
          }
        }
      }
    },
    "/self/change_password": {
      "put": {
        "responses": {
          "default": {
            "description": "changeUserPassword"
          }
        }
      }
    },
    "/self/confirmation_email": {
      "get": {
        "responses": {
          "default": {
            "description": "getConfirmationEmail"
          }
        }
      }
    },
    "/self/consumers": {
      "get": {
        "responses": {
          "default": {
            "description": "getConsumers"
          }
        }
      },
      "post": {
        "responses": {
          "default": {
            "description": "createConsumer"
          }
        }
      }
    },
    "/self/consumers/{key}": {
      "delete": {
        "responses": {
          "default": {
            "description": "deleteConsumer"
          }
        },
        "parameters": [{
          "name": "key",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "get": {
        "responses": {
          "default": {
            "description": "getConsumer"
          }
        },
        "parameters": [{
          "name": "key",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "updateConsumer"
          }
        },
        "parameters": [{
          "name": "key",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/consumers/{key}/secret": {
      "get": {
        "responses": {
          "default": {
            "description": "getConsumerSecret"
          }
        },
        "parameters": [{
          "name": "key",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/consumptions": {
      "get": {
        "responses": {
          "default": {
            "description": "getConsumptions"
          }
        },
        "parameters": [{
          "name": "appId",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "from",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "to",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "for",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/self/credits": {
      "get": {
        "responses": {
          "default": {
            "description": "getAmount"
          }
        }
      }
    },
    "/self/emails": {
      "get": {
        "responses": {
          "default": {
            "description": "getEmailAddresses"
          }
        }
      }
    },
    "/self/emails/{email}": {
      "delete": {
        "responses": {
          "default": {
            "description": "removeEmailAddress"
          }
        },
        "parameters": [{
          "name": "email",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "addEmailAddress"
          }
        },
        "parameters": [{
          "name": "email",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/id": {
      "get": {
        "responses": {
          "default": {
            "description": "getId"
          }
        }
      }
    },
    "/self/instances": {
      "get": {
        "responses": {
          "default": {
            "description": "getInstancesForAllApps"
          }
        }
      }
    },
    "/self/keys": {
      "get": {
        "responses": {
          "default": {
            "description": "getSshKeys"
          }
        }
      }
    },
    "/self/keys/{key}": {
      "delete": {
        "responses": {
          "default": {
            "description": "removeSshKey"
          }
        },
        "parameters": [{
          "name": "key",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "addSshKey"
          }
        },
        "parameters": [{
          "name": "key",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/mfa/{kind}": {
      "delete": {
        "responses": {
          "default": {
            "description": "deleteMFA"
          }
        },
        "parameters": [{
          "name": "kind",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "post": {
        "responses": {
          "default": {
            "description": "createMFA"
          }
        },
        "parameters": [{
          "name": "kind",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "favMFA"
          }
        },
        "parameters": [{
          "name": "kind",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/mfa/{kind}/backupcodes": {
      "get": {
        "responses": {
          "default": {
            "description": "getBackupCodes"
          }
        },
        "parameters": [{
          "name": "kind",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/mfa/{kind}/confirmation": {
      "post": {
        "responses": {
          "default": {
            "description": "validateMFA"
          }
        },
        "parameters": [{
          "name": "kind",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/payment-info": {
      "get": {
        "responses": {
          "default": {
            "description": "getPaymentInfo"
          }
        }
      }
    },
    "/self/payments/billings": {
      "get": {
        "responses": {
          "default": {
            "description": "getInvoices"
          }
        }
      },
      "post": {
        "responses": {
          "default": {
            "description": "buyDrops"
          }
        }
      }
    },
    "/self/payments/billings/{bid}": {
      "delete": {
        "responses": {
          "default": {
            "description": "deletePurchaseOrder"
          }
        },
        "parameters": [{
          "name": "bid",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "get": {
        "responses": {
          "default": {
            "description": "getInvoice"
          }
        },
        "parameters": [{
          "name": "bid",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "choosePaymentProvider"
          }
        },
        "parameters": [{
          "name": "bid",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/payments/billings/{bid}.pdf": {
      "get": {
        "responses": {
          "default": {
            "description": "getPdfInvoice"
          }
        },
        "parameters": [{
          "name": "bid",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "token",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/self/payments/fullprice/{price}": {
      "get": {
        "responses": {
          "default": {
            "description": "priceWithTax"
          }
        },
        "parameters": [{
          "name": "price",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/payments/methods": {
      "get": {
        "responses": {
          "default": {
            "description": "getUserPaymentMethods"
          }
        }
      },
      "post": {
        "responses": {
          "default": {
            "description": "addPaymentMethod"
          }
        }
      }
    },
    "/self/payments/methods/default": {
      "get": {
        "responses": {
          "default": {
            "description": "getDefaultMethod"
          }
        }
      },
      "put": {
        "responses": {
          "default": {
            "description": "setDefaultMethod"
          }
        }
      }
    },
    "/self/payments/methods/{mId}": {
      "delete": {
        "responses": {
          "default": {
            "description": "deleteUserCard"
          }
        },
        "parameters": [{
          "name": "mId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/payments/monthlyinvoice": {
      "get": {
        "responses": {
          "default": {
            "description": "getMonthlyInvoice"
          }
        }
      }
    },
    "/self/payments/monthlyinvoice/maxcredit": {
      "put": {
        "responses": {
          "default": {
            "description": "setMaxCreditsPerMonth"
          }
        }
      }
    },
    "/self/payments/recurring": {
      "delete": {
        "responses": {
          "default": {
            "description": "deleteRecurrentPayment"
          }
        }
      },
      "get": {
        "responses": {
          "default": {
            "description": "getRecurrentPayment"
          }
        }
      }
    },
    "/self/payments/tokens/stripe": {
      "get": {
        "responses": {
          "default": {
            "description": "getStripeToken"
          }
        }
      }
    },
    "/self/tokens": {
      "delete": {
        "responses": {
          "default": {
            "description": "revokeAllTokens"
          }
        }
      },
      "get": {
        "responses": {
          "default": {
            "description": "getSelfTokens"
          }
        }
      }
    },
    "/self/tokens/{token}": {
      "delete": {
        "responses": {
          "default": {
            "description": "revokeToken"
          }
        },
        "parameters": [{
          "name": "token",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/self/validate_email": {
      "get": {
        "responses": {
          "default": {
            "description": "validateEmail"
          }
        },
        "parameters": [{
          "name": "validationKey",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/session/login": {
      "get": {
        "responses": {
          "default": {
            "description": "getLoginForm"
          }
        },
        "parameters": [{
          "name": "secondaryEmailKey",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "deletionKey",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "fromAuthorize",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      },
      "post": {
        "responses": {
          "default": {
            "description": "login"
          }
        },
        "parameters": [{
          "name": "email",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "pass",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "from_authorize",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/session/mfa_login": {
      "post": {
        "responses": {
          "default": {
            "description": "mfaLogin"
          }
        },
        "parameters": [{
          "name": "mfa_kind",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "mfa_attempt",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "email",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "auth_id",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "from_authorize",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/session/signup": {
      "get": {
        "responses": {
          "default": {
            "description": "getSignupForm"
          }
        },
        "parameters": [{
          "name": "invitationKey",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "url_next",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/sessions/login": {
      "get": {
        "responses": {
          "default": {
            "description": "getLoginForm"
          }
        },
        "parameters": [{
          "name": "secondaryEmailKey",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "deletionKey",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "fromAuthorize",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      },
      "post": {
        "responses": {
          "default": {
            "description": "login"
          }
        },
        "parameters": [{
          "name": "email",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "pass",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "from_authorize",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/sessions/mfa_login": {
      "post": {
        "responses": {
          "default": {
            "description": "mfaLogin"
          }
        },
        "parameters": [{
          "name": "mfa_kind",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "mfa_attempt",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "email",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "auth_id",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "from_authorize",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/sessions/signup": {
      "get": {
        "responses": {
          "default": {
            "description": "getSignupForm"
          }
        },
        "parameters": [{
          "name": "invitationKey",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "url_next",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/summary": {
      "get": {
        "responses": {
          "default": {
            "description": "getSummary"
          }
        }
      }
    },
    "/users": {
      "post": {
        "responses": {
          "default": {
            "description": "createUser\ncreateUserFromForm"
          }
        },
        "parameters": [{
          "name": "invitationKey",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "addonBetaInvitationKey",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "email",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "pass",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "url_next",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "terms",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/users/{id}": {
      "get": {
        "responses": {
          "default": {
            "description": "getUser"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/users/{id}/applications": {
      "get": {
        "responses": {
          "default": {
            "description": "getApplications"
          }
        },
        "parameters": [{
          "name": "id",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/users/{userId}/git-info": {
      "get": {
        "responses": {
          "default": {
            "description": "getGitInfo"
          }
        },
        "parameters": [{
          "name": "userId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/validation/vat/{key}": {
      "get": {
        "responses": {
          "default": {
            "description": "validate"
          }
        },
        "parameters": [{
          "name": "key",
          "required": true,
          "in": "path",
          "type": "string"
        }, {
          "name": "action",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/vat_check": {
      "get": {
        "responses": {
          "default": {
            "description": "checkVat"
          }
        },
        "parameters": [{
          "name": "country",
          "required": false,
          "in": "query",
          "type": "string"
        }, {
          "name": "vat",
          "required": false,
          "in": "query",
          "type": "string"
        }]
      }
    },
    "/vendor/apps": {
      "get": {
        "responses": {
          "default": {
            "description": "listApps"
          }
        },
        "parameters": [{
          "name": "offset",
          "required": false,
          "in": "query",
          "type": "integer"
        }]
      }
    },
    "/vendor/apps/{addonId}": {
      "get": {
        "responses": {
          "default": {
            "description": "getApplicationInfo"
          }
        },
        "parameters": [{
          "name": "addonId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      },
      "put": {
        "responses": {
          "default": {
            "description": "editApplicationConfiguration"
          }
        },
        "parameters": [{
          "name": "addonId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    },
    "/vendor/apps/{addonId}/consumptions": {
      "post": {
        "responses": {
          "default": {
            "description": "billOwner"
          }
        },
        "parameters": [{
          "name": "addonId",
          "required": true,
          "in": "path",
          "type": "string"
        }]
      }
    }
  },
  "info": {
    "title": "",
    "version": "",
    "description": ""
  }
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


var Session = (function(_, querystring, oauthSignature, crypto) {
  var Session = function(client, settings) {
    var session = {};

    session.getOAuthParams = function(token_secret) {
      return {
        oauth_consumer_key: settings.API_CONSUMER_KEY,
        oauth_signature_method: "PLAINTEXT",
        oauth_signature: settings.API_CONSUMER_SECRET + "&" + (token_secret || ""),
        oauth_timestamp: Math.floor(Date.now()/1000),
        oauth_nonce: Math.floor(Math.random()*1000000)
      };
    };

    session.login = typeof window == "undefined" ? function(){} : function(oauth_callback) {
      var params = _.extend(session.getOAuthParams(), {
        oauth_callback: oauth_callback || window.location.href
      });

      var res = client.oauth.request_token.post().withHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": ""
      }).send(querystring.encode(params));

      res.onValue(function(data) {
        var parsed = querystring.decode(data);

        window.localStorage.setItem("consumer_oauth_token", parsed.oauth_token);
        window.localStorage.setItem("consumer_oauth_token_secret", parsed.oauth_token_secret);

        window.location = settings.API_HOST + "/oauth/authorize?oauth_token=" + encodeURIComponent(parsed.oauth_token);
      });
    };

    session.getAccessTokenFromQueryString = typeof window == "undefined" ? function(){} : function() {
      var params = querystring.decode(window.location.search.slice(1));

      params.consumer_oauth_token = window.localStorage.getItem("consumer_oauth_token") || "";
      params.consumer_oauth_token_secret = window.localStorage.getItem("consumer_oauth_token_secret") || "";

      return session.getAccessToken(params);
    };

    session.getAccessToken = function(params) {
      var oauthParams = _.extend(session.getOAuthParams(params.consumer_oauth_token_secret), {
        oauth_token: params.oauth_token,
        oauth_verifier: params.oauth_verifier
      });

      var res = client.oauth.access_token.post().withHeaders({
        "Content-Type": "application/x-www-form-urlencoded"
      }).send(querystring.encode(oauthParams));

      var s_accessTokens = res.map(function(data) {
        return querystring.decode(data);
      });

      s_accessTokens.onValue(function(tokens) {
        if(typeof window !== "undefined" && typeof window.localStorage != "undefined") {
          window.localStorage.setItem("user_oauth_token", tokens.oauth_token);
          window.localStorage.setItem("user_oauth_token_secret", tokens.oauth_token_secret);
        }
      });

      return s_accessTokens;
    };

    session.getAuthorization = function(tokens) {
      if(tokens.user_oauth_token && tokens.user_oauth_token_secret) {
        var params = _.extend(session.getOAuthParams(tokens.user_oauth_token_secret), {
          oauth_token: tokens.user_oauth_token
        });

        return  ["OAuth realm=\"" + settings.API_HOST + "/oauth\"",
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

    session.getHMACAuthorization = function(httpMethod, url, queryparams, tokens) {
      if(tokens.user_oauth_token && tokens.user_oauth_token_secret) {
        var params = _.extend({}, queryparams, session.getOAuthParams(tokens.user_oauth_token_secret), {
          oauth_signature_method: "HMAC-SHA512",
          oauth_token: tokens.user_oauth_token
        });

        var signature = session.signHmacSHA512(httpMethod, url, _.omit(params, "oauth_signature"), tokens);

        return  ["OAuth realm=\"" + settings.API_HOST + "/oauth\"",
                "oauth_consumer_key=\"" + params.oauth_consumer_key + "\"",
                "oauth_token=\"" + params.oauth_token + "\"",
                "oauth_signature_method=\"" + params.oauth_signature_method + "\"",
                "oauth_signature=\"" + signature + "\"",
                "oauth_timestamp=\"" + params.oauth_timestamp + "\"",
                "oauth_nonce=\"" + params.oauth_nonce + "\""].join(", ");
      }
      else {
        return "";
      }
    };

    session.signHmacSHA512 = function(httpMethod, url, params, tokens){
      var key = [
        settings.API_CONSUMER_SECRET,
        tokens.user_oauth_token_secret
      ].map(oauthSignature.rfc3986).join('&');
      var base = oauthSignature.generateBase(httpMethod, url, params);

      return crypto.createHmac("sha512", key).update(base).digest('base64');
    };

    session.remove = function() {
      if(typeof window !== "undefined" && typeof window.localStorage != "undefined") {
        window.localStorage.removeItem("consumer_oauth_token");
        window.localStorage.removeItem("consumer_oauth_token_secret");
        window.localStorage.removeItem("user_oauth_token");
        window.localStorage.removeItem("user_oauth_token_secret");
      }
    };

    return session;
  };

  return Session;
})(
  typeof require == "function" && require("lodash") ? require("lodash") : _,
  typeof require == "function" && require("querystring") ? require("querystring") : querystring,
  typeof require == "function" && require("oauth-sign") ? require("oauth-sign") : oauthSignature,
  typeof require == "function" && require("crypto") ? require("crypto") : crypto
);


var CleverAPI = (function(_, WadlClient) {
  var CleverAPI = function(settings) {
    _.defaults(settings, {
      API_HOST: "https://ccapi-preprod.cleverapps.io/v2",
      hooks: {}
    });

    var headers = !settings.API_AUTHORIZATION ? {} : {
      "Authorization": settings.API_AUTHORIZATION
    };

    var addAuthorizationHeader = (settings.API_OAUTH_TOKEN && settings.API_OAUTH_TOKEN_SECRET) && function(requestSettings) {
      // if the Authorization header is not yet defined
      if(!_.has(requestSettings.headers, 'Authorization')){
        requestSettings.headers.Authorization = client.session.getHMACAuthorization(requestSettings.method, requestSettings.uri, requestSettings.qs, {
          user_oauth_token: settings.API_OAUTH_TOKEN,
          user_oauth_token_secret: settings.API_OAUTH_TOKEN_SECRET
        });
      }

      return requestSettings;
    };

    var client = WadlClient.buildClient(methods, {
      host: settings.API_HOST,
      headers: _.extend({}, headers, {
        "Content-Type": "application/json"
      }),
      logger: settings.logger,
      hooks: _.defaults(settings.hooks, {
        beforeSend: addAuthorizationHeader
      }),
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
