
import { HomeConfig } from '../../types';

export const homeDefaults: HomeConfig = {
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
};
