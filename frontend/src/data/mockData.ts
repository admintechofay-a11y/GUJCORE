import { 
  Symposium, 
  Speaker, 
  RegistrationTier, 
  SponsorshipPackage, 
  AdvertisementRate,
  ExhibitorBooth,
  AwardCategory
} from '../types';

export const CONFERENCE_INFO = {
  name: "GUJCORR 2027",
  fullName: "AMPP Gujarat Global Conference & Expo on Corrosion",
  edition: "India's Premier Corrosion Conference & Expo in Gujarat",
  dates: "18th – 20th February 2027",
  startDate: "2027-02-18T09:00:00+05:30",
  endDate: "2027-02-20T18:00:00+05:30",
  venue: "Courtyard by Marriott / Convention Hub, Vadodara, Gujarat, India",
  venueAddress: "Sarabhai Campus, Near Genda Circle, Alembic Road, Vadodara, Gujarat, India – 390023",
  theme: "Stronger Together: Uniting the Global Fight Against Corrosion",
  motto: "A Safer, Protected, and Sustainable World",
  vision: "A world built and protected with safe, reliable, sustainable materials.",
  mission: "Advancing materials performance to protect society, assets, and the environment through technical standards, workforce credentialing, and global collaboration.",
  chairmansMessage: {
    title: "Message from the Conference Chairman & Chapter Chair",
    chairName: "Dr. Sunil Kahar",
    chairRole: "Chair, AMPP Gujarat Chapter & Chairman, IIM Baroda Chapter",
    chairAffiliation: "Assistant Professor, Dept. of Metallurgical & Materials Engineering, Faculty of Tech. & Engg., The Maharaja Sayajirao University of Baroda",
    photo: "/images/ampp/Dr-sunil-Kahar.jpg",
    content: [
      "It is an honor and privilege to welcome you to GUJCORR 2027, organized by the dynamic and rapidly growing AMPP Gujarat Chapter in collaboration with the historic Indian Institute of Metals Baroda Chapter.",
      "The AMPP Gujarat Chapter, established on September 19, 2024, is officially recognized as part of AMPP's global framework. Located in one of India's leading industrial regions, Gujarat is a powerhouse of manufacturing — home to thriving chemical, petrochemical, refinery, pipeline, and heavy engineering complexes. Our chapter serves as a vital extension of AMPP, committed to raising awareness and advancing practices in materials protection and corrosion control throughout western India.",
      "Corrosion continues to be a critical challenge globally — causing catastrophic damage to infrastructure, posing severe risks to public safety, and affecting operational efficiency and product quality. The global cost of corrosion is estimated at a staggering US$2.5 trillion, approximately 3.4% of global GDP. However, research and industrial experience have demonstrated that by adopting effective corrosion management strategies, we can potentially reduce these costs by up to 50% — all while extending the service life of essential assets.",
      "Our mission at GUJCORR 2027 is to promote the understanding and application of cutting-edge corrosion control techniques, protective coatings, cathodic protection, and digital asset integrity across industries, academia, and research institutions. Let us move forward together, with a shared purpose and renewed energy, knowing that our collective vision for materials protection is taking shape — Stronger, Together."
    ]
  },
  organizers: [
    {
      name: "AMPP Gujarat Chapter",
      role: "Primary Organizer",
      established: "September 19, 2024",
      logo: "/images/ampp/Logo.png",
      description: "Recognized as part of AMPP's global framework dedicated to promoting corrosion awareness, protection, and control within Gujarat, Rajasthan, and Maharashtra.",
      website: "https://www.amppgujarat.org"
    },
    {
      name: "IIM Baroda Chapter",
      role: "Co-Organizer",
      established: "1971",
      description: "One of the oldest and most prestigious chapters of the Indian Institute of Metals, based at The M.S. University of Baroda.",
      website: "https://www.iimbaroda.com"
    },
    {
      name: "The Maharaja Sayajirao University of Baroda",
      role: "Knowledge Partner",
      description: "Department of Metallurgical & Materials Engineering, Faculty of Technology & Engineering, Kalabhavan Campus, Vadodara."
    }
  ],
  bankDetails: {
    bankName: "Union Bank of India",
    branch: "Dandia Bazar, Vadodara - 390001",
    accountName: "Indian Institute of Metals",
    accountNumber: "520101234030441",
    ifscCode: "UBIN0901555",
    micrCode: "390026037"
  },
  contact: {
    secretary: "Mr. Hiren Panchal",
    phone: "+91 99888 81674",
    email1: "info@amppgujarat.org",
    email2: "iim.barodachapter@gmail.com",
    email3: "iim.barodachapter@gmail.com",
    address: "Block B, Sarabhai Campus, Near Genda Circle, Alembic Road, Vadodara, Gujarat – 390023"
  }
};

