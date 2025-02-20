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
    <form method="POST">
      <h3>Create a post</h3>
      <div>
        <label>lat</label>
        <input name="lat" />
      </div>
      <div>
        <label>lng</label>
        <input name="lng" />
      </div>
      <button type="submit">Add Post</button>
    </form>
  `);
});

app.post("/posts", async (req, res) => {
  const { lat, lng } = req.body;

  await pool.query(
    `
    INSERT INTO posts (lat, lng, loc) VALUES ($1, $2, $3);
  `,
    [lat, lng, `(${lng}, ${lat})`]
  );

  res.redirect("/posts");
});

app.listen(5000, () => {
  console.log("server started on port 5000...");
});
