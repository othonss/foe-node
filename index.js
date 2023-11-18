const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");
const helpers = require("./helpers/exphbsHelper");
const path = require("path");

const PORT = process.env.PORT

const app = express();

const conn = require("./db/conn");

// Models
const Task = require("./models/Task");

// routes
const tasksRoutes = require("./routes/tasksRoutes");
const authRoutes = require("./routes/authRoutes");
const TaskController = require("./controllers/TaskController");

const hbs = exphbs.create({
  helpers: {
    ...helpers,
  },
});

app.engine('handlebars', exphbs.engine({
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views", "layouts")
}));

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

//session middleware
app.use(
  session({
    name: 'session',
    secret: 'nosso_secret',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require('path').join(require('os').tmpdir(), 'sessions'),
    }),
    cookie: {
      secure: false,
      maxAge: 86400000,
      expires: new Date(Date.now() + 86400000),
      httpOnly: true,
    },
  }),
)

// flash messages
app.use(flash());

app.use('/', express.static(__dirname + '/public'));

// set session to res
app.use((req, res, next) => {
  // console.log(req.session)
  console.log(req.session.userid);

  if (req.session.userid) {
    res.locals.session = req.session;
  }

  next();
});

app.use("/tasks", tasksRoutes);
app.use("/", authRoutes);

app.get("/", TaskController.showTasks);

app.use((req, res, next) => {
  const existingRoutes = ['/auth/login', '/auth/register', '/auth/users', '/tasks/add', '/tasks/edit/:id', '/tasks/dashboard', '/tasks/'];
  if (existingRoutes.includes(req.url)) {
    next(); 
  } else {
    res.status(404).render('error/notfound');
  }
});

conn
  .sync()
  .then(() => {
    app.listen(PORT);
  })
  .catch((err) => console.log(err));
