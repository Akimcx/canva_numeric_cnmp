"use strict";

import PAPMP from "./marche.js";

/** @type {HTMLButtonElement} */
const addBtn = document.getElementById("add");

/** @type {HTMLDialogElement} */
const dialog = document.querySelector("dialog");
addBtn.addEventListener("click", (e) => {
  dialog.showModal();
});

// const seuil = {
//   level1: [
//     {
//       name: "Procedures de Demandes",
//       options: [
//         {
//           min: 3.5,
//           max: 10,
//           modePassation: "demande prix",
//           nature: "fourniture",
//         },
//         {
//           min: 3.5,
//           max: 15,
//           modePassation: "demande cotations",
//           nature: "travaux",
//         },
//       ],
//     },
//     {
//       name: "Procedures de allegees",
//       options: [
//         {
//           min: 3.5,
//           max: 14,
//           modePassation: "pral",
//           nature: "prestation",
//         },
//         {
//           min: 10,
//           max: 16,
//           modePassation: "pral",
//           nature: "fourniture",
//         },
//         {
//           min: 15,
//           max: 35,
//           modePassation: "pral",
//           nature: "travaux",
//         },
//       ],
//     },
//     {
//       name: "Procedures de generales",
//       options: [
//         {
//           min: 14,
//           modePassation: "aoon|aooi",
//           nature: "prestation",
//         },
//         {
//           min: 16,
//           modePassation: "aoon|aooi",
//           nature: "fourniture",
//         },
//         {
//           min: 35,
//           modePassation: "aoon|aooi",
//           nature: "travaux",
//         },
//       ],
//     },
//   ],
//   level2: {},
//   level3: {},
//   level4: {},
// };

// const montant = 10.5;
// const level = "level1";

// for (let i = 0; i < seuil[level].length; i++) {
//   const e = seuil[level][i];
//   console.log(e);
// }

const brh = new PAPMP("Banque", "BRH", "level1");

brh.addMarche("construction d'un nouveau batiment", "FP", "T");
brh.addMarche("achat vehicule", "FP", "F");
