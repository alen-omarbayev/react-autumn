import useInView from "../hooks/useInView";

export default function About() {
  const [ref, inView] = useInView();

  return (
    <section
      id="about"
      ref={ref}
      className={`section reveal ${inView ? "in-view" : ""}`}
    >
      <h2 className="section-title">About Me</h2>
      <p className="section-text">
        I'm a student at <strong>KBTU</strong> (Kazakh-British Technical
        University), studying Computing Technology and Software. I'm
        interested in software development, web development, and modern
        technologies, and I enjoy building projects that turn ideas into
        working products.
      </p>
      <p className="section-text">
        I have hands-on experience with React, JavaScript, TypeScript,
        Python, C++, Swift, and SQL. Alongside my studies, I work as a
        Content Manager / developer at <strong>LG Kazakhstan</strong>.
      </p>
    </section>
  );
}
