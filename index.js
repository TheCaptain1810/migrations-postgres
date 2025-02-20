const express = require("express");
const pg = require("pg");

const pool = new pg.Pool({
  user: "postgres",
  database: "ig",
  password: "password",
  host: "localhost",
  port: "5432",
});

// pool.query("SELECT 1 + 1;").then((res) => console.log(res));

const app = express();
app.use(express.urlencoded({ extended: true }));

app.get("/posts", async (req, res) => {
  const { rows } = await pool.query(`
    SELECT * FROM posts;
  `);

  res.send(`
    <table>
      <thead>
        <tr>id</tr>
        <tr>lat</tr>
        <tr>lng</tr>
      </thead>
      <tbody>
        ${rows.map((row) => {
          <tr></tr>
          <tr></tr>
          <tr></tr> 
        })}
      </tbody>
    </table> 
  `);
});

app.listen(5000, () => {
  console.log("server started on port 5000...");
});