export const IMPORTANT_DATES = [
  {
    id: 1,
    title: "Abstracts Submission Due",
    date: "30th September 2026",
    rawDate: "2026-09-30",
    category: "Call for Papers",
    description: "Submit 200–250 word structured abstract outlining objective, methodology, and key findings.",
    status: "Open"
  },
  {
    id: 2,
    title: "Full Text Paper Due",
    date: "15th October 2026",
    rawDate: "2026-10-15",
    category: "Manuscript",
    description: "Complete peer-reviewed manuscript submission following standard conference formatting guidelines.",
    status: "Upcoming"
  },
  {
    id: 3,
    title: "Presentation Submission / Upload Due",
    date: "15th November 2026",
    rawDate: "2026-11-15",
    category: "Presentation",
    description: "Slide deck and presentation file submission for oral and poster presentation sessions.",
    status: "Upcoming"
  },
  {
    id: 4,
    title: "Registration Deadline for Authors",
    date: "15th December 2026",
    rawDate: "2026-12-15",
    category: "Registration",
    description: "Mandatory delegate registration completion for accepted authors to ensure inclusion in final programme.",
    status: "Critical"
  },
  {
    id: 5,
    title: "GUJCORR 2027 Conference & Expo",
    date: "18th – 20th February 2027",
    rawDate: "2027-02-18",
    category: "Event",
    description: "Three full days of keynotes, 14 technical symposia, industrial exhibition, and gala dinner in Vadodara.",
    status: "Event Days"
  }
];

