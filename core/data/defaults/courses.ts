
import { Course, PageMeta } from '../../types';

/**
 * Institutional standard specialties based on NSDC vocational sectors.
 */
/**
 * Job Role based specialties for Certificate and Short Term courses.
 */
const jobRoleSpecialties: Record<string, string[]> = {
  "Apparel": ["Fashion Designer", "Self Employed Tailor"],
  "Automotive": [
    "Automotive Showroom Host", 
    "Automotive Telecaller", 
    "Four Wheeler Service Assistant", 
    "Two Wheeler Service Technician", 
    "Commercial Vehicle Driver", 
    "Automotive Welding Machine Operator (Manual and Robotics)", 
    "Automotive Sales Lead", 
    "Automotive Sales Consultant", 
    "Automotive Accessory Fitter", 
    "Sales Consultant (Pre-owned Vehicles)"
  ],
  "Beauty & Wellness": [
    "Assistant Beauty Therapist",
    "Beauty Therapist",
    "Hair Dresser & Stylist",
    "Assistant Spa Therapist",
    "Pedicurist and Manicurist",
    "Bridal Makeup Artist",
    "Professional Makeup Artist"
  ],
  "Banking, Financial Services & Insurance": [
    "Debt Recovery Agent",
    "Accounts Executive",
    "Business Correspondence and Business Facilitator (BFBCBF)"
  ],
  "Electronics and Hardware": [
    "Field Technician Computing and Peripherals",
    "Field Technician Networking and Storage",
    "Solar Panel Installation Technician",
    "Field Technician Other Home Appliances",
    "DTH Set Top Box Installation & Service Technician",
    "Multi Skill Technician"
  ],
  "Food Processing": [
    "Pickle Making Technician",
    "Assistant Baking Technician",
    "Baking Assistant",
    "Certification in Food Production"
  ],
  "IT/ITES": [
    "Junior Software Developer",
    "IT Helpdesk Attendant",
    "Domestic Biometric Data Operator",
    "Domestic Data Entry Operator",
    "Digital Mitra"
  ],
  "Logistics": [
    "Courier Delivery Executive",
    "Consignment Booking Assistant"
  ],
  "Retail": [
    "Retail Sales Assistant",
    "Salesperson (Distribution)",
    "Retail Cashier",
    "Retail Sales Associate",
    "Retail Trainee Associate"
  ],
  "Telecom": [
    "Call Center Executive",
    "Customer Service Representative (Meet and Greet)"
  ],
  "Tourism and Hospitality": [
    "Guest Service Executive (Housekeeping)",
    "Guest Service Associate (Housekeeping)",
    "Pantry Assistant",
    "Guest Service Associate (Front Office)",
    "Food and Beverage Service Assistant",
    "Travel Consultant",
    "Tour Guide",
    "Counter Sales Executive (Tourism and Hospitality)",
    "Food Delivery Associate",
    "Front Office Assistant",
    "Front Office Executive",
    "Transport Coordinator – Tourism and Hospitality",
    "Tour Escort"
  ]
};

/**
 * Vocational specialties for UG Certificate, UG Diploma, and B.Voc Degree programs.
 */
const vocationalSpecialties: Record<string, string[]> = {
  "Agriculture": ["Agriculture"],
  "Automotive": ["Automobile Servicing", "Automobile Production (Welding)", "Automobile Production (Machining)"],
  "Apparel": ["Fashion Designing"],
  "Banking, Financial Services & Insurance": ["Banking, Financial Services and Insurance", "Account and Taxation"],
  "Beauty & Wellness": ["Therapeutic Yoga"],
  "Capital Goods": ["Production", "Manufacturing"],
  "Construction": ["Construction Technology", "Refrigeration & Air Conditioning"],
  "Electronics and Hardware": ["Electronics Manufacturing Services", "Computer Hardware and Networking", "Electrical and Electronic Assembly"],
  "Food Processing": ["Food Processing"],
  "Furniture & Fitting": ["Interior Designing"],
  "Green Jobs": ["Renewable Energy"],
  "Healthcare": ["Patient Care Management", "Medical Laboratory Technician", "Radiology and Imaging Technology", "Operation Theatre Technology", "Nursing Care", "Central Sterile Supply Department", "Dialysis Technology", "Hospital Administration"],
  "IT/ITES": ["Application Development", "Information Technology"],
  "Life Science": ["Life Sciences"],
  "Logistics": ["Logistics Operations Management"],
  "Media & Entertainment": ["Multimedia"],
  "Mining": ["Mining"],
  "Plumbing": ["Plumbing Skills"],
  "Retail": ["Retail Management"],
  "Rubber, Chemical & Petrochemical": ["Plastic Technology", "Polymer Technology"],
  "Telecom": ["Telecommunication"],
  "Textile & Handloom": ["Textile Technology"],
  "Tourism and Hospitality": ["Travel and Tourism", "Hotel Management"]
};

