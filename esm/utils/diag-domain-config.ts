import type {
  DiagSummary,
  DomainDiag,
  DomainDiagInfo,
  LoadBalancerDnsConfig,
  Record,
  RecordDiag,
  ResolveDnsResult,
} from './diag-domain-config.types.js';
import { isTestDomain } from './domains.js';

export function diagDomainConfig(
  domainInfo: DomainDiagInfo,
  resolveDnsResult: ResolveDnsResult | undefined,
  loadBalancerDnsConfig: LoadBalancerDnsConfig | undefined,
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

function checkARecords(aRecords: Array<string>, loadBalancerDnsConfig: LoadBalancerDnsConfig): Array<RecordDiag> {
  const diagDetails: Array<RecordDiag> = [];

  for (const recordValue of aRecords) {
    const record: Record = { source: 'resolved', type: 'A', value: recordValue };
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
