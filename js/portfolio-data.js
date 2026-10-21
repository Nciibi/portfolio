/**
 * CYBERPUNK PORTFOLIO — CONTENT CONFIG
 * Journey report: radnaabazar.com/en
 * Projects / structure inspiration: kartavya-singh.com
 * Icons resolve via js/icon-pack.js
 */

const ICON_SLUGS = {
  "MongoDB": "mongodb",
  "Express": "nodedotjs",
  "React": "react",
  "Node.js": "nodedotjs",
  "Flask": "python",
  "CSS": "css3",
  "Framer Motion": "framer",
  "Angular": "angular",
  "JavaScript": "javascript",
  "Python": "python",
  "C++": "cplusplus",
  "TypeScript": "typescript",
  "C": "c",
  "Java": "java",
  "Go": "go",
  "Golang": "go",
  "Rust": "rust",
  "Kotlin": "kotlin",
  "Next.js": "nextdotjs",
  "PostgreSQL": "postgresql",
  "Tailwind": "tailwindcss",
  "Docker": "docker",
  "Kubernetes": "kubernetes",
  "AWS": "amazonwebservices",
  "GraphQL": "graphql",
  "Kafka": "apachekafka",
  "Redis": "redis",
  "PyTorch": "pytorch",
  "FastAPI": "fastapi",
  "Git": "git",
  "Linux": "linux",
  "Networks": "node",
  "Dart": "node",
  "Figma": "figma",
  "GitHub": "github",
  "GITHUB": "github",
  "EMAIL": "mail",
  "Vite": "vite",
  "Electron": "electron",
  "ElevenLabs": "node",
  "Gemini": "googlegemini",
  "OpenAI": "openai",
  "Ruby": "ruby",
  "Rails": "rubyonrails",
  "PowerBI": "powerbi",
  "Taipy": "python",
  "Google Cloud": "googlecloud",
  "Wikipedia": "wikipedia",
  "GBIF": "node",
  "D3": "d3js",
  "AI": "chip",
  "IoT": "chip",
  "CVE": "shield",
  "P2P": "signal",
  "E2EE": "shield",
  "Agents": "chip",
  "C2": "shield",
  "Stego": "eye"
};

