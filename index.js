//the site for APIs https://openlibrary.org/developers/api#api-partners
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "YourDatabaseName",
  password: "YourPassword",
  port: 5432,
});
db.connect();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// using api to store data on db
// async function theappicall() {
//   const  url = "https://openlibrary.org/search.json?q=test"
//   const  options = {
//       method: 'GET',
//       headers: {"User-Agent": "MyAppName/1.0 (myemail@example.com)"}
//   };
//   const result = await axios.request(url, options);
//   const response = result.data.docs;
//   result.data.docs.forEach((doc) => {
//     db.query(
//       "INSERT INTO sentoni (title,author,avg_rating,subject,language) VALUES ($1,$2,$3,$4,$5)",
//       [doc.title,doc.author_name,doc.ratings_average,doc.subject,doc.language]
//     );
//       });
//       console.log("ok")
// };

app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.get("/home", (req, res) => {
  res.redirect("/");
});

app.get("/about", async (req, res) => {
  //used 1 time for store data in db
  // theappicall();
  try {
    let items = [];
    const result = await db.query("SELECT * FROM sentoni ORDER BY id ASC");
    items = result.rows;
    res.render("about.ejs", {listItems: items, listTitle:"Today"});
  } catch(err) {
    console.log(err)
  }
});

app.post("/add", async (req, res) => {
  try {
    const item = req.body.newItem;
    await db.query(
      "INSERT INTO sentoni (title) VALUES ($1)",
      [item]
    );
    res.redirect("/about");
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  try{
    const item = req.body.updatedItemTitle;
    const itid = req.body.updatedItemId;
    await db.query("UPDATE sentoni set title = ($1) where id = ($2);",
      [item, itid]
    );
    res.redirect("/about");
  } catch (err) {
    console.log(err);
  }
});


app.post("/delete", async (req, res) => {
  try {
    const itid = req.body.deleteItemId;
    await db.query("delete from sentoni where id = ($1);",
      [itid]
    );
    res.redirect("/about");
  } catch (err) {
    console.log(err);
  }
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

app.post("/submit", (req, res) => {
  res.render("index.ejs", {name:req.body["fname"]});
});


app.listen(port, () => {
  console.log(`Successfully started server on port ${port}.`);
});

