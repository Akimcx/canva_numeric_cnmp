import init, { Contract, ContractInfo, ContractType, Mode, Procedure, ProcedureKind, Seuil } from "./cdc/pkg/cdc.js";
import { Month } from "./cdc/pkg/cdc.js";
import { MoneyProvider } from "./cdc/pkg/cdc.js";
import { Identity } from "./cdc/pkg/cdc.js";
import { AC } from "./cdc/pkg/cdc.js";

const log = console.log;
const fmt = Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "HTG"
});

//TODO: clean up this mess
/** @type Seuil */
let mp;
/** @type AC */
let ac;

const ac_form = document.getElementById("ac_form");
if (!ac_form || !(ac_form instanceof HTMLFormElement)) throw new Error();
ac_form.querySelectorAll("input").forEach(input => setupValidation(input));

const show_contract_dialog = document.getElementById("show_contract_dialog");
if (!show_contract_dialog || !(show_contract_dialog instanceof HTMLButtonElement)) throw new Error();
show_contract_dialog.hidden = true;

const contract_dialog = document.getElementById("contract_dialog");
if (!contract_dialog || !(contract_dialog instanceof HTMLDialogElement)) throw new Error();

const add_contract_btn = document.getElementById("add_contract");
if (!add_contract_btn || !(add_contract_btn instanceof HTMLButtonElement)) throw new Error();

const first_screen = document.getElementById("screen1");
if (!first_screen || !(first_screen instanceof HTMLFormElement)) throw new Error();
first_screen.querySelectorAll("input").forEach(input => setupValidation(input));

const second_screen = document.getElementById("screen2");
if (!second_screen || !(second_screen instanceof HTMLFormElement)) throw new Error();
second_screen.querySelectorAll("input").forEach(input => setupValidation(input));

const prev_screen_btn = document.getElementById("prev");
if (!prev_screen_btn || !(prev_screen_btn instanceof HTMLButtonElement)) throw new Error();
prev_screen_btn.disabled = true;

// const next_screen_btn = document.getElementById("next");
// if (!next_screen_btn || !(next_screen_btn instanceof HTMLButtonElement)) throw new Error();


/** @type Procedure */
let proc;
ac_form.addEventListener("submit", (event) => {
  event.preventDefault();
  handleAddAcBtnClick(show_contract_dialog, ac_form);
});

first_screen.addEventListener("submit", event => {
  event.preventDefault();
  handleNextScreenBtnClick(first_screen, second_screen, prev_screen_btn, add_contract_btn);
});
second_screen.addEventListener("submit", (event) => {
  event.preventDefault();
  handleAddContractBtnClick(second_screen, contract_dialog);
});

