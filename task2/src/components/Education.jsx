import useInView from "../hooks/useInView";

export default function Education() {
  const [ref, inView] = useInView();

  return (
    <section
      id="education"
      ref={ref}
      className={`section reveal ${inView ? "in-view" : ""}`}
    >
      <h2 className="section-title">Education</h2>
      <div className="education-card">
        <p className="education-org">
          Kazakh-British Technical University (KBTU)
        </p>
        <p className="education-degree">
          BSc — Computing Technology and Software
        </p>
        <p className="education-location">Almaty, Kazakhstan</p>
      </div>
    </section>
  );
}
