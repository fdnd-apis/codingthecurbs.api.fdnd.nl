const express = require('express')
const Author = require('../models/author.model')

module.exports = express
  .Router()

  // Add a new author
  .post('/', async (req, res, next) => {
    try {
      console.log('Got: ', req.body)
      res.json(await Author.create(new Author(req.body)))
    } catch (err) {
      console.error('Error while adding author: ', err.message)
      next(err)
    }
  })

  // List ALL authors
  .get('/', async (req, res, next) => {
    try {
      res.json(await Author.getAll(req.query.page))
    } catch (err) {
      console.error('Error while getting authors: ', err.message)
      next(err)
    }
  })

// TODO
// .get('/v1/:searchString', async (req, res, next) => {})
// .get('/v1/quotes/length/asc', async (req, res, next) => {})
// .get('/v1/quotes/length/desc', async (req, res, next) => {})
// .get('/v1/quotes/alphabetical/asc', async (req, res, next) => {})
// .get('/v1/quotes/alphabetical/desc', async (req, res, next) => {})

// Make quotes like this:
// Table: quote Columns: quoteId, authorId, text
// Table: tag Columns: tagId, text
// Table: itemTag Columns: quoteId, tagId
