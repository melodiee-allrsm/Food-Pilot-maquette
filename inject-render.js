const fs = require('fs');
const path = require('path');
function walk(dir) {
    fs.readdirSync(dir).forEach(f => {
        let fullPath = path.join(dir, f);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!f.includes('stitch_')) walk(fullPath);
        } else if (f.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let isIndex = f === 'index.html';
            let storeScript = isIndex ? '<script src="assets/js/store.js"></script>' : '<script src="../assets/js/store.js"></script>';
            let renderScript = isIndex ? '<script src="assets/js/render.js"></script>' : '<script src="../assets/js/render.js"></script>';
            
            if (content.includes(storeScript) && !content.includes('render.js')) {
                let newContent = content.split(storeScript).join(storeScript + '\n<script src="' + (isIndex ? 'assets/js/render.js' : '../assets/js/render.js') + '"></script>');
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log('Injected render.js in', f);
            }
        }
    });
}
walk(__dirname);
