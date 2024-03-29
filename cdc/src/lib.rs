use std::fmt;

use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
#[derive(Debug, Deserialize, Serialize, Clone)]
pub enum Month {
    Oct,
    Nov,
    Dec,
    Jan,
    Fev,
    Mar,
    Avr,
    Mai,
    Jui,
    Jul,
    Aout,
    Sept,
}

impl fmt::Display for Month {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Month::Oct => write!(f, "Octobre"),
            Month::Nov => write!(f, "Nov"),
            Month::Dec => write!(f, "Dec"),
            Month::Jan => write!(f, "Jan"),
            Month::Fev => write!(f, "Fev"),
            Month::Mar => write!(f, "Mar"),
            Month::Avr => write!(f, "Avr"),
            Month::Mai => write!(f, "Mai"),
            Month::Jui => write!(f, "Jui"),
            Month::Jul => write!(f, "Jul"),
            Month::Aout => write!(f, "Aout"),
            Month::Sept => write!(f, "Sept"),
        }
    }
}

#[wasm_bindgen]
#[derive(Debug, Clone, Copy, Deserialize, Serialize)]
pub enum Mode {
    DEPX,
    DECT,
    PRAL,
    AOON,
    AORN,
    AOPQ,
    AODE,
    AOOI,
    AORI,
    DAPN,
    ANPQ,
    AIPQ,
    GRGR,
}

impl fmt::Display for Mode {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Mode::DEPX => write!(f, "DEPX"),
            Mode::DECT => write!(f, "DECT"),
            Mode::PRAL => write!(f, "PRAL"),
            Mode::AOON => write!(f, "AOON"),
            Mode::AORN => write!(f, "AORN"),
            Mode::AOOI => write!(f, "AOOI"),
            Mode::AORI => write!(f, "AORI"),
            Mode::GRGR => write!(f, "GRGR"),
            Mode::AOPQ => write!(f, "AOPQ"),
            Mode::AODE => write!(f, "AODE"),
            Mode::DAPN => write!(f, "DAPN"),
            Mode::ANPQ => write!(f, "ANPQ"),
            Mode::AIPQ => write!(f, "AIPQ"),
        }
    }
}

#[derive(Debug, Deserialize, Serialize)]
#[wasm_bindgen]
pub enum Identity {
    State,
    Dept,
    Arron,
    Ohter,
}

#[wasm_bindgen]
#[derive(Debug, Deserialize, Serialize)]
pub struct AC {
    name: String,
    sigle: String,
    identity: Identity,
    papmp: PAPMP,
}

impl fmt::Display for AC {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "{}, sigle {}, identity {:?}",
            self.name, self.sigle, self.identity
        );
        Ok(())
    }
}

impl From<String> for AC {
    fn from(value: String) -> Self {
        let ac: AC = serde_json::from_str(value.as_str()).unwrap();
        ac
    }
}

#[wasm_bindgen]
impl AC {
    #[wasm_bindgen(constructor)]
    pub fn new(name: String, sigle: String, identity: Identity) -> Self {
        Self {
            name,
            sigle,
            identity,
            papmp: PAPMP::new(),
        }
    }

    pub fn f(s: String) -> Self {
        AC::from(s)
    }

    pub fn to_json(&self) -> String {
        serde_json::to_string(self).unwrap()
    }

    pub fn render(&self) -> String {
        self.to_string()
    }

    pub fn contracts(&self) -> Vec<Contract> {
        self.papmp.contracts.clone()
    }

    pub fn add_contract(
        &mut self,
        seuil: &Seuil,
        contract: Contract,
        contract_type: ContractType,
    ) -> bool {
        if let Some(procedure) = seuil.find_procedure(&self, contract.amount, contract_type) {
            let info = procedure.find_info(contract.amount, contract_type);
            self.papmp.add_contract(Contract {
                contract_info: info.clone(),
                procedure,
                ..contract
            });
            return true;
        }
        false
    }
}

#[wasm_bindgen]
#[derive(Debug)]
pub struct Seuil {
    level1: Vec<Procedure>,
    level2: Vec<Procedure>,
    level3: Vec<Procedure>,
    level4: Vec<Procedure>,
}

