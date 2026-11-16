import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Listings from '@/components/Listings';
import Services from '@/components/Services';
import Process from '@/components/Process';
import Quote from '@/components/Quote';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ScrollFx from '@/components/ScrollFx';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Listings />
        <Services />
        <Process />
        <Quote />
        <Contact />
      </main>
      <Footer />
      <ScrollFx />
    </>
  );
}
