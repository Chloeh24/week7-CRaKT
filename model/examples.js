const db = require("../db/connection.js");

function getAllExamples() {
  return db
    .query(
      `SELECT 
    users.username,
    examples.owner_id,
    examples.language,
    examples.title,
    examples.example,
    examples.date
    FROM     
    examples INNER JOIN users ON users.id = examples.owner_id;`
    )
    .then((result) => result.rows)
    .catch((error) => {
      console.log("Error at getAllExamples handler is :" + error);
    });
}

function createExample(example) {
  return db
    .query(
      "INSERT INTO examples(language, title, example) VALUES($1, $2, $3) RETURNING id",
      [example.language, example.title, example.example]
    )
    .then((result) => {
      console.log(result.row);
      return result.rows[0].id;
    })
    .catch((error) => {
      console.log("Error in model/examples.js, createExample()", error);
    });
}

// function getExampleById(id) {
//   return db
//     .query("SELECT * FROM examples WHERE id = ($1);", [id])
//     .then( result => result.rows[0] );
// }

function deleteExample(exampleId, userId) {
  return getExample(exampleId)
  .then( exampleObjectFromDB => {
    if(exampleObjectFromDB.id === userId){
      return db.query("DELETE FROM examples WHERE id = ($1);", [exampleId])
          .then( result => true )
    } else {
      return false;
    }
  })
}

module.exports = {
  getAllExamples,
  createExample,
  deleteExample
};
