import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Multi-Category & Multi-Branch Historical Cutoff Dataset (2022, 2023, 2024)
const baseCutoffs = [
  // ================= JEE ADVANCED (IITs) =================
  // IIT DHANBAD
  { collegeName: 'IIT (ISM) DHANBAD', exam: 'JEE Advanced', category: 'General', courseName: 'B.Tech Computer Science & Engineering', cutoffs: [{ year: 2022, openingRank: 1950, closingRank: 2950 }, { year: 2023, openingRank: 1800, closingRank: 2862 }, { year: 2024, openingRank: 1750, closingRank: 2810 }] },
  { collegeName: 'IIT (ISM) DHANBAD', exam: 'JEE Advanced', category: 'OBC-NCL', courseName: 'B.Tech Computer Science & Engineering', cutoffs: [{ year: 2022, openingRank: 650, closingRank: 1050 }, { year: 2023, openingRank: 600, closingRank: 980 }, { year: 2024, openingRank: 570, closingRank: 940 }] },
  { collegeName: 'IIT (ISM) DHANBAD', exam: 'JEE Advanced', category: 'SC', courseName: 'B.Tech Computer Science & Engineering', cutoffs: [{ year: 2022, openingRank: 350, closingRank: 550 }, { year: 2023, openingRank: 320, closingRank: 510 }, { year: 2024, openingRank: 300, closingRank: 480 }] },
  { collegeName: 'IIT (ISM) DHANBAD', exam: 'JEE Advanced', category: 'General', courseName: 'B.Tech Mineral and Metallurgical Engineering', cutoffs: [{ year: 2022, openingRank: 9000, closingRank: 13500 }, { year: 2023, openingRank: 8800, closingRank: 13000 }, { year: 2024, openingRank: 8500, closingRank: 12600 }] },
  { collegeName: 'IIT (ISM) DHANBAD', exam: 'JEE Advanced', category: 'OBC-NCL', courseName: 'B.Tech Mineral and Metallurgical Engineering', cutoffs: [{ year: 2022, openingRank: 3700, closingRank: 8800 }, { year: 2023, openingRank: 3500, closingRank: 8500 }, { year: 2024, openingRank: 3400, closingRank: 8300 }] },
  { collegeName: 'IIT (ISM) DHANBAD', exam: 'JEE Advanced', category: 'SC', courseName: 'B.Tech Mineral and Metallurgical Engineering', cutoffs: [{ year: 2022, openingRank: 2100, closingRank: 3400 }, { year: 2023, openingRank: 2000, closingRank: 3200 }, { year: 2024, openingRank: 1900, closingRank: 3100 }] },

  // IIT MADRAS
  { collegeName: 'Indian Institute of Technology Madras', exam: 'JEE Advanced', category: 'General', courseName: 'B.Tech Electrical Engineering', cutoffs: [{ year: 2022, openingRank: 50, closingRank: 160 }, { year: 2023, openingRank: 42, closingRank: 144 }, { year: 2024, openingRank: 40, closingRank: 138 }] },
  { collegeName: 'Indian Institute of Technology Madras', exam: 'JEE Advanced', category: 'OBC-NCL', courseName: 'B.Tech Electrical Engineering', cutoffs: [{ year: 2022, openingRank: 25, closingRank: 75 }, { year: 2023, openingRank: 20, closingRank: 65 }, { year: 2024, openingRank: 18, closingRank: 60 }] },
  { collegeName: 'Indian Institute of Technology Madras', exam: 'JEE Advanced', category: 'SC', courseName: 'B.Tech Electrical Engineering', cutoffs: [{ year: 2022, openingRank: 12, closingRank: 45 }, { year: 2023, openingRank: 10, closingRank: 38 }, { year: 2024, openingRank: 8, closingRank: 34 }] },

  // IIT DELHI
  { collegeName: 'Indian Institute of Technology Delhi', exam: 'JEE Advanced', category: 'General', courseName: 'B.Tech Computer Science', cutoffs: [{ year: 2022, openingRank: 32, closingRank: 125 }, { year: 2023, openingRank: 29, closingRank: 115 }, { year: 2024, openingRank: 27, closingRank: 108 }] },
  { collegeName: 'Indian Institute of Technology Delhi', exam: 'JEE Advanced', category: 'OBC-NCL', courseName: 'B.Tech Computer Science', cutoffs: [{ year: 2022, openingRank: 15, closingRank: 55 }, { year: 2023, openingRank: 12, closingRank: 48 }, { year: 2024, openingRank: 10, closingRank: 44 }] },
  { collegeName: 'Indian Institute of Technology Delhi', exam: 'JEE Advanced', category: 'EWS', courseName: 'B.Tech Computer Science', cutoffs: [{ year: 2022, openingRank: 6, closingRank: 22 }, { year: 2023, openingRank: 5, closingRank: 18 }, { year: 2024, openingRank: 4, closingRank: 16 }] },

  // IIT BOMBAY
  { collegeName: 'Indian Institute of Technology Bombay', exam: 'JEE Advanced', category: 'General', courseName: 'B.Tech Mechanical Engineering', cutoffs: [{ year: 2022, openingRank: 220, closingRank: 1280 }, { year: 2023, openingRank: 200, closingRank: 1200 }, { year: 2024, openingRank: 190, closingRank: 1150 }] },
  { collegeName: 'Indian Institute of Technology Bombay', exam: 'JEE Advanced', category: 'OBC-NCL', courseName: 'B.Tech Mechanical Engineering', cutoffs: [{ year: 2022, openingRank: 110, closingRank: 480 }, { year: 2023, openingRank: 100, closingRank: 440 }, { year: 2024, openingRank: 90, closingRank: 410 }] },

  // IIT KANPUR
  { collegeName: 'Indian Institute of Technology Kanpur', exam: 'JEE Advanced', category: 'General', courseName: 'B.Tech Aerospace Engineering', cutoffs: [{ year: 2022, openingRank: 2100, closingRank: 3950 }, { year: 2023, openingRank: 2000, closingRank: 3800 }, { year: 2024, openingRank: 1950, closingRank: 3720 }] },
  { collegeName: 'Indian Institute of Technology Kanpur', exam: 'JEE Advanced', category: 'OBC-NCL', courseName: 'B.Tech Aerospace Engineering', cutoffs: [{ year: 2022, openingRank: 950, closingRank: 1650 }, { year: 2023, openingRank: 900, closingRank: 1550 }, { year: 2024, openingRank: 850, closingRank: 1480 }] },

  // ================= JEE MAIN (NITs) =================
  // NIT TRICHY
  { collegeName: 'NIT Tiruchirappalli', exam: 'JEE Main', category: 'General', courseName: 'B.Tech Electronics', cutoffs: [{ year: 2022, openingRank: 1300, closingRank: 3700 }, { year: 2023, openingRank: 1200, closingRank: 3500 }, { year: 2024, openingRank: 1150, closingRank: 3400 }] },
  { collegeName: 'NIT Tiruchirappalli', exam: 'JEE Main', category: 'OBC-NCL', courseName: 'B.Tech Electronics', cutoffs: [{ year: 2022, openingRank: 450, closingRank: 1150 }, { year: 2023, openingRank: 400, closingRank: 1050 }, { year: 2024, openingRank: 380, closingRank: 980 }] },
  { collegeName: 'NIT Tiruchirappalli', exam: 'JEE Main', category: 'SC', courseName: 'B.Tech Electronics', cutoffs: [{ year: 2022, openingRank: 200, closingRank: 550 }, { year: 2023, openingRank: 180, closingRank: 490 }, { year: 2024, openingRank: 160, closingRank: 450 }] },

  // NIT SURATHKAL
  { collegeName: 'NIT Surathkal', exam: 'JEE Main', category: 'General', courseName: 'B.Tech Information Technology', cutoffs: [{ year: 2022, openingRank: 1600, closingRank: 3050 }, { year: 2023, openingRank: 1500, closingRank: 2900 }, { year: 2024, openingRank: 1450, closingRank: 2820 }] },
  { collegeName: 'NIT Surathkal', exam: 'JEE Main', category: 'OBC-NCL', courseName: 'B.Tech Information Technology', cutoffs: [{ year: 2022, openingRank: 500, closingRank: 980 }, { year: 2023, openingRank: 460, closingRank: 910 }, { year: 2024, openingRank: 430, closingRank: 860 }] },

  // NIT ROURKELA
  { collegeName: 'NIT Rourkela', exam: 'JEE Main', category: 'General', courseName: 'B.Tech Civil Engineering', cutoffs: [{ year: 2022, openingRank: 12500, closingRank: 23000 }, { year: 2023, openingRank: 12000, closingRank: 22000 }, { year: 2024, openingRank: 11800, closingRank: 21500 }] },
  { collegeName: 'NIT Rourkela', exam: 'JEE Main', category: 'OBC-NCL', courseName: 'B.Tech Civil Engineering', cutoffs: [{ year: 2022, openingRank: 4200, closingRank: 7500 }, { year: 2023, openingRank: 4000, closingRank: 7100 }, { year: 2024, openingRank: 3800, closingRank: 6800 }] },

  // NIT WARANGAL
  { collegeName: 'NIT Warangal', exam: 'JEE Main', category: 'General', courseName: 'B.Tech Computer Science', cutoffs: [{ year: 2022, openingRank: 1100, closingRank: 2550 }, { year: 2023, openingRank: 1000, closingRank: 2400 }, { year: 2024, openingRank: 950, closingRank: 2300 }] },
  { collegeName: 'NIT Warangal', exam: 'JEE Main', category: 'OBC-NCL', courseName: 'B.Tech Computer Science', cutoffs: [{ year: 2022, openingRank: 350, closingRank: 780 }, { year: 2023, openingRank: 320, closingRank: 720 }, { year: 2024, openingRank: 300, closingRank: 680 }] },

  // ================= MEDICAL (NEET) =================
  // AIIMS NEW DELHI
  { collegeName: 'AIIMS New Delhi', exam: 'NEET', category: 'General', courseName: 'MBBS', cutoffs: [{ year: 2022, openingRank: 1, closingRank: 61 }, { year: 2023, openingRank: 1, closingRank: 57 }, { year: 2024, openingRank: 1, closingRank: 53 }] },
  { collegeName: 'AIIMS New Delhi', exam: 'NEET', category: 'OBC-NCL', courseName: 'MBBS', cutoffs: [{ year: 2022, openingRank: 105, closingRank: 265 }, { year: 2023, openingRank: 100, closingRank: 255 }, { year: 2024, openingRank: 95, closingRank: 245 }] },
  { collegeName: 'AIIMS New Delhi', exam: 'NEET', category: 'SC', courseName: 'MBBS', cutoffs: [{ year: 2022, openingRank: 350, closingRank: 980 }, { year: 2023, openingRank: 320, closingRank: 920 }, { year: 2024, openingRank: 300, closingRank: 870 }] },

  // PGIMER & CMC VELLORE
  { collegeName: 'PGIMER Chandigarh', exam: 'NEET', category: 'General', courseName: 'MD/MS', cutoffs: [{ year: 2022, openingRank: 1, closingRank: 265 }, { year: 2023, openingRank: 1, closingRank: 250 }, { year: 2024, openingRank: 1, closingRank: 240 }] },
  { collegeName: 'CMC Vellore', exam: 'NEET', category: 'General', courseName: 'MBBS', cutoffs: [{ year: 2022, openingRank: 160, closingRank: 1250 }, { year: 2023, openingRank: 150, closingRank: 1200 }, { year: 2024, openingRank: 140, closingRank: 1150 }] },
  { collegeName: 'JIPMER Puducherry', exam: 'NEET', category: 'General', courseName: 'MBBS', cutoffs: [{ year: 2022, openingRank: 55, closingRank: 290 }, { year: 2023, openingRank: 50, closingRank: 277 }, { year: 2024, openingRank: 45, closingRank: 265 }] },

  // ================= MANAGEMENT (CAT) =================
  { collegeName: 'IIM Ahmedabad', exam: 'CAT', category: 'General', courseName: 'MBA (PGPM)', cutoffs: [{ year: 2022, openingRank: 1, closingRank: 160 }, { year: 2023, openingRank: 1, closingRank: 150 }, { year: 2024, openingRank: 1, closingRank: 145 }] },
  { collegeName: 'IIM Ahmedabad', exam: 'CAT', category: 'OBC-NCL', courseName: 'MBA (PGPM)', cutoffs: [{ year: 2022, openingRank: 150, closingRank: 450 }, { year: 2023, openingRank: 140, closingRank: 420 }, { year: 2024, openingRank: 130, closingRank: 400 }] },
  { collegeName: 'IIM Bangalore', exam: 'CAT', category: 'General', courseName: 'MBA (PGPM)', cutoffs: [{ year: 2022, openingRank: 12, closingRank: 270 }, { year: 2023, openingRank: 10, closingRank: 250 }, { year: 2024, openingRank: 8, closingRank: 240 }] },
  { collegeName: 'IIM Calcutta', exam: 'CAT', category: 'General', courseName: 'MBA (PGPM)', cutoffs: [{ year: 2022, openingRank: 18, closingRank: 320 }, { year: 2023, openingRank: 15, closingRank: 300 }, { year: 2024, openingRank: 12, closingRank: 290 }] },
  { collegeName: 'IIM Lucknow', exam: 'CAT', category: 'General', courseName: 'MBA (PGPM)', cutoffs: [{ year: 2022, openingRank: 55, closingRank: 630 }, { year: 2023, openingRank: 50, closingRank: 600 }, { year: 2024, openingRank: 45, closingRank: 580 }] },

  // ================= LAW (CLAT) =================
  { collegeName: 'NLSIU Bengaluru', exam: 'CLAT', category: 'General', courseName: 'BA LLB (Hons)', cutoffs: [{ year: 2022, openingRank: 1, closingRank: 120 }, { year: 2023, openingRank: 1, closingRank: 114 }, { year: 2024, openingRank: 1, closingRank: 108 }] },
  { collegeName: 'NLSIU Bengaluru', exam: 'CLAT', category: 'OBC-NCL', courseName: 'BA LLB (Hons)', cutoffs: [{ year: 2022, openingRank: 250, closingRank: 520 }, { year: 2023, openingRank: 230, closingRank: 490 }, { year: 2024, openingRank: 210, closingRank: 460 }] },
  { collegeName: 'NLU Delhi', exam: 'CLAT', category: 'General', courseName: 'BA LLB (Hons)', cutoffs: [{ year: 2022, openingRank: 2, closingRank: 78 }, { year: 2023, openingRank: 2, closingRank: 72 }, { year: 2024, openingRank: 1, closingRank: 68 }] },
  { collegeName: 'NALSAR Hyderabad', exam: 'CLAT', category: 'General', courseName: 'BA LLB (Hons)', cutoffs: [{ year: 2022, openingRank: 120, closingRank: 185 }, { year: 2023, openingRank: 115, closingRank: 177 }, { year: 2024, openingRank: 110, closingRank: 170 }] },

  // ================= ARTS & SCIENCE (CUET) =================
  { collegeName: 'Miranda House', exam: 'CUET', category: 'General', courseName: 'B.Sc (Hons) Physics', cutoffs: [{ year: 2022, openingRank: 1, closingRank: 840 }, { year: 2023, openingRank: 1, closingRank: 800 }, { year: 2024, openingRank: 1, closingRank: 770 }] },
  { collegeName: 'Hindu College', exam: 'CUET', category: 'General', courseName: 'BA (Hons) Political Science', cutoffs: [{ year: 2022, openingRank: 1, closingRank: 320 }, { year: 2023, openingRank: 1, closingRank: 300 }, { year: 2024, openingRank: 1, closingRank: 285 }] }
];

async function main() {
  console.log('🚀 Starting multi-category & multi-branch cutoff seeding...');

  // Clear existing cutoff records to prevent duplicates
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
      console.log(`✅ Seeded: ${college.name} (${group.courseName} | ${group.category})`);
    } else {
      console.log(`⚠️ FAILED: Could not find "${group.collegeName}" in database.`);
    }
  }

  console.log(`\n🎉 Multi-category & Multi-branch Seeding Complete! Added ${successCount} cutoffs.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });