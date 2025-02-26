import * as addon from './addon.js';
import * as addonProvider from './addon-provider.js';
import * as application from './application.js';
import * as backups from './backups.js';
import * as github from './github.js';
import * as log from './log.js';
import * as metrics from './metrics.js';
import * as notification from './notification.js';
import * as oauth from './oauth.js';
import * as oauthConsumer from './oauth-consumer.js';
import * as organisation from './organisation.js';
import * as product from './product.js';
import * as providers from './providers.js';
import * as saas from './saas.js';
import * as self from './self.js';
import * as unknown from './unknown.js';
import * as user from './user.js';
import * as warp10 from './warp-10.js';

export function initLegacyClient(prepareRequest) {
  const client = {
    application: {
      _: {
        environment: {
          get: prepareRequest(unknown.todo_getEnv, ['appId']),
          put: prepareRequest(unknown.todo_updateEnv, ['appId']),
        },
      },
    },
    authenticate: {
      post: prepareRequest(unknown.todo_postAuthenticate),
    },
    authorize: {
      post: prepareRequest(unknown.todo_postAuthorize),
    },
    backups: {
      _: {
        _: {
          get: prepareRequest(backups.getBackups, ['ownerId', 'ref']),
        },
      },
    },
    github: {
      get: prepareRequest(github.get),
      applications: {
        get: prepareRequest(github.getApplications),
      },
      callback: {
        get: prepareRequest(github.getCallback),
      },
      emails: {
        get: prepareRequest(github.getEmailsAddresses),
      },
      keys: {
        get: prepareRequest(github.getKeys),
      },
      link: {
        delete: prepareRequest(github.removeLink),
        get: prepareRequest(github.getLink),
      },
      login: {
        get: prepareRequest(github.getLogin),
      },
      redeploy: {
        post: prepareRequest(github.redeploy),
      },
      signup: {
        get: prepareRequest(github.signup),
        post: prepareRequest(github.finishSignup),
      },
      username: {
        get: prepareRequest(github.getUsername),
      },
    },
    invoice: {
      external: {
        _: {
          post: prepareRequest(unknown.todo_updateInvoice, ['bid']),
        },
        paypal: {
          _: {
            delete: prepareRequest(unknown.todo_cancelPaypalTransaction, ['bid']),
            put: prepareRequest(unknown.todo_authorizePaypalTransaction, ['bid']),
          },
        },
      },
    },
    logs: {
      _: {
        get: prepareRequest(log.getOldLogs, ['appId']),
        drains: {
          get: prepareRequest(log.getDrains, ['appId']),
          post: prepareRequest(log.createDrain, ['appId']),
          _: {
            delete: prepareRequest(log.deleteDrain, ['appId', 'drainId']),
            state: {
              put: prepareRequest(log.updateDrainState, ['appId', 'drainId']),
            },
          },
        },
      },
    },
    metrics: {
      read: {
        _: {
          get: prepareRequest(metrics.getToken, ['orgaId']),
        },
      },
    },
    newsfeeds: {
      blog: {
        get: prepareRequest(unknown.todo_getBlogFeed),
      },
      engineering: {
        get: prepareRequest(unknown.todo_getEngineeringFeed),
      },
    },
    notifications: {
      emailhooks: {
        _: {
          get: prepareRequest(notification.getEmailhooks, ['ownerId']),
          post: prepareRequest(notification.createEmailhook, ['ownerId']),
          _: {
            delete: prepareRequest(notification.deleteEmailhook, ['ownerId', 'id']),
            put: prepareRequest(notification.editEmailhook, ['ownerId', 'id']),
          },
        },
      },
      info: {
        events: {
          get: prepareRequest(notification.getAvailableEvents),
        },
        webhookformats: {
          get: prepareRequest(notification.getWebhookFormats),
        },
      },
      webhooks: {
        _: {
          get: prepareRequest(notification.getWebhooks, ['ownerId']),
          post: prepareRequest(notification.createWebhook, ['ownerId']),
          _: {
            delete: prepareRequest(notification.deleteWebhook, ['ownerId', 'id']),
            put: prepareRequest(notification.editWebhook, ['ownerId', 'id']),
          },
        },
      },
    },
    oauth: {
      access_token: {
        post: prepareRequest(oauth.fetchAccessToken),
      },
      access_token_query: {
        post: prepareRequest(unknown.todo_postAccessTokenRequestQuery),
      },
      authorize: {
        get: prepareRequest(unknown.todo_authorizeForm),
        post: prepareRequest(unknown.todo_authorizeToken),
      },
      login_data: {
        get: prepareRequest(oauth.getLoginData),
      },
      request_token: {
        post: prepareRequest(oauth.fetchRequestToken),
      },
      request_token_query: {
        post: prepareRequest(unknown.todo_postReqTokenRequestQueryString),
      },
      rights: {
        get: prepareRequest(unknown.todo_getAvailableRights),
      },
    },
    oidc: {
      _: {
        callback: {
          get: prepareRequest(unknown.todo_oidcCallback, ['service']),
        },
        login: {
          get: prepareRequest(unknown.todo_getOIDCLogin, ['service']),
        },
        signup: {
          get: prepareRequest(unknown.todo_oidcSignup, ['service']),
          post: prepareRequest(unknown.todo_oidcSignupEnd, ['service']),
        },
      },
    },
    organisations: {
      get: prepareRequest(organisation.getAll),
      post: prepareRequest(organisation.create),
      _: {
        delete: prepareRequest(organisation.remove, ['id']),
        get: prepareRequest(organisation.get, ['id']),
        put: prepareRequest(organisation.update, ['id']),
        addonproviders: {
          get: prepareRequest(addonProvider.getAll, ['id']),
          post: prepareRequest(addonProvider.create, ['id']),
          _: {
            delete: prepareRequest(addonProvider.remove, ['id', 'providerId']),
            get: prepareRequest(addonProvider.get, ['id', 'providerId']),
            put: prepareRequest(addonProvider.update, ['id', 'providerId']),
            features: {
              get: prepareRequest(addonProvider.getAllFeatures, ['id', 'providerId']),
              post: prepareRequest(addonProvider.addFeature, ['id', 'providerId']),
              _: {
                delete: prepareRequest(addonProvider.removeFeature, ['id', 'providerId', 'featureId']),
              },
            },
            plans: {
              get: prepareRequest(addonProvider.getAllPlans, ['id', 'providerId']),
              post: prepareRequest(addonProvider.addPlan, ['id', 'providerId']),
              _: {
                delete: prepareRequest(addonProvider.removePlan, ['id', 'providerId', 'planId']),
                get: prepareRequest(addonProvider.getPlan, ['id', 'providerId', 'planId']),
                put: prepareRequest(addonProvider.updatePlan, ['id', 'providerId', 'planId']),
                features: {
                  _: {
                    delete: prepareRequest(addonProvider.removePlanFeature, ['id', 'providerId', 'planId', 'featureName']),
                    put: prepareRequest(addonProvider.updatePlanFeature, ['id', 'providerId', 'planId', 'featureName']),
                  },
                },
              },
            },
            sso: {
              get: prepareRequest(addonProvider.getSsoData, ['id', 'providerId']),
            },
            tags: {
              get: prepareRequest(addonProvider.getAllTags, ['id', 'providerId']),
            },
            testers: {
              post: prepareRequest(addonProvider.addBetaTester, ['id', 'providerId']),
            },
          },
        },
        addons: {
          get: prepareRequest(addon.getAll, ['id']),
          post: prepareRequest(addon.create, ['id']),
          _: {
            delete: prepareRequest(addon.remove, ['id', 'addonId']),
            get: prepareRequest(addon.get, ['id', 'addonId']),
            put: prepareRequest(addon.update, ['id', 'addonId']),
            applications: {
              get: prepareRequest(addon.getLinkedApplications, ['id', 'addonId']),
            },
            env: {
              get: prepareRequest(addon.getAllEnvVars, ['id', 'addonId']),
            },
            instances: {
              get: prepareRequest(addon.getAllInstances, ['id', 'addonId']),
              _: {
                get: prepareRequest(addon.getInstance, ['id', 'addonId', 'instanceId']),
              },
            },
            migrations: {
              get: prepareRequest(addon.getAllMigrations, ['id', 'addonId']),
              post: prepareRequest(addon.updateMigration, ['id', 'addonId']),
              _: {
                delete: prepareRequest(addon.abortMigration, ['id', 'addonId', 'migrationId']),
                get: prepareRequest(addon.getMigration, ['id', 'addonId', 'migrationId']),
              },
              preorders: {
                get: prepareRequest(addon.todo_preorderMigration, ['id', 'addonId']),
              },
            },
            sso: {
              get: prepareRequest(addon.getSsoData, ['id', 'addonId']),
            },
            tags: {
              get: prepareRequest(addon.getAllTags, ['id', 'addonId']),
              put: prepareRequest(addon.replaceAddonTags, ['id', 'addonId']),
              _: {
                delete: prepareRequest(addon.removeTag, ['id', 'addonId', 'tag']),
                put: prepareRequest(addon.addTag, ['id', 'addonId', 'tag']),
              },
            },
          },
          preorders: {
            post: prepareRequest(addon.preorder, ['id']),
          },
        },
        applications: {
          get: prepareRequest(application.getAll, ['id']),
          post: prepareRequest(application.create, ['id']),
          _: {
            delete: prepareRequest(application.remove, ['id', 'appId']),
            get: prepareRequest(application.get, ['id', 'appId']),
            put: prepareRequest(application.update, ['id', 'appId']),
            addons: {
              get: prepareRequest(application.getAllLinkedAddons, ['id', 'appId']),
              post: prepareRequest(application.linkAddon, ['id', 'appId']),
              _: {
                delete: prepareRequest(application.unlinkAddon, ['id', 'appId', 'addonId']),
              },
              env: {
                get: prepareRequest(application.getAllEnvVarsForAddons, ['id', 'appId']),
              },
            },
            branch: {
              put: prepareRequest(application.setBranch, ['id', 'appId']),
            },
            branches: {
              get: prepareRequest(application.getAllBranches, ['id', 'appId']),
            },
            buildflavor: {
              put: prepareRequest(application.setBuildInstanceFlavor, ['id', 'appId']),
            },
            dependencies: {
              get: prepareRequest(application.getAllDependencies, ['id', 'appId']),
              _: {
                delete: prepareRequest(application.removeDependency, ['id', 'appId', 'dependencyId']),
                put: prepareRequest(application.addDependency, ['id', 'appId', 'dependencyId']),
              },
              env: {
                get: prepareRequest(application.getAllEnvVarsForDependencies, ['id', 'appId']),
              },
            },
            dependents: {
              get: prepareRequest(application.todo_getApplicationDependentsByOrgaAndAppId, ['id', 'appId']),
            },
            deployments: {
              get: prepareRequest(application.getAllDeployments, ['id', 'appId']),
              _: {
                get: prepareRequest(application.getDeployment, ['id', 'appId', 'deploymentId']),
                instances: {
                  delete: prepareRequest(application.cancelDeployment, ['id', 'appId', 'deploymentId']),
                },
              },
            },
            env: {
              get: prepareRequest(application.getAllEnvVars, ['id', 'appId']),
              put: prepareRequest(application.updateAllEnvVars, ['id', 'appId']),
              _: {
                delete: prepareRequest(application.removeEnvVar, ['id', 'appId', 'envName']),
                put: prepareRequest(application.updateEnvVar, ['id', 'appId', 'envName']),
              },
            },
            exposed_env: {
              get: prepareRequest(application.getAllExposedEnvVars, ['id', 'appId']),
              put: prepareRequest(application.updateAllExposedEnvVars, ['id', 'appId']),
            },
            instances: {
              delete: prepareRequest(application.undeploy, ['id', 'appId']),
              get: prepareRequest(application.getAllInstances, ['id', 'appId']),
              post: prepareRequest(application.redeploy, ['id', 'appId']),
              _: {
                get: prepareRequest(application.getInstance, ['id', 'appId', 'instanceId']),
              },
            },
            tags: {
              get: prepareRequest(application.getAllTags, ['id', 'appId']),
              put: prepareRequest(organisation.updateApplicationTags, ['id', 'appId']),
              _: {
                delete: prepareRequest(application.removeTag, ['id', 'appId', 'tag']),
                put: prepareRequest(application.updateTag, ['id', 'appId', 'tag']),
              },
            },
            tcpRedirs: {
              get: prepareRequest(application.getTcpRedirs, ['id', 'appId']),
              post: prepareRequest(application.addTcpRedir, ['id', 'appId']),
              _: {
                delete: prepareRequest(application.removeTcpRedir, ['id', 'appId', 'sourcePort']),
              },
            },
            udpRedirs: {
              get: prepareRequest(organisation.listApplicationUDPRedirections, ['id', 'appId']),
              post: prepareRequest(organisation.createApplicationUDPRedirection, ['id', 'appId']),
              _: {
                delete: prepareRequest(organisation.deleteApplicationUDPRedirection, ['id', 'appId', 'sourcePort']),
              },
            },
            vhosts: {
              get: prepareRequest(application.getAllDomains, ['id', 'appId']),
              _: {
                delete: prepareRequest(application.removeDomain, ['id', 'appId', 'domain']),
                put: prepareRequest(application.addDomain, ['id', 'appId', 'domain']),
              },
              favourite: {
                delete: prepareRequest(application.unmarkFavouriteDomain, ['id', 'appId']),
                get: prepareRequest(application.getFavouriteDomain, ['id', 'appId']),
                put: prepareRequest(application.markFavouriteDomain, ['id', 'appId']),
              },
            },
          },
        },
        avatar: {
          put: prepareRequest(organisation.updateAvatar, ['id']),
        },
        consumers: {
          get: prepareRequest(oauthConsumer.getAll, ['id']),
          post: prepareRequest(oauthConsumer.create, ['id']),
          _: {
            delete: prepareRequest(oauthConsumer.remove, ['id', 'key']),
            get: prepareRequest(oauthConsumer.get, ['id', 'key']),
            put: prepareRequest(oauthConsumer.update, ['id', 'key']),
            secret: {
              get: prepareRequest(oauthConsumer.getSecret, ['id', 'key']),
            },
          },
        },
        consumptions: {
          get: prepareRequest(organisation.getConsumptions, ['id']),
        },
        credits: {
          get: prepareRequest(organisation.getCredits, ['id']),
        },
        deployments: {
          get: prepareRequest(organisation.getAllDeployments, ['id']),
        },
        instances: {
          get: prepareRequest(organisation.getAllInstances, ['id']),
        },
        members: {
          get: prepareRequest(organisation.getAllMembers, ['id']),
          post: prepareRequest(organisation.addMember, ['id']),
          _: {
            delete: prepareRequest(organisation.removeMemeber, ['id', 'userId']),
            put: prepareRequest(organisation.updateMember, ['id', 'userId']),
          },
        },
        namespaces: {
          get: prepareRequest(organisation.getNamespaces, ['id']),
        },
        'payment-info': {
          get: prepareRequest(organisation.getPaymentInfo, ['id']),
        },
        payments: {
          billings: {
            get: prepareRequest(organisation.todo_getInvoicesByOrga, ['id']),
            post: prepareRequest(organisation.todo_buyDropsByOrga, ['id']),
            _: {
              delete: prepareRequest(organisation.deletePurchaseOrder, ['id', 'bid']),
              get: prepareRequest(organisation.getInvoice, ['id', 'bid']),
              put: prepareRequest(organisation.choosePaymentProvider, ['id', 'bid']),
            },
            '_.pdf': {
              get: prepareRequest(organisation.todo_getPdfInvoiceByOrga, ['id', 'bid']),
            },
            unpaid: {
              get: prepareRequest(organisation.todo_getUnpaidInvoicesByOrga_1, ['id']),
            },
          },
          fullprice: {
            _: {
              get: prepareRequest(organisation.todo_getPriceWithTaxByOrga, ['id', 'price']),
            },
          },
          methods: {
            get: prepareRequest(organisation.todo_getUnpaidInvoicesByOrga, ['id']),
            post: prepareRequest(organisation.todo_addPaymentMethodByOrga, ['id']),
            _: {
              delete: prepareRequest(organisation.todo_deletePaymentMethodByOrga, ['id', 'mId']),
            },
            default: {
              get: prepareRequest(organisation.todo_getDefaultMethodByOrga, ['id']),
              put: prepareRequest(organisation.todo_setDefaultMethodByOrga, ['id']),
            },
            newintent: {
              get: prepareRequest(organisation.getNewSetupIntent, ['id']),
            },
          },
          monthlyinvoice: {
            get: prepareRequest(organisation.getMonthlyInvoice, ['id']),
            maxcredit: {
              put: prepareRequest(organisation.todo_setMaxCreditsPerMonthByOrga, ['id']),
            },
          },
          recurring: {
            delete: prepareRequest(organisation.todo_deleteRecurrentPaymentByOrga, ['id']),
            get: prepareRequest(organisation.todo_getRecurrentPaymentByOrga, ['id']),
          },
          tokens: {
            stripe: {
              get: prepareRequest(organisation.getStripeToken, ['id']),
            },
          },
        },
      },
    },
    password_forgotten: {
      get: prepareRequest(unknown.todo_getPasswordForgottenForm),
      post: prepareRequest(unknown.todo_askForPasswordResetViaForm),
      _: {
        get: prepareRequest(unknown.todo_confirmPasswordResetRequest, ['key']),
        post: prepareRequest(unknown.todo_resetPasswordForgotten, ['key']),
      },
    },
    payments: {
      _: {
        end: {
          stripe: {
            post: prepareRequest(unknown.todo_endPaymentWithStripe, ['bid']),
            put: prepareRequest(unknown.todo_updateStripePayment, ['bid']),
          },
        },
      },
      assets: {
        pay_button: {
          _: {
            'button.png': {
              get: prepareRequest(unknown.todo_getInvoiceStatusButton, ['token']),
            },
          },
        },
      },
      coupons: {
        _: {
          get: prepareRequest(unknown.todo_getCoupon, ['name']),
        },
      },
      providers: {
        get: prepareRequest(unknown.todo_getAvailablePaymentProviders),
      },
      tokens: {
        stripe: {
          get: prepareRequest(unknown.todo_getStripeToken),
        },
      },
      webhooks: {
        stripe: {
          sepa: {
            post: prepareRequest(unknown.todo_stripeSepaWebhook),
          },
        },
      },
    },
    products: {
      addonproviders: {
        get: prepareRequest(product.getAllAddonProviders),
        _: {
          get: prepareRequest(product.getAddonProvider, ['provider_id']),
          informations: {
            get: prepareRequest(unknown.todo_getAddonProviderInfos, ['provider_id']),
          },
          versions: {
            get: prepareRequest(unknown.todo_getAddonProviderVersions, ['provider_id']),
          },
        },
      },
      countries: {
        get: prepareRequest(unknown.todo_getCountries),
      },
      countrycodes: {
        get: prepareRequest(unknown.todo_getCountryCodes),
      },
      flavors: {
        get: prepareRequest(unknown.todo_getFlavors),
      },
      instances: {
        get: prepareRequest(product.getAvailableInstances),
        '_-_': {
          get: prepareRequest(unknown.todo_getInstance, ['type', 'version']),
        },
      },
      mfa_kinds: {
        get: prepareRequest(unknown.todo_getMFAKinds),
      },
      packages: {
        get: prepareRequest(unknown.todo_getAvailablePackages),
      },
      prices: {
        get: prepareRequest(product.getCreditPrice),
      },
      zones: {
        get: prepareRequest(product.getAllZones),
      },
    },
    providers: {
      _: {
        _: {
          get: prepareRequest(providers.getAddon, ['providerId', 'addonId']),
        },
      },
      'es-addon': {
        tmp: {
          'services-flavors': {
            get: prepareRequest(providers.getEsOptionsFlavors),
          },
        },
      },
    },
    saas: {
      heptapod: {
        _: {
          'heptapod.host': {
            'price-prevision': {
              get: prepareRequest(saas.getHeptapodPricePrevision, ['id']),
            },
          },
        },
      },
    },
    self: {
      delete: prepareRequest(organisation.remove),
      get: prepareRequest(organisation.get),
      put: prepareRequest(organisation.update),
      addons: {
        get: prepareRequest(addon.getAll),
        post: prepareRequest(addon.create),
        _: {
          delete: prepareRequest(addon.remove, ['addonId']),
          get: prepareRequest(addon.get, ['addonId']),
          put: prepareRequest(addon.update, ['addonId']),
          applications: {
            get: prepareRequest(addon.getLinkedApplications, ['addonId']),
          },
          env: {
            get: prepareRequest(addon.getAllEnvVars, ['addonId']),
          },
          plan: {
            put: prepareRequest(addon.todo_changeSelfAddonPlanByAddonId, ['addonId']),
          },
          sso: {
            get: prepareRequest(addon.getSsoData, ['addonId']),
          },
          tags: {
            get: prepareRequest(addon.getAllTags, ['addonId']),
            _: {
              delete: prepareRequest(addon.removeTag, ['addonId', 'tag']),
              put: prepareRequest(addon.addTag, ['addonId', 'tag']),
            },
          },
        },
        preorders: {
          post: prepareRequest(addon.preorder),
        },
      },
      applications: {
        get: prepareRequest(application.getAll),
        post: prepareRequest(application.create),
        _: {
          delete: prepareRequest(application.remove, ['appId']),
          get: prepareRequest(application.get, ['appId']),
          put: prepareRequest(application.update, ['appId']),
          addons: {
            get: prepareRequest(application.getAllLinkedAddons, ['appId']),
            post: prepareRequest(application.linkAddon, ['appId']),
            _: {
              delete: prepareRequest(application.unlinkAddon, ['appId', 'addonId']),
            },
            env: {
              get: prepareRequest(application.getAllEnvVarsForAddons, ['appId']),
            },
          },
          branch: {
            put: prepareRequest(application.setBranch, ['appId']),
          },
          branches: {
            get: prepareRequest(application.getAllBranches, ['appId']),
          },
          buildflavor: {
            put: prepareRequest(application.setBuildInstanceFlavor, ['appId']),
          },
          dependencies: {
            get: prepareRequest(application.getAllDependencies, ['appId']),
            _: {
              delete: prepareRequest(application.removeDependency, ['appId', 'dependencyId']),
              put: prepareRequest(application.addDependency, ['appId', 'dependencyId']),
            },
            env: {
              get: prepareRequest(application.getAllEnvVarsForDependencies, ['appId']),
            },
          },
          dependents: {
            get: prepareRequest(application.todo_getSelfApplicationDependents, ['appId']),
          },
          deployments: {
            get: prepareRequest(application.getAllDeployments, ['appId']),
            _: {
              get: prepareRequest(application.getDeployment, ['appId', 'deploymentId']),
              instances: {
                delete: prepareRequest(application.cancelDeployment, ['appId', 'deploymentId']),
              },
            },
          },
          env: {
            get: prepareRequest(application.getAllEnvVars, ['appId']),
            put: prepareRequest(application.updateAllEnvVars, ['appId']),
            _: {
              delete: prepareRequest(application.removeEnvVar, ['appId', 'envName']),
              put: prepareRequest(application.updateEnvVar, ['appId', 'envName']),
            },
          },
          exposed_env: {
            get: prepareRequest(application.getAllExposedEnvVars, ['appId']),
            put: prepareRequest(application.updateAllExposedEnvVars, ['appId']),
          },
          instances: {
            delete: prepareRequest(application.undeploy, ['appId']),
            get: prepareRequest(application.getAllInstances, ['appId']),
            post: prepareRequest(application.redeploy, ['appId']),
            _: {
              get: prepareRequest(application.getInstance, ['appId', 'instanceId']),
            },
          },
          tags: {
            get: prepareRequest(application.getAllTags, ['appId']),
            _: {
              delete: prepareRequest(application.removeTag, ['appId', 'tag']),
              put: prepareRequest(application.updateTag, ['appId', 'tag']),
            },
          },
          vhosts: {
            get: prepareRequest(application.getAllDomains, ['appId']),
            _: {
              delete: prepareRequest(application.removeDomain, ['appId', 'domain']),
              put: prepareRequest(application.addDomain, ['appId', 'domain']),
            },
            favourite: {
              delete: prepareRequest(application.unmarkFavouriteDomain, ['appId']),
              get: prepareRequest(application.getFavouriteDomain, ['appId']),
              put: prepareRequest(application.markFavouriteDomain, ['appId']),
            },
          },
        },
      },
      avatar: {
        put: prepareRequest(organisation.updateAvatar),
      },
      change_password: {
        put: prepareRequest(user.todo_changeUserPassword),
      },
      cli_tokens: {
        get: prepareRequest(user.todo_getSelfCliTokens),
      },
      confirmation_email: {
        get: prepareRequest(user.todo_getConfirmationEmail),
      },
      consumers: {
        get: prepareRequest(oauthConsumer.getAll),
        post: prepareRequest(oauthConsumer.create),
        _: {
          delete: prepareRequest(oauthConsumer.remove, ['key']),
          get: prepareRequest(oauthConsumer.get, ['key']),
          put: prepareRequest(oauthConsumer.update, ['key']),
          secret: {
            get: prepareRequest(oauthConsumer.getSecret, ['key']),
          },
        },
      },
      consumptions: {
        get: prepareRequest(organisation.getConsumptions),
      },
      credits: {
        get: prepareRequest(organisation.getCredits),
      },
      emails: {
        get: prepareRequest(user.todo_getEmailAddresses),
        _: {
          delete: prepareRequest(user.todo_removeEmailAddress, ['email']),
          put: prepareRequest(user.todo_addEmailAddress, ['email']),
        },
      },
      id: {
        get: prepareRequest(user.getId),
      },
      instances: {
        get: prepareRequest(organisation.getAllInstances),
      },
      keys: {
        get: prepareRequest(user.todo_getSshKeys),
        _: {
          delete: prepareRequest(user.todo_removeSshKey, ['key']),
          put: prepareRequest(user.todo_addSshKey, ['key']),
        },
      },
      mfa: {
        _: {
          delete: prepareRequest(user.todo_deleteSelfMFA, ['kind']),
          post: prepareRequest(user.todo_createSelfMFA, ['kind']),
          put: prepareRequest(user.todo_setSelfFavouriteMFA, ['kind']),
          backupcodes: {
            get: prepareRequest(user.todo_getSelfBackupCodes, ['kind']),
          },
          confirmation: {
            post: prepareRequest(user.todo_validateSelfMFA, ['kind']),
          },
        },
      },
      'payment-info': {
        get: prepareRequest(organisation.getPaymentInfo),
      },
      payments: {
        billings: {
          get: prepareRequest(organisation.todo_getSelfInvoices),
          post: prepareRequest(organisation.todo_buySelfDrops),
          _: {
            delete: prepareRequest(organisation.deletePurchaseOrder, ['bid']),
            get: prepareRequest(organisation.getInvoice, ['bid']),
            put: prepareRequest(organisation.choosePaymentProvider, ['bid']),
          },
          '_.pdf': {
            get: prepareRequest(organisation.todo_getSelfPdfInvoiceById, ['bid']),
          },
        },
        fullprice: {
          _: {
            get: prepareRequest(organisation.todo_getSelfPriceWithTax, ['price']),
          },
        },
        methods: {
          get: prepareRequest(organisation.todo_getSelfPaymentMethods),
          post: prepareRequest(organisation.todo_addSelfPaymentMethod),
          _: {
            delete: prepareRequest(organisation.todo_deleteSelfCard, ['mId']),
          },
          default: {
            get: prepareRequest(organisation.todo_getSelfDefaultMethod),
            put: prepareRequest(organisation.todo_setSelfDefaultMethod),
          },
        },
        monthlyinvoice: {
          get: prepareRequest(organisation.getMonthlyInvoice),
          maxcredit: {
            put: prepareRequest(organisation.todo_setSelfMaxCreditsPerMonth),
          },
        },
        recurring: {
          delete: prepareRequest(organisation.todo_deleteSelfRecurrentPayment),
          get: prepareRequest(organisation.todo_getSelfRecurrentPayment),
        },
        tokens: {
          stripe: {
            get: prepareRequest(organisation.todo_getSelfStripeToken),
          },
        },
      },
      tokens: {
        delete: prepareRequest(user.todo_revokeSelfTokens),
        get: prepareRequest(user.todo_listSelfTokens),
        _: {
          delete: prepareRequest(user.todo_revokeSelfToken, ['token']),
        },
        current: {
          get: prepareRequest(self.getCurrentTokenInfo),
        },
      },
      validate_email: {
        get: prepareRequest(user.todo_validateEmail),
      },
    },
    session: {
      from: {
        _: {
          signup: {
            get: prepareRequest(unknown.todo_getSignupFormForSource, ['subscription_source']),
          },
        },
      },
      login: {
        get: prepareRequest(unknown.todo_getLoginForm),
        post: prepareRequest(unknown.todo_login),
      },
      mfa_login: {
        post: prepareRequest(unknown.todo_mfaLogin),
      },
      signup: {
        get: prepareRequest(unknown.todo_getSignupForm),
      },
    },
    sessions: {
      from: {
        _: {
          signup: {
            get: prepareRequest(unknown.todo_getSignupFormForSource_1, ['subscription_source']),
          },
        },
      },
      login: {
        get: prepareRequest(unknown.todo_getLoginForm_1),
        post: prepareRequest(oauth.loginWithEmailAndPassword),
      },
      mfa_login: {
        post: prepareRequest(oauth.loginWithMfa),
      },
      signup: {
        get: prepareRequest(unknown.todo_getSignupForm_1),
      },
    },
    summary: {
      get: prepareRequest(user.getSummary),
    },
    users: {
      post: prepareRequest(user.create),
      _: {
        get: prepareRequest(unknown.todo_getUser, ['id']),
        applications: {
          get: prepareRequest(unknown.todo_listUserApplications, ['id']),
        },
        'git-info': {
          get: prepareRequest(unknown.todo_getUserGitInformations, ['userId']),
        },
      },
    },
    validation: {
      vat: {
        _: {
          get: prepareRequest(unknown.todo_validate, ['key']),
        },
      },
    },
    vat_check: {
      get: prepareRequest(unknown.todo_checkVat),
    },
    vendor: {
      addons: {
        post: prepareRequest(unknown.todo_provisionOtherAddon),
      },
      apps: {
        get: prepareRequest(unknown.todo_listApps),
        _: {
          get: prepareRequest(unknown.todo_getApplicationInfo, ['addonId']),
          put: prepareRequest(unknown.todo_editApplicationConfiguration, ['addonId']),
          consumptions: {
            post: prepareRequest(unknown.todo_billOwner, ['addonId']),
          },
          logscollector: {
            get: prepareRequest(unknown.todo_logscollector, ['addonId']),
          },
          migration_callback: {
            put: prepareRequest(unknown.todo_endAddonMigration, ['addonId']),
          },
        },
      },
    },
    w10tokens: {
      accessLogs: {
        read: {
          _: {
            get: prepareRequest(warp10.getWarp10AccessLogsToken, ['orgaId']),
          },
        },
      },
    },
  };
  return client;
}
