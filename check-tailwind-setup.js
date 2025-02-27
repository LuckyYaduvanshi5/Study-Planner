const fs = require('fs');
const path = require('path');

console.log('=== Checking Tailwind CSS Setup ===');

// Check if package.json exists and has tailwindcss
try {
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  console.log('✅ package.json exists');
  
  if (packageJson.dependencies.tailwindcss) {
    console.log(`✅ tailwindcss is installed (${packageJson.dependencies.tailwindcss})`);
  } else {
    console.log('❌ tailwindcss is not in dependencies');
  }
} catch (error) {
  console.log('❌ Could not read package.json:', error.message);
}

// Check for tailwind.config.js
try {
  if (fs.existsSync('./tailwind.config.js')) {
    console.log('✅ tailwind.config.js exists');
  } else {
    console.log('❌ tailwind.config.js does not exist');
  }
} catch (error) {
  console.log('❌ Error checking for tailwind.config.js:', error.message);
}

// Check for postcss.config.js
try {
  if (fs.existsSync('./postcss.config.js')) {
    console.log('✅ postcss.config.js exists');
  } else {
    console.log('❌ postcss.config.js does not exist');
  }
} catch (error) {
  console.log('❌ Error checking for postcss.config.js:', error.message);
}

// Check if index.css has tailwind directives
try {
  const indexCss = fs.readFileSync('./src/index.css', 'utf8');
  if (indexCss.includes('@tailwind')) {
    console.log('✅ src/index.css contains tailwind directives');
  } else {
    console.log('❌ src/index.css is missing tailwind directives');
  }
} catch (error) {
  console.log('❌ Could not read src/index.css:', error.message);
}

console.log('=== End of Check ===');
