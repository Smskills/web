
import { AppState, Course } from '../types';

const sectorSpecialties: Record<string, string[]> = {
  "Agriculture": ["Agriculture"],
  "Automotive": ["Automobile Servicing", "Automobile Production (Welding)", "Automobile Production (Machining)"],
  "Apparel": ["Fashion Designing"],
  "Banking, Financial Services & Insurance": ["Banking, financial Services & Insurance", "Account & Taxation"],
  "Beauty & Wellness": ["Therapeutic Yoga"],
  "Capital Goods": ["Production", "Manufacturing"],
  "Construction": ["Construction Technology"],
  "Electronics and Hardware": ["Refrigeration & Air Conditioning", "Electronics Manufacturing Services", "Computer Hardware & Networking", "Electrical & Electronic Assembly"],
  "Food Processing": ["Food processing"],
  "Furniture & Fitting": ["Interior Designing"],
  "Green Jobs": ["Renewable Energy"],
  "Healthcare": ["Patient Care Management", "Medical Laboratory Technician", "Radiology & Imaging Technology", "Operation Theatre Technology", "Nursing Care", "Central Sterile Supply Department", "Dialysis Technology", "Hospital Administration"],
  "IT/ITES": ["Application Development", "Information Technology"],
  "Life Science": ["Life Sciences"],
  "Logistics": ["Logistic Operations Management"],
  "Media & Entertainment": ["Multimedia"],
  "Mining": ["Mining"],
  "Plumbing": ["Plumbing Skills"],
  "Retail": ["Retail Management"],
  "Rubber, Chemical & Petrochemical": ["Plastic Technology", "Polymer Technology"],
  "Telecom": ["Telecommunication"],
  "Textile & Handloom": ["Textile Technology"],
  "Tourism and Hospitality": ["Hotel Management", "Travel & Tourism"]
};

const generateCourses = (): Course[] => {
  const list: Course[] = [];
  let idCounter = 1;

  const academicLevels: Array<'Certificate' | 'UG Certificate' | 'UG Diploma' | 'UG Degree' | 'Master'> = [
    'Certificate', 
    'UG Certificate', 
    'UG Diploma', 
    'UG Degree',
    'Master'
  ];

  academicLevels.forEach(level => {
    Object.entries(sectorSpecialties).forEach(([industry, specialties]) => {
      
      // Specialized Logic for Master level overrides
      if (level === 'Master') {
        let masterName = '';
        switch(industry) {
            case "Automotive": 
                masterName = "M. Voc in Automobile Production"; break;
            case "Banking, Financial Services & Insurance": 
                masterName = "M. Voc in Banking, Financial Services and Insurance"; break;
            case "Electronics and Hardware": 
                masterName = "M. Voc in Electronics Manufacturing"; break;
            case "IT/ITES": 
                masterName = "M. Voc in Application of Computer"; break;
            case "Retail": 
                masterName = "M. Voc in Retail Management"; break;
            case "Tourism and Hospitality": 
                masterName = "M. Voc in Travel and Tourism"; break;
            default:
                return; // Only allowed Master sectors as per institutional requirement
        }

        list.push({
          id: `c-${idCounter++}`,
          name: masterName,
          academicLevel: level,
          industry: industry,
          duration: "2 Years",
          mode: 'Offline',
          status: 'Active',
          image: `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800&industry=${industry.replace(/\s+/g, '')}`,
          description: `High-level technical proficiency program. This ${masterName} program is designed for advanced strategic roles within the ${industry} sector.`,
          price: "Rs. 50,000 / year",
          certification: `${level} Certification`,
          eligibility: "12th Pass",
          benefits: "• Industry Internship\n• Hands-on Lab Training\n• Placement Assistance\n• Stipends Opportunities"
        });
        return; // Skip the general specialties loop for Master entries
      }

      // Default logic for other levels
      specialties.forEach(specName => {
        let duration = "1 Year";
        let price = "Rs. 50,000 / year";
        let eligibility = "12th Pass";
        let benefits = "• Industry Internship\n• Hands-on Lab Training\n• Placement Assistance\n• Stipend Opportunities";

        if (level === 'Certificate') {
            duration = "3 Months";
            price = "Rs. 12,000";
            eligibility = "12th Pass";
            benefits = "• Industry Internship\n• Hands-on Lab Training\n• Placement Assistance";
        } else if (level === 'UG Certificate') {
            duration = "1 Year";
        } else if (level === 'UG Diploma') {
            duration = "3 Years";
        } else if (level === 'UG Degree') {
            duration = "3 Years";
        }

        list.push({
          id: `c-${idCounter++}`,
          name: `${level} in ${specName}`,
          academicLevel: level,
          industry: industry,
          duration: duration,
          mode: 'Offline',
          status: 'Active',
          image: `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800&industry=${industry.replace(/\s+/g, '')}`,
          description: `Institutional academic track in ${specName}. This ${level} program provides specialized technical proficiency and industry-aligned skills.`,
          price: price,
          certification: `${level} Certification`,
          eligibility: eligibility,
          benefits: benefits
        });
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
      subtext: "SECURE YOUR FUTURE WITH OUR CERTIFICATE & DEGREE TRACKS.",
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
      subtitle: "Join S M Skills for specialized vocational tracks. Build your career with veterans.",
      ctaText: "Browse Programs",
      ctaLink: "/academics",
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
      coursesTitle: "Vocational Tracks",
      coursesSubtitle: "Explore our diverse range of technical programs.",
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
        description: "Secure your place in our flagship programs.",
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
      { id: "q1", question: "What is the admission criteria?", answer: "We look for a basic technical aptitude and a 10th or 12th pass certificate depending on the track.", category: "Admissions" }
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