export const SYMPOSIA: Symposium[] = [
  {
    id: 1,
    code: "SYM-01",
    title: "Corrosion & Inhibitors",
    category: "Science",
    icon: "FlaskConical",
    description: "Fundamental electrochemical mechanisms, organic/inorganic corrosion inhibitors, green inhibitors, adsorption kinetics, and high-efficiency formulations.",
    topics: ["Organic & Inorganic Inhibitors", "Green & Bio-based Inhibitors", "Electrochemical Kinetics", "High-Temperature Inhibition", "Synergistic Formulations"]
  },
  {
    id: 2,
    code: "SYM-02",
    title: "Microbiologically Influenced Corrosion (MIC)",
    category: "Science",
    icon: "Biohazard",
    description: "Biofilm dynamics, sulfate-reducing bacteria (SRB), acid-producing bacteria, diagnostic metagenomics, biocides, and monitoring in industrial cooling/water circuits.",
    topics: ["Biofilm Kinetics & SRB", "Genomic & Molecular Diagnostics", "Biocide Selection & Dosing", "MIC in Pipeline Networks", "Mitigation Case Studies"]
  },
  {
    id: 3,
    code: "SYM-03",
    title: "Corrosion in Concrete Structures & Infrastructure Assets",
    category: "Industry",
    icon: "Building2",
    description: "Rebar corrosion mechanisms, chloride ingress, carbonation, cathodic protection of reinforced concrete, self-healing cements, and bridges/civil infrastructure durability.",
    topics: ["Chloride & Carbonation Ingress", "Rebar Corrosion & Sensors", "Cathodic Protection for Concrete", "Corrosion Resistant Rebars", "Bridge & Wharf Life Extension"]
  },
  {
    id: 4,
    code: "SYM-04",
    title: "Corrosion Under Insulation (CUI)",
    category: "Industry",
    icon: "Flame",
    description: "Insulation barrier failures, moisture ingress detection, non-destructive testing (NDT), risk-based CUI screening, thermal insulation coatings, and petrochemical plant strategies.",
    topics: ["CUI Mechanism & Thermal Cycling", "Advanced NDT for CUI (PEC, Guided Wave)", "Aerogel & Hydrophobic Insulation", "Protective Barrier Coatings", "Risk-Based CUI Inspection (RBI)"]
  },
  {
    id: 5,
    code: "SYM-05",
    title: "Corrosion in Oil, Gas, Petrochemical & Refinery Industries",
    category: "Industry",
    icon: "Fuel",
    description: "Sour service (H2S/CO2) cracking, naphthenic acid corrosion, amine unit degradation, crude unit overhead corrosion, pipeline integrity, and top-of-line corrosion.",
    topics: ["Sour Service H2S/CO2 Cracking", "Refinery Overhead Systems", "Naphthenic Acid & High Temp Sulfidation", "Pipeline Integrity Management", "Downhole Tubing & Casing"]
  },
  {
    id: 6,
    code: "SYM-06",
    title: "Corrosion in Ships, Offshore Facilities & Marine Structures",
    category: "Industry",
    icon: "Ship",
    description: "Deep sea subsea assets, offshore platforms, splash zone protection, ballast tank corrosion, antifouling technologies, cavitation, and marine atmospheric degradation.",
    topics: ["Offshore Wind & Platform Splash Zones", "Ballast Tank & Hull Coatings", "Subsea Production Systems", "Biofouling & Antifouling Systems", "Cavitation & Flow Accelerated Corrosion"]
  },
  {
    id: 7,
    code: "SYM-07",
    title: "Corrosion in Defence Sector & Power Plant",
    category: "Industry",
    icon: "ShieldAlert",
    description: "Thermal, nuclear, and hydro power plant boiler tube corrosion, supercritical steam degradation, defence aerospace & naval vessel preservation, and ordnance storage protection.",
    topics: ["Boiler Water Chemistry & FAC", "Supercritical Steam Systems", "Nuclear Plant Stress Corrosion", "Naval Fleet Materials Preservation", "Aerospace High-Altitude Alloys"]
  },
  {
    id: 8,
    code: "SYM-08",
    title: "Advanced Alloys & Corrosion-Resistant Materials",
    category: "Science",
    icon: "Layers",
    description: "Duplex & super duplex stainless steels, nickel-based superalloys, titanium & zirconium alloys, high-entropy alloys (HEAs), and additive manufactured corrosion performance.",
    topics: ["Duplex & Super Duplex Steels", "Nickel & Cobalt Superalloys", "High Entropy Alloys (HEA)", "Additive Manufactured Alloys", "Phase Stability & Passivity"]
  },
  {
    id: 9,
    code: "SYM-09",
    title: "Industrial Coatings, Linings & Cladding Technologies",
    category: "Technology",
    icon: "Paintbrush",
    description: "High-performance epoxy, polyurethane, fluoropolymer coatings, thermal spray cladding, laser cladding, weld overlays, rubber lining, and surface preparation standards.",
    topics: ["Fusion Bonded Epoxy (FBE) & 3LPE", "Thermal Spray Aluminum (TSA)", "Laser Cladding & Weld Overlays", "Surface Preparation & SSPC/NACE Standards", "High-Build Ceramic Linings"]
  },
  {
    id: 10,
    code: "SYM-10",
    title: "Cathodic & Anodic Protection Systems",
    category: "Technology",
    icon: "Zap",
    description: "Impressed Current Cathodic Protection (ICCP), sacrificial anode design, deep well groundbeds, AC/DC interference mitigation, pipeline surveys (CIPS/DCVG), and CP automation.",
    topics: ["ICCP System Optimization", "Sacrificial Anode Metallurgy", "Stray Current & AC Interference", "CIPS & DCVG Field Diagnostics", "Anodic Protection of Chemical Vessels"]
  },
  {
    id: 11,
    code: "SYM-11",
    title: "Corrosion Monitoring, Sensors & Electrochemical Testing",
    category: "Technology",
    icon: "Activity",
    description: "Electrochemical Impedance Spectroscopy (EIS), Linear Polarization Resistance (LPR), Electrical Resistance (ER) probes, acoustic emission, wireless IoT smart sensors.",
    topics: ["Real-Time LPR & ER Probes", "EIS & Harmonic Distortion Analysis", "Electrochemical Noise (ENM)", "Wireless Autonomous IoT Sensors", "Field Portable Electrochemical Kits"]
  },
  {
    id: 12,
    code: "SYM-12",
    title: "Asset Integrity Management Systems",
    category: "Technology",
    icon: "ShieldCheck",
    description: "Risk-Based Inspection (RBI per API 580/581), Fitness-For-Service (FFS per API 579), remaining life assessment (RLA), degradation modeling, and digital asset lifecycle systems.",
    topics: ["API 580/581 RBI Implementation", "API 579 Fitness-For-Service (FFS)", "Remaining Life Assessment (RLA)", "Failure Analysis & Root Cause Determination", "Corrosion Management Frameworks"]
  },
  {
    id: 13,
    code: "SYM-13",
    title: "Digitalization, Industry 4.0 & AI in Corrosion Control",
    category: "Digital & AI",
    icon: "Cpu",
    description: "Predictive machine learning models, physics-informed neural networks (PINNs) for corrosion rate prediction, digital twins for process plants, automated image recognition of rust.",
    topics: ["Machine Learning Corrosion Predictors", "Plant Digital Twins with Real-time Feeds", "AI Vision for Visual Rust Severity", "Cloud-Based Asset Health Dashboards", "Big Data Analytics in Pipeline Networks"]
  },
  {
    id: 14,
    code: "SYM-14",
    title: "New Trends, Innovations & Emerging Technologies",
    category: "Technology",
    icon: "Sparkles",
    description: "Graphene & 2D nanomaterial coatings, microencapsulated self-healing polymers, green hydrogen infrastructure embrittlement, CCUS corrosion, and next-generation solutions.",
    topics: ["Graphene & 2D Nanocoatings", "Microcapsule Self-Healing Systems", "Hydrogen Embrittlement in H2 Economy", "CO2 Capture & Storage (CCUS) Corrosion", "Smart Stimuli-Responsive Coatings"]
  }
];

