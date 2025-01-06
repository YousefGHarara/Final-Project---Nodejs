const { MongoClient } = require("mongodb");

const collection_name = "FinalProject";
const _uri = "mongodb://localhost:27017";

const dbConnection = (collection, cb) => {
  MongoClient.connect(_uri)
    .then(async (client) => {
      const db = client.db(collection_name).collection(collection);
      await cb(db);
      client.close();
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = dbConnection;
