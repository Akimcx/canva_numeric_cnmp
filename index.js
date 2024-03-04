import init, { Contract, ContractInfo, ContractType, Mode, Procedure, ProcedureKind, Seuil } from "./cdc/pkg/cdc.js";
import { Month } from "./cdc/pkg/cdc.js";
import { MoneyProvider } from "./cdc/pkg/cdc.js";
import { Identity } from "./cdc/pkg/cdc.js";
import { AC } from "./cdc/pkg/cdc.js";

//TODO: clean up this mess
/** @type Seuil */
let mp = undefined
/** @type AC */
let ac = undefined
/** @type HTMLButtonElement */
const show_contract_dialog = document.getElementById("show_contract_dialog")
/** @type HTMLDialogElement */
const contract_dialog = document.getElementById("contract_dialog")
/** @type HTMLButtonElement */
const add_contract_btn = document.getElementById("add_contract")
show_contract_dialog.hidden = true
/** @type HTMLFormElement */
const first_screen = document.getElementById("screen1");
/** @type HTMLFormElement */
const second_screen = document.getElementById("screen2");
/** @type HTMLButtonElement */
const prev_screen_btn = document.getElementById("prev");
prev_screen_btn.setAttribute("disabled", true);
/** @type HTMLButtonElement */
const next_screen_btn = document.getElementById("next");
const fmt = Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "HTG"
})

/** @type Procedure */
let proc = undefined

init().then(() => {
    const kind_demande = [ProcedureKind.Demandes]
    const demande_info = [
        new ContractInfo(3500000, 10000000, [ContractType.Fournitures], [Mode.DEPX]),
        new ContractInfo(3500000, 15000000, [ContractType.Travaux], [Mode.DECT]),
    ]
    const kind_allege = [ProcedureKind.Alleges]
    const allege_info = [
        new ContractInfo(3500000, 14000000, [ContractType.Services, ContractType.Prestations], [Mode.PRAL]),
        new ContractInfo(10000000, 16000000, [ContractType.Fournitures], [Mode.PRAL]),
        new ContractInfo(15000000, 35000000, [ContractType.Travaux], [Mode.PRAL]),
    ]
    const kind_gse = [ProcedureKind.Generales, ProcedureKind.Specifiques, ProcedureKind.Exceptionnel]
    const gse_mode = [Mode.AOON, Mode.AORN, Mode.AOOI, Mode.AORI, Mode.AOPQ, Mode.AODE, Mode.GRGR]
    const gse_info = [
        new ContractInfo(14000000, Number.MAX_VALUE, [ContractType.Services, ContractType.Prestations], gse_mode),
        new ContractInfo(16000000, Number.MAX_VALUE, [ContractType.Fournitures], gse_mode),
        new ContractInfo(35000000, Number.MAX_VALUE, [ContractType.Travaux], gse_mode),
    ]
    const level1_demande = new Procedure(kind_demande, demande_info, false, 2)
    const level1_allege = new Procedure(kind_allege, allege_info, false, 2)
    const level1_gse = new Procedure(kind_gse, gse_info, true, 3)
    const l1_arr = Array.of(level1_demande, level1_allege, level1_gse)

    const l2_kind = [ProcedureKind.Demandes]
    const l2_info = [
        new ContractInfo(3500000, 10000000, [ContractType.Fournitures], [Mode.DEPX]),
        new ContractInfo(3500000, 15000000, [ContractType.Travaux], [Mode.DECT])
    ]
    const level2 = new Procedure(l2_kind, l2_info, false, 2)
    const l2_arr = Array.of(level2)

    const l3_kind = [ProcedureKind.Demandes]
    const l3_info = [
        new ContractInfo(3500000, 10000000, [ContractType.Fournitures], [Mode.DEPX]),
        new ContractInfo(3500000, 15000000, [ContractType.Travaux], [Mode.DECT])
    ]
    const level3 = new Procedure(l3_kind, l3_info, false, 2)
    const l3_arr = Array.of(level3)

    const l4_kind = [ProcedureKind.Demandes]
    const l4_info = [
        new ContractInfo(3500000, 10000000, [ContractType.Fournitures], [Mode.DEPX])
    ]
    const level4 = new Procedure(l4_kind, l4_info, false, 2)
    const l4_arr = Array.of(level4)

    mp = new Seuil(l1_arr, l2_arr, l3_arr, l4_arr)

    const addAcBtn = document.getElementById("addAcBtn")
    addAcBtn.addEventListener("click", handleAddAcBtnClick)

    /** @type HTMLButtonElement */
    show_contract_dialog.addEventListener("click", () => contract_dialog.showModal())
    show_contract_dialog.blur()

    add_contract_btn.addEventListener("click", handleAddContractBtnClick)
    next_screen_btn.addEventListener("click", handleNextScreenBtnClick)
    prev_screen_btn.addEventListener("click", handlePrevScreenBtnClick)

    add_contract_btn.hidden = true
})

