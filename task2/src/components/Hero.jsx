import avatar from "../assets/avatar-placeholder.svg";

export default function Hero() {
  return (
    <header id="top" className="hero">
      <div className="hero-text">
        <p className="hero-eyebrow">Hi, I'm</p>
        <h1>Alen Omarbayev</h1>
        <p className="hero-role">Computing Technology &amp; Software Student</p>
        <p className="hero-tagline">
          KBTU student passionate about software and web development, building
          things with React, TypeScript, and modern tools — currently also
          working as a Content Manager / developer at LG Kazakhstan.
        </p>
        <div className="hero-actions">
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
      <div className="hero-image">
        <img src={avatar} alt="Portrait placeholder of Alen Omarbayev" />
      </div>
    </header>
  );
}
