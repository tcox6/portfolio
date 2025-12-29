const policyParagraph = document.getElementById("policy");

// generate string for privacy policy
let policy = "";
for (let i = 0; i < 10000; i++) {
    policy += "bl";

    for (let j = 1; j < Math.floor(Math.random() * 5)+2; j++) {
        policy += "a";
    }
    for (let j = 1; j < Math.floor(Math.random() * 5)+2; j++) {
        policy += "h";
    }

    if (i != 10000 - 1) {
        policy += " ";
    }
}

policy += ".";

policyParagraph.innerText = policy;

setTimeout(gameOfLifeCanvasResize, 50);