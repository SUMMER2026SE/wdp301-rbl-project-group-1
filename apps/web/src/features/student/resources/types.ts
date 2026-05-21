export interface Document {
  id: string;
  title: string;
  type: 'pdf' | 'docx' | 'video';
  icon: string;
  size?: string;
  downloads?: number;
  views?: number;
  savedDate?: string;
  description?: string;
  category?: string;
  isSaved?: boolean;
}

export interface Category {
  id: string;
  name: string;
  count: number;
  icon: string;
  color: 'blue' | 'purple' | 'emerald';
}

export interface FilterState {
  documentTypes: string[];
  categories: string[];
  search: string;
}
