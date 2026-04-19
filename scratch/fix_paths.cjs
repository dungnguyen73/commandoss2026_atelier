const fs = require('fs');
const path = require('path');

function walk(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            walk(filePath);
        } else if (filePath.endsWith('.ts') || filePath.endsWith('.js')) {
            let content = fs.readFileSync(filePath, 'utf8');
            let modified = false;

            // Fix backslashes in import/export from paths
            content = content.replace(/(import|export)\s+(.*?)\s+from\s+['"](.*?)['"]/g, (match, p1, p2, p3) => {
                if (p3.includes('\\')) {
                    modified = true;
                    return `${p1} ${p2} from '${p3.replace(/\\/g, '/')}'`;
                }
                return match;
            });

            // Fix ~root alias
            if (content.includes('~root')) {
                modified = true;
                // Since 'deps' is always in the same directory as the module or relative to it,
                // we'll try to resolve it to a relative path. 
                // In this project structure, ~root\deps maps to ./deps in atelier.ts
                content = content.replace(/~root/g, '.');
                content = content.replace(/\.\/\//g, './'); // Clean up if double slash accidental
            }

            if (modified) {
                fs.writeFileSync(filePath, content);
                console.log('Fixed: ' + filePath);
            }
        }
    });
}

walk('src/contracts');
