
import { AppState, Course } from '../types';

const bVocMapping: Record<string, string[]> = {
  "Agriculture": ["B. Voc in Agriculture"],
  "Automotive": ["B. Voc. in Automobile Servicing", "B. Voc in Automobile Production (Welding)", "B. Voc. in Automobile Production (Machining)"],
  "Apparel": ["B. Voc. in Fashion Designing"],
  "Banking, Financial Services & Insurance": ["B. Voc. in Banking, financial Services & Insurance", "B. Voc in Account & Taxation"],
  "Beauty & Wellness": ["B. Voc. in Therapeutic Yoga"],
  "Capital Goods": ["B. Voc in Production", "B. Voc. in Manufacturing"],
  "Construction": ["B. Voc. in Construction Technology"],
  "Electronics and Hardware": ["B. Voc. in Refrigeration & Air Conditioning", "B. Voc. in Electronics Manufacturing Services", "B. Voc. in Computer Hardware & Networking", "B. Voc. in Electrical & Electronic Assembly"],
  "Food Processing": ["B. Voc. in Food processing"],
  "Furniture & Fitting": ["B. Voc. in Interior Designing"],
  "Green Jobs": ["B. Voc. in Renewable Energy"],
  "Healthcare": ["B. Voc. in Patient Care Management", "B. Voc in Medical Laboratory Technician", "B. Voc. in Radiology & Imaging Technology", "B. Voc in Operation Theatre Technology", "B. Voc in Nursing Care", "B. Voc in Central Sterile Supply Department", "B. Voc. in Dialysis Technology", "B. Voc. In Hospital Administration"],
  "IT/ITES": ["B. Voc in Application Development", "B. Voc in Information Technology"],
  "Life Science": ["B. Voc in Life Sciences"],
  "Logistics": ["B. Voc in Logistic Operations Management"],
  "Media & Entertainment": ["B Voc in Multimedia"],
  "Mining": ["B. Voc. In Mining"],
  "Plumbing": ["B. Voc in Plumbing Skills"],
  "Retail": ["B. Voc in Retail Management"],
  "Rubber, Chemical & Petrochemical": ["B. Voc in Plastic Technology", "B. Voc. In Polymer Technology"],
  "Telecom": ["B.Voc. in Telecommunication"],
  "Textile & Handloom": ["B. Voc in Textile Technology"],
  "Tourism and Hospitality": ["B. Voc. In Hotel Management", "B. Voc in Travel & Tourism"]
};

const ugDegreeMapping: Record<string, string[]> = {
  "Agriculture": ["UG Degree in Agriculture"],
  "Automotive": ["UG Degree. in Automobile Servicing", "UG Degree in Automobile Production (Welding)", "UG Degree. in Automobile Production (Machining)"],
  "Apparel": ["UG Degree. in Fashion Designing"],
  "Banking, Financial Services & Insurance": ["UG Degree. in Banking, financial Services & Insurance", "UG Degree in Account & Taxation"],
  "Beauty & Wellness": ["UG Degree. in Therapeutic Yoga"],
  "Capital Goods": ["UG Degree in Production", "UG Degree. in Manufacturing"],
  "Construction": ["UG Degree. in Construction Technology"],
  "Electronics and Hardware": ["UG Degree. in Refrigeration & Air Conditioning", "UG Degree. in Electronics Manufacturing Services", "UG Degree. in Computer Hardware & Networking", "UG Degree. in Electrical & Electronic Assembly"],
  "Food Processing": ["UG Degree. in Food processing"],
  "Furniture & Fitting": ["UG Degree. in Interior Designing"],
  "Green Jobs": ["UG Degree. in Renewable Energy"],
  "Healthcare": ["UG Degree. in Patient Care Management", "UG Degree in Medical Laboratory Technician", "UG Degree. in Radiology & Imaging Technology", "UG Degree in Operation Theatre Technology", "UG Degree in Nursing Care", "UG Degree in Central Sterile Supply Department", "UG Degree. in Dialysis Technology", "UG Degree. In Hospital Administration"],
  "IT/ITES": ["UG Degree in Application Development", "UG Degree in Information Technology"],
  "Life Science": ["UG Degree in Life Sciences"],
  "Logistics": ["UG Degree in Logistic Operations Management"],
  "Media & Entertainment": ["UG Degree in Multimedia"],
  "Mining": ["UG Degree. In Mining"],
  "Plumbing": ["UG Degree in Plumbing Skills"],
  "Retail": ["UG Degree in Retail Management"],
  "Rubber, Chemical & Petrochemical": ["UG Degree in Plastic Technology", "UG Degree. In Polymer Technology"],
  "Telecom": ["UG Degree in Telecommunication"],
  "Textile & Handloom": ["UG Degree in Textile Technology"],
  "Tourism and Hospitality": ["UG Degree. In Hotel Management", "UG Degree in Travel & Tourism"]
};

