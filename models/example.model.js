const db = require('./db')
const helper = require('./helper')

/**
 * Constructor for new examples that checks if the passed object adheres the
 * format we need and throws errors if it doesn't
 * @param {*} example an object containing the necessary fields to make a new example
 */
const example = function (example) {
  // TODO: Check for sanity...
  this.exampleId = example.exampleId
  this.field = example.field
  this.otherField = example.otherField
}

/**
 * Get all examples from the database, will be paginated if the number of
 * examples in the database exceeds process.env.LIST_PER_PAGE
 * @param {*} page the page of authors you want to get
 * @returns
 */
example.get = async function (page = 1) {
  const rows = await db.query(`SELECT * FROM example LIMIT ?,?`, [
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
 * @param {*} exampleId
 * @returns
 */
example.getById = async function (exampleId) {
  const rows = await db.query(`SELECT * FROM example WHERE exampleId = ?`, [exampleId])
  return {
    data: helper.emptyOrRows(rows),
    meta: { page },
  }
}

/**
 * Add a new example to the database
 * @param {*} example a new example object created with the example constructor
 * @returns an object containing the inserted example with the newly inserted exampleId
 */
example.post = async function (example) {
  const rows = await db.query(
    `INSERT INTO example SET field = ?, otherField = ?`,
    prepareForInsert(example)
  )
  example.exampleId = rows.insertId
  return {
    data: [example],
    meta: {
      insertId: rows.insertId,
    },
  }
}

/**
 *
 * @param {*} example
 * @returns
 */
example.patch = async function (example) {
  const rows = await db.query(
    `UPDATE example SET ${prepareForPatchQuery(example)} WHERE exampleId = ?`,
    prepareForPatch(example)
  )
  return {
    data: helper.emptyOrRows(rows),
    meta: {},
  }
}

/**
 *
 * @param {*} example
 * @returns
 */
example.put = async function (example) {
  const rows = await db.query(
    `UPDATE example SET field = ?, otherField = ? WHERE exampleId = ?`,
    prepareForPatch(example)
  )
  return {
    data: helper.emptyOrRows(rows),
    meta: {},
  }
}

/**
 *
 * @param {*} exampleId
 * @returns
 */
example.delete = async function (exampleId) {
  const rows = await db.query(`DELETE FROM example WHERE exampleId = ?`, [exampleId])
  return {
    data: helper.emptyOrRows(rows),
    meta: {},
  }
}

module.exports = example

/**
 * Prepares a passed example object for insertion in the db, it's mostly an order
 * thing as the insert query expects an array with a certain order.
 * @param {*} example a new example object created with the example constructor
 * @returns [] an array to be used in the insert query
 */
function prepareForInsert(example) {
  return [example.field, example.otherField]
}

/**
 *
 * @param {*} example
 * @returns
 */
function prepareForPatchQuery(example) {
  delete example.exampleId
  return example.getOwnPropertyNames.reduce((prev, curr) => `${prev}, ${curr} = ?`)
}

/**
 *
 * @param {*} example
 * @returns
 */
function prepareForPatch(example) {
  const id = example.exampleId
  delete example.exampleId
  return [...example, id]
}