/**
 * @param {MouseEvent} event
 */
function handlePrevScreenBtnClick(event) {
    event.preventDefault()

    first_screen.hidden = false
    second_screen.hidden = true

    next_screen_btn.removeAttribute("disabled")
    prev_screen_btn.setAttribute("disabled", true)
    add_contract_btn.setAttribute("hidden", true)
}

/**
 * @param {MouseEvent} event
 */
function handleNextScreenBtnClick(event) {
    event.preventDefault()

    if (!first_screen.checkValidity()) {
        console.error("Form isn't valid")
        return
    }

    /** @type HTMLSelectElement */
    const contract_type = contract_dialog.querySelector("select#contract_type")

    proc = mp.find_procedure(ac, amount.value, contract_type.selectedIndex);
    if (proc === undefined) {
        alert("Contract informations is not valid")
        return
    }

    first_screen.hidden = true
    second_screen.hidden = false

    set_second_screen_state()

    next_screen_btn.setAttribute("disabled", true)
    prev_screen_btn.removeAttribute("disabled")
    add_contract_btn.removeAttribute("hidden")
}

function set_second_screen_state() {
    /** @type HTMLSelectElement */
    const launch_time = document.getElementById("contract_launch")
    /** @type HTMLSelectElement */
    const sign_time = document.getElementById("contract_sign")
    /** @type HTMLInputElement */
    const control = document.getElementById("contract_control")

    launch_time.addEventListener("change", () => {
        sign_time.innerHTML = ""
        const values = Object.keys(Month).slice(launch_time.selectedIndex, launch_time.selectedIndex + proc.launch_sign_time_diff())
        values.forEach(value => {
            const opt = document.createElement("option")
            opt.value = value,
                opt.textContent = Month[value]
            sign_time.appendChild(opt)
        })
    })

    control.value = proc.control ? "OUI" : "NON"

    launch_time.dispatchEvent(new Event("change"))
}

/**
 * @param {MouseEvent} event
 */
function handleAddAcBtnClick(event) {
    event.preventDefault()

    /** @type {HTMLFormElement} */
    const ac_form = document.getElementById("ac_form")

    /** @type {HTMLInputElement} */
    const name = document.getElementById("name")
    /** @type {HTMLInputElement} */
    const sigle = document.getElementById("sigle")

    /** @type {HTMLOptionElement} */
    const identity = document.getElementById("identity")[0]

    if (!ac_form.checkValidity()) {
        alert("Tout les champs doivent etre remplis")
        return
    }

    ac = new AC(name.value, sigle.value, identity.value)
    console.log(ac.render())
    // ac_form.reset()
    ac_form.hidden = true
    add_ac_banner(name, sigle, identity)
    show_contract_dialog.hidden = false
}

//TODO: Add a banner showing the current AC
/**
 * @param {String} name 
 * @param {String} sigle 
 * @param {Identity} identity 
 */
function add_ac_banner(name, sigle, identity) {
    return
    /** @type HTMLTemplateElement **/
    const template = document.getElementById("ac_banner")
    /** @type Node **/
    const node = template.content.cloneNode(true)

    /** @type HTMLParagraphElement **/
    const nameElt = node.querySelector(".name")
    /** @type HTMLParagraphElement **/
    const sigleElt = node.querySelector(".sigle")
    /** @type HTMLParagraphElement **/
    const identityElt = node.querySelector(".identity")

    nameElt.textContent = name,
        sigleElt.textContent = sigle,
        identityElt.textContent = identity
}

