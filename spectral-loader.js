const fs = require('fs');
const path = require('path');

// Read the MRS file
const mrsContent = fs.readFileSync(path.join(__dirname, 'spectral.mrs'), 'utf8');

// Parse and export the ruleset
module.exports = JSON.parse(mrsContent); 