const generateCourses = (): Course[] => {
  const list: Course[] = [];
  let idCounter = 1;

  // Add B. Voc tracks
  Object.entries(bVocMapping).forEach(([industry, programs]) => {
    programs.forEach(progName => {
      list.push({
        id: `bvoc-${idCounter++}`,
        name: progName,
        academicLevel: 'B. Voc',
        industry: industry,
        duration: "3 Years",
        mode: 'Offline',
        status: 'Active',
        image: `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800&industry=${industry.replace(/\s+/g, '')}`,
        description: `Professional academic track in ${progName}. This 3-year program provides extensive technical mastery and workplace experience.`,
        price: "Rs. 35,000 / Sem",
        certification: "University B. Voc Degree",
        eligibility: "12th Pass",
        benefits: "• 100% Internship Coverage\n• Industry Certified Curriculum"
      });
    });

    // Placeholders for menu redirection entry points
    list.push({
      id: `cert-${idCounter++}`,
      name: `Certificate in ${industry}`,
      academicLevel: 'UG Certificate',
      industry: industry,
      duration: "1 Year",
      mode: 'Offline',
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
      description: `Foundation Course in ${industry}. Note: Clicks from the menu redirect to higher degree tracks.`,
      price: "Rs. 20,000"
    } as any);

    list.push({
      id: `dip-${idCounter++}`,
      name: `Diploma in ${industry}`,
      academicLevel: 'UG Diploma',
      industry: industry,
      duration: "2 Years",
      mode: 'Offline',
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
      description: `Diploma program in ${industry}. Note: Clicks from the menu redirect to higher degree tracks.`,
      price: "Rs. 25,000"
    } as any);
  });

  // Add UG Degree tracks
  Object.entries(ugDegreeMapping).forEach(([industry, programs]) => {
    programs.forEach(progName => {
      list.push({
        id: `ugdeg-${idCounter++}`,
        name: progName,
        academicLevel: 'UG Degree',
        industry: industry,
        duration: "3-4 Years",
        mode: 'Offline',
        status: 'Active',
        image: `https://images.unsplash.com/photo-1523050853063-bd8012fec046?auto=format&fit=crop&q=80&w=800&industry=${industry.replace(/\s+/g, '')}`,
        description: `Full academic UG Degree program in ${progName}. Focused on theoretical foundations and practical application in the field.`,
        price: "Rs. 45,000 / Sem",
        certification: "Bachelor's Degree",
        eligibility: "12th Pass",
        benefits: "• Comprehensive Career Coaching\n• Global Recognition"
      });
    });
  });

  return list;
};

