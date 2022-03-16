const express = require('express')
const Smartzone = require('../models/smartzone.model')

module.exports = express
  .Router()

  // Add a new smartzone
  .post('/', async (req, res, next) => {
    try {
      res.json(await Smartzone.post(new Smartzone(req.body)))
    } catch (err) {
      res.json({
        message: `Error while posting smartzone: ${err.message}`,
        request: req.body,
      })
    }
  })

  // List ALL smartzones
  .get('/', async (req, res, next) => {
    try {
      res.json(await Smartzone.get(req.query.page))
    } catch (err) {
      res.json({
        message: `Error while getting smartzone: ${err.message}`,
        request: req.body,
      })
    }
  })

  .put('/', async (req, res, next) => {
    try {
      res.json(await Smartzone.put(new Smartzone(req.body)))
    } catch (err) {
      res.json({
        message: `Error while putting smartzone: ${err.message}`,
        request: req.body,
      })
    }
  })
