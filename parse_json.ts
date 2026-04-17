import fs from 'fs';

const data = fs.readFileSync('scratch.json', 'utf16le');
try {
  const json = JSON.parse(data);
  // Based on SUI CLI objects json, it might be an array or an object
  const objects = Array.isArray(json) ? json : (json.data || []);
  
  console.log("Found", objects.length, "objects");
  const types = objects.slice(0, 10).map((obj: any) => obj?.data?.type || obj?.type || obj?.content?.type || 'unknown');
  console.log("Types:");
  console.log(types);
  
} catch(e) {
  console.error("Parse failed", e);
}