#[wasm_bindgen]
impl Seuil {
    #[wasm_bindgen(constructor)]
    pub fn new(
        level1: Vec<Procedure>,
        level2: Vec<Procedure>,
        level3: Vec<Procedure>,
        level4: Vec<Procedure>,
    ) -> Self {
        Self {
            level1,
            level2,
            level3,
            level4,
        }
    }

    pub fn find_procedure(
        &self,
        ac: &AC,
        amount: f64,
        contract_type: ContractType,
    ) -> Option<Procedure> {
        let mut proc_iter = match ac.identity {
            Identity::State => self.level1.iter(),
            Identity::Dept => self.level2.iter(),
            Identity::Arron => self.level3.iter(),
            Identity::Ohter => self.level4.iter(),
        };
        let proc =
            proc_iter.find(|&procedure| procedure.has_contract_informations(amount, contract_type));
        proc.cloned()
    }
}

#[wasm_bindgen]
#[derive(Debug, Clone, Default, Deserialize, Serialize)]
pub struct Procedure {
    kind: Vec<ProcedureKind>,
    contract_info: Vec<ContractInfo>,
    control: bool,
    launch_sign_diff: u8,
}

#[wasm_bindgen]
impl Procedure {
    #[wasm_bindgen(constructor)]
    pub fn new(
        kind: Vec<ProcedureKind>, // EnumProcedureKind,
        contract_info: Vec<ContractInfo>,
        control: bool,
        launch_sign_diff: u8,
    ) -> Self {
        Self {
            kind,
            contract_info,
            control,
            launch_sign_diff,
        }
    }

    pub fn launch_sign_time_diff(&self) -> u8 {
        self.launch_sign_diff
    }

    pub fn kind(&self) -> Vec<ProcedureKind> {
        self.kind.clone()
    }

    pub fn has_contract_informations(&self, amount: f64, contract_type: ContractType) -> bool {
        let mut iterator = self.contract_info.iter();
        iterator
            .find(|&c_info| c_info.bound(amount) && c_info.contract_type.contains(&contract_type))
            .is_some()
    }

    pub fn control(&self) -> bool {
        self.control
    }

    pub fn find_info(&self, amount: f64, contract_type: ContractType) -> ContractInfo {
        let predicate = |c_info: &&ContractInfo| {
            c_info.bound(amount) && c_info.contract_type.contains(&contract_type)
        };
        let vec = &self.contract_info;
        match vec.into_iter().find(predicate) {
            Some(contract_info) => contract_info.clone(),
            None => panic!("Cannot get here"),
        }
    }
}

#[wasm_bindgen]
#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct ContractInfo {
    min: f64,
    max: f64,
    contract_type: Vec<ContractType>, // EnumContractType,
    mode: Vec<Mode>,
}

#[wasm_bindgen]
impl ContractInfo {
    #[wasm_bindgen(constructor)]
    pub fn new(min: f64, max: f64, contract_type: Vec<ContractType>, mode: Vec<Mode>) -> Self {
        Self {
            min,
            max,
            contract_type,
            mode,
        }
    }

    pub fn mode(&self) -> Vec<Mode> {
        self.mode.clone()
    }

    pub fn ctype(&self) -> Vec<ContractType> {
        self.contract_type.clone()
    }

    fn default() -> Self {
        Self {
            min: 0.0,
            max: 0.0,
            contract_type: Vec::new(),
            mode: vec![Mode::AOON],
        }
    }

    fn bound(&self, amount: f64) -> bool {
        amount >= self.min && amount < self.max
    }
}

#[wasm_bindgen]
#[derive(Debug, Deserialize, Serialize, PartialEq, Default, Clone, Copy)]
pub enum ContractType {
    #[default]
    Services,
    Fournitures,
    Travaux,
    Prestations,
}

impl fmt::Display for ContractType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            ContractType::Services => write!(f, "S"),
            ContractType::Fournitures => write!(f, "F"),
            ContractType::Travaux => write!(f, "T"),
            ContractType::Prestations => write!(f, "P"),
        }
    }
}

