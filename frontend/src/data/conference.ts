import { 
  Symposium, 
  Speaker, 
  RegistrationTier, 
  SponsorshipPackage, 
  AdvertisementRate,
  ExhibitorBooth,
  ExhibitorPackage,
  CommitteeMember,
  AdvisoryMember,
  ImportantDateItem,
  AwardCategory
} from '../types';

/**
 * =========================================================================
 * GUJCORR 2027 — CENTRAL SOURCE OF TRUTH
 * All pages and components consume content directly from this module.
 * Based on the Official Brochure (www.gujcorr.org).
 * =========================================================================
 */

export const CONFERENCE_INFO = {
  name: "GUJCORR 2027",
  fullName: "AMPP Gujarat Global Conference & Expo on Corrosion (GUJCORR 2027)",
  tagline: "Stronger Together: Uniting the Global fight against Corrosion",
  subtitle: "India's Premier Corrosion Conference & Expo in Gujarat",
  edition: "India's Premier Corrosion Conference & Expo in Gujarat",
  dates: "18–20 February 2027",
  startDate: "2027-02-18T09:00:00+05:30",
  endDate: "2027-02-20T18:00:00+05:30",
  venueCity: "Vadodara, Gujarat",
  venueCountry: "India",
  venue: "Vadodara, Gujarat, India",
  venueAddress: "Vadodara, Gujarat, India",
  siteUrl: "https://www.gujcorr.org",
  domain: "www.gujcorr.org",
  
  // Organizers hierarchy
  organizedBy: "AMPP Gujarat Chapter",
  knowledgePartner: "The Maharaja Sayajirao University of Baroda",
  coOrganizer: "The Indian Institute of Metals (IIM), Baroda Chapter",

  // Theme & Vision
  theme: "Stronger Together: Uniting the Global fight against Corrosion",
  motto: "A Safer, Protected, and Sustainable World",
  vision: "A world built and protected with safe, reliable, sustainable materials.",
  mission: "Advancing materials performance to protect society, assets, and the environment through technical standards, workforce credentialing, and global collaboration.",

  // Exact About Content from Official Brochure
  about: {
    overview: "GUJCORR 2027 is envisioned as India's premier international conference and exhibition dedicated to corrosion science, corrosion engineering, materials performance, asset integrity, and emerging technologies. Hosted in Gujarat, it brings together experts from academia, research institutions, public and private sector organizations, defence establishments, asset owners, EPC companies, technology providers, consultants, manufacturers, and corrosion professionals worldwide.",
    technicalPlatform: "Corrosion mechanisms, materials degradation, failure analysis, corrosion monitoring, materials selection, protective coatings and linings, cathodic protection, inspection technologies, integrity assessment.",
    focusSectors: [
      "Oil & gas",
      "Petrochemicals",
      "Refineries",
      "Power generation",
      "Chemical processing",
      "Infrastructure",
      "Transportation",
      "Marine",
      "Defence",
      "Water systems",
      "Renewable energy"
    ],
    format: "Keynote lectures, peer-reviewed technical presentations, industry case studies, expert panels, tutorials, workshops, technology exhibition.",
    aim: "Advance corrosion science and practice, improve asset reliability and safety, optimize life-cycle costs, support resilient and sustainable infrastructure worldwide."
  },

  chairmansMessage: {
    title: "Message from the Conference Chairman",
    chairName: "Dr. Sunil Kahar",
    chairRole: "Chairman, GUJCORR 2027 & Asst. Professor, The M.S. University of Baroda",
    chairAffiliation: "Department of Metallurgical & Materials Engineering, Faculty of Tech. & Engg., The Maharaja Sayajirao University of Baroda, Vadodara",
    photo: "/images/ampp/Dr-sunil-Kahar.jpg",
    content: [
      "It is an honor and privilege to welcome you to GUJCORR 2027, organized by the dynamic AMPP Gujarat Chapter in collaboration with the historic Indian Institute of Metals Baroda Chapter.",
      "The AMPP Gujarat Chapter was established on September 19, 2024, and has been officially recognized as part of AMPP's global framework. Located in one of India's leading industrial regions, Gujarat is a powerhouse of manufacturing — home to thriving chemical, petrochemical, refinery, pipeline, and heavy engineering complexes.",
      "Corrosion continues to be a critical challenge globally — causing catastrophic damage to infrastructure, posing severe risks to public safety, and affecting operational efficiency and product quality. The global cost of corrosion is estimated at US$2.5 trillion, approximately 3.4% of global GDP. Effective corrosion management strategies can reduce these costs by up to 50% while extending asset service life.",
      "Our mission at GUJCORR 2027 is to promote the understanding and application of cutting-edge corrosion control techniques, protective coatings, cathodic protection, and digital asset integrity across industries, academia, and research institutions. Let us move forward together: Stronger Together: Uniting the Global fight against Corrosion."
    ]
  },

  organizers: [
    {
      name: "AMPP: The Association for Materials Protection & Performance",
      tagline: "A Safer, Protected, and Sustainable World",
      role: "Global Parent Body",
      description: "The largest global community of corrosion and protective coatings professionals. Provides education and credentialing, company accreditation, technological innovation, and global standardization across 130+ nations.",
      website: "https://www.ampp.org",
      logo: "/images/ampp/Logo.png"
    },
    {
      name: "AMPP Gujarat Chapter",
      role: "Organizer",
      established: "19 September 2024",
      description: "Established on 19 September 2024, officially part of AMPP's global framework. Dedicated to promoting corrosion awareness, protection, and control. Primary focus covers Gujarat, Rajasthan, and parts of Maharashtra. Gujarat is India's prime manufacturing hub (chemical, petrochemical, refinery, engineering). Offers specialized corrosion-control training and fosters national and international knowledge sharing.",
      website: "https://www.amppgujarat.org",
      logo: "/images/ampp/Logo.png"
    },
    {
      name: "The Indian Institute of Metals (IIM), Baroda Chapter",
      role: "Co-organizer",
      established: "1971",
      description: "One of the oldest IIM chapters, established in 1971 at the Metallurgical & Materials Engineering Dept, Faculty of Tech. & Engg, The M S University of Baroda, Vadodara. Promotes and advances the science and technology of metals and alloys; protects interests of metallurgists and metallurgical industry. Organizes conferences, research activities, publications, and qualifying exams run largely through honorary services of office-bearers and members.",
      website: "https://www.iimbaroda.com"
    },
    {
      name: "The Maharaja Sayajirao University of Baroda",
      role: "Knowledge Partner",
      description: "Department of Metallurgical & Materials Engineering, Faculty of Technology & Engineering, Kalabhavan Campus, Vadodara, Gujarat – 390001.",
      website: "https://www.msubaroda.ac.in"
    }
  ],

  bankDetails: {
    bankName: "Union Bank of India",
    branch: "Dandia Bazar branch, Vadodara-390001",
    accountName: "Indian Institute of Metals",
    accountNumber: "520101234030441",
    ifscCode: "UBIN0901555",
    micrCode: "390026037",
    qrCodeImage: "/images/payment-qr.jpg"
  },

  contact: {
    secretary: "Mr. Hiren Panchal",
    phone: "+91 9988881674",
    phoneDisplay: "+91 99888 81674",
    emailTechnical: "iim.barodachapter@gmail.com",
    emailRegistration: "iim.barodachapter@gmail.com",
    emailGeneral: "iim.barodachapter@gmail.com",
    postalAddress: "Department of Metallurgical & Materials Engineering, Faculty of Technology & Engineering, The M.S. University of Baroda, Vadodara – 390001, Gujarat, India."
  }
};

