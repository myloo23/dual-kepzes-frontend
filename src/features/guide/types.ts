export interface GuideCourse {
  id: string;
  title: string;
  description: string;
  embedUrl: string;
  sourceUrl: string;
  presentationName: string;
  author: string;
}

export interface MaterialProgress {
  id: string | number;
  materialId: string;
  studentId: string | number;
  rating: number;
  feedback?: string;
  completedAt: string;
}

export interface MaterialStatistics {
  materialId: string;
  title?: string;
  completions: number;
  averageRating: number;
}
