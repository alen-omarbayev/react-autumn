import useInView from "../hooks/useInView";

export default function Footer() {
  const [ref, inView] = useInView(0.05);

  return (
    <footer ref={ref} className={`footer reveal ${inView ? "in-view" : ""}`}>
      <p>© 2026 Alen Omarbayev. Built with React.</p>
    </footer>
  );
}
