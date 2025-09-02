#!/usr/bin/env node

const https = require('https');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

// Function to make HTTPS requests
function fetchData(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, {
      headers: {
        'User-Agent': 'GitHub-Activity-CLI'
      }
    }, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        if (response.statusCode === 200) {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (error) {
            reject(new Error('Failed to parse JSON response'));
          }
        } else if (response.statusCode === 404) {
          reject(new Error('User not found'));
        } else if (response.statusCode === 403) {
          reject(new Error('API rate limit exceeded'));
        } else {
          reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        }
      });
    });
    
    request.on('error', (error) => {
      reject(new Error(`Network error: ${error.message}`));
    });
    
    request.setTimeout(10000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Function to format activity events
function formatEvent(event) {
  const { type, repo, payload, created_at } = event;
  const repoName = repo.name;
  const date = new Date(created_at).toLocaleDateString();
  
  switch (type) {
    case 'PushEvent':
      const commitCount = payload.commits ? payload.commits.length : payload.size || 1;
      return `${colors.green}•${colors.reset} Pushed ${colors.bright}${commitCount}${colors.reset} commit${commitCount !== 1 ? 's' : ''} to ${colors.cyan}${repoName}${colors.reset} ${colors.gray}(${date})${colors.reset}`;
    
    case 'IssuesEvent':
      const action = payload.action;
      return `${colors.yellow}•${colors.reset} ${action.charAt(0).toUpperCase() + action.slice(1)} an issue in ${colors.cyan}${repoName}${colors.reset} ${colors.gray}(${date})${colors.reset}`;
    
    case 'WatchEvent':
      return `${colors.magenta}•${colors.reset} Starred ${colors.cyan}${repoName}${colors.reset} ${colors.gray}(${date})${colors.reset}`;
    
    case 'ForkEvent':
      return `${colors.blue}•${colors.reset} Forked ${colors.cyan}${repoName}${colors.reset} ${colors.gray}(${date})${colors.reset}`;
    
    case 'CreateEvent':
      const refType = payload.ref_type;
      if (refType === 'repository') {
        return `${colors.green}•${colors.reset} Created repository ${colors.cyan}${repoName}${colors.reset} ${colors.gray}(${date})${colors.reset}`;
      } else if (refType === 'branch') {
        return `${colors.green}•${colors.reset} Created branch ${colors.bright}${payload.ref}${colors.reset} in ${colors.cyan}${repoName}${colors.reset} ${colors.gray}(${date})${colors.reset}`;
      }
      return `${colors.green}•${colors.reset} Created ${refType} in ${colors.cyan}${repoName}${colors.reset} ${colors.gray}(${date})${colors.reset}`;
    
    case 'DeleteEvent':
      return `${colors.red}•${colors.reset} Deleted ${payload.ref_type} ${colors.bright}${payload.ref}${colors.reset} in ${colors.cyan}${repoName}${colors.reset} ${colors.gray}(${date})${colors.reset}`;
    
    case 'PullRequestEvent':
      const prAction = payload.action;
      return `${colors.blue}•${colors.reset} ${prAction.charAt(0).toUpperCase() + prAction.slice(1)} a pull request in ${colors.cyan}${repoName}${colors.reset} ${colors.gray}(${date})${colors.reset}`;
    
    case 'IssueCommentEvent':
      return `${colors.yellow}•${colors.reset} Commented on an issue in ${colors.cyan}${repoName}${colors.reset} ${colors.gray}(${date})${colors.reset}`;
    
    case 'ReleaseEvent':
      return `${colors.magenta}•${colors.reset} Published a release in ${colors.cyan}${repoName}${colors.reset} ${colors.gray}(${date})${colors.reset}`;
    
    default:
      return `${colors.gray}•${colors.reset} ${type.replace('Event', '')} in ${colors.cyan}${repoName}${colors.reset} ${colors.gray}(${date})${colors.reset}`;
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`${colors.red}Error:${colors.reset} Please provide a GitHub username`);
    console.log(`${colors.bright}Usage:${colors.reset} node github-activity.js <username>`);
    console.log(`${colors.bright}Example:${colors.reset} node github-activity.js kamranahmedse`);
    process.exit(1);
  }
  
  const username = args[0];
  const url = `https://api.github.com/users/${username}/events`;
  
  console.log(`${colors.bright}Fetching activity for ${colors.cyan}${username}${colors.reset}${colors.bright}...${colors.reset}\n`);
  
  try {
    const events = await fetchData(url);
    
    if (events.length === 0) {
      console.log(`${colors.yellow}No recent activity found for user ${colors.cyan}${username}${colors.reset}`);
      return;
    }
    
    console.log(`${colors.bright}Recent activity:${colors.reset}\n`);
    
    // Display the most recent 10 events
    const recentEvents = events.slice(0, 10);
    recentEvents.forEach(event => {
      console.log(formatEvent(event));
    });
    
    console.log(`\n${colors.gray}Showing ${recentEvents.length} of ${events.length} recent events${colors.reset}`);
    
  } catch (error) {
    console.log(`${colors.red}Error:${colors.reset} ${error.message}`);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.log(`${colors.red}Unexpected error:${colors.reset} ${error.message}`);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.log(`${colors.red}Unexpected error:${colors.reset} ${error.message}`);
  process.exit(1);
});

// Run the application
if (require.main === module) {
  main();
}