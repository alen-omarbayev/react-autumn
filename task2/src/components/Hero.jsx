import avatar from "../assets/avatar-placeholder.svg";

export default function Hero() {
  return (
    <header id="top" className="hero">
      <div className="hero-bg" aria-hidden="true">
        <span className="hero-blob hero-blob-1" />
        <span className="hero-blob hero-blob-2" />
      </div>

      <div className="hero-text">
        <p className="hero-eyebrow hero-anim" style={{ animationDelay: "0ms" }}>
          Hi, I'm
        </p>
        <h1 className="hero-anim" style={{ animationDelay: "90ms" }}>
          Alen Omarbayev
        </h1>
        <p className="hero-role hero-anim" style={{ animationDelay: "180ms" }}>
          Software Developer &amp; Computing Technology Student
        </p>
        <p className="hero-tagline hero-anim" style={{ animationDelay: "270ms" }}>
          I'm a Computing Technology and Software student at KBTU, passionate
          about building modern web applications and exploring new
          technologies.
        </p>
        <p className="hero-current hero-anim" style={{ animationDelay: "350ms" }}>
          <span>Currently:</span>
          <strong>Web Developer / Content Manager at LG Kazakhstan</strong>
        </p>
        <div className="hero-actions hero-anim" style={{ animationDelay: "440ms" }}>
          <a className="btn btn-primary" href="#contact">
            Contact Me
          </a>
          <a
            className="btn btn-ghost"
            href="https://github.com/alen-omarbayev"
            target="_blank"
            rel="noreferrer"
          >
            View My GitHub
          </a>
        </div>
      </div>

      <div className="hero-image hero-anim-scale" style={{ animationDelay: "150ms" }}>
        <div className="hero-image-float">
          <img src={avatar} alt="Portrait placeholder of Alen Omarbayev" />
        </div>
      </div>
    </header>
  );
}
