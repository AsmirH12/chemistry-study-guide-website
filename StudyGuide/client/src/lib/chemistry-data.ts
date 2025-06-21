export interface Element {
  symbol: string;
  name: string;
  atomicNumber: number;
  atomicMass: string;
  category:
    | "nonmetal"
    | "noble-gas"
    | "alkali-metal"
    | "alkaline-earth-metal"
    | "metalloid"
    | "halogen"
    | "transition-metal"
    | "post-transition-metal"
    | "lanthanide"
    | "actinide";
}

export const elementsData: Element[] = [
  {
    symbol: "H",
    name: "Hydrogen",
    atomicNumber: 1,
    atomicMass: "1.008",
    category: "nonmetal",
  },
  {
    symbol: "He",
    name: "Helium",
    atomicNumber: 2,
    atomicMass: "4.003",
    category: "noble-gas",
  },
  {
    symbol: "Li",
    name: "Lithium",
    atomicNumber: 3,
    atomicMass: "6.941",
    category: "alkali-metal",
  },
  {
    symbol: "Be",
    name: "Beryllium",
    atomicNumber: 4,
    atomicMass: "9.012",
    category: "alkaline-earth-metal",
  },
  {
    symbol: "B",
    name: "Boron",
    atomicNumber: 5,
    atomicMass: "10.81",
    category: "metalloid",
  },
  {
    symbol: "C",
    name: "Carbon",
    atomicNumber: 6,
    atomicMass: "12.01",
    category: "nonmetal",
  },
  {
    symbol: "N",
    name: "Nitrogen",
    atomicNumber: 7,
    atomicMass: "14.01",
    category: "nonmetal",
  },
  {
    symbol: "O",
    name: "Oxygen",
    atomicNumber: 8,
    atomicMass: "16.00",
    category: "nonmetal",
  },
  {
    symbol: "F",
    name: "Fluorine",
    atomicNumber: 9,
    atomicMass: "19.00",
    category: "halogen",
  },
  {
    symbol: "Ne",
    name: "Neon",
    atomicNumber: 10,
    atomicMass: "20.18",
    category: "noble-gas",
  },
];

export interface Molecule {
  name: string;
  formula: string;
  geometry: string;
  bondAngle?: string;
  description: string;
}

export const moleculesData: Molecule[] = [
  {
    name: "Water",
    formula: "H₂O",
    geometry: "Bent",
    bondAngle: "104.5°",
    description: "A polar molecule with two hydrogen atoms bonded to oxygen",
  },
  {
    name: "Methane",
    formula: "CH₄",
    geometry: "Tetrahedral",
    bondAngle: "109.5°",
    description:
      "A nonpolar molecule with four hydrogen atoms bonded to carbon",
  },
  {
    name: "Ammonia",
    formula: "NH₃",
    geometry: "Trigonal Pyramidal",
    bondAngle: "107°",
    description:
      "A polar molecule with three hydrogen atoms bonded to nitrogen",
  },
  {
    name: "Carbon Dioxide",
    formula: "CO₂",
    geometry: "Linear",
    bondAngle: "180°",
    description: "A nonpolar molecule with two oxygen atoms bonded to carbon",
  },
];

export const formulaSheetData = [
  {
    category: "Basic Formulas",
    formulas: [
      {
        name: "Moles",
        formula: "n = m/M",
        description: "n = moles, m = mass (g), M = molar mass (g/mol)",
      },
      {
        name: "Concentration",
        formula: "c = n/V",
        description: "c = concentration (mol/L), n = moles, V = volume (L)",
      },
      {
        name: "Ideal Gas",
        formula: "PV = nRT",
        description:
          "P = pressure, V = volume, n = moles, R = gas constant, T = temperature",
      },
    ],
  },
  {
    category: "Stoichiometry",
    formulas: [
      {
        name: "Percent Yield",
        formula: "% yield = (actual/theoretical) × 100",
        description: "Efficiency of a chemical reaction",
      },
      {
        name: "Molarity",
        formula: "M = mol solute/L solution",
        description: "Concentration in moles per liter",
      },
    ],
  },
];
