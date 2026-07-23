import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects"; // 1. Import Projects

function App() {
  return (
    <main className="min-h-screen bg-neutral-950">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects /> {/* 2. Pasang Projects */}
    </main>
  );
}

export default App;