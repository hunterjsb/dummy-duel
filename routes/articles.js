const express = require('express')
const Argument = require('./../models/argument')
const router = express.Router()

router.get('/new', (req, res) => {
  randHex = (Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6);
  res.render('articles/new', { argument: new Argument(), randHex: randHex })
})

router.get('/edit/:id', async (req, res) => {
  const argument = await Argument.findById(req.params.id)
  res.render('articles/edit', { argument: argument, randHex: argument.randHex })
})

router.get('/:slug', async (req, res) => {
  const argument = await Argument.findOne({ slug: req.params.slug })
  if (argument == null) res.redirect('/')
  res.render('articles/show', { argument: argument })
})

router.post('/', async (req, res, next) => {
  req.argument = new Argument()
  next()
}, saveArgumentAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
  req.argument = await Argument.findById(req.params.id)
  next()
}, saveArgumentAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
  await Argument.findByIdAndDelete(req.params.id)
  res.redirect('/')
})

function saveArgumentAndRedirect(path) {
  return async (req, res) => {
    let argument = req.argument
    argument.title = req.body.title
    argument.description = req.body.description
    argument.markdown = req.body.markdown
    argument.argumentId = req.body.argumentId
    try {
      argument = await argument.save()
      res.redirect(`/articles/${argument.slug}`)
    } catch (e) {
      res.render(`articles/${path}`, { argument: argument })
    }
  }
}

module.exports = router