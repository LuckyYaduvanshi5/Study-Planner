// This file is to be run with Node.js to check the environment
const fs = require('fs');
const path = require('path');

console.log('==================== STUDY PLANNER DEBUG ====================');
console.log('Current directory:', process.cwd());

// Check if key files exist
const requiredFiles = [
  'package.json',
  'src/index.js',
  'src/App.js',
  'public/index.html'
];

console.log('\nChecking for required files:');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  console.log(`- ${file}: ${exists ? '✅ Found' : '❌ Missing'}`);
});

// Read and parse package.json
console.log('\nChecking package.json:');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
  console.log('- package.json is valid ✅');
  console.log('- Dependencies:', Object.keys(packageJson.dependencies).length);
  
  // Check for important dependencies
  const criticalDeps = ['react', 'react-dom', 'react-scripts'];
  const missingDeps = criticalDeps.filter(dep => !packageJson.dependencies[dep]);
  
  if (missingDeps.length) {
    console.log(`- ❌ Missing critical dependencies: ${missingDeps.join(', ')}`);
  } else {
    console.log('- All critical dependencies found ✅');
  }
} catch (error) {
  console.log('- ❌ Error reading/parsing package.json:', error.message);
}

console.log('\nEnvironment variables:');
if (fs.existsSync(path.join(process.cwd(), '.env'))) {
  console.log('- .env file exists ✅');
  try {
    const envContent = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8');
    const envVars = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    console.log(`- ${envVars.length} environment variables found`);
    const hasSupabaseVars = envContent.includes('REACT_APP_SUPABASE_URL') && 
                            envContent.includes('REACT_APP_SUPABASE_ANON_KEY');
    console.log(`- Supabase environment variables: ${hasSupabaseVars ? '✅ Found' : '❌ Missing'}`);
  } catch (error) {
    console.log('- ❌ Error reading .env file:', error.message);
  }
} else {
  console.log('- ❌ .env file is missing');
}

console.log('\nRunning this script:');
console.log('- node debug.js');

console.log('\nTo start the app:');
console.log('1. npm install (if not already done)');
console.log('2. npm start');

console.log('\n================ END STUDY PLANNER DEBUG ==================');
