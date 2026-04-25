import { useRef, useState } from 'react'
import aboutContent from './content/about.json'
import certifications from './content/certifications.json'
import experience from './content/experience.json'
import projects from './content/projects.json'
import skillGroups from './content/skills.json'

const commands = aboutContent.commands

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon-inline">
      <path
        d="M9 9h9v11H9zM6 4h9v2H8v9H6z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon-inline">
      <path
        d="M14 5h5v5M19 5l-8 8M19 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ExternalLink({ href, className = 'external-link', children }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      <span>{children}</span>
      <ExternalLinkIcon />
    </a>
  )
}

function PromptLine({ command, children }) {
  return (
    <div className="history-block">
      <div className="prompt-line">
        <span className="prompt-user">root@kali</span>
        <span className="prompt-sep">:</span>
        <span className="prompt-path">~/portfolio</span>
        <span className="prompt-dollar">$</span>
        <span>{command}</span>
      </div>
      <div className="command-output">{children}</div>
    </div>
  )
}

function CommandChip({ command, onRun }) {
  return (
    <button type="button" className="tag command-chip" onClick={() => onRun(command)}>
      {command}
    </button>
  )
}

function ContactRow({ label, children }) {
  return (
    <div className="contact-row">
      <span className="contact-label">{label}</span>
      <span className="contact-sep">:</span>
      <span className="contact-value">{children}</span>
    </div>
  )
}

function App() {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState(['help', 'about'])
  const shellRef = useRef(null)

  const scrollShellToBottom = () => {
    requestAnimationFrame(() => {
      shellRef.current?.scrollTo({ top: shellRef.current.scrollHeight, behavior: 'smooth' })
    })
  }

  const submitCommand = (rawValue) => {
    const value = rawValue.trim().toLowerCase()
    if (!value) return

    if (value === 'clear') {
      setHistory([])
      setInput('')
      requestAnimationFrame(() => {
        shellRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      })
      return
    }

    setHistory((current) => [...current, value])
    setInput('')
    scrollShellToBottom()
  }

  const outputs = {
    help: (
      <div className="stack">
        <p>Available commands:</p>
        <div className="chip-row">
          {commands.map((command) => (
            <CommandChip key={command} command={command} onRun={submitCommand} />
          ))}
        </div>
      </div>
    ),
    about: (
      <div className="stack">
        <p>{aboutContent.about.summary}</p>
        {aboutContent.about.details.map((detail) => (
          <p key={detail}>{detail}</p>
        ))}
      </div>
    ),
    experience: (
      <div className="stack">
        {experience.map((job) => (
          <article key={job.company} className="panel">
            <div className="panel-heading">
              <strong>{job.company}</strong>
              <span>{job.role}</span>
              <span>{job.period}</span>
            </div>
            {job.work.map((entry) => (
              <div key={entry.title} className="entry">
                <h3>{entry.title}</h3>
                <ul>
                  {entry.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </article>
        ))}
      </div>
    ),
    projects: (
      <div className="project-grid">
        {projects.map((project) => (
          <article key={project.name} className="panel">
            <div className="panel-heading">
              <strong>{project.name}</strong>
              <span>{project.stack}</span>
            </div>
            <p>{project.description}</p>
            <ExternalLink href={project.link}>open --repo</ExternalLink>
          </article>
        ))}
      </div>
    ),
    skills: (
      <div className="stack">
        <div>
          <p className="section-kicker">toolchain.list</p>
          <div className="chip-row">
            {skillGroups.frameworks.map((skill) => (
              <span key={skill} className="tag">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="section-kicker">systems.list</p>
          <div className="chip-row">
            {skillGroups.systems.map((skill) => (
              <span key={skill} className="tag">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
    education: (
      <article className="panel">
        <div className="panel-heading">
          <strong>{aboutContent.education.institution}</strong>
          <span>{aboutContent.education.degree}</span>
          <span>{aboutContent.education.period}</span>
        </div>
      </article>
    ),
    certs: (
      <ul>
        {certifications.map((cert) => (
          <li key={cert}>{cert}</li>
        ))}
      </ul>
    ),
    contact: (
      <div className="stack">
        <ContactRow label={aboutContent.contact.email.label}>
          <a href={aboutContent.contact.email.href}>{aboutContent.contact.email.value}</a>
        </ContactRow>
        <ContactRow label={aboutContent.contact.linkedin.label}>
          <ExternalLink href={aboutContent.contact.linkedin.href}>{aboutContent.contact.linkedin.value}</ExternalLink>
        </ContactRow>
        <ContactRow label={aboutContent.contact.github.label}>
          <ExternalLink href={aboutContent.contact.github.href}>{aboutContent.contact.github.value}</ExternalLink>
        </ContactRow>
      </div>
    ),
  }

  return (
    <div className="app-shell">
      <div className="noise" />
      <main className="layout">
        <section className="hero-shell">
          <div className="terminal-window">
            <div className="window-bar">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
              <p>kali@portfolio: ~</p>
            </div>

            <div className="hero-grid">
              <div className="hero-copy">
                <p className="eyebrow">{aboutContent.intro.eyebrow}</p>
                <h1>{aboutContent.intro.name}</h1>
                <p className="subtitle">{aboutContent.intro.headline}</p>
                <div className="chip-row">
                  {aboutContent.intro.statusTags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="quick-actions">
                  {aboutContent.intro.quickActions.map((action) => (
                    <button key={action.label} type="button" onClick={() => submitCommand(action.command)}>
                      {action.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(aboutContent.intro.copyEmailValue)}
                  >
                    <CopyIcon />
                    <span>{aboutContent.intro.copyEmailLabel}</span>
                  </button>
                </div>
              </div>

              <aside className="profile-panel">
                <img src={aboutContent.profile.image} alt={aboutContent.profile.imageAlt} className="profile-image" />
                <div className="profile-meta">
                  {aboutContent.profile.meta.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="terminal-window shell-window">
          <div className="window-bar">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
            <p>interactive resume shell</p>
          </div>

          <div className="shell-output" ref={shellRef}>
            {history.map((command, index) => (
              <PromptLine key={`${command}-${index}`} command={command}>
                {outputs[command] ?? <p>command not found: {command}. Try `help`.</p>}
              </PromptLine>
            ))}
          </div>

          <form
            className="shell-input"
            onSubmit={(event) => {
              event.preventDefault()
              submitCommand(input)
            }}
          >
            <label className="prompt-line" htmlFor="shell-command">
              <span className="prompt-user">root@kali</span>
              <span className="prompt-sep">:</span>
              <span className="prompt-path">~/portfolio</span>
              <span className="prompt-dollar">$</span>
            </label>
            <input
              id="shell-command"
              autoComplete="off"
              spellCheck="false"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="type help, projects, contact..."
            />
          </form>
        </section>

        <section className="footer-grid">
          <article className="terminal-window mini-panel">
            <div className="window-bar">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
              <p>network beacon</p>
            </div>
            <ExternalLink href={aboutContent.footer.linkHref} className="beacon-link">
              {aboutContent.footer.linkLabel}
            </ExternalLink>
            <p>{aboutContent.footer.text}</p>
          </article>

          <article className="terminal-window mini-panel image-panel">
            <div className="window-bar">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
              <p>matrix escape</p>
            </div>
            <img src={aboutContent.footer.image} alt={aboutContent.footer.imageAlt} className="matrix-image" />
          </article>
        </section>
      </main>
    </div>
  )
}

export default App
