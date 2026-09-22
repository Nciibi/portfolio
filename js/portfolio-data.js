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
    alias: "V // TYREL",
    name: "RADNAABAZAR BULGAN",
    title: "FULLSTACK DEVELOPER",
    taglines: [
      "Developing with curiosity and expertise",
      "Fintech, cloud & AI engineering",
      "Always learning & innovating",
      "Pragmatic. Delivery-oriented."
    ],
    subHeadline: "Pragmatic, delivery-oriented | Fintech, Cloud & AI Engineering | Mongolia",
    status: "OPEN TO WORK // NIGHT CITY",
    location: "MONGOLIA // REMOTE-READY",
    bio: "I build clean, reliable cloud and fintech systems — from real-time exchanges to AI agents. Graduating soon, exploring what's next, and always shipping.",
    email: "radnaa@example.com",
    avatarImage: "assets/avatar.jpg",
    resumeUrl: "#",
    socials: [
      { name: "GITHUB", url: "https://github.com/RedonaNova", icon: "github" },
      { name: "LINKEDIN", url: "https://www.linkedin.com/in/radnaa2015", icon: "linkedin" },
      { name: "X", url: "https://twitter.com", icon: "x" },
      { name: "DISCORD", url: "https://discord.com", icon: "discord" }
    ]
  },

  stats: [
    { value: 22, suffix: "", label: "AGE" },
    { value: 3, suffix: "+", label: "YEARS EXPERIENCE" },
    { value: 25, suffix: "+", label: "PROJECTS WORKED ON" },
    { value: 15, suffix: "", label: "PROJECTS DEPLOYED" }
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
      category: "FULL STACK DEVELOPMENT",
      level: "PROFICIENT",
      desc: "Robust front-end and back-end technologies for production systems.",
      items: ["MongoDB", "Express", "React", "Node.js", "Flask", "CSS", "Framer Motion", "Angular"]
    },
    {
      category: "PROGRAMMING & DEVELOPMENT",
      level: "INTERMEDIATE",
      desc: "Modern programming languages and frameworks across the stack.",
      items: ["JavaScript", "Python", "C++", "TypeScript", "C", "Java", "Go"]
    },
    {
      category: "CLOUD & PLATFORM",
      level: "PROFICIENT",
      desc: "Containers, orchestration, CI/CD and cloud-native delivery.",
      items: ["Docker", "Kubernetes", "AWS", "Git", "GraphQL", "Kafka", "Redis"]
    }
  ],

  /* Projects — sourced from kartavya-singh.com structure/content */
  projects: [
    {
      id: "proj-01",
      period: "February 2026 — March 2026",
      category: "Full-Stack Multi-Agentic Career System",
      title: "CareerSignal — Agentic Career Platform",
      summary: "Semi-autonomous multi-agent career intelligence platform — 36 specialised AI agents and one local brain for job analysis, company research, contact discovery, and personalised application assistance. Zero data leaves your machine.",
      likes: 19,
      tags: ["Next.js", "TypeScript", "Python", "AI"],
      url: "https://github.com"
    },
    {
      id: "proj-02",
      period: "November 2025",
      category: "MakeUC Hackathon 2025",
      title: "PersonaForge: Where Voice Meets AI",
      summary: "Windows desktop voice assistant (Electron, React/TS, Node, Web Audio) with ElevenLabs STT/TTS + Gemini/OpenAI — 4-stage real-time loop and executor framework for 8 core OS actions. Best Use of AI Using ElevenLabs.",
      likes: 12,
      tags: ["Electron", "React", "ElevenLabs", "OpenAI"],
      url: "https://github.com"
    },
    {
      id: "proj-03",
      period: "January 2025 — April 2025",
      category: "Full-Stack AI Development",
      title: "My AI Companion — Interactive Portfolio",
      summary: "Transformed a personal portfolio into an interactive AI experience — a companion that knows the whole journey and loves to share it.",
      likes: 24,
      tags: ["Next.js", "AI", "TypeScript"],
      url: "https://github.com"
    },
    {
      id: "proj-04",
      period: "August 2024 — January 2025",
      category: "Full-Stack Development",
      title: "Personal MERN Stack Portfolio Website",
      summary: "Fully revamped, feature-rich MERN portfolio showcasing projects, experience and honours — a significant evolution in full-stack craft.",
      likes: 23,
      tags: ["MongoDB", "Express", "React", "Node.js"],
      url: "https://github.com"
    },
    {
      id: "proj-05",
      period: "August 2024 — September 2024",
      category: "Future of Data Hackathon 2024",
      title: "FinVest: Budget Smart, Invest Sharp",
      summary: "Dynamic financial platform unifying budgeting, spending and investment tracking with real-time 3D visualisations. Best Finance Software — MidwestCon 2024.",
      likes: 33,
      tags: ["React", "Python", "D3"],
      url: "https://github.com"
    },
    {
      id: "proj-06",
      period: "February 2024",
      category: "RevUC Hackathon 2024",
      title: "HealthSphere: Data-Driven Wellness Solutions",
      summary: "Holistic health platform with real-time data analysis and personalised insights. Winner — Best Digital Solution (Medpace) & Best Use of Taipy.",
      likes: 25,
      tags: ["React", "Python", "Taipy"],
      url: "https://github.com"
    },
    {
      id: "proj-07",
      period: "October 2023",
      category: "MakeUC Hackathon 2023",
      title: "FaunaFinder: AI-Powered Animal Breed Recognition",
      summary: "Award-winning recognition platform integrating Google Cloud Vision, Wikipedia and GBIF APIs. Winner — Best Use of AI in Education.",
      likes: 32,
      tags: ["Google Cloud", "Python", "AI"],
      url: "https://github.com"
    },
    {
      id: "proj-08",
      period: "June 2023 — August 2023",
      category: "FARM Stack Self-Learning",
      title: "First Personal Portfolio Website",
      summary: "First large-scale full-stack project in year 2 — FARM stack, showcasing growth across projects and involvements.",
      likes: 18,
      tags: ["Flask", "React", "MongoDB"],
      url: "https://github.com"
    },
    {
      id: "proj-09",
      period: "February 2023",
      category: "RevUC Hackathon 2023",
      title: "BearChat: YUCY AI ChatBot",
      summary: "Offline full-stack AI chatbot for campus support with 99% query accuracy. Best Use of Google Cloud (MLH).",
      likes: 26,
      tags: ["Google Cloud", "Python", "AI"],
      url: "https://github.com"
    }
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
    email: "hello@radnaabazar.dev",
    phone: "",
    channels: [
      { name: "GITHUB", url: "https://github.com/RedonaNova", icon: "github", hint: "CODE" },
      { name: "LINKEDIN", url: "https://www.linkedin.com/in/radnaa2015", icon: "linkedin", hint: "NETWORK" },
      { name: "X", url: "https://twitter.com", icon: "x", hint: "BROADCAST" },
      { name: "DISCORD", url: "https://discord.com", icon: "discord", hint: "VOICE" }
    ]
  }
};
