import { format } from "date-fns";
import { GetMySessionsApiResponse } from "@/src/features/booking/bookingApi";

const COLORS: Array<"blue" | "purple" | "emerald" | "orange"> = ["blue", "purple", "emerald", "orange"];

function getHashForString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function getColorForSubject(subjectId: string): "blue" | "purple" | "emerald" | "orange" {
  const hash = getHashForString(subjectId);
  return COLORS[hash % COLORS.length];
}

export function mapSessionsToScheduleClasses(
  sessions: GetMySessionsApiResponse["data"]
) {
  return sessions.map((session) => {
    const startTime = new Date(session.startTime);
    const endTime = new Date(session.endTime);
    
    return {
      id: session.id,
      dateStr: format(startTime, "yyyy-MM-dd"),
      name: session.title || session.subjectName,
      subject: session.subjectName,
      tutorName: session.counterpartName,
      studentName: session.counterpartName,
      time: format(startTime, "HH:mm"),
      endTime: format(endTime, "HH:mm"),
      color: getColorForSubject(session.subjectId),
    };
  });
}

export function mapSessionsToTodayClasses(
  sessions: GetMySessionsApiResponse["data"]
) {
  return sessions.map((session) => {
    const startTime = new Date(session.startTime);
    let uiStatus: "upcoming" | "happening" | "completed" = "upcoming";
    
    if (session.status === "COMPLETED") {
      uiStatus = "completed";
    } else {
      const now = new Date();
      const endTime = new Date(session.endTime);
      if (now >= startTime && now <= endTime) {
        uiStatus = "happening";
      } else if (now > endTime) {
        uiStatus = "completed";
      } else {
        uiStatus = "upcoming";
      }
    }
    
    return {
      id: session.id,
      title: session.title || session.subjectName,
      subject: session.subjectName,
      tutorName: session.counterpartName,
      studentName: session.counterpartName,
      time: format(startTime, "HH:mm"),
      status: uiStatus,
    };
  });
}

export function mapSessionsToUpcomingClasses(
  sessions: GetMySessionsApiResponse["data"]
) {
  return sessions.map((session) => {
    const startTime = new Date(session.startTime);
    const endTime = new Date(session.endTime);
    
    return {
      id: session.id,
      date: format(startTime, "dd/MM/yyyy"),
      time: format(startTime, "HH:mm"),
      endTime: format(endTime, "HH:mm"),
      title: session.title || session.subjectName,
      subject: session.subjectName,
      tutorName: session.counterpartName,
      studentName: session.counterpartName,
      note: session.notes || undefined,
      status: session.status === "SCHEDULED" ? ("happening" as const) : undefined,
    };
  });
}
