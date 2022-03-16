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
 * @returns
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
 *
 * @param {*} smartzoneId
 * @returns
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
    `INSERT INTO smartzone SET name = ?, town = ?, location = ?, function = ?, time = ?, size = ?, utilization = ?, description = ?, image = ?`,
    prepareForInsert(smartzone)
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
    `UPDATE smartzone SET name = ?, town = ?, location = ?, function = ?, time = ?, size = ?, utilization = ?, description = ?, image = ? WHERE smartzoneId = ?`,
    prepareForPut(smartzone)
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
  console.log(`PATCH called with ${smartzone}`)
  console.log(prepareForPatchQuery(smartzone))
  console.log(prepareForPatch(smartzone))
  /*
  const rows = await db.query(
    `UPDATE smartzone SET ${prepareForPatchQuery(smartzone)} WHERE smartzoneId = ?`,
    prepareForPatch(smartzone)
  )
  return {
    data: {},
    meta: helper.emptyOrRows(rows),
  }
  */
  return {
    message: 'Testing PATCH, pls use journal..',
  }
}

/**
 *
 * @param {*} smartzoneId
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
 * Prepares a passed smartzone object for insertion in the db, it's mostly an order
 * thing as the insert query expects an array with a certain order.
 * @param {*} smartzone a new smartzone object created with the smartzone constructor
 * @returns [] an array to be used in the insert query
 */
function prepareForInsert(smartzone) {
  return [
    smartzone.name,
    smartzone.town,
    smartzone.location,
    smartzone.function,
    smartzone.time,
    smartzone.size,
    smartzone.utilization,
    smartzone.description,
    smartzone.image,
  ]
}

/**
 * Prepares a passed smartzone object for update using the REST put method. It's
 * mostly an order thing as the update query expects an array with a certain order.
 * @param {*} smartzone a smartzone object created with the smartzone constructor
 * @returns [] an array to be used in the update query
 */
function prepareForPut(smartzone) {
  return [
    smartzone.name,
    smartzone.town,
    smartzone.location,
    smartzone.function,
    smartzone.time,
    smartzone.size,
    smartzone.utilization,
    smartzone.description,
    smartzone.image,
    smartzone.smartzoneId,
  ]
}

/**
 *
 * @param {*} smartzone
 * @returns
 */
function prepareForPatchQuery(smartzone) {
  delete smartzone.smartzoneId
  console.log(Object.getOwnPropertyNames(smartzone).reduce((prev, curr) => `${prev}, ${curr} = ?`))
  return Object.getOwnPropertyNames(smartzone).reduce((prev, curr) => `${prev}, ${curr} = ?`)
}

/**
 *
 * @param {*} smartzone
 * @returns
 */
function prepareForPatch(smartzone) {
  const id = smartzone.smartzoneId
  delete smartzone.smartzoneId
  return [...smartzone, id]
}
