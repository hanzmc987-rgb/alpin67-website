const modal = document.querySelector("#auth-modal");
const closeBtn = document.querySelector("#close-auth");
const tabs = [...document.querySelectorAll("[data-tab]")];
const title = document.querySelector("#auth-title");
const subtitle = document.querySelector("#auth-subtitle");
const nameField = document.querySelector("#name-field");
const nameInput = document.querySelector("#name");
const password = document.querySelector("#password");
const submit = document.querySelector("#submit-label");
const message = document.querySelector("#form-message");
let mode = "login";

function openAuth(nextMode = "login") {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  setMode(nextMode);
  document.querySelector("#email").focus();
}
function closeAuth() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  message.textContent = "";
}
function setMode(nextMode) {
  mode = nextMode;
  tabs.forEach(tab => tab.classList.toggle("active", tab.dataset.tab === mode));
  const registering = mode === "register";
  nameField.hidden = !registering;
  nameInput.required = registering;
  title.textContent = registering ? "Create your account" : "Welcome back";
  subtitle.textContent = registering ? "A few details and you’re ready to go." : "Enter your details to continue.";
  submit.innerHTML = registering ? 'Create account <span>→</span>' : 'Sign in <span>→</span>';
  password.autocomplete = registering ? "new-password" : "current-password";
  message.textContent = "";
}
document.querySelectorAll("[data-open-auth]").forEach(button => button.addEventListener("click", () => openAuth(button.dataset.openAuth)));
tabs.forEach(tab => tab.addEventListener("click", () => setMode(tab.dataset.tab)));
closeBtn.addEventListener("click", closeAuth);
modal.addEventListener("click", event => { if (event.target === modal) closeAuth(); });
document.addEventListener("keydown", event => { if (event.key === "Escape") closeAuth(); });

/* Front-end demonstration only. Production authentication needs a secure backend. */
document.querySelector("#auth-form").addEventListener("submit", event => {
  event.preventDefault();
  const email = document.querySelector("#email").value.trim().toLowerCase();
  const pass = password.value;
  if (pass.length < 8) {
    message.textContent = "Use at least 8 characters for the demo password.";
    return;
  }
  const users = JSON.parse(localStorage.getItem("alpin67_demo_users") || "{}");
  if (mode === "register") {
    if (users[email]) {
      message.textContent = "An account with this email already exists in this browser.";
      return;
    }
    users[email] = { name: nameInput.value.trim(), password: pass };
    localStorage.setItem("alpin67_demo_users", JSON.stringify(users));
    message.textContent = "Demo account created! You can now sign in.";
    setMode("login");
    document.querySelector("#email").value = email;
    password.value = "";
  } else {
    if (!users[email] || users[email].password !== pass) {
      message.textContent = "Email or password doesn't match a demo account.";
      return;
    }
    message.textContent = `Signed in locally. Welcome, ${users[email].name || "there"}!`;
  }
});
