import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const cutoffData = [
  // ================= ENGINEERING (JEE Advanced) =================
  { collegeName: 'IIT (ISM) DHANBAD', exam: 'JEE Advanced', category: 'General', courseName: 'B.Tech Computer Science & Engineering', openingRank: 1800, closingRank: 2862 },
  { collegeName: 'IIT (ISM) DHANBAD', exam: 'JEE Advanced', category: 'OBC-NCL', courseName: 'B.Tech Mineral and Metallurgical Engineering', openingRank: 3500, closingRank: 8500 },
  { collegeName: 'Indian Institute of Technology Madras', exam: 'JEE Advanced', category: 'General', courseName: 'B.Tech Electrical Engineering', openingRank: 42, closingRank: 144 },
  { collegeName: 'Indian Institute of Technology Delhi', exam: 'JEE Advanced', category: 'General', courseName: 'B.Tech Computer Science', openingRank: 29, closingRank: 115 },
  { collegeName: 'Indian Institute of Technology Bombay', exam: 'JEE Advanced', category: 'General', courseName: 'B.Tech Mechanical Engineering', openingRank: 200, closingRank: 1200 },
  { collegeName: 'Indian Institute of Technology Kanpur', exam: 'JEE Advanced', category: 'General', courseName: 'B.Tech Aerospace Engineering', openingRank: 2000, closingRank: 3800 },

  // ================= ENGINEERING (JEE Main) =================
  { collegeName: 'NIT Tiruchirappalli', exam: 'JEE Main', category: 'General', courseName: 'B.Tech Electronics', openingRank: 1200, closingRank: 3500 },
  { collegeName: 'NIT Surathkal', exam: 'JEE Main', category: 'General', courseName: 'B.Tech Information Technology', openingRank: 1500, closingRank: 2900 },
  { collegeName: 'NIT Rourkela', exam: 'JEE Main', category: 'General', courseName: 'B.Tech Civil Engineering', openingRank: 12000, closingRank: 22000 },
  { collegeName: 'NIT Warangal', exam: 'JEE Main', category: 'General', courseName: 'B.Tech Computer Science', openingRank: 1000, closingRank: 2400 },

  // ================= MANAGEMENT (CAT) =================
  // *Mapped as approximate All India Ranks based on percentiles
  { collegeName: 'IIM Ahmedabad', exam: 'CAT', category: 'General', courseName: 'MBA (PGPM)', openingRank: 1, closingRank: 150 },
  { collegeName: 'IIM Bangalore', exam: 'CAT', category: 'General', courseName: 'MBA (PGPM)', openingRank: 10, closingRank: 250 },
  { collegeName: 'IIM Calcutta', exam: 'CAT', category: 'General', courseName: 'MBA (PGPM)', openingRank: 15, closingRank: 300 },
  { collegeName: 'IIM Lucknow', exam: 'CAT', category: 'General', courseName: 'MBA (PGPM)', openingRank: 50, closingRank: 600 },
  { collegeName: 'FMS Delhi', exam: 'CAT', category: 'General', courseName: 'MBA', openingRank: 20, closingRank: 400 },

  // ================= MEDICAL (NEET) =================
  { collegeName: 'AIIMS New Delhi', exam: 'NEET', category: 'General', courseName: 'MBBS', openingRank: 1, closingRank: 57 },
  { collegeName: 'AIIMS New Delhi', exam: 'NEET', category: 'OBC-NCL', courseName: 'MBBS', openingRank: 100, closingRank: 255 },
  { collegeName: 'PGIMER Chandigarh', exam: 'NEET', category: 'General', courseName: 'MD/MS', openingRank: 1, closingRank: 250 }, 
  { collegeName: 'CMC Vellore', exam: 'NEET', category: 'General', courseName: 'MBBS', openingRank: 150, closingRank: 1200 },
  { collegeName: 'NIMHANS Bangalore', exam: 'NEET', category: 'General', courseName: 'B.Sc. Nursing', openingRank: 500, closingRank: 4500 },
  { collegeName: 'JIPMER Puducherry', exam: 'NEET', category: 'General', courseName: 'MBBS', openingRank: 50, closingRank: 277 },

  // ================= LAW (CLAT) =================
  { collegeName: 'NLSIU Bengaluru', exam: 'CLAT', category: 'General', courseName: 'BA LLB (Hons)', openingRank: 1, closingRank: 114 },
  { collegeName: 'NLU Delhi', exam: 'CLAT', category: 'General', courseName: 'BA LLB (Hons)', openingRank: 2, closingRank: 72 }, 
  { collegeName: 'NALSAR Hyderabad', exam: 'CLAT', category: 'General', courseName: 'BA LLB (Hons)', openingRank: 115, closingRank: 177 },
  { collegeName: 'WBNUJS Kolkata', exam: 'CLAT', category: 'General', courseName: 'BA LLB (Hons)', openingRank: 178, closingRank: 260 },
  { collegeName: 'Symbiosis Law School', exam: 'CLAT', category: 'General', courseName: 'BA LLB', openingRank: 500, closingRank: 1500 }, 

  // ================= ARTS & SCIENCE (CUET) =================
  // *CUET uses normalized scores, but mapped as ranks for the Predictor UI
  { collegeName: 'Miranda House', exam: 'CUET', category: 'General', courseName: 'B.Sc (Hons) Physics', openingRank: 1, closingRank: 800 },
  { collegeName: 'Hindu College', exam: 'CUET', category: 'General', courseName: 'BA (Hons) Political Science', openingRank: 1, closingRank: 300 },
  { collegeName: 'St. Stephens College', exam: 'CUET', category: 'General', courseName: 'B.Sc (Hons) Mathematics', openingRank: 1, closingRank: 200 },
  { collegeName: 'Lady Shri Ram College for Women (LSR)', exam: 'CUET', category: 'General', courseName: 'BA (Hons) Psychology', openingRank: 1, closingRank: 450 },
  { collegeName: 'Hansraj College', exam: 'CUET', category: 'General', courseName: 'B.Sc (Hons) Chemistry', openingRank: 1, closingRank: 1200 }
];

async function main() {
  console.log('🚀 Starting to seed strict cutoffs for existing colleges...');

  let successCount = 0;

  for (const data of cutoffData) {
    const college = await prisma.college.findUnique({
      where: { name: data.collegeName }
    });

    if (college) {
      await prisma.cutoff.upsert({
        where: {
          collegeId_exam_courseName_category_year: {
            collegeId: college.id,
            exam: data.exam,
            courseName: data.courseName,
            category: data.category,
            year: 2023
          }
        },
        update: {
          openingRank: data.openingRank,
          closingRank: data.closingRank
        },
        create: {
          exam: data.exam,
          category: data.category,
          courseName: data.courseName,
          openingRank: data.openingRank,
          closingRank: data.closingRank,
          year: 2023,
          collegeId: college.id
        }
      });
      console.log(`✅ Seeded: ${data.exam} -> ${college.name} (${data.courseName})`);
      successCount++;
    } else {
      console.log(`⚠️ FAILED: Could not find "${data.collegeName}" in database.`);
    }
  }

  console.log(`\n🎉 Seeding Complete! Processed ${successCount} cutoffs.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });