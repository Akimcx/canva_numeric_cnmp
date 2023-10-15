class Marche {
  /**
   *
   * @param {String} number
   * @param {String} institution
   */
  constructor(number, institution) {
    this.number = number.toString();
    this.row = document
      .getElementById("template")
      .content.cloneNode(true)
      .querySelector("tr");
    this.codeElt = {
      institution,
      year: this.fiscal(),
      finance: "",
      passation: "",
      nature: "",
      control: "",
    };
  }

  fiscal() {
    const n = new Date();
    const y = n.getFullYear() % 100;
    const m = n.getMonth();
    if (m < 9) {
      return `${y - 1}${y}`;
    }
    return `${y}${y + 1}`;
  }

  setCodeValue() {
    const val = Object.values(this.codeElt).join("-");
    console.log(this.row.querySelector(".code"));
    this.row.querySelector(".code").value = val;
    return val;
  }

  setInstitution(text) {
    this.codeElt.institution = text;
  }

  setListener() {
    Object.keys(this.codeElt).forEach((key) => {
      if (key !== "institution" && key !== "year") {
        this.row.querySelector(`.${key}`).addEventListener("input", (e) => {
          if (e.target.value === "") return;
          this.codeElt[key] = e.target.value;
          this.setCodeValue();
        });
      }
    });
  }

  make() {
    this.row.setAttribute("id", this.number);
    this.setNo(this.number);
    this.setListener();
    this.setCodeValue();
    return this.row;
  }

  /**
   *
   * @param {String} num
   */
  setNo(num) {
    this.row.querySelector(".no").value = num.padStart("2", "0");
  }
}
