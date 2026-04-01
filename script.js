// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener("DOMContentLoaded", () => {
    // Заставка висит 5 секунд, затем плавно исчезает
    setTimeout(() => {
        const splash = document.getElementById("splash-screen");
        const app = document.getElementById("app-content");
        
        if (splash && app) {
            splash.style.opacity = "0";
            setTimeout(() => {
                splash.style.display = "none";
                app.style.display = "block";
            }, 500);
        }
    }, 5000);
});
