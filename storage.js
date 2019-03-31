const fs = require('fs')
const { promisify } = require('util')
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

async function readShortlinks(fileName) {
  return JSON.parse(await readFile(fileName))
}

async function createShortlink(fileName, shortlink, url) {
  const shortlinks = await readShortlinks(fileName)

  // Check if shortlink already exists
  if (shortlinks.find(s => s.shortlink === shortlink)) return false

  shortlinks.push({ shortlink, url })
  await writeFile(fileName, JSON.stringify(shortlinks))
  return true
}

async function findURL(fileName, shortlink) {
  const shortlinks = await readShortlinks(fileName)
  const found = shortlinks.find(s => s.shortlink === shortlink)
  return found ? found.url : false
}

async function deleteShortlink(fileName, shortlink) {
  const shortlinks = await readShortlinks(fileName)
  const found = shortlinks.findIndex(s => s.shortlink === shortlink)
  if (found !== -1) shortlinks.splice(found, 1)
  else return false

  await writeFile(fileName, JSON.stringify(shortlinks))
  return true
}

module.exports = {
  readShortlinks,
  createShortlink,
  findURL,
  deleteShortlink
}