/**
 * =========================================================================
 * IMPORTANT DATES & DYNAMIC STATUS COMPUTATION
 * =========================================================================
 */
export const IMPORTANT_DATES: ImportantDateItem[] = [
  {
    id: 1,
    title: "Abstract Submission Due",
    date: "11 October 2026",
    rawDate: "2026-10-11",
    category: "Call for Papers",
    description: "Upload 200–250 word structured abstract via the website portal.",
    notes: "Abstracts are uploaded via the website. The presenting author must register as a delegate for the paper to be included in the technical program."
  },
  {
    id: 2,
    title: "Full Text Paper Due",
    date: "30 October 2026",
    rawDate: "2026-10-30",
    category: "Manuscript",
    description: "Complete full-length peer-reviewed technical paper manuscript submission.",
    notes: "Peer review feedback and formal acceptance notices issued upon technical review."
  },
  {
    id: 3,
    title: "Presentation Submission / Upload Due",
    date: "15 November 2026",
    rawDate: "2026-11-15",
    category: "Presentation",
    description: "PowerPoint slide deck / poster presentation upload for accepted papers.",
    notes: "Formats: PPTX / PDF for oral presentation sessions and poster display panels."
  },
  {
    id: 4,
    title: "Registration Deadline for Authors",
    date: "15 December 2026",
    rawDate: "2026-12-15",
    category: "Registration",
    description: "Mandatory delegate registration for presenting authors to be in the program.",
    notes: "The presenting author must register as a delegate for the paper to be included in the technical program."
  },
  {
    id: 5,
    title: "GUJCORR 2027 Conference & Expo",
    date: "18–20 February 2027",
    rawDate: "2027-02-18",
    category: "Event",
    description: "Three-day global conference & exhibition hosted in Vadodara, Gujarat.",
    notes: "Inauguration, 14 Technical Sessions, Technology Expo, Awards Gala & Networking Dinners."
  }
];

/**
 * Computes dynamic status badge based on current date
 * (Open / Closing soon / Closed)
 */
export function getDateStatusBadge(rawDate: string): {
  status: 'Open' | 'Closing soon' | 'Closed';
  daysLeft: number;
  badgeClass: string;
  dotColor: string;
} {
  const now = new Date();
  const target = new Date(rawDate + 'T23:59:59+05:30');
  const diffMs = target.getTime() - now.getTime();
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) {
    return {
      status: 'Closed',
      daysLeft: 0,
      badgeClass: 'bg-slate-100 text-slate-600 border border-slate-300',
      dotColor: 'bg-slate-400'
    };
  } else if (daysLeft <= 14) {
    return {
      status: 'Closing soon',
      daysLeft,
      badgeClass: 'bg-amber-100 text-amber-900 border border-amber-300 font-bold',
      dotColor: 'bg-amber-500 animate-pulse'
    };
  } else {
    return {
      status: 'Open',
      daysLeft,
      badgeClass: 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold',
      dotColor: 'bg-emerald-500 animate-pulse'
    };
  }
}

/**
 * =========================================================================
 * 14 TECHNICAL SESSIONS (EXACT LIST FROM BROCHURE)
 * =========================================================================
 */
