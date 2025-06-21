import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Lightbulb, Calculator } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuizCard } from "@/components/quiz-card";
import { MolecularViewer } from "@/components/molecular-viewer";
import { topicQuizQuestions } from "@/lib/topic-quiz-data";
import type { Topic, Quiz } from "@shared/schema";

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

  const { data: topic, isLoading } = useQuery<Topic>({
    queryKey: [`/api/topics/${slug}`],
    enabled: !!slug,
  });

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin w-8 h-8 border-4 border-ib-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

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
            <p className="text-gray-600">{topic.description}</p>
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
                {topic.content &&
                  typeof topic.content === "object" &&
                  "concepts" in topic.content &&
                  (topic.content.concepts as any[]).map(
                    (concept: any, index: number) => (
                      <div
                        key={index}
                        className="border-l-4 border-ib-primary pl-4"
                      >
                        <h3 className="font-semibold text-ib-neutral-800 mb-2">
                          {concept.title}
                        </h3>
                        <p className="text-gray-600 mb-3">
                          {concept.description}
                        </p>
                        {concept.formula && (
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm font-mono text-ib-primary">
                              {concept.formula}
                              {concept.explanation && (
                                <>
                                  <br />
                                  <span className="text-xs text-gray-600">
                                    {concept.explanation}
                                  </span>
                                </>
                              )}
                            </p>
                          </div>
                        )}
                        {concept.energyOrder && (
                          <div className="bg-orange-50 p-4 rounded-lg">
                            <p className="text-sm font-medium text-ib-neutral-700 mb-1">
                              Energy Order:
                            </p>
                            <p className="text-sm font-mono text-ib-accent">
                              {concept.energyOrder}
                            </p>
                          </div>
                        )}
                        {concept.examples && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                            {concept.examples.map(
                              (example: any, exIndex: number) => (
                                <div
                                  key={exIndex}
                                  className="bg-green-50 p-3 rounded-lg"
                                >
                                  <p className="text-sm font-semibold text-ib-secondary">
                                    {example.empirical
                                      ? `Empirical: ${example.empirical}`
                                      : example}
                                  </p>
                                  {example.molecular && (
                                    <p className="text-sm font-semibold text-ib-secondary">
                                      Molecular: {example.molecular}
                                    </p>
                                  )}
                                  {example.name && (
                                    <p className="text-xs text-gray-600">
                                      {example.name}
                                    </p>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        )}
                        {concept.types && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-ib-neutral-700 mb-2">
                              Types:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {concept.types.map(
                                (type: string, typeIndex: number) => (
                                  <span
                                    key={typeIndex}
                                    className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded"
                                  >
                                    {type}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}
                        {concept.trends && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-ib-neutral-700 mb-2">
                              Key Trends:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {concept.trends.map(
                                (trend: string, trendIndex: number) => (
                                  <span
                                    key={trendIndex}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                                  >
                                    {trend}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}
                        {concept.shapes && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-ib-neutral-700 mb-2">
                              Molecular Shapes:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {concept.shapes.map(
                                (shape: string, shapeIndex: number) => (
                                  <span
                                    key={shapeIndex}
                                    className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                                  >
                                    {shape}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  )}
              </div>
            </CardContent>
          </Card>

          {/* Quiz Section */}
          {topicQuiz && (
            <div>
              <h2 className="text-2xl font-bold text-ib-neutral-800 mb-4">
                Practice Quiz
              </h2>
              <QuizCard quiz={topicQuiz} />
            </div>
          )}
        </div>

        <div className="space-y-8">
          {/* Formula Sheet for this topic */}
          {topicFormulas[slug || ""] && (
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-ib-neutral-800 flex items-center">
                  <Calculator className="w-5 h-5 mr-2 text-ib-primary" />
                  Key Formulas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topicFormulas[slug || ""].map((formula, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-ib-neutral-800">
                        {formula.name}
                      </p>
                      <p className="text-sm font-mono text-ib-primary">
                        {formula.formula}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {formula.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Molecular Viewer for atomic structure only */}
          {slug === "atomic-structure" && <MolecularViewer />}
        </div>
      </div>
    </div>
  );
}
