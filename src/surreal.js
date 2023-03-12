const Surreal = require('surrealdb.js').default
const cc = require("./constants.js");
const db = new Surreal("http://127.0.0.1:8000/rpc");
class surrealDB {

  constructor() {
    this.connection = false;
  }
  static async initDB() {
    try {
      this.connection = true;
      // Signin as a namespace, database, or root user
      await db.signin({
        user: cc.username,
        pass: cc.password,
      });

      // Select a specific namespace / database
      await db.use(cc.namespace, cc.database);
      console.log(`Successful connected. namespace=${cc.namespace}, database=${cc.database}`);
    } catch (err) {
      this.connection = false;
      console.log(err);
    }
  }

  static async createTable({ table, props }) {
    // Create a new person with a random id
    await db.create(table, props);

    // await db.select(table);
  }

  static async updateColumn({ table, props }) {
    // Update a person record with a specific id
    return await db.change(table, props);
  }
  static async query({ query, table }) {
    // Perform a custom advanced query
    const res = await db.query(query, {
      tb: table,
    });
    return res;
  }
  static async selectTable({ table }) {
    // Select all people records
    await db.query(`SELECT * FROM ${table}`, {
      tb: table,
    });
  }
  static async delete({ id }) {
    // Select all people records
    const res = await db.delete(id);
    return res
  }
}
module.exports = surrealDB