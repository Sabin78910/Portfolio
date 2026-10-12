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
    'Sabin Khanal — Backend & Web Developer in Kathmandu, Nepal. Building secure, tested digital banking systems with Python, Flask and PostgreSQL at Best Finance Company.',
};

export const nav = [
  { href: '#work', label: 'Projects' },
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
];

export const stack = [
  'Python', 'Flask', 'PostgreSQL', 'REST APIs', 'Laravel 11', 'PHP', 'MySQL', 'Oracle APEX',
  'JavaScript', 'SQL', 'R', 'Git', 'Agile / Scrum', 'QA & UAT',
];

// Systems at Best Finance Company (from the CV).
export const bfcWork = [
  { name: 'Employee Appraisal System', note: 'Built · Python · Flask · PostgreSQL · REST' },
  { name: 'Letter Management System', note: 'Built · Flask · PostgreSQL' },
  { name: 'Digital Lending System', note: 'Maintain · performance · security · compliance' },
];

export const experience = [
  {
    company: 'Best Finance Company Ltd.',
    place: 'Kathmandu',
    roles: [
      {
        title: 'Transaction & Digital Banking',
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

export const skills = [
  { group: 'Languages', items: ['Python', 'SQL', 'PHP', 'JavaScript', 'R', 'HTML', 'CSS', 'Java'] },
  { group: 'Backend & frameworks', items: ['Flask', 'Laravel 11', 'REST APIs', 'Oracle APEX', 'Bootstrap 5', 'PHPMailer'] },
  { group: 'Databases', items: ['PostgreSQL', 'MySQL', 'Oracle Database', 'Database triggers', 'Sequences'] },
  { group: 'Data & ML', items: ['Data cleaning', 'Data imputation', 'MICE', 'Outlier detection', 'Correlation analysis', 'Feature scaling', 'PCA', 'ggplot2'] },
  { group: 'Practices & tools', items: ['Agile / Scrum', 'UAT', 'QA testing', 'System integration', 'Git', 'GitHub', 'VS Code', 'PayPal API'] },
];
