const args = process.argv.slice(2);

const baseFile = 'coverage-threshold.txt';
const baseFile2 = './coverage-threshold.txt';
const resultsFile = args[1];
const isDefaultBranch = args[2];

const fs = require('fs');

let threshold = 0;
let fullPercentage = 0;

console.log('Current working directory:', process.cwd());
console.log('Script directory:', __dirname);

if (!fs.existsSync(baseFile2)) {
    console.log(`baseFile2 ${baseFile2} not found!`);
}

if (!fs.existsSync(baseFile)) {
    console.log(`File ${baseFile} not found!`);
} else {
    threshold = fs.readFileSync(baseFile, "utf8");
}
console.log(`Base threshold: ${threshold}`);