init().then(() => {
  const kind_demande = [ProcedureKind.Demandes];
  const demande_info = [
    new ContractInfo(3500000, 10000000, [ContractType.Fournitures], [Mode.DEPX]),
    new ContractInfo(3500000, 15000000, [ContractType.Travaux], [Mode.DECT]),
  ];
  const kind_allege = [ProcedureKind.Alleges];
  const allege_info = [
    new ContractInfo(3500000, 14000000, [ContractType.Services, ContractType.Prestations], [Mode.PRAL]),
    new ContractInfo(10000000, 16000000, [ContractType.Fournitures], [Mode.PRAL]),
    new ContractInfo(15000000, 35000000, [ContractType.Travaux], [Mode.PRAL]),
  ];
  const kind_gse = [ProcedureKind.Generales, ProcedureKind.Specifiques, ProcedureKind.Exceptionnel];
  const gse_mode = [Mode.AOON, Mode.AORN, Mode.AOOI, Mode.AORI, Mode.AOPQ, Mode.AODE, Mode.GRGR];
  const gse_info = [
    new ContractInfo(14000000, Number.MAX_VALUE, [ContractType.Services, ContractType.Prestations], gse_mode),
    new ContractInfo(16000000, Number.MAX_VALUE, [ContractType.Fournitures], gse_mode),
    new ContractInfo(35000000, Number.MAX_VALUE, [ContractType.Travaux], gse_mode),
  ];
  const level1_demande = new Procedure(kind_demande, demande_info, false, 2);
  const level1_allege = new Procedure(kind_allege, allege_info, false, 2);
  const level1_gse = new Procedure(kind_gse, gse_info, true, 3);
  const l1_arr = Array.of(level1_demande, level1_allege, level1_gse);

  const l2_kind = [ProcedureKind.Demandes];
  const l2_info = [
    new ContractInfo(3500000, 10000000, [ContractType.Fournitures], [Mode.DEPX]),
    new ContractInfo(3500000, 15000000, [ContractType.Travaux], [Mode.DECT])
  ];
  const level2 = new Procedure(l2_kind, l2_info, false, 2);
  const l2_arr = Array.of(level2);

  const l3_kind = [ProcedureKind.Demandes];
  const l3_info = [
    new ContractInfo(3500000, 10000000, [ContractType.Fournitures], [Mode.DEPX]),
    new ContractInfo(3500000, 15000000, [ContractType.Travaux], [Mode.DECT])
  ];
  const level3 = new Procedure(l3_kind, l3_info, false, 2);
  const l3_arr = Array.of(level3);

  const l4_kind = [ProcedureKind.Demandes];
  const l4_info = [
    new ContractInfo(3500000, 10000000, [ContractType.Fournitures], [Mode.DEPX])
  ];
  const level4 = new Procedure(l4_kind, l4_info, false, 2);
  const l4_arr = Array.of(level4);

  mp = new Seuil(l1_arr, l2_arr, l3_arr, l4_arr);

  show_contract_dialog.addEventListener("click", () => contract_dialog.showModal());
  show_contract_dialog.blur();

  prev_screen_btn.addEventListener("click", (event) => {
    event.preventDefault();

    first_screen.hidden = false;
    second_screen.hidden = true;

    prev_screen_btn.disabled = true;
    add_contract_btn.disabled = true;
  });

});

/**
 * @param {HTMLFormElement} first_screen
 * @param {HTMLFormElement} second_screen
 * @param {HTMLButtonElement} prev_screen_btn
 * @param {HTMLButtonElement} add_contract_btn
 * @returns void
 */
function handleNextScreenBtnClick(first_screen, second_screen, prev_screen_btn, add_contract_btn) {

  const contract_type = document.getElementById("contract_type");
  if (!contract_type || !(contract_type instanceof HTMLSelectElement)) throw new Error();

  const amount = document.getElementById("amount");
  if (!amount || !(amount instanceof HTMLInputElement)) throw new Error();
  const val = Number.parseInt(amount.value);
  if (Number.isNaN(val)) throw new Error();

  let p = mp.find_procedure(ac, val, contract_type.selectedIndex);
  if (p === undefined) {
    alert("Contract informations is not valid");
    return;
  }
  proc = p;

  first_screen.hidden = true;
  second_screen.hidden = false;

  set_second_screen_state();

  prev_screen_btn.disabled = false;
  add_contract_btn.disabled = false;
}

function set_second_screen_state() {
  const launch_time = document.getElementById("contract_launch");
  if (!launch_time || !(launch_time instanceof HTMLSelectElement)) throw new Error();
  const sign_time = document.getElementById("contract_sign");
  if (!sign_time || !(sign_time instanceof HTMLSelectElement)) throw new Error();
  const control = document.getElementById("contract_control");
  if (!control || !(control instanceof HTMLInputElement)) throw new Error();

  launch_time.addEventListener("change", () => {
    sign_time.innerHTML = "";
    const values = Object.keys(Month).slice(launch_time.selectedIndex, launch_time.selectedIndex + proc.launch_sign_time_diff());
    values.forEach(value => {
      const opt = document.createElement("option");
      opt.value = value,
        opt.textContent = Month[value];
      sign_time.appendChild(opt);
    });
  });

  control.value = proc.control() ? "OUI" : "NON";

  launch_time.dispatchEvent(new Event("change"));
}

/**
 * @param {HTMLButtonElement} show_contract_dialog
 * @param {HTMLFormElement} ac_form
 */
