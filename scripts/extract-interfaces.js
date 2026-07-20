#!/usr/bin/env node

import ts from 'typescript';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getAllDtsFiles(dir) {
  const files = [];

  function walk(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.d.ts')) {
        files.push(fullPath);
      }
    }
  }

  walk(dir);
  return files;
}

function getLeadingComment(node, sourceFile) {
  const fullText = sourceFile.getFullText();
  const commentRanges = ts.getLeadingCommentRanges(fullText, node.getFullStart());

  if (!commentRanges || commentRanges.length === 0) {
    return '';
  }

  // Get the last comment before the node (most relevant)
  const lastComment = commentRanges[commentRanges.length - 1];
  const commentText = fullText.substring(lastComment.pos, lastComment.end);

  // Clean up comment markers
  return commentText
    .replace(/^\/\*\*?/, '')  // Remove /** or /*
    .replace(/\*\/$/, '')      // Remove */
    .replace(/^\/\//, '')      // Remove //
    .split('\n')
    .map(line => line.replace(/^\s*\*?\s?/, '').trim())
    .filter(line => line.length > 0)
    .join(' ')
    .trim();
}

function getTypeString(type) {
  if (!type) {
    return 'any';
  }

  return type.getText();
}

function extractInterfaceInfo(sourceFile, filepath) {
  const results = [];

  function visit(node) {
    if (ts.isInterfaceDeclaration(node)) {
      const interfaceName = node.name.text;
      const isExported = node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword) ?? false;
      const exportModifier = isExported ? 'export' : '';

      // Get extended interfaces
      const extendsClause = node.heritageClauses?.find(
        clause => clause.token === ts.SyntaxKind.ExtendsKeyword
      );
      const extendsList = extendsClause?.types.map(t => t.expression.getText()).join(', ') ?? '';

      // Process each member
      for (const member of node.members) {
        if (ts.isPropertySignature(member) && member.name) {
          const fieldName = member.name.getText(sourceFile);
          const typeString = getTypeString(member.type);
          const isOptional = member.questionToken !== undefined;
          const isReadonly = member.modifiers?.some(m => m.kind === ts.SyntaxKind.ReadonlyKeyword) ?? false;
          const comment = getLeadingComment(member, sourceFile);
          const lineNumber = sourceFile.getLineAndCharacterOfPosition(member.getStart(sourceFile)).line + 1;

          results.push({
            filepath,
            interface: interfaceName,
            field: fieldName,
            type: typeString,
            optional: isOptional,
            comment,
            line_number: lineNumber,
            export_modifier: exportModifier,
            extends: extendsList,
            readonly: isReadonly,
          });
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return results;
}

function escapeCSV(value) {
  const stringValue = String(value);

  // If the value contains comma, newline, or double quote, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

function writeCSV(data, outputPath) {
  const headers = [
    'filepath',
    'interface',
    'field',
    'type',
    'optional',
    'comment',
    'line_number',
    'export_modifier',
    'extends',
    'readonly',
  ];

  const lines = [
    headers.join(','),
    ...data.map(row => [
      escapeCSV(row.filepath),
      escapeCSV(row.interface),
      escapeCSV(row.field),
      escapeCSV(row.type),
      escapeCSV(row.optional),
      escapeCSV(row.comment),
      escapeCSV(row.line_number),
      escapeCSV(row.export_modifier),
      escapeCSV(row.extends),
      escapeCSV(row.readonly),
    ].join(','))
  ];

  fs.writeFileSync(outputPath, lines.join('\n') + '\n', 'utf-8');
}

function main() {
  const targetDir = path.join(__dirname, '..', 'src', 'clients', 'cc-api', 'commands');
  const outputPath = path.join(__dirname, '..', 'interfaces-analysis.csv');

  console.log(`Scanning directory: ${targetDir}`);

  const dtsFiles = getAllDtsFiles(targetDir);
  console.log(`Found ${dtsFiles.length} .d.ts files`);

  const allResults = [];

  for (const file of dtsFiles) {
    const sourceCode = fs.readFileSync(file, 'utf-8');
    const sourceFile = ts.createSourceFile(
      file,
      sourceCode,
      ts.ScriptTarget.Latest,
      true
    );

    // Make filepath relative to project root
    const relativePath = path.relative(path.join(__dirname, '..'), file);
    const results = extractInterfaceInfo(sourceFile, relativePath);
    allResults.push(...results);
  }

  console.log(`Extracted ${allResults.length} interface fields`);

  writeCSV(allResults, outputPath);
  console.log(`CSV written to: ${outputPath}`);
}

main();
