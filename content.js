// Public profile data. After editing, run: node build.mjs
// index.html is generated so the full profile also works without JavaScript.
window.ACADEMIC_PROFILE = {
  "draft": false,
  "name": "Changjian Zhou",
  "nativeName": "周昌健",
  "position": "Ph.D. Student",
  "institution": "The University of Melbourne",
  "department": "Department of Infrastructure Engineering",
  "location": "Melbourne, Australia",
  "photo": "./assets/portrait.jpg",
  "email": "changjian.zhou@student.unimelb.edu.au",
  "cv": "./assets/cv.pdf",
  "website": "https://zhouchaunge.github.io/",
  "updated": "October 2026",
  "description": "Changjian Zhou is a Ph.D. student at the University of Melbourne working on scientific machine learning, learned physical simulators, and computational mechanics.",
  "about": [
    "I am a Ph.D. student in the Department of Infrastructure Engineering at the University of Melbourne, working with Negin Yousefpour and Guillermo A. Narsilio in the Geotechnical Engineering research group.",
    "My research connects scientific machine learning with computational mechanics. I develop learned simulators for granular dynamics, methods for adapting neural PDE surrogates to experimental data, and tools for constitutive parameter identification and uncertainty quantification. My broader interests include physical AI and world models grounded in mechanics.",
    "Previously, I was a research assistant at Tsinghua University. I received my M.Eng. from Shanghai Jiao Tong University, advised by Guanlin Ye, and my B.Eng. from Hefei University of Technology."
  ],
  "people": [
    {
      "name": "Negin Yousefpour",
      "url": "https://findanexpert.unimelb.edu.au/profile/876023-negin-yousefpour"
    },
    {
      "name": "Guillermo A. Narsilio",
      "url": "https://findanexpert.unimelb.edu.au/profile/143722-guillermo-narsilio-ferrero"
    }
  ],
  "research": [
    {
      "title": "Physical AI & world models",
      "description": "Physics-aware learned simulators, contact dynamics, and material-aware models for interaction with the physical world."
    },
    {
      "title": "Scientific machine learning",
      "description": "Physics-informed learning, graph neural simulators, neural PDE surrogates, and sim-to-real adaptation."
    },
    {
      "title": "Computational mechanics",
      "description": "Granular dynamics, constitutive modelling, inverse problems, and data-driven identification of soil parameters."
    },
    {
      "title": "Uncertainty quantification",
      "description": "Bayesian inference and surrogate models for reliable predictions in offshore and geotechnical engineering."
    }
  ],
  "links": {
    "orcid": "https://orcid.org/0009-0009-8481-4290",
    "github": "https://github.com/ZhouChaunge",
    "faculty": "https://infrastructure.eng.unimelb.edu.au/people/graduate-researchers/civil-engineering/changjian-zhou",
    "scholar": "https://scholar.google.com/citations?user=t6bjRe0AAAAJ&hl=en"
  },
  "publications": [
    {
      "title": "PhysGuard: Fisher-Guided Gradient Projection for Sim-to-Real Neural PDE Surrogates",
      "authors": "Changjian Zhou, Junfeng Fang, Negin Yousefpour, Peng Wu, Bin Yan, Guillermo A. Narsilio",
      "venue": "NeurIPS 2026",
      "status": "Poster",
      "year": "2026",
      "links": {
        "paper": "https://arxiv.org/abs/2606.16602",
        "code": "https://github.com/ZhouChaunge/PhysGuard",
        "conference": "https://neurips.cc/virtual/2026/poster/148249",
        "review": "https://openreview.net/forum?id=zHUiR3DWyZ"
      }
    },
    {
      "title": "A weak-form-based 1D numerical model for guided wave dispersion in subsea buried pipes embedded in saturated poroelastic soil",
      "authors": "Anchen Ni, Wenbin Wei, Tao Zhuge, Changjian Zhou, Facheng Wang",
      "venue": "Ocean Engineering, 363, 126622",
      "year": "2026",
      "links": {
        "paper": "https://doi.org/10.1016/j.oceaneng.2026.126622"
      }
    },
    {
      "title": "Stochastic Polynomial Surrogate Models for Uncertainty Quantification of Offshore Plate Anchor Capacity",
      "authors": "Negin Yousefpour, Bo Wang, Changjian Zhou, Alessio Mentani",
      "venue": "Geotechnical and Geological Engineering, 44, 305",
      "year": "2026",
      "links": {
        "paper": "https://doi.org/10.1007/s10706-026-03824-0"
      }
    },
    {
      "title": "A combined machine learning/search algorithm-based method for the identification of constitutive parameters from laboratory tests and in-situ tests",
      "authors": "Changjian Zhou, Bin Gao, Bin Yan, Wenxuan Zhu, Guanlin Ye",
      "venue": "Computers and Geotechnics, 170, 106268",
      "year": "2024",
      "links": {
        "paper": "https://doi.org/10.1016/j.compgeo.2024.106268",
        "code": "https://github.com/ZhouChaunge/UCM-Parameter-by-ML",
        "simulations": "https://github.com/ZhouChaunge/PMT-Traversal-in-Abauqs"
      }
    }
  ],
  "projects": [
    {
      "title": "PhysGuard",
      "description": "Fisher-guided gradient projection for adapting neural PDE surrogates from simulations to experimental data while preserving learned physical structure.",
      "url": "https://github.com/ZhouChaunge/PhysGuard",
      "label": "Research code"
    },
    {
      "title": "TRACE",
      "description": "A graph-network simulator that preserves contact history on edges and uses a physics-structured decoder for granular dynamics.",
      "url": "https://github.com/Data-Driven-Computational-Geotechnics/TRACE",
      "label": "Research code"
    },
    {
      "title": "Constitutive Parameter Identification",
      "description": "Machine learning and search-based calibration of soil constitutive models, with companion tools for automated Abaqus parameter sweeps.",
      "url": "https://github.com/ZhouChaunge/UCM-Parameter-by-ML",
      "label": "Research code"
    },
    {
      "title": "Auto Abaqus Agent Research",
      "description": "An AI agent for Abaqus workflows, including convergence diagnosis, mesh assessment, input generation, and output analysis.",
      "url": "https://github.com/ZhouChaunge/Auto-Abaqus-Agent-Research",
      "label": "Engineering tools"
    }
  ],
  "contributions": [
    {
      "name": "DeepCopilot",
      "url": "https://github.com/deep-copilot/DeepCopilot",
      "description": "a coding assistant for VS Code"
    },
    {
      "name": "StructureClaw",
      "url": "https://github.com/structureclaw/structureclaw",
      "description": "an AI-assisted structural engineering workspace"
    }
  ],
  "experience": [
    {
      "years": "2025–present",
      "institution": "The University of Melbourne",
      "role": "Ph.D. Student · Infrastructure Engineering",
      "detail": "Supervisors: Negin Yousefpour and Guillermo A. Narsilio"
    },
    {
      "years": "2024–2025",
      "institution": "Tsinghua University",
      "role": "Research Assistant",
      "detail": ""
    },
    {
      "years": "2021–2024",
      "institution": "Shanghai Jiao Tong University",
      "role": "M.Eng. · Civil and Hydraulic Engineering",
      "detail": "Supervisor: Guanlin Ye"
    },
    {
      "years": "2015–2019",
      "institution": "Hefei University of Technology",
      "role": "B.Eng. · Hydraulic and Hydropower Engineering",
      "detail": ""
    }
  ],
  "awards": [
    {
      "title": "Yang-Yuqiu Scholarship",
      "institution": "Shanghai Jiao Tong University",
      "year": "2023"
    },
    {
      "title": "Second Prize, 19th China Postgraduate Mathematical Modelling Competition",
      "institution": "",
      "year": ""
    },
    {
      "title": "Distinguished Undergraduate Thesis Award",
      "institution": "Hefei University of Technology",
      "year": "2019"
    }
  ],
  "contactIntro": "I welcome conversations about scientific machine learning, computational mechanics, and research software. The best way to reach me is by email.",
  "preprints": [
    {
      "title": "TRACE: A spatiotemporal contact memory graph network simulator for granular dynamics",
      "authors": "Changjian Zhou, Negin Yousefpour, Jie Qi, Junfeng Fang, Guillermo A. Narsilio, Hans Petter Jostad",
      "venue": "arXiv:2609.02991",
      "status": "Preprint",
      "year": "2026",
      "links": {
        "paper": "https://arxiv.org/abs/2609.02991",
        "code": "https://github.com/Data-Driven-Computational-Geotechnics/TRACE"
      }
    },
    {
      "title": "StructureClaw: Traceable LLM Agents and an Executable Benchmark for Structural Engineering Workflows",
      "authors": "Sizhong Qin, Yi Gu, Yao Jiang, Ao Cai, Changjian Zhou, Shaoxuan Shuai, Jiachang Wang, Tianhao Shen, Yueqiang Li, Xinhao Li, Li Zeng, Yueshi Chen, Dachen Gao, Genrong Xu, Wenjie Liao, Xinzheng Lu",
      "venue": "arXiv:2607.14896",
      "status": "Preprint",
      "year": "2026",
      "links": {
        "paper": "https://arxiv.org/abs/2607.14896",
        "code": "https://github.com/structureclaw/structureclaw"
      }
    },
    {
      "title": "Parameters sensitivity and identification in the Shanghai Model: A numerical analysis for deep excavation",
      "authors": "Changjian Zhou, Bin Yan, Weidong Wang, Zhonghua Xu, Wenxuan Zhu, Guanlin Ye",
      "venue": "SSRN 5179194",
      "status": "Preprint",
      "year": "2025",
      "links": {
        "paper": "https://ssrn.com/abstract=5179194"
      }
    }
  ]
};