export const SPEAKERS: Speaker[] = [
  {
    id: "spk-1",
    name: "Dr. Sunil Kahar",
    designation: "Chair, AMPP Gujarat Chapter & Chairman, IIM Baroda",
    organization: "The M.S. University of Baroda",
    role: "Conference Chairman",
    category: "Keynote",
    initials: "SK",
    color: "bg-red-700 text-white",
    bio: "Renowned metallurgist and academician with 20+ years of pioneering research in corrosion kinetics, surface engineering, and metallurgy at The Maharaja Sayajirao University of Baroda.",
    symposium: "Advanced Alloys & Corrosion Science"
  },
  {
    id: "spk-2",
    name: "Mr. Zuber Khan",
    designation: "Vice Chair, AMPP Gujarat Chapter",
    organization: "Linde Engineering India Pvt. Ltd. / Consulttech",
    role: "Vice Chairman & Industrial Chair",
    category: "Keynote",
    initials: "ZK",
    color: "bg-teal-700 text-white",
    bio: "Managing Director at Consulttech and senior engineering leader at Linde Engineering, specializing in cryogenic gas infrastructure, process piping, and industrial integrity.",
    symposium: "Oil, Gas & Petrochemical Corrosion"
  },
  {
    id: "spk-3",
    name: "Mr. Hiren Panchal",
    designation: "Secretary, AMPP Gujarat Chapter & IIM Baroda",
    organization: "Linde Engineering India Pvt. Ltd. / Comp. Services",
    role: "Organizing Secretary",
    category: "Keynote",
    initials: "HP",
    color: "bg-blue-800 text-white",
    bio: "Distinguished AGM with extensive background in plant integrity, corrosion control programs, and cross-chapter international metallurgy cooperation.",
    symposium: "Asset Integrity Management Systems"
  },
  {
    id: "spk-4",
    name: "Mr. Paresh Haribhakti",
    designation: "Managing Director & Member Delegate",
    organization: "TCR Advanced Engineering Pvt. Ltd.",
    role: "Plenary Speaker",
    category: "Plenary",
    initials: "PH",
    color: "bg-amber-700 text-white",
    bio: "Leading failure analyst and industrial investigator who has directed hundreds of forensic evaluations across refineries, offshore rigs, and chemical plants globally.",
    symposium: "Failure Analysis & NDT Inspection"
  },
  {
    id: "spk-5",
    name: "Mr. Dhruv Pandya",
    designation: "Treasurer, AMPP Gujarat Chapter",
    organization: "Founder & MD, Intuitive Research & Development Pvt Ltd",
    role: "Technical Speaker",
    category: "Technical",
    initials: "DP",
    color: "bg-rose-700 text-white",
    bio: "Expert in protective coatings application, blast cleaning robotics, and specialized fluoropolymer linings for severe chemical duty.",
    symposium: "Industrial Coatings, Linings & Cladding"
  },
  {
    id: "spk-6",
    name: "Mr. Rajkumar Kashyap",
    designation: "Member at Large, AMPP Gujarat Chapter",
    organization: "General Manager, Heeru Groups",
    role: "Industrial Speaker",
    category: "Invited",
    initials: "RK",
    color: "bg-slate-800 text-white",
    bio: "Senior leader overseeing specialty chemicals, corrosion inhibitors, and protective formulations for heavy industrial facilities.",
    symposium: "Corrosion & Inhibitors"
  },
  {
    id: "spk-7",
    name: "Dr. Sucheta Juneja",
    designation: "Head - Quality Control Laboratory",
    organization: "Industrial Quality Testing Council",
    role: "Invited Speaker",
    category: "Invited",
    initials: "SJ",
    color: "bg-purple-800 text-white",
    bio: "Specialist in materials qualification, metallurgical testing protocols, and electrochemical characterization for high-stress industrial applications.",
    symposium: "Corrosion Monitoring & Electrochemical Testing"
  },
  {
    id: "spk-8",
    name: "Dr. Rinky Singh",
    designation: "Application Scientist & Director",
    organization: "RII Innovation UK Ltd. / Jindal Saw Ltd.",
    role: "International Keynote",
    category: "Keynote",
    initials: "RS",
    color: "bg-emerald-800 text-white",
    bio: "International authority on tubular pipeline coating technologies, cathodic delamination prevention, and advanced polymers.",
    symposium: "Industrial Coatings & Cladding"
  },
  {
    id: "spk-9",
    name: "Mr. Harsh Zala",
    designation: "Materials & Corrosion Digital Consultant",
    organization: "Wood Plc",
    role: "Invited Speaker",
    category: "Invited",
    initials: "HZ",
    color: "bg-sky-800 text-white",
    bio: "Digitalization thought leader developing AI-driven corrosion rate prediction models and digital twins for upstream and downstream energy infrastructure.",
    symposium: "Digitalization & AI in Corrosion Control"
  }
];

