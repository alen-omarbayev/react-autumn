import useInView from "../hooks/useInView";

const likes = [
  {
    title: "Development",
    text: "Building applications and experimenting with new technologies.",
  },
  {
    title: "UI/UX",
    text: "Creating interfaces that are both visually appealing and easy to use.",
  },
  {
    title: "Problem Solving",
    text: "Breaking complex problems into smaller, practical solutions.",
  },
  {
    title: "Continuous Learning",
    text: "Exploring new technologies and improving my development skills.",
  },
];

export default function Interests() {
  const [ref, inView] = useInView();

  return (
    <section
      id="interests"
      ref={ref}
      className={`section reveal ${inView ? "in-view" : ""}`}
    >
      <h2 className="section-title">What I Like</h2>
      <ul className="likes-grid">
        {likes.map((like, index) => (
          <li
            key={like.title}
            className={`like-card stagger-item ${inView ? "in-view" : ""}`}
            style={{ transitionDelay: inView ? `${index * 80}ms` : "0ms" }}
          >
            <h3>{like.title}</h3>
            <p>{like.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