function handleAddAcBtnClick(show_contract_dialog, ac_form) {
  const name = ac_form.querySelector(".name");
  if (!name || !(name instanceof HTMLInputElement)) throw new Error();
  const sigle = ac_form.querySelector(".sigle");
  if (!sigle || !(sigle instanceof HTMLInputElement)) throw new Error();
  const state = ac_form.querySelector(".identity");
  if (!state || !(state instanceof HTMLSelectElement)) throw new Error();
  let identity = Identity.State;
  switch (state.selectedIndex) {
    case 0: identity = Identity.State;
      break;
    case 1: identity = Identity.Dept;
      break;
    case 2: identity = Identity.Arron;
      break;
    case 3: identity = Identity.Ohter;
      break;
    default: throw new Error();
  }

  ac = new AC(name.value, sigle.value, identity);
  console.log(ac.render());
  // ac_form.reset()
  ac_form.hidden = true;
  // add_ac_banner(name.value, sigle.value, identity);
  show_contract_dialog.hidden = false;
}

//TODO: Add a banner showing the current AC
/**
 * @param {String} name 
 * @param {String} sigle 
 * @param {Identity} identity 
 */
function add_ac_banner(name, sigle, identity) {
  const template = document.getElementById("ac_banner");
  if (!template || !(template instanceof HTMLTemplateElement)) throw new Error();
  const node = template.content.cloneNode(true);
  if (!node || !(node instanceof DocumentFragment)) throw new Error();

  const nameElt = node.querySelector(".name");
  if (!nameElt || !(nameElt instanceof HTMLParagraphElement)) throw new Error();
  const sigleElt = node.querySelector(".sigle");
  if (!sigleElt || !(sigleElt instanceof HTMLParagraphElement)) throw new Error();
  const identityElt = node.querySelector(".identity");
  if (!identityElt || !(identityElt instanceof HTMLParagraphElement)) throw new Error();

  nameElt.textContent = name;
  sigleElt.textContent = sigle;
  identityElt.textContent = identity.toString();
}

/**
 * @param {HTMLFormElement} second_screen
 * @param {HTMLDialogElement} contract_dialog
 */
function handleAddContractBtnClick(second_screen, contract_dialog) {
  const description = document.getElementById("description");
  if (!description || !(description instanceof HTMLInputElement)) throw new Error();

  const amount = document.getElementById("amount");
  if (!amount || !(amount instanceof HTMLInputElement)) throw new Error();
  const val = Number.parseInt(amount.value);
  if (Number.isNaN(val)) throw new Error();

  const money_provider = document.getElementById("money_provider");
  if (!money_provider || !(money_provider instanceof HTMLSelectElement)) throw new Error();

  const contract_type = document.getElementById("contract_type");
  if (!contract_type || !(contract_type instanceof HTMLSelectElement)) throw new Error();

  const localization = document.getElementById("contract_localization");
  if (!localization || !(localization instanceof HTMLInputElement)) throw new Error();

  const delay = document.getElementById("contract_delay");
  if (!delay || !(delay instanceof HTMLInputElement)) throw new Error();
  const delay2 = Number.parseInt(delay.value);
  if (Number.isNaN(delay2)) throw new Error();

  const control = document.getElementById("contract_control");
  if (!control || !(control instanceof HTMLInputElement)) throw new Error();

  const launch_time = document.getElementById("contract_launch");
  if (!launch_time || !(launch_time instanceof HTMLSelectElement)) throw new Error();

  const sign_time = document.getElementById("contract_sign");
  if (!sign_time || !(sign_time instanceof HTMLSelectElement)) throw new Error();

  const contract = new Contract(description.value, val, money_provider.selectedIndex, launch_time.selectedIndex, sign_time.selectedIndex, proc.control(), delay2, localization.value);

  if (!ac.add_contract(mp, contract, contract_type.selectedIndex)) {
    alert("Could not add contract");
    console.log(contract.render());
    return;
  }
  // refresh_dom_contracts(ac.contracts())
  ac.contracts().forEach(c => console.log(c.render()));
  contract_dialog.close();
}

