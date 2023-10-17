const nature = Object.freeze({
  Services: "S",
  Fournitures: "F",
  Travaux: "T",
  Prestations: "P",
});

/**
 * @typedef {Object} MarcheInfo
 * @property {number} min
 * @property {number} max
 * @property {string|string[]} procurement
 * @property {nature} nature
 */

/**
 * @typedef {Object} Procedure
 * @property {string} name
 * @property {MarcheInfo[]} marchesInfo
 * @property {boolean} control
 * @property {number} launch_sign_time_diff
 */

/**
 * @typedef {Object} Seuil
 * @property {Procedure[]} level1
 * @property {Procedure[]} level2
 * @property {Procedure[]} level3
 * @property {Procedure[]} level4
 */

/**
 * @typedef {Object} Marche
 * @property {number} no
 * @property {number} price
 * @property {string} obj
 * @property {string} src
 * @property {nature} nat
 * @property {Procedure} procedure
 */

/** @type {Seuil} */
const seuil = {
  level1: [
    {
      name: "Procedures de Demandes",
      control: false,
      launch_sign_time_diff: 2,
      marchesInfo: [
        {
          min: 3.5,
          max: 10,
          procurement: "demande prix",
          nature: nature.Fournitures,
        },
        {
          min: 3.5,
          max: 15,
          procurement: "demande cotations",
          nature: nature.Travaux,
        },
      ],
    },
    {
      name: "Procedures de allegees",
      control: false,
      launch_sign_time_diff: 2,
      marchesInfo: [
        {
          min: 3.5,
          max: 14,
          procurement: "pral",
          nature: nature.Prestations,
        },
        {
          min: 10,
          max: 16,
          procurement: "pral",
          nature: nature.Fournitures,
        },
        {
          min: 15,
          max: 35,
          procurement: "pral",
          nature: nature.Travaux,
        },
      ],
    },
    {
      name: "Procedures de generales",
      control: true,
      launch_sign_time_diff: 3,
      marchesInfo: [
        {
          min: 14,
          max: Infinity,
          procurement: "aoon|aooi",
          nature: nature.Prestations,
        },
        {
          min: 16,
          max: Infinity,
          procurement: "aoon|aooi",
          nature: nature.Fournitures,
        },
        {
          min: 35,
          max: Infinity,
          procurement: "aoon|aooi",
          nature: nature.Travaux,
        },
      ],
    },
  ],
  level2: {},
  level3: {},
  level4: {},
};

export default class PAPMP {
  constructor(institution, sigle, level) {
    this.institution = institution;
    this.sigle = sigle;
    this.level = level;
    /** @type {Marche[]} */
    this.marches = [];
    this.count = 1;
    /** @type {string[]} */
    this.months = [
      'Octobre',
      'Novembre',
      'Décembre',
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre'
    ];
  }

  addMarche(obj, src, nat, price) {
    /** @type {Marche} */
    const marche = new Object();
    marche.no = this.count++;
    marche.obj = obj;
    marche.price = price;
    marche.src = src;
    marche.nat = this.getNature(nat);
    marche.procedure = this.getProcedure(this.level, marche.nat, marche.price);
    this.marches.push(marche);
  }

  /**
   * @param {string} nat
   */
  getNature(nat) {
    switch (nat) {
      case "F":
        return nature.Fournitures;
      case "P":
        return nature.Prestations;
      case "T":
        return nature.Travaux;
      case "S":
        return nature.Services;
      default:
        break;
    }
  }

  /**
   * @param {string} level
   * @param {nature} nat
   * @param {number} amount
   */
  getProcedure(level, nat, amount) {
    let res;
    /** @type {Procedure[]} */
    const procedures = seuil[level];
    procedures.forEach((procedure) => {
      const marchesInfo = procedure.marchesInfo;
      const marcheInfo = marchesInfo.filter(
        (marcheInfo) =>
          amount >= marcheInfo.min &&
          amount < marcheInfo.max &&
          marcheInfo.nature === nat
      );

      if (marcheInfo.length === 1) {
        res = Object.assign({}, procedure);
        res.marchesInfo = res.marchesInfo.filter((r) => r === marcheInfo[0]);
        return;
      }
    });
    if (res) return res;
  }
}
