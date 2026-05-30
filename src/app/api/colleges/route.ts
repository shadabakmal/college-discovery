import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ACRONYMS: Record<string, string> = {
  "iit": "indian institute of technology",
  "nit": "national institute of technology",
  "iim": "indian institute of management",
  "iiit": "indian institute of information technology",
  "aiims": "all india institute of medical sciences",
  "nlu": "national law university",
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const search = searchParams.get("search") || "";
    const stream = searchParams.get("stream") || "All Streams";
    const exam = searchParams.get("exam") || "All Exams"; // New exam param

    const skip = (page - 1) * limit;

    const query: any = {
      where: { AND: [] },
      include: { courses: true,
        _count: {
          select: { reviews: true }
        },
        reviews: {
      select: { rating: true } // Gets all ratings to calculate average
    }
      },
      orderBy: [
        { ranking: 'asc' },
        { id: 'asc' }
      ],
      skip: skip,
      take: limit,
    };

    // 1. Handle Smart Text Search
    if (search) {
      const searchTerms = search.toLowerCase().split(/\s+/).filter(Boolean);
      searchTerms.forEach((term: string) => {
        const expandedTerm = ACRONYMS[term];
        const termConditions: any[] = [
          { name: { contains: term, mode: "insensitive" } },
          { location: { contains: term, mode: "insensitive" } },
          { courses: { some: { name: { contains: term, mode: "insensitive" } } } },
          { courses: { some: { stream: { contains: term, mode: "insensitive" } } } }
        ];

        if (expandedTerm) {
          termConditions.push({ name: { contains: expandedTerm, mode: "insensitive" } });
        }

        query.where.AND.push({ OR: termConditions });
      });
    }

    // 2. Handle Stream Dropdown Filter
    if (stream && stream !== "All Streams") {
      query.where.AND.push({
        courses: {
          some: { stream: { equals: stream, mode: "insensitive" } }
        }
      });
    }

    // 3. Handle Exam Filter (NEW LOGIC)

    if (exam && exam !== "All Exams") {
      const examLower = exam.toLowerCase();
      
      if (examLower === "jee advanced") {
        query.where.AND.push({
          OR: [
            { name: { contains: "indian institute of technology", mode: "insensitive" } },
            // 👇 This perfectly catches "IIT (ISM) DHANBAD" without catching "IIIT"
            { name: { startsWith: "iit", mode: "insensitive" } } 
          ]
        });
      } else if (examLower === "jee main") {
        query.where.AND.push({
          OR: [
            { name: { contains: "national institute of technology", mode: "insensitive" } },
            { name: { contains: "nit", mode: "insensitive" } },
            { name: { contains: "iiit", mode: "insensitive" } }
          ]
        });
      } else if (examLower === "cat") {
        query.where.AND.push({
          OR: [
            { name: { contains: "management", mode: "insensitive" } },
            { name: { startsWith: "iim", mode: "insensitive" } },
            { name: { contains: "fms", mode: "insensitive" } }
          ]
        });
      } else if (examLower === "neet") {
        query.where.AND.push({
          courses: { some: { stream: { contains: "medical", mode: "insensitive" } } }
        });
      } else if (examLower === "clat") {
        // Now it looks at the course stream instead of just the college name!
        query.where.AND.push({
          courses: { some: { stream: { contains: "law", mode: "insensitive" } } }
        });
      } else if (examLower === "cuet") {
        // 👇 CUET covers your Science & Arts colleges from Delhi University!
        query.where.AND.push({
          OR: [
            { courses: { some: { stream: { equals: "Arts", mode: "insensitive" } } } },
            { courses: { some: { stream: { equals: "Science", mode: "insensitive" } } } }
          ]
        });
      }
    }
    // Clean up empty AND array if no filters applied
    if (query.where.AND.length === 0) {
      delete query.where.AND;
    }

    const [colleges, total] = await Promise.all([
      prisma.college.findMany(query),
      prisma.college.count({ where: query.where })
    ]);

    return NextResponse.json({
      data: colleges,
      meta: {
        total,
        page,
        limit,
        hasMore: skip + colleges.length < total
      }
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch colleges" }, { status: 500 });
  }
}