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
        Hi! I'm Alen Omarbayev, a Computing Technology and Software student
        at Kazakh-British Technical University (KBTU).
      </p>
      <p className="section-text">
        I'm interested in software development, web technologies, UI/UX,
        product management and building useful digital products. I enjoy
        turning ideas into functional and visually appealing applications
        while constantly learning new technologies and improving my
        development skills.
      </p>
      <p className="section-text">
        Alongside my studies, I work with LG Electronics Kazakhstan, where I
        combine technical skills with website development. My work includes
        maintaining web content, working with website platforms,
        collaborating with designers and project managers, and helping
        improve digital experiences.
      </p>
      <p className="section-text">
        I'm always interested in learning something new, experimenting with
        different technologies, and working on projects that allow me to
        grow as a developer.
      </p>
    </section>
  );
}
