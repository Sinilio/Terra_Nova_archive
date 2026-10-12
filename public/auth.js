(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("loginForm");
    var msg  = document.getElementById("msg");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var login = document.getElementById("login").value.trim();
      var pass  = document.getElementById("password").value;

      msg.className = "msg";
      msg.textContent = "Проверка биометрии...";

      fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: login, password: pass })
      })
      .then(function (r) { return r.json().then(function (d) { return { status: r.status, data: d }; }); })
      .then(function (res) {
        if (res.data.ok) {
          msg.className = "msg ok";
          msg.textContent = "Доступ подтверждён. Открываю рабочий стол...";
          setTimeout(function () { window.location.href = "/desk.html"; }, 700);
        } else {
          msg.className = "msg err";
          msg.textContent = res.data.error || "Отказано.";
        }
      })
      .catch(function () {
        msg.className = "msg err";
        msg.textContent = "Сервер недоступен.";
      });
    });
  });
})();