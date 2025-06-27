export interface GetProductElasticsearchInfoCommandOutput {
  services: {
    apm: ElasticsearchServiceInfo;
    kibana: ElasticsearchServiceInfo;
  };
}

export interface ElasticsearchServiceInfo {
  name: string;
  mem: number;
  cpus: number;
  gpus: number;
  price: number;
  available: true;
  microservice: false;
  nice: number;
  // renamed from price_id and transformed to lower case
  priceId: string;
}
