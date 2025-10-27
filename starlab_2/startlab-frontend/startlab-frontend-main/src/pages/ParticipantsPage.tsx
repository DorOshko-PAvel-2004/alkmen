import { Header } from "@/components/ParticipantsComponents/Header";
import { StackType } from "@/components/ParticipantsComponents/StackType";
import { Requirements } from "@/components/ParticipantsComponents/Requirements";
import { Score } from "@/components/ParticipantsComponents/Score";
import { WhatNext } from "@/components/ParticipantsComponents/WhatNext";
import { Footer } from "@/components/ParticipantsComponents/Footer";

export const ParticipantsPage = () => {
  return (
    <div className="pt-16">
      {/* общий контейнер и вертикальный ритм как на главной */}
      <div className="px-4 sm:px-6 md:px-8">
        <section className=" mx-auto">
          <Header />
        </section>

        <section className=" mx-auto mt-16 sm:mt-20">
          <StackType />
        </section>

        <section className=" mx-auto mt-16 sm:mt-20">
          <Requirements />
        </section>

        <section className=" mx-auto mt-16 sm:mt-20">
          <Score />
        </section>

        <section className=" mx-auto mt-16 sm:mt-20">
          <WhatNext />
        </section>

        <section className=" mx-auto mt-16 sm:mt-20 mb-12">
          <Footer />
        </section>
      </div>
    </div>
  );
};
