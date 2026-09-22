/**
 * CYBERPUNK 2077 PORTFOLIO DATA CONFIGURATION
 * Profile, attributes, cyberware, fixer gigs, braindance timeline and
 * uplink channels. Edit this file to change all rendered content.
 *
 * Icon slugs resolve against js/icon-pack.js (simple-icons / devicon).
 */

/* Map a display label onto a simple-icons / devicon slug (or null). */
const ICON_SLUGS = {
  "Docker": "docker",
  "Kubernetes": "kubernetes",
  "AWS Cloud": null,
  "Linux Kernel": "linux",
  "Terraform": "terraform",
  "CI/CD": null,
  "TypeScript": "typescript",
  "Node.js": "nodedotjs",
  "Python": "python",
  "Go": "go",
  "Rust": "rust",
  "PostgreSQL": "postgresql",
  "Redis": "redis",
  "React 19": "react",
  "Next.js": "nextdotjs",
  "WebGL": "webgl",
  "HTML5 Canvas": null,
  "Tailored CSS": "tailwindcss",
  "Three.js": "threedotjs",
  "WebSockets": "socketdotio",
  "GraphQL": "graphql",
  "gRPC": null,
  "Kafka": "apachekafka",
  "REST API": null,
  "WebRTC": null,
  "PyTorch": "pytorch",
  "FastAPI": "fastapi",
  "Canvas API": null,
  "D3.js": null,
  "GeoJSON": null,
  "GPU Shaders": "webgl",
  "Vite": null,
  "Web Audio API": null,
  "NGINX": "nginx",
  "Git": "git",
  "Figma": "figma"
};

