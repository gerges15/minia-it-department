export const handelLabel = (e) => {
  const headerLabel = document.querySelector(".header h1");
  if (!isIcon(e)) {
    clearTab(e);
    insertClass(e, "active-tab");
    replaceContext(headerLabel, e);
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
