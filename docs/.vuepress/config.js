const fs = require('fs')
const path = require('path')
function generateAPISidebar(dir = '') {
  const p = path.join(__dirname, '../docs/api/' + dir)
  const baseUrl = path.join('/docs/api', dir)
  const result = []
  const content = fs.readdirSync(p)
  const directories = content.filter((x) =>
    fs.lstatSync(path.join(p, x)).isDirectory(),
  )
  const files = content.filter(
    (x) => !fs.lstatSync(path.join(p, x)).isDirectory(),
  )
  for (const directory of directories) {
    result.push({
      title: directory,
      children: generateAPISidebar(directory),
      path: path.join(
        baseUrl,
        directory,
        fs.readdirSync(path.join(p, directory))[0].replace(/\.md$/, ''),
      ),
    })
  }
  for (const file of files) {
    const name = file.replace(/\.md$/, '')
    if (name === 'README') continue
    result.push({
      title: name,
      path: path.join(baseUrl, name),
    })
  }
  return result
}

module.exports = {
  title: 'Command.TS',
  description: require('../../package.json').description,
  themeConfig: {
    repo: 'pikokr/command.ts-v2',
    docsRepo: 'pikokr/command.ts-v2',
    docsBranch: 'master',
    docsDir: 'docs',
    sidebar: [
      {
        title: 'Introduction',
        path: '/docs/',
      },
      {
        title: 'API',
        path: '/docs/api/',
        children: generateAPISidebar(),
      },
    ],
  },
}
