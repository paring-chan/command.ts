// DO NOT RUN THIS ON DEV ENVIRONMENT
// **CI ONLY**

const package = require('./package.json')
const fs = require('fs')

package.version = package.version + '-dev.' + process.env.COMMIT_ID

fs.writeFileSync('package.json', JSON.stringify(package, null, 2))
