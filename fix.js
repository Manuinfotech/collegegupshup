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

const files = walk(path.join(__dirname, 'src'));

let replacedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  
  // Replace the exact class combinations I introduced earlier
  content = content.replace(/className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200"/g, 'className="shadow-sm"');
  content = content.replace(/className="bg-indigo-600 hover:bg-indigo-700 text-white"/g, 'className=""');
  content = content.replace(/className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 shadow-sm"/g, 'className="rounded-full px-8 shadow-sm"');
  content = content.replace(/className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500\/20"/g, 'className="w-full shadow-md"');
  
  // Also fix Pagination components
  content = content.replace(/bg-indigo-600 text-white/g, 'bg-[#D4FF00] text-black');
  
  // And the header/footer hover states
  content = content.replace(/hover:bg-indigo-600/g, 'hover:bg-[#D4FF00] hover:text-black');
  content = content.replace(/hover:border-indigo-600/g, 'hover:border-[#D4FF00]');
  content = content.replace(/hover:text-indigo-600/g, 'hover:text-[#bce600]');

  if (content !== original) {
    fs.writeFileSync(file, content);
    replacedFiles++;
    console.log(`Updated: ${file}`);
  }
});

console.log(`Updated ${replacedFiles} files.`);
