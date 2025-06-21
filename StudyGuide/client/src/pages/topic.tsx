import { useParams } from "wouter";
import { ChevronRight, Lightbulb, Calculator } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuizCard } from "@/components/quiz-card";
import { MolecularViewer } from "@/components/molecular-viewer";
import { topicQuizQuestions } from "@/lib/topic-quiz-data";
import { topics } from "@/lib/topics";
import type { Topic } from "@shared/schema";

// Define local Quiz interface for topic quizzes
interface LocalQuiz {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  questions: any[];
}

// Topic-specific formula data
const topicFormulas: Record<string, any[]> = {
  "stoichiometric-relationships": [
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
      name: "Percent Yield",
      formula: "% yield = (actual/theoretical) × 100",
      description: "Efficiency of a chemical reaction",
    },
    {
      name: "Dilution",
      formula: "C₁V₁ = C₂V₂",
      description: "For diluting concentrated solutions",
    },
    {
      name: "Ideal Gas",
      formula: "PV = nRT",
      description:
        "P = pressure, V = volume, n = moles, R = gas constant, T = temperature",
    },
    {
      name: "Gas Density",
      formula: "d = PM/RT",
      description: "Density of gases under different conditions",
    },
  ],
  "atomic-structure": [],
  periodicity: [
    {
      name: "Ionization Energy",
      formula: "M(g) → M⁺(g) + e⁻",
      description: "Energy required to remove an electron",
    },
    {
      name: "Electron Affinity",
      formula: "X(g) + e⁻ → X⁻(g)",
      description: "Energy change when electron is added",
    },
  ],
  "chemical-bonding": [
    {
      name: "Bond Energy",
      formula: "ΔH = Σ bonds broken - Σ bonds formed",
      description: "Energy change in bond formation/breaking",
    },
  ],
  "energetics-thermochemistry": [
    {
      name: "Enthalpy Change",
      formula: "ΔH = ΣΔHf(products) - ΣΔHf(reactants)",
      description: "Hess's Law calculation",
    },
    {
      name: "Specific Heat",
      formula: "q = mcΔT",
      description:
        "q = heat, m = mass, c = specific heat, ΔT = temperature change",
    },
    {
      name: "Calorimetry",
      formula: "qsystem + qsurroundings = 0",
      description: "Conservation of energy in calorimeter",
    },
    {
      name: "Bond Enthalpy",
      formula: "ΔH = Σ(bonds broken) - Σ(bonds formed)",
      description: "Using average bond energies",
    },
    {
      name: "Entropy Change",
      formula: "ΔS = ΣS(products) - ΣS(reactants)",
      description: "Standard entropy calculation",
    },
    {
      name: "Gibbs Free Energy",
      formula: "ΔG = ΔH - TΔS",
      description: "Spontaneity criterion",
    },
  ],
  "chemical-kinetics": [
    {
      name: "Rate Equation",
      formula: "Rate = k[A]ᵐ[B]ⁿ",
      description: "Rate law for reaction aA + bB → products",
    },
    {
      name: "Arrhenius Equation",
      formula: "k = Ae^(-Ea/RT)",
      description: "Temperature dependence of rate constant",
    },
    {
      name: "Half-life (1st order)",
      formula: "t₁/₂ = ln(2)/k",
      description: "Time for half of reactant to be consumed",
    },
    {
      name: "Integrated Rate Law",
      formula: "ln[A] = ln[A₀] - kt",
      description: "First-order concentration vs time",
    },
    {
      name: "Collision Theory",
      formula: "k = Ae^(-Ea/RT)",
      description: "Rate constant from molecular collisions",
    },
    {
      name: "Activation Energy",
      formula: "ln(k₂/k₁) = (Ea/R)(1/T₁ - 1/T₂)",
      description: "From rate constants at different temperatures",
    },
  ],
  equilibrium: [
    {
      name: "Equilibrium Constant",
      formula: "Kc = [C]ᶜ[D]ᵈ/[A]ᵃ[B]ᵇ",
      description: "For reaction aA + bB ⇌ cC + dD. Kc > 1 favors products",
    },
    {
      name: "Solubility Product",
      formula: "Ksp = [A⁺]ᵃ[B⁻]ᵇ",
      description:
        "For sparingly soluble compounds AₐBᵦ(s) ⇌ aA⁺(aq) + bB⁻(aq)",
    },
    {
      name: "Reaction Quotient",
      formula: "Q = [C]ᶜ[D]ᵈ/[A]ᵃ[B]ᵇ",
      description: "Same form as Kc but at any point, not just equilibrium",
    },
    {
      name: "Pressure Equilibrium Constant",
      formula: "Kp = (Pc)ᶜ(Pd)ᵈ/(Pa)ᵃ(Pb)ᵇ",
      description: "For gaseous reactions using partial pressures",
    },
    {
      name: "Van't Hoff Equation",
      formula: "ln(K₂/K₁) = (ΔH°/R)(1/T₁ - 1/T₂)",
      description: "Temperature dependence of equilibrium constant",
    },
    {
      name: "Common Ion Effect",
      formula: "Ksp = [A⁺][B⁻] = s(s + x)",
      description: "s = solubility, x = common ion concentration",
    },
  ],
};

