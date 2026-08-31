const llmNoticeBanner = document.getElementById("llmNoticeBanner");
const llmCross = document.getElementById("llmExit");

llmCross.addEventListener('click', (e) => {
    llmNoticeBanner.style.visibility = 'hidden';
});