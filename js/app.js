const sections = document.querySelectorAll("section");

const options = { threshold: 0.5 };
let observer = new IntersectionObserver(navCheck, options);

function navCheck(entries) {
  entries.forEach(entry => {
    const id = entry.target.id;
    const activeAnchor = document.querySelector(`[data-page=${id}]`);

    entry.target.style.opacity = entry.target.id !== "home" ? 0 : 1;
    entry.target.style.transition =
      entry.target.id !== "home" ? "opacity 500ms ease-in" : null;

    if (entry.isIntersecting) {
      activeAnchor.classList.add("active");

      entry.target.style.opacity = 1;
    } else {
      activeAnchor.classList.remove("active");
    }
  });
}

sections.forEach(section => {
  observer.observe(section);
});

const menu = document.querySelector(".menu-toggle");
const menuIcon = document.querySelector(".menu-toggle > i");
const nav = document.querySelector("nav");

menu.addEventListener("click", () => {
  if (menuIcon.className === "fas fa-bars") {
    menuIcon.className = "fas fa-times";
    nav.style.opacity = 1;
    nav.style.visibility = "visible";
  } else {
    menuIcon.className = "fas fa-bars";
    nav.style.opacity = 0;
    nav.style.visibility = "hidden";
  }
});