export default function TopicPage() {
  const { slug } = useParams();

  // Find topic from static data instead of API call
  const topic = topics.find((t) => t.slug === slug);

  // Create topic-specific quiz
  const getTopicQuiz = (): LocalQuiz | null => {
    if (!slug) return null;

    const topicQuestions = topicQuizQuestions[slug];
    if (!topicQuestions) return null;

    return {
      id: slug,
      title: `${topic?.title || "Topic"} Quiz`,
      difficulty: "medium",
      questions: topicQuestions,
    };
  };

  const topicQuiz = getTopicQuiz();

  if (!topic) {
    return (
      <Card className="text-center p-8">
        <CardContent>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Topic Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The requested topic could not be found.
          </p>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Topic Header */}
      <div>
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <Link href="/">
            <a className="hover:text-ib-primary">Home</a>
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-ib-neutral-700">Topic {topic.order}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-ib-neutral-700">{topic.title}</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ib-neutral-800 mb-2">
              {topic.title}
            </h1>
            <p className="text-gray-600">
              Master the fundamental concepts of {topic.title.toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Key Concepts */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-ib-primary rounded-lg flex items-center justify-center mr-3">
                  <Lightbulb className="text-white w-5 h-5" />
                </div>
                <CardTitle className="text-xl text-ib-neutral-800">
                  Key Concepts
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Complete content for each topic */}
                {topic.slug === "stoichiometric-relationships" && (
                  <div className="space-y-6">
                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        The Mole Concept
                      </h3>
                      <p className="text-gray-600 mb-3">
                        The mole is a fundamental unit in chemistry that
                        represents 6.022 × 10²³ particles (Avogadro's number).
                        It bridges the gap between atomic/molecular scale and
                        macroscopic quantities. One mole of any substance
                        contains the same number of particles as there are atoms
                        in exactly 12g of carbon-12.
                      </p>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm font-mono text-ib-primary">
                          n = m/M
                          <br />
                          <span className="text-xs text-gray-600">
                            where n = number of moles, m = mass (g), M = molar
                            mass (g/mol)
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Empirical vs Molecular Formulas
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Empirical formulas show the simplest whole number ratio
                        of atoms, while molecular formulas show the actual
                        number of atoms in a molecule. The molecular formula is
                        always a whole number multiple of the empirical formula.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm font-semibold text-ib-secondary">
                            Empirical: CH₂O
                          </p>
                          <p className="text-sm font-semibold text-ib-secondary">
                            Molecular: C₆H₁₂O₆
                          </p>
                          <p className="text-xs text-gray-600">Glucose</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm font-semibold text-ib-secondary">
                            Empirical: CH₂
                          </p>
                          <p className="text-sm font-semibold text-ib-secondary">
                            Molecular: C₂H₄
                          </p>
                          <p className="text-xs text-gray-600">Ethene</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Percentage Composition
                      </h3>
                      <p className="text-gray-600 mb-3">
                        The percentage by mass of each element in a compound.
                        Essential for determining empirical formulas from
                        experimental data.
                      </p>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm font-mono text-ib-primary">
                          % element = (mass of element / total mass) × 100
                          <br />
                          <span className="text-xs text-gray-600">
                            Used to find empirical formulas from mass
                            composition data
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Solution Concentration
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Concentration expresses the amount of solute dissolved
                        in a given amount of solution. Molarity is the most
                        common unit in chemistry.
                      </p>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm font-mono text-ib-primary">
                          c = n/V
                          <br />
                          <span className="text-xs text-gray-600">
                            where c = concentration (mol/L), n = moles of
                            solute, V = volume of solution (L)
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Gas Laws and Stoichiometry
                      </h3>
                      <p className="text-gray-600 mb-3">
                        At STP (273K, 1 atm), one mole of any gas occupies
                        22.4L. This allows conversion between gas volumes and
                        moles in stoichiometric calculations.
                      </p>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm font-mono text-ib-primary">
                          PV = nRT
                          <br />
                          <span className="text-xs text-gray-600">
                            Ideal gas law connecting pressure, volume, moles,
                            and temperature
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {topic.slug === "atomic-structure" && (
                  <div className="space-y-6">
                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Electron Configuration
                      </h3>
                      <p className="text-gray-600 mb-3">
                        The arrangement of electrons in atomic orbitals follows
                        the Aufbau principle, Hund's rule, and Pauli exclusion
                        principle. Electrons fill orbitals in order of
                        increasing energy.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm font-semibold text-ib-secondary">
                            1s² 2s² 2p⁶ 3s¹
                          </p>
                          <p className="text-xs text-gray-600">Sodium (Na)</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm font-semibold text-ib-secondary">
                            1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p⁶
                          </p>
                          <p className="text-xs text-gray-600">Argon (Ar)</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm font-semibold text-ib-secondary">
                            1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p⁶ 5s² 4d¹⁰ 5p⁶
                          </p>
                          <p className="text-xs text-gray-600">Xenon (Xe)</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm font-semibold text-ib-secondary">
                            1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p⁶ 5s² 4d¹⁰ 5p⁶ 6s²
                            4f¹⁴ 5d¹⁰ 6p⁶
                          </p>
                          <p className="text-xs text-gray-600">Radon (Rn)</p>
                        </div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg mt-3">
                        <p className="text-sm font-medium text-ib-neutral-700 mb-1">
                          Energy Order:
                        </p>
                        <p className="text-sm font-mono text-ib-accent">
                          {
                            "1s < 2s < 2p < 3s < 3p < 4s < 3d < 4p < 5s < 4d < 5p"
                          }
                        </p>
                      </div>
                    </div>

                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Atomic Orbitals
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Regions in space where electrons are most likely to be
                        found. Each orbital can hold a maximum of 2 electrons
                        with opposite spins.
                      </p>
                      <div className="mt-3">
                        <p className="text-sm font-medium text-ib-neutral-700 mb-2">
                          Types:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                            s (spherical, 1 orbital)
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                            p (dumbbell, 3 orbitals)
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                            d (complex, 5 orbitals)
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                            f (very complex, 7 orbitals)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Quantum Numbers
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Four quantum numbers describe each electron in an atom:
                        principal (n), angular momentum (l), magnetic (ml), and
                        spin (ms).
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm font-semibold text-ib-secondary">
                            n = 1,2,3... (energy level)
                          </p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm font-semibold text-ib-secondary">
                            l = 0 to n-1 (subshell)
                          </p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm font-semibold text-ib-secondary">
                            ml = -l to +l (orbital)
                          </p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm font-semibold text-ib-secondary">
                            ms = +½ or -½ (spin)
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Ionization Energy
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Energy required to remove an electron from an atom or
                        ion. First ionization energy is the energy needed to
                        remove the first electron. Increases across periods and
                        decreases down groups.
                      </p>
                    </div>

                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Electron Affinity
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Energy change when an electron is added to a neutral
                        atom to form a negative ion. More negative values
                        indicate greater tendency to gain electrons. Generally
                        becomes more negative across periods.
                      </p>
                    </div>

                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Atomic Radius
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Distance from the nucleus to the outermost electron
                        shell. Decreases across periods due to increasing
                        nuclear charge and increases down groups due to
                        additional electron shells.
                      </p>
                    </div>
                  </div>
                )}

                {topic.slug === "periodicity" && (
                  <div className="space-y-6">
                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Periodic Trends
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Properties of elements change predictably across periods
                        and down groups due to changes in nuclear charge and
                        electron shielding. These trends help predict chemical
                        behavior.
                      </p>
                      <div className="mt-3">
                        <p className="text-sm font-medium text-ib-neutral-700 mb-2">
                          Key Trends:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Atomic radius decreases across period
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Ionization energy increases across period
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Electronegativity increases across period and up
                            groups
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Electron affinity becomes more negative across
                            period
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Group Properties
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Elements in the same group have similar chemical
                        properties due to identical valence electron
                        configurations. This similarity decreases down the group
                        as atomic size increases.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm font-semibold text-ib-secondary">
                            Group 1: All lose 1 electron to form +1 ions
                          </p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm font-semibold text-ib-secondary">
                            Group 17: All gain 1 electron to form -1 ions
                          </p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm font-semibold text-ib-secondary">
                            Group 18: Stable electron configurations
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Isoelectronic Series
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Ions or atoms with the same number of electrons. Size
                        decreases with increasing nuclear charge in an
                        isoelectronic series.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm font-semibold text-ib-secondary">
                            N³⁻ &gt; O²⁻ &gt; F⁻ &gt; Ne &gt; Na⁺ &gt; Mg²⁺ &gt;
                            Al³⁺
                          </p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm font-semibold text-ib-secondary">
                            All have 10 electrons but different nuclear charges
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Periodic Blocks
                      </h3>
                      <p className="text-gray-600 mb-3">
                        The periodic table is divided into s, p, d, and f blocks
                        based on the highest energy subshell being filled.
                      </p>
                      <div className="mt-3">
                        <p className="text-sm font-medium text-ib-neutral-700 mb-2">
                          Blocks:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            s-block: Groups 1-2
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            p-block: Groups 13-18
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            d-block: Transition metals
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            f-block: Lanthanides and actinides
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {topic.slug === "equilibrium" && (
                  <div className="space-y-6">
                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Dynamic Equilibrium
                      </h3>
                      <p className="text-gray-600 mb-3">
                        A state where the forward and reverse reactions occur at
                        equal rates, resulting in no net change in
                        concentrations of reactants and products. The system
                        appears static but is actually dynamic.
                      </p>
                      <div className="mt-3">
                        <p className="text-sm font-medium text-ib-neutral-700 mb-2">
                          Characteristics:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Forward and reverse rates are equal
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Concentrations remain constant
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            System is closed
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Can be approached from either direction
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Equilibrium Constant (Kc)
                      </h3>
                      <p className="text-gray-600 mb-3">
                        A numerical value that expresses the ratio of product
                        concentrations to reactant concentrations at
                        equilibrium, each raised to their stoichiometric
                        coefficients.
                      </p>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm font-mono text-ib-primary">
                          Kc = [C]ᶜ[D]ᵈ/[A]ᵃ[B]ᵇ
                          <br />
                          <span className="text-xs text-gray-600">
                            For reaction aA + bB ⇌ cC + dD. Kc &gt; 1 favors
                            products, Kc &lt; 1 favors reactants
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Le Chatelier's Principle
                      </h3>
                      <p className="text-gray-600 mb-3">
                        When a system at equilibrium is disturbed, it responds
                        to minimize the effect of the disturbance and restore
                        equilibrium.
                      </p>
                      <div className="mt-3">
                        <p className="text-sm font-medium text-ib-neutral-700 mb-2">
                          Factors:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Concentration changes
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Pressure changes (gases)
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Temperature changes
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Catalyst addition (no effect on equilibrium)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Effect of Temperature
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Temperature changes affect equilibrium by changing the
                        value of K. Exothermic reactions favor reactants at
                        higher temperatures, endothermic reactions favor
                        products.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm font-semibold text-ib-secondary">
                            N₂ + 3H₂ ⇌ 2NH₃ (exothermic): K decreases with
                            temperature
                          </p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm font-semibold text-ib-secondary">
                            N₂O₄ ⇌ 2NO₂ (endothermic): K increases with
                            temperature
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Effect of Pressure
                      </h3>
                      <p className="text-gray-600 mb-3">
                        For gaseous reactions, pressure changes affect
                        equilibrium by changing the volume. The system shifts to
                        reduce the number of gas molecules when pressure
                        increases.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm font-semibold text-ib-secondary">
                            N₂ + 3H₂ ⇌ 2NH₃: 4 mol → 2 mol, shifts right with
                            pressure increase
                          </p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm font-semibold text-ib-secondary">
                            N₂O₄ ⇌ 2NO₂: 1 mol → 2 mol, shifts left with
                            pressure increase
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Solubility Product (Ksp)
                      </h3>
                      <p className="text-gray-600 mb-3">
                        The equilibrium constant for the dissolution of
                        sparingly soluble ionic compounds in water.
                      </p>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm font-mono text-ib-primary">
                          Ksp = [A⁺]ᵃ[B⁻]ᵇ
                          <br />
                          <span className="text-xs text-gray-600">
                            For compound AₐBᵦ(s) ⇌ aA⁺(aq) + bB⁻(aq). Higher Ksp
                            means more soluble
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {topic.slug === "chemical-bonding" && (
                  <div className="space-y-6">
                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Types of Bonding
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Chemical bonds form when atoms share or transfer
                        electrons to achieve stable electron configurations. The
                        type of bonding depends on the electronegativity
                        difference between atoms.
                      </p>
                      <div className="mt-3">
                        <p className="text-sm font-medium text-ib-neutral-700 mb-2">
                          Types:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                            Ionic (metal + non-metal, ΔEN &gt; 1.7)
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                            Covalent (non-metals, ΔEN &lt; 1.7)
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                            Metallic (metal atoms)
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                            Hydrogen bonding (H with N, O, F)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Lewis Structures
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Diagrams showing valence electrons as dots around atoms
                        and shared electron pairs as lines between atoms. Used
                        to predict molecular geometry and bonding.
                      </p>
                      <div className="mt-3">
                        <p className="text-sm font-medium text-ib-neutral-700 mb-2">
                          Rules:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Count total valence electrons
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Place least electronegative atom in center
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Connect atoms with single bonds
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Distribute remaining electrons as lone pairs
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Form multiple bonds if needed
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        VSEPR Theory
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Valence Shell Electron Pair Repulsion theory predicts
                        molecular geometry based on minimizing repulsion between
                        electron pairs around central atom.
                      </p>
                      <div className="mt-3">
                        <p className="text-sm font-medium text-ib-neutral-700 mb-2">
                          Shapes:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            Linear (2 groups)
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            Trigonal planar (3 groups)
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            Tetrahedral (4 groups)
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            Trigonal bipyramidal (5 groups)
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            Octahedral (6 groups)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Molecular Polarity
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Polar molecules have uneven distribution of electron
                        density due to differences in electronegativity and
                        molecular geometry.
                      </p>
                      <div className="mt-3">
                        <p className="text-sm font-medium text-ib-neutral-700 mb-2">
                          Factors:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Bond polarity (electronegativity difference)
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Molecular geometry (symmetry)
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Lone pairs on central atom
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Intermolecular Forces
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Forces between molecules that determine physical
                        properties like boiling point, melting point, and
                        solubility.
                      </p>
                      <div className="mt-3">
                        <p className="text-sm font-medium text-ib-neutral-700 mb-2">
                          Types:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                            London dispersion (weakest, all molecules)
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                            Dipole-dipole (polar molecules)
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                            Hydrogen bonding (strongest, H with N/O/F)
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                            Dipole-induced dipole (polar molecules with
                            non-polar molecules)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Bond Properties
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Bond strength and length are related to the types of
                        atoms involved and the bond order.
                      </p>
                      <div className="mt-3">
                        <p className="text-sm font-medium text-ib-neutral-700 mb-2">
                          Concepts:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Bond length decreases with higher bond order
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Bond strength increases with higher bond order
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Triple bonds are shorter and stronger than double
                            bonds
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Single bonds are longest and weakest
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {topic.slug === "energetics-thermochemistry" && (
                  <div className="space-y-6">
                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Enthalpy Changes
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Energy absorbed or released during chemical reactions at
                        constant pressure. Exothermic reactions release heat (ΔH
                        &lt; 0) while endothermic reactions absorb heat (ΔH &gt;
                        0).
                      </p>
                      <div className="mt-3">
                        <p className="text-sm font-medium text-ib-neutral-700 mb-2">
                          Types:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            ΔHf° (standard formation)
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            ΔHc° (standard combustion)
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            ΔHfus (fusion)
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            ΔHvap (vaporization)
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            ΔHsub (sublimation)
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Bond enthalpies
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Hess's Law
                      </h3>
                      <p className="text-gray-600 mb-3">
                        The total enthalpy change is independent of the route
                        taken, only dependent on initial and final states. This
                        allows calculation of unknown enthalpy changes.
                      </p>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm font-mono text-ib-primary">
                          ΔH = ΣΔHf°(products) - ΣΔHf°(reactants)
                          <br />
                          <span className="text-xs text-gray-600">
                            Can also use bond enthalpies: ΔH = Σ(bonds broken) -
                            Σ(bonds formed)
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Calorimetry
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Experimental technique to measure heat changes in
                        chemical reactions using the relationship q = mcΔT.
                      </p>
                      <div className="mt-3">
                        <p className="text-sm font-medium text-ib-neutral-700 mb-2">
                          Types:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Simple calorimetry (coffee cup)
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Bomb calorimetry (constant volume)
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Specific heat capacity measurements
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Born-Haber Cycle
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Application of Hess's Law to calculate lattice energies
                        of ionic compounds using various enthalpy changes.
                      </p>
                      <div className="mt-3">
                        <p className="text-sm font-medium text-ib-neutral-700 mb-2">
                          Steps:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Sublimation of metal
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Ionization of metal
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Dissociation of non-metal
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Electron affinity
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Lattice energy
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Entropy and Gibbs Free Energy
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Entropy measures disorder in a system. Gibbs free energy
                        determines reaction spontaneity.
                      </p>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm font-mono text-ib-primary">
                          ΔS = ΣS°(products) - ΣS°(reactants)
                          <br />
                          ΔG = ΔH - TΔS
                          <br />
                          ΔG &lt; 0 for spontaneous reactions
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {topic.slug === "chemical-kinetics" && (
                  <div className="space-y-6">
                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Rate of Reaction
                      </h3>
                      <p className="text-gray-600 mb-3">
                        How fast reactants are consumed or products are formed,
                        measured as change in concentration per unit time.
                      </p>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm font-mono text-ib-primary">
                          Rate = Δ[concentration]/Δtime
                          <br />
                          <span className="text-xs text-gray-600">
                            Can be measured by following concentration of
                            reactants (decreasing) or products (increasing)
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Collision Theory
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Reactions occur when particles collide with sufficient
                        energy (activation energy) and correct orientation. Only
                        a fraction of collisions lead to reaction.
                      </p>
                      <div className="mt-3">
                        <p className="text-sm font-medium text-ib-neutral-700 mb-2">
                          Factors:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Temperature (increases kinetic energy)
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Concentration (more particles)
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Surface area (more collision sites)
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Catalysts (lower activation energy)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Rate Laws and Order
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Mathematical relationship between reaction rate and
                        concentration of reactants. Rate = k[A]^m[B]^n where m,n
                        are orders.
                      </p>
                      <div className="mt-3">
                        <p className="text-sm font-medium text-ib-neutral-700 mb-2">
                          Concepts:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Zero order: rate independent of concentration
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            First order: rate ∝ [A]
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Second order: rate ∝ [A]²
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Overall order = sum of individual orders
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Activation Energy
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Minimum energy required for a reaction to occur.
                        Catalysts lower activation energy by providing
                        alternative reaction pathways.
                      </p>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm font-mono text-ib-primary">
                          k = Ae^(-Ea/RT)
                          <br />
                          <span className="text-xs text-gray-600">
                            Arrhenius equation relates rate constant to
                            temperature and activation energy. Higher activation
                            energy means slower reaction rate. Catalysts work by
                            lowering the activation energy barrier.
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Reaction Mechanisms
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Step-by-step sequence of elementary reactions that lead
                        to overall reaction. Rate is determined by slowest step
                        (rate-determining step).
                      </p>
                      <div className="mt-3">
                        <p className="text-sm font-medium text-ib-neutral-700 mb-2">
                          Concepts:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Elementary reactions
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Intermediates
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Rate-determining step
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            Pre-equilibrium approximation
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quiz Section */}
          {topicQuiz && (
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-ib-neutral-800">
                  Test Your Knowledge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <QuizCard quiz={topicQuiz} />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Formula Sheet */}
          {slug && topicFormulas[slug] && topicFormulas[slug].length > 0 && (
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-ib-secondary rounded-lg flex items-center justify-center mr-3">
                    <Calculator className="text-white w-5 h-5" />
                  </div>
                  <CardTitle className="text-lg text-ib-neutral-800">
                    Key Formulas
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topicFormulas[slug].map((formula: any, index: number) => (
                    <div
                      key={index}
                      className="border-l-4 border-ib-secondary pl-4"
                    >
                      <h4 className="font-semibold text-ib-neutral-800 text-sm">
                        {formula.name}
                      </h4>
                      <p className="text-sm font-mono text-ib-secondary mb-1">
                        {formula.formula}
                      </p>
                      <p className="text-xs text-gray-600">
                        {formula.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Molecular Viewer Placeholder */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-ib-neutral-800">
                Interactive Models
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MolecularViewer />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
