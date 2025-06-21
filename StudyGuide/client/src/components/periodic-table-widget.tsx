import { useState } from "react";
import { Table, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { elementsData } from "@/lib/chemistry-data";
import { cn } from "@/lib/utils";

// Complete periodic table data for all 118 elements
const completeElementsData = [
  {
    atomicNumber: 1,
    symbol: "H",
    name: "Hydrogen",
    atomicMass: 1.008,
    category: "nonmetal",
  },
  {
    atomicNumber: 2,
    symbol: "He",
    name: "Helium",
    atomicMass: 4.003,
    category: "noble-gas",
  },
  {
    atomicNumber: 3,
    symbol: "Li",
    name: "Lithium",
    atomicMass: 6.941,
    category: "alkali-metal",
  },
  {
    atomicNumber: 4,
    symbol: "Be",
    name: "Beryllium",
    atomicMass: 9.012,
    category: "alkaline-earth-metal",
  },
  {
    atomicNumber: 5,
    symbol: "B",
    name: "Boron",
    atomicMass: 10.811,
    category: "metalloid",
  },
  {
    atomicNumber: 6,
    symbol: "C",
    name: "Carbon",
    atomicMass: 12.011,
    category: "nonmetal",
  },
  {
    atomicNumber: 7,
    symbol: "N",
    name: "Nitrogen",
    atomicMass: 14.007,
    category: "nonmetal",
  },
  {
    atomicNumber: 8,
    symbol: "O",
    name: "Oxygen",
    atomicMass: 15.999,
    category: "nonmetal",
  },
  {
    atomicNumber: 9,
    symbol: "F",
    name: "Fluorine",
    atomicMass: 18.998,
    category: "halogen",
  },
  {
    atomicNumber: 10,
    symbol: "Ne",
    name: "Neon",
    atomicMass: 20.18,
    category: "noble-gas",
  },
  {
    atomicNumber: 11,
    symbol: "Na",
    name: "Sodium",
    atomicMass: 22.99,
    category: "alkali-metal",
  },
  {
    atomicNumber: 12,
    symbol: "Mg",
    name: "Magnesium",
    atomicMass: 24.305,
    category: "alkaline-earth-metal",
  },
  {
    atomicNumber: 13,
    symbol: "Al",
    name: "Aluminum",
    atomicMass: 26.982,
    category: "post-transition-metal",
  },
  {
    atomicNumber: 14,
    symbol: "Si",
    name: "Silicon",
    atomicMass: 28.086,
    category: "metalloid",
  },
  {
    atomicNumber: 15,
    symbol: "P",
    name: "Phosphorus",
    atomicMass: 30.974,
    category: "nonmetal",
  },
  {
    atomicNumber: 16,
    symbol: "S",
    name: "Sulfur",
    atomicMass: 32.065,
    category: "nonmetal",
  },
  {
    atomicNumber: 17,
    symbol: "Cl",
    name: "Chlorine",
    atomicMass: 35.453,
    category: "halogen",
  },
  {
    atomicNumber: 18,
    symbol: "Ar",
    name: "Argon",
    atomicMass: 39.948,
    category: "noble-gas",
  },
  {
    atomicNumber: 19,
    symbol: "K",
    name: "Potassium",
    atomicMass: 39.098,
    category: "alkali-metal",
  },
  {
    atomicNumber: 20,
    symbol: "Ca",
    name: "Calcium",
    atomicMass: 40.078,
    category: "alkaline-earth-metal",
  },
  {
    atomicNumber: 21,
    symbol: "Sc",
    name: "Scandium",
    atomicMass: 44.956,
    category: "transition-metal",
  },
  {
    atomicNumber: 22,
    symbol: "Ti",
    name: "Titanium",
    atomicMass: 47.867,
    category: "transition-metal",
  },
  {
    atomicNumber: 23,
    symbol: "V",
    name: "Vanadium",
    atomicMass: 50.942,
    category: "transition-metal",
  },
  {
    atomicNumber: 24,
    symbol: "Cr",
    name: "Chromium",
    atomicMass: 51.996,
    category: "transition-metal",
  },
  {
    atomicNumber: 25,
    symbol: "Mn",
    name: "Manganese",
    atomicMass: 54.938,
    category: "transition-metal",
  },
  {
    atomicNumber: 26,
    symbol: "Fe",
    name: "Iron",
    atomicMass: 55.845,
    category: "transition-metal",
  },
  {
    atomicNumber: 27,
    symbol: "Co",
    name: "Cobalt",
    atomicMass: 58.933,
    category: "transition-metal",
  },
  {
    atomicNumber: 28,
    symbol: "Ni",
    name: "Nickel",
    atomicMass: 58.693,
    category: "transition-metal",
  },
  {
    atomicNumber: 29,
    symbol: "Cu",
    name: "Copper",
    atomicMass: 63.546,
    category: "transition-metal",
  },
  {
    atomicNumber: 30,
    symbol: "Zn",
    name: "Zinc",
    atomicMass: 65.38,
    category: "transition-metal",
  },
  {
    atomicNumber: 31,
    symbol: "Ga",
    name: "Gallium",
    atomicMass: 69.723,
    category: "post-transition-metal",
  },
  {
    atomicNumber: 32,
    symbol: "Ge",
    name: "Germanium",
    atomicMass: 72.64,
    category: "metalloid",
  },
  {
    atomicNumber: 33,
    symbol: "As",
    name: "Arsenic",
    atomicMass: 74.922,
    category: "metalloid",
  },
  {
    atomicNumber: 34,
    symbol: "Se",
    name: "Selenium",
    atomicMass: 78.96,
    category: "nonmetal",
  },
  {
    atomicNumber: 35,
    symbol: "Br",
    name: "Bromine",
    atomicMass: 79.904,
    category: "halogen",
  },
  {
    atomicNumber: 36,
    symbol: "Kr",
    name: "Krypton",
    atomicMass: 83.798,
    category: "noble-gas",
  },
  {
    atomicNumber: 37,
    symbol: "Rb",
    name: "Rubidium",
    atomicMass: 85.468,
    category: "alkali-metal",
  },
  {
    atomicNumber: 38,
    symbol: "Sr",
    name: "Strontium",
    atomicMass: 87.62,
    category: "alkaline-earth-metal",
  },
  {
    atomicNumber: 39,
    symbol: "Y",
    name: "Yttrium",
    atomicMass: 88.906,
    category: "transition-metal",
  },
  {
    atomicNumber: 40,
    symbol: "Zr",
    name: "Zirconium",
    atomicMass: 91.224,
    category: "transition-metal",
  },
  {
    atomicNumber: 41,
    symbol: "Nb",
    name: "Niobium",
    atomicMass: 92.906,
    category: "transition-metal",
  },
  {
    atomicNumber: 42,
    symbol: "Mo",
    name: "Molybdenum",
    atomicMass: 95.96,
    category: "transition-metal",
  },
  {
    atomicNumber: 43,
    symbol: "Tc",
    name: "Technetium",
    atomicMass: 98.0,
    category: "transition-metal",
  },
  {
    atomicNumber: 44,
    symbol: "Ru",
    name: "Ruthenium",
    atomicMass: 101.07,
    category: "transition-metal",
  },
  {
    atomicNumber: 45,
    symbol: "Rh",
    name: "Rhodium",
    atomicMass: 102.906,
    category: "transition-metal",
  },
  {
    atomicNumber: 46,
    symbol: "Pd",
    name: "Palladium",
    atomicMass: 106.42,
    category: "transition-metal",
  },
  {
    atomicNumber: 47,
    symbol: "Ag",
    name: "Silver",
    atomicMass: 107.868,
    category: "transition-metal",
  },
  {
    atomicNumber: 48,
    symbol: "Cd",
    name: "Cadmium",
    atomicMass: 112.411,
    category: "transition-metal",
  },
  {
    atomicNumber: 49,
    symbol: "In",
    name: "Indium",
    atomicMass: 114.818,
    category: "post-transition-metal",
  },
  {
    atomicNumber: 50,
    symbol: "Sn",
    name: "Tin",
    atomicMass: 118.71,
    category: "post-transition-metal",
  },
  {
    atomicNumber: 51,
    symbol: "Sb",
    name: "Antimony",
    atomicMass: 121.76,
    category: "metalloid",
  },
  {
    atomicNumber: 52,
    symbol: "Te",
    name: "Tellurium",
    atomicMass: 127.6,
    category: "metalloid",
  },
  {
    atomicNumber: 53,
    symbol: "I",
    name: "Iodine",
    atomicMass: 126.904,
    category: "halogen",
  },
  {
    atomicNumber: 54,
    symbol: "Xe",
    name: "Xenon",
    atomicMass: 131.293,
    category: "noble-gas",
  },
  {
    atomicNumber: 55,
    symbol: "Cs",
    name: "Cesium",
    atomicMass: 132.905,
    category: "alkali-metal",
  },
  {
    atomicNumber: 56,
    symbol: "Ba",
    name: "Barium",
    atomicMass: 137.327,
    category: "alkaline-earth-metal",
  },
  {
    atomicNumber: 57,
    symbol: "La",
    name: "Lanthanum",
    atomicMass: 138.905,
    category: "lanthanide",
  },
  {
    atomicNumber: 58,
    symbol: "Ce",
    name: "Cerium",
    atomicMass: 140.116,
    category: "lanthanide",
  },
  {
    atomicNumber: 59,
    symbol: "Pr",
    name: "Praseodymium",
    atomicMass: 140.908,
    category: "lanthanide",
  },
  {
    atomicNumber: 60,
    symbol: "Nd",
    name: "Neodymium",
    atomicMass: 144.242,
    category: "lanthanide",
  },
  {
    atomicNumber: 61,
    symbol: "Pm",
    name: "Promethium",
    atomicMass: 145.0,
    category: "lanthanide",
  },
  {
    atomicNumber: 62,
    symbol: "Sm",
    name: "Samarium",
    atomicMass: 150.36,
    category: "lanthanide",
  },
  {
    atomicNumber: 63,
    symbol: "Eu",
    name: "Europium",
    atomicMass: 151.964,
    category: "lanthanide",
  },
  {
    atomicNumber: 64,
    symbol: "Gd",
    name: "Gadolinium",
    atomicMass: 157.25,
    category: "lanthanide",
  },
  {
    atomicNumber: 65,
    symbol: "Tb",
    name: "Terbium",
    atomicMass: 158.925,
    category: "lanthanide",
  },
  {
    atomicNumber: 66,
    symbol: "Dy",
    name: "Dysprosium",
    atomicMass: 162.5,
    category: "lanthanide",
  },
  {
    atomicNumber: 67,
    symbol: "Ho",
    name: "Holmium",
    atomicMass: 164.93,
    category: "lanthanide",
  },
  {
    atomicNumber: 68,
    symbol: "Er",
    name: "Erbium",
    atomicMass: 167.259,
    category: "lanthanide",
  },
  {
    atomicNumber: 69,
    symbol: "Tm",
    name: "Thulium",
    atomicMass: 168.934,
    category: "lanthanide",
  },
  {
    atomicNumber: 70,
    symbol: "Yb",
    name: "Ytterbium",
    atomicMass: 173.054,
    category: "lanthanide",
  },
  {
    atomicNumber: 71,
    symbol: "Lu",
    name: "Lutetium",
    atomicMass: 174.967,
    category: "lanthanide",
  },
  {
    atomicNumber: 72,
    symbol: "Hf",
    name: "Hafnium",
    atomicMass: 178.49,
    category: "transition-metal",
  },
  {
    atomicNumber: 73,
    symbol: "Ta",
    name: "Tantalum",
    atomicMass: 180.948,
    category: "transition-metal",
  },
  {
    atomicNumber: 74,
    symbol: "W",
    name: "Tungsten",
    atomicMass: 183.84,
    category: "transition-metal",
  },
  {
    atomicNumber: 75,
    symbol: "Re",
    name: "Rhenium",
    atomicMass: 186.207,
    category: "transition-metal",
  },
  {
    atomicNumber: 76,
    symbol: "Os",
    name: "Osmium",
    atomicMass: 190.23,
    category: "transition-metal",
  },
  {
    atomicNumber: 77,
    symbol: "Ir",
    name: "Iridium",
    atomicMass: 192.217,
    category: "transition-metal",
  },
  {
    atomicNumber: 78,
    symbol: "Pt",
    name: "Platinum",
    atomicMass: 195.084,
    category: "transition-metal",
  },
  {
    atomicNumber: 79,
    symbol: "Au",
    name: "Gold",
    atomicMass: 196.967,
    category: "transition-metal",
  },
  {
    atomicNumber: 80,
    symbol: "Hg",
    name: "Mercury",
    atomicMass: 200.59,
    category: "transition-metal",
  },
  {
    atomicNumber: 81,
    symbol: "Tl",
    name: "Thallium",
    atomicMass: 204.383,
    category: "post-transition-metal",
  },
  {
    atomicNumber: 82,
    symbol: "Pb",
    name: "Lead",
    atomicMass: 207.2,
    category: "post-transition-metal",
  },
  {
    atomicNumber: 83,
    symbol: "Bi",
    name: "Bismuth",
    atomicMass: 208.98,
    category: "post-transition-metal",
  },
  {
    atomicNumber: 84,
    symbol: "Po",
    name: "Polonium",
    atomicMass: 209.0,
    category: "post-transition-metal",
  },
  {
    atomicNumber: 85,
    symbol: "At",
    name: "Astatine",
    atomicMass: 210.0,
    category: "halogen",
  },
  {
    atomicNumber: 86,
    symbol: "Rn",
    name: "Radon",
    atomicMass: 222.0,
    category: "noble-gas",
  },
  {
    atomicNumber: 87,
    symbol: "Fr",
    name: "Francium",
    atomicMass: 223.0,
    category: "alkali-metal",
  },
  {
    atomicNumber: 88,
    symbol: "Ra",
    name: "Radium",
    atomicMass: 226.0,
    category: "alkaline-earth-metal",
  },
  {
    atomicNumber: 89,
    symbol: "Ac",
    name: "Actinium",
    atomicMass: 227.0,
    category: "actinide",
  },
  {
    atomicNumber: 90,
    symbol: "Th",
    name: "Thorium",
    atomicMass: 232.038,
    category: "actinide",
  },
  {
    atomicNumber: 91,
    symbol: "Pa",
    name: "Protactinium",
    atomicMass: 231.036,
    category: "actinide",
  },
  {
    atomicNumber: 92,
    symbol: "U",
    name: "Uranium",
    atomicMass: 238.029,
    category: "actinide",
  },
  {
    atomicNumber: 93,
    symbol: "Np",
    name: "Neptunium",
    atomicMass: 237.0,
    category: "actinide",
  },
  {
    atomicNumber: 94,
    symbol: "Pu",
    name: "Plutonium",
    atomicMass: 244.0,
    category: "actinide",
  },
  {
    atomicNumber: 95,
    symbol: "Am",
    name: "Americium",
    atomicMass: 243.0,
    category: "actinide",
  },
  {
    atomicNumber: 96,
    symbol: "Cm",
    name: "Curium",
    atomicMass: 247.0,
    category: "actinide",
  },
  {
    atomicNumber: 97,
    symbol: "Bk",
    name: "Berkelium",
    atomicMass: 247.0,
    category: "actinide",
  },
  {
    atomicNumber: 98,
    symbol: "Cf",
    name: "Californium",
    atomicMass: 251.0,
    category: "actinide",
  },
  {
    atomicNumber: 99,
    symbol: "Es",
    name: "Einsteinium",
    atomicMass: 252.0,
    category: "actinide",
  },
  {
    atomicNumber: 100,
    symbol: "Fm",
    name: "Fermium",
    atomicMass: 257.0,
    category: "actinide",
  },
  {
    atomicNumber: 101,
    symbol: "Md",
    name: "Mendelevium",
    atomicMass: 258.0,
    category: "actinide",
  },
  {
    atomicNumber: 102,
    symbol: "No",
    name: "Nobelium",
    atomicMass: 259.0,
    category: "actinide",
  },
  {
    atomicNumber: 103,
    symbol: "Lr",
    name: "Lawrencium",
    atomicMass: 262.0,
    category: "actinide",
  },
  {
    atomicNumber: 104,
    symbol: "Rf",
    name: "Rutherfordium",
    atomicMass: 261.0,
    category: "transition-metal",
  },
  {
    atomicNumber: 105,
    symbol: "Db",
    name: "Dubnium",
    atomicMass: 262.0,
    category: "transition-metal",
  },
  {
    atomicNumber: 106,
    symbol: "Sg",
    name: "Seaborgium",
    atomicMass: 266.0,
    category: "transition-metal",
  },
  {
    atomicNumber: 107,
    symbol: "Bh",
    name: "Bohrium",
    atomicMass: 264.0,
    category: "transition-metal",
  },
  {
    atomicNumber: 108,
    symbol: "Hs",
    name: "Hassium",
    atomicMass: 277.0,
    category: "transition-metal",
  },
  {
    atomicNumber: 109,
    symbol: "Mt",
    name: "Meitnerium",
    atomicMass: 268.0,
    category: "transition-metal",
  },
  {
    atomicNumber: 110,
    symbol: "Ds",
    name: "Darmstadtium",
    atomicMass: 281.0,
    category: "transition-metal",
  },
  {
    atomicNumber: 111,
    symbol: "Rg",
    name: "Roentgenium",
    atomicMass: 272.0,
    category: "transition-metal",
  },
  {
    atomicNumber: 112,
    symbol: "Cn",
    name: "Copernicium",
    atomicMass: 285.0,
    category: "transition-metal",
  },
  {
    atomicNumber: 113,
    symbol: "Nh",
    name: "Nihonium",
    atomicMass: 286.0,
    category: "post-transition-metal",
  },
  {
    atomicNumber: 114,
    symbol: "Fl",
    name: "Flerovium",
    atomicMass: 289.0,
    category: "post-transition-metal",
  },
  {
    atomicNumber: 115,
    symbol: "Mc",
    name: "Moscovium",
    atomicMass: 290.0,
    category: "post-transition-metal",
  },
  {
    atomicNumber: 116,
    symbol: "Lv",
    name: "Livermorium",
    atomicMass: 293.0,
    category: "post-transition-metal",
  },
  {
    atomicNumber: 117,
    symbol: "Ts",
    name: "Tennessine",
    atomicMass: 294.0,
    category: "halogen",
  },
  {
    atomicNumber: 118,
    symbol: "Og",
    name: "Oganesson",
    atomicMass: 294.0,
    category: "noble-gas",
  },
];

export function PeriodicTableWidget() {
  const [selectedElement, setSelectedElement] = useState<
    (typeof completeElementsData)[0] | null
  >(null);
  const [showFullTable, setShowFullTable] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<
    (typeof completeElementsData)[0] | null
  >(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const getCategoryColor = (category: string) => {
    const colors = {
      nonmetal: "bg-red-100 text-red-800 hover:bg-red-200",
      "noble-gas": "bg-blue-100 text-blue-800 hover:bg-blue-200",
      "alkali-metal": "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      "alkaline-earth-metal": "bg-green-100 text-green-800 hover:bg-green-200",
      metalloid: "bg-purple-100 text-purple-800 hover:bg-purple-200",
      halogen: "bg-pink-100 text-pink-800 hover:bg-pink-200",
      "transition-metal": "bg-orange-100 text-orange-800 hover:bg-orange-200",
      "post-transition-metal": "bg-gray-100 text-gray-800 hover:bg-gray-200",
      lanthanide: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
      actinide: "bg-teal-100 text-teal-800 hover:bg-teal-200",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 hover:bg-gray-200"
    );
  };

  const handleElementClick = (element: (typeof completeElementsData)[0]) => {
    setSelectedElement(element);
  };

  const handleElementHover = (
    element: (typeof completeElementsData)[0],
    event: React.MouseEvent
  ) => {
    setHoveredElement(element);
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleElementLeave = () => {
    setHoveredElement(null);
  };

  // Periodic table layout - each array represents a row
  const periodicTableLayout = [
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2], // Row 1
    [3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 6, 7, 8, 9, 10], // Row 2
    [11, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13, 14, 15, 16, 17, 18], // Row 3
    [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36], // Row 4
    [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54], // Row 5
    [55, 56, 57, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86], // Row 6
    [
      87, 88, 89, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115,
      116, 117, 118,
    ], // Row 7
  ];

  // Lanthanides and Actinides
  const lanthanides = [58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71];
  const actinides = [
    90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103,
  ];

  const getElementByAtomicNumber = (atomicNumber: number) => {
    return completeElementsData.find(
      (element) => element.atomicNumber === atomicNumber
    );
  };

  const renderElement = (atomicNumber: number) => {
    if (atomicNumber === 0) return <div className="w-8 h-8"></div>;

    const element = getElementByAtomicNumber(atomicNumber);
    if (!element) return <div className="w-8 h-8"></div>;

    return (
      <Button
        key={atomicNumber}
        variant="ghost"
        size="sm"
        onClick={() => handleElementClick(element)}
        onMouseEnter={(e) => handleElementHover(element, e)}
        onMouseLeave={handleElementLeave}
        className={cn(
          "w-8 h-8 p-0 text-xs font-medium relative group",
          getCategoryColor(element.category)
        )}
        title={`${element.name} (${element.symbol}) - ${element.atomicNumber}`}
      >
        <div className="text-xs font-bold">{element.symbol}</div>
        <div className="absolute top-0 left-0 text-[6px] opacity-70">
          {element.atomicNumber}
        </div>
      </Button>
    );
  };

  return (
    <>
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-ib-primary rounded-lg flex items-center justify-center mr-2">
                <Table className="text-white w-4 h-4" />
              </div>
              <CardTitle className="text-lg text-ib-neutral-800">
                Periodic Table
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-6 gap-1 mb-4">
            {/* First row */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleElementClick(completeElementsData[0])}
              onMouseEnter={(e) =>
                handleElementHover(completeElementsData[0], e)
              }
              onMouseLeave={handleElementLeave}
              className={cn(
                "p-2 text-xs font-medium",
                getCategoryColor(completeElementsData[0].category)
              )}
            >
              H
            </Button>
            <div className="col-span-4"></div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleElementClick(completeElementsData[1])}
              onMouseEnter={(e) =>
                handleElementHover(completeElementsData[1], e)
              }
              onMouseLeave={handleElementLeave}
              className={cn(
                "p-2 text-xs font-medium",
                getCategoryColor(completeElementsData[1].category)
              )}
            >
              He
            </Button>

            {/* Second row */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleElementClick(completeElementsData[2])}
              onMouseEnter={(e) =>
                handleElementHover(completeElementsData[2], e)
              }
              onMouseLeave={handleElementLeave}
              className={cn(
                "p-2 text-xs font-medium",
                getCategoryColor(completeElementsData[2].category)
              )}
            >
              Li
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleElementClick(completeElementsData[3])}
              onMouseEnter={(e) =>
                handleElementHover(completeElementsData[3], e)
              }
              onMouseLeave={handleElementLeave}
              className={cn(
                "p-2 text-xs font-medium",
                getCategoryColor(completeElementsData[3].category)
              )}
            >
              Be
            </Button>
            <div className="col-span-2"></div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleElementClick(completeElementsData[4])}
              onMouseEnter={(e) =>
                handleElementHover(completeElementsData[4], e)
              }
              onMouseLeave={handleElementLeave}
              className={cn(
                "p-2 text-xs font-medium",
                getCategoryColor(completeElementsData[4].category)
              )}
            >
              B
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleElementClick(completeElementsData[5])}
              onMouseEnter={(e) =>
                handleElementHover(completeElementsData[5], e)
              }
              onMouseLeave={handleElementLeave}
              className={cn(
                "p-2 text-xs font-medium",
                getCategoryColor(completeElementsData[5].category)
              )}
            >
              C
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFullTable(true)}
            className="w-full text-ib-primary border-ib-primary hover:bg-blue-50"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Full Periodic Table
          </Button>
        </CardContent>
      </Card>

      {/* Element Info Dialog */}
      <Dialog
        open={!!selectedElement}
        onOpenChange={() => setSelectedElement(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-ib-primary">
                {selectedElement?.symbol}
              </span>
              <span>{selectedElement?.name}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Atomic Number
                </p>
                <p className="text-lg font-semibold text-ib-neutral-800">
                  {selectedElement?.atomicNumber}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Atomic Mass</p>
                <p className="text-lg font-semibold text-ib-neutral-800">
                  {selectedElement?.atomicMass} u
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Category</p>
              <p className="text-base font-medium text-ib-primary capitalize">
                {selectedElement?.category.replace("-", " ")}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Full Periodic Table Dialog */}
      <Dialog open={showFullTable} onOpenChange={setShowFullTable}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Periodic Table of Elements
            </DialogTitle>
          </DialogHeader>
          <div className="flex gap-8">
            {/* Element Detail Panel - Left Side */}
            <div className="hidden xl:block w-80 flex-shrink-0">
              {hoveredElement ? (
                <div
                  className={cn(
                    "p-6 rounded-lg shadow-lg border-2 min-h-[300px] transition-all duration-200",
                    getCategoryColor(hoveredElement.category).replace(
                      "hover:",
                      ""
                    ),
                    "bg-white"
                  )}
                >
                  <div className="text-center mb-6">
                    <div className="text-6xl font-bold mb-3 text-ib-primary">
                      {hoveredElement.symbol}
                    </div>
                    <div className="text-xl font-semibold mb-2">
                      {hoveredElement.name}
                    </div>
                    <div className="text-lg opacity-70">
                      #{hoveredElement.atomicNumber}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-sm font-medium text-gray-600 mb-1">
                        Atomic Mass
                      </div>
                      <div className="text-lg font-semibold">
                        {hoveredElement.atomicMass} u
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-sm font-medium text-gray-600 mb-1">
                        Category
                      </div>
                      <div className="text-lg font-semibold capitalize text-ib-primary">
                        {hoveredElement.category.replace("-", " ")}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-sm font-medium text-gray-600 mb-1">
                        Element Type
                      </div>
                      <div className="text-lg font-semibold">
                        {hoveredElement.category.includes("metal")
                          ? "Metal"
                          : hoveredElement.category === "metalloid"
                          ? "Metalloid"
                          : "Nonmetal"}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-lg border-2 border-dashed border-gray-300 min-h-[300px] flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-3">🧪</div>
                    <div className="text-lg font-medium">
                      Hover over an element
                    </div>
                    <div className="text-sm">to see detailed information</div>
                  </div>
                </div>
              )}
            </div>

            {/* Periodic Table - Right Side */}
            <div className="flex-1">
              <div className="space-y-6">
                {/* Main Periodic Table */}
                <div className="space-y-1">
                  {periodicTableLayout.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-1 justify-center">
                      {row.map((atomicNumber, colIndex) => (
                        <div key={`${rowIndex}-${colIndex}`}>
                          {renderElement(atomicNumber)}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Lanthanides and Actinides */}
                <div className="flex justify-center">
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {lanthanides.map((atomicNumber) => (
                        <div key={atomicNumber}>
                          {renderElement(atomicNumber)}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-1">
                      {actinides.map((atomicNumber) => (
                        <div key={atomicNumber}>
                          {renderElement(atomicNumber)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Element Categories:
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-100 rounded"></div>
                      <span>Nonmetals</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-100 rounded"></div>
                      <span>Noble Gases</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-100 rounded"></div>
                      <span>Alkali Metals</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-100 rounded"></div>
                      <span>Alkaline Earth Metals</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-100 rounded"></div>
                      <span>Metalloids</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-pink-100 rounded"></div>
                      <span>Halogens</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-100 rounded"></div>
                      <span>Transition Metals</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-100 rounded"></div>
                      <span>Post-Transition Metals</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-indigo-100 rounded"></div>
                      <span>Lanthanides</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-teal-100 rounded"></div>
                      <span>Actinides</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
