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
        <tr>
          <td>id</td>
          <td>lat</td>
          <td>lng</td>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) =>
              `<tr>
              <td>${row.id}</td>
              <td>${row.lat}</td>
              <td>${row.lng}</td>
            </tr>`
          )
          .join("")}
      </tbody>
    </table>
    <form method=POST>
      <label>lat</label>
      <input name="lat" />
      <label>lng</label>
      <input name="lng" />
      <button type="submit">Add Post</button>
    </form>
  `);
});

app.post("/posts", async (req, res) => {
  const { lat, lng } = req.body;

  await pool.query(
    `
    INSERT INTO posts (lat, lng) VALUES ($1, $2);
  `,
    [lat, lng]
  );

  res.redirect("/posts");
});

app.listen(5000, () => {
  console.log("server started on port 5000...");
});
