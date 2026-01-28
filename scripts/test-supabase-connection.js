#!/usr/bin/env node
/**
 * Supabase Connection Validation Script
 *
 * This script validates Supabase configuration WITHOUT:
 * - Creating any database records
 * - Creating any user accounts
 * - Modifying any data
 *
 * It only tests:
 * 1. Environment variables are set
 * 2. Supabase client can initialize
 * 3. Auth service is reachable
 */

const { createClient } = require('@supabase/supabase-js');

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  dim: '\x1b[2m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('');
  log('─'.repeat(50), 'dim');
  log(`  ${title}`, 'blue');
  log('─'.repeat(50), 'dim');
}

async function testEnvironmentVariables() {
  logSection('TEST 1: Environment Variables');

  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];

  let allPresent = true;

  for (const varName of requiredVars) {
    const value = process.env[varName];
    const isSet = value && value !== '' && value !== `your-${varName.toLowerCase().replace('next_public_', '').replace('_key', '')}-key` && value !== 'your-project-url';

    if (isSet) {
      log(`  ✓ ${varName}: ${value.substring(0, 20)}...`, 'green');
    } else {
      log(`  ✗ ${varName}: Not set or using placeholder`, 'red');
      allPresent = false;
    }
  }

  return allPresent;
}

async function testSupabaseInitialization() {
  logSection('TEST 2: Supabase Client Initialization');

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      log('  ✗ Cannot initialize - missing credentials', 'red');
      return false;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    log('  ✓ Supabase client created successfully', 'green');
    return { success: true, client: supabase };
  } catch (error) {
    log(`  ✗ Failed to create client: ${error.message}`, 'red');
    return false;
  }
}

async function testProjectAccessibility(supabase) {
  logSection('TEST 3: Supabase Project Accessibility');

  try {
    // Try to get the current session (should work even without tables)
    const { data, error } = await supabase.auth.getSession();

    // If we get a response, the project is accessible
    if (error) {
      // Some errors are OK - like "Invalid API key" format
      if (error.message.includes('Invalid API key')) {
        log('  ✗ API key appears to be invalid', 'red');
        return false;
      }
      // Other connection errors
      log(`  ⚠ Error response: ${error.message}`, 'yellow');
      log('  ⚠ Project may exist but credentials might be wrong', 'yellow');
      return false;
    }

    log('  ✓ Supabase project is accessible', 'green');
    log(`  ℹ Current session: ${data.session ? 'Active (if logged in)' : 'None'}`, 'dim');
    return true;
  } catch (error) {
    log(`  ✗ Connection failed: ${error.message}`, 'red');
    log('  ⚠ Check your NEXT_PUBLIC_SUPABASE_URL', 'yellow');
    return false;
  }
}

async function testTablesExist(supabase) {
  logSection('TEST 4: Database Tables (Expected to FAIL)');

  const expectedTables = ['profiles', 'user_progress'];
  const results = [];

  for (const tableName of expectedTables) {
    try {
      // Try a simple select - will fail if table doesn't exist or no RLS policy
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (error) {
        if (error.code === '42P01') {
          // Table does not exist - this is expected if schema not run yet
          log(`  ⚠ Table "${tableName}" does not exist (run schema-up.sql)`, 'yellow');
          results.push({ table: tableName, exists: false });
        } else if (error.code === '42501') {
          // Permission denied - table exists but no RLS policy for anon
          log(`  ✓ Table "${tableName}" exists (RLS blocking anon access - expected)`, 'green');
          results.push({ table: tableName, exists: true });
        } else {
          // Other error
          log(`  ⚠ Table "${tableName}": ${error.message} (${error.code})`, 'yellow');
          results.push({ table: tableName, exists: null });
        }
      } else {
        log(`  ✓ Table "${tableName}" exists and is accessible`, 'green');
        results.push({ table: tableName, exists: true });
      }
    } catch (error) {
      log(`  ✗ Error checking "${tableName}": ${error.message}`, 'red');
      results.push({ table: tableName, exists: false });
    }
  }

  const anyExist = results.some(r => r.exists === true);
  if (!anyExist) {
    log('', 'dim');
    log('  → Run backend/migrations/001_initial_schema.up.sql in Supabase SQL Editor', 'blue');
  }

  return results;
}

async function main() {
  console.log('');
  log('╔════════════════════════════════════════════════════════════╗', 'blue');
  log('║     Supabase Connection Validation Test                    ║', 'blue');
  log('║     Safe Mode - No Data Modification                       ║', 'blue');
  log('╚════════════════════════════════════════════════════════════╝', 'blue');

  // Load environment variables from .env.local
  const path = require('path');
  require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

  const results = {
    envVars: await testEnvironmentVariables(),
    initialization: null,
    accessibility: null,
    tables: null,
  };

  if (!results.envVars) {
    log('', 'dim');
    log('✗ Environment variables not properly configured.', 'red');
    log('  Please update .env.local with your Supabase credentials.', 'yellow');
    process.exit(1);
  }

  const initResult = await testSupabaseInitialization();
  results.initialization = !!initResult;

  if (!initResult) {
    log('', 'dim');
    log('✗ Cannot proceed without valid Supabase client.', 'red');
    process.exit(1);
  }

  results.accessibility = await testProjectAccessibility(initResult.client);
  results.tables = await testTablesExist(initResult.client);

  // Summary
  logSection('SUMMARY');

  const allPassed = results.envVars && results.initialization && results.accessibility;

  if (allPassed) {
    log('  ✓ Supabase connection is configured correctly!', 'green');
    log('  ✓ App will work with localStorage fallback until tables are created.', 'green');
    log('', 'dim');
    log('  Next steps:', 'blue');
    log('    1. Run docs/supabase-schema-up.sql in Supabase SQL Editor', 'dim');
    log('    2. Restart the dev server: pnpm pm2:restart', 'dim');
    log('    3. Test signup/login flow', 'dim');
    process.exit(0);
  } else {
    log('  ✗ Supabase connection has issues.', 'red');
    log('  Please check the errors above and fix your configuration.', 'yellow');
    process.exit(1);
  }
}

main().catch(error => {
  log(`\n✗ Unexpected error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
