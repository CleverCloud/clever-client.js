import { isTestDomain } from './domains.js';

/**
 * @typedef {import('./diag-domain-config.types.js').DomainDiagInfo} DomainDiagInfo
 * @typedef {import('./diag-domain-config.types.js').ResolveDnsResult} ResolveDnsResult
 * @typedef {import('./diag-domain-config.types.js').LoadBalancerDnsConfig} LoadBalancerDnsConfig
 * @typedef {import('./diag-domain-config.types.js').RecordDiag} RecordDiag
 * @typedef {import('./diag-domain-config.types.js').DomainDiag} DomainDiag
 * @typedef {import('./diag-domain-config.types.js').Record} Record
 * @typedef {import('./diag-domain-config.types.js').DiagSummary} DiagSummary
 */

/**
 * @param {DomainDiagInfo} domainInfo
 * @param {ResolveDnsResult|null} resolveDnsResult
 * @param {LoadBalancerDnsConfig|null} loadBalancerDnsConfig
 * @return {DomainDiag}
 */
export function diagDomainConfig(domainInfo, resolveDnsResult, loadBalancerDnsConfig) {
  if (isTestDomain(domainInfo.hostname)) {
    return {
      ...domainInfo,
      diagSummary: 'managed',
      diagDetails: [],
    };
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

  /** @type {Array<RecordDiag>} */
  const diagDetails = checkARecords(resolveDnsResult.aRecords, loadBalancerDnsConfig);

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
 * @param {Array<string>} aRecords
 * @param {LoadBalancerDnsConfig} loadBalancerDnsConfig
 * @returns {Array<RecordDiag>}
 */
function checkARecords(aRecords, loadBalancerDnsConfig) {
  /** @type {Array<RecordDiag>} */
  const diagDetails = [];

  for (const recordValue of aRecords) {
    /** @type {Record} */
    const record = { source: 'resolved', type: 'A', value: recordValue };
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
 * @param {Array<RecordDiag>} diagDetails
 * @returns {DiagSummary}
 */
function getSummaryCode(diagDetails) {
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
