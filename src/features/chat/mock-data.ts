import type { Conversation, ConversationDetail } from "./types";

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    type: "personal",
    name: "Nguyễn Minh Anh",
    lastMessage: "Đã gửi một tài liệu mới",
    lastMessageTime: new Date("2024-11-10T10:45:00"),
    participant: {
      id: "user-1",
      name: "Nguyễn Minh Anh",
      role: "Học sinh lớp 12A1 - THPT Chuyên",
      status: "online",
    },
  },
  {
    id: "conv-2",
    type: "class",
    name: "Lớp Toán 12 - Nhóm A",
    lastMessage: "Hoàng: Thầy ơi bài tập 5 giải thế nào ạ?",
    lastMessageTime: new Date("2024-11-10T08:20:00"),
  },
  {
    id: "conv-3",
    type: "personal",
    name: "Trần Quốc Bảo",
    lastMessage: "Cảm ơn thầy, em đã hiểu bài rồi.",
    lastMessageTime: new Date("2024-11-09T15:00:00"),
    participant: {
      id: "user-3",
      name: "Trần Quốc Bảo",
      role: "Học sinh",
      status: "offline",
    },
  },
  {
    id: "conv-4",
    type: "personal",
    name: "Cô Lê Thu Thủy",
    lastMessage: "Xác nhận lịch họp chuyên môn vào sáng ...",
    lastMessageTime: new Date("2024-11-07T09:00:00"),
    participant: {
      id: "user-4",
      name: "Cô Lê Thu Thủy",
      role: "Giáo viên",
      status: "offline",
    },
  },
];

export const MOCK_CONVERSATION_DETAILS: Record<string, ConversationDetail> = {
  "conv-1": {
    ...MOCK_CONVERSATIONS[0],
    messages: [
      {
        id: "msg-1",
        content:
          "Chào thầy ạ, em vừa hoàn thành xong bài tập về đạo hàm thầy giao hôm qua.",
        senderId: "user-1",
        senderName: "Nguyễn Minh Anh",
        timestamp: new Date("2024-11-10T10:30:00"),
        type: "text",
        isOwn: false,
      },
      {
        id: "msg-2",
        content:
          "Chào Minh Anh, thầy đã nhận được rồi nhé. Em có gặp khó khăn gì ở phần ứng dụng thực tế không?",
        senderId: "current-user",
        senderName: "Thầy",
        timestamp: new Date("2024-11-10T10:52:00"),
        type: "text",
        isOwn: true,
      },
      {
        id: "msg-3",
        content:
          "Dạ có bài số 7 em hơi lúng túng ạ. Em gửi kèm file nhập em đã làm, thầy xem giúp em nhé!",
        senderId: "user-1",
        senderName: "Nguyễn Minh Anh",
        timestamp: new Date("2024-11-10T10:45:00"),
        type: "file",
        isOwn: false,
        attachments: [
          {
            id: "att-1",
            name: "Bai_tap_Dao_ham_v2.pdf",
            size: 1258291, // ~1.2 MB
            url: "#",
            type: "pdf",
          },
        ],
      },
    ],
    sharedDocuments: [
      {
        id: "doc-1",
        name: "Bai_tap_Dao_ham_v2.pdf",
        size: 1258291,
        type: "pdf",
        url: "#",
        sharedAt: new Date("2024-11-10T10:45:00"),
      },
      {
        id: "doc-2",
        name: "Giai_phuong_trinh_bac_2.jpg",
        size: 4718592, // ~4.5 MB
        type: "image",
        url: "#",
        sharedAt: new Date("2024-11-09T15:00:00"),
      },
    ],
    upcomingSession: {
      id: "session-1",
      date: new Date("2024-11-12"),
      startTime: "19:30",
      endTime: "21:00",
      topic: "Ôn tập Hình học không gian",
    },
  },
  "conv-2": {
    ...MOCK_CONVERSATIONS[1],
    messages: [
      {
        id: "msg-4",
        content: "Thầy ơi bài tập 5 giải thế nào ạ?",
        senderId: "user-hoang",
        senderName: "Hoàng",
        timestamp: new Date("2024-11-10T08:20:00"),
        type: "text",
        isOwn: false,
      },
    ],
    sharedDocuments: [],
  },
  "conv-3": {
    ...MOCK_CONVERSATIONS[2],
    messages: [
      {
        id: "msg-5",
        content: "Cảm ơn thầy, em đã hiểu bài rồi.",
        senderId: "user-3",
        senderName: "Trần Quốc Bảo",
        timestamp: new Date("2024-11-09T15:00:00"),
        type: "text",
        isOwn: false,
      },
    ],
    sharedDocuments: [],
  },
  "conv-4": {
    ...MOCK_CONVERSATIONS[3],
    messages: [
      {
        id: "msg-6",
        content: "Xác nhận lịch họp chuyên môn vào sáng thứ 5 nhé thầy.",
        senderId: "user-4",
        senderName: "Cô Lê Thu Thủy",
        timestamp: new Date("2024-11-07T09:00:00"),
        type: "text",
        isOwn: false,
      },
    ],
    sharedDocuments: [],
  },
};
