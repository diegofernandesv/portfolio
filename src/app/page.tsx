import About from "@/components/About/About";
import CaseStudies from "@/components/CaseStudies/CaseStudies";
import DesignArchive from "@/components/DesignArchive/DesignArchive";
import Footer from "@/components/Footer/Footer";
import Hero from "@/components/Hero/Hero";
import Nav from "@/components/Nav/Nav";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <CaseStudies />
        <About />
        <DesignArchive />
      </main>
      <Footer />
    </>
  );
}
