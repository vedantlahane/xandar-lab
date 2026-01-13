const fs = require('fs');
const path = require('path');
const s = fs.readFileSync(path.join(__dirname, '..', 'app', 'lab', 'components', 'CityMapVisualization.tsx'), 'utf8');
const nodeIds = [...s.matchAll(/id:\s*"([A-Za-z0-9_]+)"/g)].map(m => m[1]);
const edgeFrom = [...s.matchAll(/from:\s*"([A-Za-z0-9_]+)"/g)].map(m => m[1]);
const edgeTo = [...s.matchAll(/to:\s*"([A-Za-z0-9_]+)"/g)].map(m => m[1]);
const edgeIds = edgeFrom.concat(edgeTo);
const missing = [...new Set(edgeIds.filter(e => !nodeIds.includes(e)) )];
console.log(JSON.stringify({ missing, nodeCount: nodeIds.length, edgeCount: edgeIds.length }, null, 2));
