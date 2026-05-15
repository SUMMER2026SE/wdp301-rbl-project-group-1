import type { ResourceDetail, Comment, RelatedResource } from './types';

export const mockResourceDetail: ResourceDetail = {
  id: 'physics-formulas-12',
  title: 'Công thức Vật lý 12 - Trọn bộ ôn thi THPT QG',
  description:
    'Tài liệu tổng hợp toàn bộ công thức Vật lý lớp 12 phục vụ cho kì thi THPT Quốc gia. Được biên soạn chi tiết, dễ hiểu, phân loại theo chương: Dao động cơ, Sóng cơ, Sóng điện từ, Quang học, Vật lý hạt nhân tử. Kiến thức được trình bày rõ ràng, ví dụ minh họa từng công thức. Sóng ánh sáng, Lượng tử ánh sáng, Hạt nhân nguyên tử.',
  type: 'pdf',
  category: 'Vật lý 12',
  subCategory: 'Luyện thi THPT QG',
  fileUrl: '/documents/physics-formulas-12.pdf',
  fileName: 'Cong-thuc-Vat-ly-12.pdf',
  fileSize: '4.2 MB',
  publishDate: '15/10/2023',
  downloads: 2450,
  views: 5230,
  rating: 4.8,
  totalRatings: 124,
  pages: 45,
  tags: ['THPT', 'Vật lý', 'Công thức', 'Luyện thi'],
  author: {
    id: 'author-001',
    name: 'Gia sư Lê Thị Lan',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBFGzGK3GmCGxYqmcJKxyywGUzhxyx2Gl3WxEDWOxihUjXxo8V6o8kRLocGDUXVzklz6SOFy2RkXh6exvPYnaYBBuIWWFWzj1LmrNMiuw8mEnT-r72pjYVndhBnhBJN2JPEangBfBT-w_aWDLMuToOwR-RE3F4m2hcGXThVb5p5RyrP6inCCwh9k86e7BHPomEr7HguqQSePJkeIu7wVTxAVD4zoQ1Dtsbo8IVjnSYVrFAc-_NIXr1IE_LZ3rsxw8xkYgsBaRHoFoI',
    isVerified: true,
  },
};

export const mockComments: Comment[] = [
  {
    id: 'comment-1',
    author: {
      id: 'user-1',
      name: 'Trần Duy Hưng',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCkUUBUBJ-n-_GjK7vhbxurhuIwUe2q0Ps0kS6-WtqEkwcQW1ayg2f0Cs_VLdgJjOLGwPP4djtwHacdPOymmsYmTDcZE6RA4TLyQshMwHgOyt4YLjKs-z912btwh5QVpp9ByS8lcS8KV3Gx9tXtgrzlWgeaJvEPt4H3cCf4d4ePXEa0Jcn1SCB9by7oIV5CzMFOR2mv_dzXDa2H3-jTtjROJbvMEQx9MQ9bcAUzKdcgKnSIrCxBR1k83r2MyWuBbS_e8UH7A9S6HTk',
      isVerified: false,
    },
    content:
      'Tài liệu rất hay và chi tiết, biết được rất nhiều công thức và cách giải. Cảm ơn rất nhiều!',
    timestamp: '2 ngày trước',
    likes: 12,
    replies: [],
  },
  {
    id: 'comment-2',
    author: {
      id: 'user-2',
      name: 'Nguyễn Phương Thảo',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDod1umbvFOpH0vcV5rqQB1K_ER_c5mdg8-_eIvNd2zF_RN04o8l1jmTVcdULe1v7sCo2yFHxitpjkg5a-sB8iKXuZzbsCjBmlEase62QFeJnIcV8ispoV1RPWgCAJhW1Io67SRC6ZZMqWDMgXJL1meJALW459UsPv3uz5doqhc6FzfSCCEkhWn-oUizz5wkWqtdPgGNio_rPn8RR5zclf0lMFMJ0viiABYhSrgf2IzbE_-ZH-uZk_o4bKHSeg5b7ZmqKTxTcfwaHg',
      isVerified: false,
    },
    content:
      'Có ơi cho em hỏi tí, em bị nhầm giữa công thức giao thoa ánh sáng vs chuyển động sóng có cách nào để phân biệt không?',
    timestamp: '1 tuần trước',
    likes: 3,
    replies: [
      {
        id: 'reply-1',
        author: {
          id: 'user-3',
          name: 'Gia sư Lê Thị Lan',
          avatar:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCwMSu0qEZQHIZ7qdoVs5uzTTFuo8aFUHp0KuuXs6Vb5krspGvAgtTMGJMG6Ni2p4zCVGTlaIirGuWQvuBDp0mjLdMfHBdwesSdRGHWdw8gW59GTq62nZH7zTMmQAMeTi6G-qbOJQ6Bj0ee_UPEs1_9LFt02nG4uFb_w8bsgeKoAMzjvUh-Gi6YaeLlM-65-a_aL3snEmievdaP5VZXKeVEMSZ4HifByCBty7KEkU21O4ACH4Oq3hj-JnWyWTtJtG2UHD8M_enFr2Q',
          isVerified: true,
        },
        content:
          'Chào em, em xem lại trang 16 để nắm rõ hơn về sự khác biệt giữa hai công thức nhé. Chúc em học tốt!',
        timestamp: '6 ngày trước',
        likes: 2,
      },
    ],
  },
];

export const mockRelatedResources: RelatedResource[] = [
  {
    id: 'physics-11',
    title: 'Công thức Vật lý 11 - Luyện thi Vật lý',
    category: 'Vật lý 11',
    downloads: 1856,
    rating: 4.7,
  },
  {
    id: 'physics-exam',
    title: '50 Đề thi thử Vật lý THPT QG 2024',
    category: 'Đề thi',
    downloads: 3240,
    rating: 4.6,
  },
  {
    id: 'physics-solution',
    title: 'Giải chi tiết đề thi thử Vật lý 50 Hà Nội',
    category: 'Giải đề',
    downloads: 892,
    rating: 4.9,
  },
  {
    id: 'physics-note',
    title: 'Sổ tay lý thuyết Vật lý định hướng',
    category: 'Ghi chú',
    downloads: 1205,
    rating: 4.5,
  },
];