export const TECHNICAL_SESSIONS: Symposium[] = [
  {
    id: 1,
    code: "SESSION-01",
    title: "Corrosion & Inhibitors",
    category: "Science",
    icon: "FlaskConical",
    description: "Fundamental electrochemical corrosion mechanisms, organic and inorganic inhibitors, green & bio-derived inhibitors, adsorption kinetics, and high-temperature corrosion prevention.",
    topics: ["Organic & Inorganic Inhibitors", "Green & Bio-Based Inhibitors", "Electrochemical Kinetics", "High-Temperature Corrosion Prevention", "Adsorption & Synergistic Mechanisms"]
  },
  {
    id: 2,
    code: "SESSION-02",
    title: "Microbiologically Influenced Corrosion (MIC)",
    category: "Science",
    icon: "Biohazard",
    description: "Biofilm dynamics, sulfate-reducing bacteria (SRB), acid-producing bacteria, diagnostic metagenomics, biocide selection, and monitoring in industrial water circuits.",
    topics: ["Biofilms & Microbial Ecology", "Sulfate-Reducing Bacteria (SRB) Diagnostics", "Biocide Selection & Dosing", "MIC Monitoring & Case Studies", "Industrial Cooling Water Systems"]
  },
  {
    id: 3,
    code: "SESSION-03",
    title: "Corrosion in Concrete Structures and Infrastructure Assets",
    category: "Industry",
    icon: "Building2",
    description: "Rebar corrosion mechanisms, chloride ingress, carbonation, cathodic protection of reinforced concrete, self-healing cements, bridges, and civil infrastructure durability.",
    topics: ["Rebar Corrosion & Chloride Ingress", "Carbonation in Concrete", "Cathodic Protection of RC Structures", "Bridge & Coastal Infrastructure Durability", "Corrosion Sensors for Concrete"]
  },
  {
    id: 4,
    code: "SESSION-04",
    title: "Corrosion Under Insulation (CUI)",
    category: "Industry",
    icon: "Flame",
    description: "Insulation barrier degradation, moisture ingress, non-destructive evaluation (NDT), risk-based CUI screening, thermal insulation coatings, and mitigation in petrochemical plants.",
    topics: ["CUI Mechanisms & Thermal Cycling", "Advanced NDT for CUI (PEC, Guided Wave)", "Hydrophobic Insulation Materials", "Protective Barrier Coatings for CUI", "Risk-Based CUI Inspection (RBI)"]
  },
  {
    id: 5,
    code: "SESSION-05",
    title: "Corrosion in Oil, Gas, Petrochemical and Refinery Industries",
    category: "Industry",
    icon: "Fuel",
    description: "Sour service (H2S/CO2) cracking, naphthenic acid corrosion, amine unit degradation, crude unit overhead corrosion, pipeline integrity, and downhole tubing degradation.",
    topics: ["Sour Service H2S/CO2 Cracking", "Refinery Overhead Systems & Amine Units", "Naphthenic Acid & High-Temp Sulfidation", "Pipeline Integrity Management", "Downhole Tubing & Casing Protection"]
  },
  {
    id: 6,
    code: "SESSION-06",
    title: "Corrosion in Ships, Offshore Facilities and Maritime Structures",
    category: "Industry",
    icon: "Ship",
    description: "Subsea assets, offshore platforms, splash zone protection, ballast tank corrosion, antifouling technologies, cavitation, and marine atmospheric degradation.",
    topics: ["Offshore Wind & Platform Splash Zones", "Ballast Tank & Hull Protection", "Subsea Production Systems", "Antifouling & Foul Release Coatings", "Marine Atmospheric Degradation"]
  },
  {
    id: 7,
    code: "SESSION-07",
    title: "Corrosion in Defence Sector & Power Plant",
    category: "Industry",
    icon: "ShieldAlert",
    description: "Thermal, nuclear, and hydro power plant boiler tube corrosion, supercritical steam degradation, defence aerospace and naval vessel preservation, and ordnance storage protection.",
    topics: ["Boiler Water Chemistry & FAC", "Supercritical Steam Degradation", "Nuclear Reactor Stress Corrosion", "Naval Fleet & Defence Asset Preservation", "Aerospace High-Altitude Alloys"]
  },
  {
    id: 8,
    code: "SESSION-08",
    title: "Advanced Alloys and Corrosion-Resistant Materials",
    category: "Science",
    icon: "Layers",
    description: "Duplex and super duplex stainless steels, nickel-based superalloys, titanium and zirconium alloys, high-entropy alloys (HEAs), and additive manufactured materials.",
    topics: ["Duplex & Super Duplex Steels", "Nickel & Cobalt Superalloys", "Titanium & Zirconium Alloys", "High-Entropy Alloys (HEA)", "Additive Manufactured Corrosion Performance"]
  },
  {
    id: 9,
    code: "SESSION-09",
    title: "Industrial Coatings, Linings and Cladding Technologies",
    category: "Technology",
    icon: "Paintbrush",
    description: "High-performance epoxy, polyurethane, and fluoropolymer coatings, thermal spray aluminum (TSA), laser cladding, weld overlays, rubber linings, and surface preparation standards.",
    topics: ["Epoxy, Polyurethane & Fluoropolymer Coatings", "Thermal Spray Aluminum (TSA) & Cladding", "Laser Cladding & Weld Overlays", "Surface Preparation & Standards (SSPC/NACE)", "Ceramic & Rubber Tank Linings"]
  },
  {
    id: 10,
    code: "SESSION-10",
    title: "Cathodic and Anodic Protection Systems",
    category: "Technology",
    icon: "Zap",
    description: "Impressed Current Cathodic Protection (ICCP), sacrificial anode design, deep well groundbeds, AC/DC interference mitigation, pipeline surveys (CIPS/DCVG), and CP automation.",
    topics: ["ICCP System Design & Optimization", "Sacrificial Anode Metallurgy", "Stray Current & AC/DC Interference", "CIPS & DCVG Field Surveys", "Anodic Protection in Chemical Plants"]
  },
  {
    id: 11,
    code: "SESSION-11",
    title: "Corrosion Monitoring, Sensors and Electrochemical Testing",
    category: "Technology",
    icon: "Activity",
    description: "Electrochemical Impedance Spectroscopy (EIS), Linear Polarization Resistance (LPR), Electrical Resistance (ER) probes, acoustic emission, and wireless IoT smart sensors.",
    topics: ["Real-Time LPR & ER Probes", "EIS & Harmonic Distortion Analysis", "Electrochemical Noise (ENM)", "Wireless Autonomous IoT Sensors", "Field Portable Electrochemical Test Kits"]
  },
  {
    id: 12,
    code: "SESSION-12",
    title: "Asset Integrity Management Systems",
    category: "Technology",
    icon: "ShieldCheck",
    description: "Risk-Based Inspection (RBI per API 580/581), Fitness-For-Service (FFS per API 579), remaining life assessment (RLA), degradation modeling, and lifecycle management.",
    topics: ["API 580/581 Risk-Based Inspection (RBI)", "API 579 Fitness-For-Service (FFS)", "Remaining Life Assessment (RLA)", "Failure Analysis & Root Cause Investigation", "Enterprise Asset Integrity Frameworks"]
  },
  {
    id: 13,
    code: "SESSION-13",
    title: "Digitalization, Industry 4.0 and Artificial Intelligence in Corrosion Control",
    category: "Digital & AI",
    icon: "Cpu",
    description: "Predictive machine learning models, physics-informed neural networks (PINNs) for corrosion rate prediction, digital twins for process plants, and automated computer vision for rust inspection.",
    topics: ["Machine Learning Corrosion Predictors", "Plant Digital Twins with Live Telemetry", "AI Vision for Visual Rust Severity", "Cloud-Based Asset Health Dashboards", "Big Data Analytics in Pipeline Networks"]
  },
  {
    id: 14,
    code: "SESSION-14",
    title: "New Trends, Innovations and Emerging Technologies in Corrosion Control",
    category: "Technology",
    icon: "Sparkles",
    description: "Graphene and 2D nanomaterial coatings, microencapsulated self-healing polymers, green hydrogen infrastructure embrittlement, carbon capture (CCUS) corrosion, and smart materials.",
    topics: ["Graphene & 2D Nanomaterial Coatings", "Microcapsule Self-Healing Polymers", "Hydrogen Embrittlement in H2 Economy", "CO2 Capture & Storage (CCUS) Corrosion", "Smart Stimuli-Responsive Coatings"]
  }
];

