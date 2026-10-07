const fs = require('fs');
const path = require('path');

const calcs = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'all_calcs_data.json'), 'utf8'));

const categories = [
  'basic-everyday',
  'math',
  'geometry',
  'finance',
  'health-fitness',
  'date-time',
  'unit-converters',
  'construction',
  'electrical',
  'physics',
  'chemistry',
  'statistics',
  'computer-data',
  'time-productivity',
  'business-marketing'
];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main Homepage -->
  <url>
    <loc>https://calchub.netlify.app/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- 15 Specialized Categories -->
`;

categories.forEach(cat => {
  xml += `  <url><loc>https://calchub.netlify.app/category/${cat}</loc><priority>0.8</priority></url>\n`;
});

xml += `\n  <!-- 200 Verified Calculators -->\n`;

calcs.forEach(c => {
  const prio = c.badge === 'popular' ? '0.8' : '0.7';
  xml += `  <url><loc>https://calchub.netlify.app/calculators/${c.slug}</loc><priority>${prio}</priority></url>\n`;
});

xml += `</urlset>\n`;

const publicPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
const distPath = path.join(__dirname, '..', 'dist', 'sitemap.xml');

fs.writeFileSync(publicPath, xml, 'utf8');
console.log(`Wrote sitemap with ${calcs.length} calculators to: ${publicPath}`);

if (fs.existsSync(path.dirname(distPath))) {
  fs.writeFileSync(distPath, xml, 'utf8');
  console.log(`Wrote sitemap to: ${distPath}`);
}
