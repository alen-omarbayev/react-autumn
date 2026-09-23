import "./App.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <main>
        <About />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