// Re-export for compatibility
export const SYMPOSIA = TECHNICAL_SESSIONS;

/**
 * =========================================================================
 * ORGANIZING COMMITTEE (EXACT LIST FROM BROCHURE)
 * =========================================================================
 */
export const ORGANIZING_COMMITTEE = {
  leadership: [
    {
      name: "Dr. Sunil Kahar",
      role: "Chairman",
      designation: "Asst. Professor",
      org: "The M.S. University of Baroda",
      photo: "/images/ampp/Dr-sunil-Kahar.jpg"
    },
    {
      name: "Mr. Zuber Khan",
      role: "Co-Chairman",
      designation: "Managing Director",
      org: "Consultech",
      photo: "/images/ampp/ZuberKhan.jpg"
    },
    {
      name: "Mr. Hiren Panchal",
      role: "Convener",
      designation: "AGM, Technology",
      org: "Linde Engg India Pvt. Ltd.",
      photo: "/images/ampp/HirenPanchal.jpg"
    },
    {
      name: "Mr. Dhruv Pandya",
      role: "Co-Convener",
      designation: "Founder & MD",
      org: "Arya Industrial Solutions",
      photo: "/images/ampp/DhruvPandya.jpg"
    }
  ],
  members: [
    { name: "Mr. Paresh Haribhakti", role: "Member", designation: "MD", org: "TCR Engg Pvt. Ltd.", photo: "/images/ampp/PareshHaribhakti.jpg" },
    { name: "Mr. Santosh Gupte", role: "Member", designation: "Director", org: "Geo Metals & Materials Analysis (a division of GDRPL)" },
    { name: "Dr. Vandana J. Rao", role: "Member", designation: "Head, Met & Mats. Engg. Dept.", org: "The M.S. University of Baroda" },
    { name: "Mr. Sumit Kainthola", role: "Member", designation: "Director", org: "Industrial NDT" },
    { name: "Mr. Viral Patel", role: "Member", designation: "Technical Director", org: "Integrated Corrosion and Coating Consultant" },
    { name: "Mr. Digant Joshi", role: "Member", designation: "MD", org: "Tough Coating" },
    { name: "Mr. Arun Gajera", role: "Member", designation: "MD", org: "Mett Bio Pvt. Ltd." },
    { name: "Mr. Deepak Chandrakant Maru", role: "Member", designation: "Proprietor", org: "Technocrat Solutions" },
    { name: "Dr. Rinky Singh", role: "Member", designation: "CTO", org: "Sustech Neo Energy, Vadodara" },
    { name: "Dr. Sucheta Juneja", role: "Member", designation: "Head – Quality Control Laboratory", org: "Jindal Saw Ltd., Mundra" },
    { name: "Mrs. Vaishnavi Sangamneka", role: "Member", designation: "Sr. Quality Assurance Specialist", org: "ABB Hitachi Ltd." },
    { name: "Mr. Siddhesh Jambekar", role: "Member", designation: "Senior Manager (Metallurgy)", org: "GSFC Ltd." },
    { name: "Dr. B J Chauhan", role: "Member", designation: "Ex-Head, Met & Mats. Engg. Dept.", org: "The M.S. University of Baroda" },
    { name: "Mr. Harsh Zala", role: "Member", designation: "Asset Integrity Specialist", org: "AsInt, Inc. Ahmedabad" },
    { name: "Mr. Rajkumar Kashyap", role: "Member", designation: "General Manager", org: "Hereru Groups", photo: "/images/ampp/rajkumar-kashyap.jpg" },
    { name: "Mr. Manoranjan Mahapatra", role: "Member", designation: "Sr. Engineer, QA/QC", org: "Linde Engineering India Pvt. Ltd." },
    { name: "Dr. Daulat Sharma", role: "Member", designation: "Asso. Professor", org: "GEC Gandhinagar" },
    { name: "Dr. Krunal Patel", role: "Member", designation: "Temp. Asst. Professor, Met. & Mats. Engg. Dept.", org: "The M.S. University of Baroda" },
    { name: "Dr. Suraj Dabhekar", role: "Member", designation: "Temp. Asst. Professor, Met. & Mats. Engg. Dept.", org: "The M.S. University of Baroda" },
    { name: "Mr. Kaizar H. Bhaisaheb", role: "Member", designation: "Temp. Asst. Prof., Met. & Mats. Engg. Dept.", org: "The M.S. University of Baroda" },
    { name: "Mr. Chiral Patel", role: "Member", designation: "Head BD Pipeline Integrity & Cathodic Protection", org: "TCR Advanced Engg. Pvt. Ltd." },
    { name: "Mr. Sarang Bhonde", role: "Member", designation: "Quality Assurance & System Leader", org: "GE Vernova" },
    { name: "Mr. Susanta Ghosh", role: "Member", designation: "Work Manager", org: "Modern Rolls & Eng. Pvt Ltd" },
    { name: "Dr. Yakshil Chokshi", role: "Member", designation: "Lecturer–Metallurgy", org: "GEC Rajkot" },
    { name: "Dr. Mandar Joshi", role: "Member", designation: "Lecturer–Metallurgy", org: "GEC Surat" }
  ]
};

