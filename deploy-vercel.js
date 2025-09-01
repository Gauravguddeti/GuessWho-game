#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Guess Who Game - Vercel Deployment Script');
console.log('=============================================\n');

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function runCommand(command, description) {
  console.log(`\n📦 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed successfully!`);
  } catch (error) {
    console.error(`❌ Error during ${description}:`, error.message);
    process.exit(1);
  }
}

async function main() {
  try {
    // Check if vercel is installed
    try {
      execSync('vercel --version', { stdio: 'ignore' });
    } catch (error) {
      console.log('Installing Vercel CLI...');
      runCommand('npm install -g vercel', 'Installing Vercel CLI');
    }

    console.log('1. First, let\'s deploy the backend...\n');
    await question('Press Enter to continue...');

    // Deploy backend
    process.chdir('./backend');
    runCommand('vercel --prod', 'Deploying backend to Vercel');

    const backendUrl = await question('\n🌐 Please enter the backend URL from the deployment (e.g., https://your-backend.vercel.app): ');

    console.log('\n2. Now let\'s deploy the frontend...\n');
    process.chdir('../frontend');

    // Set environment variable for frontend
    console.log(`Setting REACT_APP_SERVER_URL to: ${backendUrl}`);
    runCommand(`vercel env add REACT_APP_SERVER_URL production`, 'Setting environment variable');
    console.log(`Enter the value: ${backendUrl}`);

    runCommand('vercel --prod', 'Deploying frontend to Vercel');

    const frontendUrl = await question('\n🌐 Please enter the frontend URL from the deployment (e.g., https://your-frontend.vercel.app): ');

    console.log('\n3. Updating backend CORS settings...\n');
    process.chdir('../backend');
    
    console.log('Please manually update the FRONTEND_URL environment variable in your Vercel dashboard:');
    console.log(`Backend project: Set FRONTEND_URL to ${frontendUrl}`);
    
    await question('Press Enter after you\'ve updated the environment variable in Vercel dashboard...');
    
    runCommand('vercel --prod', 'Redeploying backend with updated CORS');

    console.log('\n🎉 Deployment completed successfully!');
    console.log(`Frontend URL: ${frontendUrl}`);
    console.log(`Backend URL: ${backendUrl}`);
    console.log('\nYour Guess Who game is now live on Vercel! 🎮');

  } catch (error) {
    console.error('❌ Deployment failed:', error);
  } finally {
    rl.close();
  }
}

main();
