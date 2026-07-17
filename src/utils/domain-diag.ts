import { isTestDomain } from './domain-utils.ts';

/**
 * The minimal domain description needed to run a DNS diagnosis.
 */
export interface DomainDiagInfo {
  /** The domain hostname (e.g. `www.example.com`). */
  hostname: string;
  /** The path prefix the domain is routed on (e.g. `/api`). */
  pathPrefix: string;
  /** Whether the hostname is an apex domain (e.g. `example.com`, with no subdomain). */
  isApex: boolean;
}

/**
 * The DNS records currently resolved for a domain.
 */
export interface ResolveDnsResult {
  /** The `A` records resolved for the domain. */
  aRecords: Array<string>;
  /** The `CNAME` records resolved for the domain. */
  cnameRecords: Array<string>;
}

/**
 * The DNS configuration expected by the Clever Cloud load balancer.
 */
export interface LoadBalancerDnsConfig {
  /** The `A` records the domain should point to. */
  aRecords: Array<string>;
  /** The `CNAME` record the domain should point to. */
  cnameRecord: string;
}

/**
 * The result of a domain DNS diagnosis: the input {@link DomainDiagInfo} plus a summary and per-record details.
 */
export interface DomainDiag extends DomainDiagInfo {
  /** The overall diagnosis outcome. */
  diagSummary: DiagSummary;
  /** The per-record diagnosis details. */
  diagDetails: Array<RecordDiag>;
}

/**
 * The overall outcome of a domain diagnosis:
 * - `managed`: the domain is a Clever Cloud test domain, DNS is managed automatically.
 * - `no-config`: no relevant DNS record is configured.
 * - `invalid`: at least one resolved record points somewhere unexpected.
 * - `incomplete`: some expected records are missing but none are wrong.
 * - `valid`: DNS is correctly configured.
 */
export type DiagSummary = 'managed' | 'no-config' | 'invalid' | 'incomplete' | 'valid';

/**
 * The diagnosis of a single DNS record.
 */
export interface RecordDiag {
  /** The diagnosis code describing the record's status. */
  code: 'valid-a' | 'unknown-a' | 'missing-a' | 'suggested-cname' | 'unknown-cname' | 'missing-cname' | 'test-only';
  /** The record this diagnosis refers to, when applicable. */
  record?: DomainRecord;
}

/**
 * A DNS record, either resolved from the domain or expected by the load balancer.
 */
export type DomainRecord = {
  /** Whether the record was `resolved` from DNS or is the `expected` configuration. */
  source: 'resolved' | 'expected';
  /** The record type. */
  type: 'CNAME' | 'A';
  /** The record value (an IP address for `A`, a hostname for `CNAME`). */
  value: string;
};

/**
 * Diagnoses the DNS configuration of a domain by comparing its resolved records against the
 * records expected by the Clever Cloud load balancer.
 *
 * Test domains (`*.cleverapps.io`) are managed automatically and always return a `managed`
 * summary with no details. For any other domain, both `resolveDnsResult` and
 * `loadBalancerDnsConfig` are required.
 *
 * @param domainInfo The domain to diagnose.
 * @param resolveDnsResult The DNS records currently resolved for the domain. Required for non-test domains.
 * @param loadBalancerDnsConfig The DNS records expected by the load balancer. Required for non-test domains.
 * @returns The diagnosis, with an overall summary and per-record details.
 * @throws {Error} If the domain is not a test domain and either `resolveDnsResult` or `loadBalancerDnsConfig` is missing.
 */