/**
 * =========================================================================
 * INTERNATIONAL ADVISORY COMMITTEE (EXACT LIST FROM BROCHURE)
 * =========================================================================
 */
export const INTERNATIONAL_ADVISORY = {
  chairman: {
    name: "Prof. (Dr.) Bhalchandra Bhange",
    role: "Chairman, International Advisory",
    designation: "Hon. Vice Chancellor",
    org: "The M S University of Baroda"
  },
  members: [
    {
      name: "Prof. (Dr.) U. Kamachi Mudali",
      role: "Member",
      designation: "Hon. Vice Chancellor",
      org: "Homi Bhabha National Institute (HBNI), Mumbai",
      country: "India"
    },
    {
      name: "Dr. Amir Eliezer",
      role: "Member",
      designation: "Director, Corrosion Research Center, Nano-Bio & Advanced Materials",
      org: "Corrosion Research Center",
      country: "Israel"
    },
    {
      name: "Juan Caballero",
      role: "Member",
      designation: "Founder & Principal Consultant",
      org: "Naval & Industrial Solutions",
      country: "Panama"
    },
    {
      name: "Dr. Nafiseh Ebrahimi",
      role: "Member",
      designation: "Director, AMPP Associate Research Officer",
      org: "National Research Council Canada",
      country: "Canada"
    },
    {
      name: "Mr. Subesh Kumar",
      role: "Member",
      designation: "Chief GM",
      org: "Engineers India Ltd., Govt. of India, Vadodara",
      country: "India"
    }
  ]
};

/**
 * =========================================================================
 * DELEGATE REGISTRATION TIERS (INCL. 18% GST)
 * =========================================================================
 */
export const REGISTRATION_TIERS: RegistrationTier[] = [
  {
    id: "tier-member",
    name: "IIM / AMPP Members",
    basePrice: 4000,
    gstRate: 18,
    gstAmount: 720,
    totalPrice: 4720,
    description: "Discounted delegate pass for verified members of IIM or AMPP (including AMPP Gujarat Chapter).",
    features: [
      "Full technical program access (all 14 sessions)",
      "Technology exhibition access",
      "3 networking lunches & 2 dinners",
      "Reception beverages & award night",
      "Entertainment cultural program",
      "Official conference souvenir",
      "Technical e-proceedings & delegate kit"
    ]
  },
  {
    id: "tier-non-member",
    name: "Non-IIM / Non-AMPP Members",
    basePrice: 6500,
    gstRate: 18,
    gstAmount: 1170,
    totalPrice: 7670,
    popular: true,
    description: "Standard delegate pass for industry engineers, asset managers, consultants, and non-members.",
    features: [
      "Full technical program access (all 14 sessions)",
      "Technology exhibition access",
      "3 networking lunches & 2 dinners",
      "Reception beverages & award night",
      "Entertainment cultural program",
      "Official conference souvenir",
      "Technical e-proceedings & delegate kit"
    ]
  },
  {
    id: "tier-student",
    name: "Students",
    basePrice: 1500,
    gstRate: 18,
    gstAmount: 270,
    totalPrice: 1770,
    description: "Subsidized registration for full-time enrolled students and research scholars (valid ID required).",
    features: [
      "Full technical program access (all 14 sessions)",
      "Technology exhibition access",
      "3 networking lunches & 2 dinners",
      "Reception beverages & award night",
      "Entertainment cultural program",
      "Official conference souvenir",
      "Technical e-proceedings & delegate kit"
    ]
  }
];

export const DELEGATE_BENEFITS_COMMON = [
  "Full technical program access across all 14 specialized sessions",
  "Technology exhibition access throughout the 3-day event",
  "Official 3 lunches, 2 dinners, and reception beverages",
  "Exclusive Award Night & Entertainment cultural program",
  "Official Conference Souvenir book",
  "Technical e-proceedings and delegate conference kit"
];

/**
 * =========================================================================
 * SPONSORSHIP PACKAGES (EXACT FROM BROCHURE)
 * Common benefits: Logo on main-hall backdrop panel, logo on website and venue,
 * logo visibility in exhibition area, one-page ad + one-page company profile in souvenir, memento.
 * =========================================================================
 */
