const app = require("express")();
const bodyParser = require("body-parser");
const moment = require("moment");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const sockets = [];

const accounts = [
  {
    token: "0118-999-881",
    id: "528491",
    name: "Robert Fischer",
    bio:
      "Gotta listen to those tunes while I consider making an energy empire that has a GDP bigger than some countries"
  },
  {
    token: "999-119-7253",
    id: "117",
    name: "Master Chief",
    bio: "Need that classic rock to fight the flood."
  }
];

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/users", (req, res) => {
  res.json(accounts);
});

app.post("/charges", (req, res) => {
  const { token, status } = req.body;
  const user = accounts.filter(x => x.token === token)[0];

  console.log(`got status on user ${user.name}: ${status}`);

  res.json({ okay: true });

  io.emit("user-payment-status-updated", {
    user,
    status,
    time: moment().format("h:mm:ss a")
  });
});

io.on("connection", socket => {
  sockets.push(socket);

  socket.on("disconnect", () => {
    sockets.splice(sockets.indexOf(socket), 1);
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
