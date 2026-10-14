// All site content lives here — edit this file, not the markup.
// Content follows the CV (public/Sabin-Khanal-CV.pdf) only: no projects that aren't on it.

export const profile = {
  name: 'Sabin Khanal',
  role: 'Backend & Web Developer',
  tagline: 'Bridging AI, APIs & Automation | Data Science | AI Solutions',
  location: 'Kathmandu, Nepal',
  email: 'sabinkhanal13@gmail.com',
  github: 'https://github.com/Sabin78910',
  linkedin: 'https://www.linkedin.com/in/sabin-khanal-950163326',
  cv: '/Sabin-Khanal-CV.pdf',
  // Resume-section summary, owner's wording.
  summary:
    'Technology-driven professional with 3+ years of experience in software development, project management, and technical support, with a strong ability to analyse complex data and deliver innovative solutions. Focused on bridging AI, APIs, and automation to develop intelligent, scalable, and data-driven solutions.',
  description:
    'Backend & Web Developer in Kathmandu, Nepal. I build HR and lending systems with Python, Flask, PostgreSQL and REST APIs, tested with pytest and shipped via CI/CD.',
};

// Newest first; the first entry is the degree (hero, About, structured data).
// SEE is from the owner (not on the CV).
export const education = [
  {
    title: 'BSc (Hons) Computing',
    school: 'Leeds Beckett University (UK)',
    note: 'Delivered at The British College, Kathmandu',
    period: 'Jan 2022 — May 2025',
  },
  { title: 'Intermediate (+2), Management & Computer Science', school: 'Uniglobe SS/College, Kathmandu', period: '2019 — 2021' },
  { title: 'Secondary Education Examination (SEE)', school: 'Little Angels’ School', period: '2009 — 2019' },
];

export const nav = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#education', label: 'Education' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
];

// About section, owner's wording.
export const about = {
  paragraphs: [
    'I am a backend-focused Web Developer and AI Engineer with a BSc (Hons) in Computing and a strong computational foundation, bringing 3+ years of experience in developing and deploying web technologies. I design, build, and maintain secure, scalable, database-driven web applications and RESTful APIs using Laravel, PHP, Python (Flask), React, and SQL, translating business requirements into reliable software.',
    'My work centers on connecting systems and eliminating manual effort: integrating third-party APIs, automating workflows, and, more recently, embedding AI capabilities into production applications. I prioritize clean, maintainable code, strong performance, and solutions that deliver measurable business impact.',
    'My background spans software development, web application development, and technical support. This combination gives me a practical understanding of how software behaves for real users, not just how it runs in the codebase.',
  ],
  notes: [
    { label: 'Currently exploring', text: 'AI integration, cloud technologies, and data science.' },
    { label: 'Open to conversations about', text: 'backend development, API integration, and automation projects.' },
  ],
  facts: [
    { label: 'Profile', value: 'Web Developer & AI Engineer' },
    { label: 'Domain', value: 'Web Development, Machine Learning, and UI/UX Design' },
    { label: 'Education', value: education[0].title },
    { label: 'Programming Languages', value: 'Python (Flask), PHP (Laravel), JavaScript (React), R, SQL' },
    { label: 'Tools & Other Skills', value: 'Docker, Git, UI/UX Design' },
    { label: 'Languages', value: 'English, Nepali' },
    { label: 'Interests', value: 'Gaming, Soccer, Mountain Trekking' },
  ],
};

export const experience = [
  {
    company: 'Best Finance Company Ltd.',
    place: 'Kathmandu',
    roles: [
      {
        title: 'Transaction & Digital Banking team',
        period: 'Jun 2026 — Present',
        tags: ['Python', 'Flask', 'PostgreSQL', 'REST APIs', 'QA', 'Agile / Scrum'],
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
        tags: ['Web applications', 'Internal IT systems'],
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
        tags: ['UAT', 'Functional testing', 'Production testing', 'Android', 'iOS'],
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
// `tools` render as logo tiles; `capabilities` render as titled rows (titles only, by owner choice).
export const skills = [
  { group: 'Languages', tools: ['Python', 'SQL', 'PHP', 'JavaScript', 'R', 'Java'] },
  { group: 'Backend & APIs', tools: ['Flask', 'FastAPI', 'Pydantic', 'Laravel 11', 'REST APIs', 'Oracle APEX', 'PHPMailer', 'PayPal API'] },
  { group: 'Frontend, mobile & games', tools: ['React', 'Next.js', 'HTML', 'CSS', 'Bootstrap 5', 'Android development', 'Game development'] },
  { group: 'Databases', tools: ['PostgreSQL', 'MySQL', 'Oracle Database'] },
  {
    group: 'Cloud, DevOps & testing',
    tools: ['AWS', 'Docker', 'GitHub Actions', 'Linux', 'pytest', 'Git', 'GitHub', 'VS Code'],
    capabilities: [
      { icon: 'shield', title: 'Testing & QA' },
      { icon: 'pipeline', title: 'CI/CD' },
      { icon: 'sprint', title: 'Agile / Scrum delivery' },
    ],
  },
  {
    group: 'Data & ML',
    capabilities: [
      { icon: 'clean', title: 'Data preparation' },
      { icon: 'layers', title: 'Feature engineering' },
      { icon: 'chart', title: 'Analysis & visualisation' },
    ],
    evidence: { label: 'Applied in Concrete Compressive Strength', href: '#projects' },
  },
];
