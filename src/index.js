const args = process.argv.slice(2);

const baseFile = args[0];
const resultsFile = args[1];
const isDefaultBranch = args[2] === 'true'; // Преобразование в boolean

const fs = require('fs');

let threshold = 0;
let fullPercentage = 0;
let message = '';
let isPassed = false;

// Проверка, существует ли baseFile
if (!fs.existsSync(baseFile)) {
    console.log(`File ${baseFile} not found!`);
} else {
    threshold = parseFloat(fs.readFileSync(baseFile, "utf8")) || 0;
}
console.log(`Base threshold: ${threshold}`);

if (!fs.existsSync(resultsFile)) {
    message = `File ${resultsFile} not found!`;
    console.log(message);  // Выводим в консоль
    console.log(`::set-output name=message::${message}`);
    console.log(`::set-output name=passed::${isPassed}`);
    console.log(`::add-step-summary::${message}`);
    return;
} else {
    const resultsJson = fs.readFileSync(resultsFile, "utf8");
    const resultsContent = JSON.parse(resultsJson);
    const { all, full, party, empty } = resultsContent.coverageOperationMap.counter;

    fullPercentage = Math.round((full / all * 100 + Number.EPSILON) * 100) / 100;
}

if (isDefaultBranch) {
    console.log(`Write to ${baseFile} new threshold: ${fullPercentage}`);
    fs.writeFileSync(baseFile, fullPercentage.toString());
}

isPassed = fullPercentage >= threshold;
message = isPassed
    ? `✅ The coverage ${fullPercentage}% is OK`
    : `❌ The coverage ${fullPercentage}% is too low (threshold: ${threshold}%)`;

console.log(`::set-output name=message::${message}`);
console.log(`::set-output name=passed::${isPassed}`);
console.log(`::add-step-summary::${message}`);
