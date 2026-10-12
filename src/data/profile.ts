// All site content lives here — edit this file, not the markup.

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
  { href: '#products', label: 'Products' },
  { href: '#work', label: 'Projects' },
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
];

export const stack = [
  'Python', 'Flask', 'PostgreSQL', 'REST APIs', 'Laravel 11', 'PHP', 'MySQL', 'Oracle APEX',
  'JavaScript', 'SQL', 'R', 'Git', 'Agile / Scrum', 'QA & UAT',
];

export const labs = {
  hub: 'https://sabin78910.github.io/sabin-labs/',
  count: 15,
};

// Live Sabin Labs products (source: sabin-labs/src/catalog.ts). `shape` picks the card media layout.
export const products = [
  {
    name: 'NEPSE Lens',
    kind: 'Fintech · Web + Android',
    summary: 'Nepal Stock Exchange on mobile: live board, sector heatmap, broker accumulation per stock, alerts and portfolio P/L.',
    stack: ['TypeScript', 'PWA', 'Android'],
    live: 'https://sabin78910.github.io/nepse-lens/',
    repo: 'https://github.com/Sabin78910/nepse-lens',
    shot: 'nepse-lens',
    shape: 'wide',
  },
  {
    name: 'Khabar Pulse',
    kind: 'News · Web + Android',
    summary: 'Nepal and world news from 37 sources, with duplicate stories merged and every source credited.',
    stack: ['TypeScript', 'PWA', 'Android'],
    live: 'https://sabin78910.github.io/khabar-pulse/',
    repo: 'https://github.com/Sabin78910/khabar-pulse',
    shot: 'khabar-pulse',
    shape: 'phone',
  },
  {
    name: 'Ludo Live',
    kind: 'Multiplayer game · Web + Android',
    summary: 'Online Ludo with friends: provably fair dice, smart bots, pass-and-play and no ads in matches.',
    stack: ['React', 'Cloudflare Durable Objects'],
    live: 'https://sabin78910.github.io/ludo-live/',
    repo: 'https://github.com/Sabin78910/ludo-live',
    shot: 'ludo-live',
    shape: 'phone',
  },
  {
    name: 'Prism Pop',
    kind: 'Puzzle game · Web + Android',
    summary: 'An original match-3 with power combos. No lives, no waiting, unlimited seeded levels.',
    stack: ['TypeScript', 'PWA', 'Android'],
    live: 'https://sabin78910.github.io/prism-pop-game/',
    repo: 'https://github.com/Sabin78910/prism-pop-game',
    shot: 'prism-pop',
    shape: 'phone',
  },
  {
    name: 'Block Drop',
    kind: 'Puzzle game · Android',
    summary: '8×8 block puzzle with chain combos and a seeded daily challenge where everyone gets the same pieces.',
    stack: ['Unity', 'C#'],
    repo: 'https://github.com/Sabin78910/blockdrop-puzzle-unity',
    shot: 'block-drop',
    shape: 'wide',
  },
] as const;

export const platform = {
  name: 'Sabin Labs Sync',
  kind: 'Platform · API',
  summary:
    'End-to-end encrypted sync behind every Sabin Labs web app. The server only ever stores ciphertext, and one code links your devices — no passwords, no email.',
  stack: ['Cloudflare Workers', 'Durable Objects', 'TypeScript'],
  live: 'https://sync-api.sabin-apps.workers.dev/v1/health',
  repo: 'https://github.com/Sabin78910/sync-api',
};

export const shipped = [
  { name: 'Employee Appraisal System', note: 'Python · Flask · PostgreSQL · REST' },
  { name: 'Letter Management System', note: 'Flask · PostgreSQL' },
  { name: 'Digital Lending System', note: 'Performance · security · compliance' },
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
    visual: 'data',
    title: 'Concrete Strength Pipeline',
    repo: 'https://github.com/Sabin78910/concrete-strength-analysis',
    kind: 'ML preprocessing',
    summary: 'An R pipeline that cleans and prepares concrete compressive-strength data for machine learning.',
    stack: ['R', 'MICE', 'ggplot2', 'PCA'],
    points: [
      'Missing-data imputation with MICE, outliers via IQR',
      'Correlation analysis to find what drives strength',
      'Min–Max scaling and PCA for a simpler feature space',
    ],
  },
] as const;

export const skills = [
  { group: 'Languages', items: ['Python', 'SQL', 'PHP', 'JavaScript', 'R', 'Java', 'HTML', 'CSS'] },
  { group: 'Backend', items: ['Flask', 'Laravel 11', 'REST APIs', 'Oracle APEX', 'PHPMailer', 'PayPal API'] },
  { group: 'Databases', items: ['PostgreSQL', 'MySQL', 'Oracle Database', 'Triggers & Sequences'] },
  { group: 'Data & ML', items: ['Data cleaning', 'MICE imputation', 'Outlier detection', 'Feature scaling', 'PCA', 'ggplot2'] },
  { group: 'Practice', items: ['Agile / Scrum', 'UAT & QA testing', 'System integration', 'Git & GitHub'] },
];
