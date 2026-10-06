// Public profile data. After editing, run: node build.mjs
// All papers share one list. Use status: "Preprint" for unpublished manuscripts.
// Topics drive the filters; tags are short descriptive keywords.
window.ACADEMIC_PROFILE = {
  "draft": false,
  "name": "Changjian Zhou",
  "nativeName": "周昌健",
  "position": "Ph.D. Student",
  "institution": "The University of Melbourne",
  "department": "Faculty of Engineering and Information Technology",
  "location": "Melbourne, Australia",
  "photo": "./assets/headshot.jpg",
  "email": "changjian.zhou@student.unimelb.edu.au",
  "cv": "./assets/cv.pdf",
  "website": "https://zhouchaunge.github.io/",
  "updated": "October 2026",
  "description": "Changjian Zhou is a Ph.D. student at the University of Melbourne working on scientific machine learning, learned physical simulators, and computational mechanics.",
  "about": [
    "I am a Ph.D. student in the Faculty of Engineering and Information Technology at the University of Melbourne.",
    "My research connects scientific machine learning with computational mechanics. I develop learned simulators for granular dynamics, methods for adapting neural PDE surrogates to experimental data, and tools for constitutive parameter identification. My broader interests include physical AI and world models grounded in mechanics."
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
    }
  ],
  "links": {
    "orcid": "https://orcid.org/0009-0009-8481-4290",
    "github": "https://github.com/ZhouChaunge",
    "faculty": "https://infrastructure.eng.unimelb.edu.au/people/graduate-researchers/civil-engineering/changjian-zhou",
    "scholar": "https://scholar.google.com/citations?user=t6bjRe0AAAAJ&hl=en",
    "linkedin": "https://www.linkedin.com/in/changjian-zhou-596684295/",
    "researchgate": "https://www.researchgate.net/profile/Changjian-Zhou-2"
  },
  "publications": [
    {
      "id": "physguard",
      "media": {
        "type": "image",
        "src": "./assets/publications/physguard-method.png",
        "alt": "PhysGuard method overview: Fisher subspace estimation and gradient projection during sim-to-real fine-tuning"
      },
      "topics": [
        "physical-ai"
      ],
      "tags": [
        "Sim-to-Real",
        "Neural PDEs"
      ],
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
      },
      "authorship": {
        "firstAuthors": [
          "Changjian Zhou"
        ],
        "correspondingAuthors": []
      }
    },
    {
      "id": "guided-waves",
      "shortTitle": "Guided waves",
      "topics": [
        "engineering"
      ],
      "tags": [
        "Wave Propagation",
        "Poromechanics"
      ],
      "title": "A weak-form-based 1D numerical model for guided wave dispersion in subsea buried pipes embedded in saturated poroelastic soil",
      "authors": "Anchen Ni, Wenbin Wei, Tao Zhuge, Changjian Zhou, Facheng Wang",
      "venue": "Ocean Engineering, 363, 126622",
      "year": "2026",
      "links": {
        "paper": "https://doi.org/10.1016/j.oceaneng.2026.126622"
      },
      "authorship": {
        "firstAuthors": [
          "Anchen Ni"
        ],
        "correspondingAuthors": [
          "Facheng Wang"
        ]
      }
    },
    {
      "id": "anchor-uncertainty",
      "shortTitle": "Anchor uncertainty",
      "topics": [
        "engineering"
      ],
      "tags": [
        "Uncertainty Quantification",
        "Surrogate Models"
      ],
      "title": "Stochastic Polynomial Surrogate Models for Uncertainty Quantification of Offshore Plate Anchor Capacity",
      "authors": "Negin Yousefpour, Bo Wang, Changjian Zhou, Alessio Mentani",
      "venue": "Geotechnical and Geological Engineering, 44, 305",
      "year": "2026",
      "links": {
        "paper": "https://doi.org/10.1007/s10706-026-03824-0"
      },
      "authorship": {
        "firstAuthors": [
          "Negin Yousefpour"
        ],
        "correspondingAuthors": [
          "Negin Yousefpour"
        ]
      }
    },
    {
      "id": "trace",
      "media": {
        "type": "image",
        "src": "./assets/publications/trace-memory.png",
        "alt": "TRACE contact-edge memory matrix, identity dictionary, and memory retrieval across time steps"
      },
      "topics": [
        "physical-ai"
      ],
      "tags": [
        "Learned Simulation",
        "Granular Dynamics"
      ],
      "title": "TRACE: A spatiotemporal contact memory graph network simulator for granular dynamics",
      "authors": "Changjian Zhou, Negin Yousefpour, Jie Qi, Junfeng Fang, Guillermo A. Narsilio, Hans Petter Jostad",
      "venue": "arXiv:2609.02991",
      "status": "Preprint",
      "year": "2026",
      "links": {
        "paper": "https://arxiv.org/abs/2609.02991",
        "code": "https://github.com/Data-Driven-Computational-Geotechnics/TRACE"
      },
      "authorship": {
        "firstAuthors": [
          "Changjian Zhou"
        ],
        "correspondingAuthors": [
          "Changjian Zhou",
          "Negin Yousefpour"
        ]
      }
    },
    {
      "id": "structureclaw",
      "media": {
        "type": "image",
        "src": "./assets/publications/structureclaw-overview.png",
        "alt": "StructureClaw workflow from an engineering request to traceable skills, tools, and artifacts"
      },
      "topics": [
        "engineering"
      ],
      "tags": [
        "LLM Agents",
        "Structural Engineering"
      ],
      "title": "StructureClaw: Traceable LLM Agents and an Executable Benchmark for Structural Engineering Workflows",
      "authors": "Sizhong Qin, Yi Gu, Yao Jiang, Ao Cai, Changjian Zhou, Shaoxuan Shuai, Jiachang Wang, Tianhao Shen, Yueqiang Li, Xinhao Li, Li Zeng, Yueshi Chen, Dachen Gao, Genrong Xu, Wenjie Liao, Xinzheng Lu",
      "venue": "arXiv:2607.14896",
      "status": "Preprint",
      "year": "2026",
      "links": {
        "paper": "https://arxiv.org/abs/2607.14896",
        "code": "https://github.com/structureclaw/structureclaw"
      },
      "authorship": {
        "firstAuthors": [
          "Sizhong Qin",
          "Yi Gu"
        ],
        "correspondingAuthors": [
          "Wenjie Liao",
          "Xinzheng Lu"
        ]
      }
    },
    {
      "id": "shanghai-model",
      "shortTitle": "Shanghai Model",
      "topics": [
        "engineering"
      ],
      "tags": [
        "Constitutive Modelling",
        "Deep Excavation"
      ],
      "title": "Parameters sensitivity and identification in the Shanghai Model: A numerical analysis for deep excavation",
      "authors": "Changjian Zhou, Bin Yan, Weidong Wang, Zhonghua Xu, Wenxuan Zhu, Guanlin Ye",
      "venue": "SSRN 5179194",
      "status": "Preprint",
      "year": "2025",
      "links": {
        "paper": "https://ssrn.com/abstract=5179194"
      },
      "authorship": {
        "firstAuthors": [
          "Changjian Zhou"
        ],
        "correspondingAuthors": [
          "Zhonghua Xu",
          "Bin Yan"
        ]
      }
    },
    {
      "id": "constitutive-identification",
      "shortTitle": "Parameter identification",
      "topics": [
        "engineering"
      ],
      "tags": [
        "Parameter Identification",
        "Machine Learning"
      ],
      "title": "A combined machine learning/search algorithm-based method for the identification of constitutive parameters from laboratory tests and in-situ tests",
      "authors": "Changjian Zhou, Bin Gao, Bin Yan, Wenxuan Zhu, Guanlin Ye",
      "venue": "Computers and Geotechnics, 170, 106268",
      "year": "2024",
      "links": {
        "paper": "https://doi.org/10.1016/j.compgeo.2024.106268",
        "code": "https://github.com/ZhouChaunge/UCM-Parameter-by-ML",
        "simulations": "https://github.com/ZhouChaunge/PMT-Traversal-in-Abauqs"
      },
      "authorship": {
        "firstAuthors": [
          "Changjian Zhou"
        ],
        "correspondingAuthors": []
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
      "type": "Education",
      "institution": "The University of Melbourne",
      "role": "Ph.D. Student · Engineering and Information Technology",
      "detail": "Supervisors: Negin Yousefpour and Guillermo A. Narsilio"
    },
    {
      "years": "Sep–Oct 2025",
      "type": "Industry",
      "employment": "Full-time",
      "institution": "iFLYTEK Co., Ltd.",
      "role": "Machine Learning Engineer · LLM",
      "detail": "Core Development Platform · Adaptive LLM reasoning with supervised fine-tuning and reinforcement learning."
    },
    {
      "years": "2024–2025",
      "type": "Research",
      "employment": "Full-time",
      "institution": "Tsinghua University",
      "role": "Research Assistant",
      "detail": "Computational fluid dynamics of bone cement flow, in collaboration with medical and engineering teams."
    },
    {
      "years": "2021–2024",
      "type": "Education",
      "institution": "Shanghai Jiao Tong University",
      "role": "M.Eng. · Civil and Hydraulic Engineering",
      "detail": "Supervisor: Guanlin Ye"
    },
    {
      "years": "2015–2019",
      "type": "Education",
      "institution": "Hefei University of Technology",
      "role": "B.Eng. · Hydraulic and Hydropower Engineering",
      "detail": ""
    }
  ],
  "awards": [
    {
      "title": "Outstanding Graduate Honor",
      "institution": "Shanghai Jiao Tong University",
      "year": "2024"
    },
    {
      "title": "Yang-Yuqiu Scholarship",
      "institution": "Shanghai Jiao Tong University",
      "year": "2023"
    },
    {
      "title": "Second Prize, China Postgraduate Mathematical Contest in Modeling",
      "institution": "",
      "year": "2023"
    },
    {
      "title": "Distinguished Undergraduate Thesis Award",
      "institution": "Hefei University of Technology",
      "year": "2019"
    },
    {
      "title": "Second Prize, China Undergraduate Hydraulic Innovation Design Competition",
      "institution": "",
      "year": "2017"
    }
  ],
  "contactIntro": "I welcome conversations about scientific machine learning, computational mechanics, and research software. The best way to reach me is by email.",
  "collaborations": {
    "home": {
      "id": "melbourne",
      "city": "Melbourne",
      "country": "Australia",
      "latitude": -37.8136,
      "longitude": 144.9631,
      "institution": "The University of Melbourne",
      "institutions": [
        {
          "name": "The University of Melbourne",
          "url": "https://www.unimelb.edu.au/",
          "collaborators": [
            {
              "name": "Negin Yousefpour",
              "paperIds": [
                "physguard",
                "trace",
                "anchor-uncertainty"
              ]
            },
            {
              "name": "Guillermo A. Narsilio",
              "paperIds": [
                "physguard",
                "trace"
              ]
            },
            {
              "name": "Jie Qi",
              "paperIds": [
                "trace"
              ]
            },
            {
              "name": "Bin Yan",
              "paperIds": [
                "physguard",
                "shanghai-model"
              ]
            }
          ]
        }
      ]
    },
    "locations": [
      {
        "id": "singapore",
        "city": "Singapore",
        "country": "Singapore",
        "latitude": 1.3521,
        "longitude": 103.8198,
        "institutions": [
          {
            "name": "National University of Singapore",
            "url": "https://nus.edu.sg/",
            "collaborators": [
              {
                "name": "Junfeng Fang",
                "paperIds": [
                  "physguard",
                  "trace"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "oslo",
        "city": "Oslo",
        "country": "Norway",
        "latitude": 59.9139,
        "longitude": 10.7522,
        "institutions": [
          {
            "name": "Norwegian Geotechnical Institute",
            "url": "https://www.ngi.no/en/",
            "collaborators": [
              {
                "name": "Hans Petter Jostad",
                "paperIds": [
                  "trace"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "hefei",
        "city": "Hefei",
        "country": "China",
        "latitude": 31.8206,
        "longitude": 117.2272,
        "labelOffset": [
          -12,
          4
        ],
        "institutions": [
          {
            "name": "iFLYTEK",
            "url": "https://www.iflytek.com/en/",
            "collaborators": [
              {
                "name": "Peng Wu",
                "paperIds": [
                  "physguard"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "beijing",
        "city": "Beijing",
        "country": "China",
        "latitude": 39.9042,
        "longitude": 116.4074,
        "labelOffset": [
          12,
          -4
        ],
        "institutions": [
          {
            "name": "Tsinghua University",
            "url": "https://www.tsinghua.edu.cn/en/",
            "collaborators": [
              {
                "name": "Anchen Ni",
                "paperIds": [
                  "guided-waves"
                ]
              },
              {
                "name": "Facheng Wang",
                "paperIds": [
                  "guided-waves"
                ]
              },
              {
                "name": "Sizhong Qin",
                "paperIds": [
                  "structureclaw"
                ]
              },
              {
                "name": "Yi Gu",
                "paperIds": [
                  "structureclaw"
                ]
              },
              {
                "name": "Xinzheng Lu",
                "paperIds": [
                  "structureclaw"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "shanghai",
        "city": "Shanghai",
        "country": "China",
        "latitude": 31.2304,
        "longitude": 121.4737,
        "labelOffset": [
          12,
          7
        ],
        "institutions": [
          {
            "name": "Shanghai Jiao Tong University",
            "url": "https://en.sjtu.edu.cn/",
            "collaborators": [
              {
                "name": "Bin Gao",
                "paperIds": [
                  "constitutive-identification"
                ]
              },
              {
                "name": "Bin Yan",
                "paperIds": [
                  "shanghai-model",
                  "constitutive-identification"
                ]
              },
              {
                "name": "Wenxuan Zhu",
                "paperIds": [
                  "shanghai-model",
                  "constitutive-identification"
                ]
              },
              {
                "name": "Guanlin Ye",
                "paperIds": [
                  "shanghai-model",
                  "constitutive-identification"
                ]
              }
            ]
          },
          {
            "name": "East China Architecture Design & Research Institute (ECADI)",
            "collaborators": [
              {
                "name": "Weidong Wang",
                "paperIds": [
                  "shanghai-model"
                ]
              },
              {
                "name": "Zhonghua Xu",
                "paperIds": [
                  "shanghai-model"
                ]
              }
            ]
          },
          {
            "name": "Shanghai Engineering Research Center of Safety Control for Facilities Adjacent to Deep Excavations",
            "collaborators": [
              {
                "name": "Weidong Wang",
                "paperIds": [
                  "shanghai-model"
                ]
              },
              {
                "name": "Zhonghua Xu",
                "paperIds": [
                  "shanghai-model"
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "chengdu",
        "city": "Chengdu",
        "country": "China",
        "latitude": 30.5728,
        "longitude": 104.0668,
        "labelOffset": [
          -11,
          13
        ],
        "institutions": [
          {
            "name": "Southwest Jiaotong University",
            "url": "https://faculty.swjtu.edu.cn/liaowj/en/index.htm",
            "collaborators": [
              {
                "name": "Wenjie Liao",
                "paperIds": [
                  "structureclaw"
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "publicationTopics": [
    {
      "id": "physical-ai",
      "label": "Physical AI"
    },
    {
      "id": "engineering",
      "label": "Engineering & Mechanics"
    }
  ]
};
