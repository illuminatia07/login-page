const express = require("express");
const path = require("path");
const session = require("express-session");
const nocache = require("nocache");
const { validateEmail, validatePassword } = require("./utils");

const app = express();

app.use(nocache());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/static", express.static(path.join(__dirname, "views")));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

const cred = [
  {
    email: "viswa@gmail.com",
    password: "Viswa123@",
  },
  {
    email: "admin@gmail.com",
    password: "Admin123@",
  },
];

// Home route
app.get("/", (req, res) => {
  if (req.session.isAuth) {
    res.redirect("/dashboard");
  } else {
    res.render("base", { title: "Login System" });
  }
});

app.get("/login", (req, res) => {
  if (req.session.isAuth) {
    res.render("base", { title: "Login System" });
  } else {
    res.redirect("/dashboard");
  }
});

// Login user
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Validate email format
  if (!validateEmail(email)) {
    return res.render("base", {
      title: "Login System",
      logout: "Invalid email format",
    });
  }

  // Validate password format
  if (!validatePassword(password)) {
    return res.render("base", {
      title: "Login System",
      logout: "Invalid password format",
    });
  }

  const valid = cred.find(
    (cred) => cred.email === email && cred.password === password
  );
  if (valid) {
    req.session.user = req.body.email;
    req.session.isAuth = true;
    return res.redirect("/dashboard");
  } else {
    return res.render("base", {
      title: "Login System",
      logout: "Invalid Username or Password",
    });
  }
});

// Route for Dashboard
app.get("/dashboard", (req, res) => {
  if (req.session.user) {
    res.render("dashboard", { user: req.session.user });
  } else {
    res.render("base", { title: "Login System" });
  }
});

// Route for Logout
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.render("base", { title: "Logout", logout: "Logout Successfully..!" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Listening to the server on http://localhost:3000");
});
