import Hero from "@/components/HomeComponents/Hero";
import Timeline from "@/components/HomeComponents/Timeline";
import FAQs from "@/components/HomeComponents/FAQs.tsx";
import Partners from "@/components/HomeComponents/Partners";
import News from "@/components/HomeComponents/News";

export function HomePage() {
  return (
    <>
      <Hero />
      <div className="mt-10"></div>
      <Timeline />
      <FAQs />
      <Partners />
      <News />
    </>
  );
}
