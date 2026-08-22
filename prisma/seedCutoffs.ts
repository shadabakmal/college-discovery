import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Multi-year historical cutoff dataset (2022, 2023, 2024)
const baseCutoffs = [
  // ================= ENGINEERING (JEE Advanced) =================
  { collegeName: 'IIT (ISM) DHANBAD', exam: 'JEE Advanced', category: 'General', courseName: 'B.Tech Computer Science & Engineering', cutoffs: [{ year: 2022, openingRank: 1950, closingRank: 2950 }, { year: 2023, openingRank: 1800, closingRank: 2862 }, { year: 2024, openingRank: 1750, closingRank: 2810 }] },
  { collegeName: 'IIT (ISM) DHANBAD', exam: 'JEE Advanced', category: 'OBC-NCL', courseName: 'B.Tech Mineral and Metallurgical Engineering', cutoffs: [{ year: 2022, openingRank: 3700, closingRank: 8800 }, { year: 2023, openingRank: 3500, closingRank: 8500 }, { year: 2024, openingRank: 3400, closingRank: 8300 }] },
  { collegeName: 'Indian Institute of Technology Madras', exam: 'JEE Advanced', category: 'General', courseName: 'B.Tech Electrical Engineering', cutoffs: [{ year: 2022, openingRank: 50, closingRank: 160 }, { year: 2023, openingRank: 42, closingRank: 144 }, { year: 2024, openingRank: 40, closingRank: 138 }] },
  { collegeName: 'Indian Institute of Technology Delhi', exam: 'JEE Advanced', category: 'General', courseName: 'B.Tech Computer Science', cutoffs: [{ year: 2022, openingRank: 32, closingRank: 125 }, { year: 2023, openingRank: 29, closingRank: 115 }, { year: 2024, openingRank: 27, closingRank: 108 }] },
  { collegeName: 'Indian Institute of Technology Bombay', exam: 'JEE Advanced', category: 'General', courseName: 'B.Tech Mechanical Engineering', cutoffs: [{ year: 2022, openingRank: 220, closingRank: 1280 }, { year: 2023, openingRank: 200, closingRank: 1200 }, { year: 2024, openingRank: 190, closingRank: 1150 }] },
  { collegeName: 'Indian Institute of Technology Kanpur', exam: 'JEE Advanced', category: 'General', courseName: 'B.Tech Aerospace Engineering', cutoffs: [{ year: 2022, openingRank: 2100, closingRank: 3950 }, { year: 2023, openingRank: 2000, closingRank: 3800 }, { year: 2024, openingRank: 1950, closingRank: 3720 }] },

  // ================= ENGINEERING (JEE Main) =================
  { collegeName: 'NIT Tiruchirappalli', exam: 'JEE Main', category: 'General', courseName: 'B.Tech Electronics', cutoffs: [{ year: 2022, openingRank: 1300, closingRank: 3700 }, { year: 2023, openingRank: 1200, closingRank: 3500 }, { year: 2024, openingRank: 1150, closingRank: 3400 }] },
  { collegeName: 'NIT Surathkal', exam: 'JEE Main', category: 'General', courseName: 'B.Tech Information Technology', cutoffs: [{ year: 2022, openingRank: 1600, closingRank: 3050 }, { year: 2023, openingRank: 1500, closingRank: 2900 }, { year: 2024, openingRank: 1450, closingRank: 2820 }] },
  { collegeName: 'NIT Rourkela', exam: 'JEE Main', category: 'General', courseName: 'B.Tech Civil Engineering', cutoffs: [{ year: 2022, openingRank: 12500, closingRank: 23000 }, { year: 2023, openingRank: 12000, closingRank: 22000 }, { year: 2024, openingRank: 11800, closingRank: 21500 }] },
  { collegeName: 'NIT Warangal', exam: 'JEE Main', category: 'General', courseName: 'B.Tech Computer Science', cutoffs: [{ year: 2022, openingRank: 1100, closingRank: 2550 }, { year: 2023, openingRank: 1000, closingRank: 2400 }, { year: 2024, openingRank: 950, closingRank: 2300 }] },

  // ================= MANAGEMENT (CAT) =================
  { collegeName: 'IIM Ahmedabad', exam: 'CAT', category: 'General', courseName: 'MBA (PGPM)', cutoffs: [{ year: 2022, openingRank: 1, closingRank: 160 }, { year: 2023, openingRank: 1, closingRank: 150 }, { year: 2024, openingRank: 1, closingRank: 145 }] },
  { collegeName: 'IIM Bangalore', exam: 'CAT', category: 'General', courseName: 'MBA (PGPM)', cutoffs: [{ year: 2022, openingRank: 12, closingRank: 270 }, { year: 2023, openingRank: 10, closingRank: 250 }, { year: 2024, openingRank: 8, closingRank: 240 }] },
  { collegeName: 'IIM Calcutta', exam: 'CAT', category: 'General', courseName: 'MBA (PGPM)', cutoffs: [{ year: 2022, openingRank: 18, closingRank: 320 }, { year: 2023, openingRank: 15, closingRank: 300 }, { year: 2024, openingRank: 12, closingRank: 290 }] },
  { collegeName: 'IIM Lucknow', exam: 'CAT', category: 'General', courseName: 'MBA (PGPM)', cutoffs: [{ year: 2022, openingRank: 55, closingRank: 630 }, { year: 2023, openingRank: 50, closingRank: 600 }, { year: 2024, openingRank: 45, closingRank: 580 }] },
  { collegeName: 'FMS Delhi', exam: 'CAT', category: 'General', courseName: 'MBA', cutoffs: [{ year: 2022, openingRank: 25, closingRank: 420 }, { year: 2023, openingRank: 20, closingRank: 400 }, { year: 2024, openingRank: 18, closingRank: 390 }] },

  // ================= MEDICAL (NEET) =================
  { collegeName: 'AIIMS New Delhi', exam: 'NEET', category: 'General', courseName: 'MBBS', cutoffs: [{ year: 2022, openingRank: 1, closingRank: 61 }, { year: 2023, openingRank: 1, closingRank: 57 }, { year: 2024, openingRank: 1, closingRank: 53 }] },
  { collegeName: 'AIIMS New Delhi', exam: 'NEET', category: 'OBC-NCL', courseName: 'MBBS', cutoffs: [{ year: 2022, openingRank: 105, closingRank: 265 }, { year: 2023, openingRank: 100, closingRank: 255 }, { year: 2024, openingRank: 95, closingRank: 245 }] },
  { collegeName: 'PGIMER Chandigarh', exam: 'NEET', category: 'General', courseName: 'MD/MS', cutoffs: [{ year: 2022, openingRank: 1, closingRank: 265 }, { year: 2023, openingRank: 1, closingRank: 250 }, { year: 2024, openingRank: 1, closingRank: 240 }] },
  { collegeName: 'CMC Vellore', exam: 'NEET', category: 'General', courseName: 'MBBS', cutoffs: [{ year: 2022, openingRank: 160, closingRank: 1250 }, { year: 2023, openingRank: 150, closingRank: 1200 }, { year: 2024, openingRank: 140, closingRank: 1150 }] },
  { collegeName: 'JIPMER Puducherry', exam: 'NEET', category: 'General', courseName: 'MBBS', cutoffs: [{ year: 2022, openingRank: 55, closingRank: 290 }, { year: 2023, openingRank: 50, closingRank: 277 }, { year: 2024, openingRank: 45, closingRank: 265 }] },

  // ================= LAW (CLAT) =================
  { collegeName: 'NLSIU Bengaluru', exam: 'CLAT', category: 'General', courseName: 'BA LLB (Hons)', cutoffs: [{ year: 2022, openingRank: 1, closingRank: 120 }, { year: 2023, openingRank: 1, closingRank: 114 }, { year: 2024, openingRank: 1, closingRank: 108 }] },
  { collegeName: 'NLU Delhi', exam: 'CLAT', category: 'General', courseName: 'BA LLB (Hons)', cutoffs: [{ year: 2022, openingRank: 2, closingRank: 78 }, { year: 2023, openingRank: 2, closingRank: 72 }, { year: 2024, openingRank: 1, closingRank: 68 }] },
  { collegeName: 'NALSAR Hyderabad', exam: 'CLAT', category: 'General', courseName: 'BA LLB (Hons)', cutoffs: [{ year: 2022, openingRank: 120, closingRank: 185 }, { year: 2023, openingRank: 115, closingRank: 177 }, { year: 2024, openingRank: 110, closingRank: 170 }] },

  // ================= ARTS & SCIENCE (CUET) =================
  { collegeName: 'Miranda House', exam: 'CUET', category: 'General', courseName: 'B.Sc (Hons) Physics', cutoffs: [{ year: 2022, openingRank: 1, closingRank: 840 }, { year: 2023, openingRank: 1, closingRank: 800 }, { year: 2024, openingRank: 1, closingRank: 770 }] },
  { collegeName: 'Hindu College', exam: 'CUET', category: 'General', courseName: 'BA (Hons) Political Science', cutoffs: [{ year: 2022, openingRank: 1, closingRank: 320 }, { year: 2023, openingRank: 1, closingRank: 300 }, { year: 2024, openingRank: 1, closingRank: 285 }] }
];

async function main() {
  console.log('🚀 Starting multi-year cutoff seeding (2022, 2023, 2024)...');
  
  // Wipe old cutoff data to prevent duplicates
  await prisma.cutoff.deleteMany();

  let successCount = 0;

  for (const group of baseCutoffs) {
    const college = await prisma.college.findUnique({
      where: { name: group.collegeName }
    });

    if (college) {
      for (const item of group.cutoffs) {
        await prisma.cutoff.create({
          data: {
            exam: group.exam,
            category: group.category,
            courseName: group.courseName,
            openingRank: item.openingRank,
            closingRank: item.closingRank,
            year: item.year,
            collegeId: college.id
          }
        });
        successCount++;
      }
      console.log(`✅ Seeded 3-year cutoffs for: ${college.name} (${group.courseName})`);
    } else {
      console.log(`⚠️ FAILED: Could not find "${group.collegeName}" in database.`);
    }
  }
  
  console.log(`\n🎉 Multi-year Seeding Complete! Added ${successCount} cutoff records across 2022-2024.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });