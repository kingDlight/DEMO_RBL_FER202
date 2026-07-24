const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace utility classes
  content = content.replace(/bg-white\/([0-9]+)/g, 'bg-on-surface/$1');
  content = content.replace(/border-white\/([0-9]+)/g, 'border-on-surface/$1');
  content = content.replace(/hover:bg-white\/([0-9]+)/g, 'hover:bg-on-surface/$1');
  content = content.replace(/hover:text-white/g, 'hover:text-on-surface');
  content = content.replace(/text-white\/([0-9]+)/g, 'text-on-surface/$1');
  
  // Replace some specific hardcoded things like text-white in places that are not primary buttons
  // Note: text-white on primary button is fine because bg-primary is colored.
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed', file);
  }
});
