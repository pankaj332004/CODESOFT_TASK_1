const mongoose = require('mongoose');
const dns = require('dns');

// On Windows, local router DNS often fails resolving MongoDB Atlas SRV records (ECONNREFUSED)
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // Ignore in environments where setting DNS servers is not permitted
}

// In-memory fallback store initialized with realistic seed data
const initialUsers = [
  {
    _id: '6601a0000000000000000001',
    name: 'John Doe',
    email: 'john@example.com',
    password: '$2b$10$H4ZLjVSfsCLZ2OYNuhJo9.ly/l/y2ynaL1A4CfUF5R3TOZ/KOJDoK', // 'password123'
    role: 'candidate',
    phone: '+01 9876543210',
    location: 'New York, USA',
    bio: 'Passionate Frontend and Full-Stack Developer with 3+ years experience building modern web applications with React, TypeScript, and Node.js.',
    resume: 'resume-demo.pdf',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    savedJobs: ['6602b0000000000000000001', '6602b0000000000000000003'],
    createdAt: new Date('2024-01-10T10:00:00Z'),
  },
  {
    _id: '6601a0000000000000000002',
    name: 'Jane Smith',
    email: 'jane@employer.com',
    password: '$2b$10$H4ZLjVSfsCLZ2OYNuhJo9.ly/l/y2ynaL1A4CfUF5R3TOZ/KOJDoK', // 'password123'
    role: 'employer',
    phone: '+1 415 555 0192',
    location: 'Mountain View, CA',
    bio: 'Lead Technical Recruiter at Google hiring exceptional engineering talent.',
    companyName: 'Google',
    companyWebsite: 'https://google.com/careers',
    resume: '',
    profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    savedJobs: [],
    createdAt: new Date('2024-01-05T10:00:00Z'),
  },
];

