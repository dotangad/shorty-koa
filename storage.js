const fs = require('fs')

async function readShortlinks(fileName) {
  return JSON.parse(await fs.readFile(filename))
}

async function createShortlink(fileName, shortlink, url) {
  const shortlinks = await readShortlinks()
  shortlinks.push({ shortlink, url })
  await fs.writeFile(fileName, JSON.stringify(shortlinks))
}

module.exports = {
  readShortlinks,
  createShortlink
}
