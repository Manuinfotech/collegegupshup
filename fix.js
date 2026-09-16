const fs = require('fs');
let c = fs.readFileSync('src/app/(public)/colleges/[slug]/page.tsx', 'utf8');
c = c.replace(/\s*\{\/\* ADMISSIONS TAB \*\/\}[\s\S]*?(?=\s*\{\/\* PLACEMENTS TAB \*\/)/, '');
c = c.replace(/\s*\{\/\* SCHOLARSHIPS TAB \*\/\}[\s\S]*?(?=\s*\{\/\* FACILITIES & HOSTEL TAB \*\/)/, '');
c = c.replace(/\s*\{college\.hostel_details\?[\s\S]*?(?=\s*<\/TabsContent>)/, '');
c = c.replace(/<LeadForm collegeId=\{college\.id\} courseOptions=\{college\.courses\?\.map[^>]*\/>/, '<LeadForm collegeId={college.id} collegeName={college.name} source="College Detail Page" />');
fs.writeFileSync('src/app/(public)/colleges/[slug]/page.tsx', c);
