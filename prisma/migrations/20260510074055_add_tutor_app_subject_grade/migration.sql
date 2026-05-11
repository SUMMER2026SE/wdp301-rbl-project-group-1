-- CreateTable
CREATE TABLE "tutor_application_subject" (
    "tutor_application_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,

    CONSTRAINT "tutor_application_subject_pkey" PRIMARY KEY ("tutor_application_id","subject_id")
);

-- CreateTable
CREATE TABLE "tutor_application_grade" (
    "tutor_application_id" TEXT NOT NULL,
    "grade_id" TEXT NOT NULL,

    CONSTRAINT "tutor_application_grade_pkey" PRIMARY KEY ("tutor_application_id","grade_id")
);

-- AddForeignKey
ALTER TABLE "tutor_application_subject" ADD CONSTRAINT "tutor_application_subject_tutor_application_id_fkey" FOREIGN KEY ("tutor_application_id") REFERENCES "tutor_application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutor_application_subject" ADD CONSTRAINT "tutor_application_subject_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutor_application_grade" ADD CONSTRAINT "tutor_application_grade_tutor_application_id_fkey" FOREIGN KEY ("tutor_application_id") REFERENCES "tutor_application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutor_application_grade" ADD CONSTRAINT "tutor_application_grade_grade_id_fkey" FOREIGN KEY ("grade_id") REFERENCES "grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
