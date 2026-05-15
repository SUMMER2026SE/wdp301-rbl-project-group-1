export interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    isVerified?: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
  liked?: boolean;
}

export interface ResourceAuthor {
  id: string;
  name: string;
  avatar: string;
  isVerified?: boolean;
  title?: string;
  bio?: string;
}

export interface ResourceDetail {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'docx' | 'video';
  category: string;
  subCategory?: string;
  fileUrl: string;
  fileName: string;
  fileSize?: string;
  publishDate: string;
  downloads: number;
  views?: number;
  rating: number;
  totalRatings: number;
  author: ResourceAuthor;
  pages?: number;
  duration?: string;
  tags?: string[];
}

export interface RelatedResource {
  id: string;
  title: string;
  category: string;
  downloads: number;
  rating: number;
}
