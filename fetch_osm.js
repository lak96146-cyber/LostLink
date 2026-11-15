const https = require('https');
const fs = require('fs');

const query = `[out:json][timeout:30];
(
  way["building"](around:1000,30.68114,76.60584);
  way["highway"](around:1000,30.68114,76.60584);
  way["leisure"](around:1000,30.68114,76.60584);
  node["amenity"](around:1000,30.68114,76.60584);
);
out geom;`;

const url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query);

console.log('Fetching OpenStreetMap data for CGC Jhanjeri...');
https.get(url, { headers: { 'User-Agent': 'LostLinkCampusVerse/1.0' }, rejectUnauthorized: false }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Received elements count:', parsed.elements ? parsed.elements.length : 0);
      fs.writeFileSync('osm_campus_raw.json', JSON.stringify(parsed, null, 2));
      console.log('Saved to osm_campus_raw.json successfully!');
    } catch(e) {
      console.error('Failed to parse response:', data.substring(0, 300));
    }
  });
}).on('error', err => console.error(err));