export function diagDomain(
  domainInfo: DomainDiagInfo,
  resolveDnsResult?: ResolveDnsResult,
  loadBalancerDnsConfig?: LoadBalancerDnsConfig,
): DomainDiag {
  if (isTestDomain(domainInfo.hostname)) {
    return {
      ...domainInfo,
      diagSummary: 'managed',
      diagDetails: [],
    };
  }

  // For non-test domains, DNS resolution and load balancer config are required
  if (resolveDnsResult == null || loadBalancerDnsConfig == null) {
    throw new Error('Cannot diagnose a non-test domain without DNS resolution and load balancer config');
  }

  if (!domainInfo.isApex && resolveDnsResult.aRecords.length === 0 && resolveDnsResult.cnameRecords.length === 0) {
    return {
      ...domainInfo,
      diagSummary: 'no-config',
      diagDetails: [
        {
          code: 'missing-cname',
          record: { source: 'expected', type: 'CNAME', value: loadBalancerDnsConfig.cnameRecord },
        },
      ],
    };
  }

  if (!domainInfo.isApex && resolveDnsResult.cnameRecords.length > 0 && resolveDnsResult.aRecords.length === 0) {
    return {
      ...domainInfo,
      diagSummary: 'invalid',
      diagDetails: [
        {
          code: 'missing-cname',
          record: { source: 'expected', type: 'CNAME', value: loadBalancerDnsConfig.cnameRecord },
        },
        {
          code: 'unknown-cname',
          record: { source: 'resolved', type: 'CNAME', value: resolveDnsResult.cnameRecords[0] },
        },
      ],
    };
  }

  const diagDetails: Array<RecordDiag> = checkARecords(resolveDnsResult.aRecords, loadBalancerDnsConfig);

  const someMissingARecord = diagDetails.some((recordDiag) => recordDiag.code === 'missing-a');
  const someUnknownARecord = diagDetails.some((result) => result.code === 'unknown-a');
  const hasCname = resolveDnsResult.cnameRecords.length > 0;

  if (!domainInfo.isApex && (someUnknownARecord || someMissingARecord || !hasCname)) {
    diagDetails.push({
      code: someUnknownARecord ? 'missing-cname' : 'suggested-cname',
      record: { source: 'expected', type: 'CNAME', value: loadBalancerDnsConfig.cnameRecord },
    });
    if (hasCname) {
      diagDetails.push({
        code: 'unknown-cname',
        record: { source: 'resolved', type: 'CNAME', value: resolveDnsResult.cnameRecords[0] },
      });
    }
  }

  return {
    ...domainInfo,
    diagSummary: getSummaryCode(diagDetails),
    diagDetails,
  };
}

/**
 * Compares the resolved `A` records against those expected by the load balancer, flagging each as
 * `valid-a` (expected and present), `unknown-a` (present but not expected) or `missing-a` (expected but absent).
 *
 * @param aRecords The `A` records resolved for the domain.
 * @param loadBalancerDnsConfig The DNS records expected by the load balancer.
 * @returns One {@link RecordDiag} per resolved and expected `A` record.
 */
function checkARecords(aRecords: Array<string>, loadBalancerDnsConfig: LoadBalancerDnsConfig): Array<RecordDiag> {
  const diagDetails: Array<RecordDiag> = [];

  for (const recordValue of aRecords) {
    const record: DomainRecord = { source: 'resolved', type: 'A', value: recordValue };
    if (loadBalancerDnsConfig.aRecords.includes(recordValue)) {
      diagDetails.push({ code: 'valid-a', record });
    } else {
      diagDetails.push({ code: 'unknown-a', record });
    }
  }

  for (const recordValue of loadBalancerDnsConfig.aRecords) {
    if (!aRecords.includes(recordValue)) {
      diagDetails.push({
        code: 'missing-a',
        record: { source: 'expected', type: 'A', value: recordValue },
      });
    }
  }

  return diagDetails;
}

/**
 * Derives the overall {@link DiagSummary} from the per-record diagnosis details.
 *
 * @param diagDetails The per-record diagnosis details.
 * @returns The overall diagnosis summary.
 */
function getSummaryCode(diagDetails: Array<RecordDiag>): DiagSummary {
  const hasError = diagDetails.some((diag) => diag.code === 'unknown-a');
  const hasMissing = diagDetails.some((diag) => diag.code === 'missing-a');
  const allMissing = diagDetails.every((diag) => diag.code === 'missing-a');

  if (allMissing) {
    return 'no-config';
  } else if (hasError) {
    return 'invalid';
  } else if (hasMissing) {
    return 'incomplete';
  } else {
    return 'valid';
  }
}
