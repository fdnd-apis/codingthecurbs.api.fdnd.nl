const db = require('./db')
const helper = require('./helper')

/**
 * Constructor for new smartzones that checks if the passed object adheres the
 * format we need and throws errors if it doesn't
 * @param {*} smartzone an object containing the necessary fields to make a new smartzone
 */
const smartzone = function (smartzone) {
  // TODO: Check for sanity...
  this.smartzoneId = smartzone.smartzoneId
  this.name = smartzone.name
  this.town = smartzone.town
  this.location = smartzone.location
  this.function = smartzone.function
  this.time = smartzone.time
  this.size = smartzone.size
  this.utilization = smartzone.utilization
  this.description = smartzone.description
  this.image = smartzone.image
}

/**
 * Get all smartzones from the database, will be paginated if the number of
 * smartzones in the database exceeds process.env.LIST_PER_PAGE
 * @param {*} page the page of authors you want to get
 * @returns an object containing the requested data and some meta information
 */
smartzone.get = async function (page = 1) {
  const rows = await db.query(`SELECT * FROM smartzone LIMIT ?,?`, [
    helper.getOffset(page, process.env.LIST_PER_PAGE),
    Number(process.env.LIST_PER_PAGE),
  ])

  return {
    data: helper.emptyOrRows(rows),
    meta: { page },
  }
}

/**
 * Get a specific smartzone from the database
 * @param {*} smartzoneId the id of the smartzone to return
 * @returns an object containing the requested data and some meta information
 */
smartzone.getById = async function (smartzoneId) {
  const rows = await db.query(`SELECT * FROM smartzone WHERE smartzoneId = ?`, [smartzoneId])
  return {
    data: helper.emptyOrRows(rows),
    meta: { page },
  }
}

/**
 * Add a new smartzone to the database
 * @param {*} smartzone a new smartzone object created with the smartzone constructor
 * @returns an object containing the inserted smartzone with the newly inserted smartzoneId
 */
smartzone.post = async function (smartzone) {
  const rows = await db.query(
    `INSERT INTO smartzone SET ${prepareQuery(smartzone)}`,
    prepareParams(smartzone)
  )
  smartzone.smartzoneId = rows.insertId
  return {
    data: [smartzone],
    meta: {
      insertId: rows.insertId,
    },
  }
}

/**
 * Update a smartzone in the database using put (pass the whole object)
 * @param {*} smartzone a complete smartzone object with the applied changes
 * @returns
 */
smartzone.put = async function (smartzone) {
  const rows = await db.query(
    `UPDATE smartzone SET ${prepareQuery(smartzone)} WHERE smartzoneId = ?`,
    prepareParams(smartzone)
  )
  return {
    data: {},
    meta: helper.emptyOrRows(rows),
  }
}

/**
 * Patch a smartzone in the database
 * @param {*} smartzone a smartzone object containing at least the smartzoneId and one other field.
 * @returns
 */
smartzone.patch = async function (smartzone) {
  const rows = await db.query(
    `UPDATE smartzone SET ${prepareQuery(smartzone)} WHERE smartzoneId = ?`,
    prepareParams(smartzone)
  )
  return {
    data: {},
    meta: helper.emptyOrRows(rows),
  }
}

/**
 * Remove a smartzone from the database
 * @param {*} smartzoneId the id of the smartzone to delete
 * @returns
 */
smartzone.delete = async function (smartzoneId) {
  const rows = await db.query(`DELETE FROM smartzone WHERE smartzoneId = ?`, [smartzoneId])
  return {
    data: {},
    meta: helper.emptyOrRows(rows),
  }
}

module.exports = smartzone

/**
 * Prepares part of an SQL query based on a passed partial smartzone object
 * @param {*} smartzone partial smartzone object containing at least the smartzoneId
 * @returns a string to be used in the patch query, eg 'field = ?, field2 = ? ...'
 */
function prepareQuery(smartzone) {
  return Object.keys(smartzone)
    .filter((field) => field != 'smartzoneId')
    .map((field) => `${field} = ?`)
    .reduce((prev, curr) => `${prev}, ${curr}`)
}

/**
 * Prepares a passed partial smartzone object for querying the database. Whatever
 * fields are passed, the smartzoneId needs to be at the end.
 * @param {*} smartzone partial smartzone object containing at least the smartzoneId
 * @returns [] an array to be used in the patch query
 */
function prepareParams(smartzone) {
  const { smartzoneId, ...preparedSmartzone } = smartzone
  return [...Object.values(preparedSmartzone), smartzoneId]
}
