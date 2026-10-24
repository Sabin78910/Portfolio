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
    'Backend & Web Developer in Kathmandu, Nepal. I build HR, lending and letter management systems with Python, Flask, PostgreSQL and REST APIs.',
};

export const githubBand = {
  tagline: 'Combining modern web technology with AI and machine learning to solve real business problems — and uncover the data stories behind them.',
  cta: 'Explore the full breadth of my work, open-source contributions, and personal experiments on GitHub.',
};

export const stats = [
  { value: '5+', label: 'Years of IT Experience' },
  { value: '3+', label: 'Years of Web Development' },
  { value: '15+', label: 'Projects Worked On' },
  { value: '100%', label: 'Commitment to Web, AI & ML' },
];

// Newest first; the first entry is the degree (hero, About, structured data).
// SEE is from the owner (not on the CV).
export const education = [
  { title: 'BSc (Hons) Computing', school: 'Leeds Beckett University', period: '2022 — 2025' },
  { title: 'Intermediate (+2 HSEB)', school: 'Uniglobe SS/College', period: '2019 — 2021' },
  { title: 'Secondary Education Examination', school: "Little Angels' School", period: '2009 — 2019' },
];

export const nav = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#education', label: 'Education' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

// About section, owner's wording.
export const about = {
  paragraphs: [
    'I am a backend focused Web Developer and AI Engineer with a BSc (Hons) in Computing and a strong computational foundation, bringing 3+ years of experience in developing and deploying web technologies. I design, build, and maintain secure, scalable, database-driven web applications and RESTful APIs using Laravel, PHP, Python (Flask), React, and SQL, translating business requirements into reliable software.',
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
    company: 'Best Finance Company Ltd',
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

// Projects-section intro, owner's wording.
export const projectsIntro =
  'Below are the projects and practical implementations in SQL, React, Python, Laravel, PHP, JavaScript, R programming and ML.';

export const projects = [
  {
    visual: 'data',
    color: 'emerald',
    title: 'Concrete Compressive Strength',
    kind: 'ML preprocessing pipeline',
    summary: 'An R pipeline that cleans and prepares concrete compressive-strength data for machine learning.',
    points: [
      'Missing-data imputation with MICE, outliers via IQR',
      'Correlation analysis to find what drives strength',
      'Min–Max scaling and PCA for a simpler feature space',
    ],
  },
  {
    visual: 'market',
    color: 'blue',
    title: 'GrocerEase',
    kind: 'Multi-vendor marketplace',
    summary:
      'One platform where many local traders sell together, with PayPal checkout, collection-slot booking and email OTP verification.',
    points: [
      'Co-designed the Oracle schema for users, products, orders and payments',
      'Oracle APEX dashboards for traders and administrators',
      'Secure checkout with OTP verification',
    ],
  },
  {
    visual: 'store',
    color: 'cyan',
    title: 'N & S Handicraft',
    kind: 'E-commerce platform',
    summary:
      'A full-stack store built for the Nepalese market — NPR pricing, local addresses, VAT-based checkout and courier tracking.',
    points: [
      'Product filters, live search, wishlist and coupons',
      'Admin panel for orders, payment verification and sales statistics',
      'Automated transactional emails across the order lifecycle',
    ],
  },
] as const;
