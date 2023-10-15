const nature = Object.freeze({
  Services: "S",
  Fournitures: "F",
  Travaux: "T",
  Prestations: "P",
});

/**
 * @typedef {Object} MarcheInfo
 * @property {number} min
 * @property {number?} max
 * @property {string|string[]} procurement
 * @property {nature} nature
 */

/**
 * @typedef {Object} Procedure
 * @property {string} name
 * @property {MarcheInfo[]} marchesInfo
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
 */

/** @type {Seuil} */
const seuil = {
  level1: [
    {
      name: "Procedures de Demandes",
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
      marchesInfo: [
        {
          min: 14,
          procurement: "aoon|aooi",
          nature: nature.Prestations,
        },
        {
          min: 16,
          procurement: "aoon|aooi",
          nature: nature.Fournitures,
        },
        {
          min: 35,
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
    /** @type {Marche} */
    this.marche = new Object();
    this.count = 1;
  }

  addMarche(obj, src, nat, price) {
    this.marche.no = this.count++;
    this.marche.obj = obj;
    this.marche.price = price;
    this.marche.src = src;
    this.setNature(nat);

    this.setProcedure(this.level, this.marche.nat, this.marche.price);
    console.log(this.marche);
  }

  /**
   * @param {string} nat
   */
  setNature(nat) {
    switch (nat) {
      case "F":
        this.marche.nat = nature.Fournitures;
        break;
      case "P":
        this.marche.nat = nature.Prestations;
        break;
      case "T":
        this.marche.nat = nature.Travaux;
        break;
      case "S":
        this.marche.nat = nature.Services;
        break;
      default:
        break;
    }
  }

  /**
   * @param {string} level
   * @param {nature} nat
   * @param {number} amount
   */
  setProcedure(level, nat, amount) {
    console.log();
  }
}
