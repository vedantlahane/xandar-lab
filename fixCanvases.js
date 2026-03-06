const fs = require('fs');
const path = require('path');

const canvases = [
    'app/lab/docs/components/DocumentCanvas.tsx',
    'app/lab/experiments/components/ExperimentCanvas.tsx',
    'app/lab/hackathons/components/HackathonCanvas.tsx',
    'app/lab/jobs/components/JobCanvas.tsx',
    'app/lab/jobs/components/PortalCanvas.tsx',
    'app/lab/notes/components/NoteCanvas.tsx',
    'app/lab/practice/components/browse/BrowseView.tsx'
];

canvases.forEach(file => {
    const p = path.join('c:/Users/Admin/Desktop/xandar-lab', file);
    if (!fs.existsSync(p)) return;
    let text = fs.readFileSync(p, 'utf8');
    text = text.replace(/max-h-\[calc\(100vh-4rem\)\]/g, 'max-h-[calc(100vh-10rem)]');
    fs.writeFileSync(p, text);
});
console.log('Canvases updated');
