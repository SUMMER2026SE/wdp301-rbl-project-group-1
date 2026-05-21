-- CreateTable
CREATE TABLE "lesson_attendance" (
    "id" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "attendance_status" "attendance_status" NOT NULL,
    "note" TEXT,
    "marked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lesson_attendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lesson_attendance_lesson_id_student_id_key" ON "lesson_attendance"("lesson_id", "student_id");

-- CreateIndex
CREATE INDEX "lesson_attendance_student_id_idx" ON "lesson_attendance"("student_id");

-- CreateIndex
CREATE INDEX "lesson_attendance_attendance_status_idx" ON "lesson_attendance"("attendance_status");

-- AddForeignKey
ALTER TABLE "lesson_attendance" ADD CONSTRAINT "lesson_attendance_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_attendance" ADD CONSTRAINT "lesson_attendance_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
