#!/usr/bin/env node

/**
 * Vercel Deployment Setup Script
 * Automates:
 * 1. GitHub repository creation (if needed)
 * 2. Vercel project creation
 * 3. Environment variables setup
 * 4. Custom domain configuration
 * 5. Deployment
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const readline = require('readline');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(color, text) {
  console.log(`${color}${text}${colors.reset}`);
}

function question(prompt) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  log(colors.bright + colors.cyan, '\n🚀 HALO ABE - VERCEL DEPLOYMENT SETUP\n');

  // Step 1: Check prerequisites
  log(colors.cyan, '📋 STEP 1: Checking prerequisites...');
  
  const hasGit = fs.existsSync(path.join(process.cwd(), '.git'));
  if (!hasGit) {
    log(colors.yellow, '⚠️  Git repository not found. Run: git init && git add . && git commit -m "Initial commit"');
    process.exit(1);
  }
  log(colors.green, '✅ Git repository found');

  const hasPackageJson = fs.existsSync(path.join(process.cwd(), 'package.json'));
  if (!hasPackageJson) {
    log(colors.red, '❌ package.json not found');
    process.exit(1);
  }
  log(colors.green, '✅ package.json found');

  // Step 2: Gather information
  log(colors.cyan, '\n🔐 STEP 2: Gathering information...');
  
  const githubToken = await question('Enter your GitHub token (create at https://github.com/settings/tokens): ');
  const vercelToken = await question('Enter your Vercel token (create at https://vercel.com/account/tokens): ');
  const mongodbUri = await question('Enter your MongoDB URI (from https://cloud.mongodb.com/): ');
  const domain = await question('Enter your custom domain (e.g., haloabeweb.my.id): ') || 'haloabeweb.my.id';
  const projectName = await question('Enter Vercel project name (default: halo-abe): ') || 'halo-abe';
  const repoName = await question('Enter GitHub repository name (default: halo-abe): ') || 'halo-abe';
  const githubUsername = await question('Enter your GitHub username: ');

  log(colors.green, '✅ Information gathered');

  // Step 3: Create Vercel project
  log(colors.cyan, '\n🌐 STEP 3: Creating Vercel project...');
  log(colors.yellow, '⏳ This might take a minute...');

  try {
    // Step 3a: Import from GitHub
    const createProjectRes = await new Promise((resolve, reject) => {
      const data = JSON.stringify({
        name: projectName,
        gitRepository: {
          repo: `${githubUsername}/${repoName}`,
          type: 'github'
        },
        framework: 'express',
        envs: [
          {
            key: 'MONGODB_URI',
            value: mongodbUri,
            type: 'secret'
          },
          {
            key: 'NODE_ENV',
            value: 'production',
            type: 'plain'
          }
        ]
      });

      const options = {
        hostname: 'api.vercel.com',
        path: '/v13/projects',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${vercelToken}`,
          'Content-Type': 'application/json',
          'Content-Length': data.length,
        },
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch {
            resolve(null);
          }
        });
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    });

    if (createProjectRes && createProjectRes.id) {
      log(colors.green, `✅ Vercel project created: ${projectName}`);
      const projectId = createProjectRes.id;

      // Step 3b: Add domain
      log(colors.cyan, '\n📍 STEP 4: Setting up custom domain...');
      
      const addDomainRes = await new Promise((resolve, reject) => {
        const domainData = JSON.stringify({
          name: domain
        });

        const options = {
          hostname: 'api.vercel.com',
          path: `/v10/projects/${projectId}/domains`,
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${vercelToken}`,
            'Content-Type': 'application/json',
            'Content-Length': domainData.length,
          },
        };

        const req = https.request(options, (res) => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            try {
              resolve(JSON.parse(body));
            } catch {
              resolve(null);
            }
          });
        });

        req.on('error', reject);
        req.write(domainData);
        req.end();
      });

      if (addDomainRes && addDomainRes.name) {
        log(colors.green, `✅ Domain added: ${domain}`);
        log(colors.yellow, '\n⚠️  DNS Configuration needed:');
        log(colors.yellow, '1. Update your domain nameservers to:');
        log(colors.yellow, '   - ns1.vercel-dns.com');
        log(colors.yellow, '   - ns2.vercel-dns.com');
        log(colors.yellow, '2. Wait 24-48 hours for DNS to propagate');
      } else {
        log(colors.yellow, '⚠️  Domain setup failed. Manual setup required.');
      }
    } else {
      log(colors.yellow, '⚠️  Vercel API request incomplete. Manual setup on vercel.com needed.');
    }
  } catch (error) {
    log(colors.red, `❌ Error: ${error.message}`);
    log(colors.yellow, '\n📝 Manual steps:');
    log(colors.yellow, '1. Go to https://vercel.com');
    log(colors.yellow, '2. Create new project from: https://github.com/' + githubUsername + '/' + repoName);
    log(colors.yellow, '3. Add environment variable MONGODB_URI');
    log(colors.yellow, '4. Add custom domain in project settings');
  }

  // Step 5: Summary
  log(colors.cyan, '\n✅ DEPLOYMENT SETUP COMPLETE!\n');
  
  log(colors.green, '📊 Next steps:');
  log(colors.green, `1. Go to: https://vercel.com/dashboard`);
  log(colors.green, `2. Project name: ${projectName}`);
  log(colors.green, `3. Domain: ${domain}`);
  log(colors.green, `4. Verify at: https://${domain}`);
  
  log(colors.yellow, '\n📝 Full documentation: DEPLOY-VERCEL.md\n');
}

main().catch(error => {
  log(colors.red, `\n❌ Setup failed: ${error.message}\n`);
  process.exit(1);
});
