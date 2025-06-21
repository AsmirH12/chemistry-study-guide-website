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
                {/* Static content for each topic */}
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
                        macroscopic quantities.
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
                        principle.
                      </p>
                      <div className="bg-orange-50 p-4 rounded-lg">
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
                  </div>
                )}

                {/* Add more static content for other topics as needed */}
                {topic.slug !== "stoichiometric-relationships" &&
                  topic.slug !== "atomic-structure" && (
                    <div className="border-l-4 border-ib-primary pl-4">
                      <h3 className="font-semibold text-ib-neutral-800 mb-2">
                        Coming Soon
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Detailed content for {topic.title} will be available
                        soon.
                      </p>
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
