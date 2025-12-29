fetch("/header/header.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("header").innerHTML = data;

        // inject the banner script
        const script = document.createElement("script");
        script.src = "/header/banner.js";
        script.defer = true;
        document.body.appendChild(script);
    });