export const REGISTRATION_TIERS: RegistrationTier[] = [
  {
    id: "tier-member",
    name: "IIM Members / AMPP Members",
    basePrice: 4000,
    gstRate: 18,
    gstAmount: 720,
    totalPrice: 4720,
    description: "Discounted delegate pass for verified members of AMPP (Global or Gujarat Chapter) and Indian Institute of Metals (IIM).",
    features: [
      "Access to all 14 Technical Symposia & Keynote Sessions",
      "Full 3-Day Admission to Technology Exhibition",
      "Official Conference Kit, Program Guide & Souvenir",
      "Networking Lunches, Tea/Coffee & Welcome Reception",
      "Digital Conference Proceedings & Certificate with QR Verification",
      "Exclusive IIM / AMPP Delegate Badge"
    ]
  },
  {
    id: "tier-non-member",
    name: "Non-IIM Member / Non-AMPP Member",
    basePrice: 6500,
    gstRate: 18,
    gstAmount: 1170,
    totalPrice: 7670,
    popular: true,
    description: "Standard delegate pass for industry professionals, engineers, plant owners, consultants, and non-member attendees.",
    features: [
      "Full Access to all 14 Technical Symposia & Keynote Sessions",
      "Full 3-Day Admission to Technology Exhibition",
      "Official Conference Kit, Program Guide & Souvenir",
      "Daily Networking Lunches, High-Tea & Welcome Dinner",
      "Digital Conference Proceedings & Certificate of Attendance",
      "Access to B2B Networking Lounge & Exhibitor Directory",
      "Complimentary AMPP Gujarat Chapter Membership Consultation"
    ]
  },
  {
    id: "tier-student",
    name: "Students / Research Scholars",
    basePrice: 1500,
    gstRate: 18,
    gstAmount: 270,
    totalPrice: 1770,
    description: "Subsidized pass for full-time undergraduate, postgraduate students and PhD research scholars with valid student ID.",
    features: [
      "Access to all Technical Symposia & Student Paper Competitions",
      "Full 3-Day Admission to Technology Exhibition",
      "Official Conference Kit & Digital Abstract Book",
      "Daily Refreshments & Networking Lunch",
      "Digital Certificate of Participation with QR Verification",
      "Opportunity for Student Career Mentorship & Interaction"
    ]
  }
];

export const SPONSORSHIP_PACKAGES: SponsorshipPackage[] = [
  {
    id: "sponsor-diamond",
    tier: "Diamond",
    priceINR: 500000,
    priceFormatted: "₹5,00,000",
    color: "#7c3aed",
    bgGradient: "from-purple-50 to-indigo-50 border-purple-200",
    delegates: 8,
    features: [
      "08 Delegates Complimentary Full Conference Registration",
      "Prominent Company Logo visible on panel of main hall backdrop",
      "Company Logo display prominently on Conference Website & Venue Entrance",
      "One full-page color advertisement in the Conference Souvenir Book",
      "One full-page Company Profile featured in the Souvenir",
      "Prestigious Diamond Sponsor Trophy / Memento presented at Inauguration",
      "Top billing across all marketing emails, press releases & delegate kits"
    ]
  },
  {
    id: "sponsor-gold",
    tier: "Gold",
    priceINR: 400000,
    priceFormatted: "₹4,00,000",
    color: "#d97706",
    bgGradient: "from-amber-50 to-yellow-50 border-amber-300",
    popular: true,
    delegates: 6,
    features: [
      "06 Delegates Complimentary Full Conference Registration",
      "Company Logo visible on panel of backdrop in main hall",
      "Company Logo display on Website & Conference Venue signage",
      "One full-page Advertisement in the Conference Souvenir",
      "One full-page Company Profile in the Souvenir",
      "Gold Sponsor Memento presented during opening ceremony",
      "Brand inclusion in all delegate welcome binders"
    ]
  },
  {
    id: "sponsor-silver",
    tier: "Silver",
    priceINR: 300000,
    priceFormatted: "₹3,00,000",
    color: "#475569",
    bgGradient: "from-slate-50 to-gray-50 border-slate-300",
    delegates: 4,
    features: [
      "04 Delegates Complimentary Full Conference Registration",
      "Company Logo on backdrop panel & conference venue signs",
      "Company Logo display on Website & Technical Program booklet",
      "One full-page Advertisement in The Souvenir Book",
      "One full-page Company Profile in the Souvenir",
      "Product Commercial Presentation slot – 10 minutes",
      "Silver Sponsor Commemorative Memento"
    ]
  },
  {
    id: "sponsor-bronze",
    tier: "Bronze",
    priceINR: 100000,
    priceFormatted: "₹1,00,000",
    color: "#c2410c",
    bgGradient: "from-orange-50 to-red-50 border-orange-200",
    delegates: 3,
    features: [
      "03 Delegates Complimentary Full Conference Registration",
      "Company Logo on venue backdrop & conference banner",
      "Company Logo display on Website & Digital Screens",
      "One full-page Advertisement in the Souvenir",
      "One full-page Company Profile in the Souvenir",
      "Bronze Sponsor Memento"
    ]
  },
  {
    id: "sponsor-tea-coffee",
    tier: "Tea/Coffee",
    priceINR: 50000,
    priceFormatted: "₹50,000",
    color: "#059669",
    bgGradient: "from-emerald-50 to-teal-50 border-emerald-200",
    delegates: 2,
    features: [
      "02 Delegates Complimentary Full Conference Registration",
      "Company Logo display at all Networking Tea/Coffee Refreshment Lounges",
      "Company Logo on Conference Website & Digital Program",
      "Half-page color Advertisement in the Souvenir Book",
      "Official Recognition during session breaks"
    ]
  }
];