export const SPONSORSHIP_COMMON_BENEFITS = [
  "Company logo visible on panel of backdrop in main hall",
  "Company logo display on Website and Conference venue",
  "Company logo visibility in Exhibition Area",
  "One-page advertisement in the Souvenir",
  "One-page Company profile in the Souvenir",
  "Memento"
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
      "8 Complimentary delegate registrations",
      "12 SqM (3m x 4m) Exhibition Booth",
      "3 Rooms (Twin/Double occupancy with breakfast for two nights)",
      "Company logo visible on panel of backdrop in main hall",
      "Company logo display on Website and Conference venue",
      "Company logo visibility in Exhibition Area",
      "One-page advertisement in the Souvenir",
      "One-page Company profile in the Souvenir",
      "Memento"
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
      "6 Complimentary delegate registrations",
      "12 SqM (3m x 4m) Exhibition Booth",
      "2 Rooms (Twin/Double occupancy with breakfast for two nights)",
      "Company logo visible on panel of backdrop in main hall",
      "Company logo display on Website and Conference venue",
      "Company logo visibility in Exhibition Area",
      "One-page advertisement in the Souvenir",
      "One-page Company profile in the Souvenir",
      "Memento"
    ]
  },
  {
    id: "sponsor-silver",
    tier: "Silver",
    priceINR: 250000,
    priceFormatted: "₹2,50,000",
    color: "#475569",
    bgGradient: "from-slate-50 to-gray-50 border-slate-300",
    delegates: 4,
    features: [
      "4 Complimentary delegate registrations",
      "9 SqM (3m x 3m) Exhibition Booth",
      "2 Rooms (Twin/Double occupancy with breakfast for two nights)",
      "Company logo visible on panel of backdrop in main hall",
      "Company logo display on Website and Conference venue",
      "Company logo visibility in Exhibition Area",
      "One-page advertisement in the Souvenir",
      "One-page Company profile in the Souvenir",
      "Memento"
    ]
  },
  {
    id: "sponsor-bronze",
    tier: "Bronze",
    priceINR: 125000,
    priceFormatted: "₹1,25,000",
    color: "#c2410c",
    bgGradient: "from-orange-50 to-red-50 border-orange-200",
    delegates: 2,
    features: [
      "2 Complimentary delegate registrations",
      "9 SqM (3m x 3m) Exhibition Booth",
      "1 Room (Twin/Double occupancy with breakfast for two nights)",
      "Company logo visible on panel of backdrop in main hall",
      "Company logo display on Website and Conference venue",
      "Company logo visibility in Exhibition Area",
      "One-page advertisement in the Souvenir",
      "One-page Company profile in the Souvenir",
      "Memento"
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
      "2 Complimentary delegate registrations",
      "Company logo display on Website and Conference venue",
      "Half-page advertisement in the Souvenir"
    ]
  }
];

/**
 * =========================================================================
 * EXHIBITOR PACKAGES (EXACT FROM BROCHURE PAGE 4)
 * Accommodation not included
 * =========================================================================
 */
export const EXHIBITOR_PACKAGES: ExhibitorPackage[] = [
  {
    id: "exhibitor-12sqm",
    name: "12 SqM Booth",
    size: "12 SqM",
    dimensions: "3m x 4m",
    priceINR: 75000,
    priceFormatted: "₹75,000",
    delegates: 4,
    adSize: "One-page Souvenir ad",
    memento: true,
    accommodationIncluded: false,
    features: [
      "Company logo display on conference website",
      "Company logo visibility in Exhibition Area",
      "12 SqM (3m x 4m) Exhibition Booth",
      "4 Delegates complimentary registration provided",
      "One-page advertisement in the Souvenir",
      "Memento",
      "Note: Room (accommodation) is not included"
    ]
  },
  {
    id: "exhibitor-9sqm",
    name: "9 SqM Booth",
    size: "9 SqM",
    dimensions: "3m x 3m",
    priceINR: 50000,
    priceFormatted: "₹50,000",
    delegates: 2,
    adSize: "One-page Souvenir ad",
    memento: true,
    accommodationIncluded: false,
    features: [
      "Company logo display on conference website",
      "Company logo visibility in Exhibition Area",
      "9 SqM (3m x 3m) Exhibition Booth",
      "2 Delegates complimentary registration provided",
      "One-page advertisement in the Souvenir",
      "Memento",
      "Note: Room (accommodation) is not included"
    ]
  }
];

/**
 * =========================================================================
 * SOUVENIR ADVERTISING TARIFF (+18% GST EXTRA)
 * =========================================================================
 */
export const SOUVENIR_ADVERTISEMENT_RATES: AdvertisementRate[] = [
  {
    type: "Cover Pages",
    category: "Souvenir Back Cover",
    rateINR: 100000,
    rateFormatted: "₹1,00,000",
    dimensions: "8.23\" (w) x 11.75\" (h) bleed (+0.25\" cut marks)"
  },
  {
    type: "Cover Pages",
    category: "Souvenir Inner Cover",
    rateINR: 50000,
    rateFormatted: "₹50,000",
    dimensions: "8.23\" (w) x 11.75\" (h) bleed (+0.25\" cut marks)"
  },
  {
    type: "Inside Pages",
    category: "Full Page",
    rateINR: 20000,
    rateFormatted: "₹20,000",
    dimensions: "7.25\" (w) x 10.15\" (h) non-bleed"
  },
  {
    type: "Inside Pages",
    category: "Half Page",
    rateINR: 10000,
    rateFormatted: "₹10,000",
    dimensions: "7.25\" (w) x 4.90\" (h) non-bleed"
  }
];

export const ADVERTISEMENT_RATES = SOUVENIR_ADVERTISEMENT_RATES;

export const SOUVENIR_SPECS = {
  bleed: {
    dimensions: "8.23\" (w) x 11.75\" (h)",
    marginNote: "Artwork should extend 0.25\" beyond cut marks on all sides."
  },
  nonBleed: {
    dimensions: "7.25\" (w) x 10.15\" (h)"
  },
  resolution: "300 DPI",
  formats: "CDR, PDF, or EPS format",
  emailArtworkTo: "coraxm2024@gmail.com / iim.barodachapter@gmail.com",
  taxNote: "18% GST Extra on all souvenir advertisement rates."
};

/**
 * =========================================================================
 * PAST SUPPORTERS (EXACT 21 COMPANIES FROM BROCHURE PAGE 8)
 * =========================================================================
 */
