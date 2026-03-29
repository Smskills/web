
import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';
import { sendResponse } from '../utils/response';
import { GenericRepository } from '../repositories/generic.repo';
import { mapToCamelCase } from '../utils/mapper';

export class ConfigController {
  /**
   * Fetch the global site configuration from MySQL, merging normalized tables
   */
  static async getConfig(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Fetch the base config (theme, site, home, etc.)
      const [configRows]: any = await pool.execute('SELECT config_json FROM site_config WHERE id = 1');
      let config: any = {};
      
      if (configRows.length > 0 && configRows[0].config_json) {
        try {
          config = JSON.parse(configRows[0].config_json);
        } catch (e) {
          console.error('Error parsing config_json:', e);
        }
      }

      // 2. Fetch normalized entities in parallel
      const [
        courses,
        notices,
        gallery,
        faqs,
        pages,
        placementStats,
        studentReviews,
        industryPartners,
        careerServices,
        teamMembers,
        achievementStats,
        extraChapters,
        legalSections
      ] = await Promise.all([
        GenericRepository.getAll('courses'),
        GenericRepository.getAll('notices'),
        GenericRepository.getAll('gallery'),
        GenericRepository.getAll('faqs'),
        GenericRepository.getAll('custom_pages'),
        GenericRepository.getAll('placement_stats'),
        GenericRepository.getAll('student_reviews'),
        GenericRepository.getAll('industry_partners'),
        GenericRepository.getAll('career_services'),
        GenericRepository.getAll('team_members'),
        GenericRepository.getAll('achievement_stats'),
        GenericRepository.getAll('extra_chapters'),
        GenericRepository.getAll('legal_sections')
      ]);

      // 3. Merge into AppState structure and map to camelCase
      config.courses = mapToCamelCase(courses);
      config.notices = mapToCamelCase(notices);
      config.gallery = mapToCamelCase(gallery);
      config.faqs = mapToCamelCase(faqs);
      config.pages = mapToCamelCase(pages);
      
      // Handle nested structures
      config.placements = config.placements || {};
      config.placements.stats = mapToCamelCase(placementStats);
      config.placements.reviews = mapToCamelCase(studentReviews);
      config.placements.partners = mapToCamelCase(industryPartners);

      config.careerServices = config.careerServices || {};
      config.careerServices.services = mapToCamelCase(careerServices);

      config.about = config.about || {};
      config.about.team = mapToCamelCase(teamMembers);
      config.about.stats = mapToCamelCase(achievementStats);
      config.about.extraChapters = mapToCamelCase(extraChapters);

      const mappedLegal = mapToCamelCase(legalSections) as any[];
      config.legal = config.legal || { privacy: { sections: [] }, terms: { sections: [] } };
      config.legal.privacy.sections = mappedLegal.filter(s => s.type === 'privacy');
      config.legal.terms.sections = mappedLegal.filter(s => s.type === 'terms');

      return sendResponse(res, 200, true, 'Configuration retrieved', config);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update the global site configuration (Upsert logic with normalization)
   */
  static async updateConfig(req: Request, res: Response, next: NextFunction) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const config = (req as any).body;

      // 1. Extract and normalize entities
      const { 
        courses, notices, gallery, faqs, pages, 
        placements, careerServices, about, legal,
        ...baseConfig 
      } = config;

      // 2. Update normalized tables (Clear and bulk insert for simplicity in sync)
      
      // Courses
      await connection.execute('DELETE FROM courses');
      if (courses?.length) {
        const courseValues = courses.map((c: any) => [
          c.name, c.duration, c.academicLevel, c.industry, c.certification, 
          c.mode, c.description, c.status, c.image, c.cardImage, 
          c.price, c.eligibility, c.benefits, c.showBenefits ? 1 : 0, c.isFeatured ? 1 : 0
        ]);
        await connection.query(
          'INSERT INTO courses (name, duration, academic_level, industry, certification, mode, description, status, image, card_image, price, eligibility, benefits, show_benefits, is_featured) VALUES ?',
          [courseValues]
        );
      }

      // Notices
      await connection.execute('DELETE FROM notices');
      if (notices?.length) {
        const noticeValues = notices.map((n: any) => [
          n.date, n.title, n.description, n.isImportant ? 1 : 0, n.category, n.link
        ]);
        await connection.query(
          'INSERT INTO notices (date, title, description, is_important, category, link) VALUES ?',
          [noticeValues]
        );
      }

      // Gallery
      await connection.execute('DELETE FROM gallery');
      if (gallery?.length) {
        const galleryValues = gallery.map((g: any) => [g.url, g.category, g.title]);
        await connection.query('INSERT INTO gallery (url, category, title) VALUES ?', [galleryValues]);
      }

      // FAQs
      await connection.execute('DELETE FROM faqs');
      if (faqs?.length) {
        const faqValues = faqs.map((f: any) => [f.question, f.answer, f.category]);
        await connection.query('INSERT INTO faqs (question, answer, category) VALUES ?', [faqValues]);
      }

      // Custom Pages
      await connection.execute('DELETE FROM custom_pages');
      if (pages?.length) {
        const pageValues = pages.map((p: any) => [p.title, p.slug, p.content, p.visible ? 1 : 0, p.showHeader ? 1 : 0]);
        await connection.query('INSERT INTO custom_pages (title, slug, content, visible, show_header) VALUES ?', [pageValues]);
      }

      // Placements
      await connection.execute('DELETE FROM placement_stats');
      if (placements?.stats?.length) {
        const statValues = placements.stats.map((s: any) => [s.label, s.value, s.icon]);
        await connection.query('INSERT INTO placement_stats (label, value, icon) VALUES ?', [statValues]);
      }

      await connection.execute('DELETE FROM student_reviews');
      if (placements?.reviews?.length) {
        const reviewValues = placements.reviews.map((r: any) => [
          r.name, r.course, r.company, r.companyIcon, r.image, r.text, r.salaryIncrease, r.role
        ]);
        await connection.query(
          'INSERT INTO student_reviews (name, course, company, company_icon, image, text, salary_increase, role) VALUES ?',
          [reviewValues]
        );
      }

      await connection.execute('DELETE FROM industry_partners');
      if (placements?.partners?.length) {
        const partnerValues = placements.partners.map((p: any) => [p.name, p.icon, p.image]);
        await connection.query('INSERT INTO industry_partners (name, icon, image) VALUES ?', [partnerValues]);
      }

      // Career Services
      await connection.execute('DELETE FROM career_services');
      if (careerServices?.services?.length) {
        const serviceValues = careerServices.services.map((s: any) => [s.title, s.description, s.icon, s.image]);
        await connection.query('INSERT INTO career_services (title, description, icon, image) VALUES ?', [serviceValues]);
      }

      // About
      await connection.execute('DELETE FROM team_members');
      if (about?.team?.length) {
        const teamValues = about.team.map((t: any) => [t.name, t.role, t.bio, t.image]);
        await connection.query('INSERT INTO team_members (name, role, bio, image) VALUES ?', [teamValues]);
      }

      await connection.execute('DELETE FROM achievement_stats');
      if (about?.stats?.length) {
        const achValues = about.stats.map((a: any) => [a.label, a.value]);
        await connection.query('INSERT INTO achievement_stats (label, value) VALUES ?', [achValues]);
      }

      await connection.execute('DELETE FROM extra_chapters');
      if (about?.extraChapters?.length) {
        const chapterValues = about.extraChapters.map((c: any) => [c.label, c.title, c.story, c.image]);
        await connection.query('INSERT INTO extra_chapters (label, title, story, image) VALUES ?', [chapterValues]);
      }

      // Legal
      await connection.execute('DELETE FROM legal_sections');
      const legalValues: any[] = [];
      if (legal?.privacy?.sections?.length) {
        legal.privacy.sections.forEach((s: any) => legalValues.push(['privacy', s.title, s.content]));
      }
      if (legal?.terms?.sections?.length) {
        legal.terms.sections.forEach((s: any) => legalValues.push(['terms', s.title, s.content]));
      }
      if (legalValues.length) {
        await connection.query('INSERT INTO legal_sections (type, title, content) VALUES ?', [legalValues]);
      }

      // 3. Update the base config (theme, site, home, etc.)
      const baseConfigStr = JSON.stringify(baseConfig);
      await connection.execute(
        'INSERT INTO site_config (id, config_json) VALUES (1, ?) ON DUPLICATE KEY UPDATE config_json = ?',
        [baseConfigStr, baseConfigStr]
      );

      await connection.commit();
      return sendResponse(res, 200, true, 'Configuration synchronized to database');
    } catch (error) {
      await connection.rollback();
      next(error);
    } finally {
      connection.release();
    }
  }
}
