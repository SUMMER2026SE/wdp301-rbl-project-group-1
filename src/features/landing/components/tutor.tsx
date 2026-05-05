import Image from 'next/image';

import { Star } from 'lucide-react';
interface Tutor {
    id: number;
    name: string;
    subjects: string;
    description: string;
    rating: number;
    price: string;
    image: string;
}

const tutors: Tutor[] = [
    {
        id: 1,
        name: 'Nguyễn Thu Hà',
        subjects: 'Toán học & Giải tích',
        description: 'Giảng dạy dễ hiểu, giúp học sinh nắm vững kiến thức Toán THPT và ôn thi đại học.',
        rating: 4.9,
        price: '60k/giờ',
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDlGYHLR2hjbfiTgblWDQxTSnaSfj1y-_E87keoHqwBO7-TsHK4v3pSrB1bgUc-H6XEViiqOaCTMGiqJV-8zwvN2IfXAx6Xr3oW_M80fXa_v64cRLYGPLwr7wxmE6MJji-SUMn5aQS9TckCI5ytGlvKjeQQwuL2TZW9eNy_VVdWnGVpYRBN7K1YDIVXxCIa_Dt9NsBNUwwzc2TUxpjOskVjci9dmlMTuplvFGKFJDDRZxP36alisC-9f6TslVMG3WGdNR6CQdZO80g',
    },
    {
        id: 2,
        name: 'Trần Minh Đức',
        subjects: 'Vật lý & Hóa học',
        description: 'Sinh viên năm cuối Đại học Bách Khoa, có 3 năm kinh nghiệm dạy kèm Lý Hóa.',
        rating: 5.0,
        price: '75k/giờ',
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCr9d93O0VOlrXLtKsiljVcslAgWWOW8z8Aafk4knTBcnoLJJ1oejlW1jRCzT-yM7XTISO9vO7ApnRJi6hjc7-ZAi_yFA-Yr96cOsdQW_haExMrY9eg_a-z7wrbNVgHDOgmzHmwgzltMG7-q8SMCSWbJcbqqAcA33xZeloUKByug2jLRVyZu3TtxGGIL-77w49tZV10Zo_MBeje_mQs6glFcOA214bpaTo7kasjVE23i3jxqjaSkJWKN11VKTO6TlaY4nfW7XmWhOk',
    },
    {
        id: 3,
        name: 'Phạm Thanh Tâm',
        subjects: 'Tiếng Anh',
        description: 'Dạy giao tiếp và luyện thi IELTS, nhiều học viên đạt 7.0+.',
        rating: 4.8,
        price: '90k/giờ',
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCphrI1DKRdUBVi_g7HnatQuWNDkEh-3DvIG_h9EWh79LU_gpU5i7UfkKF3rLJkCHOjvBKgA9HUqzVrj_p4OAVmaX8C9Zu799gdNiQAt9ZX3qfTlk6mUXt0uoSXYVmMdX_iLFmH9jBOsCqWKoAtiPylA7Q5LUiwNrhGaKwiWICGjUO5dkul1sbYvhmKCAJXLqGN99kfg0M3xc-o12DwDqXNa_7M2Y8_bmVHRAfn6DSNHs9Ne7WAdLXxvKsmk5OljFWCkeEXoMqKkz8',
    },
    {
        id: 4,
        name: 'Lê Hoàng Nam',
        subjects: 'Lập trình & Tin học',
        description: 'Hướng dẫn lập trình cơ bản Python, Java cho sinh viên và người mới bắt đầu.',
        rating: 4.9,
        price: '85k/giờ',
        image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBcDnBmw0xAZsa7dbVV2nNCfNIbGGls-AqlLuE2xGfmQxY0jFA3qARftI1veNhBXdBX9OfLj6JzzuIUjIXuIiD0I2dEVOKPQVmWvUjjgO7gpcMMEymSqSAIiCc1w6AxsL6IqZICn_SOLe-KWHIesHJ7HtvXhww5ziZEZmPtWOB0tRPeNLPCZZj2Qu6yMEqulYQonGg4ZJBwujkCoIfBagQ1MHkyMNNBnjr4CMQnOmwFIYMaFvTzUXFEHt7zb-poUOtHh2tO0DIl6_I',
    },
];