export const PAST_SUPPORTERS = [
  { name: "GAIL (India) Limited", tag: "GAIL", category: "Natural Gas & Infrastructure", logo: "/images/ampp/gail.png" },
  { name: "DEHN India", tag: "DEHN", category: "Lightning & Surge Protection", logo: "/images/ampp/dehn.png" },
  { name: "TCR Advanced", tag: "TCR ADVANCED", category: "Materials Testing & Failure Analysis", logo: "/images/ampp/tcr-advanced.png" },
  { name: "Consultech Group of Companies", tag: "CONSULTECH", category: "Corrosion Engineering Solutions", logo: "/images/ampp/consultech.png" },
  { name: "ARYA Industrial Solutions", tag: "ARYA", category: "Surface Protection & Coatings", logo: "/images/ampp/arya.png" },
  { name: "L&T Heavy Engineering", tag: "L&T HEAVY ENG", category: "Heavy Engineering & Pressure Equipment", logo: "/images/ampp/lt.png" },
  { name: "Mett-Bio", tag: "METT-BIO", category: "Testing & Certification Services", logo: "/images/ampp/mett-bio.png" },
  { name: "Heeru Groups", tag: "HEERU", category: "Specialty Industrial Chemicals", logo: "/images/ampp/rajkumar-kashyap.jpg" },
  { name: "Industrial NDT", tag: "INDUSTRIAL NDT", category: "Non-Destructive Testing Services", logo: "/images/ampp/industrial-ndt.png" },
  { name: "TechnoCrat Solutions", tag: "TECHNOCRAT", category: "Coating Systems & Inspection", logo: "/images/ampp/technocrat.png" },
  { name: "Amchem Products Pvt. Ltd.", tag: "AMCHEM", category: "Polyurethane Coatings & Linings", logo: "/images/ampp/amchem.png" },
  { name: "Tough Coatings", tag: "TOUGH COATINGS", category: "Moisture Cure Polyurethane", logo: "/images/ampp/tough-coatings.png" },
  { name: "Techcellent", tag: "TECHCELLENT", category: "Corrosion Consulting & Asset Integrity", logo: "/images/ampp/techcellent.png" },
  { name: "CorrXperts", tag: "CORRXPERTS", category: "Corrosion Diagnostics & Training", logo: "/images/ampp/corrxperts.png" },
  { name: "Ujas Industrial Engineering Pvt. Ltd.", tag: "UJAS", category: "Industrial Engineering Services", logo: "/images/ampp/ujas.png" },
  { name: "Outokumpu", tag: "OUTOKUMPU", category: "High Performance Stainless Steels", logo: "/images/ampp/outokumpu.png" },
  { name: "Reliable Paints", tag: "RELIABLE PAINTS", category: "Protective & Marine Paints", logo: "/images/ampp/reliable-paints.png" },
  { name: "Modsonic", tag: "MODSONIC", category: "Ultrasonic NDT Equipment (Since 1987)", logo: "/images/ampp/modsonic.png" },
  { name: "Boekhoff Technocrats", tag: "BOEKHOFF", category: "Engineering & Technological Solutions", logo: "/images/ampp/boekhoff.png" },
  { name: "Excellent Infrastructure Pvt. Ltd.", tag: "EXCELLENT", category: "Industrial & Civil Infrastructure", logo: "/images/ampp/excellent.png" },
  { name: "Caltech", tag: "CALTECH", category: "Corrosion & Coating Test Instruments", logo: "/images/ampp/caltech.png" }
];

/**
 * =========================================================================
 * EXHIBITOR BOOTHS FLOOR PLAN (INITIAL STATUS)
 * =========================================================================
 */
export const INITIAL_BOOTHS: ExhibitorBooth[] = [
  { id: "b1", boothNumber: "A-01", size: "12 sqm (3x4m)", dimensions: "4m x 3m", priceINR: 75000, status: "Available" },
  { id: "b2", boothNumber: "A-02", size: "9 sqm (3x3m)", dimensions: "3m x 3m", priceINR: 50000, status: "Available" },
  { id: "b3", boothNumber: "A-03", size: "9 sqm (3x3m)", dimensions: "3m x 3m", priceINR: 50000, status: "Available" },
  { id: "b4", boothNumber: "A-04", size: "9 sqm (3x3m)", dimensions: "3m x 3m", priceINR: 50000, status: "Available" },
  { id: "b5", boothNumber: "B-01", size: "12 sqm (3x4m)", dimensions: "4m x 3m", priceINR: 75000, status: "Available" },
  { id: "b6", boothNumber: "B-02", size: "9 sqm (3x3m)", dimensions: "3m x 3m", priceINR: 50000, status: "Available" },
  { id: "b7", boothNumber: "B-03", size: "9 sqm (3x3m)", dimensions: "3m x 3m", priceINR: 50000, status: "Available" },
  { id: "b8", boothNumber: "B-04", size: "9 sqm (3x3m)", dimensions: "3m x 3m", priceINR: 50000, status: "Available" },
  { id: "b9", boothNumber: "C-01", size: "9 sqm (3x3m)", dimensions: "3m x 3m", priceINR: 50000, status: "Available" },
  { id: "b10", boothNumber: "C-02", size: "9 sqm (3x3m)", dimensions: "3m x 3m", priceINR: 50000, status: "Available" },
  { id: "b11", boothNumber: "C-03", size: "9 sqm (3x3m)", dimensions: "3m x 3m", priceINR: 50000, status: "Available" },
  { id: "b12", boothNumber: "C-04", size: "12 sqm (3x4m)", dimensions: "4m x 3m", priceINR: 75000, status: "Available" }
];

/**
 * =========================================================================
 * DISTINGUISHED SPEAKERS & CHAIRS (MOCK/INITIAL PROGRAM)
 * =========================================================================
 */
