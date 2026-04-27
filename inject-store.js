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
            let storeScript = isIndex ? '<script src="assets/js/store.js"></script>\n<script src="assets/js/app.js"></script>' : '<script src="../assets/js/store.js"></script>\n<script src="../assets/js/app.js"></script>';
            
            // Allow flexibility in spaces/newlines in app.js script tag
            let targetScript1 = isIndex ? '<script src="assets/js/app.js"></script>' : '<script src="../assets/js/app.js"></script>';
            let targetScript2 = isIndex ? '<script src="assets/js/app.js" defer></script>' : '<script src="../assets/js/app.js" defer></script>';
            
            if (!content.includes('store.js')) {
                let replaced = false;
                if (content.includes(targetScript1)) {
                    content = content.split(targetScript1).join(storeScript);
                    replaced = true;
                } else if (content.includes(targetScript2)) {
                    content = content.split(targetScript2).join(storeScript);
                    replaced = true;
                }
                
                if (replaced) {
                    fs.writeFileSync(fullPath, content, 'utf8');
                    console.log('Injected store.js in', f);
                }
            }
        }
    });
}
walk(__dirname);
