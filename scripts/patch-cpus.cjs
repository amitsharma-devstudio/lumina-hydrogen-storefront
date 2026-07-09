// Workaround for Node returning an empty os.cpus() array on some macOS
// kernels. Tools like graphql-codegen derive their task concurrency from
// os.cpus().length and crash with "Expected concurrency to be an integer
// from 1 and up or Infinity, got 0". We backfill from availableParallelism()
// (which reports correctly) so codegen can run.
//
// Preloaded via NODE_OPTIONS="--require ./scripts/patch-cpus.cjs" so the
// patch also applies to child Node processes spawned by the Shopify CLI.
const os = require('node:os');

const originalCpus = os.cpus.bind(os);

os.cpus = function patchedCpus() {
  const cpus = originalCpus();
  if (Array.isArray(cpus) && cpus.length > 0) {
    return cpus;
  }

  const count =
    typeof os.availableParallelism === 'function'
      ? os.availableParallelism()
      : 1;

  const times = {user: 0, nice: 0, sys: 0, idle: 0, irq: 0};
  return Array.from({length: Math.max(1, count)}, () => ({
    model: 'unknown',
    speed: 0,
    times: {...times},
  }));
};
