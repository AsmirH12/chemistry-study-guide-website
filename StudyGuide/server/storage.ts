import {
  users,
  topics,
  quizzes,
  userProgress,
  bookmarks,
  quizAttempts,
  type User,
  type InsertUser,
  type Topic,
  type InsertTopic,
  type Quiz,
  type InsertQuiz,
  type UserProgress,
  type InsertUserProgress,
  type Bookmark,
  type InsertBookmark,
  type QuizAttempt,
  type InsertQuizAttempt,
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Topic methods
  getAllTopics(): Promise<Topic[]>;
  getTopicBySlug(slug: string): Promise<Topic | undefined>;
  createTopic(topic: InsertTopic): Promise<Topic>;

  // Quiz methods
  getQuizzesByTopicId(topicId: number): Promise<Quiz[]>;
  getQuizById(id: number): Promise<Quiz | undefined>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;

  // Progress methods
  getUserProgress(userId: number): Promise<UserProgress[]>;
  getUserProgressByTopic(
    userId: number,
    topicId: number
  ): Promise<UserProgress | undefined>;
  updateUserProgress(
    userId: number,
    topicId: number,
    percentage: number
  ): Promise<UserProgress>;

  // Bookmark methods
  getUserBookmarks(userId: number): Promise<Bookmark[]>;
  createBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  deleteBookmark(userId: number, topicId: number): Promise<void>;

  // Quiz attempt methods
  createQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt>;
  getUserQuizAttempts(userId: number): Promise<QuizAttempt[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private topics: Map<number, Topic>;
  private quizzes: Map<number, Quiz>;
  private userProgress: Map<string, UserProgress>; // key: userId-topicId
  private bookmarks: Map<string, Bookmark>; // key: userId-topicId
  private quizAttempts: Map<number, QuizAttempt>;
  private currentUserId: number;
  private currentTopicId: number;
  private currentQuizId: number;
  private currentProgressId: number;
  private currentBookmarkId: number;
  private currentAttemptId: number;

  constructor() {
    this.users = new Map();
    this.topics = new Map();
    this.quizzes = new Map();
    this.userProgress = new Map();
    this.bookmarks = new Map();
    this.quizAttempts = new Map();
    this.currentUserId = 1;
    this.currentTopicId = 1;
    this.currentQuizId = 1;
    this.currentProgressId = 1;
    this.currentBookmarkId = 1;
    this.currentAttemptId = 1;

    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create comprehensive IB Chemistry topics
    const sampleTopics: InsertTopic[] = [
      {
        title: "Stoichiometric relationships",
        slug: "stoichiometric-relationships",
        description:
          "Master the fundamental concepts of chemical calculations and mole relationships",
        content: {
          concepts: [
            {
              title: "The Mole Concept",
              description:
                "The mole is a fundamental unit in chemistry that represents 6.022 × 10²³ particles (Avogadro's number). It bridges the gap between atomic/molecular scale and macroscopic quantities. One mole of any substance contains the same number of particles as there are atoms in exactly 12g of carbon-12.",
              formula: "n = m/M",
              explanation:
                "where n = number of moles, m = mass (g), M = molar mass (g/mol)",
            },
            {
              title: "Empirical vs Molecular Formulas",
              description:
                "Empirical formulas show the simplest whole number ratio of atoms, while molecular formulas show the actual number of atoms in a molecule. The molecular formula is always a whole number multiple of the empirical formula.",
              examples: [
                { empirical: "CH₂O", molecular: "C₆H₁₂O₆", name: "Glucose" },
                { empirical: "CH₂", molecular: "C₂H₄", name: "Ethene" },
              ],
            },
            {
              title: "Percentage Composition",
              description:
                "The percentage by mass of each element in a compound. Essential for determining empirical formulas from experimental data.",
              formula: "% element = (mass of element / total mass) × 100",
              explanation:
                "Used to find empirical formulas from mass composition data",
            },
            {
              title: "Solution Concentration",
              description:
                "Concentration expresses the amount of solute dissolved in a given amount of solution. Molarity is the most common unit in chemistry.",
              formula: "c = n/V",
              explanation:
                "where c = concentration (mol/L), n = moles of solute, V = volume of solution (L)",
            },
            {
              title: "Gas Laws and Stoichiometry",
              description:
                "At STP (273K, 1 atm), one mole of any gas occupies 22.4L. This allows conversion between gas volumes and moles in stoichiometric calculations.",
              formula: "PV = nRT",
              explanation:
                "Ideal gas law connecting pressure, volume, moles, and temperature",
            },
          ],
        } as any,
        order: 1,
        parentId: null,
      },
      {
        title: "Atomic structure",
        slug: "atomic-structure",
        description:
          "Understand the structure of atoms and electronic configurations",
        content: {
          concepts: [
            {
              title: "Electron Configuration",
              description:
                "The arrangement of electrons in atomic orbitals follows the Aufbau principle, Hund's rule, and Pauli exclusion principle. Electrons fill orbitals in order of increasing energy.",
              examples: [
                "1s² 2s² 2p⁶ 3s¹ for Sodium (Na)",
                "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p⁶ for Argon (Ar)",
                "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p⁶ 5s² 4d¹⁰ 5p⁶ for Xenon (Xe)",
                "1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p⁶ 5s² 4d¹⁰ 5p⁶ 6s² 4f¹⁴ 5d¹⁰ 6p⁶ for Radon (Rn)",
              ],
              energyOrder:
                "1s < 2s < 2p < 3s < 3p < 4s < 3d < 4p < 5s < 4d < 5p",
            },
            {
              title: "Atomic Orbitals",
              description:
                "Regions in space where electrons are most likely to be found. Each orbital can hold a maximum of 2 electrons with opposite spins.",
              types: [
                "s (spherical, 1 orbital)",
                "p (dumbbell, 3 orbitals)",
                "d (complex, 5 orbitals)",
                "f (very complex, 7 orbitals)",
              ],
            },
            {
              title: "Quantum Numbers",
              description:
                "Four quantum numbers describe each electron in an atom: principal (n), angular momentum (l), magnetic (ml), and spin (ms).",
              examples: [
                "n = 1,2,3... (energy level)",
                "l = 0 to n-1 (subshell)",
                "ml = -l to +l (orbital)",
                "ms = +½ or -½ (spin)",
              ],
            },
            {
              title: "Ionization Energy",
              description:
                "Energy required to remove an electron from an atom or ion. First ionization energy is the energy needed to remove the first electron. Increases across periods and decreases down groups.",
            },
            {
              title: "Electron Affinity",
              description:
                "Energy change when an electron is added to a neutral atom to form a negative ion. More negative values indicate greater tendency to gain electrons. Generally becomes more negative across periods.",
            },
            {
              title: "Atomic Radius",
              description:
                "Distance from the nucleus to the outermost electron shell. Decreases across periods due to increasing nuclear charge and increases down groups due to additional electron shells.",
            },
          ],
        } as any,
        order: 2,
        parentId: null,
      },
      {
        title: "Periodicity",
        slug: "periodicity",
        description: "Explore periodic trends and properties of elements",
        content: {
          concepts: [
            {
              title: "Periodic Trends",
              description:
                "Properties of elements change predictably across periods and down groups due to changes in nuclear charge and electron shielding. These trends help predict chemical behavior.",
              trends: [
                "Atomic radius decreases across period",
                "Ionization energy increases across period",
                "Electronegativity increases across period and up groups",
                "Electron affinity becomes more negative across period",
              ],
            },
            {
              title: "Group Properties",
              description:
                "Elements in the same group have similar chemical properties due to identical valence electron configurations. This similarity decreases down the group as atomic size increases.",
              examples: [
                "Group 1: All lose 1 electron to form +1 ions",
                "Group 17: All gain 1 electron to form -1 ions",
                "Group 18: Stable electron configurations",
              ],
            },
            {
              title: "Isoelectronic Series",
              description:
                "Ions or atoms with the same number of electrons. Size decreases with increasing nuclear charge in an isoelectronic series.",
              examples: [
                "N³⁻ > O²⁻ > F⁻ > Ne > Na⁺ > Mg²⁺ > Al³⁺",
                "All have 10 electrons but different nuclear charges",
              ],
            },
            {
              title: "Periodic Blocks",
              description:
                "The periodic table is divided into s, p, d, and f blocks based on the highest energy subshell being filled.",
              blocks: [
                "s-block: Groups 1-2",
                "p-block: Groups 13-18",
                "d-block: Transition metals",
                "f-block: Lanthanides and actinides",
              ],
            },
          ],
        } as any,
        order: 3,
        parentId: null,
      },
      {
        title: "Equilibrium",
        slug: "equilibrium",
        description:
          "Understand dynamic equilibrium and factors affecting chemical equilibrium",
        content: {
          concepts: [
            {
              title: "Dynamic Equilibrium",
              description:
                "A state where the forward and reverse reactions occur at equal rates, resulting in no net change in concentrations of reactants and products. The system appears static but is actually dynamic.",
              characteristics: [
                "Forward and reverse rates are equal",
                "Concentrations remain constant",
                "System is closed",
                "Can be approached from either direction",
              ],
            },
            {
              title: "Equilibrium Constant (Kc)",
              description:
                "A numerical value that expresses the ratio of product concentrations to reactant concentrations at equilibrium, each raised to their stoichiometric coefficients.",
              formula: "Kc = [C]ᶜ[D]ᵈ/[A]ᵃ[B]ᵇ",
              explanation:
                "For reaction aA + bB ⇌ cC + dD. Kc > 1 favors products, Kc < 1 favors reactants",
            },
            {
              title: "Le Chatelier's Principle",
              description:
                "When a system at equilibrium is disturbed, it responds to minimize the effect of the disturbance and restore equilibrium.",
              factors: [
                "Concentration changes",
                "Pressure changes (gases)",
                "Temperature changes",
                "Catalyst addition (no effect on equilibrium)",
              ],
            },
            {
              title: "Effect of Temperature",
              description:
                "Temperature changes affect equilibrium by changing the value of K. Exothermic reactions favor reactants at higher temperatures, endothermic reactions favor products.",
              examples: [
                "N₂ + 3H₂ ⇌ 2NH₃ (exothermic): K decreases with temperature",
                "N₂O₄ ⇌ 2NO₂ (endothermic): K increases with temperature",
              ],
            },
            {
              title: "Effect of Pressure",
              description:
                "For gaseous reactions, pressure changes affect equilibrium by changing the volume. The system shifts to reduce the number of gas molecules when pressure increases.",
              examples: [
                "N₂ + 3H₂ ⇌ 2NH₃: 4 mol → 2 mol, shifts right with pressure increase",
                "N₂O₄ ⇌ 2NO₂: 1 mol → 2 mol, shifts left with pressure increase",
              ],
            },
            {
              title: "Solubility Product (Ksp)",
              description:
                "The equilibrium constant for the dissolution of sparingly soluble ionic compounds in water.",
              formula: "Ksp = [A⁺]ᵃ[B⁻]ᵇ",
              explanation:
                "For compound AₐBᵦ(s) ⇌ aA⁺(aq) + bB⁻(aq). Higher Ksp means more soluble",
            },
          ],
        } as any,
        order: 4,
        parentId: null,
      },
      {
        title: "Chemical bonding and structure",
        slug: "chemical-bonding",
        description:
          "Learn about different types of chemical bonds and molecular structures",
        content: {
          concepts: [
            {
              title: "Types of Bonding",
              description:
                "Chemical bonds form when atoms share or transfer electrons to achieve stable electron configurations. The type of bonding depends on the electronegativity difference between atoms.",
              types: [
                "Ionic (metal + non-metal, ΔEN > 1.7)",
                "Covalent (non-metals, ΔEN < 1.7)",
                "Metallic (metal atoms)",
                "Hydrogen bonding (H with N, O, F)",
              ],
            },
            {
              title: "Lewis Structures",
              description:
                "Diagrams showing valence electrons as dots around atoms and shared electron pairs as lines between atoms. Used to predict molecular geometry and bonding.",
              rules: [
                "Count total valence electrons",
                "Place least electronegative atom in center",
                "Connect atoms with single bonds",
                "Distribute remaining electrons as lone pairs",
                "Form multiple bonds if needed",
              ],
            },
            {
              title: "VSEPR Theory",
              description:
                "Valence Shell Electron Pair Repulsion theory predicts molecular geometry based on minimizing repulsion between electron pairs around central atom.",
              shapes: [
                "Linear (2 groups)",
                "Trigonal planar (3 groups)",
                "Tetrahedral (4 groups)",
                "Trigonal bipyramidal (5 groups)",
                "Octahedral (6 groups)",
              ],
            },
            {
              title: "Molecular Polarity",
              description:
                "Polar molecules have uneven distribution of electron density due to differences in electronegativity and molecular geometry.",
              factors: [
                "Bond polarity (electronegativity difference)",
                "Molecular geometry (symmetry)",
                "Lone pairs on central atom",
              ],
            },
            {
              title: "Intermolecular Forces",
              description:
                "Forces between molecules that determine physical properties like boiling point, melting point, and solubility.",
              types: [
                "London dispersion (weakest, all molecules)",
                "Dipole-dipole (polar molecules)",
                "Hydrogen bonding (strongest, H with N/O/F)",
                "Dipole-induced dipole (polar molecules with non-polar molecules)",
              ],
            },
            {
              title: "Bond Properties",
              description:
                "Bond strength and length are related to the types of atoms involved and the bond order.",
              concepts: [
                "Bond length decreases with higher bond order",
                "Bond strength increases with higher bond order",
                "Triple bonds are shorter and stronger than double bonds",
                "Single bonds are longest and weakest",
              ],
            },
          ],
        } as any,
        order: 5,
        parentId: null,
      },
      {
        title: "Energetics/thermochemistry",
        slug: "energetics-thermochemistry",
        description:
          "Study energy changes in chemical reactions and thermodynamic principles",
        content: {
          concepts: [
            {
              title: "Enthalpy Changes",
              description:
                "Energy absorbed or released during chemical reactions at constant pressure. Exothermic reactions release heat (ΔH < 0) while endothermic reactions absorb heat (ΔH > 0).",
              types: [
                "ΔHf° (standard formation)",
                "ΔHc° (standard combustion)",
                "ΔHfus (fusion)",
                "ΔHvap (vaporization)",
                "ΔHsub (sublimation)",
                "Bond enthalpies",
              ],
            },
            {
              title: "Hess's Law",
              description:
                "The total enthalpy change is independent of the route taken, only dependent on initial and final states. This allows calculation of unknown enthalpy changes.",
              formula: "ΔH = ΣΔHf°(products) - ΣΔHf°(reactants)",
              explanation:
                "Can also use bond enthalpies: ΔH = Σ(bonds broken) - Σ(bonds formed)",
            },
            {
              title: "Calorimetry",
              description:
                "Experimental technique to measure heat changes in chemical reactions using the relationship q = mcΔT.",
              types: [
                "Simple calorimetry (coffee cup)",
                "Bomb calorimetry (constant volume)",
                "Specific heat capacity measurements",
              ],
            },
            {
              title: "Born-Haber Cycle",
              description:
                "Application of Hess's Law to calculate lattice energies of ionic compounds using various enthalpy changes.",
              steps: [
                "Sublimation of metal",
                "Ionization of metal",
                "Dissociation of non-metal",
                "Electron affinity",
                "Lattice energy",
              ],
            },
            {
              title: "Entropy and Gibbs Free Energy",
              description:
                "Entropy measures disorder in a system. Gibbs free energy determines reaction spontaneity.",
              formulas: [
                "ΔS = ΣS°(products) - ΣS°(reactants)",
                "ΔG = ΔH - TΔS",
                "ΔG < 0 for spontaneous reactions",
              ],
            },
          ],
        } as any,
        order: 6,
        parentId: null,
      },
      {
        title: "Chemical kinetics",
        slug: "chemical-kinetics",
        description:
          "Understand reaction rates and factors affecting chemical reaction speed",
        content: {
          concepts: [
            {
              title: "Rate of Reaction",
              description:
                "How fast reactants are consumed or products are formed, measured as change in concentration per unit time.",
              formula: "Rate = Δ[concentration]/Δtime",
              explanation:
                "Can be measured by following concentration of reactants (decreasing) or products (increasing)",
            },
            {
              title: "Collision Theory",
              description:
                "Reactions occur when particles collide with sufficient energy (activation energy) and correct orientation. Only a fraction of collisions lead to reaction.",
              factors: [
                "Temperature (increases kinetic energy)",
                "Concentration (more particles)",
                "Surface area (more collision sites)",
                "Catalysts (lower activation energy)",
              ],
            },
            {
              title: "Rate Laws and Order",
              description:
                "Mathematical relationship between reaction rate and concentration of reactants. Rate = k[A]^m[B]^n where m,n are orders.",
              concepts: [
                "Zero order: rate independent of concentration",
                "First order: rate ∝ [A]",
                "Second order: rate ∝ [A]²",
                "Overall order = sum of individual orders",
              ],
            },
            {
              title: "Activation Energy",
              description:
                "Minimum energy required for a reaction to occur. Catalysts lower activation energy by providing alternative reaction pathways.",
              formula: "k = Ae^(-Ea/RT)",
              explanation:
                "Arrhenius equation relates rate constant to temperature and activation energy. Higher activation energy means slower reaction rate. Catalysts work by lowering the activation energy barrier.",
            },
            {
              title: "Reaction Mechanisms",
              description:
                "Step-by-step sequence of elementary reactions that lead to overall reaction. Rate is determined by slowest step (rate-determining step).",
              concepts: [
                "Elementary reactions",
                "Intermediates",
                "Rate-determining step",
                "Pre-equilibrium approximation",
              ],
            },
          ],
        } as any,
        order: 7,
        parentId: null,
      },
    ];

    sampleTopics.forEach((topic) => this.createTopic(topic));

    // Create comprehensive quizzes for each topic
    const quizData: InsertQuiz[] = [
      {
        topicId: 1,
        title: "Stoichiometry Quiz",
        questions: [
          {
            id: 1,
            question: "What is the molar mass of Ca(OH)₂?",
            options: ["56.08 g/mol", "74.10 g/mol", "82.08 g/mol"],
            correctAnswer: 1,
            explanation: "Ca(40.08) + 2×O(16.00) + 2×H(1.01) = 74.10 g/mol",
          },
          {
            id: 2,
            question: "How many moles are in 44g of CO₂?",
            options: ["0.5 mol", "1.0 mol", "2.0 mol"],
            correctAnswer: 1,
            explanation:
              "Molar mass of CO₂ = 44 g/mol, so 44g ÷ 44 g/mol = 1.0 mol",
          },
          {
            id: 3,
            question:
              "What is the empirical formula of a compound containing 40% C, 6.7% H, and 53.3% O?",
            options: ["CHO", "CH₂O", "C₂H₄O₂"],
            correctAnswer: 1,
            explanation:
              "40/12 : 6.7/1 : 53.3/16 = 3.33:6.7:3.33 = 1:2:1 → CH₂O",
          },
          {
            id: 4,
            question:
              "What volume of 0.1 M HCl is needed to neutralize 25 mL of 0.2 M NaOH?",
            options: ["25 mL", "50 mL", "12.5 mL"],
            correctAnswer: 1,
            explanation:
              "Moles NaOH = 0.025 × 0.2 = 0.005 mol. Need equal moles HCl: V = 0.005/0.1 = 0.05 L = 50 mL",
          },
          {
            id: 5,
            question:
              "If 2.0 g of Mg burns completely, what mass of MgO is formed?",
            options: ["2.4 g", "3.3 g", "4.0 g"],
            correctAnswer: 1,
            explanation:
              "2Mg + O₂ → 2MgO. Moles Mg = 2/24.3 = 0.082 mol. Mass MgO = 0.082 × 40.3 = 3.3 g",
          },
        ],
      },
      {
        topicId: 2,
        title: "Atomic Structure Quiz",
        questions: [
          {
            id: 1,
            question: "What is the electron configuration of Fe³⁺?",
            options: ["[Ar] 3d⁵", "[Ar] 3d³", "[Ar] 4s² 3d³"],
            correctAnswer: 0,
            explanation:
              "Fe is [Ar] 4s² 3d⁶. Remove 2 electrons from 4s and 1 from 3d to get [Ar] 3d⁵",
          },
          {
            id: 2,
            question:
              "What is the electron configuration of a copper atom (Cu)?",
            options: [
              "[Ar] 4s² 3d⁹",
              "[Ar] 4s¹ 3d¹⁰",
              "[Ar] 4s² 3d⁸",
              "[Ar] 4s¹ 3d⁹",
            ],
            correctAnswer: 1,
            explanation:
              "Cu has 29 electrons. Like Cr, Cu has a special configuration: [Ar] 4s¹ 3d¹⁰ due to the stability of a filled d subshell.",
          },
          {
            id: 3,
            question: "How many orbitals are in the 3d subshell?",
            options: ["3", "5", "7"],
            correctAnswer: 1,
            explanation:
              "d subshells always contain 5 orbitals, regardless of the principal quantum number",
          },
          {
            id: 4,
            question:
              "Which quantum numbers are possible for an electron in a 2p orbital?",
            options: ["n=2, l=0", "n=2, l=1", "n=2, l=2"],
            correctAnswer: 1,
            explanation:
              "For 2p: n=2, l=1 (p corresponds to l=1), ml=-1,0,+1, ms=±½",
          },
          {
            id: 5,
            question:
              "What is the maximum number of electrons that can occupy the 3p subshell?",
            options: ["2", "6", "10", "14"],
            correctAnswer: 1,
            explanation:
              "The p subshell has 3 orbitals, and each orbital can hold 2 electrons. So 3p can hold 3 × 2 = 6 electrons.",
          },
        ],
      },
      {
        topicId: 3,
        title: "Periodicity Quiz",
        questions: [
          {
            id: 1,
            question: "Which element has the highest first ionization energy?",
            options: ["Li", "Ne", "F"],
            correctAnswer: 1,
            explanation:
              "Noble gases have the highest ionization energies due to complete electron shells",
          },
          {
            id: 2,
            question: "What is the trend for atomic radius across Period 3?",
            options: ["Increases", "Decreases", "Stays constant"],
            correctAnswer: 1,
            explanation:
              "Atomic radius decreases across a period due to increasing nuclear charge",
          },
          {
            id: 3,
            question: "Which has the largest ionic radius?",
            options: ["Na⁺", "Mg²⁺", "Al³⁺"],
            correctAnswer: 0,
            explanation:
              "Lower charge density and fewer protons pulling electrons make Na⁺ largest",
          },
          {
            id: 4,
            question: "Electronegativity generally increases:",
            options: ["Down a group", "Across a period", "Both directions"],
            correctAnswer: 1,
            explanation:
              "Electronegativity increases across periods and up groups",
          },
          {
            id: 5,
            question: "Which element has the highest electron affinity?",
            options: ["F", "Cl", "Br"],
            correctAnswer: 0,
            explanation:
              "Fluorine has the highest electron affinity due to its small size and high electronegativity",
          },
        ],
      },
      {
        topicId: 4,
        title: "Equilibrium Quiz",
        questions: [
          {
            id: 1,
            question:
              "For the reaction N₂ + 3H₂ ⇌ 2NH₃, what is the equilibrium constant expression?",
            options: [
              "Kc = [NH₃]²/[N₂][H₂]³",
              "Kc = [N₂][H₂]³/[NH₃]²",
              "Kc = [NH₃]/[N₂][H₂]",
            ],
            correctAnswer: 0,
            explanation:
              "Kc = [products]/[reactants] with coefficients as exponents: [NH₃]²/[N₂][H₂]³",
          },
          {
            id: 2,
            question: "If Kc = 0.1 for a reaction, what does this indicate?",
            options: [
              "Products are favored",
              "Reactants are favored",
              "Equal amounts of products and reactants",
            ],
            correctAnswer: 1,
            explanation:
              "Kc < 1 means the equilibrium lies to the left, favoring reactants",
          },
          {
            id: 3,
            question:
              "According to Le Chatelier's principle, what happens when temperature is increased for an exothermic reaction?",
            options: [
              "Equilibrium shifts right",
              "Equilibrium shifts left",
              "No change in equilibrium",
            ],
            correctAnswer: 1,
            explanation:
              "For exothermic reactions, increasing temperature shifts equilibrium toward reactants (left)",
          },
          {
            id: 4,
            question: "What is the solubility product expression for AgCl?",
            options: ["Ksp = [Ag⁺][Cl⁻]", "Ksp = [Ag⁺]²[Cl⁻]²", "Ksp = [AgCl]"],
            correctAnswer: 0,
            explanation: "AgCl(s) ⇌ Ag⁺(aq) + Cl⁻(aq), so Ksp = [Ag⁺][Cl⁻]",
          },
          {
            id: 5,
            question:
              "For the reaction N₂O₄ ⇌ 2NO₂, what happens when pressure is increased?",
            options: ["Shifts toward NO₂", "Shifts toward N₂O₄", "No change"],
            correctAnswer: 1,
            explanation:
              "Increasing pressure shifts equilibrium toward fewer gas molecules: 2NO₂ → N₂O₄",
          },
        ],
      },
      {
        topicId: 5,
        title: "Chemical Bonding Quiz",
        questions: [
          {
            id: 1,
            question: "What type of bond forms between Na and Cl?",
            options: ["Covalent", "Ionic", "Metallic"],
            correctAnswer: 1,
            explanation:
              "Na (metal) + Cl (non-metal) with large electronegativity difference forms ionic bond",
          },
          {
            id: 2,
            question: "What is the molecular geometry of H₂O?",
            options: ["Linear", "Bent", "Tetrahedral"],
            correctAnswer: 1,
            explanation:
              "H₂O has 2 bonding pairs and 2 lone pairs, giving bent geometry",
          },
          {
            id: 3,
            question: "Which molecule is polar?",
            options: ["CO₂", "CH₄", "NH₃"],
            correctAnswer: 2,
            explanation:
              "NH₃ has trigonal pyramidal geometry with lone pair, making it polar",
          },
          {
            id: 4,
            question: "What is the strongest intermolecular force in H₂O?",
            options: ["London dispersion", "Dipole-dipole", "Hydrogen bonding"],
            correctAnswer: 2,
            explanation:
              "H₂O has H bonded to O, creating strong hydrogen bonds",
          },
          {
            id: 5,
            question: "Calculate the lattice energy order: LiF, NaCl, MgO",
            options: [
              "LiF < NaCl < MgO",
              "NaCl < LiF < MgO",
              "MgO < NaCl < LiF",
            ],
            correctAnswer: 0,
            explanation:
              "Lattice energy increases with charge and decreases with size: LiF < NaCl < MgO",
          },
        ],
      },
      {
        topicId: 6,
        title: "Energetics Quiz",
        questions: [
          {
            id: 1,
            question:
              "What is the standard enthalpy of formation of an element in its standard state?",
            options: ["0 kJ/mol", "Positive value", "Negative value"],
            correctAnswer: 0,
            explanation:
              "By definition, ΔHf° = 0 for elements in their standard states",
          },
          {
            id: 2,
            question: "For an exothermic reaction, ΔH is:",
            options: ["Positive", "Negative", "Zero"],
            correctAnswer: 1,
            explanation:
              "Exothermic reactions release heat, so ΔH < 0 (negative)",
          },
          {
            id: 3,
            question: "What is the relationship between ΔG, ΔH, and ΔS?",
            options: ["ΔG = ΔH + TΔS", "ΔG = ΔH - TΔS", "ΔG = ΔH × TΔS"],
            correctAnswer: 1,
            explanation: "Gibbs free energy equation: ΔG = ΔH - TΔS",
          },
          {
            id: 4,
            question: "When ΔG < 0, the reaction is:",
            options: ["Spontaneous", "Non-spontaneous", "At equilibrium"],
            correctAnswer: 0,
            explanation: "ΔG < 0 indicates a spontaneous reaction",
          },
          {
            id: 5,
            question: "What is the heat capacity of water?",
            options: ["4.18 J/g°C", "1.00 J/g°C", "2.00 J/g°C"],
            correctAnswer: 0,
            explanation: "The specific heat capacity of water is 4.18 J/g°C",
          },
        ],
      },
      {
        topicId: 7,
        title: "Kinetics Quiz",
        questions: [
          {
            id: 1,
            question: "What is the rate law for a first-order reaction?",
            options: ["Rate = k[A]", "Rate = k[A]²", "Rate = k"],
            correctAnswer: 0,
            explanation: "First-order rate law: Rate = k[A]",
          },
          {
            id: 2,
            question:
              "What is the half-life of a first-order reaction with k = 0.693 s⁻¹?",
            options: ["0.5 s", "1.0 s", "2.0 s"],
            correctAnswer: 1,
            explanation:
              "For first-order: t₁/₂ = ln(2)/k = 0.693/0.693 = 1.0 s",
          },
          {
            id: 3,
            question: "How does temperature affect reaction rate?",
            options: [
              "Always increases rate",
              "Always decreases rate",
              "Depends on the reaction",
            ],
            correctAnswer: 0,
            explanation:
              "Increasing temperature always increases reaction rate by increasing kinetic energy",
          },
          {
            id: 4,
            question:
              "What is the rate-determining step in a reaction mechanism?",
            options: ["The fastest step", "The slowest step", "The first step"],
            correctAnswer: 1,
            explanation:
              "The rate-determining step is the slowest step in a reaction mechanism and controls the overall reaction rate.",
          },
          {
            id: 5,
            question:
              "What is the overall order of a reaction with rate law: Rate = k[A][B]²?",
            options: ["1", "2", "3"],
            correctAnswer: 2,
            explanation: "Overall order = sum of individual orders: 1 + 2 = 3",
          },
        ],
      },
    ];

    // Create difficulty-based comprehensive quizzes
    const difficultyQuizzes: InsertQuiz[] = [
      {
        topicId: 1, // Will be used differently
        title: "Easy Chemistry Quiz",
        questions: [
          {
            id: 1,
            question: "How many protons does carbon have?",
            options: ["4", "6", "12"],
            correctAnswer: 1,
            explanation: "Carbon has atomic number 6, so it has 6 protons",
          },
          {
            id: 2,
            question: "What is the chemical formula for water?",
            options: ["H₂O", "CO₂", "NaCl"],
            correctAnswer: 0,
            explanation: "Water consists of 2 hydrogen atoms and 1 oxygen atom",
          },
          {
            id: 3,
            question: "What is the charge of an electron?",
            options: ["Positive", "Negative", "Neutral"],
            correctAnswer: 1,
            explanation: "Electrons carry a negative charge of -1",
          },
          {
            id: 4,
            question: "How many electrons can the first shell hold?",
            options: ["2", "8", "18"],
            correctAnswer: 0,
            explanation:
              "The first electron shell (n=1) can hold a maximum of 2 electrons",
          },
          {
            id: 5,
            question: "What type of bond forms between Na and Cl?",
            options: ["Covalent", "Ionic", "Metallic"],
            correctAnswer: 1,
            explanation:
              "Large electronegativity difference leads to ionic bonding",
          },
          {
            id: 6,
            question: "What is Avogadro's number approximately?",
            options: ["6.02 × 10²³", "3.14 × 10⁸", "9.81 × 10⁹"],
            correctAnswer: 0,
            explanation: "Avogadro's number is 6.022 × 10²³ particles per mole",
          },
          {
            id: 7,
            question: "Which element is in Group 1?",
            options: ["Carbon", "Sodium", "Chlorine"],
            correctAnswer: 1,
            explanation: "Sodium (Na) is an alkali metal in Group 1",
          },
          {
            id: 8,
            question: "What happens in an exothermic reaction?",
            options: ["Heat absorbed", "Heat released", "No heat change"],
            correctAnswer: 1,
            explanation: "Exothermic reactions release heat energy",
          },
          {
            id: 9,
            question: "What is the pH of pure water?",
            options: ["0", "7", "14"],
            correctAnswer: 1,
            explanation: "Pure water has a neutral pH of 7",
          },
          {
            id: 10,
            question: "How many valence electrons does oxygen have?",
            options: ["4", "6", "8"],
            correctAnswer: 1,
            explanation: "Oxygen is in Group 16 and has 6 valence electrons",
          },
        ],
      },
      {
        topicId: 2,
        title: "Medium Chemistry Quiz",
        questions: [
          {
            id: 1,
            question: "What is the electron configuration of Mg²⁺?",
            options: ["1s² 2s² 2p⁶", "1s² 2s² 2p⁶ 3s²", "1s² 2s²"],
            correctAnswer: 0,
            explanation:
              "Mg loses 2 electrons from 3s orbital: [Ne] configuration",
          },
          {
            id: 2,
            question:
              "Calculate the molarity of a solution with 0.5 mol solute in 250 mL solution.",
            options: ["1.0 M", "2.0 M", "0.5 M"],
            correctAnswer: 1,
            explanation: "M = mol/L = 0.5 mol / 0.25 L = 2.0 M",
          },
          {
            id: 3,
            question: "What is the hybridization of carbon in methane (CH₄)?",
            options: ["sp", "sp²", "sp³"],
            correctAnswer: 2,
            explanation:
              "Carbon forms 4 equivalent bonds, requiring sp³ hybridization",
          },
          {
            id: 4,
            question: "Which has the largest atomic radius?",
            options: ["Li", "Na", "K"],
            correctAnswer: 2,
            explanation:
              "Atomic radius increases down a group due to additional electron shells",
          },
          {
            id: 5,
            question: "What is the oxidation state of Cr in K₂Cr₂O₇?",
            options: ["+3", "+6", "+7"],
            correctAnswer: 1,
            explanation: "K(+1), O(-2): 2(+1) + 2x + 7(-2) = 0, so x = +6",
          },
          {
            id: 6,
            question:
              "How much heat is released when 2 mol of H₂ burns? ΔH = -286 kJ/mol H₂O",
            options: ["286 kJ", "572 kJ", "143 kJ"],
            correctAnswer: 1,
            explanation:
              "2 mol H₂ produces 2 mol H₂O: 2 × 286 = 572 kJ released",
          },
          {
            id: 7,
            question:
              "What is the rate law for: 2A + B → C if the reaction is first order in A and second order in B?",
            options: ["Rate = k[A][B]", "Rate = k[A]²[B]", "Rate = k[A][B]²"],
            correctAnswer: 2,
            explanation:
              "First order in A, second order in B: Rate = k[A]¹[B]²",
          },
          {
            id: 8,
            question: "What is the molecular geometry of SF₄?",
            options: ["Tetrahedral", "See-saw", "Square planar"],
            correctAnswer: 1,
            explanation: "4 bonding pairs + 1 lone pair gives see-saw geometry",
          },
          {
            id: 9,
            question: "Which molecule exhibits hydrogen bonding?",
            options: ["CH₄", "NH₃", "CO₂"],
            correctAnswer: 1,
            explanation: "NH₃ has N-H bonds where N is highly electronegative",
          },
          {
            id: 10,
            question: "What is the molecular geometry of SF₆?",
            options: ["Octahedral", "Trigonal bipyramidal", "Square planar"],
            correctAnswer: 0,
            explanation:
              "SF₆ has 6 bonding pairs around the central S atom, giving octahedral geometry.",
          },
        ],
      },
      {
        topicId: 3,
        title: "Hard Chemistry Quiz",
        questions: [
          {
            id: 1,
            question:
              "Calculate ΔH for: C₂H₄ + H₂ → C₂H₆ given: ΔHf°(C₂H₄) = +52 kJ/mol, ΔHf°(C₂H₆) = -85 kJ/mol",
            options: ["-137 kJ/mol", "-33 kJ/mol", "+137 kJ/mol"],
            correctAnswer: 0,
            explanation:
              "ΔH = ΣΔHf°(products) - ΣΔHf°(reactants) = -85 - (+52 + 0) = -137 kJ/mol",
          },
          {
            id: 2,
            question:
              "For the reaction 2A → B with rate = k[A]², if [A] = 0.1 M and rate = 2×10⁻³ M/s, what is k?",
            options: ["0.2 M⁻¹s⁻¹", "2.0 M⁻¹s⁻¹", "0.02 M⁻¹s⁻¹"],
            correctAnswer: 0,
            explanation:
              "rate = k[A]²: 2×10⁻³ = k(0.1)², so k = 2×10⁻³/0.01 = 0.2 M⁻¹s⁻¹",
          },
          {
            id: 3,
            question: "What is the formal charge on the central S in SO₄²⁻?",
            options: ["+2", "+6", "0"],
            correctAnswer: 0,
            explanation:
              "FC = valence - nonbonding - ½(bonding) = 6 - 0 - ½(8) = +2",
          },
          {
            id: 4,
            question: "How many stereoisomers exist for CHBrClF?",
            options: ["0", "1", "2"],
            correctAnswer: 2,
            explanation:
              "CHBrClF has a chiral carbon with 4 different groups, giving 2 enantiomers",
          },
          {
            id: 5,
            question: "Calculate the lattice energy order: LiF, NaCl, MgO",
            options: [
              "LiF < NaCl < MgO",
              "MgO > LiF > NaCl",
              "NaCl > LiF > MgO",
            ],
            correctAnswer: 1,
            explanation:
              "Lattice energy ∝ q₁q₂/r. MgO (+2,-2) > LiF (+1,-1, small) > NaCl (+1,-1, large)",
          },
          {
            id: 6,
            question:
              "What is the standard entropy change for the reaction: 2SO₂(g) + O₂(g) → 2SO₃(g)?",
            options: ["ΔS° > 0", "ΔS° < 0", "ΔS° = 0"],
            correctAnswer: 1,
            explanation:
              "3 moles gas → 2 moles gas decreases entropy (ΔS° < 0)",
          },
          {
            id: 7,
            question: "Which complex has the largest crystal field splitting?",
            options: ["[Fe(CN)₆]³⁻", "[Fe(H₂O)₆]³⁺", "[Fe(F)₆]³⁻"],
            correctAnswer: 0,
            explanation:
              "CN⁻ is a strong field ligand causing large crystal field splitting",
          },
          {
            id: 8,
            question: "Calculate pH of 0.1 M NH₃ solution (Kb = 1.8×10⁻⁵)",
            options: ["9.13", "11.13", "2.87"],
            correctAnswer: 1,
            explanation:
              "[OH⁻] = √(Kb×C) = √(1.8×10⁻⁵×0.1) = 1.34×10⁻³, pOH = 2.87, pH = 11.13",
          },
          {
            id: 9,
            question: "What is the bond order in O₂⁻?",
            options: ["1.5", "2.0", "2.5"],
            correctAnswer: 0,
            explanation:
              "O₂⁻ has 17 electrons: (8-5)/2 = 1.5 bond order using MO theory",
          },
          {
            id: 10,
            question:
              "For a voltaic cell: Zn|Zn²⁺||Cu²⁺|Cu, if E°cell = 1.10 V and [Zn²⁺] = 0.1 M, [Cu²⁺] = 1.0 M, what is Ecell?",
            options: ["1.13 V", "1.07 V", "1.10 V"],
            correctAnswer: 0,
            explanation:
              "Ecell = E°cell - (RT/nF)ln(Q) = 1.10 - (0.0257/2)ln(0.1/1.0) = 1.13 V",
          },
        ],
      },
    ];

    quizData.forEach((quiz) => this.createQuiz(quiz));
    difficultyQuizzes.forEach((quiz) => this.createQuiz(quiz));
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllTopics(): Promise<Topic[]> {
    return Array.from(this.topics.values()).sort((a, b) => a.order - b.order);
  }

  async getTopicBySlug(slug: string): Promise<Topic | undefined> {
    return Array.from(this.topics.values()).find(
      (topic) => topic.slug === slug
    );
  }

  async createTopic(insertTopic: InsertTopic): Promise<Topic> {
    const id = this.currentTopicId++;
    const topic: Topic = {
      ...insertTopic,
      id,
      parentId: insertTopic.parentId ?? null,
    };
    this.topics.set(id, topic);
    return topic;
  }

  async getQuizzesByTopicId(topicId: number): Promise<Quiz[]> {
    return Array.from(this.quizzes.values()).filter(
      (quiz) => quiz.topicId === topicId
    );
  }

  async getQuizById(id: number): Promise<Quiz | undefined> {
    return this.quizzes.get(id);
  }

  async createQuiz(insertQuiz: InsertQuiz): Promise<Quiz> {
    const id = this.currentQuizId++;
    const quiz: Quiz = { ...insertQuiz, id };
    this.quizzes.set(id, quiz);
    return quiz;
  }

  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(
      (progress) => progress.userId === userId
    );
  }

  async getUserProgressByTopic(
    userId: number,
    topicId: number
  ): Promise<UserProgress | undefined> {
    const key = `${userId}-${topicId}`;
    return this.userProgress.get(key);
  }

  async updateUserProgress(
    userId: number,
    topicId: number,
    percentage: number
  ): Promise<UserProgress> {
    const key = `${userId}-${topicId}`;
    const existing = this.userProgress.get(key);

    if (existing) {
      existing.completionPercentage = percentage;
      existing.lastStudied = new Date();
      return existing;
    } else {
      const id = this.currentProgressId++;
      const progress: UserProgress = {
        id,
        userId,
        topicId,
        completionPercentage: percentage,
        lastStudied: new Date(),
      };
      this.userProgress.set(key, progress);
      return progress;
    }
  }

  async getUserBookmarks(userId: number): Promise<Bookmark[]> {
    return Array.from(this.bookmarks.values()).filter(
      (bookmark) => bookmark.userId === userId
    );
  }

  async createBookmark(insertBookmark: InsertBookmark): Promise<Bookmark> {
    const id = this.currentBookmarkId++;
    const bookmark: Bookmark = { ...insertBookmark, id, createdAt: new Date() };
    const key = `${insertBookmark.userId}-${insertBookmark.topicId}`;
    this.bookmarks.set(key, bookmark);
    return bookmark;
  }

  async deleteBookmark(userId: number, topicId: number): Promise<void> {
    const key = `${userId}-${topicId}`;
    this.bookmarks.delete(key);
  }

  async createQuizAttempt(
    insertAttempt: InsertQuizAttempt
  ): Promise<QuizAttempt> {
    const id = this.currentAttemptId++;
    const attempt: QuizAttempt = {
      ...insertAttempt,
      id,
      completedAt: new Date(),
    };
    this.quizAttempts.set(id, attempt);
    return attempt;
  }

  async getUserQuizAttempts(userId: number): Promise<QuizAttempt[]> {
    return Array.from(this.quizAttempts.values()).filter(
      (attempt) => attempt.userId === userId
    );
  }
}

export const storage = new MemStorage();
