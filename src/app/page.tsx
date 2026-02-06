import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TemplateShowcase from "@/components/TemplateShowcase";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <TemplateShowcase />
    </main>
  );
}
