
import { AppState } from '../types';
import { siteDefaults } from './defaults/site';
import { homeDefaults } from './defaults/home';
import { generateCourses, coursesPageMeta } from './defaults/courses';

export const INITIAL_CONTENT: AppState = {
  site: siteDefaults,
  theme: {
    primary: "#059669",
    secondary: "#f8fafc", // Flipped from dark slate to very light gray
    accent: "#10b981",
    radius: "large"
  },
  home: homeDefaults,
  customPages: [],
  enrollmentForm: {
    title: "S M Skills Official Enrollment",
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
      { id: "f2", label: "Email address", type: "email", placeholder: "mike@example.com", required: true },
      { id: "f3", label: "Father's / Guardian's name", type: "text", placeholder: "Enter Father's Name", required: true },
      { id: "f3_mother", label: "Mother's / Guardian's name", type: "text", placeholder: "Enter Mother's Name", required: true },
      { id: "f4", label: "Date of Birth", type: "date", placeholder: "", required: true },
      { id: "f5", label: "Primary contact number", type: "tel", placeholder: "+91", required: true },
      { id: "f6", label: "Alternative contact number", type: "tel", placeholder: "+91", required: false },
      { id: "f7_addr", label: "Permanent residential address", type: "textarea", placeholder: "House No, Street, Village/Town", required: true },
      { id: "f7_district", label: "District", type: "text", placeholder: "e.g. Nagaon", required: true },
      { id: "f7_state", label: "State", type: "text", placeholder: "e.g. Assam", required: true },
      { id: "f7_pin", label: "Pin code", type: "text", placeholder: "6-digit PIN", required: true },
      { id: "f9", label: "Course interest", type: "course-select", placeholder: "Choose Program Track", required: true },
      { id: "f11", label: "Current education", type: "select", placeholder: "Select Highest Qualification", required: true, options: ["Secondary School (10th)", "Higher Secondary (12th)", "Diploma Holder", "Graduate / Bachelor's", "Post Graduate", "Other (Specify in Additional Question)"] },
      { id: "f10", label: "Source of information", type: "select", placeholder: "How did you hear about us?", required: true, options: ["Social Media", "Friend / Student Referral", "Newspaper / Print", "Web Search", "Educational Seminar"] },
      { id: "f12", label: "Additional question", type: "textarea", placeholder: "Any specific queries for the registrar?", required: false }
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
    pageMeta: coursesPageMeta
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
