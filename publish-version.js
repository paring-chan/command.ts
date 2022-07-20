/* 
 *  This is the default license template.
 *  
 *  File: publish-version.js
 *  Author: pikokr
 *  Copyright (c) 2022 pikokr
 *  
 *  To edit this license information: Press Ctrl+Shift+P and press 'Create new License Template...'.
 */

/*
 *  This is the default license template.
 *
 *  File: publish-version.js
 *  Author: pikokr
 *  Copyright (c) 2022 pikokr
 *
 *  To edit this license information: Press Ctrl+Shift+P and press 'Create new License Template...'.
 */

/*
 * Copyright (c) 2022 pikokr. Licensed under the MIT license
 */

// DO NOT RUN THIS ON DEV ENVIRONMENT
// **CI ONLY**

const pkg = require('./package.json')
const fs = require('fs')

pkg.version = pkg.version + '-dev.' + process.env.COMMIT_ID

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2))
