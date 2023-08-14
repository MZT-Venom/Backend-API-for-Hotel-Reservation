const { default: mongoose } = require("mongoose");

var dbURL = "********";

mongoose.connect(dbURL, { useUnifiedtopology: true, UseNewUrlParser: true });

var con = mongoose.connection;
con.on("error", () => {
  console.log("Warr gy wai");
});

con.on("connected", () => {
  console.log("shabash e puttar");
});

module.exports = mongoose;
