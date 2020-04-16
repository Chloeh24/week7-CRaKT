const supertest = require("supertest");
const test = require("tape");
const server = require("../server");
const build = require("../db/build");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

test("Route tests are running!", (t) => {
  const x = 5;
  t.equal(x, 5, "this is working");
  t.end();
});

test("Test main route returns 200", (t) => {
  build().then(() => {
    supertest(server)
      .get("/")
      .expect(200)
      .expect("content-type", "application/json; charset=utf-8")
      .end((err, res) => {
        t.error(err, "HTTP status is 200 and application/json; charset=utf-8");
        t.equals(res.text.includes("Kat"), true, "Kat should be present");
        t.equals(
          res.text.includes("Test example 4"),
          true,
          "example title should be present"
        );
        t.equals(
          res.text.includes("Example 1 code goes here."),
          true,
          "example text should be present"
        );
        t.end();
      });
  });
});

test("Test /signup route", (t) => {
  build().then(() => {
    supertest(server)
      .post("/signup")
      .send({
        username: "Harry",
        email: "harry@potter.com",
        password: "wizard",
      })
      .expect(201)
      .expect("content-type", "application/json; charset=utf-8")
      .end((err, res) => {
        t.error(err, "HTTP status is 201 and application/json; charset=utf-8");
        // console.log(res.body)
        t.equals(typeof res.body, typeof {}, "Check an Object is returned");
        t.equals(res.body.username, "Harry", "Username should be Harry");
        t.notEquals(res.body.token, undefined, "Check that a token exists");
        t.equals(
          /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/.test(
            res.body.token
          ),
          true,
          "Check for correct jwt token"
        );
        t.end();
      });
  });
});

test("Test /login route", (t) => {
  build().then(() => {
    supertest(server)
      .post("/login")
      .send({
        email: "roger@iscool.com",
        password: "password",
      })
      .expect(200)
      .expect("content-type", "application/json; charset=utf-8")
      .end((err, res) => {
        t.error(err, "HTTP status is 200 and application/json; charset=utf-8");
        t.equals(typeof res.body, typeof {}, "Check an Object is returned");
        t.notEquals(res.body.token, undefined, "Check that a token exists");
        t.equals(
          /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/.test(
            res.body.token
          ),
          true,
          "Check for correct jwt token"
        );
        t.end();
      });
  });
});

test("Test /example POST route", (t) => {
  build().then(() => {
    const token = jwt.sign({ user_id: 2, admin: false }, process.env.SECRET, {
      expiresIn: "1hr",
    });
    supertest(server)
      .post("/examples")
      .set({
        Authorization: "Bearer " + token,
      })
      .send({
        language: "js",
        title: "Test Post 99",
        example: "Test body 99",
      })
      .expect(201)
      .expect("content-type", "application/json; charset=utf-8")
      .end((err, res) => {
        t.error(err, "HTTP status is 200 and application/json; charset=utf-8");
        t.equals(typeof res.body, typeof {}, "Check an Object is returned");
        t.equals(
          typeof res.body.exampleId,
          typeof 1,
          "Check we get an integer ID"
        );
        t.end();
      });
  });
});
// skipped
test.skip("Test /example POST route fails without valid auth token", (t) => {
  build().then(() => {
    const token = jwt.sign({ user_id: 2, admin: false }, process.env.SECRET, {
      expiresIn: "1hr",
    });
    supertest(server)
      .post("/examples")
      .set({
        Authorization: "Bearer lsdkdfjlskdfjlskdjfwoierwoierfksd",
      })
      .send({
        language: "js",
        title: "Test Post 99",
        example: "Test body 99",
      })
      .expect(201)
      .expect("content-type", "application/json; charset=utf-8")
      .end((err, res) => {
        t.error(err, "HTTP status is 200 and application/json; charset=utf-8");
        t.equals(typeof res.body, typeof {}, "Check an Object is returned");
        t.equals(
          typeof res.body.exampleId,
          typeof 1,
          "Check we get an integer ID"
        );
        t.end();
      });
  });
});

test.skip("Test /example/:1 DELETE route", (t) => {
  build().then(() => {
    const token = jwt.sign({ user_id: 2, admin: false }, process.env.SECRET, {
      expiresIn: "1hr",
    });
    supertest(server)
      .delete("/examples/:1")
      .set({
        Authorization: "Bearer " + token,
      })
      .send({
        exampleId: 1
      })
      .expect(200)
      .expect("content-type", "application/json; charset=utf-8")
      .end((err, res) => {
        t.error(err, "HTTP status is 200 and application/json; charset=utf-8");
        t.equals(typeof res.body, typeof {}, "Check an Object is returned");
        t.equals(res.body.deleted, true, "Item deleted");
        t.end();
      });
  });
});