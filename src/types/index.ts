export interface College {
  id: string;
  name: string;
  location: string;
  city: string;
  state: string;
  type: "Government" | "Private" | "Deemed" | "Autonomous";
  rating: number;
  reviewCount: number;
  fees: {
    min: number;
    max: number;
  };
  ranking: number;
  rankingBody: string;
  image: string;
  logo: string;
  established: number;
  accreditation: string;
  naacGrade: string;
  courses: Course[];
  placements: Placement;
  facilities: string[];
  tags: string[];
  description: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  admissionProcess: string;
  cutoffs: Cutoff[];
  gallery: string[];
}

export interface Course {
  id: string;
  name: string;
  duration: string;
  fees: number;
  seats: number;
  eligibility: string;
  mode: "Full-time" | "Part-time" | "Distance";
}

export interface Placement {
  averageSalary: number;
  highestSalary: number;
  placementRate: number;
  topRecruiters: string[];
  year: number;
}

export interface Cutoff {
  exam: string;
  category: string;
  openingRank: number;
  closingRank: number;
  year: number;
}

export interface Review {
  id: string;
  collegeId: string;
  userId: string;
  userName: string;
  avatar: string;
  rating: number;
  title: string;
  pros: string;
  cons: string;
  batch: string;
  course: string;
  helpful: number;
  createdAt: string;
}

export interface Discussion {
  id: string;
  title: string;
  body: string;
  tags: string[];
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  answers: Answer[];
  views: number;
  votes: number;
  createdAt: string;
  collegeId?: string;
}

export interface Answer {
  id: string;
  body: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  votes: number;
  isAccepted: boolean;
  createdAt: string;
}

export interface SearchFilters {
  query: string;
  location: string;
  type: string;
  fees_min: number;
  fees_max: number;
  rating_min: number;
  exam: string;
  course: string;
  page: number;
  sort: string;
}