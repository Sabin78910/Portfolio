// All site content lives here — edit this file, not the markup.
// Content follows the CV (public/Sabin-Khanal-CV.pdf) only: no projects that aren't on it.

export const profile = {
  name: 'Sabin Khanal',
  role: 'Backend & Web Developer',
  location: 'Kathmandu, Nepal',
  email: 'sabinkhanal13@gmail.com',
  github: 'https://github.com/Sabin78910',
  linkedin: 'https://www.linkedin.com/in/sabin-khanal-950163326',
  cv: '/Sabin-Khanal-CV.pdf',
  description:
    'Sabin Khanal — Backend & Web Developer in Kathmandu, Nepal. Builds HR and lending systems at Best Finance Company with Python, Flask, PostgreSQL and REST APIs, tested before release.',
};

export const education = { degree: 'BSc (Hons) Computing', school: 'The British College', year: 2025 };

export const nav = [
  { href: '#work', label: 'Work' },
  { href: '#projects', label: 'Projects' },
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
];

export const stack = [
  'Python', 'Flask', 'PostgreSQL', 'REST APIs', 'Laravel 11', 'PHP', 'MySQL', 'Oracle APEX',
  'JavaScript', 'SQL', 'R', 'Git', 'Agile / Scrum', 'QA & UAT',
];

export const principles = ['Correct before clever', 'Secure by default', 'Tested before shipped'];

// Internal systems at Best Finance Company — wording from the CV; no confidential detail.
export const caseStudies = [
  {
    name: 'Employee Appraisal System',
    domain: 'HR technology',
    role: 'Built',
    purpose: 'Streamlines employee evaluations and grade increments.',
    stack: ['Python', 'Flask', 'PostgreSQL', 'REST APIs'],
    icon: 'people',
  },
  {
    name: 'Letter Management System',
    domain: 'Operations',
    role: 'Built',
    purpose: 'Centralises and manages official company correspondence.',
    stack: ['Flask', 'PostgreSQL'],
    icon: 'doc',
  },
  {
    name: 'Digital Lending System',
    domain: 'Financial services',
    role: 'Maintain & enhance',
    purpose: 'Maintained and enhanced within an Agile/Scrum team.',
    stack: ['Performance', 'Security', 'Regulatory compliance'],
    icon: 'lending',
  },
];

// Domains summarised from the systems above.
export const domains = [
  { name: 'HR technology', note: 'Employee evaluations and grade increments' },
  { name: 'Financial services', note: 'Digital lending, security, regulatory requirements' },
  { name: 'Operations', note: 'Correspondence and internal IT systems' },
];

export const experience = [
  {
    company: 'Best Finance Company Ltd.',
    place: 'Kathmandu',
    period: 'Feb 2026 — Present',
    roles: [
      {
        title: 'Transaction & Digital Banking team',
        period: 'Jun 2026 — Present',
        points: [
          'Built an Employee Appraisal System (Python, Flask, PostgreSQL, REST APIs) that streamlines evaluations and grade increments.',
          'Built a Letter Management System in Flask and PostgreSQL to centralise official company correspondence.',
          'Maintain and enhance the Digital Lending System for performance, security and regulatory requirements in an Agile/Scrum team.',
          'Own functional testing, QA and troubleshooting to keep production systems reliable.',
        ],
      },
      {
        title: 'Web Developer, Information Technology',
        period: 'Feb 2026 — Present',
        points: [
          'Develop, maintain and support web applications and internal IT systems behind day-to-day operations.',
          'Work with business and IT teams to resolve technical issues and ship system improvements.',
        ],
      },
    ],
  },
  {
    company: 'Hypen Solution',
    place: 'Remote',
    period: 'Jun 2024 — Aug 2024',
    roles: [
      {
        title: 'Freelance Tech Support & QA Specialist',
        period: 'Jun 2024 — Aug 2024',
        points: [
          'Ran UAT, functional and production testing on Android and iOS apps to confirm release readiness.',
          'Tested builds across devices and platforms, documenting and reporting defects before release.',
        ],
      },
    ],
  },
];

export const projects = [
  {
    visual: 'data',
    color: 'emerald',
    title: 'Concrete Compressive Strength',
    repo: 'https://github.com/Sabin78910/concrete-strength-analysis',
    kind: 'ML preprocessing pipeline',
    summary: 'An R pipeline that cleans and prepares concrete compressive-strength data for machine learning.',
    stack: ['R', 'MICE', 'ggplot2', 'PCA'],
    points: [
      'Missing-data imputation with MICE, outliers via IQR',
      'Correlation analysis to find what drives strength',
      'Min–Max scaling and PCA for a simpler feature space',
    ],
  },
  {
    visual: 'market',
    color: 'indigo',
    title: 'GrocerEase',
    repo: 'https://github.com/Sabin78910/GrocerEase',
    kind: 'Multi-vendor marketplace',
    summary:
      'One platform where many local traders sell together, with PayPal checkout, collection-slot booking and email OTP verification.',
    stack: ['PHP', 'Oracle', 'JavaScript', 'PayPal'],
    points: [
      'Co-designed the Oracle schema for users, products, orders and payments',
      'Oracle APEX dashboards for traders and administrators',
      'Secure checkout with OTP verification',
    ],
  },
  {
    visual: 'store',
    color: 'cyan',
    title: 'N & S Handicrafts',
    kind: 'E-commerce platform',
    summary:
      'A full-stack store built for the Nepalese market — NPR pricing, local addresses, VAT-based checkout and courier tracking.',
    stack: ['Laravel', 'PHP', 'MySQL', 'Bootstrap'],
    points: [
      'Product filters, live search, wishlist and coupons',
      'Admin panel for orders, payment verification and sales statistics',
      'Automated transactional emails across the order lifecycle',
    ],
  },
] as const;

// Skills, regrouped for presentation. Every CV skill appears here (enforced by src/lib/skills.test.ts).
// `tools` render as logo tiles; `capabilities` render as described rows.
export const skills = [
  { group: 'Languages', tools: ['Python', 'SQL', 'PHP', 'JavaScript', 'R', 'HTML', 'CSS', 'Java'] },
  { group: 'Backend & frameworks', tools: ['Flask', 'Laravel 11', 'REST APIs', 'Oracle APEX', 'Bootstrap 5', 'PHPMailer'] },
  {
    group: 'Databases',
    tools: ['PostgreSQL', 'MySQL', 'Oracle Database'],
    capabilities: [{ icon: 'logic', title: 'Database logic', detail: 'Database triggers and sequences for integrity and keys' }],
  },
  {
    group: 'Data & ML',
    capabilities: [
      { icon: 'clean', title: 'Data preparation', detail: 'Data cleaning, data imputation with MICE, outlier detection (IQR)' },
      { icon: 'layers', title: 'Feature engineering', detail: 'Feature scaling (Min–Max) and PCA' },
      { icon: 'chart', title: 'Analysis & visualisation', detail: 'Correlation analysis and ggplot2' },
    ],
    evidence: { label: 'Applied in Concrete Compressive Strength', href: '#work' },
  },
  {
    group: 'Practices & tools',
    tools: ['Git', 'GitHub', 'VS Code', 'PayPal API'],
    capabilities: [
      { icon: 'sprint', title: 'Agile / Scrum delivery', detail: 'Sprints alongside business and IT teams' },
      { icon: 'shield', title: 'QA testing & UAT', detail: 'Functional, UAT and production testing before release' },
      { icon: 'plug', title: 'System integration', detail: 'Connecting internal platforms and services' },
    ],
  },
];
