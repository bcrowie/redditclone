const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");
const db = require("./config/database");
const models = require("./models");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "client/build")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

db.authenticate()
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log("Database connection error: " + err));

app.use(passport.initialize());
require("./config/passport")(passport);

models.sequelize.sync().then(() => {
  app.listen(port, () => console.log(`Listening on port ${port}`));
});

app.use(cors());

app.use("/users", require("./routes/users"));
app.use("/posts", require("./routes/posts"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.use((err, req, res, next) => {
  res.json(err);
});