//TODO: find a suitable layout to show contracts
/** 
 * @param {Contract[]} contracts 
 */
function refresh_dom_contracts(contracts) {
  const contractsElt = document.getElementById("contracts");
  if (!contractsElt) throw new Error();

  contractsElt.innerHTML = "";
  for (let i = 0; i < contracts.length; i++) {
    const contract = contracts[i];

    const template = document.getElementById("contract_template");
    if (!template || !(template instanceof HTMLTemplateElement)) throw new Error();

    const node = template.content.cloneNode(true);
    if (!node || !(node instanceof DocumentFragment)) throw new Error();

    const noElt = node.querySelector(".contract_no .let");
    if (!noElt || !(noElt instanceof HTMLParagraphElement)) throw new Error();

    const descriptionElt = node.querySelector(".contract_description .let");
    if (!descriptionElt || !(descriptionElt instanceof HTMLParagraphElement)) throw new Error();

    const amountElt = node.querySelector(".contract_amount .let");
    if (!amountElt || !(amountElt instanceof HTMLParagraphElement)) throw new Error();

    const typeElt = node.querySelector(".contract_type .let");
    if (!typeElt || !(typeElt instanceof HTMLParagraphElement)) throw new Error();

    const providerElt = node.querySelector(".contract_provider .let");
    if (!providerElt || !(providerElt instanceof HTMLParagraphElement)) throw new Error();

    const modeElt = node.querySelector(".contract_mode .let");
    if (!modeElt || !(modeElt instanceof HTMLParagraphElement)) throw new Error();

    const launchElt = node.querySelector(".contract_launch .let");
    if (!launchElt || !(launchElt instanceof HTMLParagraphElement)) throw new Error();

    const signElt = node.querySelector(".contract_sign .let");
    if (!signElt || !(signElt instanceof HTMLParagraphElement)) throw new Error();

    const controlElt = node.querySelector(".contract_control .let");
    if (!controlElt || !(controlElt instanceof HTMLParagraphElement)) throw new Error();

    const localizationElt = node.querySelector(".contract_localization .let");
    if (!localizationElt || !(localizationElt instanceof HTMLParagraphElement)) throw new Error();

    const delayElt = node.querySelector(".contract_delay .let");
    if (!delayElt || !(delayElt instanceof HTMLParagraphElement)) throw new Error();

    noElt.textContent = contract.no();
    descriptionElt.textContent = contract.description();
    providerElt.textContent = MoneyProvider[contract.provider()];
    amountElt.textContent = fmt.format(contract.amount());

    const contract_type = contract.cinfo().ctype();
    typeElt.textContent = contract_type.map(ct => ContractType[ct]).join(",");

    const contract_mode = contract.cinfo().mode();
    modeElt.textContent = contract_mode.map(c => Mode[c]).join(",");

    launchElt.textContent = contract.launch();
    signElt.textContent = contract.sign();
    controlElt.textContent = contract.procedure().control() ? "OUI" : "NON";
    localizationElt.textContent = contract.localization();
    delayElt.textContent = contract.delay().toString();

    contractsElt.appendChild(node);
  }
  console.log(contracts.length);
}
/**
 * @param {HTMLInputElement} input
 */
function setupValidation(input) {
  innerSetup(input);
  input.addEventListener("input", () => {
    innerSetup(input);
  });

  /**
   * @param {HTMLInputElement} input
   */
  function innerSetup(input) {
    if (input.validity.valueMissing) {
      input.setCustomValidity(`Vous devez remplir ce champ`);
    } else if (input.validity.badInput) {
      //NOTE: This only works because I only have input of type text and number
      input.setCustomValidity("Vous devez entrer un nombre");
    } else if (input.validity.rangeUnderflow) {
      input.setCustomValidity(`Vous devez entrer un nombre superieur ou egale a ${fmt.format(Number.parseInt(input.min))}`);
    } else if (input.validity.rangeOverflow) {
      input.setCustomValidity(`Vous devez entrer un nombre inferieur ou egale a ${input.max}`);
    }
    else {
      input.setCustomValidity("");
    }
  }
}

