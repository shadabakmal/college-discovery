import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const collegesData = [
  // ================= ENGINEERING (IITs) =================
  {
    name: 'IIT (ISM) DHANBAD',
    location: 'Dhanbad, Jharkhand',
    type: 'Government',
    established: 1926,
    naacGrade: 'A',
    ranking: 15,
    rankingBody: 'NIRF',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Heritage_Building_at_IIT_Dhanbad_1.jpg',
    websiteUrl: 'https://www.iitism.ac.in/',
    rating: 4.6,
    reviewCount: 3200,
    placementRate: 92.5,
    avgCtc: 1850000,
    overview: "The Indian Institute of Technology (Indian School of Mines), Dhanbad is a premier engineering and research institution. Originally established in 1926 by Lord Irwin to cater to the mining sector, it has evolved into a full-fledged IIT offering diverse engineering disciplines including highly competitive Computer Science, Mineral, and Metallurgical Engineering programs. It is renowned for its rigorous academic curriculum and exceptionally strong alumni network across core industries and tech giants.",
    topRecruiters: ["Google", "Microsoft", "Amazon", "Tata Steel", "Vedanta", "Goldman Sachs"],
    courses: {
      create: [
        { name: 'B.Tech Computer Science & Engineering', stream: 'Engineering', duration: 4, firstYearFee: 265000 },
        { name: 'B.Tech Mineral and Metallurgical Engineering', stream: 'Engineering', duration: 4, firstYearFee: 265000 }
      ]
    },
    reviews: {
      create: [
        { author: "Alumni 2024", rating: 5.0, comment: "The coding culture here is incredible, especially for competitive programming. Core branches like Metallurgy also have phenomenal lab facilities and industry tie-ups." },
        { author: "Current Student", rating: 4.5, comment: "Campus life is vibrant. The placement cell is highly active, bringing top recruiters from both software and core sectors." }
      ]
    }
  },
  {
    name: 'Indian Institute of Technology Madras',
    location: 'Chennai, Tamil Nadu',
    type: 'Government',
    established: 1959,
    naacGrade: 'A++',
    ranking: 1,
    rankingBody: 'NIRF',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Chennai_-_IIT_Madras_-_Admin_Block.jpg',
    websiteUrl: 'https://www.iitm.ac.in/',
    rating: 4.9,
    reviewCount: 5100,
    placementRate: 96.0,
    avgCtc: 2140000,
    overview: "IIT Madras is recognized globally for its excellence in technical education, basic and applied research, innovation, entrepreneurship, and industrial consultancy. It consistently ranks #1 in the NIRF engineering category. The institute offers a rich campus life situated in a beautiful forested area.",
    topRecruiters: ["Apple", "Texas Instruments", "Bain & Co", "McKinsey", "Intel"],
    courses: {
      create: [
        { name: 'B.Tech Electrical Engineering', stream: 'Engineering', duration: 4, firstYearFee: 210000 }
      ]
    },
    reviews: {
      create: [
        { author: "Tech Enthusiast", rating: 5.0, comment: "Best research park in India. The startup ecosystem is unmatched." }
      ]
    }
  },
  {
    name: 'Indian Institute of Technology Delhi',
    location: 'New Delhi, Delhi',
    type: 'Government',
    established: 1961,
    naacGrade: 'A++',
    ranking: 2,
    rankingBody: 'NIRF',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/53/IIT_Delhi_Main_Building.jpg',
    websiteUrl: 'https://home.iitd.ac.in/',
    rating: 4.8,
    reviewCount: 4800,
    placementRate: 95.5,
    avgCtc: 2300000,
    overview: "IIT Delhi is a globally recognized institute of national importance. Located in the heart of the national capital, it boasts a deeply entrenched entrepreneurial culture and highly robust industry-academia partnerships. The institution is known for its rigorous academics and producing a massive share of India's unicorn founders.",
    topRecruiters: ["Microsoft", "Google", "Optiver", "Jane Street", "McKinsey & Company", "Bain & Co"],
    courses: {
      create: [{ name: 'B.Tech Computer Science', stream: 'Engineering', duration: 4, firstYearFee: 225000 }]
    },
    reviews: {
      create: [
        { author: "Startup Founder", rating: 5.0, comment: "The entrepreneurial ecosystem here is unmatched. You are constantly surrounded by brilliant minds building the next big thing." },
        { author: "Current Student", rating: 4.5, comment: "Academics are very tough, but the location in South Delhi and the campus culture make it an amazing 4 years." }
      ]
    }
  },
  {
    name: 'Indian Institute of Technology Bombay',
    location: 'Mumbai, Maharashtra',
    type: 'Government',
    established: 1958,
    naacGrade: 'A++',
    ranking: 3,
    rankingBody: 'NIRF',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800',
    websiteUrl: 'https://www.iitb.ac.in/',
    rating: 4.9,
    reviewCount: 5500,
    placementRate: 97.0,
    avgCtc: 2500000,
    overview: "Located in Powai, Mumbai, IIT Bombay is arguably the most preferred destination for JEE Advanced top rankers. It offers a unique blend of extreme academic rigor and a highly vibrant campus life, hosting Asia's largest college cultural festival (Mood Indigo) and tech festival (Techfest).",
    topRecruiters: ["Google", "Rubrik", "Sony Japan", "Microsoft", "Qualcomm", "Tower Research"],
    courses: {
      create: [{ name: 'B.Tech Mechanical Engineering', stream: 'Engineering', duration: 4, firstYearFee: 230000 }]
    },
    reviews: {
      create: [
        { author: "Tech Lead", rating: 5.0, comment: "Best computer science department in the country. Placements are heavily focused on tech and high-frequency trading firms." },
        { author: "Alumni", rating: 4.8, comment: "The campus inside the bustling city of Mumbai is a green oasis. Mood Indigo memories will last a lifetime." }
      ]
    }
  },
  {
    name: 'Indian Institute of Technology Kanpur',
    location: 'Kanpur, Uttar Pradesh',
    type: 'Government',
    established: 1959,
    naacGrade: 'A+',
    ranking: 4,
    rankingBody: 'NIRF',
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
    websiteUrl: 'https://www.iitk.ac.in/',
    rating: 4.8,
    reviewCount: 4200,
    placementRate: 94.0,
    avgCtc: 2200000,
    overview: "IIT Kanpur is renowned for its intense focus on pure sciences, research, and hardcore engineering. It boasts one of the largest residential campuses among IITs and has a rich legacy of producing world-class academicians, researchers, and core engineering professionals.",
    topRecruiters: ["Intel", "Texas Instruments", "Amazon", "Microsoft", "JPMorgan Chase"],
    courses: {
      create: [{ name: 'B.Tech Aerospace Engineering', stream: 'Engineering', duration: 4, firstYearFee: 220000 }]
    },
    reviews: {
      create: [
        { author: "Research Scholar", rating: 5.0, comment: "If you genuinely love engineering and research, there is no better place than IIT Kanpur. The grading is tough, but it makes you rock solid." }
      ]
    }
  },

  // ================= ENGINEERING (NITs) =================
  {
    name: 'NIT Tiruchirappalli',
    location: 'Tiruchirappalli, Tamil Nadu',
    type: 'Government',
    established: 1964,
    naacGrade: 'A+',
    ranking: 9,
    rankingBody: 'NIRF',
    imageUrl: 'https://images.unsplash.com/photo-1592289139045-81788c037985?w=800',
    websiteUrl: 'https://www.nitt.edu/',
    rating: 4.7,
    reviewCount: 3800,
    placementRate: 93.0,
    avgCtc: 1250000,
    overview: "National Institute of Technology, Tiruchirappalli (NITT) is the undisputed #1 NIT in India. It competes directly with top-tier IITs in terms of placements, infrastructure, and cut-offs. The campus is massive, and it is famous for its cultural fest 'Festember' and tech fest 'Pragyan'.",
    topRecruiters: ["Oracle", "Amazon", "L&T", "Morgan Stanley", "Google"],
    courses: {
      create: [{ name: 'B.Tech Electronics', stream: 'Engineering', duration: 4, firstYearFee: 175000 }]
    },
    reviews: {
      create: [
        { author: "B.Tech Grad", rating: 4.5, comment: "The ROI is incredible here. You get IIT-level placements at a fraction of the fees." },
        { author: "Hosteler", rating: 4.0, comment: "The weather is extremely hot, but the peer group and club culture make up for it." }
      ]
    }
  },
  {
    name: 'NIT Surathkal',
    location: 'Surathkal, Karnataka',
    type: 'Government',
    established: 1960,
    naacGrade: 'A+',
    ranking: 12,
    rankingBody: 'NIRF',
    imageUrl: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800',
    websiteUrl: 'https://www.nitk.ac.in/',
    rating: 4.6,
    reviewCount: 3500,
    placementRate: 92.0,
    avgCtc: 1300000,
    overview: "NITK Surathkal is famous for having its own private beach and a phenomenal IT/software placement record due to its proximity to Bangalore. It is consistently ranked among the top 3 NITs in the country.",
    topRecruiters: ["Microsoft", "Goldman Sachs", "Amazon", "Cisco", "DE Shaw"],
    courses: {
      create: [{ name: 'B.Tech Information Technology', stream: 'Engineering', duration: 4, firstYearFee: 170000 }]
    },
    reviews: {
      create: [
        { author: "IT Student", rating: 5.0, comment: "Having a private beach is as cool as it sounds. Placements in IT/CS are nearly 100% with amazing packages." }
      ]
    }
  },
  {
    name: 'NIT Rourkela',
    location: 'Rourkela, Odisha',
    type: 'Government',
    established: 1961,
    naacGrade: 'A',
    ranking: 16,
    rankingBody: 'NIRF',
    imageUrl: 'https://images.unsplash.com/photo-1525926472898-a0f26ff008ee?w=800',
    websiteUrl: 'https://www.nitrkl.ac.in/',
    rating: 4.5,
    reviewCount: 3100,
    placementRate: 90.0,
    avgCtc: 1150000,
    overview: "NIT Rourkela boasts one of the largest and greenest campuses in India. It is highly reputed for offering a very diverse range of engineering disciplines, especially in core sectors like Mining, Metallurgy, and Ceramic engineering.",
    topRecruiters: ["Tata Steel", "Bajaj Auto", "Amazon", "Maruti Suzuki", "Vedanta"],
    courses: {
      create: [{ name: 'B.Tech Civil Engineering', stream: 'Engineering', duration: 4, firstYearFee: 165000 }]
    },
    reviews: {
      create: [
        { author: "Core Engineer", rating: 4.5, comment: "Excellent facilities for core engineering. The campus is massive and has great sports facilities." }
      ]
    }
  },
  {
    name: 'NIT Warangal',
    location: 'Warangal, Telangana',
    type: 'Government',
    established: 1959,
    naacGrade: 'A+',
    ranking: 21,
    rankingBody: 'NIRF',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800',
    websiteUrl: 'https://www.nitw.ac.in/',
    rating: 4.6,
    reviewCount: 3400,
    placementRate: 91.5,
    avgCtc: 1350000,
    overview: "Being the first ever REC (now NIT) established in India, NIT Warangal holds a prestigious legacy. It is highly competitive and is renowned for its excellent Computer Science department and strict academic standards.",
    topRecruiters: ["Oracle", "Qualcomm", "Microsoft", "TCS", "Dr. Reddy's"],
    courses: {
      create: [{ name: 'B.Tech Computer Science', stream: 'Engineering', duration: 4, firstYearFee: 172000 }]
    },
    reviews: {
      create: [
        { author: "Software Dev", rating: 4.5, comment: "Placements are top-notch, but academics and attendance rules are quite strict compared to other colleges." }
      ]
    }
  },

  // ================= MANAGEMENT (MBA) =================
  {
    name: 'IIM Ahmedabad',
    location: 'Ahmedabad, Gujarat',
    type: 'Government',
    established: 1961,
    naacGrade: 'A++',
    ranking: 1,
    rankingBody: 'NIRF Management',
    imageUrl: 'https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=800',
    websiteUrl: 'https://www.iima.ac.in/',
    rating: 4.9,
    reviewCount: 2100,
    placementRate: 100.0,
    avgCtc: 3436000,
    overview: "The absolute pinnacle of management education in India. IIMA is famous for its rigorous case-study methodology, iconic red-brick architecture, and unparalleled placements in top-tier consulting, finance, and general management roles.",
    topRecruiters: ["McKinsey & Company", "Boston Consulting Group (BCG)", "Bain & Co", "Goldman Sachs", "Tata Administrative Services"],
    courses: {
      create: [{ name: 'MBA (PGPM)', stream: 'Management', duration: 2, firstYearFee: 1250000 }]
    },
    reviews: {
      create: [
        { author: "WIMWIan", rating: 5.0, comment: "The academic rigor here will push you to your absolute limits. But the brand value and the network you build are unmatched globally." }
      ]
    }
  },
  {
    name: 'IIM Bangalore',
    location: 'Bengaluru, Karnataka',
    type: 'Government',
    established: 1973,
    naacGrade: 'A++',
    ranking: 2,
    rankingBody: 'NIRF Management',
    imageUrl: 'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800',
    websiteUrl: 'https://www.iimb.ac.in/',
    rating: 4.9,
    reviewCount: 1950,
    placementRate: 100.0,
    avgCtc: 3531000,
    overview: "Located in India's silicon valley, IIMB is highly favored for Product Management, IT consulting, and strategy roles. Its beautiful stone-walled campus was famously featured in the movie '3 Idiots'.",
    topRecruiters: ["Amazon", "Microsoft", "BCG", "Bain & Co", "Accenture Strategy"],
    courses: {
      create: [{ name: 'MBA (PGPM)', stream: 'Management', duration: 2, firstYearFee: 1225000 }]
    },
    reviews: {
      create: [
        { author: "Product Manager", rating: 5.0, comment: "Best IIM for tech and product roles. The location advantage of Bangalore brings amazing startups and tech giants to campus." }
      ]
    }
  },
  {
    name: 'IIM Calcutta',
    location: 'Kolkata, West Bengal',
    type: 'Government',
    established: 1961,
    naacGrade: 'A+',
    ranking: 4,
    rankingBody: 'NIRF Management',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
    websiteUrl: 'https://www.iimcal.ac.in/',
    rating: 4.8,
    reviewCount: 1800,
    placementRate: 100.0,
    avgCtc: 3507000,
    overview: "The oldest IIM, affectionately known as the 'Finance Campus of India'. IIMC is the holy grail for students aiming for high-finance roles like Investment Banking and Private Equity. It is famous for its beautiful 7-lakes campus.",
    topRecruiters: ["JP Morgan Chase", "Goldman Sachs", "Morgan Stanley", "Avendus Capital", "BCG"],
    courses: {
      create: [{ name: 'MBA (PGPM)', stream: 'Management', duration: 2, firstYearFee: 1150000 }]
    },
    reviews: {
      create: [
        { author: "Joka Grad", rating: 5.0, comment: "If you want Investment Banking, this is the place. The math and finance faculties are legends." }
      ]
    }
  },
  {
    name: 'IIM Lucknow',
    location: 'Lucknow, Uttar Pradesh',
    type: 'Government',
    established: 1984,
    naacGrade: 'A+',
    ranking: 6,
    rankingBody: 'NIRF Management',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800',
    websiteUrl: 'https://www.iiml.ac.in/',
    rating: 4.7,
    reviewCount: 1600,
    placementRate: 100.0,
    avgCtc: 3220000,
    overview: "Known as the 'Helicon' campus, IIM Lucknow is incredibly competitive and is particularly renowned for producing top-tier marketing and operations leaders. It has a reputation for intense academic pressure.",
    topRecruiters: ["Hindustan Unilever", "P&G", "Amazon", "McKinsey", "Deloitte"],
    courses: {
      create: [{ name: 'MBA (PGPM)', stream: 'Management', duration: 2, firstYearFee: 1050000 }]
    },
    reviews: {
      create: [
        { author: "Marketing Head", rating: 4.5, comment: "They don't call it 'HelL' for nothing. The pressure is immense, but it transforms you. Marketing placements are top tier." }
      ]
    }
  },
  {
    name: 'FMS Delhi',
    location: 'New Delhi, Delhi',
    type: 'Government',
    established: 1954,
    naacGrade: 'A',
    ranking: 8,
    rankingBody: 'India Today',
    imageUrl: 'https://images.unsplash.com/photo-1523580494112-071d1694f5fb?w=800',
    websiteUrl: 'http://www.fms.edu/',
    rating: 4.8,
    reviewCount: 1400,
    placementRate: 100.0,
    avgCtc: 3416000,
    overview: "Faculty of Management Studies (FMS) is famous for one thing: The highest Return on Investment (ROI) in the country. Operated under Delhi University, it charges extremely low tuition fees while offering placements that match or beat the top IIMs.",
    topRecruiters: ["ITC", "HUL", "Tata Administrative Services", "BCG", "Amazon"],
    courses: {
      create: [{ name: 'MBA', stream: 'Management', duration: 2, firstYearFee: 100000 }]
    },
    reviews: {
      create: [
        { author: "FMS Alum", rating: 5.0, comment: "You graduate with zero debt and a 30 LPA package. The campus is just a single red building, but the brand value is massive." }
      ]
    }
  },

  // ================= MEDICAL =================
  {
    name: 'AIIMS New Delhi',
    location: 'New Delhi, Delhi',
    type: 'Government',
    established: 1956,
    naacGrade: 'A++',
    ranking: 1,
    rankingBody: 'NIRF Medical',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
    websiteUrl: 'https://www.aiims.edu/',
    rating: 5.0,
    reviewCount: 3800,
    placementRate: 99.0,
    avgCtc: 1200000,
    overview: "The absolute zenith of medical education in India. AIIMS Delhi offers unparalleled clinical exposure due to its massive patient influx. It is a highly prestigious institution known for groundbreaking medical research and producing top doctors.",
    topRecruiters: ["AIIMS Hospitals", "Max Healthcare", "Apollo Hospitals", "WHO", "Medanta"],
    courses: {
      create: [{ name: 'MBBS', stream: 'Medical', duration: 5, firstYearFee: 6000 }]
    },
    reviews: {
      create: [
        { author: "Medical Student", rating: 5.0, comment: "Getting in is the hardest part. Once inside, the clinical exposure and faculty are world-class. The fees are practically zero." }
      ]
    }
  },
  {
    name: 'PGIMER Chandigarh',
    location: 'Chandigarh, Punjab',
    type: 'Government',
    established: 1962,
    naacGrade: 'A+',
    ranking: 2,
    rankingBody: 'NIRF Medical',
    imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800',
    websiteUrl: 'https://pgimer.edu.in/',
    rating: 4.8,
    reviewCount: 1200,
    placementRate: 98.0,
    avgCtc: 1000000,
    overview: "PGIMER is a premier medical and research institution focused heavily on postgraduate and specialized medical training. It is famous for its intensive workload and exceptionally skilled alumni.",
    topRecruiters: ["Government Medical Colleges", "Fortis", "Apollo", "Research Institutes"],
    courses: {
      create: [{ name: 'MD/MS', stream: 'Medical', duration: 3, firstYearFee: 15000 }]
    },
    reviews: {
      create: [
        { author: "Resident Doctor", rating: 4.8, comment: "The residency here is extremely grueling with insane working hours, but you will come out as one of the best specialists in the country." }
      ]
    }
  },
  {
    name: 'CMC Vellore',
    location: 'Vellore, Tamil Nadu',
    type: 'Private',
    established: 1900,
    naacGrade: 'A++',
    ranking: 3,
    rankingBody: 'NIRF Medical',
    imageUrl: 'https://images.unsplash.com/photo-1538108149393-cebb921d1d86?w=800',
    websiteUrl: 'https://www.cmch-vellore.edu/',
    rating: 4.9,
    reviewCount: 2200,
    placementRate: 99.0,
    avgCtc: 800000,
    overview: "Christian Medical College (CMC) is India's top private medical college. It is globally recognized for its heavy emphasis on community healthcare, clinical skills, and a strong culture of medical ethics and service.",
    topRecruiters: ["Mission Hospitals", "CMC Network", "Apollo", "Fortis"],
    courses: {
      create: [{ name: 'MBBS', stream: 'Medical', duration: 5, firstYearFee: 50000 }]
    },
    reviews: {
      create: [
        { author: "MBBS Intern", rating: 5.0, comment: "The focus here is on genuine patient care and service rather than just commercial medicine. The community bond is incredible." }
      ]
    }
  },
  {
    name: 'NIMHANS Bangalore',
    location: 'Bengaluru, Karnataka',
    type: 'Government',
    established: 1974,
    naacGrade: 'A+',
    ranking: 4,
    rankingBody: 'NIRF Medical',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800',
    websiteUrl: 'https://nimhans.ac.in/',
    rating: 4.8,
    reviewCount: 900,
    placementRate: 95.0,
    avgCtc: 900000,
    overview: "National Institute of Mental Health and Neurosciences is the apex center for mental health and neuroscience education in India. It is a highly specialized institute with world-renowned faculty.",
    topRecruiters: ["Govt Healthcare", "Private Neuro Clinics", "Research Labs"],
    courses: {
      create: [{ name: 'B.Sc. Nursing', stream: 'Medical', duration: 4, firstYearFee: 20000 }]
    },
    reviews: {
      create: [
        { author: "Nursing Staff", rating: 4.5, comment: "If you are interested in neurology or psychiatry, there is no better institute in South Asia." }
      ]
    }
  },
  {
    name: 'JIPMER Puducherry',
    location: 'Puducherry',
    type: 'Government',
    established: 1823,
    naacGrade: 'A+',
    ranking: 5,
    rankingBody: 'NIRF Medical',
    imageUrl: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=800',
    websiteUrl: 'https://jipmer.edu.in/',
    rating: 4.8,
    reviewCount: 1500,
    placementRate: 98.0,
    avgCtc: 850000,
    overview: "An Institute of National Importance, JIPMER offers a beautiful, sprawling campus in the coastal, French-influenced town of Puducherry. It provides top-tier medical education with high clinical exposure.",
    topRecruiters: ["Apollo", "Max Healthcare", "Government Hospitals", "Manipal Hospitals"],
    courses: {
      create: [{ name: 'MBBS', stream: 'Medical', duration: 5, firstYearFee: 12000 }]
    },
    reviews: {
      create: [
        { author: "Med Student", rating: 4.8, comment: "Amazing campus life, great clinical exposure, and studying in Pondicherry is a huge plus!" }
      ]
    }
  },

  // ================= LAW =================
  {
    name: 'NLSIU Bengaluru',
    location: 'Bengaluru, Karnataka',
    type: 'Government',
    established: 1986,
    naacGrade: 'A+',
    ranking: 1,
    rankingBody: 'NIRF Law',
    imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800',
    websiteUrl: 'https://www.nls.ac.in/',
    rating: 4.9,
    reviewCount: 800,
    placementRate: 98.0,
    avgCtc: 1600000,
    overview: "The National Law School of India University (NLSIU) is often called the 'Harvard of the East' for law. It is the first and consistently #1 ranked NLU, known for its grueling trimester system and unbeatable placements in Tier-1 corporate law firms.",
    topRecruiters: ["Cyril Amarchand Mangaldas", "Khaitan & Co", "Trilegal", "AZB & Partners", "Luthra & Luthra"],
    courses: {
      create: [{ name: 'BA LLB (Hons)', stream: 'Law', duration: 5, firstYearFee: 320000 }]
    },
    reviews: {
      create: [
        { author: "Corporate Lawyer", rating: 5.0, comment: "The trimester system will keep you sleep-deprived, but the alumni network and the Tier-1 law firm placements are unparalleled." }
      ]
    }
  },
  {
    name: 'NLU Delhi',
    location: 'New Delhi, Delhi',
    type: 'Government',
    established: 2008,
    naacGrade: 'A',
    ranking: 2,
    rankingBody: 'NIRF Law',
    imageUrl: 'https://images.unsplash.com/photo-1505664177941-ac42b470c6d3?w=800',
    websiteUrl: 'https://nludelhi.ac.in/',
    rating: 4.8,
    reviewCount: 650,
    placementRate: 96.0,
    avgCtc: 1500000,
    overview: "NLU Delhi conducts its own separate entrance exam (AILET) and boasts a highly elite, small batch size. Its location in the capital provides students with unique access to the Supreme Court and top litigation chambers.",
    topRecruiters: ["Shardul Amarchand Mangaldas", "Trilegal", "Khaitan & Co", "Supreme Court Chambers"],
    courses: {
      create: [{ name: 'BA LLB (Hons)', stream: 'Law', duration: 5, firstYearFee: 285000 }]
    },
    reviews: {
      create: [
        { author: "Litigator", rating: 4.8, comment: "Small batch size means incredible attention from faculty. Proximity to the SC is a huge advantage for internships." }
      ]
    }
  },
  {
    name: 'NALSAR Hyderabad',
    location: 'Hyderabad, Telangana',
    type: 'Government',
    established: 1998,
    naacGrade: 'A++',
    ranking: 3,
    rankingBody: 'NIRF Law',
    imageUrl: 'https://images.unsplash.com/photo-1453847651646-8545b049ce70?w=800',
    websiteUrl: 'https://www.nalsar.ac.in/',
    rating: 4.8,
    reviewCount: 720,
    placementRate: 95.0,
    avgCtc: 1550000,
    overview: "NALSAR is famous for its relatively relaxed academic culture compared to NLS, allowing students to excel globally in moot court competitions and debates. It has a stunning campus and strong corporate placements.",
    topRecruiters: ["Trilegal", "AZB & Partners", "S&R Associates", "Khaitan & Co"],
    courses: {
      create: [{ name: 'BA LLB (Hons)', stream: 'Law', duration: 5, firstYearFee: 295000 }]
    },
    reviews: {
      create: [
        { author: "Law Graduate", rating: 4.9, comment: "The mooting culture here is the best in India. You get the perfect balance of academics and extracurriculars." }
      ]
    }
  },
  {
    name: 'WBNUJS Kolkata',
    location: 'Kolkata, West Bengal',
    type: 'Government',
    established: 1999,
    naacGrade: 'A',
    ranking: 4,
    rankingBody: 'NIRF Law',
    imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800',
    websiteUrl: 'https://www.nujs.edu/',
    rating: 4.7,
    reviewCount: 500,
    placementRate: 94.0,
    avgCtc: 1400000,
    overview: "NUJS is a premier tier-1 NLU located right in the city of Kolkata. It boasts a brilliant faculty lineup and has historically secured some of the highest domestic and international law firm placements.",
    topRecruiters: ["Khaitan & Co", "SAM", "CAM", "Linklaters (UK)"],
    courses: {
      create: [{ name: 'BA LLB (Hons)', stream: 'Law', duration: 5, firstYearFee: 265000 }]
    },
    reviews: {
      create: [
        { author: "NUJS Alum", rating: 4.5, comment: "The campus is a single building, but the location in Salt Lake is great. Placements easily rival NLS and NALSAR." }
      ]
    }
  },
  {
    name: 'Symbiosis Law School',
    location: 'Pune, Maharashtra',
    type: 'Private',
    established: 1977,
    naacGrade: 'A',
    ranking: 6,
    rankingBody: 'NIRF Law',
    imageUrl: 'https://images.unsplash.com/photo-1593115057322-e94b77572f20?w=800',
    websiteUrl: 'https://www.symlaw.ac.in/',
    rating: 4.6,
    reviewCount: 950,
    placementRate: 90.0,
    avgCtc: 1050000,
    overview: "SLS Pune is arguably the most prestigious private law school in India. It offers a vibrant campus life in the student city of Pune, with highly active corporate placement and international exchange programs.",
    topRecruiters: ["ICICI Bank", "Deloitte", "Luthra & Luthra", "Bajaj Allianz"],
    courses: {
      create: [{ name: 'BA LLB', stream: 'Law', duration: 5, firstYearFee: 415000 }]
    },
    reviews: {
      create: [
        { author: "Student", rating: 4.5, comment: "Vimannagar campus is awesome. Great crowd, decent placements, though slightly expensive." }
      ]
    }
  },

  // ================= ARTS & SCIENCE (CUET) =================
  {
    name: 'Miranda House',
    location: 'New Delhi, Delhi',
    type: 'Government',
    established: 1948,
    naacGrade: 'A++',
    ranking: 1,
    rankingBody: 'NIRF College',
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
    websiteUrl: 'https://www.mirandahouse.ac.in/',
    rating: 4.9,
    reviewCount: 1500,
    placementRate: 85.0,
    avgCtc: 800000,
    overview: "Consistently ranked as the #1 college in India by NIRF. Miranda House is a premier women's college under Delhi University, renowned for its fiercely intellectual environment, historic red-brick campus, and feminist politics.",
    topRecruiters: ["DE Shaw", "KPMG", "EY", "Deloitte", "Accenture"],
    courses: {
      create: [{ name: 'B.Sc (Hons) Physics', stream: 'Science', duration: 3, firstYearFee: 19800 }]
    },
    reviews: {
      create: [
        { author: "Arts Grad", rating: 5.0, comment: "The faculty is phenomenal and the crowd pushes you to be your best self. Best 3 years of my life." }
      ]
    }
  },
  {
    name: 'Hindu College',
    location: 'New Delhi, Delhi',
    type: 'Government',
    established: 1899,
    naacGrade: 'A+',
    ranking: 2,
    rankingBody: 'NIRF College',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
    websiteUrl: 'https://hinducollege.ac.in/',
    rating: 4.8,
    reviewCount: 2100,
    placementRate: 88.0,
    avgCtc: 1040000,
    overview: "Hindu College is one of the most distinguished co-educational institutions of Delhi University. Famous for its vibrant campus politics (the 'Parliament' model), Mecca fest, and highly successful alumni across media, politics, and commerce.",
    topRecruiters: ["Bain Capability Network", "Deloitte", "KPMG", "Google", "Parthenon"],
    courses: {
      create: [{ name: 'BA (Hons) Political Science', stream: 'Arts', duration: 3, firstYearFee: 25600 }]
    },
    reviews: {
      create: [
        { author: "PolSci Student", rating: 4.8, comment: "The political culture and the societies (especially dramatics and debating) are the best in the country." }
      ]
    }
  },
  {
    name: 'St. Stephens College',
    location: 'New Delhi, Delhi',
    type: 'Government',
    established: 1881,
    naacGrade: 'A++',
    ranking: 14,
    rankingBody: 'NIRF College',
    imageUrl: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800',
    websiteUrl: 'https://www.ststephens.edu/',
    rating: 4.9,
    reviewCount: 1800,
    placementRate: 92.0,
    avgCtc: 1300000,
    overview: "St. Stephen's is the most elite and historic college under DU, maintaining its own rigorous admission interview process. It is highly reputed for its Economics and Mathematics departments, producing top-tier bureaucrats and economists.",
    topRecruiters: ["McKinsey", "BCG", "Morgan Stanley", "Kearney", "DE Shaw"],
    courses: {
      create: [{ name: 'B.Sc (Hons) Mathematics', stream: 'Science', duration: 3, firstYearFee: 42800 }]
    },
    reviews: {
      create: [
        { author: "Econ Hon", rating: 5.0, comment: "The brand value of Stephen's opens doors everywhere. The cafe food (mince cutlets!) is legendary." }
      ]
    }
  },
  {
    name: 'Lady Shri Ram College for Women (LSR)',
    location: 'New Delhi, Delhi',
    type: 'Government',
    established: 1956,
    naacGrade: 'A++',
    ranking: 9,
    rankingBody: 'NIRF College',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800',
    websiteUrl: 'https://lsr.edu.in/',
    rating: 4.8,
    reviewCount: 1650,
    placementRate: 90.0,
    avgCtc: 1180000,
    overview: "LSR is considered the premier institute for Humanities and Commerce in India. Located in South Delhi, it boasts some of the highest placement packages in DU, specifically targeting top consulting firms.",
    topRecruiters: ["BCG", "McKinsey", "Parthenon", "LEK Consulting", "Bank of America"],
    courses: {
      create: [{ name: 'BA (Hons) Psychology', stream: 'Arts', duration: 3, firstYearFee: 21200 }]
    },
    reviews: {
      create: [
        { author: "Commerce Grad", rating: 4.9, comment: "LSR transforms you into a confident, articulate professional. Placements are heavily dominated by MBB consulting firms." }
      ]
    }
  },
  {
    name: 'Hansraj College',
    location: 'New Delhi, Delhi',
    type: 'Government',
    established: 1948,
    naacGrade: 'A+',
    ranking: 12,
    rankingBody: 'NIRF College',
    imageUrl: 'https://images.unsplash.com/photo-1592289139045-81788c037985?w=800',
    websiteUrl: 'https://www.hansrajcollege.ac.in/',
    rating: 4.7,
    reviewCount: 1900,
    placementRate: 84.0,
    avgCtc: 790000,
    overview: "Hansraj is a cornerstone of DU's North Campus, famous for its Shah Rukh Khan connection (he's an alumnus) and the iconic 'Lovers Point'. It offers an excellent balance of strong academics and vibrant campus life.",
    topRecruiters: ["EY", "KPMG", "Bain Capability Network", "Deloitte", "PwC"],
    courses: {
      create: [{ name: 'B.Sc (Hons) Chemistry', stream: 'Science', duration: 3, firstYearFee: 24500 }]
    },
    reviews: {
      create: [
        { author: "Science Student", rating: 4.5, comment: "Great infrastructure for sciences. The North Campus vibe makes every day exciting." }
      ]
    }
  }
]

async function main() {
  console.log(`Starting to seed detailed colleges...`)
  for (const college of collegesData) {
    const { courses, reviews, ...collegeDetails } = college
    await prisma.college.upsert({
      where: { name: college.name },
      update: {
        ...collegeDetails,
        topRecruiters: college.topRecruiters,
      },
      create: {
        ...collegeDetails,
        courses: courses,
        reviews: reviews
      },
    })
    console.log(`✅ Seeded Details for: ${college.name}`)
  }
  console.log('🎉 Database seeding completely finished.')
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error('❌ Error during seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  })