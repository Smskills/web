import path from 'path';
// Fix: Use node:process to resolve "Property 'cwd' does not exist on type 'Process'" error by ensuring Node.js specific types
import process from 'node:process';

export const CONSTANTS = {
  UPLOADS: {
    // Fix: access cwd() from the correctly typed node:process module to identify current directory in Node.js
    ROOT: path.join(process.cwd(), 'uploads'),
    COURSES: 'courses',
    GALLERY: 'gallery',
    PROFILES: 'profiles'
  },
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10
  }
};