var prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
'use strict';
// Set theme on load
var currentTheme = localStorage.getItem("theme");
if (currentTheme == "dark") {
    document.body.classList.toggle("dark-theme");
}
else if (currentTheme == "light") {
    document.body.classList.toggle("light-theme");
}
// Change theme
function changeTheme() {
    if (prefersDarkScheme.matches) {
        // Light theme
        document.body.classList.toggle("light-theme");
        var theme = document.body.classList.contains("light-theme")
            ? "light"
            : "dark";
    }
    else {
        // Dark theme
        document.body.classList.toggle("dark-theme");
        var theme = document.body.classList.contains("dark-theme")
            ? "dark"
            : "light";
    }
    localStorage.setItem("theme", theme);
}
