"use client";

import { useGetRecommendedTutorsQuery } from "@/src/features/recommendation/recommendationApi";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { TutorCard } from "./tutor-card";
import { mapRecommendedTutorResponseToTutor } from "../utils/map-tutor";
import { Spinner } from "@/src/shared/components/ui/spinner";

export function RecommendedTutors() {
  const { data, isLoading, isError } = useGetRecommendedTutorsQuery();

  if (isError) return null;

  const tutors =
    data?.data?.slice(0, 3).map(mapRecommendedTutorResponseToTutor) ?? [];

  if (!isLoading && tutors.length === 0) return null;

  return (
    <section className="mb-10 lg:mb-16">
      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-md rounded-full" />
          <div className="relative p-3 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
            <Sparkles className="size-6" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Gợi ý dành riêng cho bạn
          </h2>
          <p className="text-muted-foreground text-sm md:text-base mt-1.5 max-w-[65ch]">
            Dựa trên lịch học, mục tiêu và điểm số tương thích cao nhất từ AI
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner className="size-8" />
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {tutors.map((tutor) => (
            <motion.div
              key={tutor.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { type: "spring", stiffness: 100, damping: 20 },
                },
              }}
              className="relative group h-full"
            >
              {/* Refraction edge & Soft glow for premium feel */}
              <div className="absolute -inset-[1px] bg-gradient-to-b from-primary/30 to-transparent rounded-[0.6rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute -inset-2 bg-primary/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="relative h-full">
                <TutorCard tutor={tutor} compact />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
