import useInView from "../hooks/useInView";

const skills = [
  "React",
  "JavaScript",
  "TypeScript",
  "Python",
  "C++",
  "Swift",
  "SQL",
  "Git",
];

export default function Skills() {
  const [ref, inView] = useInView();

  return (
    <section
      id="skills"
      ref={ref}
      className={`section reveal ${inView ? "in-view" : ""}`}
    >
      <h2 className="section-title">Skills</h2>
      <ul className="skills-grid">
        {skills.map((skill, index) => (
          <li
            key={skill}
            className={`skill-chip stagger-item ${inView ? "in-view" : ""}`}
            style={{ transitionDelay: inView ? `${index * 60}ms` : "0ms" }}
          >
            {skill}
          </li>
        ))}
      </ul>
    </section>
  );
}