export const ADVERTISEMENT_RATES: AdvertisementRate[] = [
  {
    type: "Souvenir Cover",
    category: "Souvenir Back Cover (Color)",
    rateINR: 100000,
    rateFormatted: "₹1,00,000",
    dimensions: "8.23\" (w) × 11.75\" (h) with 0.25\" bleed"
  },
  {
    type: "Souvenir Cover",
    category: "Souvenir Inner Front/Back Cover (Color)",
    rateINR: 50000,
    rateFormatted: "₹50,000",
    dimensions: "8.23\" (w) × 11.75\" (h) with 0.25\" bleed"
  },
  {
    type: "Inside Pages",
    category: "Full Page Color",
    rateINR: 20000,
    rateFormatted: "₹20,000",
    dimensions: "7.25\" (w) × 10.15\" (h) non-bleed"
  },
  {
    type: "Inside Pages",
    category: "Half Page Color",
    rateINR: 10000,
    rateFormatted: "₹10,000",
    dimensions: "7.25\" (w) × 4.90\" (h) horizontal"
  }
];

export const PAST_SUPPORTERS = [
  { name: "Consultech Group of Companies", category: "Corrosion Engineering Solutions", tag: "CONSULTECH", logo: "/images/ampp/consultech.png" },
  { name: "ARYA Industrial Solutions", category: "Surface Protection & Coatings", tag: "ARYA", logo: "/images/ampp/arya.png" },
  { name: "TechnoCrat Solutions", category: "Coating Systems & Inspection", tag: "TECHNOCRAT", logo: "/images/ampp/technocrat.png" },
  { name: "Ujas Industrial Engineering (UE)", category: "Engineering Services", tag: "UE", logo: "/images/ampp/ujas.png" },
  { name: "Advance Electronic Solutions", category: "Cathodic Protection Instrumentation", tag: "ADVANCE ELEC", logo: "/images/ampp/advance-electronic.png" },
  { name: "Corrpro Technologies", category: "Corrosion Control & Engineering", tag: "CORRPRO", logo: "/images/ampp/corrpro.png" },
  { name: "GAIL (India) Limited", category: "Public Sector Undertaking / Gas Infrastructure", tag: "GAIL" },
  { name: "DEHN India", category: "Surge & Lightning Protection", tag: "DEHN" },
  { name: "TCR Advanced Engineering", category: "Materials Testing & Failure Analysis", tag: "TCR ADVANCED" },
  { name: "L&T Heavy Engineering", category: "Heavy Industrial & Reactor Fabrication", tag: "L&T HEAVY ENG" },
  { name: "Mett-Bio Metallurgical Testing & Services", category: "Testing & Certification", tag: "METT-BIO" },
  { name: "Heeru Groups", category: "Specialty Industrial Chemicals", tag: "HEERU" },
  { name: "Industrial NDT", category: "Non-Destructive Testing Services", tag: "INDUSTRIAL NDT" },
  { name: "AMCHEM Products Pvt. Ltd.", category: "Polyurethane Coatings & Linings", tag: "AMCHEM" },
  { name: "Tough Coatings", category: "Moisture Cure Polyurethane", tag: "TOUGH COATINGS" },
  { name: "Techcellent", category: "Corrosion Consulting & Asset Integrity", tag: "TECHCELLENT" },
  { name: "CorraXperts", category: "Corrosion Diagnostics & Training", tag: "CORRAXPERTS" },
  { name: "Outokumpu", category: "High Performance Stainless Steels", tag: "OUTOKUMPU" },
  { name: "Reliable Paints", category: "Protective & Marine Paints", tag: "RELIABLE PAINTS" },
  { name: "Modsonic", category: "Ultrasonic NDT Equipment (Since 1987)", tag: "MODSONIC" },
  { name: "Caltech India", category: "Corrosion & Coating Test Instruments", tag: "CALTECH" }
];

