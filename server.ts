import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const db = new Database('pathfinder.db');

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    provider TEXT,
    current_phase INTEGER DEFAULT 0,
    completed_phases TEXT DEFAULT '[]',
    profile TEXT DEFAULT '{}',
    saved_colleges TEXT DEFAULT '[]',
    saved_internships TEXT DEFAULT '[]',
    quiz_results TEXT DEFAULT '{}',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_active DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Load static data
const dataPath = path.join(__dirname, 'data');
if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath, { recursive: true });
}

const loadData = (filename: string, defaultData: any) => {
  const filePath = path.join(dataPath, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

const streams = loadData('streams.json', [
  {
    id: 'mpc',
    name: 'MPC',
    board_equivalent: 'PCM',
    description: 'Mathematics, Physics, Chemistry',
    career_doors: ['Engineering', 'Architecture', 'Defense', 'Data Science'],
    famous_alumni: ['Sundar Pichai', 'Satya Nadella']
  },
  {
    id: 'bipc',
    name: 'BiPC',
    board_equivalent: 'PCB',
    description: 'Biology, Physics, Chemistry',
    career_doors: ['Medicine', 'Pharmacy', 'Biotechnology', 'Agriculture'],
    famous_alumni: ['Dr. Reddy', 'Kiran Mazumdar-Shaw']
  },
  {
    id: 'cec',
    name: 'CEC',
    board_equivalent: 'Commerce',
    description: 'Civics, Economics, Commerce',
    career_doors: ['CA', 'Business Management', 'Finance', 'Law'],
    famous_alumni: ['Ratan Tata', 'Kumar Mangalam Birla']
  },
  {
    id: 'hec',
    name: 'HEC',
    board_equivalent: 'Humanities',
    description: 'History, Economics, Civics',
    career_doors: ['Civil Services', 'Journalism', 'Law', 'Design'],
    famous_alumni: ['Shashi Tharoor', 'Barkha Dutt']
  }
]);

const branches = loadData('branches.json', [
  {
    id: 'cse',
    name: 'Computer Science & Engineering',
    specialisations: [
      {
        id: 'aiml',
        name: 'Artificial Intelligence & ML',
        icon: '🤖',
        difficulty: 'High',
        duration_years: 4,
        roles: [
          { title: 'AI Engineer', level: 'Entry', avg_salary_lpa: 12 },
          { title: 'ML Engineer', level: 'Mid', avg_salary_lpa: 20 },
          { title: 'AI Researcher', level: 'Senior', avg_salary_lpa: 35 }
        ],
        salary_range: { min_lpa: 8, max_lpa: 40 },
        top_companies: ['Google', 'Microsoft', 'OpenAI', 'Flipkart'],
        internship_skills: ['Python', 'TensorFlow', 'Statistics', 'LLMs'],
        roadmap_steps: [
          { order: 1, title: 'Python Basics', duration_weeks: 4 },
          { order: 2, title: 'Linear Algebra', duration_weeks: 3 },
          { order: 3, title: 'ML Fundamentals', duration_weeks: 6 },
          { order: 4, title: 'Deep Learning', duration_weeks: 6 },
          { order: 5, title: 'Real-World Projects', duration_weeks: 8 },
          { order: 6, title: 'Internship', duration_weeks: 12 }
        ],
        certifications: ['Google TensorFlow Dev', 'AWS ML Specialty'],
        free_resources: [
          { name: 'fast.ai', url: 'https://fast.ai', type: 'Course' },
          { name: 'Andrej Karpathy YT', url: 'https://youtube.com', type: 'Video' }
        ]
      },
      {
        id: 'cyber',
        name: 'Cybersecurity',
        icon: '🛡️',
        difficulty: 'High',
        duration_years: 4,
        roles: [
          { title: 'Security Analyst', level: 'Entry', avg_salary_lpa: 10 },
          { title: 'Penetration Tester', level: 'Mid', avg_salary_lpa: 18 }
        ],
        salary_range: { min_lpa: 6, max_lpa: 35 },
        top_companies: ['CrowdStrike', 'Palo Alto', 'Cisco', 'TCS'],
        internship_skills: ['Linux', 'Networking', 'Ethical Hacking', 'Python'],
        roadmap_steps: [
          { order: 1, title: 'Networking Basics', duration_weeks: 4 },
          { order: 2, title: 'Linux Mastery', duration_weeks: 4 },
          { order: 3, title: 'Security Fundamentals', duration_weeks: 6 },
          { order: 4, title: 'Ethical Hacking', duration_weeks: 8 },
          { order: 5, title: 'CTF Challenges', duration_weeks: 6 },
          { order: 6, title: 'Internship', duration_weeks: 12 }
        ],
        certifications: ['CompTIA Security+', 'CEH'],
        free_resources: [
          { name: 'TryHackMe', url: 'https://tryhackme.com', type: 'Course' }
        ]
      },
      {
        id: 'fullstack',
        name: 'Full Stack Development',
        icon: '💻',
        difficulty: 'Medium',
        duration_years: 4,
        roles: [
          { title: 'Frontend Developer', level: 'Entry', avg_salary_lpa: 8 },
          { title: 'Full Stack Engineer', level: 'Mid', avg_salary_lpa: 15 },
          { title: 'Software Architect', level: 'Senior', avg_salary_lpa: 30 }
        ],
        salary_range: { min_lpa: 6, max_lpa: 35 },
        top_companies: ['Amazon', 'Flipkart', 'TCS', 'Infosys', 'Swiggy'],
        internship_skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
        roadmap_steps: [
          { order: 1, title: 'HTML/CSS & JS', duration_weeks: 4 },
          { order: 2, title: 'React & Frontend', duration_weeks: 6 },
          { order: 3, title: 'Node.js & Backend', duration_weeks: 6 },
          { order: 4, title: 'Database Design', duration_weeks: 4 },
          { order: 5, title: 'Full Stack Projects', duration_weeks: 8 },
          { order: 6, title: 'Internship', duration_weeks: 12 }
        ],
        certifications: ['Meta Front-End Developer', 'AWS Certified Developer'],
        free_resources: [
          { name: 'FreeCodeCamp', url: 'https://freecodecamp.org', type: 'Course' }
        ]
      },
      {
        id: 'data',
        name: 'Data Science',
        icon: '📊',
        difficulty: 'High',
        duration_years: 4,
        roles: [
          { title: 'Data Analyst', level: 'Entry', avg_salary_lpa: 8 },
          { title: 'Data Scientist', level: 'Mid', avg_salary_lpa: 18 },
          { title: 'Data Engineer', level: 'Senior', avg_salary_lpa: 25 }
        ],
        salary_range: { min_lpa: 7, max_lpa: 35 },
        top_companies: ['Mu Sigma', 'Fractal', 'Google', 'Amazon'],
        internship_skills: ['Python', 'SQL', 'Pandas', 'Tableau'],
        roadmap_steps: [
          { order: 1, title: 'Python & SQL', duration_weeks: 4 },
          { order: 2, title: 'Data Analysis (Pandas)', duration_weeks: 4 },
          { order: 3, title: 'Data Visualization', duration_weeks: 4 },
          { order: 4, title: 'Machine Learning Basics', duration_weeks: 6 },
          { order: 5, title: 'Capstone Project', duration_weeks: 6 },
          { order: 6, title: 'Internship', duration_weeks: 12 }
        ],
        certifications: ['Google Data Analytics', 'IBM Data Science'],
        free_resources: [
          { name: 'Kaggle', url: 'https://kaggle.com', type: 'Platform' }
        ]
      }
    ]
  },
  {
    id: 'ece',
    name: 'Electronics & Communication',
    specialisations: [
      {
        id: 'vlsi',
        name: 'VLSI Design',
        icon: '🔌',
        difficulty: 'Very High',
        duration_years: 4,
        roles: [
          { title: 'VLSI Engineer', level: 'Entry', avg_salary_lpa: 14 },
          { title: 'Physical Design Engineer', level: 'Mid', avg_salary_lpa: 22 }
        ],
        salary_range: { min_lpa: 10, max_lpa: 45 },
        top_companies: ['Intel', 'AMD', 'NVIDIA', 'Qualcomm'],
        internship_skills: ['Verilog', 'Digital Design', 'C++', 'Scripting'],
        roadmap_steps: [
          { order: 1, title: 'Digital Electronics', duration_weeks: 6 },
          { order: 2, title: 'Verilog/VHDL', duration_weeks: 6 },
          { order: 3, title: 'Computer Architecture', duration_weeks: 4 },
          { order: 4, title: 'FPGA Design', duration_weeks: 6 },
          { order: 5, title: 'Projects', duration_weeks: 8 },
          { order: 6, title: 'Internship', duration_weeks: 12 }
        ],
        certifications: ['NPTEL VLSI Design'],
        free_resources: [
          { name: 'NPTEL', url: 'https://nptel.ac.in', type: 'Course' }
        ]
      },
      {
        id: 'iot',
        name: 'Embedded Systems & IoT',
        icon: '🌐',
        difficulty: 'Medium',
        duration_years: 4,
        roles: [
          { title: 'IoT Engineer', level: 'Entry', avg_salary_lpa: 8 },
          { title: 'Embedded Software Engineer', level: 'Mid', avg_salary_lpa: 16 }
        ],
        salary_range: { min_lpa: 6, max_lpa: 30 },
        top_companies: ['Bosch', 'Samsung', 'Intel', 'Texas Instruments'],
        internship_skills: ['C/C++', 'Microcontrollers', 'Python', 'Networking'],
        roadmap_steps: [
          { order: 1, title: 'C Programming', duration_weeks: 4 },
          { order: 2, title: 'Microcontrollers (Arduino/Raspberry Pi)', duration_weeks: 6 },
          { order: 3, title: 'Sensors & Actuators', duration_weeks: 4 },
          { order: 4, title: 'IoT Protocols (MQTT, HTTP)', duration_weeks: 4 },
          { order: 5, title: 'IoT Project', duration_weeks: 6 },
          { order: 6, title: 'Internship', duration_weeks: 12 }
        ],
        certifications: ['Cisco IoT Fundamentals'],
        free_resources: [
          { name: 'Arduino Docs', url: 'https://arduino.cc', type: 'Docs' }
        ]
      },
      {
        id: 'telecom',
        name: 'Telecommunication',
        icon: '📡',
        difficulty: 'Medium',
        duration_years: 4,
        roles: [
          { title: 'Network Engineer', level: 'Entry', avg_salary_lpa: 7 },
          { title: 'RF Engineer', level: 'Mid', avg_salary_lpa: 14 }
        ],
        salary_range: { min_lpa: 5, max_lpa: 25 },
        top_companies: ['Jio', 'Airtel', 'Ericsson', 'Nokia'],
        internship_skills: ['Networking', 'Signal Processing', 'Wireless Comms'],
        roadmap_steps: [
          { order: 1, title: 'Networking Basics', duration_weeks: 4 },
          { order: 2, title: 'Signals & Systems', duration_weeks: 6 },
          { order: 3, title: 'Wireless Communication', duration_weeks: 6 },
          { order: 4, title: '5G Technologies', duration_weeks: 4 },
          { order: 5, title: 'Simulation Projects', duration_weeks: 6 },
          { order: 6, title: 'Internship', duration_weeks: 12 }
        ],
        certifications: ['CCNA'],
        free_resources: [
          { name: 'Cisco Networking Academy', url: 'https://netacad.com', type: 'Course' }
        ]
      }
    ]
  },
  {
    id: 'mech',
    name: 'Mechanical Engineering',
    specialisations: [
      {
        id: 'auto',
        name: 'Automotive & EV',
        icon: '🚗',
        difficulty: 'Medium',
        duration_years: 4,
        roles: [
          { title: 'Design Engineer', level: 'Entry', avg_salary_lpa: 6 },
          { title: 'EV Battery Engineer', level: 'Mid', avg_salary_lpa: 14 }
        ],
        salary_range: { min_lpa: 5, max_lpa: 25 },
        top_companies: ['Tata Motors', 'Mahindra', 'Ather', 'Ola Electric'],
        internship_skills: ['CAD', 'Thermodynamics', 'Battery Management'],
        roadmap_steps: [
          { order: 1, title: 'Engineering Drawing & CAD', duration_weeks: 6 },
          { order: 2, title: 'Automotive Systems', duration_weeks: 4 },
          { order: 3, title: 'EV Fundamentals', duration_weeks: 6 },
          { order: 4, title: 'Battery Tech', duration_weeks: 4 },
          { order: 5, title: 'Design Project', duration_weeks: 6 },
          { order: 6, title: 'Internship', duration_weeks: 12 }
        ],
        certifications: ['Autodesk Certified Professional'],
        free_resources: [
          { name: 'NPTEL EV Course', url: 'https://nptel.ac.in', type: 'Course' }
        ]
      },
      {
        id: 'robotics',
        name: 'Robotics & Automation',
        icon: '🦾',
        difficulty: 'High',
        duration_years: 4,
        roles: [
          { title: 'Robotics Engineer', level: 'Entry', avg_salary_lpa: 8 },
          { title: 'Automation Engineer', level: 'Mid', avg_salary_lpa: 16 }
        ],
        salary_range: { min_lpa: 6, max_lpa: 30 },
        top_companies: ['ABB', 'KUKA', 'Fanuc', 'Boston Dynamics'],
        internship_skills: ['ROS', 'Kinematics', 'C++', 'Control Systems'],
        roadmap_steps: [
          { order: 1, title: 'Kinematics & Dynamics', duration_weeks: 6 },
          { order: 2, title: 'Control Systems', duration_weeks: 4 },
          { order: 3, title: 'ROS (Robot Operating System)', duration_weeks: 6 },
          { order: 4, title: 'Computer Vision Basics', duration_weeks: 4 },
          { order: 5, title: 'Robotics Project', duration_weeks: 6 },
          { order: 6, title: 'Internship', duration_weeks: 12 }
        ],
        certifications: ['ROS Certification'],
        free_resources: [
          { name: 'ROS Tutorials', url: 'https://wiki.ros.org', type: 'Docs' }
        ]
      }
    ]
  },
  {
    id: 'civil',
    name: 'Civil Engineering',
    specialisations: [
      {
        id: 'structural',
        name: 'Structural Engineering',
        icon: '🏗️',
        difficulty: 'Medium',
        duration_years: 4,
        roles: [
          { title: 'Site Engineer', level: 'Entry', avg_salary_lpa: 5 },
          { title: 'Structural Designer', level: 'Mid', avg_salary_lpa: 12 }
        ],
        salary_range: { min_lpa: 4, max_lpa: 20 },
        top_companies: ['L&T', 'Tata Projects', 'Shapoorji Pallonji'],
        internship_skills: ['AutoCAD', 'STAAD Pro', 'Project Management'],
        roadmap_steps: [
          { order: 1, title: 'Engineering Mechanics', duration_weeks: 4 },
          { order: 2, title: 'Strength of Materials', duration_weeks: 6 },
          { order: 3, title: 'Structural Analysis', duration_weeks: 6 },
          { order: 4, title: 'Design Software (AutoCAD/STAAD)', duration_weeks: 6 },
          { order: 5, title: 'Design Project', duration_weeks: 4 },
          { order: 6, title: 'Internship', duration_weeks: 12 }
        ],
        certifications: ['AutoCAD Certified'],
        free_resources: [
          { name: 'NPTEL Civil', url: 'https://nptel.ac.in', type: 'Course' }
        ]
      }
    ]
  }
]);

const colleges = loadData('colleges.json', [
  {
    id: 'c1',
    name: 'IIT Hyderabad',
    type: 'IIT',
    location: { city: 'Hyderabad', state: 'Telangana', coordinates: { lat: 17.596, lng: 78.123 } },
    nirf_rank: 8,
    naac_grade: 'A++',
    courses_offered: ['CSE', 'ECE', 'Mech', 'AI', 'Civil'],
    entrance_exams: ['JEE Advanced'],
    cutoff_2024: { CSE_general: 1200, ECE_general: 3400 },
    avg_package_lpa: 24,
    highest_package_lpa: 110,
    placement_rate_pct: 92,
    fees_per_year_inr: 225000,
    website: 'https://iith.ac.in',
    notable_alumni: ['Various'],
    hostel_available: true,
    scholarship_available: true
  },
  {
    id: 'c2',
    name: 'NIT Warangal',
    type: 'NIT',
    location: { city: 'Warangal', state: 'Telangana', coordinates: { lat: 17.983, lng: 79.530 } },
    nirf_rank: 21,
    naac_grade: 'A',
    courses_offered: ['CSE', 'ECE', 'Mech', 'Civil', 'Chemical'],
    entrance_exams: ['JEE Main'],
    cutoff_2024: { CSE_general: 2500, ECE_general: 5000 },
    avg_package_lpa: 18,
    highest_package_lpa: 88,
    placement_rate_pct: 90,
    fees_per_year_inr: 150000,
    website: 'https://nitw.ac.in',
    notable_alumni: ['Various'],
    hostel_available: true,
    scholarship_available: true
  },
  {
    id: 'c3',
    name: 'BITS Pilani (Hyderabad Campus)',
    type: 'Deemed',
    location: { city: 'Hyderabad', state: 'Telangana', coordinates: { lat: 17.544, lng: 78.571 } },
    nirf_rank: 25,
    naac_grade: 'A',
    courses_offered: ['CSE', 'ECE', 'EEE', 'Mech', 'Civil'],
    entrance_exams: ['BITSAT'],
    cutoff_2024: { CSE_general: 280, ECE_general: 250 },
    avg_package_lpa: 20,
    highest_package_lpa: 60,
    placement_rate_pct: 95,
    fees_per_year_inr: 500000,
    website: 'https://bits-pilani.ac.in/hyderabad',
    notable_alumni: ['Various'],
    hostel_available: true,
    scholarship_available: true
  },
  {
    id: 'c4',
    name: 'IIIT Hyderabad',
    type: 'IIIT',
    location: { city: 'Hyderabad', state: 'Telangana', coordinates: { lat: 17.445, lng: 78.348 } },
    nirf_rank: 55,
    naac_grade: 'A++',
    courses_offered: ['CSE', 'ECE'],
    entrance_exams: ['JEE Main', 'UGEE'],
    cutoff_2024: { CSE_general: 1500, ECE_general: 4000 },
    avg_package_lpa: 30,
    highest_package_lpa: 102,
    placement_rate_pct: 100,
    fees_per_year_inr: 360000,
    website: 'https://iiit.ac.in',
    notable_alumni: ['Various'],
    hostel_available: true,
    scholarship_available: true
  },
  {
    id: 'c5',
    name: 'Osmania University',
    type: 'State',
    location: { city: 'Hyderabad', state: 'Telangana', coordinates: { lat: 17.412, lng: 78.528 } },
    nirf_rank: 64,
    naac_grade: 'A+',
    courses_offered: ['CSE', 'ECE', 'Mech', 'Civil', 'EEE'],
    entrance_exams: ['TS EAMCET'],
    cutoff_2024: { CSE_general: 1000, ECE_general: 3000 },
    avg_package_lpa: 8,
    highest_package_lpa: 24,
    placement_rate_pct: 80,
    fees_per_year_inr: 50000,
    website: 'https://osmania.ac.in',
    notable_alumni: ['Various'],
    hostel_available: true,
    scholarship_available: true
  },
  {
    id: 'c6',
    name: 'VIT Vellore',
    type: 'Private',
    location: { city: 'Vellore', state: 'Tamil Nadu', coordinates: { lat: 12.969, lng: 79.155 } },
    nirf_rank: 11,
    naac_grade: 'A++',
    courses_offered: ['CSE', 'ECE', 'Mech', 'Civil', 'IT'],
    entrance_exams: ['VITEEE'],
    cutoff_2024: { CSE_general: 5000, ECE_general: 15000 },
    avg_package_lpa: 9,
    highest_package_lpa: 75,
    placement_rate_pct: 90,
    fees_per_year_inr: 200000,
    website: 'https://vit.ac.in',
    notable_alumni: ['Various'],
    hostel_available: true,
    scholarship_available: true
  }
]);

const internships = loadData('internships.json', [
  {
    id: 'i1',
    company: 'Google',
    role: 'Software Engineering Intern',
    type: 'MNC',
    domain: 'Software Development',
    stipend_monthly_inr: 100000,
    deadline: '2026-12-31',
    required_skills: ['Data Structures', 'Algorithms', 'C++', 'Java'],
    description: 'Work on core Google products.',
    apply_url: 'https://careers.google.com',
    is_active: true
  },
  {
    id: 'i2',
    company: 'ISRO',
    role: 'Research Intern',
    type: 'Government',
    domain: 'Aerospace/Electronics',
    stipend_monthly_inr: 15000,
    deadline: '2026-10-15',
    required_skills: ['MATLAB', 'Python', 'Signal Processing'],
    description: 'Contribute to space research projects.',
    apply_url: 'https://isro.gov.in',
    is_active: true
  },
  {
    id: 'i3',
    company: 'Swiggy',
    role: 'Data Science Intern',
    type: 'Startup',
    domain: 'Data Science',
    stipend_monthly_inr: 40000,
    deadline: '2026-11-20',
    required_skills: ['Python', 'SQL', 'Machine Learning'],
    description: 'Optimize delivery routes using ML.',
    apply_url: 'https://careers.swiggy.com',
    is_active: true
  },
  {
    id: 'i4',
    company: 'Microsoft',
    role: 'Cloud Intern',
    type: 'MNC',
    domain: 'Cloud Computing',
    stipend_monthly_inr: 90000,
    deadline: '2026-12-15',
    required_skills: ['Azure', 'Networking', 'C#', 'Python'],
    description: 'Work with the Azure cloud infrastructure team.',
    apply_url: 'https://careers.microsoft.com',
    is_active: true
  },
  {
    id: 'i5',
    company: 'Tata Motors',
    role: 'Mechanical Design Intern',
    type: 'MNC',
    domain: 'Mechanical Engineering',
    stipend_monthly_inr: 25000,
    deadline: '2026-11-30',
    required_skills: ['AutoCAD', 'SolidWorks', 'Thermodynamics'],
    description: 'Assist in designing components for new EV models.',
    apply_url: 'https://tatamotors.com/careers',
    is_active: true
  },
  {
    id: 'i6',
    company: 'DRDO',
    role: 'Cybersecurity Intern',
    type: 'Government',
    domain: 'Cybersecurity',
    stipend_monthly_inr: 18000,
    deadline: '2026-10-30',
    required_skills: ['Linux', 'Networking', 'Ethical Hacking'],
    description: 'Work on secure communication protocols.',
    apply_url: 'https://drdo.gov.in',
    is_active: true
  },
  {
    id: 'i7',
    company: 'L&T Construction',
    role: 'Civil Engineering Intern',
    type: 'MNC',
    domain: 'Civil Engineering',
    stipend_monthly_inr: 20000,
    deadline: '2026-11-15',
    required_skills: ['AutoCAD', 'Project Management', 'Structural Analysis'],
    description: 'Site management and structural design assistance.',
    apply_url: 'https://larsentoubro.com/careers',
    is_active: true
  }
]);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/streams', (req, res) => {
    res.json(streams);
  });

  app.get('/api/branches', (req, res) => {
    res.json(branches);
  });

  app.get('/api/branches/:id/specialisations', (req, res) => {
    const branch = branches.find((b: any) => b.id === req.params.id);
    if (branch) {
      res.json(branch.specialisations);
    } else {
      res.status(404).json({ error: 'Branch not found' });
    }
  });

  app.get('/api/careers/:specId', (req, res) => {
    let spec = null;
    for (const b of branches) {
      const found = b.specialisations.find((s: any) => s.id === req.params.specId);
      if (found) {
        spec = found;
        break;
      }
    }
    if (spec) {
      res.json(spec);
    } else {
      res.status(404).json({ error: 'Specialisation not found' });
    }
  });

  app.get('/api/colleges', (req, res) => {
    let filtered = colleges;
    if (req.query.type) {
      filtered = filtered.filter((c: any) => c.type === req.query.type);
    }
    if (req.query.city) {
      filtered = filtered.filter((c: any) => c.location.city.toLowerCase() === (req.query.city as string).toLowerCase());
    }
    res.json(filtered);
  });

  app.get('/api/internships', (req, res) => {
    let filtered = internships;
    if (req.query.type) {
      filtered = filtered.filter((i: any) => i.type === req.query.type);
    }
    if (req.query.domain) {
      filtered = filtered.filter((i: any) => i.domain === req.query.domain);
    }
    res.json(filtered);
  });

  // Simple mock auth for prototype
  app.post('/api/auth/login', (req, res) => {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });
    
    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user) {
      const id = Math.random().toString(36).substring(2, 15);
      db.prepare('INSERT INTO users (id, name, email, provider) VALUES (?, ?, ?, ?)').run(id, name || 'User', email, 'mock');
      user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    }
    
    // Parse JSON fields
    user.completed_phases = JSON.parse(user.completed_phases);
    user.profile = JSON.parse(user.profile);
    user.saved_colleges = JSON.parse(user.saved_colleges);
    user.saved_internships = JSON.parse(user.saved_internships);
    user.quiz_results = JSON.parse(user.quiz_results);
    
    res.json({ token: user.id, user });
  });

  // Middleware to mock auth
  const requireAuth = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(token) as any;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    req.user = user;
    next();
  };

  app.get('/api/user/profile', requireAuth, (req: any, res) => {
    const user = req.user;
    user.completed_phases = JSON.parse(user.completed_phases);
    user.profile = JSON.parse(user.profile);
    user.saved_colleges = JSON.parse(user.saved_colleges);
    user.saved_internships = JSON.parse(user.saved_internships);
    user.quiz_results = JSON.parse(user.quiz_results);
    res.json(user);
  });

  app.patch('/api/user/profile', requireAuth, (req: any, res) => {
    const { profile } = req.body;
    const currentProfile = JSON.parse(req.user.profile);
    const newProfile = { ...currentProfile, ...profile };
    db.prepare('UPDATE users SET profile = ? WHERE id = ?').run(JSON.stringify(newProfile), req.user.id);
    res.json({ success: true });
  });

  app.patch('/api/user/progress', requireAuth, (req: any, res) => {
    const { phase } = req.body;
    const completed = JSON.parse(req.user.completed_phases);
    if (!completed.includes(phase)) {
      completed.push(phase);
      db.prepare('UPDATE users SET completed_phases = ?, current_phase = ? WHERE id = ?').run(JSON.stringify(completed), phase + 1, req.user.id);
    }
    res.json({ success: true });
  });

  app.post('/api/user/save/college/:id', requireAuth, (req: any, res) => {
    const saved = JSON.parse(req.user.saved_colleges);
    const id = req.params.id;
    if (saved.includes(id)) {
      saved.splice(saved.indexOf(id), 1);
    } else {
      saved.push(id);
    }
    db.prepare('UPDATE users SET saved_colleges = ? WHERE id = ?').run(JSON.stringify(saved), req.user.id);
    res.json({ saved });
  });

  app.post('/api/user/save/internship/:id', requireAuth, (req: any, res) => {
    const saved = JSON.parse(req.user.saved_internships);
    const id = req.params.id;
    if (saved.includes(id)) {
      saved.splice(saved.indexOf(id), 1);
    } else {
      saved.push(id);
    }
    db.prepare('UPDATE users SET saved_internships = ? WHERE id = ?').run(JSON.stringify(saved), req.user.id);
    res.json({ saved });
  });

  // AI Roadmap Generator using Decision Tree
  app.post('/api/ai/roadmap', requireAuth, async (req: any, res) => {
    try {
      const { specialisation, current_skills, target_timeline_months, college_year } = req.body;
      
      let roadmap = { phases: [] as any[] };

      if (specialisation === 'aiml' || specialisation === 'data') {
         roadmap.phases = [
           {
             title: "Foundation & Python",
             weeks: [
               { week: "Week 1-2", title: "Python & Math", tasks: ["Learn Python basics", "Study Linear Algebra & Statistics", "Practice on HackerRank"] }
             ]
           },
           {
             title: "Machine Learning Core",
             weeks: [
               { week: "Week 3-4", title: "ML Algorithms", tasks: ["Implement Regression & Classification", "Learn Scikit-Learn & Pandas", "Build a simple predictor"] }
             ]
           }
         ];
      } else if (specialisation === 'fullstack') {
         roadmap.phases = [
           {
             title: "Frontend Basics",
             weeks: [
               { week: "Week 1-2", title: "HTML/CSS/JS", tasks: ["Build a portfolio site", "Learn DOM manipulation", "Master Flexbox & Grid"] }
             ]
           },
           {
             title: "Backend & Database",
             weeks: [
               { week: "Week 3-4", title: "Node.js & DB", tasks: ["Create REST API", "Connect to MongoDB", "Implement user auth"] }
             ]
           }
         ];
      } else if (specialisation === 'cyber') {
         roadmap.phases = [
           {
             title: "Networking & OS",
             weeks: [
               { week: "Week 1-2", title: "Linux & Networks", tasks: ["Learn Linux command line", "Understand TCP/IP & DNS", "Set up a VM"] }
             ]
           },
           {
             title: "Security Fundamentals",
             weeks: [
               { week: "Week 3-4", title: "Ethical Hacking", tasks: ["Learn OWASP Top 10", "Practice on TryHackMe", "Use Nmap & Wireshark"] }
             ]
           }
         ];
      } else {
         roadmap.phases = [
           {
             title: "Core Fundamentals",
             weeks: [
               { week: "Week 1-2", title: "Basics of " + specialisation, tasks: ["Review core concepts", "Complete introductory course", "Read standard textbooks"] }
             ]
           },
           {
             title: "Advanced Topics & Projects",
             weeks: [
               { week: "Week 3-4", title: "Hands-on Project", tasks: ["Build a mini-project", "Update resume", "Learn industry standard tools"] }
             ]
           }
         ];
      }

      // Add an internship phase at the end
      roadmap.phases.push({
        title: "Internship Preparation",
        weeks: [
          { week: "Final Weeks", title: "Apply & Interview", tasks: ["Polish Resume & GitHub", "Apply on LinkedIn/Internshala", "Practice Mock Interviews"] }
        ]
      });

      res.json(roadmap);
    } catch (error) {
      console.error('Roadmap error:', error);
      res.status(500).json({ error: 'Failed to generate roadmap' });
    }
  });

  // AI Chatbot using Decision Tree
  app.post('/api/ai/chat', requireAuth, async (req: any, res) => {
    try {
      const { message } = req.body;
      const msg = message.toLowerCase();
      let responseText = "I'm PathFinder, your career counselor. I can help you with college choices, internships, and skill roadmaps. What would you like to know?";

      if (msg.includes('hi') || msg.includes('hello')) {
        responseText = "Hello! I'm PathFinder. How can I help you with your engineering career today?";
      } else if (msg.includes('internship') || msg.includes('job')) {
        responseText = "For internships, I recommend building 2-3 solid projects in your domain. Then, apply actively on LinkedIn, Internshala, and directly on company career pages. Don't forget to tailor your resume!";
      } else if (msg.includes('college') || msg.includes('iit') || msg.includes('nit')) {
        responseText = "Top colleges like IITs and NITs require clearing JEE Main and Advanced. Focus on your MPC subjects and take regular mock tests. If you're already in college, focus on maintaining a good CGPA (>8.0) and building skills.";
      } else if (msg.includes('skill') || msg.includes('learn') || msg.includes('roadmap')) {
        responseText = "To build skills, start with the fundamentals of your chosen branch. Use free resources like NPTEL, YouTube, and Coursera. The key is consistency and building hands-on projects.";
      } else if (msg.includes('branch') || msg.includes('cse') || msg.includes('ece') || msg.includes('mech')) {
        responseText = "Choosing a branch depends on your interests. CSE is great for software, ECE for electronics and IoT, and Mechanical/Civil for core engineering. Pick what you enjoy learning!";
      }

      res.json({ response: responseText });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: 'Failed to get response' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
