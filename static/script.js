const logger = document.querySelector('.logger')

function deleteShortlink(shortlink) {
  const password = document.querySelector('input#password').value
  fetch(`/${shortlink}?password=${password}`, {
    method: 'DELETE'
  })
    .then(res => res.text())
    .then(res => {
      if (res === 'Deleted') {
        return fetch(`/all?password=${password}`)
      } else if (res === "Doesn't exist") {
        logger.innerText = "Doesn't exist"
      }
    })
    .then(res => {
      if (res.status === 500) {
        logger.innerText = 'Internal Server Error'
      } else if (res.status === 400) {
        logger.innerText = 'Already exists'
      } else if (res.status === 401) {
        logger.innerText = 'Incorrect password'
        document.querySelector('input#password').value = ''
      } else {
        return res.json()
      }
    })
    .then(populateShortlinksTable)
    .catch(res => {
      if (res.status === 500) {
        logger.innerText = 'Internal Server Error'
      } else if (res.status === 400) {
        logger.innerText = 'Already exists'
      } else if (res.status === 401) {
        logger.innerText = 'Incorrect password'
        document.querySelector('input#password').value = ''
      } else {
        logger.innerText = 'An error occurred'
      }
    })
}

function create(shortlink, url) {
  const password = document.querySelector('input#password').value
  fetch(`/create?password=${password}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({ shortlink, url })
  })
    .then(res => res.text())
    .then(res => {
      if (res === 'Created') {
        return fetch(`/all?password=${password}`)
      }
    })
    .then(res => {
      if (res.status === 500) {
        logger.innerText = 'Internal Server Error'
      } else if (res.status === 400) {
        logger.innerText = 'Already exists'
      } else if (res.status === 401) {
        logger.innerText = 'Incorrect password'
        document.querySelector('input#password').value = ''
      } else {
        return res.json()
      }
    })
    .then(populateShortlinksTable)
    .catch(res => {
      if (res.status === 500) {
        logger.innerText = 'Internal Server Error'
      } else if (res.status === 400) {
        logger.innerText = 'Already exists'
      } else if (res.status === 401) {
        logger.innerText = 'Incorrect password'
        document.querySelector('input#password').value = ''
      } else {
        logger.innerText = 'An error occurred'
      }
    })
}

function populateShortlinksTable(shortlinks) {
  const table = document.querySelector('table')
  const createDiv = document.querySelector('.create')
  table.innerHTML = ''
  createDiv.innerHTML = ''

  if (shortlinks === false) return

  const header = document.createElement('tr')
  for (let i of ['Shortlink', 'URL', 'Delete']) {
    const td = document.createElement('td')
    td.innerText = i
    header.appendChild(td)
  }
  table.appendChild(header)

  for (let shortlink of shortlinks) {
    const row = document.createElement('tr')

    const shortlinkDiv = document.createElement('td')
    shortlinkDiv.innerText = shortlink.shortlink
    row.appendChild(shortlinkDiv)

    const url = document.createElement('td')
    url.innerText = shortlink.url
    row.appendChild(url)

    const del = document.createElement('button')
    del.className = 'delete'
    del.innerText = 'Delete'
    del.addEventListener('click', () => {
      deleteShortlink(shortlink.shortlink)
    })
    row.appendChild(del)

    table.appendChild(row)
  }

  const shortlinkInput = document.createElement('input')
  shortlinkInput.id = 'create-shortlink'
  shortlinkInput.placeholder = 'Shortlink'
  shortlinkInput.type = 'text'
  createDiv.appendChild(shortlinkInput)

  const urlInput = document.createElement('input')
  urlInput.id = 'create-url'
  urlInput.placeholder = 'URL'
  urlInput.type = 'text'
  createDiv.appendChild(urlInput)

  const createButton = document.createElement('button')
  createButton.innerText = 'Create'
  createButton.addEventListener('click', () =>
    create(
      document.querySelector('input#create-shortlink').value,
      document.querySelector('input#create-url').value
    )
  )
  createDiv.appendChild(createButton)
}

document.querySelector('#use-password').addEventListener('click', () => {
  const password = document.querySelector('input#password').value
  logger.innerText = ''

  // Fetch shortlinks
  fetch(`/all?password=${password}`)
    .then(res => {
      if (res.status === 500) {
        logger.innerText = 'Internal Server Error'
        return false
      } else if (res.status === 401) {
        logger.innerText = 'Incorrect password'
        document.querySelector('input#password').value = ''
        return false
      } else {
        return res.json()
      }
    })
    .then(populateShortlinksTable)
    .catch(res => {
      if (res.status === 500) {
        logger.innerText = 'Internal Server Error'
      } else if (res.status === 401) {
        logger.innerText = 'Incorrect password'
        document.querySelector('input#password').value = ''
      } else {
        console.log(res)
        logger.innerText = 'An error occurred'
      }
    })
})
