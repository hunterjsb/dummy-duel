const express = require('express')
const mongoose = require('mongoose')
const Argument = require('./models/argument')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
require('dotenv').config();
const app = express()

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
  const argument = await Argument.find().sort({ createdAt: 'desc' })
  res.render('articles/index', { argument: argument })
})

app.use('/articles', articleRouter)
app.use(express.static('public'))

app.listen(process.env.PORT || 5000)