export const COMMITTEE_MEMBERS = {
  amppLeadership: [
    { 
      name: "Dr. Sunil Kahar", 
      role: "Chair, AMPP Gujarat Chapter", 
      org: "Assistant Professor, Dept. of Metallurgical & Materials Engg., FTE, The M.S. University of Baroda",
      photo: "/images/ampp/Dr-sunil-Kahar.jpg"
    },
    { 
      name: "Mr. Zuber Khan", 
      role: "Vice Chair, AMPP Gujarat Chapter", 
      org: "Managing Director, Consulttech / Linde Engineering India Pvt. Ltd.",
      photo: "/images/ampp/ZuberKhan.jpg"
    },
    { 
      name: "Mr. Hiren Panchal", 
      role: "Secretary, AMPP Gujarat Chapter", 
      org: "AGM, Linde Engineering India Pvt. Ltd. / Comp. Services",
      photo: "/images/ampp/HirenPanchal.jpg"
    },
    { 
      name: "Mr. Dhruv Pandya", 
      role: "Treasurer, AMPP Gujarat Chapter", 
      org: "Founder & MD, Intuitive Research & Development Pvt Ltd",
      photo: "/images/ampp/DhruvPandya.jpg"
    },
    { 
      name: "Mr. Paresh Haribhakti", 
      role: "Member Delegate, AMPP Gujarat Chapter", 
      org: "Managing Director, TCR Advanced Engineering Pvt. Ltd.",
      photo: "/images/ampp/PareshHaribhakti.jpg"
    },
    { 
      name: "Mr. Rajkumar Kashyap", 
      role: "Member at Large, AMPP Gujarat Chapter", 
      org: "General Manager, Heeru Groups",
      photo: "/images/ampp/rajkumar-kashyap.jpg"
    }
  ],
  executiveCommittee: [
    { name: "Mr. Sumit Kainthola", role: "ECC Member", org: "Director, Industrial NDT" },
    { name: "Mr. Digant Joshi", role: "ECC Member", org: "MD, Tough Coating" },
    { name: "Mr. Arun Gajera", role: "ECC Member", org: "MD, Mett Bio Pvt. Ltd." },
    { name: "Mr. Viral Patel", role: "ECC Member", org: "Consultant – Intigrated Corrosion and Coating Consultants" },
    { name: "Dr. Sucheta Juneja", role: "ECC Member", org: "Head – Quality Control Laboratory" },
    { name: "Dr. Rinky Singh", role: "ECC Member", org: "Application Scientist & Director, RII Innovation UK Ltd." },
    { name: "Mr. Harsh Zala", role: "ECC Member", org: "Materials & Corrosion Digital Consultant, Wood Plc" },
    { name: "Mr. Chiral Patel", role: "ECC Member", org: "Head BD Pipeline Integrity & Cathodic Protection, TCR Advanced" },
    { name: "Mr. Deepak Chandrakant Maru", role: "ECC Member", org: "Proprietor, Technocrat Solutions" },
    { name: "Dr. Daulat Sharma", role: "ECC Member", org: "Associate Professor, GEC Gandhinagar" },
    { name: "Mr. Sarang Bhonde", role: "ECC Member", org: "Quality Assurance & System Leader, GE Vernova" },
    { name: "Dr. Yakshil Chokshi", role: "ECC Member", org: "Lecturer – Metallurgy, GEC Rajkot" },
    { name: "Dr. Mandar Joshi", role: "ECC Member", org: "Lecturer – Metallurgy, GEC Surat" },
    { name: "Mr. Susanta Ghosh", role: "ECC Member", org: "Work Manager, Modern Rolls & Eng. Pvt. Ltd." }
  ],
  iimLeadership: [
    { name: "Dr. Sunil Kahar", role: "Chairman, IIM Baroda Chapter", org: "Asst. Professor, MS University of Baroda", photo: "/images/ampp/Dr-sunil-Kahar.jpg" },
    { name: "Mr. Sumit Kainthola", role: "Vice Chairman, IIM Baroda Chapter", org: "Director, Industrial NDT" },
    { name: "Mr. Hiren Panchal", role: "Secretary, IIM Baroda Chapter", org: "AGM, Linde Engineering India Pvt. Ltd.", photo: "/images/ampp/HirenPanchal.jpg" },
    { name: "Dr. Krunal Patel", role: "Treasurer, IIM Baroda Chapter", org: "Senior Manager (Metallurgy), GSFC Ltd." },
    { name: "Mr. Siddhesh Jambekar", role: "Joint Secretary, IIM Baroda Chapter", org: "Temp. Asst. Professor, Met. & Mats. Engg. Dept., MSU" },
    { name: "Mrs. Vaishnavi Sangamnekar", role: "Joint Secretary (Office of Chairman), IIM Baroda", org: "Sr. Quality Engineer, ABB India Ltd." }
  ]
};

