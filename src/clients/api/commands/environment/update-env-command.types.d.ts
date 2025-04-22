import type { ApplicationId } from '../../types/cc-api.types.js';
import type { EnvironmentVariable } from './environment.types.js';

export interface UpdateAllEnvVarsCommandInput extends ApplicationId {
  environment: Array<EnvironmentVariable>;
}

export interface UpdateAllEnvVarsCommandOutput {
  id: 'app_d0969d3a-5317-4e62-91e3-7adfe66acfa4';
  name: 'pds - test-logs';
  description: 'test-logs-pds';
  zone: 'par';
  zoneId: 'aad32a21-24f8-40b3-a750-baab218d927b';
  instance: {
    type: 'node';
    version: '20250115';
    variant: {
      id: '395103fb-d6e2-4fdd-93bc-bc99146f1ea2';
      slug: 'node';
      name: 'Node';
      deployType: 'node';
      logo: 'https://assets.clever-cloud.com/logos/nodejs.svg';
    };
    minInstances: 3;
    maxInstances: 3;
    maxAllowedInstances: 40;
    minFlavor: {
      name: 'XS';
      mem: 1152;
      cpus: 1;
      gpus: 0;
      disk: 0;
      price: 0.0222222222;
      available: true;
      microservice: false;
      machine_learning: false;
      nice: 0;
      price_id: 'apps.XS';
      memory: { unit: 'B'; value: 1073741824; formatted: '1024 MiB' };
    };
    maxFlavor: {
      name: 'XS';
      mem: 1152;
      cpus: 1;
      gpus: 0;
      disk: 0;
      price: 0.0222222222;
      available: true;
      microservice: false;
      machine_learning: false;
      nice: 0;
      price_id: 'apps.XS';
      memory: { unit: 'B'; value: 1073741824; formatted: '1024 MiB' };
    };
    flavors: [
      {
        name: 'pico';
        mem: 337;
        cpus: 1;
        gpus: 0;
        disk: 0;
        price: 0.00625;
        available: true;
        microservice: true;
        machine_learning: false;
        nice: 5;
        price_id: 'apps.pico';
        memory: { unit: 'B'; value: 268435456; formatted: '256 MiB' };
      },
    ];
    defaultEnv: {};
    lifetime: 'REGULAR';
    instanceAndVersion: 'node-20250115';
  };
  deployment: {
    shutdownable: false;
    type: 'GIT';
    repoState: 'CREATED';
    url: 'git+ssh://git@push-n3-par-clevercloud-customers.services.clever-cloud.com/app_d0969d3a-5317-4e62-91e3-7adfe66acfa4.git';
    httpUrl: 'https://push-n3-par-clevercloud-customers.services.clever-cloud.com/app_d0969d3a-5317-4e62-91e3-7adfe66acfa4.git';
  };
  vhosts: [{ fqdn: 'app-d0969d3a-5317-4e62-91e3-7adfe66acfa4.cleverapps.io' }];
  creationDate: 1708425156095;
  last_deploy: 82;
  archived: false;
  stickySessions: false;
  homogeneous: false;
  favourite: false;
  cancelOnPush: false;
  webhookUrl: null;
  webhookSecret: null;
  separateBuild: true;
  buildFlavor: {
    name: 'S';
    mem: 2048;
    cpus: 2;
    gpus: 0;
    disk: null;
    price: 0.0444444444;
    available: true;
    microservice: false;
    machine_learning: false;
    nice: 0;
    price_id: 'apps.S';
    memory: { unit: 'B'; value: 2147483648; formatted: '2048 MiB' };
  };
  ownerId: 'orga_540caeb6-521c-4a19-a955-efe6da35d142';
  state: 'SHOULD_BE_UP';
  commitId: 'ad11e491029d5a29fd3b616fef206e1ec259490a';
  appliance: null;
  branch: 'master';
  forceHttps: 'DISABLED';
  env: [{ name: 'aa'; value: 'zet' }, { name: 'bb'; value: 'sdg' }];
  deployUrl: 'git+ssh://git@push-n3-par-clevercloud-customers.services.clever-cloud.com/app_d0969d3a-5317-4e62-91e3-7adfe66acfa4.git';
}
