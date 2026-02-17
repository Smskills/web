
import { SiteConfig } from '../../types';

export const siteDefaults: SiteConfig = {
  name: "S M Skills",
  tagline: "SM SKILLS TRAINING INSTITUTE • ESTD 2024",
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
    address: "J M Road, Christianpatty, Nagaon, Assam",
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
    { label: "Academics", path: "/courses" },
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
    bottomText: "S M SKILLS • ESTD 2024",
    supportLinks: [
      { label: "Privacy Policy", path: "/privacy-policy" },
      { label: "Terms of Service", path: "/terms-of-service" },
      { label: "Placement Wall", path: "/placement-review" }
    ]
  }
};
