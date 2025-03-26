export const handelLabel = (e) => {
  const headerLabel = document.querySelector(".dashboard__header");
  const sectionId = `${e.target.id}`;
  if (!isIcon(e)) {
    clearTab(e);
    insertClass(e, "active-tab");
    replaceContext(headerLabel, e);
    clearSection();
    document.querySelector(`#${sectionId}-section`).classList.remove("hide");
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
