fetch("/header/header.html")
    .then(response => response.text())
    .then(data => document.getElementById("header").innerHTML = data);

// add a banner notice that the website is designed for desktop viewing (if necessary)
