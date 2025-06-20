// credits.js

import os from 'os';
import process from 'process';

const contributors = [
  'OmerGS',
  'Romain Péron',
  'Rayanne Mellah',
  'Noé Parcollet',
];

const projectName = 'MathsALaMaison';
const version = '3.0.1';
const years = '2024 - 2025';
const license = 'MIT License';
const environment = process.env.NODE_ENV || 'development';
const repoUrl = 'https://github.com/OmerGS/MathsALaMaison';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
};

function getTimestamp() {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  const padMs = (n) => n.toString().padStart(3, '0');

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  const milliseconds = padMs(now.getMilliseconds());

  const offsetMinutes = now.getTimezoneOffset();
  const sign = offsetMinutes > 0 ? '-' : '+';
  const offsetHours = pad(Math.floor(Math.abs(offsetMinutes) / 60));
  const offsetMins = pad(Math.abs(offsetMinutes) % 60);

  return `[${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds} ${sign}${offsetHours}:${offsetMins}]`;
}

function getCreditsLines() {
  return [
    `${getTimestamp()} ${colors.cyan}${projectName} - LocalAdmin v.${version}${colors.reset}`,
    `${getTimestamp()} `,
    `${getTimestamp()} ${colors.yellow}Licensed under The ${license} (use command "license" to get license text).${colors.reset}`,
    `${getTimestamp()} ${colors.green}Created by ${contributors.join(' and ')}, ${years}${colors.reset}`,
    `${getTimestamp()} `,
    `${getTimestamp()} Build Date: ${colors.bright}${new Date().toISOString()}${colors.reset}`,
    `${getTimestamp()} Environment: ${colors.bright}${environment}${colors.reset}`,
    `${getTimestamp()} Node.js Version: ${colors.bright}${process.version}${colors.reset}`,
    `${getTimestamp()} Platform: ${colors.bright}${os.type()} ${os.release()} (${os.arch()})${colors.reset}`,
    `${getTimestamp()} Repo: ${colors.magenta}${repoUrl}${colors.reset}`,
    `${getTimestamp()} `,
    `${getTimestamp()} ${colors.magenta}Type 'help' to get list of available commands.${colors.reset}`,
    `${getTimestamp()} ${colors.dim}Have fun! 🚀${colors.reset}`,
    `${getTimestamp()} `,
  ];
}

async function printCredits(delayMs = 100) {
  const lines = getCreditsLines();
  for (const line of lines) {
    console.log(line);
    await new Promise((r) => setTimeout(r, delayMs));
  }
}

export {
  contributors,
  projectName,
  version,
  license,
  environment,
  getCreditsLines,
  printCredits,
  getTimestamp
};