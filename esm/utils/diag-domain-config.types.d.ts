export interface DomainDiagInfo {
  hostname: string;
  pathPrefix: string;
  isApex: boolean;
}

export interface DomainInfo extends DomainDiagInfo {
  id: string;
  isWildcard: boolean;
  isPrimary: boolean;
}

export interface ResolveDnsResult {
  aRecords: Array<string>;
  cnameRecords: Array<string>;
}

export interface LoadBalancerDnsConfig {
  aRecords: Array<string>;
  cnameRecord: string;
}

export interface DomainDiag extends DomainDiagInfo {
  diagSummary: DiagSummary;
  diagDetails: Array<RecordDiag>;
}

export type DiagSummary =
  | "managed"
  | "no-config"
  | "invalid"
  | "incomplete"
  | "valid"
  | "private";

export interface RecordDiag {
  code:
    | "valid-a"
    | "unknown-a"
    | "missing-a"
    | "suggested-cname"
    | "unknown-cname"
    | "missing-cname"
    | "test-only";
  record?: Record;
}

export type Record = {
  source: "resolved" | "expected";
  type: "CNAME" | "A";
  value: string;
};