/**
 * Master specialties for M.Voc programs.
 */
const masterSpecialties: Record<string, string[]> = {
  "Automotive": ["Automobile Production"],
  "Banking, Financial Services & Insurance": ["Banking, Financial Services and Insurance"],
  "Electronics and Hardware": ["Electronics Manufacturing"],
  "IT/ITES": ["Application of Computer"],
  "Retail": ["Retail Management"],
  "Tourism and Hospitality": ["Travel and Tourism"]
};

export const generateCourses = (): Course[] => {
  const list: Course[] = [];
  let idCounter = 1;

  const academicLevels: Array<'Certificate (NSDC)' | 'UG Certificate (NSDC)' | 'UG Diploma' | 'UG Degree' | 'Master' | 'Short Term'> = [
    'Certificate (NSDC)',
    'UG Certificate (NSDC)', 
    'UG Diploma', 
    'UG Degree',
    'Master',
    'Short Term'
  ];

  academicLevels.forEach(level => {
    let specialtiesMap = vocationalSpecialties;
    if (level === 'Certificate (NSDC)' || level === 'Short Term') {
      specialtiesMap = jobRoleSpecialties;
    } else if (level === 'Master') {
      specialtiesMap = masterSpecialties;
    }

    Object.entries(specialtiesMap).forEach(([industry, specialties]) => {
      specialties.forEach(specName => {
        let duration = "1 Year";
        if (level === 'UG Diploma') duration = "2 Years";
        if (level === 'UG Degree') duration = "3 Years";
        if (level === 'Master') duration = "2 Years";
        if (level === 'Short Term') duration = "3-6 Months";
        if (level === 'Certificate (NSDC)') duration = "3 Months";

        let displayName = "";
        if (level === 'Certificate (NSDC)') {
          displayName = `Certificate in ${specName}`;
        } else if (level === 'Short Term') {
          displayName = `Short Term Course in ${specName}`;
        } else if (level === 'UG Certificate (NSDC)') {
          displayName = `UG Certificate in ${specName}`;
        } else if (level === 'UG Diploma') {
          displayName = `UG Diploma in ${specName}`;
        } else if (level === 'UG Degree') {
          displayName = `UG Degree in ${specName}`;
        } else if (level === 'Master') {
          displayName = `M.Voc in ${specName}`;
        } else {
          displayName = `${level} in ${specName}`;
        }

        list.push({
          id: `c-${idCounter++}`,
          name: displayName,
          academicLevel: level,
          industry: industry,
          duration: duration,
          mode: 'Offline',
          status: 'Active',
          image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
          description: `Comprehensive academic track in ${specName} aligned with ${industry} industry standards.`,
          price: level === 'Certificate (NSDC)' ? "Rs. 12,000" : "Rs. 50,000 / year",
          certification: `${level} (Government Verified)`,
          eligibility: "12th Pass",
          benefits: "Industry Internship\nHands-on Lab Training\nPlacement Assistance\nStipend Opportunities",
          showBenefits: true
        });
      });
    });
  });

  return list;
};

export const coursesPageMeta: PageMeta = { title: "Vocational Programs", subtitle: "Industry-verified technical tracks optimized for global employability." };
