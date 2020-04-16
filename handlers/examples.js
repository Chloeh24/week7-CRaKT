const modelExample = require("../model/examples");

function getAllExamples(req, res, next) {
  modelExample
    .getAllExamples()
    .then((example) => res.send(example))
    .catch(next);
}

// Inserts a new example into the examples table and returns the inserted row's id
function post(req, res, next) {
  req.body.user_id = req.user.user_id;
  req.body.admin = req.user.admin;
  modelExample
    .createExample(req.body)
    .then((exampleId) => {
      res.status(201).send({
        exampleId: exampleId,
      });
    })
    .catch(next);
}

function del(req, res, next) {
  modelExample
    .deleteExample( req.params.id, req.user.id )
    .then(() => {
      res.status(200).send({deleted: true})
    })
    .catch(next);

}

function getExample(req, res, next) {
  const id = req.params.id;
  modelExample
    .getExample(id)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch(next);
}

function updateExample(req, res, next) {
    const id = req.params.id;
    const userID = req.user.id;
    const newdata = req.body;
    if (typeof id !== "number") {
       const err = new Error ('This is not a valid ID')
       err.status = 401;
       next(err)
    }

    modelExample
        .updateExamplebyID(id, newdata, userID)
        .then(result => {
            res.status(200).send(result)
        })


}

module.exports = {
  getAllExamples,
  post,
  getExample,
  del, 
  updateExample
};
