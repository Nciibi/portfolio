/**
 * CYBERPUNK 2077 PORTFOLIO DATA CONFIGURATION
 * All user profile details, cyberware stats, fixer gig projects,
 * and experience logs are organized here for seamless customization.
 */

const PORTFOLIO_DATA = {
  profile: {
    alias: "V // TYREL",
    title: "SENIOR FULL-STACK ARCHITECT // LEAD NETRUNNER",
    subHeadline: "WAKE UP, SAMURAI. WE'VE GOT A CITY TO CODE.",
    status: "ACTIVE // CONTRACTOR",
    location: "NIGHT CITY // PACIFICA SECTOR 04",
    affiliation: "INDEPENDENT MERC // THE AFTERLIFE",
    streetCred: 50,
    level: 60,
    eddies: "142,850",
    iceStatus: "SECURE // ICEBREAKER ACTIVE",
    securityClearance: "LEVEL 05 - BLACK-ICE CERTIFIED",
    avatarImage: "assets/avatar.jpg",
    bioDossier: `
      Elite Netrunner and Full-Stack Systems Architect operating in the neon sprawl of Night City. 
      Specialized in mission-critical distributed infrastructures, low-latency real-time telemetry, 
      high-performance graphics (WebGL/Three.js/Canvas), and bulletproof zero-trust neural network backends. 
      Whether breaking through Arasaka-grade ICE or crafting ultra-responsive client interfaces, 
      every system is engineered with military precision, aesthetic dominance, and unyielding reliability.
    `
  },

  // Character Attributes (Modeled directly after Cyberpunk 2077 Character Sheet)
  attributes: [
    {
      id: "tech",
      name: "TECHNICAL ABILITY",
      level: 20,
      max: 20,
      spec: "System Architecture & Distributed Cloud",
      desc: "Architecting fault-tolerant microservices, CI/CD automation, and high-load backend pipelines.",
      meter: 98
    },
    {
      id: "intel",
      name: "INTELLIGENCE",
      level: 20,
      max: 20,
      spec: "Algorithms, Neural AI & Protocol Design",
      desc: "Advanced neural networks, data encryption, reverse engineering, and low-level data structures.",
      meter: 96
    },
    {
      id: "reflex",
      name: "REFLEXES",
      level: 18,
      max: 20,
      spec: "Real-Time WebSockets & Interactive WebGL",
      desc: "Ultra-responsive client states, 60fps animations, WebGL shaders, and high-frequency data feeds.",
      meter: 92
    },
    {
      id: "cool",
      name: "COOL",
      level: 19,
      max: 20,
      spec: "Code Quality, Security & Zero-Trust",
      desc: "Penetration resilience, zero-downtime migrations, and defensive architecture under pressure.",
      meter: 95
    },
    {
      id: "body",
      name: "BODY",
      level: 17,
      max: 20,
      spec: "High-Load Scalability & Resilience",
      desc: "Database optimization, cache clustering, memory efficiency, and massive traffic endurance.",
      meter: 88
    }
  ],

  // Cyberware & Skills Matrix (Categorized like in-game Cyberware slots)
  cyberware: [
    {
      category: "OPERATING SYSTEM",
      name: "Militech Paraline MK.5",
      rarity: "iconic", // iconic, epic, rare
      slot: "OS Core",
      skills: ["Docker", "Kubernetes", "AWS Cloud", "Linux Kernel", "Terraform", "CI/CD"],
      desc: "Military-grade container orchestration and cloud-native serverless clusters with zero latency."
    },
    {
      category: "FRONTAL CORTEX",
      name: "Camillo RAM Optimizer",
      rarity: "iconic",
      slot: "Logic & Back-End",
      skills: ["TypeScript", "Node.js", "Python", "Go", "Rust", "PostgreSQL", "Redis"],
      desc: "High-throughput asynchronous logic processing and robust multi-threaded server architecture."
    },
    {
      category: "OCULAR SYSTEM",
      name: "Kiroshi Optics V3 HUD",
      rarity: "epic",
      slot: "Visuals & Front-End",
      skills: ["React 19", "Next.js", "WebGL", "HTML5 Canvas", "Tailored CSS", "Three.js"],
      desc: "High-definition visual rendering, procedural canvas dynamics, and buttery fluid micro-interactions."
    },
    {
      category: "NERVOUS SYSTEM",
      name: "Kerenzikov Reflex Booster",
      rarity: "rare",
      slot: "Streaming & Network",
      skills: ["WebSockets", "GraphQL", "gRPC", "Kafka", "REST API", "WebRTC"],
      desc: "Real-time bidirectional event streaming and distributed pub/sub pipelines with sub-millisecond response."
    }
  ],

  // Fixer Gig Projects (Modeled after Night City Mercenary Fixer Contracts)
  gigs: [
    {
      id: "gig-01",
      title: "BLACK-ICE PROTOCOL // NETRUNNER CYBERDECK",
      category: "fullstack",
      dangerLevel: "VERY HIGH",
      fixer: "Rogue Amendiares // The Afterlife",
      reward: "€$ 75,000",
      status: "COMPLETED",
      image: "assets/proj-netrunner.jpg",
      summary: "Distributed cyberdeck neural telemetry & breach protocol console with real-time WebSocket node telemetry, multi-threaded worker processing, and custom WebGL network graph visualizer.",
      details: "Engineered to withstand military-grade Netwatch counter-measures. Features an interactive 3D node topology graph, automated ICE-breaking simulation, and end-to-end encrypted protocol channels.",
      tags: ["React 19", "WebGL", "Node.js", "WebSockets", "Web Audio API"],
      demoUrl: "https://github.com",
      repoUrl: "https://github.com"
    },
    {
      id: "gig-02",
      title: "NIGHT CITY TACTICAL HUD // 3D GEO-SPATIAL MAPPING",
      category: "frontend",
      dangerLevel: "EXTREME",
      fixer: "Muamar 'El Capitan' Reyes",
      reward: "€$ 90,000",
      status: "COMPLETED",
      image: "assets/proj-citymap.jpg",
      summary: "Interactive 3D vector topographic grid of Night City with real-time fixer gig dispatch, vehicle telemetry tracking, and dynamic crime incident heatmap.",
      details: "Built with tailored GPU shaders and vector mesh streaming. Enables real-time dispatch tracking across all six Night City districts with zero frame drops on complex polygon clusters.",
      tags: ["Three.js", "TypeScript", "GPU Shaders", "GeoJSON", "Vite"],
      demoUrl: "https://github.com",
      repoUrl: "https://github.com"
    },
    {
      id: "gig-03",
      title: "SYNAPTIC NEURAL INTERFACE // ARASAKA RELIC ANALYZER",
      category: "ai",
      dangerLevel: "MAX-TAC CLASSIFIED",
      fixer: "Wakako Okada // Westbrook",
      reward: "€$ 115,000",
      status: "COMPLETED",
      image: "assets/proj-neural.jpg",
      summary: "AI-driven neural EEG visualizer parsing raw biochip telemetry, cognitive residual recovery, and real-time biometric anomaly detection.",
      details: "Deep learning pipeline processing real-time neural waveform patterns. Integrates frequency spectral analysis, automated anomaly triggers, and cybernetic sensory synthesis.",
      tags: ["Python", "PyTorch", "FastAPI", "Canvas API", "D3.js"],
      demoUrl: "https://github.com",
      repoUrl: "https://github.com"
    }
  ],

  // Braindance Career Timeline (Career milestones formatted like BD memory tracks)
  braindance: [
    {
      period: "2024 — PRESENT",
      track: "TRACK 04 // MASTER SYSTEM",
      role: "PRINCIPAL SYSTEMS ARCHITECT",
      organization: "KANG TAO // ADVANCED CYBERNETICS LAB",
      highlights: [
        "Architected enterprise-scale micro-frontend ecosystem serving 5M+ daily neural requests.",
        "Engineered real-time telemetry streaming layer reducing operational latency by 48%.",
        "Pioneered WebGL diagnostic dashboards and secure hardware token integration."
      ]
    },
    {
      period: "2022 — 2024",
      track: "TRACK 03 // DEEP RUN",
      role: "SENIOR FULL-STACK ENGINEER",
      organization: "MILITECH DEFENSE NETWORKS",
      highlights: [
        "Built mission-critical tactical dispatch systems with zero unplanned downtime.",
        "Scaled Kubernetes multi-cluster microservices across hybrid cloud regions.",
        "Mentored a team of 8 engineers in reactive UI design and zero-trust protocol compliance."
      ]
    },
    {
      period: "2020 — 2022",
      track: "TRACK 02 // SUB-NET INTRUSION",
      role: "FRONTEND & GRAPHICS ENGINEER",
      organization: "ARASAKA ORBITAL PLATFORMS",
      highlights: [
        "Developed interactive 3D telemetry displays and high-frequency asset visualizers.",
        "Decreased initial bundle load time by 62% through modern code splitting & shader caching."
      ]
    },
    {
      period: "2018 — 2020",
      track: "TRACK 01 // FIRST DIVE",
      role: "SOFTWARE DEVELOPER",
      organization: "NIGHT CITY DIGITAL TELECOM",
      highlights: [
        "Constructed high-speed RESTful APIs and real-time WebSocket communication backends.",
        "Authored automated testing suites achieving 94% code test coverage."
      ]
    }
  ],

  // Contact & Transmission Netlinks
  uplink: {
    handle: "V // TYREL",
    netFrequency: "tyrel@nightcity.net",
    commChannels: [
      { name: "GITHUB", url: "https://github.com", icon: "code" },
      { name: "LINKEDIN", url: "https://linkedin.com", icon: "user-check" },
      { name: "TWITTER_X", url: "https://twitter.com", icon: "terminal" },
      { name: "DISCORD", url: "https://discord.com", icon: "message-square" }
    ]
  }
};
