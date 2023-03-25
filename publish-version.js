/* eslint-disable @typescript-eslint/no-var-requires */

// DO NOT RUN THIS ON DEV ENVIRONMENT
// **CI ONLY**

const pkg = require('./package.json')
const fs = require('fs')

pkg.version = pkg.version + '-dev.' + process.env.COMMIT_ID

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2))
