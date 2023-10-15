"use strict";

import PAPMP from "./marche.js";

/** @type {HTMLButtonElement} */
const addBtn = document.getElementById("add");

/** @type {HTMLDialogElement} */
const dialog = document.querySelector("dialog");
addBtn.addEventListener("click", (e) => {
  dialog.showModal();
});

const brh = new PAPMP("Banque", "BRH", "level1");

brh.addMarche("construction d'un nouveau batiment", "FP", "T", 17.5);
brh.addMarche("achat vehicule", "FP", "F", 14);
