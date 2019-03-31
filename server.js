const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const views = require('koa-views')
const static = require('koa-static')
const Router = require('koa-router')
const fs = require('fs')
const { promisify } = require('util')
const storage = require('./storage')
const app = new Koa()
const router = new Router()

app.use(bodyParser())
app.use(views('html', { extension: 'html' }))
app.use(static('static'))

app.use(async (ctx, next) => {
  console.log(ctx.request.url)
  await next()
})

router.get('/gh', async ctx => ctx.redirect('https://github.com/dotangad'))

router.get('/gh/:repo', async ctx =>
  ctx.redirect(
    `https://github.com/dotangad/${ctx.req.url.split('/')[2].split('?')[0]}`
  )
)

router.get('/gp/:repo', async ctx =>
  ctx.redirect(
    `https://dotangad.github.com/${ctx.req.url.split('/')[2].split('?')[0]}`
  )
)

router.get('/all', async ctx => {
  // Check password
  const { password } = ctx.request.query
  const correctPassword = (await promisify(fs.readFile)(
    './password',
    'utf-8'
  )).replace('\n', '')

  if (password !== correctPassword) {
    ctx.status = 401
    ctx.body = 'Incorrect password'
    return
  }

  ctx.body = await storage.readShortlinks('./shortlinks.json')
})

router.get('/create', async ctx => ctx.render('create'))

router.post('/create', async ctx => {
  // Check password
  const { password } = ctx.request.query
  const correctPassword = (await promisify(fs.readFile)(
    './password',
    'utf-8'
  )).replace('\n', '')

  if (password !== correctPassword) {
    ctx.status = 401
    ctx.body = 'Incorrect password'
    return
  }

  const { shortlink, url } = ctx.request.body
  if (
    !shortlink.match(/^[a-z]+$/i) ||
    !url.match(
      /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/gi
    )
  ) {
    ctx.status = 400
    ctx.body = 'Bad params'
    return
  }

  // Create shortlink
  if (await storage.createShortlink('./shortlinks.json', shortlink, url)) {
    ctx.status = 200
    ctx.body = 'Created'
    return
  } else {
    ctx.status = 400
    ctx.body = 'Exists'
    return
  }
})

router.delete('/:shortlink', async ctx => {
  // Check password
  const { password } = ctx.request.query
  const correctPassword = (await promisify(fs.readFile)(
    './password',
    'utf-8'
  )).replace('\n', '')

  if (password !== correctPassword) {
    ctx.status = 401
    ctx.body = 'Incorrect password'
    return
  }

  if (
    await storage.deleteShortlink(
      './shortlinks.json',
      ctx.request.url.split('/')[1].split('?')[0]
    )
  ) {
    ctx.status = 200
    ctx.body = 'Deleted'
    return
  }

  ctx.status = 404
  ctx.body = "Doesn't exist"
})

router.get('/:shortlink', async ctx => {
  // Find url
  const url = await storage.findURL(
    './shortlinks.json',
    ctx.req.url.split('/')[1].split('?')[0]
  )
  if (url) ctx.redirect(url)
  else ctx.redirect('https://angad.dev')
})

app.use(router.routes(), router.allowedMethods())
app.listen(3006)