export const INITIAL_BOOTHS: ExhibitorBooth[] = [
  { id: "b1", boothNumber: "A-01", size: "18 sqm (Island)", dimensions: "6m × 3m", priceINR: 225000, status: "Reserved", companyName: "TCR Advanced" },
  { id: "b2", boothNumber: "A-02", size: "9 sqm (Standard)", dimensions: "3m × 3m", priceINR: 120000, status: "Booked", companyName: "Consultech" },
  { id: "b3", boothNumber: "A-03", size: "9 sqm (Standard)", dimensions: "3m × 3m", priceINR: 120000, status: "Available" },
  { id: "b4", boothNumber: "A-04", size: "9 sqm (Standard)", dimensions: "3m × 3m", priceINR: 120000, status: "Available" },
  { id: "b5", boothNumber: "B-01", size: "18 sqm (Corner)", dimensions: "6m × 3m", priceINR: 240000, status: "Booked", companyName: "DEHN India" },
  { id: "b6", boothNumber: "B-02", size: "9 sqm (Standard)", dimensions: "3m × 3m", priceINR: 120000, status: "Available" },
  { id: "b7", boothNumber: "B-03", size: "9 sqm (Standard)", dimensions: "3m × 3m", priceINR: 120000, status: "Available" },
  { id: "b8", boothNumber: "B-04", size: "9 sqm (Standard)", dimensions: "3m × 3m", priceINR: 120000, status: "Available" },
  { id: "b9", boothNumber: "C-01", size: "9 sqm (Corner)", dimensions: "3m × 3m", priceINR: 135000, status: "Available" },
  { id: "b10", boothNumber: "C-02", size: "9 sqm (Standard)", dimensions: "3m × 3m", priceINR: 120000, status: "Booked", companyName: "Modsonic" },
  { id: "b11", boothNumber: "C-03", size: "9 sqm (Standard)", dimensions: "3m × 3m", priceINR: 120000, status: "Available" },
  { id: "b12", boothNumber: "C-04", size: "18 sqm (Premium)", dimensions: "6m × 3m", priceINR: 250000, status: "Available" }
];

export const AWARDS: AwardCategory[] = [
  {
    id: "award-1",
    title: "GUJCORR Lifetime Achievement in Corrosion Science",
    description: "Recognizing visionary scientists and engineers whose lifelong dedication has fundamentally advanced materials protection and corrosion control in India and globally.",
    eligibility: "Senior researchers/industrialists with 25+ years of demonstrable contributions.",
    deadline: "15th November 2026"
  },
  {
    id: "award-2",
    title: "Young Corrosion Scientist & Innovator Award 2027",
    description: "Awarded to promising researchers under the age of 38 who have published high-impact discoveries in corrosion mechanisms, green inhibitors, or electrochemical technologies.",
    eligibility: "Age <= 38 years as of 31 Dec 2026. Peer-reviewed publication record required.",
    deadline: "15th November 2026"
  },
  {
    id: "award-3",
    title: "Industrial Corrosion Mitigation Excellence Trophy",
    description: "Honoring asset owner corporations or EPC contractors who achieved exemplary asset life-extension and zero-loss integrity records through innovative corrosion management.",
    eligibility: "Open to plant operators, refineries, power plants, offshore operators & EPCs.",
    deadline: "15th November 2026"
  },
  {
    id: "award-4",
    title: "Best Student Technical Paper & Poster Award",
    description: "Prestigious cash award and citation for outstanding original research presented by student delegates during the GUJCORR 2027 symposia.",
    eligibility: "Registered full-time student delegates presenting an oral or poster paper.",
    deadline: "Evaluated live during conference"
  }
];
