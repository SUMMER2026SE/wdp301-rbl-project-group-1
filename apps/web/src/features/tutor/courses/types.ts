export interface Schedule {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface CreateClassFormData {
  className: string;
  subject: string;
  description: string;
  maxStudents: number;
  schedules: Schedule[];
  googleMeetLink?: string;
}

export const daysOfWeek = [
  { value: 'monday', label: 'Thứ 2' },
  { value: 'tuesday', label: 'Thứ 3' },
  { value: 'wednesday', label: 'Thứ 4' },
  { value: 'thursday', label: 'Thứ 5' },
  { value: 'friday', label: 'Thứ 6' },
  { value: 'saturday', label: 'Thứ 7' },
  { value: 'sunday', label: 'Chủ nhật' },
];

export const subjects = [
  { value: 'math', label: 'Toán' },
  { value: 'physics', label: 'Vật lý' },
  { value: 'chemistry', label: 'Hóa học' },
  { value: 'english', label: 'Tiếng Anh' },
  { value: 'literature', label: 'Ngữ văn' },
  { value: 'biology', label: 'Sinh học' },
];
