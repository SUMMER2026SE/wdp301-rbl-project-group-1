export const doesEventOverlapSession = (
  eventStartTime: string,
  eventEndTime: string,
  sessionStartHour: number,
  sessionSlotsCount: number,
) => {
  const [sh, sm] = eventStartTime.split(":").map(Number);
  const [eh, em] = eventEndTime.split(":").map(Number);
  const eStartMinutes = sh * 60 + sm;
  const eEndMinutes = eh * 60 + em;

  const sStartMinutes = sessionStartHour * 60;
  const sEndMinutes = sessionStartHour * 60 + sessionSlotsCount * 30;

  return eStartMinutes < sEndMinutes && eEndMinutes > sStartMinutes;
};

export const getRelativeEventPosition = (
  eventStartTime: string,
  eventEndTime: string,
  sessionStartHour: number,
  sessionSlotsCount: number,
) => {
  const [sh, sm] = eventStartTime.split(":").map(Number);
  const [eh, em] = eventEndTime.split(":").map(Number);

  const eStartMins = sh * 60 + sm;
  const eEndMins = eh * 60 + em;

  const sessionStartMins = sessionStartHour * 60;
  const sessionEndMins = sessionStartHour * 60 + sessionSlotsCount * 30;

  const clampedStart = Math.max(eStartMins, sessionStartMins);
  const clampedEnd = Math.min(eEndMins, sessionEndMins);

  const topSlot = (clampedStart - sessionStartMins) / 30;
  const durationSlots = (clampedEnd - clampedStart) / 30;

  return {
    top: (topSlot / sessionSlotsCount) * 100,
    height: (durationSlots / sessionSlotsCount) * 100,
  };
};

export const generateActiveTimeSlots = (startHour: number, slotsCount: number) => {
  return Array.from({ length: slotsCount }, (_, i) => {
    const totalMinutes = i * 30;
    const hour = startHour + Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${minute}`;
  });
};
