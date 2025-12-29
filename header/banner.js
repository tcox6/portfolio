const banner = document.getElementById("banner");

/**
 * Add a banner notice that the website is designed for desktop viewing (if necessary)
 */
function addBannerIfNecessary() {
    if (window.innerWidth < window.innerHeight * 1.5) {
        banner.style.visibility = "visible";
        banner.innerHTML = "<strong>Warning: This website is not optimised for mobile devices.</strong>";
    } else {
        banner.style.visibility = "hidden";
    }
}

// check if banner is necessary
addBannerIfNecessary();

window.addEventListener('resize', addBannerIfNecessary);