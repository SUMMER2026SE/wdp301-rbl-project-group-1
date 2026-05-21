import type { Document, Category } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'textbooks',
    name: 'Sách giáo khoa',
    count: 120,
    icon: 'menu_book',
    color: 'blue',
  },
  {
    id: 'exams',
    name: 'Đề thi thử',
    count: 500,
    icon: 'quiz',
    color: 'purple',
  },
  {
    id: 'supplements',
    name: 'Tài liệu bổ trợ',
    count: 300,
    icon: 'lightbulb',
    color: 'emerald',
  },
];

export const SAVED_DOCUMENTS: Document[] = [
  {
    id: '1',
    title: 'Công thức Vật lý 12 - Trọn bộ ôn thi THPT QG',
    type: 'pdf',
    icon: 'picture_as_pdf',
    size: '2.4 MB',
    savedDate: '2 ngày trước',
  },
  {
    id: '2',
    title: '50 Đề thi thử Toán 2024 (Có đáp án chi tiết)',
    type: 'docx',
    icon: 'description',
    size: '5.1 MB',
    savedDate: 'tuần trước',
  },
];

export const SUGGESTIONS: Document[] = [
  {
    id: '1',
    title: 'Tổng ôn Ngữ pháp Tiếng Anh THPT Quốc gia',
    type: 'pdf',
    icon: 'picture_as_pdf',
    downloads: 2300,
    size: '12 MB',
  },
  {
    id: '2',
    title: 'Series Bài giảng Hóa học 12 - Thầy Phạm Văn A',
    type: 'video',
    icon: 'play_circle',
    downloads: 1500,
    description: '45 phút/bài',
  },
  {
    id: '3',
    title: 'Bí kíp giải nhanh Trắc nghiệm Toán 12',
    type: 'docx',
    icon: 'description',
    downloads: 3200,
    size: '3.5 MB',
  },
  {
    id: '4',
    title: 'Đề cương ôn tập Sinh học Kì 1',
    type: 'pdf',
    icon: 'picture_as_pdf',
    downloads: 890,
    size: '1.2 MB',
  },
];

export const DOCUMENT_TYPES = [
  { id: 'pdf', label: 'Tài liệu PDF' },
  { id: 'word', label: 'Văn bản Word (.doc, .docx)' },
  { id: 'video', label: 'Video bài giảng (.mp4)' },
];

export const TAGS = [
  '#ĐH1012',
  '#tính2',
  '#IELTS',
  '#vật-lý-nâng-cao',
  '#hoá-học',
  '#tiếng-anh-toàn-khóa',
];
