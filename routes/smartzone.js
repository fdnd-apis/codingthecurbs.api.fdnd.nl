const express = require('express')
const Smartzone = require('../models/smartzone.model')

module.exports = express
  .Router()

  // Post a new smartzone
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

  // Get all smartzones
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

  // Put a smartzone
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

  // Patch a smartzone
  .patch('/', async (req, res, next) => {
    try {
      res.json(await Smartzone.patch(req.body))
    } catch (err) {
      res.json({
        message: `Error while patching smartzone: ${err.message}`,
        request: req.body,
      })
    }
  })

  // Delete a smartzone
  .delete(['/', '/:id'], async (req, res, next) => {
    try {
      res.json(await Smartzone.delete(req.params.id || req.body.smartzoneId))
    } catch (err) {
      res.json({
        message: `Error while deleting smartzone: ${err.message}`,
        request: `You tried to delete smartzoneId: ${req.params.id || req.body.smartzoneId}`,
      })
    }
  })
