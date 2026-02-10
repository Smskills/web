
import { Course, PageMeta } from '../../types';

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

  const academicLevels: Array<'Certificate (NSDC)' | 'UG Certificate (NSDC)' | 'UG Diploma (NSDC)' | 'UG Degree' | 'Master'> = [
    'Certificate (NSDC)', 
    'UG Certificate (NSDC)', 
    'UG Diploma (NSDC)', 
    'UG Degree',
    'Master'
  ];

  academicLevels.forEach(level => {
    Object.entries(sectorSpecialties).forEach(([industry, specialties]) => {
      
      if (level === 'Master') {
        let masterName = '';
        switch(industry) {
            case "Automotive": masterName = "M. Voc in Automobile Production"; break;
            case "Banking, Financial Services & Insurance": masterName = "M. Voc in Banking, Financial Services and Insurance"; break;
            case "Electronics and Hardware": masterName = "M. Voc in Electronics Manufacturing"; break;
            case "IT/ITES": masterName = "M. Voc in Application of Computer"; break;
            case "Retail": masterName = "M. Voc in Retail Management"; break;
            case "Tourism and Hospitality": masterName = "M. Voc in Travel and Tourism"; break;
            default: return;
        }

        list.push({
          id: `c-${idCounter++}`,
          name: `${masterName} (NSDC)`,
          academicLevel: level as any,
          industry: industry,
          duration: "2 Years",
          mode: 'Offline',
          status: 'Active',
          image: `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800&industry=${industry.replace(/\s+/g, '')}`,
          description: `High-level technical proficiency program. This ${masterName} program is designed for advanced strategic roles within the ${industry} sector.`,
          price: "Rs. 50,000 / year",
          certification: `Master (NSDC)`,
          eligibility: "Graduate",
          benefits: "• Industry Internship\n• Hands-on Lab Training\n• Placement Assistance\n• Stipend Opportunities"
        });
        return;
      }

      specialties.forEach(specName => {
        let duration = "1 Year";
        let price = "Rs. 50,000 / year";
        let eligibility = "12th Pass";
        let mode: 'Online' | 'Offline' | 'Hybrid' = 'Offline';
        let benefits = "• Industry Internship\n• Hands-on Lab Training\n• Placement Assistance\n• Stipend Opportunities";

        if (level === 'Certificate (NSDC)') {
            duration = "3 Months";
            price = "Rs. 12,000";
            eligibility = "10th Pass";
            mode = 'Hybrid';
        } else if (level === 'UG Certificate (NSDC)') {
            duration = "1 Year";
            price = "Rs. 50,000";
            eligibility = "12th Pass";
            mode = 'Hybrid';
        } else if (level === 'UG Diploma (NSDC)') {
            duration = "2 Years";
            price = "Rs. 50,000 / year";
        } else if (level === 'UG Degree') {
            duration = "3 Years";
        }

        let courseNameLevel: string = level;
        if (level === 'UG Certificate (NSDC)') courseNameLevel = 'UG Certificate';
        if (level === 'Certificate (NSDC)') courseNameLevel = 'Certificate';

        // Set certification specifically to include (NSDC) as per level
        /**
         * Fix: Explicitly type certificationValue as string to prevent narrow union type inference.
         * Removed redundant check for 'Master' level since it is handled by early return above.
         */
        let certificationValue: string = level;
        if (level === 'UG Degree') certificationValue = 'UG Degree (NSDC)';

        list.push({
          id: `c-${idCounter++}`,
          name: `${courseNameLevel} in ${specName} (NSDC)`,
          academicLevel: level as any,
          industry: industry,
          duration: duration,
          mode: mode,
          status: 'Active',
          image: `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800&industry=${industry.replace(/\s+/g, '')}`,
          description: `Institutional academic track in ${specName}. This ${level} program provides specialized technical proficiency and industry-aligned skills.`,
          price: price,
          certification: certificationValue,
          eligibility: eligibility,
          benefits: benefits
        });
      });
    });
  });

  return list;
};

export const coursesPageMeta: PageMeta = { 
  title: "Vocational Programs", 
  subtitle: "Industry-verified technical tracks optimized for global employability.", 
  tagline: "PROFESSIONAL CURRICULA" 
};
