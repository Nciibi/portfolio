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
  "Networks": null,
  "Dart": null,
  "Figma": "figma",
  "GitHub": "github",
  "Vite": "vite",
  "Electron": "electron",
  "ElevenLabs": null,
  "Gemini": "googlegemini",
  "OpenAI": "openai",
  "Ruby": "ruby",
  "Rails": "rubyonrails",
  "PowerBI": "powerbi",
  "Taipy": null,
  "Google Cloud": "googlecloud",
  "Wikipedia": "wikipedia",
  "GBIF": null,
  "D3": "d3js",
  "AI": null
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
    avatarImage: "assets/avatar.jpg",
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

  skills: [
    {
      category: "CORE STACK",
      level: "PROFICIENT",
      desc: "Daily drivers — the languages and backend I design and ship in.",
      items: ["Python", "C", "JavaScript", "Express"]
    },
    {
      category: "SOFTWARE DEVELOPMENT",
      level: "INTERMEDIATE",
      desc: "Programming across mobile, web and systems.",
      items: ["Kotlin", "TypeScript", "Dart", "Rust", "C++"]
    },
    {
      category: "SYSTEMS & NETWORKS",
      level: "PROFICIENT",
      desc: "Where my systems live — servers, version control and networks.",
      items: ["Linux", "Git", "Networks"]
    },
    {
      category: "DEVOPS TOOLING",
      level: "BEGINNER",
      desc: "Currently levelling up — containers and in-memory data.",
      items: ["Docker", "Redis"]
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
      { name: "GITHUB", url: "https://github.com/Nciibi", icon: "github", hint: "CODE" }
    ]
  }
};