export default function Tutors({ id = "tutors" }: { id?: string }) {
    return (
        <section id={id} className="w-full py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-16">
                    <div className="mb-8 flex items-end justify-between">
                        <div>
                            <h2 className="text-3xl font-bold leading-tight text-foreground">Gia sư hàng đầu</h2>
                            <p className="mt-2 text-muted-foreground">Học hỏi từ những người giỏi nhất trong ngành</p>
                        </div>
                        <a className="hidden items-center gap-1 text-sm font-bold text-primary hover:text-primary/80 sm:flex" href="#">
                            Xem tất cả gia sư →
                        </a>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {tutors.map((tutor) => (
                            <div
                                key={tutor.id}
                                className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg"
                            >
                                <div className="relative h-48 w-full bg-muted">
                                    <Image src={tutor.image} alt={tutor.name} fill className="object-cover" />
                                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-background px-2 py-1 shadow-sm">
                                        <Star className="size-3.5 fill-warning text-warning" />
                                        <span className="text-xs font-bold text-foreground">{tutor.rating.toFixed(1)}</span>
                                    </div>
                                </div>

                                <div className="flex flex-1 flex-col gap-3 p-5">
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground">{tutor.name}</h3>
                                        <p className="text-sm font-medium text-primary">{tutor.subjects}</p>
                                    </div>
                                    <p className="line-clamp-2 text-sm text-muted-foreground">{tutor.description}</p>
                                    <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
                                        <span className="text-sm font-bold text-foreground">{tutor.price}</span>
                                        <button className="text-sm font-medium text-primary hover:underline">Xem hồ sơ</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="-mx-4 my-10 bg-primary/5 px-4 py-16 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-12 text-center">
                            <h2 className="mb-4 text-3xl font-black text-foreground">Câu chuyện thành công</h2>
                            <p className="text-muted-foreground">Nghe từ những người đã trải nghiệm và thay đổi nhờ Edura</p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {[
                                {
                                    quote:
                                        '"Nhờ có gia sư Sarah, điểm Toán của mình đã tăng rõ rệt chỉ sau 3 tháng. Các bài giảng rất dễ hiểu và mình tự tin hơn hẳn."',
                                    name: 'Minh Tâm',
                                    role: 'Học sinh lớp 11',
                                    color: 'bg-primary/20 text-primary',
                                    initials: 'M',
                                },
                                {
                                    quote:
                                        '"Trở thành gia sư trên Tutor Connect là quyết định tuyệt vời. Mình có thể linh hoạt thời gian và có đầy đủ công cụ giảng dạy hiệu quả."',
                                    name: 'Hoàng Nam',
                                    role: 'Gia sư Tiếng Anh',
                                    color: 'bg-success-soft text-success',
                                    initials: 'H',
                                },
                                {
                                    quote:
                                        '"Con gái tôi đã đỗ vào trường đại học mơ ước. Gia sư không chỉ dạy kiến thức mà còn truyền cảm hứng rất tốt."',
                                    name: 'Chị Lan Anh',
                                    role: 'Phụ huynh học sinh',
                                    color: 'bg-purple-soft text-purple',
                                    initials: 'L',
                                },
                            ].map((story) => (
                                <article key={story.name} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-8 shadow-sm">
                                    <div className="flex gap-1 text-warning">
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <Star key={index} className="size-4 fill-warning text-warning" />
                                        ))}
                                    </div>
                                    <p className="flex-1 italic text-muted-foreground">{story.quote}</p>
                                    <div className="flex items-center gap-3 border-t border-border pt-4">
                                        <div className={`flex size-10 items-center justify-center rounded-full font-bold ${story.color}`}>
                                            {story.initials}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">{story.name}</p>
                                            <p className="text-xs text-muted-foreground">{story.role}</p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}