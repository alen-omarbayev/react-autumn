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
  return (
    <section id="skills" className="section">
      <h2 className="section-title">Skills</h2>
      <ul className="skills-grid">
        {skills.map((skill) => (
          <li key={skill} className="skill-chip">
            {skill}
          </li>
        ))}
      </ul>
    </section>
  );
}
