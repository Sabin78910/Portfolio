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
  { href: '#systems', label: 'Systems' },
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
];

export const stack = [
  'Python', 'Flask', 'FastAPI', 'PostgreSQL', 'TypeScript', 'React', 'Kotlin', 'Jetpack Compose',
  'Unity', 'Cloudflare Workers', 'Laravel', 'GitHub Actions', 'CodeQL', 'Agile / Scrum',
];

export const labs = {
  hub: 'https://sabin78910.github.io/sabin-labs/',
  count: 15,
};

// Source: portfolio-web project cards; per-project test counts across all 15 repos sum to 1,560.
export const stats = [
  { value: '15', label: 'Products shipped' },
  { value: '3', label: 'Live APIs' },
  { value: '1,560+', label: 'Automated tests' },
  { value: '0', label: 'Laptops needed to ship' },
];

// Live Sabin Labs products (source: sabin-labs/src/catalog.ts). `shape` picks the card media layout.
export const products = [
  {
    name: 'NEPSE Lens',
    kind: 'Fintech · Web + Android',
    summary: 'Nepal Stock Exchange on mobile: live board, sector heatmap, broker accumulation per stock, alerts and portfolio P/L.',
    stack: ['React', 'TypeScript', 'Python', 'GitHub Actions'],
    live: 'https://sabin78910.github.io/nepse-lens/',
    repo: 'https://github.com/Sabin78910/nepse-lens',
    shot: 'nepse-lens',
    shape: 'wide',
    tests: 86,
  },
  {
    name: 'Khabar Pulse',
    kind: 'News · Web + Android',
    summary: 'Nepal and world news from 37 sources, with duplicate stories merged and every source credited.',
    stack: ['React', 'TypeScript', 'Cloudflare Workers', 'RSS'],
    live: 'https://sabin78910.github.io/khabar-pulse/',
    repo: 'https://github.com/Sabin78910/khabar-pulse',
    shot: 'khabar-pulse',
    shape: 'phone',
    tests: 78,
  },
  {
    name: 'Ludo Live',
    kind: 'Multiplayer game · Web + Android',
    summary: 'Online Ludo with friends: provably fair dice, smart bots, pass-and-play and no ads in matches.',
    stack: ['React', 'TypeScript', 'Cloudflare Workers', 'Durable Objects'],
    live: 'https://sabin78910.github.io/ludo-live/',
    repo: 'https://github.com/Sabin78910/ludo-live',
    shot: 'ludo-live',
    shape: 'phone',
    tests: 140,
  },
  {
    name: 'Prism Pop',
    kind: 'Puzzle game · Web + Android',
    summary: 'An original match-3 with power combos. No lives, no waiting, unlimited seeded levels.',
    stack: ['TypeScript', 'Canvas', 'Vite', 'Capacitor'],
    live: 'https://sabin78910.github.io/prism-pop-game/',
    repo: 'https://github.com/Sabin78910/prism-pop-game',
    shot: 'prism-pop',
    shape: 'phone',
    tests: 66,
  },
  {
    name: 'Block Drop',
    kind: 'Puzzle game · Android',
    summary: '8×8 block puzzle with chain combos and a seeded daily challenge where everyone gets the same pieces.',
    stack: ['Unity', 'C#'],
    repo: 'https://github.com/Sabin78910/blockdrop-puzzle-unity',
    shot: 'block-drop',
    shape: 'wide',
    tests: 42,
  },
] as const;

export const platform = {
  name: 'Sabin Labs Sync',
  kind: 'Platform · API',
  summary:
    'End-to-end encrypted sync behind every Sabin Labs web app. The server only ever stores ciphertext, and one code links your devices — no passwords, no email.',
  stack: ['TypeScript', 'Cloudflare Workers', 'Durable Objects', 'Web Crypto'],
  tests: 20,
  live: 'https://sync-api.sabin-apps.workers.dev/v1/health',
  repo: 'https://github.com/Sabin78910/sync-api',
};

// The rest of the suite, shown as a compact list.
export const moreProducts = [
  { name: 'Todo', kind: 'Web', tests: 128, href: 'https://sabin78910.github.io/todo-web/' },
  { name: 'Weather', kind: 'Web', tests: 111, href: 'https://sabin78910.github.io/weather-dashboard-web/' },
  { name: 'Loan Calculator', kind: 'Web', tests: 139, href: 'https://sabin78910.github.io/loan-calculator-web/' },
  { name: 'Expense Tracker', kind: 'Android', tests: 192, href: 'https://github.com/Sabin78910/expense-tracker-android' },
  { name: 'EMI Calculator', kind: 'Android', tests: 164, href: 'https://github.com/Sabin78910/emi-calculator-android' },
  { name: 'Notes', kind: 'Android', tests: 160, href: 'https://github.com/Sabin78910/notes-android' },
  { name: 'Inventory API', kind: 'API', tests: 95, href: 'https://github.com/Sabin78910/inventory-api-node' },
  { name: 'Bookstore API', kind: 'API', tests: 84, href: 'https://github.com/Sabin78910/bookstore-api-python' },
  { name: 'House Price ML', kind: 'ML', tests: 55, href: 'https://github.com/Sabin78910/house-price-ml' },
];

// The release loop every repo runs on (devops-hq + per-repo workflows).
export const pipeline = [
  { step: 'Planner', text: 'A research pass queues small, testable issues per repo.', file: 'weekly-improve.yml' },
  { step: 'Ready issue', text: 'Every change starts as a scoped issue with acceptance criteria.', file: 'GitHub Issues' },
  { step: 'Cloud AI developer', text: 'Writes the tests first, then the code, and opens a PR.', file: 'claude-agent.yml' },
  { step: 'CI gate', text: 'Lint, typecheck, tests, build, npm audit and CodeQL must pass.', file: 'ci.yml · codeql.yml' },
  { step: 'Deploy', text: 'GitHub Pages, Cloudflare Workers, Render and signed Android bundles.', file: 'deploy.yml' },
  { step: 'Watch', text: 'devops-hq checks every repo every 6 hours and opens alerts.', file: 'watch.yml' },
];

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
  { group: 'Backend', items: ['Python', 'Flask', 'FastAPI', 'Node.js', 'REST APIs', 'Laravel 11', 'PHP'] },
  { group: 'Web', items: ['TypeScript', 'React', 'Astro', 'Vite', 'PWA', 'WebGL', 'HTML & CSS'] },
  { group: 'Android & games', items: ['Kotlin', 'Jetpack Compose', 'Room', 'Unity', 'C#', 'Capacitor'] },
  { group: 'Data & cloud', items: ['PostgreSQL', 'MySQL', 'Oracle', 'Cloudflare Workers', 'scikit-learn', 'pandas', 'R'] },
  { group: 'Practice', items: ['CI/CD (GitHub Actions)', 'Automated testing', 'CodeQL', 'Agile / Scrum', 'UAT & QA'] },
];
