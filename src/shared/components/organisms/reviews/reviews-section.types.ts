export interface ReviewAuthor {
  name: string;
  avatar?: string;
  role?: string;
  isVerified?: boolean;
}

export interface ReviewItem {
  id: string;
  author: ReviewAuthor;
  content: string;
  timestamp?: string;
  likes?: number;
  liked?: boolean;
  rating?: number;
  replies?: ReviewItem[];
}

export type ReviewMode = "feedback" | "reviews";

export interface ReviewsSectionProps {
  items: ReviewItem[];
  totalItems: number;
  mode?: ReviewMode;
  onAddItem?: (content: string) => void;
  title?: string;
  rating?: number;
  onFilterRating?: (rating: number | null) => void;
}
