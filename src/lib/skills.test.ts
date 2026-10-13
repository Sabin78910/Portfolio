import { test } from 'node:test';
import assert from 'node:assert/strict';
import { skills } from '../data/profile.ts';

// Every skill listed on the CV must still appear on the site after regrouping into tools/capabilities.
const cv = [
  'Python', 'SQL', 'PHP', 'JavaScript', 'R', 'HTML', 'CSS', 'Java',
  'Flask', 'Laravel 11', 'REST APIs', 'Oracle APEX', 'Bootstrap 5', 'PHPMailer',
  'PostgreSQL', 'MySQL', 'Oracle Database', 'Database triggers', 'sequences',
  'Data cleaning', 'Data imputation', 'MICE', 'Outlier detection', 'Correlation analysis', 'Feature scaling', 'PCA', 'ggplot2',
  'Agile', 'Scrum', 'UAT', 'QA', 'System integration', 'Git', 'GitHub', 'VS Code', 'PayPal API',
  'FastAPI', 'Pydantic', 'pytest', 'Docker', 'GitHub Actions', 'Linux', 'AWS', 'React', 'Next.js',
];

test('every CV skill is represented in the skills data', () => {
  const text = JSON.stringify(skills.filter((g) => !('learning' in g))).toLowerCase();
  const missing = cv.filter((s) => !text.includes(s.toLowerCase()));
  assert.deepEqual(missing, []);
});

test('roadmap items never sit among claimed skills', () => {
  const claimed = skills.filter((g) => !('learning' in g)).flatMap((g) => ('tools' in g ? g.tools : []));
  const roadmap = skills.filter((g) => 'learning' in g).flatMap((g) => g.tools);
  assert.ok(roadmap.length > 0);
  assert.deepEqual(roadmap.filter((t) => claimed.includes(t)), []);
});
