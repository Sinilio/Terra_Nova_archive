const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = 3000;

// ---------- Пользователи. Хранятся ТОЛЬКО на сервере. ----------
// В реальном проекте — база данных + хеши (bcrypt).
const USERS = {
"АУ-01": { pass: "arhiv-new-3",    role: "auditor"   }
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "t3rra-n0va::null-meridian", // напоминание для ШрыдьюЭра "АУ-01", "arhiv-new-3"
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: "lax" }
}));

// ---------- Статика: public/ ----------
app.use(express.static(path.join(__dirname, "public")));

// ---------- API: вход ----------
app.post("/api/login", (req, res) => {
  const { login, password } = req.body || {};
  const u = USERS[login];

  if (!u || u.pass !== password) {
    return res.status(401).json({ ok: false, error: "Отказано. Идентификатор или код неверны." });
  }

  // сохраняем в сессии — клиент этого не видит
  req.session.user = login;
  req.session.role = u.role;

  res.json({ ok: true, role: u.role, user: login });
});

// ---------- API: кто я ----------
app.get("/api/me", (req, res) => {
  if (!req.session.user) return res.status(401).json({ ok: false });
  res.json({ ok: true, user: req.session.user, role: req.session.role });
});

// ---------- API: выход ----------
app.post("/api/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

// ---------- Защита desk.html ----------
app.get("/desk.html", (req, res, next) => {
  if (!req.session.user) return res.redirect("/index.html");
  next();
});

app.listen(PORT, () => {
  console.log(`TerraNova запущена: http://localhost:${PORT}`);
});
