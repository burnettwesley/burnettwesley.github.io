document.addEventListener("DOMContentLoaded", () => {
    const themeToggles = document.querySelectorAll(".theme-toggle");
    const themeStorageKey = "preferred-theme";
    const menuToggle = document.querySelector(".menu-toggle");
    const menu = document.getElementById("menu");

    function updateThemeButtons() {
        const isDarkMode = document.body.classList.contains("dark-mode");
        themeToggles.forEach((button) => {
            button.setAttribute("aria-pressed", String(isDarkMode));
            button.textContent = isDarkMode ? "Light mode" : "Dark mode";
        });
    }

    const storedTheme = localStorage.getItem(themeStorageKey);
    const preferDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (storedTheme === "dark" || (!storedTheme && preferDarkMode)) {
        document.body.classList.add("dark-mode");
    }

    updateThemeButtons();

    themeToggles.forEach((button) => {
        button.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            const isDarkMode = document.body.classList.contains("dark-mode");
            localStorage.setItem(themeStorageKey, isDarkMode ? "dark" : "light");
            updateThemeButtons();
        });
    });

    if (!menuToggle || !menu) {
        return;
    }

    // Create overlay for dimming background on mobile
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    document.body.appendChild(overlay);

    function openMenu() {
        menu.removeAttribute("hidden");
        menuToggle.setAttribute("aria-expanded", "true");
        overlay.classList.add("active");
    }

    function closeMenu() {
        menu.setAttribute("hidden", "");
        menuToggle.setAttribute("aria-expanded", "false");
        overlay.classList.remove("active");
    }

    function toggleMenu() {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    // Toggle via hamburger button
    menuToggle.addEventListener("click", () => {
        toggleMenu();
    });

    // Close when tapping the overlay
    overlay.addEventListener("click", () => {
        closeMenu();
    });

    // Close menu after clicking a link (mobile only)
    const navLinks = document.querySelectorAll("#menu a");
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 768) {
                closeMenu();
            }
        });
    });

    // Ensure correct state on resize between desktop ↔ mobile
    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            // Ensure menu is closed on desktop
            closeMenu();
        }
    });

    // Allow keyboard users to close menu with Escape
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
            closeMenu();
            menuToggle.focus();
        }
    });
});
