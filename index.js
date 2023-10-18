import PAPMP from "./marche.js";

/** @type {HTMLInputElement} */
const institution = document.getElementById("institution");
/** @type {HTMLInputElement} */
const sigle = document.getElementById("sigle");
/** @type {HTMLSelectElement} */
const identity = document.getElementById("identity");

/** @type {HTMLButtonElement} */
const addBtn = document.getElementById("add");

/** @type {HTMLDialogElement} */
const dialog = document.querySelector("dialog");
addBtn.addEventListener("click", (e) => {
  console.log(institution.value);
  console.log(sigle.value);
  console.log(identity.value);
  if (!institution.value || !sigle.value || !identity.value) {
    alert("Informations manquantes");
    return;
  }

  dialog.showModal();
  const papmp = new PAPMP(institution.value, sigle.value, identity.value);
  const screen1 = document.getElementById("screen1");
  const screen2 = document.getElementById("screen2");
  const prev = document.getElementById("prev");
  prev.setAttribute("disabled", true);
  const next = document.getElementById("next");
  const validate = document.getElementById("validate");

  const obj = document.getElementById("objet");
  const budget = document.getElementById("budget");
  const nature = document.getElementById("nature");

  validate.addEventListener("click", (e) => {
    papmp.addMarche(obj.value, "TF", nature.value, budget.value);
  });

  next.addEventListener("click", (e) => {
    console.log(papmp.marches);

    screen2.removeAttribute("hidden");
    prev.removeAttribute("disabled");
    screen1.setAttribute("hidden", true);
    next.setAttribute("disabled", true);
  });

  prev.addEventListener("click", (e) => {
    screen1.removeAttribute("hidden");
    next.removeAttribute("disabled");
    screen2.setAttribute("hidden", true);
    prev.setAttribute("disabled", true);
  });
});

const brh = new PAPMP("Administration Generale des douanes", "AGD", "level1");

brh.addMarche("Achat Fournitures de bureau", "TF", "F", 9.7);
brh.addMarche("Fournitures de bureau", "TF", "F", 16);
brh.addMarche("achat de deux (2) vehicules", "TF", "F", 15);

// brh.marches.forEach((marche) => {
//   console.log(marche.obj, marche.price, marche.procedure);
// });