const PORTFOLIO_DATA = {
  profile: {
    alias: "Nciibi",
    name: "AHMED NCIBI",
    title: "IOT & COMPUTER ENGINEERING — FINAL YEAR",
    taglines: [
      "IoT & embedded systems",
      "Final year @ ISTIC",
      "Firmware to cloud",
      "Always learning & shipping"
    ],
    subHeadline: "Final-year IoT & Computer Engineering @ ISTIC",
    status: "OPEN TO WORK",
    location: "TUNISIA // REMOTE-READY",
    bio: "Final-year IoT & Computer Engineering student at ISTIC — building connected systems from firmware to cloud. Always learning, always shipping.",
    email: "ncibiahmed2017@gmail.com",
    avatarImage: "assets/avatar.webp",
    resumeUrl: "#",
    socials: [
      { name: "GITHUB", url: "https://github.com/Nciibi", icon: "github" }
    ]
  },

  stats: [
    { value: 21, suffix: "", label: "AGE" },
    { value: 1, suffix: "+", label: "YEAR EXPERIENCE" },
    { value: 12, suffix: "", label: "PROJECTS" },
    { value: 3, suffix: "", label: "DEPLOYED" }
  ],

  education: [
    {
      title: "High School",
      period: "Sep 2019 — Jun 2022",
      score: "98.5",
      org: "Oyunii Ireedui Complex — Honorary graduate"
    },
    {
      title: "Bachelor in Information Technology",
      period: "Sep 2022 — Jun 2026",
      score: "3.7",
      org: "National University of Mongolia — Best Academic Graduate Award"
    }
  ],

  about: [
    {
      span: "wide",
      kicker: "SHORT PROFILE",
      title: "Developer building clean, reliable cloud, fintech systems",
      body: "Hello · こんにちは · Сайн уу · Bonjour · 你好"
    },
    {
      span: "tall",
      kicker: "LANGUAGES",
      title: "Fluent in English, Japanese and Mongolian",
      body: "IELTS 7 · JLPT N3"
    },
    {
      span: "normal",
      kicker: "PRIMARY STACK",
      title: "NEXT · Golang",
      tags: ["Next.js", "Golang", "Express", "TypeScript", "Kubernetes", "Python", "React", "MongoDB"]
    },
    {
      span: "normal",
      kicker: "CERTIFICATION",
      title: "AWS Solutions Architect — Associate",
      body: "Cloud architecture & cost-optimised infrastructure design."
    },
    {
      span: "normal",
      kicker: "THE INSIDE SCOOP",
      title: "Graduating soon, exploring what's next",
      body: "Open to full-stack, platform, and AI engineering roles."
    },
    {
      span: "wide",
      kicker: "SIGNAL",
      title: "Do you want to ask a question?",
      body: "Copy my email and let's talk."
    }
  ],

  /* Perks — the four neural trees, mapped to CP2077-style perk nodes. */
  skills: [
    {
      id: "core",
      category: "CORE STACK",
      level: "PROFICIENT",
      tier: "TIER 3",
      desc: "Daily drivers — the languages and backend I design and ship in.",
      items: [
        { name: "Python", note: "Primary language for data, automation and AI work. Shipped in production pipelines and research tooling." },
        { name: "C", note: "Embedded and systems work — reading, tuning and writing firmware-adjacent code." },
        { name: "JavaScript", note: "Full-stack web, real-time interfaces and browser-side tooling." },
        { name: "Express", note: "HTTP and API layers for Node services, with auth, queues and rate limiting." }
      ]
    },
    {
      id: "software",
      category: "SOFTWARE DEVELOPMENT",
      level: "INTERMEDIATE",
      tier: "TIER 2",
      desc: "Programming across mobile, web and systems.",
      items: [
        { name: "Kotlin", note: "Android and backend services. Multiplatform work with coroutines and structured concurrency." },
        { name: "TypeScript", note: "Typed frontend and Node projects — generics, strict mode, typed contracts." },
        { name: "Dart", note: "Flutter and cross-platform UI work." },
        { name: "Rust", note: "Systems and security tooling — ownership, zero-cost abstractions, no GC." },
        { name: "C++", note: "Performance-sensitive work and competitive programming foundations." }
      ]
    },
    {
      id: "systems",
      category: "SYSTEMS & NETWORKS",
      level: "PROFICIENT",
      tier: "TIER 3",
      desc: "Where my systems live — servers, version control and networks.",
      items: [
        { name: "Linux", note: "Server administration, hardening, services and shell automation." },
        { name: "Git", note: "Branching strategy, code review culture and clean history." },
        { name: "Networks", note: "TCP/IP, DNS, subnets, routing and traffic analysis." }
      ]
    },
    {
      id: "devops",
      category: "DEVOPS TOOLING",
      level: "BEGINNER",
      tier: "TIER 1",
      desc: "Currently levelling up — containers and in-memory data.",
      items: [
        { name: "Docker", note: "Container images, compose stacks and reproducible dev environments." },
        { name: "Redis", note: "Caching, sessions and simple pub/sub patterns." }
      ]
    }
  ],

  /* Character sheet — the CP2077 character screen. */
  character: {
    alias: "NCIBI",
    realName: "AHMED NCIBI",
    handle: "@Nciibi",
    title: "OPERATIVE",
    affiliation: "FREE AGENT",
    level: 7,
    xp: 62,
    xpNext: 100,
    cred: "1.2K",
    humanity: 47,
    cyberpsychosis: 12,
    attributes: [
      { key: "COOL", jp: "魅力", value: 8, max: 10, note: "Composure under fire — clean code and calm incident response." },
      { key: "INTELLIGENCE", jp: "智力", value: 9, max: 10, note: "Research, architecture and learning velocity." },
      { key: "BODY", jp: "体力", value: 6, max: 10, note: "Hardware, embedded work and on-site debugging." },
      { key: "REFLEXES", jp: "反射", value: 7, max: 10, note: "Fast iteration — ship, measure, fix, ship again." },
      { key: "TECHNICAL", jp: "技術", value: 8, max: 10, note: "Systems, security research and infrastructure design." },
      { key: "LUCK", jp: "運", value: 5, max: 10, note: "Finding the shortcut nobody else bothered to look for." }
    ],
    statusEffects: [
      { label: "CHRONIC LACK OF SLEEP", tone: "warn" },
      { label: "TOO MUCH TECH", tone: "cool" },
      { label: "OPEN TO WORK", tone: "good" },
      { label: "SHIPPING", tone: "good" }
    ]
  },

  /* Codex — journal-style records. */
  codex: [
    {
      cat: "CERTIFICATION",
      icon: "certificate",
      title: "AWS Certified Solutions Architect — Associate",
      note: "Cloud architecture, resilient design and cost-optimised infrastructure.",
      year: "2025",
      badge: "ACTIVE"
    },
    {
      cat: "AWARD",
      icon: "trophy",
      title: "Best Student of the Year",
      note: "Mongolian National University — awarded across the full graduating cohort.",
      year: "2025",
      badge: "DISTINCTION"
    },
    {
      cat: "AWARD",
      icon: "trophy",
      title: "FIBO Cloud Scholarship",
      note: "Selected among more than 200 applicants for cloud and infrastructure work.",
      year: "2025",
      badge: "SCHOLARSHIP"
    },
    {
      cat: "AWARD",
      icon: "trophy",
      title: "Best Academic Graduate",
      note: "Top of the Bachelor in Information Technology programme, GPA 3.7.",
      year: "2026",
      badge: "DISTINCTION"
    },
    {
      cat: "LANGUAGE",
      icon: "language",
      title: "English — C1 Advanced (IELTS 7.0)",
      note: "Working language for research, documentation and international teams.",
      year: "2024",
      badge: "C1"
    },
    {
      cat: "LANGUAGE",
      icon: "language",
      title: "Japanese — JLPT N3",
      note: "Completed a one-month internship in Japan, working entirely in Japanese.",
      year: "2025",
      badge: "N3"
    },
    {
      cat: "LANGUAGE",
      icon: "language",
      title: "Mongolian — Native",
      note: "First language. Studied and graduated in Ulaanbaatar.",
      year: "—",
      badge: "NATIVE"
    },
    {
      cat: "PRACTICE",
      icon: "briefcase",
      title: "GenAI Research Associate — BearcatGPT",
      note: "Building and hardening a multi-agent tutoring ecosystem with institutional QA.",
      year: "2026",
      badge: "CURRENT"
    },
    {
      cat: "PRACTICE",
      icon: "briefcase",
      title: "Data Engineering Co-op — Possip",
      note: "Production features in a multi-tenant SaaS while learning the Rails ecosystem.",
      year: "2025",
      badge: "SHIPPED"
    },
    {
      cat: "PRACTICE",
      icon: "briefcase",
      title: "Data Science Intern — Byte Link Systems",
      note: "Global Pneumonia growth analysis dashboard in PowerBI with Python and ML.",
      year: "2022",
      badge: "DEPLOYED"
    },
    {
      cat: "PRACTICE",
      icon: "briefcase",
      title: "Mining Commodity Exchange — $320M processed",
      note: "Real-time exchange architecture with an ISO-compliant secure backend and full NFR coverage.",
      year: "2024",
      badge: "AUDITED"
    },
    {
      cat: "PRACTICE",
      icon: "briefcase",
      title: "Call For You — Mentor Teacher",
      note: "Invited by the government to teach English to high school students.",
      year: "2023",
      badge: "COMMUNITY"
    }
  ],

  /* Projects — real repositories from github.com/Nciibi */
  projects: [
    {
      id: "gh-seagles",
      period: "SEP 2026",
      category: "IOT SECURITY",
      title: "Seagles",
      summary: "Discovers every IoT device on your network, scans them for real CVEs, tests default credentials botnets use, analyzes firmware for malware indicators and scores each device risk 0–10.",
      likes: 1,
      tags: ["Go", "IoT", "CVE"],
      url: "https://github.com/Nciibi/seagles"
    },
    {
      id: "gh-m2m",
      period: "SEP 2026",
      category: "P2P MESSAGING",
      title: "M2M Messenger",
      summary: "Modern open-source peer-to-peer messaging focused on privacy, security and performance — end-to-end encrypted messaging, secure key management and NAT traversal with no central servers.",
      likes: 1,
      tags: ["Rust", "P2P", "E2EE"],
      url: "https://github.com/Nciibi/m2m"
    },
    {
      id: "gh-aios",
      period: "AUG 2026",
      category: "AI SYSTEMS",
      title: "AIOS",
      summary: "AIOS (Artificial Intelligence Operating System) — a constitutional operating system for autonomous AI agents.",
      likes: 1,
      tags: ["Rust", "AI", "Agents"],
      url: "https://github.com/Nciibi/AIOS"
    },
    {
      id: "gh-hider",
      period: "AUG 2026",
      category: "OFFENSIVE SECURITY",
      title: "Hider",
      summary: "Unified CLI, web dashboard and C2 framework for metadata manipulation, steganography, payload delivery and post-exploitation — built for penetration testers and security researchers.",
      likes: 1,
      tags: ["Python", "C2", "Stego"],
      url: "https://github.com/Nciibi/hider"
    },
  ],

  /* Experience — kartavya career track + radna role cards */
  experience: [
    {
      tab: "CAREER",
      role: "GenAI Research Associate",
      org: "UC Clermont Learning Commons | Batavia, OH",
      period: "March 2026 — Present",
      desc: "Building and hardening BearcatGPT's multi-agent tutoring ecosystem — visual learning engine, course-specific agents, and institutional QA for reliable AI learning support at scale.",
      likes: 6
    },
    {
      tab: "CAREER",
      role: "Data Engineering (Full Stack) Co-op",
      org: "Possip | Nashville, TN (Remote)",
      period: "May 2025 — August 2025",
      desc: "Enterprise-grade full stack — shipping production features across a multi-tenant SaaS while learning the Ruby on Rails ecosystem.",
      likes: 9
    },
    {
      tab: "CAREER",
      role: "Data Science Intern",
      org: "Byte Link Systems | Houston, TX",
      period: "May 2022 — July 2022",
      desc: "Designed and deployed a global Pneumonia growth analysis PowerBI dashboard with advanced Python and machine learning.",
      likes: 11
    },
    {
      tab: "INVOLVEMENT",
      role: "Frontend Engineer",
      org: "Team Lead // Product Delivery",
      period: "2023 — 2025",
      desc: "Deployed three projects as team leader and built real-time auction interfaces. Continuously improving UX; exploring motion design for polish.",
      likes: 0
    },
    {
      tab: "INVOLVEMENT",
      role: "Backend Engineer",
      org: "ISO-secure monoliths & microservices",
      period: "2024 — 2025",
      desc: "Designed systems where over 320 million USD of trades executed — archiving, operation logging, full NFR coverage.",
      likes: 0
    },
    {
      tab: "INVOLVEMENT",
      role: "Teammate",
      org: "Mining Commodity Exchange System",
      period: "2024",
      desc: "Worked with stakeholders end-to-end; led development and shipped successfully.",
      likes: 0
    },
    {
      tab: "INVOLVEMENT",
      role: "Aspiring DevOps",
      org: "Production maintenance",
      period: "2024 — Present",
      desc: "Maintaining multi-system production estates while preparing Red Hat and AWS Solutions Architect certifications.",
      likes: 0
    },
    {
      tab: "HONORS",
      role: "Best Student of the Year",
      org: "Mongolian National University",
      period: "2025",
      desc: "Named Best Student of the Year; FIBO Cloud scholarship winner among 200+ students.",
      likes: 0
    },
    {
      tab: "HONORS",
      role: "AWS Certified Solutions Architect",
      org: "Amazon Web Services",
      period: "Associate",
      desc: "Cloud architecture certification — design resilient, cost-optimised systems.",
      likes: 0
    }
  ],

  /* Journey report — radnaabazar.com/en (verbatim timeline) */
  journey: [
    {
      year: "2025",
      text: "It's been quite an exciting year! While finishing my thesis, I built core dealer-broker systems and organized online annual general meetings for 10 companies, including Khan Bank. I was honored to be named Best Student of the Year at Mongolian National University and thrilled to win the FIBO Cloud scholarship among 200+ students. Separately, I completed a one-month internship in Japan at Academic Express, where I worked entirely in Japanese. Between all that, collaborating with friends on side businesses. Balancing everything was challenging, but I'm loving every moment of growth and learning.",
      images: []
    },
    {
      year: "2024",
      text: "Designed and successfully implemented the architecture for a real-time mining commodity exchange system which processed over $320 million in transactions. The system was audited and has an ISO-compliant secure Back-end system. Also implemented non-functional requirements such as periodic archiving and operation logging. This was my first major successful project implementation.",
      images: []
    },
    {
      year: "Early 2024",
      text: "(First job as 2nd year student) Joined BDSEC Securities Company, a financial institution with over 1 million clients, as an IT professional. Worked on the following projects to improve my foundational skills:",
      list: [
        "Dashboard Development — dashboards tracking financial data.",
        "Automations — NodeJS app applying taxes on stock transactions.",
        "API Integration — data from two exchanges for real-time stock display.",
        "Personal Projects — social media app with PostgreSQL + Next.js/TypeScript."
      ],
      images: []
    },
    {
      year: "2023",
      text: "Received an invitation from the government and 'American Corner' company to join the 'Call For You' project as a mentor teacher, teaching English to high school students from Darkhan-Uul province. Served as a mentor teacher for 2 months.",
      images: []
    }
  ],

  contact: {
    headline: "Let's Talk",
    blurb: "What led you here? What are you looking for? I would love to hear from you over a virtual coffee chat!",
    email: "ncibiahmed2017@gmail.com",
    phone: "",
    channels: [
      { name: "GITHUB", url: "https://github.com/Nciibi", icon: "github", hint: "CODE" },
      { name: "EMAIL", url: "mailto:ncibiahmed2017@gmail.com", icon: "mail", hint: "DIRECT" }
    ]
  },

  /* Netrunner terminal — command table. */
  netrun: {
    banner: [
      "  +----------------------------------------------+",
      "  |  NCIIBI://ICE  v4.2   ::   NIGHT CITY RELAY  |",
      "  |  AUTONOMOUS ICE BUILD 4.2.1  ::  SESSION KEY |",
      "  +----------------------------------------------+",
      ""
    ],
    commands: {
      help: {
        type: "head",
        out: [
          "AVAILABLE COMMANDS",
          "  whoami      — operative identity dossier",
          "  stats       — attribute + vitals readout",
          "  skills      — neural perk trees",
          "  projects    — case files on the open-source shelf",
          "  github      — public repository index",
          "  codex       — certifications, awards, languages",
          "  journey     — the road so far",
          "  contact     — open a direct channel",
          "  neofetch    — system summary",
          "  ping        — latency probe",
          "  clear       — wipe the buffer",
          "  sudo ...    — try anyway"
        ]
      },
      whoami: {
        type: "ok",
        out: [
          "OPERATIVE  NCIBI",
          "ROLE       IOT & COMPUTER ENGINEERING — FINAL YEAR @ ISTIC",
          "STATUS     AVAILABLE — REMOTE READY",
          "LOCATION   TUNISIA / REMOTE",
          "HANDLE     github.com/Nciibi",
          "MAIL       ncibiahmed2017@gmail.com"
        ]
      },
      stats: {
        type: "ok",
        out: [
          "LEVEL 07   ·   XP 62%   ·   STREET CRED 1.2K",
          "",
          "  COOL           8 / 10   [########--]",
          "  INTELLIGENCE   9 / 10   [#########-]",
          "  BODY           6 / 10   [######----]",
          "  REFLEXES       7 / 10   [#######---]",
          "  TECHNICAL      8 / 10   [########--]",
          "  LUCK           5 / 10   [#####-----]",
          "",
          "  HUMANITY 47%   ·   CYBERPSYCHOSIS 12%   ·   NOMINAL"
        ]
      },
      skills: {
        type: "ok",
        out: [
          "NEURAL LOADOUT",
          "  TIER 3  CORE STACK        Python · C · JavaScript · Express",
          "  TIER 2  SOFTWARE DEV      Kotlin · TypeScript · Dart · Rust · C++",
          "  TIER 3  SYSTEMS & NETS    Linux · Git · Networks",
          "  TIER 1  DEVOPS TOOLING    Docker · Redis"
        ]
      },
      projects: {
        type: "ok",
        out: [
          "CASE FILES",
          "  01  SEAGLES        IOT SECURITY      Discover · scan · fingerprint IoT fleets",
          "  02  M2M MESSENGER  P2P MESSAGING      E2EE peer-to-peer, no central servers",
          "  03  AIOS           AI SYSTEMS         Constitutional OS for autonomous agents",
          "  04  HIDER          OFFENSIVE SEC      Metadata, steganography, C2 framework"
        ]
      },
      github: {
        type: "ok",
        out: [
          "PUBLIC REPOSITORY INDEX",
          "  28 public repos · 78 followers · live sync enabled",
          "  Primary languages: Python · Rust · Go · JavaScript · Kotlin",
          "  → github.com/Nciibi"
        ]
      },
      codex: {
        type: "ok",
        out: [
          "CODEX RECORDS",
          "  CERTIFICATIONS  AWS Solutions Architect — Associate",
          "  AWARDS          Best Student of the Year · FIBO Cloud Scholarship",
          "  LANGUAGES       English C1 · Japanese N3 · Mongolian native",
          "  PRACTICE        4 shipped roles · 1 current · 1 community"
        ]
      },
      journey: {
        type: "ok",
        out: [
          "THE ROAD",
          "  2025        Best Student of the Year · FIBO Cloud Scholarship · Japan internship",
          "  2024        Mining commodity exchange — $320M processed, ISO-audited backend",
          "  EARLY 2024  First IT role at BDSEC Securities — 1M+ client institution",
          "  2023        Mentor teacher — Call For You"
        ]
      },
      contact: {
        type: "ok",
        out: [
          "CHANNELS AVAILABLE",
          "  MAIL    ncibiahmed2017@gmail.com",
          "  CODE    github.com/Nciibi",
          "",
          "  Response time: usually under 24h."
        ]
      },
      neofetch: {
        type: "ok",
        out: [
          "      ,--------.        nciibi@nightcity",
          "   ,'          `.     ------------------",
          "  /   NCIIBI     \\    OS        NCIIBI_OS 5.0.0",
          " |   @nightcity   |   SHELL     ice v4.2",
          "  \\   ~~~~~~~~~~  /   UPTIME    " + "{UPTIME}",
          "   `.            ,'   MEM       " + "{MEM}",
          "      `--------'        DISPLAY  WebGL / 0 BUILD STEP",
          "                        SKILLS   4 TREES / 14 NODES",
          "                        PROJECTS 4 CASE FILES"
        ]
      },
      ping: {
        type: "ok",
        out: [
          "PING nightcity.edge -- ICE relay",
          "  64 bytes from 192.168.7.13: icmp_seq=1 ttl=54 time=12.4 ms",
          "  64 bytes from 192.168.7.13: icmp_seq=2 ttl=54 time=11.8 ms",
          "  64 bytes from 192.168.7.13: icmp_seq=3 ttl=54 time=13.1 ms",
          "  --- relay statistics ---",
          "  3 packets transmitted, 3 received, 0% packet loss"
        ]
      },
      clear: { type: "clear", out: [] },
      sudo: {
        type: "err",
        out: [
          "nc 2>&1: sorry, this user is not in the sudoers file.",
          "  incident NC-0417 logged. nice try."
        ]
      },
      konami: {
        type: "head",
        out: [
          "  ↑ ↑ ↓ ↓ ← → ← → B A",
          "  ... maybe try the arrow keys."
        ]
      },
      credits: {
        type: "head",
        out: [
          "CREDITS",
          "  INTERFACE  original build, hand-written HTML/CSS/JS",
          "  SYSTEM UI  inspired by CD PROJEKT RED's Cyberpunk 2077",
          "  NEON        Studio Trigger's Cyberpunk: Edgerunners",
          "  TYPE        Rajdhani · Chakra Petch · Saira Condensed",
          "              Share Tech Mono · Zen Dots · Zen Kaku Gothic New",
          "  AUDIO       100% synthesised at runtime, zero audio files",
          "  RASTER      one WebGL fragment shader, no libraries",
          "",
          "  unaffiliated with CD PROJEKT RED · original fan work"
        ]
      },
      exit: {
        type: "err",
        out: ["  session terminated by operator. use the EXIT module to disconnect."]
      }
    }
  }
};