const initialJobs = [
  {
    _id: '6602b0000000000000000001',
    title: 'Frontend Developer',
    company: 'Google',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    location: 'Remote',
    category: 'Development',
    type: 'Full Time',
    salary: { min: 90000, max: 120000, currency: '$', period: 'yr' },
    experience: '1-3 years',
    description: 'We are looking for a skilled Frontend Developer to join our team. You will be responsible for building user interfaces, implementing designs, and improving user experience across our core web applications.',
    responsibilities: [
      'Build reusable components using React',
      'Implement responsive designs and modern layouts',
      'Collaborate with backend developers and UX designers',
      'Optimize applications for maximum speed and scalability',
    ],
    requirements: [
      '2+ years of experience with React, HTML5, and CSS3',
      'Strong knowledge of modern JavaScript (ES6+)',
      'Familiarity with Git and version control workflows',
      'Good communication skills and teamwork mindset',
    ],
    employer: '6601a0000000000000000002',
    featured: true,
    views: 1240,
    applicantsCount: 42,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    _id: '6602b0000000000000000002',
    title: 'UI/UX Designer',
    company: 'Dribbble',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Dribbble_logo.svg',
    location: 'New York, USA',
    category: 'Design',
    type: 'Full Time',
    salary: { min: 70000, max: 95000, currency: '$', period: 'yr' },
    experience: '3-5 years',
    description: 'Dribbble is looking for an inventive UI/UX Designer to craft engaging digital experiences. You will design web and mobile interfaces that inspire designers and creative teams globally.',
    responsibilities: [
      'Create wireframes, storyboards, user flows, and site maps',
      'Design graphic user interface elements like menus, tabs, and widgets',
      'Conduct user research and evaluate user feedback',
      'Maintain and expand our multi-platform design systems',
    ],
    requirements: [
      'Proven experience as a UI/UX Designer or similar role',
      'Strong portfolio of design projects in Figma or Adobe XD',
      'Understanding of interaction design and information architecture',
      'Ability to translate complex user journeys into simple solutions',
    ],
    employer: '6601a0000000000000000002',
    featured: true,
    views: 890,
    applicantsCount: 28,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    _id: '6602b0000000000000000003',
    title: 'Backend Developer',
    company: 'Microsoft',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    location: 'San Francisco, USA',
    category: 'Development',
    type: 'Full Time',
    salary: { min: 100000, max: 135000, currency: '$', period: 'yr' },
    experience: '3-5 years',
    description: 'Join the Azure and Cloud developer tools team at Microsoft. Design and develop resilient microservices, distributed APIs, and scalable infrastructure powering millions of developers.',
    responsibilities: [
      'Design, build, and deploy reliable high-throughput RESTful services',
      'Collaborate on cloud architecture using Docker and Kubernetes',
      'Optimize database queries and cache strategies',
      'Participate in code reviews, design docs, and security audits',
    ],
    requirements: [
      '3+ years with Node.js, Python, or Go',
      'Hands-on experience with SQL and NoSQL databases (MongoDB/PostgreSQL)',
      'Understanding of microservices patterns and cloud platforms',
      'Strong problem-solving and algorithmic thinking',
    ],
    employer: '6601a0000000000000000002',
    featured: true,
    views: 1530,
    applicantsCount: 56,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    _id: '6602b0000000000000000004',
    title: 'Product Manager',
    company: 'Amazon',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    location: 'Seattle, USA',
    category: 'Management',
    type: 'Full Time',
    salary: { min: 110000, max: 150000, currency: '$', period: 'yr' },
    experience: '5+ years',
    description: 'Drive high-impact customer-facing product strategies for Amazon E-commerce experiences. Define roadmap, gather insights, and work closely with engineering and design.',
    responsibilities: [
      'Define product roadmap, specifications, and go-to-market strategies',
      'Work cross-functionally with designers, engineers, and data scientists',
      'Analyze metrics and feedback to iterate rapidly',
      'Deliver features that delight millions of global customers',
    ],
    requirements: [
      '5+ years experience in technical product management',
      'Demonstrated track record of launching successful consumer products',
      'Strong quantitative analysis and user empathy',
      'Excellent presentation and stakeholder communication',
    ],
    employer: '6601a0000000000000000002',
    featured: false,
    views: 740,
    applicantsCount: 19,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    _id: '6602b0000000000000000005',
    title: 'Marketing Specialist',
    company: 'Spotify',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
    location: 'Remote',
    category: 'Marketing',
    type: 'Part Time',
    salary: { min: 45000, max: 65000, currency: '$', period: 'yr' },
    experience: '1-3 years',
    description: 'Grow the Spotify podcast and artist community through social campaigns, digital storytelling, content strategy, and community engagement.',
    responsibilities: [
      'Develop cross-channel promotional marketing campaigns',
      'Engage with creators and track viral trends',
      'Measure campaign performance using Google Analytics and Mixpanel',
      'Coordinate email newsletter automation and copywriting',
    ],
    requirements: [
      '1-3 years digital marketing or social media management',
      'Expertise in content creation, SEO, and paid media',
      'Analytical mindset with proven growth track record',
    ],
    employer: '6601a0000000000000000002',
    featured: false,
    views: 610,
    applicantsCount: 15,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
  },
  {
    _id: '6602b0000000000000000006',
    title: 'Senior DevOps Engineer',
    company: 'Netflix',
    companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
    location: 'Los Gatos, USA',
    category: 'Development',
    type: 'Full Time',
    salary: { min: 140000, max: 180000, currency: '$', period: 'yr' },
    experience: '5+ years',
    description: 'Help build and operate the infrastructure that delivers entertainment to 250+ million members worldwide. Work with AWS, Kubernetes, and automated CI/CD pipelines.',
    responsibilities: [
      'Automate cloud infrastructure with Terraform and Ansible',
      'Monitor distributed microservices with Prometheus and Grafana',
      'Improve deployment velocity, zero-downtime releases, and reliability',
    ],
    requirements: [
      '5+ years in DevOps / SRE role',
      'Deep AWS, Linux, and Kubernetes experience',
      'Strong automation scripting in Bash, Python, or Go',
    ],
    employer: '6601a0000000000000000002',
    featured: true,
    views: 1100,
    applicantsCount: 33,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
];

const initialApplications = [
  {
    _id: '6603c0000000000000000001',
    job: '6602b0000000000000000001',
    candidate: '6601a0000000000000000001',
    candidateName: 'John Doe',
    candidateEmail: 'john@example.com',
    candidatePhone: '+01 9876543210',
    resume: 'resume-john-doe.pdf',
    coverLetter: 'I am excited about this Frontend Developer position and believe my React experience makes me a great fit.',
    status: 'Applied',
    createdAt: new Date('2024-04-20T10:00:00Z'),
  },
  {
    _id: '6603c0000000000000000002',
    job: '6602b0000000000000000002',
    candidate: '6601a0000000000000000001',
    candidateName: 'John Doe',
    candidateEmail: 'john@example.com',
    candidatePhone: '+01 9876543210',
    resume: 'resume-john-doe.pdf',
    coverLetter: 'I love Dribbble and have a strong passion for modern clean web interfaces.',
    status: 'Under Review',
    createdAt: new Date('2024-04-16T12:30:00Z'),
  },
  {
    _id: '6603c0000000000000000003',
    job: '6602b0000000000000000003',
    candidate: '6601a0000000000000000001',
    candidateName: 'John Doe',
    candidateEmail: 'john@example.com',
    candidatePhone: '+01 9876543210',
    resume: 'resume-john-doe.pdf',
    coverLetter: 'Excited about backend systems and Azure cloud services.',
    status: 'Interview',
    createdAt: new Date('2024-04-15T09:15:00Z'),
  },
  {
    _id: '6603c0000000000000000004',
    job: '6602b0000000000000000004',
    candidate: '6601a0000000000000000001',
    candidateName: 'John Doe',
    candidateEmail: 'john@example.com',
    candidatePhone: '+01 9876543210',
    resume: 'resume-john-doe.pdf',
    coverLetter: 'Interested in product development processes.',
    status: 'Rejected',
    createdAt: new Date('2024-04-10T14:40:00Z'),
  },
];

global.__IN_MEMORY_STORE__ = {
  users: [...initialUsers],
  jobs: [...initialJobs],
  applications: [...initialApplications],
  isUsingMongo: false,
};

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/job-board';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    global.__IN_MEMORY_STORE__.isUsingMongo = true;

    // Seed database if empty
    const User = require('../models/User');
    const Job = require('../models/Job');
    const Application = require('../models/Application');

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding initial MongoDB data...');
      await User.insertMany(initialUsers);
      await Job.insertMany(initialJobs);
      await Application.insertMany(initialApplications);
      console.log('✅ Initial database seed completed!');
    }
  } catch (error) {
    console.warn(`⚠️  MongoDB connection skipped (${error.message}).`);
    console.log(`🚀 Operating in High-Performance Local In-Memory Store mode with full CRUD capability.`);
    global.__IN_MEMORY_STORE__.isUsingMongo = false;
  }
};

module.exports = {
  connectDB,
  store: global.__IN_MEMORY_STORE__,
};
