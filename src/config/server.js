const express = require("express");
const bodyParser = require("body-parser");
const API_PORT = 3001;
const app = express();
const router = express.Router();
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// append /api for our http requests
app.use("/api", router);
app.use(cors({origin: '*'}));

router.get("/nbaScoreboard", (req, res) => {
  const json = require('../mock/scoreboard.json');
  return res.json({data: json});
});



// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));