export const SPEAKERS: Speaker[] = [
  {
    id: "spk-1",
    name: "Dr. Sunil Kahar",
    designation: "Chairman, GUJCORR 2027",
    organization: "The M.S. University of Baroda",
    role: "Conference Chairman",
    category: "Keynote",
    initials: "SK",
    color: "bg-red-700 text-white",
    bio: "Assistant Professor at The M.S. University of Baroda with pioneering research in corrosion kinetics, surface engineering, and metallurgy.",
    symposium: "Advanced Alloys & Corrosion Science"
  },
  {
    id: "spk-2",
    name: "Mr. Zuber Khan",
    designation: "Managing Director",
    organization: "Consultech",
    role: "Co-Chairman",
    category: "Keynote",
    initials: "ZK",
    color: "bg-teal-700 text-white",
    bio: "Managing Director at Consultech, leading industrial corrosion prevention, plant integrity, and engineering consultancy.",
    symposium: "Oil, Gas & Petrochemical Corrosion"
  },
  {
    id: "spk-3",
    name: "Mr. Hiren Panchal",
    designation: "AGM, Technology",
    organization: "Linde Engg India Pvt. Ltd.",
    role: "Convener",
    category: "Keynote",
    initials: "HP",
    color: "bg-blue-800 text-white",
    bio: "AGM, Technology at Linde Engineering India, with extensive background in process plant metallurgy, asset integrity, and corrosion mitigation.",
    symposium: "Asset Integrity Management Systems"
  },
  {
    id: "spk-4",
    name: "Mr. Dhruv Pandya",
    designation: "Founder & MD",
    organization: "Arya Industrial Solutions",
    role: "Co-Convener",
    category: "Technical",
    initials: "DP",
    color: "bg-rose-700 text-white",
    bio: "Founder & MD of Arya Industrial Solutions, expert in specialized industrial surface protection, coatings, and linings.",
    symposium: "Industrial Coatings, Linings & Cladding"
  },
  {
    id: "spk-5",
    name: "Prof. (Dr.) Bhalchandra Bhange",
    designation: "Hon. Vice Chancellor",
    organization: "The M S University of Baroda",
    role: "Chairman, International Advisory",
    category: "Keynote",
    initials: "BB",
    color: "bg-purple-800 text-white",
    bio: "Distinguished academic leader and Hon. Vice Chancellor of The Maharaja Sayajirao University of Baroda.",
    symposium: "Inaugural Keynote Address"
  },
  {
    id: "spk-6",
    name: "Prof. (Dr.) U. Kamachi Mudali",
    designation: "Hon. Vice Chancellor",
    organization: "Homi Bhabha National Institute (HBNI), Mumbai",
    role: "International Advisory Member",
    category: "Keynote",
    initials: "KM",
    color: "bg-indigo-800 text-white",
    bio: "Renowned materials scientist, former Director of Materials Group at IGCAR, and Vice Chancellor at HBNI.",
    symposium: "Advanced Materials & Nuclear Integrity"
  },
  {
    id: "spk-7",
    name: "Dr. Amir Eliezer",
    designation: "Director, Corrosion Research Center",
    organization: "Nano-Bio & Advanced Materials, Israel",
    role: "International Advisory Member",
    category: "Keynote",
    initials: "AE",
    color: "bg-emerald-800 text-white",
    bio: "International authority on advanced nanomaterials and corrosion science, past AMPP global leader.",
    symposium: "New Trends & Nanomaterials in Corrosion Control"
  },
  {
    id: "spk-8",
    name: "Juan Caballero",
    designation: "Founder & Principal Consultant",
    organization: "Naval & Industrial Solutions, Panama",
    role: "International Advisory Member",
    category: "Invited",
    initials: "JC",
    color: "bg-cyan-800 text-white",
    bio: "Specialist in marine corrosion, maritime infrastructure protection, and offshore integrity.",
    symposium: "Corrosion in Ships & Offshore Facilities"
  },
  {
    id: "spk-9",
    name: "Dr. Nafiseh Ebrahimi",
    designation: "Director, AMPP Associate Research Officer",
    organization: "National Research Council Canada",
    role: "International Advisory Member",
    category: "Invited",
    initials: "NE",
    color: "bg-amber-800 text-white",
    bio: "Director and senior researcher at NRC Canada focusing on materials characterization and electrochemistry.",
    symposium: "Corrosion Monitoring & Electrochemical Testing"
  },
  {
    id: "spk-10",
    name: "Mr. Subesh Kumar",
    designation: "Chief GM",
    organization: "Engineers India Ltd., Govt. of India, Vadodara",
    role: "International Advisory Member",
    category: "Invited",
    initials: "SK",
    color: "bg-slate-800 text-white",
    bio: "Chief General Manager at Engineers India Limited with deep expertise in refinery engineering and pipeline integrity.",
    symposium: "Corrosion in Oil, Gas & Petrochemical Industries"
  }
];

/**
 * =========================================================================
 * AWARDS
 * =========================================================================
 */
export const AWARDS: AwardCategory[] = [
  {
    id: "award-1",
    title: "GUJCORR Lifetime Achievement in Corrosion Science",
    description: "Recognizing visionary scientists and engineers whose lifelong dedication has fundamentally advanced materials protection and corrosion control in India and globally.",
    eligibility: "Senior researchers/industrialists with 25+ years of demonstrable contributions.",
    deadline: "15 November 2026"
  },
  {
    id: "award-2",
    title: "Young Corrosion Scientist & Innovator Award 2027",
    description: "Awarded to promising researchers under the age of 38 who have published high-impact discoveries in corrosion mechanisms, green inhibitors, or electrochemical technologies.",
    eligibility: "Age <= 38 years as of 31 Dec 2026. Peer-reviewed publication record required.",
    deadline: "15 November 2026"
  },
  {
    id: "award-3",
    title: "Industrial Corrosion Mitigation Excellence Trophy",
    description: "Honoring asset owner corporations or EPC contractors who achieved exemplary asset life-extension and zero-loss integrity records through innovative corrosion management.",
    eligibility: "Open to plant operators, refineries, power plants, offshore operators & EPCs.",
    deadline: "15 November 2026"
  },
  {
    id: "award-4",
    title: "Best Student Technical Paper & Poster Award",
    description: "Prestigious cash award and citation for outstanding original research presented by student delegates during the GUJCORR 2027 symposia.",
    eligibility: "Registered full-time student delegates presenting an oral or poster paper.",
    deadline: "Evaluated live during conference"
  }
];