/* Stroke glyphs (24×24) used by the attribute screen. */
const ATTR_GLYPHS = {
  tech: '<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M18.8 5.2l-2.1 2.1M7.3 16.7l-2.1 2.1"/>',
  intel: '<rect x="8.5" y="8.5" width="7" height="7"/><path d="M10 2.5v3M14 2.5v3M10 18.5v3M14 18.5v3M2.5 10h3M2.5 14h3M18.5 10h3M18.5 14h3"/>',
  reflex: '<path d="M13.5 2.5 4.5 13.5h5.5l-1 8 9-11.5h-5.5l1-7.5z"/>',
  cool: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.5"/><path d="M12 1.5v3.5M12 19v3.5M1.5 12h3.5M19 12h3.5"/>',
  body: '<path d="M12 2.5 20 6v6.2c0 4.9-3.3 8.5-8 9.8-4.7-1.3-8-4.9-8-9.8V6l8-3.5z"/>'
};

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

  /* Character attributes — modeled on the in-game character screen. */
  attributes: [
    {
      id: "tech",
      glyph: "tech",
      name: "TECHNICAL ABILITY",
      level: 20,
      max: 20,
      spec: "System Architecture & Distributed Cloud",
      desc: "Architecting fault-tolerant microservices, CI/CD automation, and high-load backend pipelines. Every service ships with health probes, structured tracing, and a rollback path that has never once been needed.",
      meter: 98,
      perk: "TECHNICAL SPECIALISATION",
      perkNote: "BLAST DAMAGE · CHARGE MASTER · FIELD MECHANIC"
    },
    {
      id: "intel",
      glyph: "intel",
      name: "INTELLIGENCE",
      level: 20,
      max: 20,
      spec: "Algorithms, Neural AI & Protocol Design",
      desc: "Advanced neural networks, data encryption, reverse engineering, and low-level data structures. Comfortable dropping from a React tree down into a B-tree page split without changing tone of voice.",
      meter: 96,
      perk: "QUICKHACK SPECIALISATION",
      perkNote: "DATAMINE · MASS VULNERABILITY · ICEPICK"
    },
    {
      id: "reflex",
      glyph: "reflex",
      name: "REFLEXES",
      level: 18,
      max: 20,
      spec: "Real-Time WebSockets & Interactive WebGL",
      desc: "Ultra-responsive client states, 60fps animations, WebGL shaders, and high-frequency data feeds. Frames are a budget, and the budget is spent before the deadline.",
      meter: 92,
      perk: "COMBAT SPECIALISATION",
      perkNote: "SLIPPERY · DOGFIGHT · MURKMAN"
    },
    {
      id: "cool",
      glyph: "cool",
      name: "COOL",
      level: 19,
      max: 20,
      spec: "Code Quality, Security & Zero-Trust",
      desc: "Penetration resilience, zero-downtime migrations, and defensive architecture under pressure. Reviews are kind, deploys are boring, and incidents are short.",
      meter: 95,
      perk: "STEALTH SPECIALISATION",
      perkNote: "NINJA · COLD HARD · GHOST"
    },
    {
      id: "body",
      glyph: "body",
      name: "BODY",
      level: 17,
      max: 20,
      spec: "High-Load Scalability & Resilience",
      desc: "Database optimization, cache clustering, memory efficiency, and massive traffic endurance. Systems that take a hit, absorb it, and keep answering requests.",
      meter: 88,
      perk: "SPECIALISATION",
      perkNote: "DIE HARD · WRECKING BALL · IPHY"
    }
  ],

  /* Cyberware & skills matrix (in-game cyberware slot categories). */
  cyberware: [
    {
      category: "OPERATING SYSTEM",
      name: "Militech Paraline MK.5",
      rarity: "iconic",
      slot: "OS CORE // DEVOPS",
      emblem: "docker",
      skills: ["Docker", "Kubernetes", "AWS Cloud", "Linux Kernel", "Terraform", "CI/CD", "NGINX"],
      desc: "Military-grade container orchestration and cloud-native serverless clusters with zero latency."
    },
    {
      category: "FRONTAL CORTEX",
      name: "Camillo RAM Optimizer",
      rarity: "iconic",
      slot: "LOGIC // BACK-END",
      emblem: "nodedotjs",
      skills: ["TypeScript", "Node.js", "Python", "Go", "Rust", "PostgreSQL", "Redis"],
      desc: "High-throughput asynchronous logic processing and robust multi-threaded server architecture."
    },
    {
      category: "OCULAR SYSTEM",
      name: "Kiroshi Optics V3 HUD",
      rarity: "epic",
      slot: "VISUALS // FRONT-END",
      emblem: "react",
      skills: ["React 19", "Next.js", "WebGL", "HTML5 Canvas", "Tailored CSS", "Three.js"],
      desc: "High-definition visual rendering, procedural canvas dynamics, and buttery fluid micro-interactions."
    },
    {
      category: "NERVOUS SYSTEM",
      name: "Kerenzikov Reflex Booster",
      rarity: "rare",
      slot: "STREAMING // NETWORK",
      emblem: "graphql",
      skills: ["WebSockets", "GraphQL", "gRPC", "Kafka", "REST API", "WebRTC"],
      desc: "Real-time bidirectional event streaming and distributed pub/sub pipelines with sub-millisecond response."
    },
    {
      category: "IMMUNE SYSTEM",
      name: "Frontal Mesh Firewall",
      rarity: "epic",
      slot: "SECURITY // QUALITY",
      emblem: "git",
      skills: ["Git", "Figma", "Terraform", "CI/CD", "REST API"],
      desc: "Zero-trust review gates, automated regression sweeps and threat-modelled release trains."
    },
    {
      category: "CIRCULATORY SYSTEM",
      name: "Blood Pump Endurance Core",
      rarity: "rare",
      slot: "ML // DATA PIPELINES",
      emblem: "pytorch",
      skills: ["Python", "PyTorch", "FastAPI", "Kafka", "PostgreSQL"],
      desc: "Training loops, feature stores and streaming inference that keep breathing under load."
    }
  ],

  /* Fixer gig contracts — journal entries with a master/detail dossier. */
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
      summary: "Distributed cyberdeck neural telemetry & breach protocol console with real-time WebSocket node telemetry, multi-threaded worker processing, and a custom WebGL network graph visualiser.",
      details: "Engineered to withstand military-grade Netwatch counter-measures. Features an interactive 3D node topology graph, automated ICE-breaking simulation, and end-to-end encrypted protocol channels. Load-tested to 40k concurrent sockets with a p99 of 38ms.",
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
      summary: "Interactive 3D vector topographic grid of Night City with real-time fixer gig dispatch, vehicle telemetry tracking, and a dynamic crime incident heatmap.",
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
      summary: "AI-driven neural EEG visualiser parsing raw biochip telemetry, cognitive residual recovery, and real-time biometric anomaly detection.",
      details: "Deep learning pipeline processing real-time neural waveform patterns. Integrates frequency spectral analysis, automated anomaly triggers, and cybernetic sensory synthesis.",
      tags: ["Python", "PyTorch", "FastAPI", "Canvas API", "D3.js"],
      demoUrl: "https://github.com",
      repoUrl: "https://github.com"
    }
  ],

  /* Career timeline as braindance memory tracks. */
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
        "Developed interactive 3D telemetry displays and high-frequency asset visualisers.",
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

  /* Contact & transmission netlinks */
  uplink: {
    handle: "V // TYREL",
    netFrequency: "tyrel@nightcity.net",
    commChannels: [
      { name: "GITHUB", url: "https://github.com", icon: "github", hint: "REPOSITORIES" },
      { name: "LINKEDIN", url: "https://linkedin.com", icon: "linkedin", hint: "PROFESSIONAL" },
      { name: "TWITTER_X", url: "https://twitter.com", icon: "x", hint: "BROADCAST" },
      { name: "DISCORD", url: "https://discord.com", icon: "discord", hint: "VOICE CHANNEL" }
    ]
  }
};
