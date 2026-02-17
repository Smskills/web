
import { Course, PageMeta } from '../../types';

/**
 * Institutional standard specialties based on NSDC vocational sectors.
 */
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

export const generateCourses = (): Course[] => {
  const list: Course[] = [];
  let idCounter = 1;

  const academicLevels: Array<'UG Certificate (NSDC)' | 'UG Diploma (NSDC)' | 'B. Voc' | 'UG Degree' | 'Master'> = [
    'UG Certificate (NSDC)', 
    'UG Diploma (NSDC)', 
    'B. Voc', 
    'UG Degree',
    'Master'
  ];

  academicLevels.forEach(level => {
    Object.entries(sectorSpecialties).forEach(([industry, specialties]) => {
      specialties.forEach(specName => {
        let duration = "1 Year";
        if (level === 'UG Diploma (NSDC)') duration = "2 Years";
        if (level === 'B. Voc' || level === 'UG Degree') duration = "3 Years";
        if (level === 'Master') duration = "2 Years";

        list.push({
          id: `c-${idCounter++}`,
          name: `${level} in ${specName}`,
          academicLevel: level,
          industry: industry,
          duration: duration,
          mode: 'Offline',
          status: 'Active',
          image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
          description: `Comprehensive academic track in ${specName} aligned with ${industry} industry standards.`,
          price: "Rs. 50,000 / year",
          certification: `${level} (Government Verified)`,
          eligibility: "12th Pass",
          benefits: "• Industry Internship\n• Hands-on Lab Training\n• Placement Assistance\n• Stipend Opportunities"
        });
      });
    });
  });

  return list;
};

export const coursesPageMeta: PageMeta = { title: "Vocational Programs", subtitle: "Industry-verified technical tracks optimized for global employability." };
