import useInView from "../hooks/useInView";

const contacts = [
  {
    label: "GitHub",
    value: "github.com/alen-omarbayev",
    href: "https://github.com/alen-omarbayev",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/alen-omarbayev",
    href: "https://www.linkedin.com/in/alen-omarbayev-220835350/",
  },
  {
    label: "Instagram",
    value: "@alenokoleno",
    href: "https://www.instagram.com/alenokoleno/",
  },
  { label: "Phone Number", value: "67", href: null },
];

export default function Contact() {
  const [ref, inView] = useInView();

  return (
    <section
      id="contact"
      ref={ref}
      className={`section reveal ${inView ? "in-view" : ""}`}
    >
      <h2 className="section-title">Contact</h2>
      <p className="section-text">
        Let's connect and build something interesting — only safe, public
        links here, no phone number, address, or personal email.
      </p>
      <ul className="contact-list">
        {contacts.map((c, index) => (
          <li
            key={c.label}
            className={`contact-item stagger-item ${inView ? "in-view" : ""}`}
            style={{ transitionDelay: inView ? `${index * 70}ms` : "0ms" }}
          >
            <span className="contact-label">{c.label}</span>
            {c.href ? (
              <a href={c.href} target="_blank" rel="noreferrer">
                {c.value}
              </a>
            ) : (
              <span>{c.value}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
