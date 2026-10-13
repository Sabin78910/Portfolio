import { test } from 'node:test';
import assert from 'node:assert/strict';
import { skills } from '../data/profile.ts';

// Every CV skill shown on the site must survive regrouping. Capability rows are titles only (owner choice),
// so detail-level skills (MICE, PCA, triggers, UAT...) are on the CV, not checked here.
const cv = [
  'Python', 'SQL', 'PHP', 'JavaScript', 'R', 'HTML', 'CSS', 'Java',
  'Flask', 'Laravel 11', 'REST APIs', 'Oracle APEX', 'Bootstrap 5', 'PHPMailer',
  'PostgreSQL', 'MySQL', 'Oracle Database',
  'Agile', 'Scrum', 'QA', 'Git', 'GitHub', 'VS Code', 'PayPal API',
  'FastAPI', 'Pydantic', 'pytest', 'Docker', 'GitHub Actions', 'Linux', 'AWS', 'React', 'Next.js', 'Android development', 'Game development',
];

test('every CV skill is represented in the skills data', () => {
  const text = JSON.stringify(skills).toLowerCase();
  const missing = cv.filter((s) => !text.includes(s.toLowerCase()));
  assert.deepEqual(missing, []);
});
