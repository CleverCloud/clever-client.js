#!/usr/bin/env node

const fs = require('fs');

const file = 'interfaces-analysis-with-recommendations-fixed.csv';

try {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  let issues = 0;

  lines.forEach((line, index) => {
    if (!line.trim()) return;

    // Check for unclosed quotes
    const quoteCount = (line.match(/"/g) || []).length;
    if (quoteCount % 2 !== 0) {
      console.log(`Line ${index + 1}: Unclosed quote detected`);
      console.log(`  ${line.substring(0, 100)}...`);
      issues++;
    }
  });

  if (issues === 0) {
    console.log('✅ CSV validation passed! No unclosed quotes detected.');
    console.log(`Total lines validated: ${lines.length}`);
  } else {
    console.log(`\n❌ Found ${issues} lines with quote issues`);
  }
} catch (error) {
  console.error('Error reading file:', error.message);
}
