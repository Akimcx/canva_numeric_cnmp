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
    e.preventDefault()
    papmp.addMarche(obj.value, "TF", nature.value, budget.value);
  });

  next.addEventListener("click", (e) => {
    e.preventDefault()
    console.log(papmp.marches);

    screen2.removeAttribute("hidden");
    prev.removeAttribute("disabled");
    screen1.setAttribute("hidden", true);
    next.setAttribute("disabled", true);

    /** @type {HTMLSelectElement} */
    const passation = document.getElementById("passation")
    const procurement = papmp.marches[0].procedure.marchesInfo[0].procurement
    if(Array.isArray(procurement)) {
      procurement.forEach(p=> {
        const opt = document.createElement("option")
        opt.value = p
        opt.textContent = p
        passation.options.add(opt)
      })
    } else {
      const opt = document.createElement("option")
      opt.value = procurement
      opt.textContent = procurement

      passation.options.add(opt)
      passation.selectedIndex = 0
      passation.setAttribute("disabled", true)
    }

    /** @type {HTMLSelectElement} */
    const launch = document.getElementById("launch")
    /** @type {HTMLSelectElement} */
    const sign = document.getElementById("sign")
    
    launch.addEventListener("input",e=> {
      sign.innerHTML = ""
      const index = papmp.months.indexOf(launch.value) + 1;
      const months = papmp.months.slice(index,papmp.marches[0].procedure.launch_sign_time_diff+index)
      months.forEach(month=>{
        const opt = document.createElement("option")
        opt.value = month
        opt.textContent = month
        sign.options.add(opt)
      })
    })
    papmp.months.forEach(month=>{
      const opt = document.createElement("option")
      opt.value = month
      opt.textContent = month
      launch.options.add(opt)
    })
    sign.removeAttribute("disabled")
    launch.dispatchEvent(new Event("input"))



    /** @type {HTMLSelectElement} */
    const control = document.getElementById("control")
    control.selectedIndex = papmp.marches[0].procedure.control ? 0 : 1;
    control.setAttribute("disabled", true)
  });

  prev.addEventListener("click", (e) => {
    e.preventDefault()

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
