import useInView from "../hooks/useInView";

const skillGroups = [
  {
    title: "Frontend",
    items: ["React", "JavaScript", "TypeScript", "HTML", "CSS"],
  },
  {
    title: "Backend & Programming",
    items: ["Python", "C++", "Java", "Go", "SQL", "Django"],
  },
  {
    title: "Other Technologies",
    items: ["Git", "GitHub", "PostgreSQL", "REST APIs", "Figma", "Jira"],
  },
];

// Flatten to a single list first so every chip gets a unique stagger index,
// even though the chips are rendered grouped by category.
const allSkills = skillGroups.flatMap((group) => group.items);

export default function Skills() {
  const [ref, inView] = useInView();

  return (
    <section
      id="skills"
      ref={ref}
      className={`section reveal ${inView ? "in-view" : ""}`}
    >
      <h2 className="section-title">Technical Skills</h2>
      {skillGroups.map((group) => (
        <div className="skills-group" key={group.title}>
          <h3 className="skills-group-title">{group.title}</h3>
          <ul className="skills-grid">
            {group.items.map((skill) => (
              <li
                key={skill}
                className={`skill-chip stagger-item ${inView ? "in-view" : ""}`}
                style={{
                  transitionDelay: inView
                    ? `${allSkills.indexOf(skill) * 40}ms`
                    : "0ms",
                }}
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
