const http = require("http");
const { connect } = require("http2");
const app = require("./app");
const connectDB = require("./util/db");

require("dotenv").config();

const PORT = process.env.PORT || 3000;

connectDB();

try {
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
  });
} catch (err) {
  console.log(err);
}
