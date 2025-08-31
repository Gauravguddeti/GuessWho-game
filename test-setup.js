const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Guess Who? Game Setup...\n');

// Check backend files
const backendFiles = [
    'backend/package.json',
    'backend/src/server.js'
];

console.log('📋 Checking Backend Files:');
backendFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`   ✅ ${file}`);
    } else {
        console.log(`   ❌ ${file} - MISSING`);
    }
});

// Check frontend files
const frontendFiles = [
    'frontend/package.json',
    'frontend/src/App.jsx',
    'frontend/src/components/Menu.jsx',
    'frontend/src/components/Lobby.jsx',
    'frontend/src/components/Board.jsx',
    'frontend/src/components/Card.jsx',
    'frontend/src/components/ChatBox.jsx',
    'frontend/public/index.html'
];

console.log('\n📋 Checking Frontend Files:');
frontendFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`   ✅ ${file}`);
    } else {
        console.log(`   ❌ ${file} - MISSING`);
    }
});

// Check character images
console.log('\n📋 Checking Character Images:');
const charactersDir = 'frontend/public/characters';
if (fs.existsSync(charactersDir)) {
    const images = fs.readdirSync(charactersDir).filter(file => file.endsWith('.png'));
    console.log(`   ✅ Character images directory exists`);
    console.log(`   📸 Found ${images.length} character images`);
    
    if (images.length >= 24) {
        console.log(`   🎉 All required character images present!`);
    } else {
        console.log(`   ⚠️  Only ${images.length}/24 character images found`);
    }
} else {
    console.log(`   ❌ Characters directory missing: ${charactersDir}`);
}

// Check node_modules
console.log('\n📋 Checking Dependencies:');
if (fs.existsSync('backend/node_modules')) {
    console.log('   ✅ Backend dependencies installed');
} else {
    console.log('   ❌ Backend dependencies NOT installed');
}

if (fs.existsSync('frontend/node_modules')) {
    console.log('   ✅ Frontend dependencies installed');
} else {
    console.log('   ❌ Frontend dependencies NOT installed');
}

console.log('\n🎯 Setup Test Complete!');
console.log('\n🚀 To start the game:');
console.log('   Option 1: Double-click start-game.bat');
console.log('   Option 2: Run "npm start" in both backend/ and frontend/ folders');
console.log('\n🎮 Game URL: http://localhost:3000');
console.log('🔌 Backend URL: http://localhost:3001');
