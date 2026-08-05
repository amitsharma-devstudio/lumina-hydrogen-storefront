#!/usr/bin/env node
/**
 * Run the named Cloudflare Tunnel against whichever local Vite/Hydrogen
 * port is actually listening (no hardcoded 3000 vs 3001).
 *
 * Usage:
 *   npm run tunnel          # named tunnel → lumina-dev.karwa.io
 *   npm run tunnel:quick    # ephemeral trycloudflare URL
 *   PORT=3001 npm run tunnel
 */
import {spawn} from 'node:child_process';
import {createConnection} from 'node:net';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const tunnelConfigPath = path.join(root, 'cloudflare', 'tunnel.yml');
const runtimeConfigPath = path.join(root, 'cloudflare', 'tunnel.runtime.yml');

const CANDIDATE_PORTS = [
  ...(process.env.PORT ? [Number(process.env.PORT)] : []),
  3000,
  3001,
  5173,
  4173,
].filter((port, index, all) => Number.isFinite(port) && all.indexOf(port) === index);

const quick = process.argv.includes('--quick');
const waitMs = Number(process.env.TUNNEL_WAIT_MS ?? 90_000);
const pollMs = 1000;

function canConnect(port) {
  return new Promise((resolve) => {
    const socket = createConnection({host: '127.0.0.1', port}, () => {
      socket.end();
      resolve(true);
    });
    socket.on('error', () => resolve(false));
    socket.setTimeout(400, () => {
      socket.destroy();
      resolve(false);
    });
  });
}

async function findLocalPort() {
  const deadline = Date.now() + waitMs;
  let attempted = false;

  while (Date.now() <= deadline) {
    for (const port of CANDIDATE_PORTS) {
      if (await canConnect(port)) return port;
    }
    if (!attempted) {
      attempted = true;
      console.log(
        `Waiting for local Vite/Hydrogen on ${CANDIDATE_PORTS.join(', ')}…`,
      );
    }
    await new Promise((r) => setTimeout(r, pollMs));
  }

  throw new Error(
    `No local server found on ${CANDIDATE_PORTS.join(', ')}. Start \`npm run dev\` first, or set PORT=…`,
  );
}

function withServicePort(yaml, port) {
  const service = `http://localhost:${port}`;
  if (/service:\s*http:\/\/localhost:\d+/.test(yaml)) {
    return yaml.replace(
      /service:\s*http:\/\/localhost:\d+/g,
      `service: ${service}`,
    );
  }

  // Fallback: inject under the first ingress hostname entry
  if (/ingress:\s*\n/.test(yaml)) {
    return yaml.replace(
      /(ingress:\s*\n(?:\s*-\s*hostname:[^\n]+\n)?)(\s*)(?:service:[^\n]+\n)?/,
      `$1$2service: ${service}\n`,
    );
  }

  throw new Error('cloudflare/tunnel.yml is missing an ingress service entry');
}

async function writeRuntimeConfig(port) {
  const base = await readFile(tunnelConfigPath, 'utf8');
  const next = withServicePort(base, port);
  await mkdir(path.dirname(runtimeConfigPath), {recursive: true});
  await writeFile(runtimeConfigPath, next, 'utf8');
  return runtimeConfigPath;
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {stdio: 'inherit', shell: false});
    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (signal) reject(new Error(`cloudflared killed by ${signal}`));
      else resolve(code ?? 0);
    });
  });
}

const port = await findLocalPort();
const origin = `http://localhost:${port}`;
console.log(`Tunneling to ${origin}`);

if (quick) {
  const code = await run('cloudflared', ['tunnel', '--url', origin]);
  process.exit(code);
}

const configPath = await writeRuntimeConfig(port);
console.log(`Using runtime config ${path.relative(root, configPath)}`);
console.log('Public host: https://lumina-dev.karwa.io');

const code = await run('cloudflared', [
  'tunnel',
  '--config',
  configPath,
  'run',
]);
process.exit(code);
