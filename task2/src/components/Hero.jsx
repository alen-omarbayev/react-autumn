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
          Computing Technology &amp; Software Student
        </p>
        <p className="hero-tagline hero-anim" style={{ animationDelay: "270ms" }}>
          KBTU student passionate about software and web development, building
          things with React, TypeScript, and modern tools — currently also
          working as a Content Manager / developer at LG Kazakhstan.
        </p>
        <div className="hero-actions hero-anim" style={{ animationDelay: "360ms" }}>
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
