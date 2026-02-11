
import { Course, PageMeta } from '../../types';

const sectorImages: Record<string, string> = {
  "Agriculture": "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2",
  "Automotive": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3",
  "Apparel": "https://images.unsplash.com/photo-1558769132-cb1aea458c5e",
  "Banking, Financial Services & Insurance": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85",
  "Beauty & Wellness": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
  "Capital Goods": "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122",
  "Construction": "https://images.unsplash.com/photo-1503387762-592dea58ef23",
  "Electronics and Hardware": "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0",
  "Food Processing": "https://images.unsplash.com/photo-1556761175-b413da4baf72",
  "Furniture & Fitting": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6",
  "Green Jobs": "https://images.unsplash.com/photo-1466611653911-95282fc3656b",
  "Healthcare": "https://images.unsplash.com/photo-1516549655169-df83a0774514",
  "IT/ITES": "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
  "Life Science": "https://images.unsplash.com/photo-1532187878403-1947057767a7",
  "Logistics": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d",
  "Media & Entertainment": "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
  "Mining": "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2",
  "Plumbing": "https://images.unsplash.com/photo-1504148455328-c376907d081c",
  "Retail": "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
  "Rubber, Chemical & Petrochemical": "https://images.unsplash.com/photo-1518152006812-edab29b069ac",
  "Telecom": "https://images.unsplash.com/photo-1520869562399-e772f042f422",
  "Textile & Handloom": "https://images.unsplash.com/photo-1528476513691-07e6f563d97f",
  "Tourism and Hospitality": "https://images.unsplash.com/photo-1566073771259-6a8506099945"
};

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
      
      const industryImageUrl = sectorImages[industry] ? `${sectorImages[industry]}?auto=format&fit=crop&q=80&w=800` : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800";

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
          image: industryImageUrl,
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
            eligibility = "12th Pass";
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
          image: industryImageUrl,
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
