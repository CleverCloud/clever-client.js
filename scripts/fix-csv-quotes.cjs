#!/usr/bin/env node

const fs = require('fs');

const inputFile = 'interfaces-analysis-with-recommendations.csv';
const outputFile = 'interfaces-analysis-with-recommendations-fixed.csv';

const content = fs.readFileSync(inputFile, 'utf-8');
const lines = content.split('\n');

let fixedCount = 0;

const fixedLines = lines.map((line, index) => {
  // Skip header line
  if (index === 0) {
    return line;
  }

  // Skip empty lines
  if (!line.trim()) {
    return line;
  }

  let fixed = line;

  // Pattern 1: Opening quote without closing quote (handles "" inside)
  // Match: interface,field,"recommendation_text,type,optional,...
  // The recommendation may contain "" which are escaped quotes
  // We look for the pattern where after a quote, we have text (possibly with ""), then a comma, then a type
  const pattern1 = /^([^,]+),([^,]+),"((?:[^"]|"")+?),((?:string|boolean|number|null|Array<|'[^']*'|[A-Z])[^,]*),/;
  if (pattern1.test(line)) {
    fixed = line.replace(pattern1, (match, iface, field, recommendation, type) => {
      fixedCount++;
      return `${iface},${field},"${recommendation}",${type},`;
    });
  }

  // Pattern 2: Closing quote without opening quote
  // Match: interface,field,recommendation_text",type,optional,...
  if (fixed === line) {
    const pattern2 = /^([^,]+),([^,]+),([^",]+)",((?:string|boolean|number|null|Array<|'[^']*'|[A-Z])[^,]*),/;
    if (pattern2.test(line)) {
      fixed = line.replace(pattern2, (match, iface, field, recommendation, type) => {
        fixedCount++;
        return `${iface},${field},"${recommendation}",${type},`;
      });
    }
  }

  // Pattern 3: Opening quote without closing quote when type is a string literal like 'link-to-application'
  // Match: interface,field,"recommendation_text,'literal',optional,...
  if (fixed === line) {
    const pattern3 = /^([^,]+),([^,]+),"((?:[^"]|"")+?),('[^']*'),/;
    if (pattern3.test(line)) {
      fixed = line.replace(pattern3, (match, iface, field, recommendation, type) => {
        fixedCount++;
        return `${iface},${field},"${recommendation}",${type},`;
      });
    }
  }

  // Pattern 4: Closing quote without opening when type is string literal
  // Match: interface,field,recommendation_text",'literal',optional,...
  if (fixed === line) {
    const pattern4 = /^([^,]+),([^,]+),([^",]+)",(('[^']*')|('[^']*'\s*\|\s*'[^']*'(?:\s*\|\s*'[^']*')*)),/;
    if (pattern4.test(line)) {
      fixed = line.replace(pattern4, (match, iface, field, recommendation, type) => {
        fixedCount++;
        return `${iface},${field},"${recommendation}",${type},`;
      });
    }
  }

  // Pattern 5: Recommendations with "" (escaped quotes) missing opening quote
  // Match: interface,field,text with ""quotes"" inside",type,optional,...
  // This specifically handles the case where the recommendation contains ""
  if (fixed === line) {
    const pattern5 = /^([^,]+),([^,]+),([^,]*"".+?""[^"]*)",((?:string|boolean|number|null|Array<|'[^']*'(?:\s*\|\s*'[^']*')*|[A-Z])[^,]*),/;
    if (pattern5.test(line)) {
      fixed = line.replace(pattern5, (match, iface, field, recommendation, type) => {
        fixedCount++;
        return `${iface},${field},"${recommendation}",${type},`;
      });
    }
  }

  return fixed;
});

fs.writeFileSync(outputFile, fixedLines.join('\n'), 'utf-8');
console.log(`Fixed CSV written to ${outputFile}`);
console.log(`Total lines processed: ${lines.length}`);
console.log(`Lines fixed: ${fixedCount}`);