/* GitHub snapshot — user Nciibi, fetched 2026-09-22 (public API). Refreshed live at runtime when possible. */
const GITHUB_SNAPSHOT = {"fetched_at": "2026-09-22", "user": {"login": "Nciibi", "avatar_url": "https://avatars.githubusercontent.com/u/214894921?v=4", "html_url": "https://github.com/Nciibi", "public_repos": 28, "followers": 78, "following": 202, "created_at": "2025-06-04T19:55:40Z"}, "repos": [{"name": "image_investigator", "desc": "A high-performance Desktop application designed for cybersecurity investigators and OSINT analysts. This tool combines Advanced EXIF Metadata Analysis, GPT-4o Vision Geolocation, and Multi-Engine Reverse Image Searching into a single, professional dashboard.", "lang": "Python", "stars": 3, "forks": 0, "url": "https://github.com/Nciibi/image_investigator", "updated": "2026-09-05"}, {"name": "aidup-platform", "desc": "AidUp is a production-grade, full-stack charitable platform that connects donors with verified campaign organizers. Built for transparency, security, and scale \u2014 across web and mobile \u2014 with a single shared API.", "lang": "Kotlin", "stars": 2, "forks": 0, "url": "https://github.com/Nciibi/aidup-platform", "updated": "2026-08-01"}, {"name": "AIOS", "desc": "AIOS (Artificial Intelligence Operating System) is a constitutional operating system for autonomous AI agents.", "lang": "Rust", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/AIOS", "updated": "2026-08-01"}, {"name": "Nciibi", "desc": null, "lang": null, "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/Nciibi", "updated": "2026-09-22"}, {"name": "auth-expressjs-temp", "desc": "A production-ready authentication & authorization server with JWT rotation, RBAC, QR code login, MFA, Google OAuth, Redis-powered registration store, and a full image processing pipeline", "lang": "JavaScript", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/auth-expressjs-temp", "updated": "2026-08-01"}, {"name": "auto-commit", "desc": "AutoCommit is a cross-platform CLI tool that watches a Git repository and automatically creates commits when you finish working", "lang": "Rust", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/auto-commit", "updated": "2026-08-01"}, {"name": "basic-surface-layer-keylogger", "desc": "An educational keystroke logging project built in Python and Rust,", "lang": "Makefile", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/basic-surface-layer-keylogger", "updated": "2026-08-01"}, {"name": "chronam", "desc": "Chronam is a high-performance, cross-platform VHDL development environment. It pairs a VS Code extension for interactive editing and waveform viewing with a standalone Rust CLI for build automation, simulation", "lang": "TypeScript", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/chronam", "updated": "2026-08-01"}, {"name": "cli-pic-gen", "desc": "CLI-PIC-GEN allows you to transform standard images into terminal-friendly masterpieces", "lang": "Python", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/cli-pic-gen", "updated": "2026-08-01"}, {"name": "cloud-cracker-v2", "desc": "Professional Offensive Multi\u2011Cloud Security Auditing and Exploitation Framework", "lang": "Python", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/cloud-cracker-v2", "updated": "2026-08-01"}, {"name": "cloudstream-desktop", "desc": "recreation of cloud stream app for desktop", "lang": "Kotlin", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/cloudstream-desktop", "updated": "2026-08-01"}, {"name": "currency-exchancher-dart", "desc": "A clean, modern, and beginner-friendly currency converter application built with Flutter. This app allows users to perform real-time conversions between major global currencies using a sleek Material Design 3 interface.", "lang": "Dart", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/currency-exchancher-dart", "updated": "2026-08-01"}, {"name": "hider", "desc": "A unified CLI, web dashboard, and C2 framework for metadata manipulation, steganography, payload delivery, and post-exploitation \u2014 built for penetration testers and security researchers.", "lang": "Python", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/hider", "updated": "2026-08-01"}, {"name": "jammer-", "desc": "A comprehensive collection of Software-Defined Radio (SDR) jamming tools for educational and research purposes. This suite includes implementations for both USRP and HackRF platforms with advanced features like channel hopping, graceful shutdowns, and robust error handling.", "lang": "Python", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/jammer-", "updated": "2026-08-01"}, {"name": "live-face-blur", "desc": "Face Anonymizer is a real-time face detection and blurring application designed for video conferencing platforms like Zoom, Microsoft Teams, Discord, and more", "lang": "Makefile", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/live-face-blur", "updated": "2026-08-01"}, {"name": "live-face-deep-fake-", "desc": "A real-time face swapping application with GUI support for uploading source face images. Perfect for video calls, meetings, and live streaming(still under developement)", "lang": "C++", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/live-face-deep-fake-", "updated": "2026-08-01"}, {"name": "m2m", "desc": "m2m is a modern open-source peer-to-peer messaging application focused on privacy, security, and performance. It eliminates unnecessary centralized infrastructure while providing end-to-end encrypted messaging, secure key management, NAT traversal, and a good user experience.", "lang": "Rust", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/m2m", "updated": "2026-09-04"}, {"name": "nat-overstep", "desc": null, "lang": "Rust", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/nat-overstep", "updated": "2026-08-26"}, {"name": "password-manager", "desc": "Zero-Knowledge CLI Password Manager", "lang": "Rust", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/password-manager", "updated": "2026-08-01"}, {"name": "phisher-hunter", "desc": "phishing detection through novel, never-before-seen techniques", "lang": "TypeScript", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/phisher-hunter", "updated": "2026-08-01"}, {"name": "pic_enhancer", "desc": "Advanced Python tool for enhancing images specifically for security applications. Enhances blurry camera images to make license plates readable and faces clearer for identification using a modular pipeline architecture.", "lang": "Python", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/pic_enhancer", "updated": "2026-08-01"}, {"name": "picture-downloader-and-metadata-viewer", "desc": "A powerful Python tool for downloading images, extracting detailed metadata including EXIF data and GPS information, and modifying or creating custom metadata.", "lang": "Python", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/picture-downloader-and-metadata-viewer", "updated": "2026-08-01"}, {"name": "seagles", "desc": "Seagles discovers every IoT device on your network, scans them for real CVEs, tests for default credentials (admin/admin, root/root \u2014 the ones botnets use), analyzes firmware for malware indicators, and scores each device's risk from 0 to 10. When something is wrong, you know immediately.", "lang": "Go", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/seagles", "updated": "2026-09-17"}, {"name": "secretscan", "desc": "secretscan is a defensive security tool that scans your local codebases and Git history for accidentally committed secrets \u2014 API keys, tokens, private keys, passwords, and other credentials that should never be in source code.", "lang": "Go", "stars": 1, "forks": 0, "url": "https://github.com/Nciibi/secretscan", "updated": "2026-08-01"}, {"name": "allox", "desc": null, "lang": "Rust", "stars": 0, "forks": 0, "url": "https://github.com/Nciibi/allox", "updated": "2026-08-26"}, {"name": "arm-driver-exploit", "desc": null, "lang": "C", "stars": 0, "forks": 0, "url": "https://github.com/Nciibi/arm-driver-exploit", "updated": "2026-09-04"}, {"name": "bomb-file", "desc": null, "lang": "Python", "stars": 0, "forks": 0, "url": "https://github.com/Nciibi/bomb-file", "updated": "2026-08-13"}, {"name": "portfolio", "desc": null, "lang": "JavaScript", "stars": 0, "forks": 0, "url": "https://github.com/Nciibi/portfolio", "updated": "2026-09-22"}], "events": [{"type": "PushEvent", "repo": "Nciibi/portfolio", "at": "2026-09-22T11:13:27Z", "size": 0}, {"type": "PushEvent", "repo": "Nciibi/portfolio", "at": "2026-09-22T12:38:51Z", "size": 0}, {"type": "PushEvent", "repo": "Nciibi/portfolio", "at": "2026-09-22T12:33:10Z", "size": 0}, {"type": "PushEvent", "repo": "Nciibi/Nciibi", "at": "2026-09-22T12:12:25Z", "size": 0}, {"type": "PushEvent", "repo": "Nciibi/portfolio", "at": "2026-09-22T12:23:13Z", "size": 0}, {"type": "PushEvent", "repo": "Nciibi/portfolio", "at": "2026-09-22T12:09:00Z", "size": 0}, {"type": "PushEvent", "repo": "Nciibi/portfolio", "at": "2026-09-22T10:53:53Z", "size": 0}, {"type": "PushEvent", "repo": "Nciibi/portfolio", "at": "2026-09-22T12:12:41Z", "size": 0}, {"type": "PushEvent", "repo": "Nciibi/portfolio", "at": "2026-09-22T10:45:22Z", "size": 0}, {"type": "PushEvent", "repo": "Nciibi/portfolio", "at": "2026-09-22T11:36:02Z", "size": 0}]};