#[wasm_bindgen]
#[derive(Debug, Clone, Deserialize, Serialize)]
pub enum ProcedureKind {
    Demandes,
    Alleges,
    Generales,
    Exceptionnel,
    Specifiques,
}

#[derive(Debug, Deserialize, Serialize)]
struct PAPMP {
    contracts: Vec<Contract>,
}

impl PAPMP {
    fn new() -> Self {
        Self {
            contracts: Vec::new(),
        }
    }

    fn add_contract(&mut self, mut contract: Contract) {
        contract.no = format!("{:02}", self.contracts.len() + 1);
        self.contracts.push(contract);
    }
}

#[wasm_bindgen]
#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Contract {
    no: String,
    description: String,
    amount: f64,
    money_provider: MoneyProvider,
    contract_info: ContractInfo,
    launch: Month,
    sign: Month,
    localization: String,
    delay: u8,
    control: bool,
    procedure: Procedure, //EnumProcedureKind,
}

impl fmt::Display for Contract {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let head = format!("Contract no: {}\n", self.no);
        let obj = format!("  - Objet du projet de marché: {}\n", self.description);
        let src = format!("  - Source de financement: {}\n", self.money_provider);
        let amount = format!("  - Montant des crédits disponibles: {}\n", self.amount);
        let c_type = format!(
            "  - Nature du marché: {:?}\n",
            self.contract_info.contract_type
        );
        let mode = format!("  - Mode de passation: {:?}\n", self.contract_info.mode);
        let launch = format!("  - Période de lancement: {}\n", self.launch);
        let sign = format!(
            "  - Période probale de signature du marché: {}\n",
            self.sign
        );
        let control = format!("  - Controle a priori de la CNMP: {}\n", self.control);
        let localization = format!("  - Localisation: {}\n", self.localization);
        let delay = format!("  - Délai Prévision-nel D'exécution: {}\n", self.delay);
        write!(
            f,
            "{} {} {} {} {} {} {} {} {} {} {} ",
            head, obj, src, amount, c_type, mode, launch, sign, control, localization, delay
        );
        Ok(())
    }
}

#[wasm_bindgen]
impl Contract {
    #[wasm_bindgen(constructor)]
    pub fn new(
        description: String,
        amount: f64,
        money_provider: MoneyProvider,
        launch: Month,
        sign: Month,
        control: bool,
        delay: u8,
        localization: String,
    ) -> Self {
        Self {
            no: String::new(),
            description,
            amount,
            money_provider,
            launch,
            sign,
            control,
            contract_info: ContractInfo::default(),
            procedure: Procedure::default(),
            delay,
            localization,
        }
    }

    pub fn delay(&self) -> u8 {
        self.delay
    }

    pub fn localization(&self) -> String {
        self.localization.clone()
    }

    pub fn sign(&self) -> String {
        self.sign.to_string()
    }

    pub fn launch(&self) -> String {
        self.launch.to_string()
    }

    pub fn no(&self) -> String {
        self.no.clone()
    }

    pub fn procedure(&self) -> Procedure {
        self.procedure.clone()
    }

    pub fn description(&self) -> String {
        self.description.clone()
    }

    pub fn provider(&self) -> MoneyProvider {
        self.money_provider.clone()
    }

    pub fn cinfo(&self) -> ContractInfo {
        self.contract_info.clone()
    }

    pub fn render(&self) -> String {
        self.to_string()
    }

    pub fn amount(&self) -> f64 {
        self.amount
    }
}

#[wasm_bindgen]
#[derive(Debug, Clone, Deserialize, Serialize)]
pub enum MoneyProvider {
    TI,
    TF,
    FP,
    FE,
    FM,
}

impl fmt::Display for MoneyProvider {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            MoneyProvider::TI => write!(f, "TI"),
            MoneyProvider::TF => write!(f, "TF"),
            MoneyProvider::FP => write!(f, "FP"),
            MoneyProvider::FE => write!(f, "FE"),
            MoneyProvider::FM => write!(f, "FM"),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let ac = AC::new("Banque".to_string(), "BRH".to_string(), Identity::State);
        assert_eq!(ac.contracts().len(), 0);
    }
}
