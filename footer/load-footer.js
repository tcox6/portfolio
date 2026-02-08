fetch("/footer/footer.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("footer").innerHTML = data;

        // make footer extend to the end of the page
        const footerEmbedded = document.getElementById("footerEmbedded");
        if (footerEmbedded.offsetTop + footerEmbedded.offsetHeight < document.body.offsetHeight) {
            footerEmbedded.style.height = String(document.body.offsetHeight - footerEmbedded.offsetTop) + "px";
        }
    });