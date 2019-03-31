const http = require('http')

http
  .createServer({}, (req, res) => {
    // console.log(req.url)

    if (req.url.match(/^\/gh\/\w+/gi)) {
      const repo = req.url.split('/')[2]
      res.writeHead(301, {
        Location: `https://github.com/dotangad/${repo}`
      })
      res.end()
    } else if (req.url.match(/^\/gp\/\w*/gi)) {
      const repo = req.url.split('/')[2]
      res.writeHead(301, {
        Location: `https://dotangad.github.io/${repo}`
      })
      res.end()
    } else if (req.url === '/gh') {
      res.writeHead(301, {
        Location: 'https://github.com/dotangad'
      })
      res.end()
    } else {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      })
      res.write(req.url)
      res.end()
    }
  })
  .listen(3006)
