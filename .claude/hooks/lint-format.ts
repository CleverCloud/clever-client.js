// Lints and formats the file that Claude Code just changed.
//
// Claude Code runs this script as a PostToolUse hook (see `.claude/settings.json`), after each Edit or Write.
// It reads the hook payload on stdin, then runs Oxlint (with `--fix`) and Oxfmt on the changed file.
// Files outside the repository are skipped, symlinks included.
//
// When Oxlint errors remain after `--fix`, or when Oxfmt fails, the script prints them on stderr and exits with code 2,
// so that Claude Code feeds them back to the agent.
//
// Usage: node .claude/hooks/lint-format.ts < payload.json
//
// Environment variables:
//   CLAUDE_PROJECT_DIR  Root of the repository, set by Claude Code (defaults to the current directory)
//
// Example:
//   echo '{"tool_input":{"file_path":"src/lib/index.ts"}}' | node .claude/hooks/lint-format.ts

import { spawnSync, type SpawnSyncReturns } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

/** Extensions of the files that Oxlint lints. */
const LINT_FILE_REGEX = /\.[cm]?[jt]sx?$/;

/** The part of the PostToolUse payload that the hook reads. */
interface Payload {
  /** Input of the Edit or Write tool. */
  tool_input?: {
    /** Path of the changed file, absolute or relative to the repository root. */
    file_path?: unknown;
  };
}

const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const payload = JSON.parse(fs.readFileSync(0, 'utf-8')) as Payload;
const filePath = payload.tool_input?.file_path;

if (typeof filePath === 'string') {
  const relativePath = getPathInsideProject(filePath);
  if (relativePath != null) {
    lintAndFormat(relativePath);
  }
}

/**
 * Resolves a file path against the repository root, through symlinks.
 * @param filePath - Path of the file, absolute or relative to the repository root
 * @returns The path relative to the repository root, with `/` separators, or `null` for a missing file or a file outside the repository
 */
function getPathInsideProject(filePath: string): string | null {
  const absolutePath = path.resolve(projectDir, filePath);
  if (!fs.existsSync(absolutePath)) {
    return null;
  }
  const relativePath = path.relative(fs.realpathSync(projectDir), fs.realpathSync(absolutePath));
  if (relativePath === '..' || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) {
    return null;
  }
  return relativePath.split(path.sep).join('/');
}

/**
 * Lints and formats a file, and reports the remaining errors on stderr with exit code 2.
 * @param relativePath - Path of the file, relative to the repository root
 */
function lintAndFormat(relativePath: string): void {
  const lintResult = LINT_FILE_REGEX.test(relativePath)
    ? run('node_modules/oxlint/bin/oxlint', ['--fix', '--', relativePath])
    : null;
  const formatResult = run('node_modules/oxfmt/bin/oxfmt', ['--no-error-on-unmatched-pattern', '--', relativePath]);

  if (lintResult != null && lintResult.status !== 0) {
    report(`Oxlint errors remain in ${relativePath}`, lintResult);
  }
  if (formatResult.status !== 0) {
    report(`Oxfmt failed on ${relativePath}`, formatResult);
  }
}

/**
 * Runs a Node.js script of the repository from its root, without a shell, and captures its output.
 * @param script - Path of the script, relative to the repository root
 * @param args - Arguments of the script, never interpreted by a shell
 * @returns The result of the process
 */
function run(script: string, args: Array<string>): SpawnSyncReturns<string> {
  return spawnSync(process.execPath, [script, ...args], { cwd: projectDir, encoding: 'utf-8' });
}

/**
 * Prints the output of a failed tool on stderr, and sets the exit code that Claude Code feeds back to the agent.
 * @param title - First line of the report
 * @param result - Result of the failed tool
 */
function report(title: string, result: SpawnSyncReturns<string>): void {
  process.stderr.write(`${title}:\n${result.stdout}${result.stderr}\n`);
  process.exitCode = 2;
}
