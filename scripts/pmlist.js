#!/usr/bin/env node

const pm2 = require('pm2');

pm2.list((err, list) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log();
  console.log('┌────┬───────────┬─────────┬──────────┬──────────┬──────────┬────────┐');
  console.log('│ id │ name      │ status  │ port     │ cpu      │ mem      │ uptime │');
  console.log('├────┼───────────┼─────────┼──────────┼──────────┼──────────┼────────┤');

  list.forEach(proc => {
    const port = proc.pm2_env?.env?.PORT || proc.pm2_env?.port || '-';
    const cpu = proc.monit?.cpu.toFixed(1) || '0';
    const mem = proc.monit?.memory ? (proc.monit.memory / 1024 / 1024).toFixed(1) + 'mb' : '-';
    const uptime = proc.pm2_env?.pm_uptime ? formatUptime(proc.pm2_env.pm_uptime) : '-';
    const status = proc.pm2_env?.status || 'unknown';

    console.log(`│ ${pad(proc.pm2_env.pm_id.toString(), 2)} │ ${pad(proc.name, 9)} │ ${pad(status, 7)} │ ${pad(port.toString(), 8)} │ ${pad(cpu + '%', 8)} │ ${pad(mem, 8)} │ ${pad(uptime, 6)} │`);
  });

  console.log('└────┴───────────┴─────────┴──────────┴──────────┴──────────┴────────┘');
  console.log();

  pm2.disconnect();
});

function pad(str, len) {
  return str.toString().padEnd(len).slice(0, len);
}

function formatUptime(ms) {
  const sec = Math.floor((Date.now() - ms) / 1000);
  if (sec < 60) return sec + 's';
  if (sec < 3600) return Math.floor(sec / 60) + 'm';
  return Math.floor(sec / 3600) + 'h';
}