/* GitHub snapshot — user Nciibi, fetched 2026-09-22 (public API). Refreshed live at runtime when possible. */
const GITHUB_SNAPSHOT = {"fetched_at": "2026-09-22", "user": {"login": "Nciibi", "avatar_url": "https://avatars.githubusercontent.com/u/214894921?v=4", "html_url": "https://github.com/Nciibi", "public_repos": 28, "followers": 78, "following": 202, "created_at": "2025-06-04T19:55:40Z"}, "repos": [{"name": "image_investigator", "desc": "A high-performance Desktop application designed for cybersecurity investigators and OSINT analysts. This tool combines Advanced EXIF Metadata Analysis, GPT-4o Vision Geolocation, and Multi-Engine Reverse Image Searching into a single, professional dashboard.", "lang": "Python", "stars": 3, "forks": 0, "url": "https://github.com/Nciibi/image_investigator", "updated": "2026-09-05"}, {"name": "aidup-platform", "desc": "AidUp is a production-grade, full-stack charitable platform that connects donors with verified campaign organizers. Built for transparency, security, and scale \u2014 across web and mobile \u2014 with a single shared API.", "lang": "Kotlin", "stars": 2, "forks": 0, "url": "https://github.com/Nciibi/aidup-platform", "updated": "2026-08-01"}, {"name": "AIOS", "desc": "AIOS (Artificial Intelligence Operating System) is a constitutional operating system for autonomous AI agents.", "lang": "Rust", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/AIOS", "updated": "2026-08-01"}, {"name": "Nciibi", "desc": null, "lang": null, "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/Nciibi", "updated": "2026-09-22"}, {"name": "auth-expressjs-temp", "desc": "A production-ready authentication & authorization server with JWT rotation, RBAC, QR code login, MFA, Google OAuth, Redis-powered registration store, and a full image processing pipeline", "lang": "JavaScript", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/auth-expressjs-temp", "updated": "2026-08-01"}, {"name": "auto-commit", "desc": "AutoCommit is a cross-platform CLI tool that watches a Git repository and automatically creates commits when you finish working", "lang": "Rust", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/auto-commit", "updated": "2026-08-01"}, {"name": "basic-surface-layer-keylogger", "desc": "An educational keystroke logging project built in Python and Rust,", "lang": "Makefile", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/basic-surface-layer-keylogger", "updated": "2026-08-01"}, {"name": "chronam", "desc": "Chronam is a high-performance, cross-platform VHDL development environment. It pairs a VS Code extension for interactive editing and waveform viewing with a standalone Rust CLI for build automation, simulation", "lang": "TypeScript", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/chronam", "updated": "2026-08-01"}, {"name": "cli-pic-gen", "desc": "CLI-PIC-GEN allows you to transform standard images into terminal-friendly masterpieces", "lang": "Python", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/cli-pic-gen", "updated": "2026-08-01"}, {"name": "cloud-cracker-v2", "desc": "Professional Offensive Multi\u2011Cloud Security Auditing and Exploitation Framework", "lang": "Python", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/cloud-cracker-v2", "updated": "2026-08-01"}, {"name": "cloudstream-desktop", "desc": "recreation of cloud stream app for desktop", "lang": "Kotlin", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/cloudstream-desktop", "updated": "2026-08-01"}, {"name": "currency-exchancher-dart", "desc": "A clean, modern, and beginner-friendly currency converter application built with Flutter. This app allows users to perform real-time conversions between major global currencies using a sleek Material Design 3 interface.", "lang": "Dart", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/currency-exchancher-dart", "updated": "2026-08-01"}, {"name": "hider", "desc": "A unified CLI, web dashboard, and C2 framework for metadata manipulation, steganography, payload delivery, and post-exploitation \u2014 built for penetration testers and security researchers.", "lang": "Python", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/hider", "updated": "2026-08-01"}, {"name": "jammer-", "desc": "A comprehensive collection of Software-Defined Radio (SDR) jamming tools for educational and research purposes. This suite includes implementations for both USRP and HackRF platforms with advanced features like channel hopping, graceful shutdowns, and robust error handling.", "lang": "Python", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/jammer-", "updated": "2026-08-01"}, {"name": "live-face-blur", "desc": "Face Anonymizer is a real-time face detection and blurring application designed for video conferencing platforms like Zoom, Microsoft Teams, Discord, and more", "lang": "Makefile", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/live-face-blur", "updated": "2026-08-01"}, {"name": "live-face-deep-fake-", "desc": "A real-time face swapping application with GUI support for uploading source face images. Perfect for video calls, meetings, and live streaming(still under developement)", "lang": "C++", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/live-face-deep-fake-", "updated": "2026-08-01"}, {"name": "m2m", "desc": "m2m is a modern open-source peer-to-peer messaging application focused on privacy, security, and performance. It eliminates unnecessary centralized infrastructure while providing end-to-end encrypted messaging, secure key management, NAT traversal, and a good user experience.", "lang": "Rust", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/m2m", "updated": "2026-09-04"}, {"name": "nat-overstep", "desc": null, "lang": "Rust", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/nat-overstep", "updated": "2026-08-26"}, {"name": "password-manager", "desc": "Zero-Knowledge CLI Password Manager", "lang": "Rust", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/password-manager", "updated": "2026-08-01"}, {"name": "phisher-hunter", "desc": "phishing detection through novel, never-before-seen techniques", "lang": "TypeScript", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/phisher-hunter", "updated": "2026-08-01"}, {"name": "pic_enhancer", "desc": "Advanced Python tool for enhancing images specifically for security applications. Enhances blurry camera images to make license plates readable and faces clearer for identification using a modular pipeline architecture.", "lang": "Python", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/pic_enhancer", "updated": "2026-08-01"}, {"name": "picture-downloader-and-metadata-viewer", "desc": "A powerful Python tool for downloading images, extracting detailed metadata including EXIF data and GPS information, and modifying or creating custom metadata.", "lang": "Python", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/picture-downloader-and-metadata-viewer", "updated": "2026-08-01"}, {"name": "seagles", "desc": "Seagles discovers every IoT device on your network, scans them for real CVEs, tests for default credentials (admin/admin, root/root \u2014 the ones botnets use), analyzes firmware for malware indicators, and scores each device's risk from 0 to 10. When something is wrong, you know immediately.", "lang": "Go", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/seagles", "updated": "2026-09-17"}, {"name": "secretscan", "desc": "secretscan is a defensive security tool that scans your local codebases and Git history for accidentally committed secrets \u2014 API keys, tokens, private keys, passwords, and other credentials that should never be in source code.", "lang": "Go", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/secretscan", "updated": "2026-08-01"}, {"name": "allox", "desc": null, "lang": "Rust", "stars": 0, "forks": 0, "url": "https://github.com/Nciibi/allox", "updated": "2026-08-26"}, {"name": "arm-driver-exploit", "desc": null, "lang": "C", "stars": 0, "forks": 0, "url": "https://github.com/Nciibi/arm-driver-exploit", "updated": "2026-09-04"}, {"name": "bomb-file", "desc": null, "lang": "Python", "stars": 0, "forks": 0, "url": "https://github.com/Nciibi/bomb-file", "updated": "2026-08-13"}, {"name": "portfolio", "desc": null, "lang": "JavaScript", "stars": 0, "forks": 0, "url": "https://github.com/Nciibi/portfolio", "updated": "2026-09-22"}], "events": [{"type": "PushEvent", "repo": "Nciibi/portfolio", "at": "2026-09-22T11:13:27Z", "size": 0}, {"type": "PushEvent", "repo": "Nciibi/portfolio", "at": "2026-09-22T12:38:51Z", "size": 0}, {"type": "PushEvent", "repo": "Nciibi/portfolio", "at": "2026-09-22T12:33:10Z", "size": 0}, {"type": "PushEvent", "repo": "Nciibi/Nciibi", "at": "2026-09-22T12:12:25Z", "size": 0}, {"type": "PushEvent", "repo": "Nciibi/portfolio", "at": "2026-09-22T12:23:13Z", "size": 0}, {"type": "PushEvent", "repo": "Nciibi/portfolio", "at": "2026-09-22T12:09:00Z", "size": 0}, {"type": "PushEvent", "repo": "Nciibi/portfolio", "at": "2026-09-22T10:53:53Z", "size": 0}, {"type": "PushEvent", "repo": "Nciibi/portfolio", "at": "2026-09-22T12:12:41Z", "size": 0}, {"type": "PushEvent", "repo": "Nciibi/portfolio", "at": "2026-09-22T10:45:22Z", "size": 0}, {"type": "PushEvent", "repo": "Nciibi/portfolio", "at": "2026-09-22T11:36:02Z", "size": 0}]};
