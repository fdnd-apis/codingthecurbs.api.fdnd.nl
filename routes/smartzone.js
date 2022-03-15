const express = require('express')
const Smartzone = require('../models/smartzone.model')

module.exports = express
  .Router()

  // Add a new smartzone
  // .post('/', async (req, res, next) => {
  //   try {
  //     console.log('Got: ', req.body)
  //     res.json(await Smartzone.create(new Smartzone(req.body)))
  //   } catch (err) {
  //     console.error('Error while adding smartzone: ', err.message)
  //     next(err)
  //   }
  // })

  // List ALL smartzones
  .get('/', async (req, res, next) => {
    try {
      res.json(await Smartzone.getAll(req.query.page))
    } catch (err) {
      console.error('Error while getting smartzones: ', err.message)
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
// Table: quote Columns: quoteId, smartzoneId, text
// Table: tag Columns: tagId, text
// Table: itemTag Columns: quoteId, tagId