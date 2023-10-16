import PAPMP from "./marche.js";

/** @type {HTMLInputElement} */
const institution = document.getElementById("institution")
/** @type {HTMLInputElement} */
const sigle = document.getElementById("sigle")
/** @type {HTMLSelectElement} */
const identity = document.getElementById("identity")

/** @type {HTMLButtonElement} */
const addBtn = document.getElementById("add");

/** @type {HTMLDialogElement} */
const dialog = document.querySelector("dialog");
addBtn.addEventListener("click", (e) => {
  console.log(institution.value);
  console.log(sigle.value);
  console.log(identity.value);
  if(!institution.value || !sigle.value || !identity.value) {
    alert("Informations manquantes")
    return
  }
  dialog.showModal();
  const papmp = new PAPMP(institution.value, sigle.value, identity.sele)
  /** @type {HTMLTextAreaElement} */
  const obj = dialog.querySelector(".objet")
  obj.addEventListener("input", e=> {
    console.log(e.target.value)
  })
});

const brh = new PAPMP("Administration Generale des douanes", "AGD", "level1");

brh.addMarche("Achat Fournitures de bureau", "TF", "F", 9.7);
brh.addMarche("Fournitures de bureau", "TF", "F", 16);
brh.addMarche("achat de deux (2) vehicules", "TF", "F", 15);


brh.marches.forEach(marche => {
  console.log(marche.obj, marche.price, marche.procedure);
})