/**
 * @param {MouseEvent} event
 */
function handleAddContractBtnClick(event) {
    event.preventDefault()

    if (!second_screen.checkValidity()) {
        console.error("Form isn't valid")
    }

    /** @type HTMLInputElement */
    const description = document.getElementById("description")
    /** @type HTMLInputElement */
    const amount = document.getElementById("amount")
    /** @type HTMLSelectElement */
    const money_provider = document.getElementById("money_provider")
    /** @type HTMLSelectElement */
    const contract_type = document.getElementById("contract_type")

    /** @type HTMLInputElement */
    const localization = document.getElementById("contract_localization")
    /** @type HTMLInputElement */
    const delay = document.getElementById("contract_delay")
    /** @type HTMLInputElement */
    const control = document.getElementById("contract_control")
    /** @type HTMLSelectElement */
    const launch_time = document.getElementById("contract_launch")
    /** @type HTMLSelectElement */
    const sign_time = document.getElementById("contract_sign")

    const contract = new Contract(description.value, amount.value, money_provider.selectedIndex, launch_time.selectedIndex, sign_time.selectedIndex, control.value, delay.value, localization.value)

    if (!ac.add_contract(mp, contract, contract_type.selectedIndex)) {
        alert("Could not add contract")
        console.log(contract.render())
        return
    }
    // refresh_dom_contracts(ac.contracts())
    ac.contracts().forEach(c => console.log(c.render()))
    contract_dialog.close()
}

//TODO: find a suitable layout to show contracts
/** 
 * @param {Contract[]} contracts 
 */
function refresh_dom_contracts(contracts) {
    const contractsElt = document.getElementById("contracts")
    contractsElt.innerHTML = ""
    for (let i = 0; i < contracts.length; i++) {
        const contract = contracts[i]

        /** @type HTMLTemplateElement **/
        const template = document.getElementById("contract_template")
        /** @type Node **/
        const node = template.content.cloneNode(true)

        /** @type HTMLParagraphElement **/
        const noElt = node.querySelector(".contract_no .let")
        /** @type HTMLParagraphElement **/
        const descriptionElt = node.querySelector(".contract_description .let")
        /** @type HTMLParagraphElement **/
        const amountElt = node.querySelector(".contract_amount .let")
        /** @type HTMLParagraphElement **/
        const typeElt = node.querySelector(".contract_type .let")
        /** @type HTMLParagraphElement **/
        const providerElt = node.querySelector(".contract_provider .let")
        /** @type HTMLParagraphElement **/
        const modeElt = node.querySelector(".contract_mode .let")
        /** @type HTMLParagraphElement **/
        const launchElt = node.querySelector(".contract_launch .let")
        /** @type HTMLParagraphElement **/
        const signElt = node.querySelector(".contract_sign .let")
        /** @type HTMLParagraphElement **/
        const controlElt = node.querySelector(".contract_control .let")
        /** @type HTMLParagraphElement **/
        const localizationElt = node.querySelector(".contract_localization .let")
        /** @type HTMLParagraphElement **/
        const delayElt = node.querySelector(".contract_delay .let")

        noElt.textContent = contract.no()
        descriptionElt.textContent = contract.description()
        providerElt.textContent = MoneyProvider[contract.provider()]
        amountElt.textContent = fmt.format(contract.amount())

        const contract_type = contract.cinfo().ctype();
        typeElt.textContent = ContractType[contract_type] //ContractType[contract.cinfo()]

        const contract_mode = contract.cinfo().mode();
        console.log(contract_mode)
        if (Array.isArray(contract_mode)) {
            modeElt.textContent = contract_mode.map(c => Mode[c]).join(",")
        } else {
            modeElt.textContent = Mode[contract_mode]
        }

        launchElt.textContent = contract.launch()
        signElt.textContent = contract.sign()
        controlElt.textContent = contract.control() ? "OUI" : "NON"
        localizationElt.textContent = contract.localization(),
            delayElt.textContent = contract.delay()

        contractsElt.appendChild(node)
    }
    console.log(contracts.length)
}
