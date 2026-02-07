
import { AppState, Course } from '../types';

const defaultIndustries = [
  "Telecom",
  "Tourism & Hospitality",
  "Healthcare",
  "IT & Software",
  "Retail",
  "Automotive"
];

const generatedCourses: Course[] = [
  {
    id: "c1",
    name: "Call Center Executive",
    academicLevel: "Certificate",
    industry: "Telecom",
    duration: "6 Months",
    mode: "Offline",
    status: "Active",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
    description: "Specialized training for telecommunications customer support roles.",
    price: "Rs. 15,000",
    certification: "Institutional Certificate",
    eligibility: "12th Pass",
    benefits: "Placement Support"
  },
  {
    id: "c2",
    name: "Tour Guide",
    academicLevel: "Certificate",
    industry: "Tourism & Hospitality",
    duration: "1 Year",
    mode: "Offline",
    status: "Active",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
    description: "Learn professional tour management and hospitality standards.",
    price: "Rs. 25,000",
    certification: "National Board",
    eligibility: "12th Pass",
    benefits: "Field Internships"
  }
];

export const INITIAL_CONTENT: AppState = {
  site: {
    name: "S M Skills",
    tagline: "TRAINING INSTITUTE • ESTD 2024",
    logo: "https://lwfiles.mycourse.app/62a6cd5-public/6efdd5e.png", 
    loginLabel: "DASHBOARD",
    admissionAlert: {
      enabled: true,
      text: "2024 ADMISSIONS NOW OPEN:",
      subtext: "SECURE YOUR FUTURE WITH OUR VOCATIONAL TRACKS.",
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
      subtitle: "Join S M Skills for specialized training programs. Build your career with veterans.",
      ctaText: "Browse Academics",
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
      coursesTitle: "Technical Programs",
      coursesSubtitle: "Explore our diverse range of UG, PG, and Specialized vocational tracks.",
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
    description: "Please complete the comprehensive academic application form below. Our registrar team evaluates each candidate for program alignment.",
    successTitle: "Application Received",
    successMessage: "Your registration is being processed. An institutional registrar will review your application and contact you within 48 business hours for the next steps.",
    roadmapTitle: "Enrollment Flow",
    roadmapSteps: [
      { id: "s1", title: "Identity Submission", description: "Provide verifiable academic and personal records for initial screening." },
      { id: "s2", title: "Technical Review", description: "Specialists evaluate your alignment with the chosen program track." },
      { id: "s3", title: "Confirmation", description: "Official admission offer and joining protocols sent via advisor call." }
    ],
    fields: [
      { id: "f1", label: "Student Full Name", type: "text", placeholder: "e.g. Michael Smith", required: true },
      { id: "f2", label: "Email Address", type: "email", placeholder: "mike@example.com", required: true },
      { id: "f3", label: "Father's / Guardian Name", type: "text", placeholder: "Enter Full Name", required: true },
      { id: "f4", label: "Date of Birth", type: "date", placeholder: "", required: true },
      { id: "f5", label: "Primary Contact Number", type: "tel", placeholder: "+1 (555) 000-0000", required: true },
      { id: "f8", label: "Highest Qualification", type: "select", placeholder: "Select Qualification", required: true, options: ["High School", "Secondary School (10th)", "Higher Secondary (12th)", "Diploma Holder", "Graduate / Bachelor's", "Post Graduate"] },
      { id: "f9", label: "Course Interest", type: "course-select", placeholder: "Choose Program Track", required: true },
      { id: "f11", label: "Current Education / Occupation", type: "text", placeholder: "e.g. Final year student / Freelancer", required: true }
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
      story: "Founded in 2024, S M Skills was born out of a critical observation: the widening gap between traditional academic knowledge and the rapidly evolving demands of the modern workforce.",
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
      description: "Our mentors aren't just academics; they are industry veterans.",
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
        { id: "a1", label: "Years of Heritage", value: "ESTD 2024" },
        { id: "a2", label: "Success Rate", value: "94%" },
        { id: "a3", label: "Global Partners", value: "200+" }
      ]
    },
    extraChapters: []
  },
  courses: {
    list: generatedCourses,
    pageMeta: { title: "Technical Programs", subtitle: "Browse through our industry-verified technical tracks.", tagline: "PROFESSIONAL CURRICULA" }
  },
  notices: {
    list: [
      {
        id: "n1",
        date: "2024-06-01",
        title: "Summer 2024 Intake Open",
        description: "Secure your place in our flagship engineering and design programs.",
        isImportant: true,
        category: 'New'
      }
    ],
    pageMeta: { title: "Campus Announcements", subtitle: "Stay informed about batch timings.", tagline: "OFFICIAL FEED" }
  },
  gallery: {
    list: [],
    pageMeta: { title: "Our Campus Life", subtitle: "Explore our facilities.", tagline: "VISUAL ARCHIVES" }
  },
  faqs: {
    list: [
      { id: "q1", question: "What is the admission criteria?", answer: "We look for a basic technical aptitude and a passion for learning.", category: "Admissions" }
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
      { id: "p1", name: "Partner Org", icon: "fa-building" }
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
