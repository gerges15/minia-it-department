export const handelLabel = (e) => {
  const headerLabel = document.querySelector(".dashboard__header");
  if (!isIcon(e)) {
    clearTab(e);
    insertClass(e, "active-tab");
    replaceContext(headerLabel, e);
    clearSection();
    showCurrentSection(e);
  }
};

function clearTab(e) {
  e.target
    .closest(".tabs")
    .querySelectorAll(".tab-item")
    .forEach((el) => {
      el.classList.remove("active-tab");
    });
}

function insertClass(e, aClassNames) {
  e.target.classList.add(`${aClassNames}`);
}

function replaceContext(anElement, e) {
  anElement.textContent = e.target.textContent;
}

function isIcon(e) {
  const targetElement = e.target.nodeName;
  return (
    (targetElement == "svg" || targetElement == "path") && targetElement != "li"
  );
}

function clearSection() {
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => {
    section.classList.add("hide");
  });
}

function showCurrentSection(e) {
  const sectionId = `${e.target.id}`;
  document.querySelector(`#${sectionId}-section`).classList.remove("hide");
}
