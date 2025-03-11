const args = process.argv.slice(2);

const baseFile = args[0];
const resultsFile = args[1];
const isDefaultBranch = args[2];

const fs = require('fs');
const core = require('@actions/core');

let threshold = 0;
let fullPercentage = 0;

if (!fs.existsSync(baseFile)) {
    core.info(`File ${baseFile} not found!`);
} else {
    threshold = fs.readFileSync(baseFile, "utf8");
}
core.info(`Base threshold: ${threshold}`);