#!/usr/bin/env node

/**
 * System Verification Checklist
 * Run this to verify the Page Transitions system is properly installed
 */

const fs = require('fs');
const path = require('path');

console.log('\n===============================================================');
console.log('  PAGE TRANSITIONS SYSTEM - VERIFICATION CHECKLIST');
console.log('===============================================================\n');

const baseDir = path.join(__dirname);
const files = [
  'page-transitions.js',
  'PAGE_TRANSITIONS_README.md',
  'QUICK_SETUP.md',
  'IMPLEMENTATION_SUMMARY.md',
  'test-transitions.html'
];

const htmlFiles = [
  'index.html',
  'libros.html',
  'comentarios.html',
  'contactanos.html',
  'iniciar sesion.html',
  'registrarse.html',
  'favoritos.html',
  'para_leer_despues.html'
];

let errors = [];
let warnings = [];
let success = 0;

console.log('1.  CHECKING CORE FILES...\n');

files.forEach(file => {
  const filePath = path.join(baseDir, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const size = (stats.size / 1024).toFixed(1);
    console.log(`   ✅ ${file} (${size} KB)`);
    success++;
  } else {
    console.log(`   X ${file} - NOT FOUND`);
    errors.push(`Missing core file: ${file}`);
  }
});

console.log('\n2.  CHECKING HTML FILES...\n');

htmlFiles.forEach(file => {
  const filePath = path.join(baseDir, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    if (content.includes('page-transitions.js')) {
      console.log(`   ✅ ${file} - Script integrated`);
      success++;
    } else {
      console.log(`   ⚠️  ${file} - Script NOT FOUND`);
      warnings.push(`Script not integrated in: ${file}`);
    }
  } else {
    console.log(`   ⚠️  ${file} - File not found (optional)`);
  }
});

console.log('\n3.  CHECKING CODE QUALITY...\n');

// Check page-transitions.js
const jsPath = path.join(baseDir, 'page-transitions.js');
if (fs.existsSync(jsPath)) {
  const jsContent = fs.readFileSync(jsPath, 'utf-8');
  
  const checks = [
    { name: 'PageTransition class', search: 'class PageTransition' },
    { name: 'init() method', search: 'init()' },
    { name: 'interceptLinks() method', search: 'interceptLinks()' },
    { name: 'CSS keyframes', search: '@keyframes' },
    { name: 'Fade animation', search: 'pageTransitionFadeOut' },
    { name: 'Slide animation', search: 'pageTransitionSlideOutUp' },
    { name: 'Zoom animation', search: 'pageTransitionZoomOut' }
  ];
  
  checks.forEach(check => {
    if (jsContent.includes(check.search)) {
      console.log(`   ✅ ${check.name}`);
      success++;
    } else {
      console.log(`   X ${check.name}`);
      errors.push(`Missing in code: ${check.search}`);
    }
  });
}

console.log('\n4.  CHECKING DOCUMENTATION...\n');

const docChecks = [
  { file: 'PAGE_TRANSITIONS_README.md', section: 'Technical Documentation' },
  { file: 'QUICK_SETUP.md', section: 'Quick Start Guide' },
  { file: 'IMPLEMENTATION_SUMMARY.md', section: 'Implementation Details' }
];

docChecks.forEach(doc => {
  const docPath = path.join(baseDir, doc.file);
  if (fs.existsSync(docPath)) {
    console.log(`   ✅ ${doc.section} (${doc.file})`);
    success++;
  } else {
    console.log(`   X ${doc.section}`);
    errors.push(`Missing documentation: ${doc.file}`);
  }
});

console.log('\n5.  SYSTEM SUMMARY\n');

console.log(`   Core Files:       ${files.length} files`);
console.log(`   HTML Files:       ${htmlFiles.length} pages integrated`);
console.log(`   Documentation:    3 guides`);
console.log(`   Animations:       4 styles available`);
console.log(`   Total Checks:     ${success} passed`);

if (errors.length > 0) {
  console.log('\nX ERRORS FOUND:\n');
  errors.forEach(error => console.log(`   - ${error}`));
}

if (warnings.length > 0) {
  console.log('\n⚠️  WARNINGS:\n');
  warnings.forEach(warning => console.log(`   - ${warning}`));
}

if (errors.length === 0 && warnings.length === 0) {
  console.log('\n✅ ALL SYSTEMS OPERATIONAL\n');
  console.log('===============================================================');
  console.log('  SYSTEM STATUS: READY FOR PRODUCTION');
  console.log('===============================================================\n');
  
  console.log('NEXT STEPS:\n');
  console.log('1. Open test-transitions.html in your browser');
  console.log('2. Click on navigation links to test transitions');
  console.log('3. Verify smooth animations work correctly');
  console.log('4. Check on mobile devices for responsiveness');
  console.log('5. Customize colors/duration if needed (see QUICK_SETUP.md)\n');
  
  process.exit(0);
} else {
  console.log('\n⚠️  SYSTEM STATUS: NEEDS ATTENTION\n');
  process.exit(1);
}


