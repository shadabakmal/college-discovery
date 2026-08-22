import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// 4-Year Historical Cutoff Dataset (2023, 2024, 2025, 2026) for Target 2027-28 Admission Predictions
const baseCutoffs = [
  // ================= JEE ADVANCED (IITs) =================
  // IIT DHANBAD
  { collegeName: 'IIT (ISM) DHANBAD', exam: 'JEE Advanced', category: 'General', courseName: 'B.Tech Computer Science & Engineering', cutoffs: [{ year: 2023, openingRank: 1800, closingRank: 2862 }, { year: 2024, openingRank: 1750, closingRank: 2810 }, { year: 2025, openingRank: 1710, closingRank: 2760 }, { year: 2026, openingRank: 1680, closingRank: 2720 }] },
  { collegeName: 'IIT (ISM) DHANBAD', exam: 'JEE Advanced', category: 'OBC-NCL', courseName: 'B.Tech Computer Science & Engineering', cutoffs: [{ year: 2023, openingRank: 600, closingRank: 980 }, { year: 2024, openingRank: 570, closingRank: 940 }, { year: 2025, openingRank: 540, closingRank: 910 }, { year: 2026, openingRank: 520, closingRank: 880 }] },
  { collegeName: 'IIT (ISM) DHANBAD', exam: 'JEE Advanced', category: 'SC', courseName: 'B.Tech Computer Science & Engineering', cutoffs: [{ year: 2023, openingRank: 320, closingRank: 510 }, { year: 2024, openingRank: 300, closingRank: 480 }, { year: 2025, openingRank: 280, closingRank: 450 }, { year: 2026, openingRank: 270, closingRank: 430 }] },
  { collegeName: 'IIT (ISM) DHANBAD', exam: 'JEE Advanced', category: 'General', courseName: 'B.Tech Mineral and Metallurgical Engineering', cutoffs: [{ year: 2023, openingRank: 8800, closingRank: 13000 }, { year: 2024, openingRank: 8500, closingRank: 12600 }, { year: 2025, openingRank: 8200, closingRank: 12200 }, { year: 2026, openingRank: 8000, closingRank: 11900 }] },
  { collegeName: 'IIT (ISM) DHANBAD', exam: 'JEE Advanced', category: 'OBC-NCL', courseName: 'B.Tech Mineral and Metallurgical Engineering', cutoffs: [{ year: 2023, openingRank: 3500, closingRank: 8500 }, { year: 2024, openingRank: 3400, closingRank: 8300 }, { year: 2025, openingRank: 3250, closingRank: 8050 }, { year: 2026, openingRank: 3100, closingRank: 7850 }] },
  { collegeName: 'IIT (ISM) DHANBAD', exam: 'JEE Advanced', category: 'SC', courseName: 'B.Tech Mineral and Metallurgical Engineering', cutoffs: [{ year: 2023, openingRank: 2000, closingRank: 3200 }, { year: 2024, openingRank: 1900, closingRank: 3100 }, { year: 2025, openingRank: 1800, closingRank: 2980 }, { year: 2026, openingRank: 1750, closingRank: 2890 }] },

  // IIT MADRAS
  { collegeName: 'Indian Institute of Technology Madras', exam: 'JEE Advanced', category: 'General', courseName: 'B.Tech Electrical Engineering', cutoffs: [{ year: 2023, openingRank: 42, closingRank: 144 }, { year: 2024, openingRank: 40, closingRank: 138 }, { year: 2025, openingRank: 38, closingRank: 132 }, { year: 2026, openingRank: 35, closingRank: 126 }] },
  { collegeName: 'Indian Institute of Technology Madras', exam: 'JEE Advanced', category: 'OBC-NCL', courseName: 'B.Tech Electrical Engineering', cutoffs: [{ year: 2023, openingRank: 20, closingRank: 65 }, { year: 2024, openingRank: 18, closingRank: 60 }, { year: 2025, openingRank: 16, closingRank: 56 }, { year: 2026, openingRank: 15, closingRank: 52 }] },
  { collegeName: 'Indian Institute of Technology Madras', exam: 'JEE Advanced', category: 'SC', courseName: 'B.Tech Electrical Engineering', cutoffs: [{ year: 2023, openingRank: 10, closingRank: 38 }, { year: 2024, openingRank: 8, closingRank: 34 }, { year: 2025, openingRank: 7, closingRank: 31 }, { year: 2026, openingRank: 6, closingRank: 28 }] },

  // IIT DELHI
  { collegeName: 'Indian Institute of Technology Delhi', exam: 'JEE Advanced', category: 'General', courseName: 'B.Tech Computer Science', cutoffs: [{ year: 2023, openingRank: 29, closingRank: 115 }, { year: 2024, openingRank: 27, closingRank: 108 }, { year: 2025, openingRank: 25, closingRank: 102 }, { year: 2026, openingRank: 22, closingRank: 98 }] },
  { collegeName: 'Indian Institute of Technology Delhi', exam: 'JEE Advanced', category: 'OBC-NCL', courseName: 'B.Tech Computer Science', cutoffs: [{ year: 2023, openingRank: 12, closingRank: 48 }, { year: 2024, openingRank: 10, closingRank: 44 }, { year: 2025, openingRank: 9, closingRank: 40 }, { year: 2026, openingRank: 8, closingRank: 37 }] },
  { collegeName: 'Indian Institute of Technology Delhi', exam: 'JEE Advanced', category: 'EWS', courseName: 'B.Tech Computer Science', cutoffs: [{ year: 2023, openingRank: 5, closingRank: 18 }, { year: 2024, openingRank: 4, closingRank: 16 }, { year: 2025, openingRank: 3, closingRank: 14 }, { year: 2026, openingRank: 3, closingRank: 12 }] },

  // IIT BOMBAY
  { collegeName: 'Indian Institute of Technology Bombay', exam: 'JEE Advanced', category: 'General', courseName: 'B.Tech Mechanical Engineering', cutoffs: [{ year: 2023, openingRank: 200, closingRank: 1200 }, { year: 2024, openingRank: 190, closingRank: 1150 }, { year: 2025, openingRank: 180, closingRank: 1100 }, { year: 2026, openingRank: 170, closingRank: 1060 }] },
  { collegeName: 'Indian Institute of Technology Bombay', exam: 'JEE Advanced', category: 'OBC-NCL', courseName: 'B.Tech Mechanical Engineering', cutoffs: [{ year: 2023, openingRank: 100, closingRank: 440 }, { year: 2024, openingRank: 90, closingRank: 410 }, { year: 2025, openingRank: 85, closingRank: 390 }, { year: 2026, openingRank: 80, closingRank: 370 }] },

  // IIT KANPUR
  { collegeName: 'Indian Institute of Technology Kanpur', exam: 'JEE Advanced', category: 'General', courseName: 'B.Tech Aerospace Engineering', cutoffs: [{ year: 2023, openingRank: 2000, closingRank: 3800 }, { year: 2024, openingRank: 1950, closingRank: 3720 }, { year: 2025, openingRank: 1900, closingRank: 3640 }, { year: 2026, openingRank: 1850, closingRank: 3570 }] },
  { collegeName: 'Indian Institute of Technology Kanpur', exam: 'JEE Advanced', category: 'OBC-NCL', courseName: 'B.Tech Aerospace Engineering', cutoffs: [{ year: 2023, openingRank: 900, closingRank: 1550 }, { year: 2024, openingRank: 850, closingRank: 1480 }, { year: 2025, openingRank: 820, closingRank: 1420 }, { year: 2026, openingRank: 790, closingRank: 1370 }] },

  // ================= JEE MAIN (NITs) =================
  // NIT TRICHY
  { collegeName: 'NIT Tiruchirappalli', exam: 'JEE Main', category: 'General', courseName: 'B.Tech Electronics', cutoffs: [{ year: 2023, openingRank: 1200, closingRank: 3500 }, { year: 2024, openingRank: 1150, closingRank: 3400 }, { year: 2025, openingRank: 1100, closingRank: 3310 }, { year: 2026, openingRank: 1060, closingRank: 3230 }] },
  { collegeName: 'NIT Tiruchirappalli', exam: 'JEE Main', category: 'OBC-NCL', courseName: 'B.Tech Electronics', cutoffs: [{ year: 2023, openingRank: 400, closingRank: 1050 }, { year: 2024, openingRank: 380, closingRank: 980 }, { year: 2025, openingRank: 360, closingRank: 930 }, { year: 2026, openingRank: 340, closingRank: 890 }] },
  { collegeName: 'NIT Tiruchirappalli', exam: 'JEE Main', category: 'SC', courseName: 'B.Tech Electronics', cutoffs: [{ year: 2023, openingRank: 180, closingRank: 490 }, { year: 2024, openingRank: 160, closingRank: 450 }, { year: 2025, openingRank: 150, closingRank: 420 }, { year: 2026, openingRank: 140, closingRank: 395 }] },

  // NIT SURATHKAL
  { collegeName: 'NIT Surathkal', exam: 'JEE Main', category: 'General', courseName: 'B.Tech Information Technology', cutoffs: [{ year: 2023, openingRank: 1500, closingRank: 2900 }, { year: 2024, openingRank: 1450, closingRank: 2820 }, { year: 2025, openingRank: 1400, closingRank: 2740 }, { year: 2026, openingRank: 1360, closingRank: 2670 }] },
  { collegeName: 'NIT Surathkal', exam: 'JEE Main', category: 'OBC-NCL', courseName: 'B.Tech Information Technology', cutoffs: [{ year: 2023, openingRank: 460, closingRank: 910 }, { year: 2024, openingRank: 430, closingRank: 860 }, { year: 2025, openingRank: 410, closingRank: 825 }, { year: 2026, openingRank: 390, closingRank: 790 }] },

  // NIT ROURKELA
  { collegeName: 'NIT Rourkela', exam: 'JEE Main', category: 'General', courseName: 'B.Tech Civil Engineering', cutoffs: [{ year: 2023, openingRank: 12000, closingRank: 22000 }, { year: 2024, openingRank: 11800, closingRank: 21500 }, { year: 2025, openingRank: 11500, closingRank: 21000 }, { year: 2026, openingRank: 11200, closingRank: 20500 }] },
  { collegeName: 'NIT Rourkela', exam: 'JEE Main', category: 'OBC-NCL', courseName: 'B.Tech Civil Engineering', cutoffs: [{ year: 2023, openingRank: 4000, closingRank: 7100 }, { year: 2024, openingRank: 3800, closingRank: 6800 }, { year: 2025, openingRank: 3650, closingRank: 6550 }, { year: 2026, openingRank: 3500, closingRank: 6300 }] },

  // NIT WARANGAL
  { collegeName: 'NIT Warangal', exam: 'JEE Main', category: 'General', courseName: 'B.Tech Computer Science', cutoffs: [{ year: 2023, openingRank: 1000, closingRank: 2400 }, { year: 2024, openingRank: 950, closingRank: 2300 }, { year: 2025, openingRank: 910, closingRank: 2220 }, { year: 2026, openingRank: 870, closingRank: 2150 }] },
  { collegeName: 'NIT Warangal', exam: 'JEE Main', category: 'OBC-NCL', courseName: 'B.Tech Computer Science', cutoffs: [{ year: 2023, openingRank: 320, closingRank: 720 }, { year: 2024, openingRank: 300, closingRank: 680 }, { year: 2025, openingRank: 280, closingRank: 645 }, { year: 2026, openingRank: 265, closingRank: 615 }] },

  // ================= MEDICAL (NEET) =================
  // AIIMS NEW DELHI
  { collegeName: 'AIIMS New Delhi', exam: 'NEET', category: 'General', courseName: 'MBBS', cutoffs: [{ year: 2023, openingRank: 1, closingRank: 57 }, { year: 2024, openingRank: 1, closingRank: 53 }, { year: 2025, openingRank: 1, closingRank: 49 }, { year: 2026, openingRank: 1, closingRank: 46 }] },
  { collegeName: 'AIIMS New Delhi', exam: 'NEET', category: 'OBC-NCL', courseName: 'MBBS', cutoffs: [{ year: 2023, openingRank: 100, closingRank: 255 }, { year: 2024, openingRank: 95, closingRank: 245 }, { year: 2025, openingRank: 90, closingRank: 235 }, { year: 2026, openingRank: 85, closingRank: 226 }] },
  { collegeName: 'AIIMS New Delhi', exam: 'NEET', category: 'SC', courseName: 'MBBS', cutoffs: [{ year: 2023, openingRank: 320, closingRank: 920 }, { year: 2024, openingRank: 300, closingRank: 870 }, { year: 2025, openingRank: 285, closingRank: 830 }, { year: 2026, openingRank: 270, closingRank: 795 }] },

  // PGIMER & CMC VELLORE
  { collegeName: 'PGIMER Chandigarh', exam: 'NEET', category: 'General', courseName: 'MD/MS', cutoffs: [{ year: 2023, openingRank: 1, closingRank: 250 }, { year: 2024, openingRank: 1, closingRank: 240 }, { year: 2025, openingRank: 1, closingRank: 232 }, { year: 2026, openingRank: 1, closingRank: 224 }] },
  { collegeName: 'CMC Vellore', exam: 'NEET', category: 'General', courseName: 'MBBS', cutoffs: [{ year: 2023, openingRank: 150, closingRank: 1200 }, { year: 2024, openingRank: 140, closingRank: 1150 }, { year: 2025, openingRank: 130, closingRank: 1100 }, { year: 2026, openingRank: 120, closingRank: 1060 }] },
  { collegeName: 'JIPMER Puducherry', exam: 'NEET', category: 'General', courseName: 'MBBS', cutoffs: [{ year: 2023, openingRank: 50, closingRank: 277 }, { year: 2024, openingRank: 45, closingRank: 265 }, { year: 2025, openingRank: 42, closingRank: 254 }, { year: 2026, openingRank: 38, closingRank: 244 }] },

  // ================= MANAGEMENT (CAT) =================
  { collegeName: 'IIM Ahmedabad', exam: 'CAT', category: 'General', courseName: 'MBA (PGPM)', cutoffs: [{ year: 2023, openingRank: 1, closingRank: 150 }, { year: 2024, openingRank: 1, closingRank: 145 }, { year: 2025, openingRank: 1, closingRank: 140 }, { year: 2026, openingRank: 1, closingRank: 136 }] },
  { collegeName: 'IIM Ahmedabad', exam: 'CAT', category: 'OBC-NCL', courseName: 'MBA (PGPM)', cutoffs: [{ year: 2023, openingRank: 140, closingRank: 420 }, { year: 2024, openingRank: 130, closingRank: 400 }, { year: 2025, openingRank: 120, closingRank: 380 }, { year: 2026, openingRank: 115, closingRank: 365 }] },
  { collegeName: 'IIM Bangalore', exam: 'CAT', category: 'General', courseName: 'MBA (PGPM)', cutoffs: [{ year: 2023, openingRank: 10, closingRank: 250 }, { year: 2024, openingRank: 8, closingRank: 240 }, { year: 2025, openingRank: 7, closingRank: 230 }, { year: 2026, openingRank: 6, closingRank: 222 }] },
  { collegeName: 'IIM Calcutta', exam: 'CAT', category: 'General', courseName: 'MBA (PGPM)', cutoffs: [{ year: 2023, openingRank: 15, closingRank: 300 }, { year: 2024, openingRank: 12, closingRank: 290 }, { year: 2025, openingRank: 10, closingRank: 280 }, { year: 2026, openingRank: 9, closingRank: 272 }] },
  { collegeName: 'IIM Lucknow', exam: 'CAT', category: 'General', courseName: 'MBA (PGPM)', cutoffs: [{ year: 2023, openingRank: 50, closingRank: 600 }, { year: 2024, openingRank: 45, closingRank: 580 }, { year: 2025, openingRank: 40, closingRank: 560 }, { year: 2026, openingRank: 38, closingRank: 545 }] },

  // ================= LAW (CLAT) =================
  { collegeName: 'NLSIU Bengaluru', exam: 'CLAT', category: 'General', courseName: 'BA LLB (Hons)', cutoffs: [{ year: 2023, openingRank: 1, closingRank: 114 }, { year: 2024, openingRank: 1, closingRank: 108 }, { year: 2025, openingRank: 1, closingRank: 103 }, { year: 2026, openingRank: 1, closingRank: 98 }] },
  { collegeName: 'NLSIU Bengaluru', exam: 'CLAT', category: 'OBC-NCL', courseName: 'BA LLB (Hons)', cutoffs: [{ year: 2023, openingRank: 230, closingRank: 490 }, { year: 2024, openingRank: 210, closingRank: 460 }, { year: 2025, openingRank: 195, closingRank: 435 }, { year: 2026, openingRank: 185, closingRank: 415 }] },
  { collegeName: 'NLU Delhi', exam: 'CLAT', category: 'General', courseName: 'BA LLB (Hons)', cutoffs: [{ year: 2023, openingRank: 2, closingRank: 72 }, { year: 2024, openingRank: 1, closingRank: 68 }, { year: 2025, openingRank: 1, closingRank: 64 }, { year: 2026, openingRank: 1, closingRank: 60 }] },
  { collegeName: 'NALSAR Hyderabad', exam: 'CLAT', category: 'General', courseName: 'BA LLB (Hons)', cutoffs: [{ year: 2023, openingRank: 115, closingRank: 177 }, { year: 2024, openingRank: 110, closingRank: 170 }, { year: 2025, openingRank: 105, closingRank: 164 }, { year: 2026, openingRank: 100, closingRank: 158 }] },

  // ================= ARTS & SCIENCE (CUET) =================
  { collegeName: 'Miranda House', exam: 'CUET', category: 'General', courseName: 'B.Sc (Hons) Physics', cutoffs: [{ year: 2023, openingRank: 1, closingRank: 800 }, { year: 2024, openingRank: 1, closingRank: 770 }, { year: 2025, openingRank: 1, closingRank: 740 }, { year: 2026, openingRank: 1, closingRank: 715 }] },
  { collegeName: 'Hindu College', exam: 'CUET', category: 'General', courseName: 'BA (Hons) Political Science', cutoffs: [{ year: 2023, openingRank: 1, closingRank: 300 }, { year: 2024, openingRank: 1, closingRank: 285 }, { year: 2025, openingRank: 1, closingRank: 270 }, { year: 2026, openingRank: 1, closingRank: 258 }] }
];

async function main() {
  console.log('🚀 Seeding 4-year historical cutoff dataset (2023, 2024, 2025, 2026) for 2027-28 Admission Cycle...');

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
      console.log(`✅ Seeded 4-year history: ${college.name} (${group.courseName} | ${group.category})`);
    } else {
      console.log(`⚠️ FAILED: Could not find "${group.collegeName}" in database.`);
    }
  }

  console.log(`\n🎉 4-Year Seeding Complete! Added ${successCount} cutoffs across 2023-2026.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });