const fs = require("fs");
const path = require("path");

// Read the MJS file
const mjsContent = fs.readFileSync(
  path.join(__dirname, "spectral.mjs"),
  "utf8"
);

// Parse and export the ruleset
module.exports = JSON.parse(mjsContent);
