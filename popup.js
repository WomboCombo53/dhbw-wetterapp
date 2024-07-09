const openBtn = document.getElementById("popupoeffnen");
const closeBtn = document.getElementById("popupschliessen");
const modal = document.getElementById("popup");

openBtn.addEventListener("click", () => 
{
    modal.classList.add("open");
});

closeBtn.addEventListener("click", () =>
{
    modal.classList.remove("open");
});