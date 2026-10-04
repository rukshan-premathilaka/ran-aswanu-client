// Tiny event helpers so ANY page can open the login / sign-up popup and react to a login.
//   openAuthModal("login") or openAuthModal("register")  -> shows the popup over the current page
//   notifyAuthChanged()                                  -> tells the app "the user just logged in or out"
const OPEN_EVENT = "auth:open";
const CHANGED_EVENT = "auth:changed";

export function openAuthModal(mode = "login") {
    window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { mode } }));
}

export function onAuthModalOpen(callback) {
    const handler = (e) => callback(e.detail?.mode === "register" ? "register" : "login");
    window.addEventListener(OPEN_EVENT, handler);
    return () => window.removeEventListener(OPEN_EVENT, handler);
}

export function notifyAuthChanged() {
    window.dispatchEvent(new Event(CHANGED_EVENT));
}

export function onAuthChanged(callback) {
    window.addEventListener(CHANGED_EVENT, callback);
    return () => window.removeEventListener(CHANGED_EVENT, callback);
}