export const INITIAL_CONTENT: AppState = {
  site: {
    name: "S M Skills",
    tagline: "TRAINING INSTITUTE • ESTD 2024",
    logo: "https://lwfiles.mycourse.app/62a6cd5-public/6efdd5e.png", 
    loginLabel: "DASHBOARD",
    admissionAlert: {
      enabled: true,
      text: "2024 ADMISSIONS NOW OPEN:",
      subtext: "SECURE YOUR FUTURE WITH OUR B. VOC TRACKS.",
      linkText: "APPLY TODAY",
      linkPath: "/enroll"
    },
    contact: {
      email: "info@smskills.in",
      phones: ["+91 6002313158"],
      address: "J M Road, Christianpatty, Nagaon",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3579.544793616803!2d92.68652037525492!3d26.341258676993183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37452d3a33333333%3A0x3333333333333333!2sNagaon%2C%20Assam!5e0!3m2!1sen!2sin!4v1700000000000"
    },
    social: [
      { id: 's1', platform: 'Facebook', url: 'https://facebook.com', icon: 'fa-facebook-f' },
      { id: 's2', platform: 'YouTube', url: 'https://youtube.com', icon: 'fa-youtube' },
      { id: 's3', platform: 'Instagram', url: 'https://instagram.com', icon: 'fa-instagram' }
    ],
    navigation: [
      { label: "Home", path: "/" },
      { label: "About", path: "/about" },
      { label: "Academics", path: "/academics" },
      { label: "Notices", path: "/notices" },
      { label: "Gallery", path: "/gallery" },
      { label: "FAQ", path: "/faq" },
      { label: "Contact", path: "/contact" }
    ],
    footer: {
      brandDescription: "S M Skills is a premier center for technical education, providing industry-aligned training designed for immediate employability.",
      quickLinksLabel: "NAVIGATION",
      supportLinksLabel: "RESOURCES",
      reachUsLabel: "CONNECT",
      bottomText: "S M Skills • ESTD 2024",
      supportLinks: [
        { label: "Privacy Policy", path: "/privacy-policy" },
        { label: "Terms of Service", path: "/terms-of-service" },
        { label: "Placement Wall", path: "/placement-review" }
      ]
    }
  },
  theme: {
    primary: "#059669",
    secondary: "#1e1b4b",
    accent: "#10b981",
    radius: "large"
  },
  home: {
    hero: {
      title: "Master Skills for the Modern Industry",
      subtitle: "Join S M Skills for specialized B. Voc degree programs. Build your career with veterans.",
      ctaText: "Browse B. Voc Tracks",
      ctaLink: "/academics?level=B. Voc",
      bgImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1600",
      visible: true
    },
    highlights: [
      {
        icon: "fa-graduation-cap",
        title: "Hands-on Mastery",
        description: "Practice in real-world scenarios with projects mentored by industry leads."
      },
      {
        icon: "fa-rocket",
        title: "Career-First Approach",
        description: "Our programs are optimized for placement success and high-growth trajectories."
      },
      {
        icon: "fa-briefcase",
        title: "94% Placement Rate",
        description: "Join a network of alumni currently working at top global technology firms."
      }
    ],
    sectionLabels: {
      noticesTitle: "Institute Feed",
      noticesSubtitle: "Recent announcements regarding batches, events, and scholarships.",
      coursesTitle: "Vocational Degree Tracks",
      coursesSubtitle: "Explore our diverse range of 3-year vocational tracks.",
      galleryTitle: "Campus Life",
      gallerySubtitle: "Explore our facilities, classroom interactions, and achievement galleries.",
      placementsTitle: "Our Placement Record",
      placementsSubtitle: "Celebrating S M Skills graduates who have joined industry-leading organizations.",
      placementMainLabel: "Success Stories"
    },
    ctaBlock: {
      title: "Secure Your Future with S M Skills",
      subtitle: "Admissions for the 2024 academic cycle are now open. Consult with an advisor today.",
      buttonText: "Begin Application",
      buttonLink: "/enroll",
      visible: true
    },
    bigShowcase: {
      visible: true,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1600",
      title: "Leading with Excellence",
      subtitle: "Our faculty and senior mentors bring decades of combined technical expertise to the classroom."
    },
    sections: {
      notices: true,
      featuredCourses: true,
      gallery: true,
      contact: true,
      industryTieups: true,
      placementReviews: true,
      highlights: true,
      bigShowcase: true
    },
    sectionOrder: ["highlights", "industryTieups", "placementReviews", "notices", "featuredCourses", "bigShowcase"]
  },
  customPages: [],
  enrollmentForm: {
    title: "SMS Official Enrollment",
    description: "Please complete the comprehensive academic application form below.",
    successTitle: "Application Received",
    successMessage: "Your registration is being processed. An institutional registrar will review your application soon.",
    roadmapTitle: "Enrollment Flow",
    roadmapSteps: [
      { id: "s1", title: "Identity Submission", description: "Provide verifiable academic and personal records." },
      { id: "s2", title: "Technical Review", description: "Specialists evaluate your alignment with the chosen track." },
      { id: "s3", title: "Confirmation", description: "Official admission offer sent via advisor call." }
    ],
    fields: [
      { id: "f1", label: "Student Full Name", type: "text", placeholder: "e.g. Michael Smith", required: true },
      { id: "f2", label: "Email Address", type: "email", placeholder: "mike@example.com", required: true },
      { id: "f3", label: "Father's / Guardian Name", type: "text", placeholder: "Enter Full Name", required: true },
      { id: "f4", label: "Date of Birth", type: "date", placeholder: "", required: true },
      { id: "f5", label: "Primary Contact Number", type: "tel", placeholder: "+91", required: true },
      { id: "f8", label: "Highest Qualification", type: "select", placeholder: "Select Qualification", required: true, options: ["High School", "Secondary School (10th)", "Higher Secondary (12th)", "Diploma Holder", "Graduate / Bachelor's", "Post Graduate"] },
      { id: "f9", label: "Course Interest", type: "course-select", placeholder: "Choose Program Track", required: true }
    ]
  },
  contactForm: {
    title: "Send Enquiry",
    fields: [
      { id: "c1", label: "Full Name", type: "text", placeholder: "e.g. John Doe", required: true },
      { id: "c2", label: "Email Address", type: "email", placeholder: "john@institute.edu", required: true },
      { id: "c3", label: "Course Track", type: "course-select", placeholder: "Select Track", required: false },
      { id: "c4", label: "Detailed Message", type: "textarea", placeholder: "How can we help you?", required: true }
    ]
  },
  about: {
    beginning: {
      label: "CHAPTER 01 — OUR GENESIS",
      title: "Our Foundations",
      story: "Founded in 2024, S M Skills was born out of a critical observation: the widening gap between traditional academic knowledge and modern workforce demands.",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200"
    },
    learning: {
      label: "CHAPTER 02 — METHODOLOGY",
      title: "Learning by Doing",
      description: "We abandon the 'lecture-only' model. Here, learning happens through rigorous project-based simulations.",
      image1: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
      image2: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
      caption1: "Collaborative project review sessions.",
      caption2: "Practical labs led by industry veterans."
    },
    faculty: {
      label: "CHAPTER 03 — THE GUARDIANS",
      title: "Taught by Practitioners",
      description: "Our mentors are industry veterans with decades of experience.",
      members: [
        { id: "m1", name: "Institutional Registrar", role: "Admissions Head", bio: "Leading institutional growth through vocational excellence.", image: "https://i.pravatar.cc/150?u=reg" }
      ]
    },
    vision: {
      label: "CHAPTER 04 — CORE DNA",
      title: "Vision & Values",
      content: "To build a world where every learner is equipped with precision.",
      values: ["Relentless Practicality", "Absolute Transparency", "Industry Alignment", "Student Ownership"],
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
    },
    achievements: {
      label: "CHAPTER 05 — PROOF OF EXCELLENCE",
      title: "Milestones",
      ctaLabel: "JOIN THE NEXT BATCH",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200",
      stats: [
        { id: "a1", label: "Placement Rate", value: "94%" },
        { id: "a2", label: "Global Partners", value: "200+" }
      ]
    },
    extraChapters: []
  },
  courses: {
    list: generateCourses(),
    pageMeta: { title: "Vocational Programs", subtitle: "Industry-verified technical tracks optimized for global employability.", tagline: "PROFESSIONAL CURRICULA" }
  },
  notices: {
    list: [
      {
        id: "n1",
        date: "2024-06-01",
        title: "Fall 2024 Intake Open",
        description: "Secure your place in our flagship degree programs.",
        isImportant: true,
        category: 'New'
      }
    ],
    pageMeta: { title: "Campus Announcements", subtitle: "Stay informed about batch timings and events.", tagline: "OFFICIAL FEED" }
  },
  gallery: {
    list: [],
    pageMeta: { title: "Our Campus Life", subtitle: "Explore our facilities and achievements.", tagline: "VISUAL ARCHIVES" }
  },
  faqs: {
    list: [
      { id: "q1", question: "What is the admission criteria?", answer: "We look for a basic technical aptitude and a 12th pass certificate for our degree tracks.", category: "Admissions" }
    ],
    pageMeta: { title: "Help Center", subtitle: "Common questions regarding our institute.", tagline: "ASSISTANCE" }
  },
  placements: {
    pageMeta: { title: "Success Stories", subtitle: "Celebrating our graduates.", tagline: "PROVEN OUTCOMES" },
    pageDescription: "S M Skills graduates are consistently hired by innovative companies.",
    wallTitle: "Wall of Success",
    stats: [
      { id: "s1", label: "Average Hike", value: "85%", icon: "fa-chart-line" },
      { id: "s2", label: "Hiring Partners", value: "200+", icon: "fa-handshake" }
    ],
    reviews: [],
    partners: [
      { id: "p1", name: "Corporate Partner", icon: "fa-building" }
    ]
  },
  legal: {
    privacy: {
      title: "Data Privacy",
      subtitle: "How S M Skills manages your records.",
      sections: [{ id: "p1", title: "Policy", content: "Data is secure." }]
    },
    terms: {
      title: "Enrollment Terms",
      subtitle: "Code of conduct.",
      sections: [{ id: "t1", title: "Conduct", content: "Professionalism is required." }]
    }
  },
  career: {
    pageMeta: { title: "Career Lab", subtitle: "Interview prep with industry vets.", tagline: "SUCCESS ROADMAP" },
    hero: {
      title: "Career Lab",
      subtitle: "Interview prep with industry vets.",
      bgImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1600"
    },
    services: [
      { id: "cs1", title: "Mock Interviews", description: "Practice with leads.", icon: "fa-comments" }
    ],
    cta: {
      title: "Ready for Launch?",
      subtitle: "Schedule a session."
    }
  },
  leads: []
};
