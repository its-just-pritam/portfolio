import { useMemo, useRef, useState } from 'react'
import aboutContent from './content/about.json'
import certifications from './content/certifications.json'
import experience from './content/experience.json'
import projects from './content/projects.json'
import skillGroups from './content/skills.json'

const commands = aboutContent.commands

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

function App() {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState(['help', 'about'])
  const shellRef = useRef(null)

  const outputs = useMemo(
    () => ({
      help: (
        <div>
          <p>Available commands:</p>
          <div className="chip-row">
            {commands.map((command) => (
              <span key={command} className="tag">
                {command}
              </span>
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
              <a href={project.link} target="_blank" rel="noreferrer">
                open --repo
              </a>
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
          <p>
            {aboutContent.contact.email.label.padEnd(9, ' ')}
            : <a href={aboutContent.contact.email.href}>{aboutContent.contact.email.value}</a>
          </p>
          <p>
            {aboutContent.contact.linkedin.label.padEnd(9, ' ')}
            : <a href={aboutContent.contact.linkedin.href} target="_blank" rel="noreferrer">{aboutContent.contact.linkedin.value}</a>
          </p>
          <p>
            {aboutContent.contact.github.label.padEnd(9, ' ')}
            : <a href={aboutContent.contact.github.href} target="_blank" rel="noreferrer">{aboutContent.contact.github.value}</a>
          </p>
        </div>
      ),
    }),
    [],
  )

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
    requestAnimationFrame(() => {
      shellRef.current?.scrollTo({ top: shellRef.current.scrollHeight, behavior: 'smooth' })
    })
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
                    {aboutContent.intro.copyEmailLabel}
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
            <p>interactive shell</p>
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
            <a href={aboutContent.footer.linkHref} target="_blank" rel="noreferrer" className="beacon-link">
              {aboutContent.footer.linkLabel}
            </a>
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

