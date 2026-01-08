import path from 'path';
// Removed redundant process import to ensure use of correctly-typed global process

export const CONSTANTS = {
  UPLOADS: {
    // Using global process.cwd() for robust absolute path generation to fix "Property 'cwd' does not exist" error
    ROOT: path.join(process.cwd(), 'src', 'uploads'),
    COURSES: 'courses',
    GALLERY: 'gallery',
    PROFILES: 'profiles'
  },
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10
  }
};