import { useEffect, useState } from 'react'
import { loadJaguars } from './sports.js'

const signs = [
  { name: 'Aries', dates: 'Mar 21 – Apr 19', symbol: '♈', element: 'Fire', words: 'Bold · driven · direct', note: 'The spark that gets things moving.' },
  { name: 'Taurus', dates: 'Apr 20 – May 20', symbol: '♉', element: 'Earth', words: 'Steady · loyal · grounded', note: 'A soft spot for the good things in life.' },
  { name: 'Gemini', dates: 'May 21 – Jun 20', symbol: '♊', element: 'Air', words: 'Curious · quick · expressive', note: 'Always following the next interesting thought.' },
  { name: 'Cancer', dates: 'Jun 21 – Jul 22', symbol: '♋', element: 'Water', words: 'Caring · intuitive · devoted', note: 'A natural keeper of people and places.' },
  { name: 'Leo', dates: 'Jul 23 – Aug 22', symbol: '♌', element: 'Fire', words: 'Warm · creative · confident', note: 'Brings a little sunlight into every room.' },
  { name: 'Virgo', dates: 'Aug 23 – Sep 22', symbol: '♍', element: 'Earth', words: 'Thoughtful · precise · practical', note: 'Sees the details that make the whole thing work.' },
  { name: 'Libra', dates: 'Sep 23 – Oct 22', symbol: '♎', element: 'Air', words: 'Fair · social · artful', note: 'Always looking for the beautiful balance.' },
  { name: 'Scorpio', dates: 'Oct 23 – Nov 21', symbol: '♏', element: 'Water', words: 'Focused · perceptive · loyal', note: 'Goes beneath the surface to find what matters.' },
  { name: 'Sagittarius', dates: 'Nov 22 – Dec 21', symbol: '♐', element: 'Fire', words: 'Adventurous · candid · hopeful', note: 'The horizon is always calling.' },
  { name: 'Capricorn', dates: 'Dec 22 – Jan 19', symbol: '♑', element: 'Earth', words: 'Patient · ambitious · resilient', note: 'Builds good things one step at a time.' },
  { name: 'Aquarius', dates: 'Jan 20 – Feb 18', symbol: '♒', element: 'Air', words: 'Original · open · independent', note: 'Imagines a different way forward.' },
  { name: 'Pisces', dates: 'Feb 19 – Mar 20', symbol: '♓', element: 'Water', words: 'Imaginative · gentle · empathetic', note: 'Finds meaning in the in-between.' }
]

const formatDate = date => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }).format(new Date(date))

function JaguarsTracker() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    loadJaguars(controller.signal).then(result => { setData(result); setError(false) }).catch(err => {
      if (err.name !== 'AbortError') setError(true)
    }).finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [refresh])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden) setRefresh(value => value + 1)
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const game = data?.featured
  return <section className="section jaguars-section" id="jaguars" aria-labelledby="jaguars-title">
    <div className="container">
      <div className="section-heading light-heading">
        <div><p className="eyebrow">04 / SUNDAY ENERGY</p><h2 id="jaguars-title">Duval, always.</h2><p>Keeping an eye on the Jacksonville Jaguars, wherever the week takes us.</p></div>
        <span className="team-mark" aria-hidden="true">JAX<span>↗</span></span>
      </div>
      <div className="scoreboard">
        <div className="scoreboard-main">
          <div className="score-topline"><span className="live-dot" /> JAGUARS TRACKER <button className="refresh-button" onClick={() => setRefresh(value => value + 1)} disabled={loading} aria-label="Refresh Jaguars data">↻ Refresh</button></div>
          {loading && !data ? <p className="feed-message" role="status">Loading the latest from Jacksonville…</p> : error && !data ? <div className="feed-message" role="alert"><p>The live feed is unavailable right now.</p><a href="https://www.espn.com/nfl/team/_/name/jax/jacksonville-jaguars" target="_blank" rel="noreferrer">Check Jaguars scores on ESPN ↗</a></div> : game ? <>
            <p className="game-kicker">{game.state === 'in' ? 'GAME IN PROGRESS' : game.state === 'post' ? 'LATEST RESULT' : 'UP NEXT'}</p>
            <div className="matchup"><div><strong>JAX</strong><span>Jacksonville Jaguars</span></div><b>vs</b><div><strong>{game.opponentAbbreviation}</strong><span>{game.opponent}</span></div></div>
            <div className="game-detail">{game.state === 'pre' ? formatDate(game.date) : `${game.jaguarsScore ?? '–'} – ${game.opponentScore ?? '–'} · ${game.status}`} · {game.home ? 'Home' : 'Away'}</div>
            <a className="score-link" href={game.link} target="_blank" rel="noreferrer">Game details <span>↗</span></a>
          </> : !loading && <p className="feed-message">No Jaguars game is listed right now. Check back when the schedule updates.</p>}
        </div>
        <div className="scoreboard-side">
          <p className="side-label">SEASON SNAPSHOT</p>
          <div className="side-stat"><span>Record</span><strong>{data?.record || '—'}</strong></div>
          <div className="side-stat"><span>Division rank</span><strong>{data?.divisionRank === '—' ? '—' : `#${data?.divisionRank || '—'}`}</strong></div>
          <div className="side-footer">{data?.updatedAt ? `Updated ${new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(data.updatedAt)}` : 'Live data from ESPN'}<br /><a href="https://www.espn.com/nfl/standings" target="_blank" rel="noreferrer">Full NFL standings ↗</a></div>
        </div>
      </div>
      {error && data && <p className="feed-warning" role="status">Refresh failed; showing the last loaded data.</p>}
      <p className="feed-credit">Scores and standings provided by ESPN. Live data may be delayed.</p>
    </div>
  </section>
}

function Zodiac() {
  const [selected, setSelected] = useState(signs[0])
  return <section className="section zodiac-section" id="zodiac" aria-labelledby="zodiac-title"><div className="container zodiac-layout">
    <div className="zodiac-intro"><p className="eyebrow">03 / LOOK TO THE STARS</p><h2 id="zodiac-title">A little cosmic curiosity.</h2><p>Browse the zodiac as a collection of personalities and possibilities. Pick a sign to get to know its vibe.</p><p className="zodiac-disclaimer">For fun and reflection, not prediction.</p></div>
    <div className="zodiac-card"><div className="sign-grid" role="group" aria-label="Choose a zodiac sign">{signs.map(sign => <button type="button" key={sign.name} className={selected.name === sign.name ? 'sign-button selected' : 'sign-button'} onClick={() => setSelected(sign)} aria-pressed={selected.name === sign.name}><span>{sign.symbol}</span><small>{sign.name}</small></button>)}</div><div className="sign-detail" aria-live="polite"><span className="sign-big" aria-hidden="true">{selected.symbol}</span><div><p className="eyebrow">{selected.element} SIGN · {selected.dates}</p><h3>{selected.name}</h3><p className="sign-words">{selected.words}</p><p>{selected.note}</p></div></div></div>
  </div></section>
}

export default function App() {
  return <>
    <header className="site-header"><div className="container nav-inner"><a className="wordmark" href="#home" aria-label="Cristobal Gonzalez, back to top">CG<span>.</span></a><nav aria-label="Main navigation"><a href="#about">About</a><a href="#off-the-clock">Off the clock</a><a href="#zodiac">Zodiac</a><a href="#jaguars">Jaguars</a></nav></div></header>
    <main>
      <section className="hero" id="home"><div className="container hero-grid"><div className="hero-copy"><p className="eyebrow">HELLO, I'M CRISTOBAL</p><h1>Making things work.<br /><em>Making room to wander.</em></h1><p className="hero-lede">I’m Cristobal Gonzalez — an Engineering Program Manager for Supplier Quality in medical device engineering. Off the clock, you’ll find me on a trail, hanging out with Martini and Tux, or cheering on the Jaguars.</p><a className="primary-link" href="#about">Get to know me <span>↗</span></a></div><div className="hero-art" aria-hidden="true"><div className="sun" /><div className="hill hill-back" /><div className="hill hill-front" /><div className="trail" /><div className="art-label">ENGINEER / RUNNER / CAT PERSON</div></div></div><div className="container hero-bottom"><span>BUILT WITH CURIOSITY</span><span>↓ SCROLL TO EXPLORE</span></div></section>
      <section className="section about-section" id="about" aria-labelledby="about-title"><div className="container about-grid"><div><p className="eyebrow">01 / WHAT I DO</p><h2 id="about-title">Details matter.<br /><em>So do people.</em></h2></div><div className="about-body"><p className="about-lead">I work at the intersection of engineering, quality, and collaboration.</p><p>As an Engineering Program Manager for Supplier Quality in the medical device field, my work centers on bringing people and processes together around products where care and precision matter.</p><p>That same curiosity about how things work follows me well beyond the office.</p><div className="about-tags"><span>Medical devices</span><span>Supplier quality</span><span>Program management</span></div></div></div></section>
      <section className="section life-section" id="off-the-clock" aria-labelledby="life-title"><div className="container"><div className="section-heading"><div><p className="eyebrow">02 / OFF THE CLOCK</p><h2 id="life-title">The good stuff outside work.</h2></div><p>Fresh air, four paws, and the little rituals that make a day.</p></div><div className="life-grid"><article className="life-card running-card"><div className="card-art trail-art" aria-hidden="true"><span className="trail-sun" /><span className="trail-ridge one" /><span className="trail-ridge two" /><span className="trail-line" /></div><div className="life-card-copy"><span className="card-number">01 / THE OUTDOORS</span><h3>Trail running</h3><p>Some of my best thinking happens with dirt underfoot and a path ahead. Trail running is my way to reset, explore, and keep moving.</p></div></article><article className="life-card cats-card"><div className="card-art cats-art" aria-hidden="true"><span className="cat cat-one"><i /><b /></span><span className="cat cat-two"><i /><b /></span></div><div className="life-card-copy"><span className="card-number">02 / THE HOME TEAM</span><h3>Martini & Tux</h3><p>Meet the two cats who make home a little more entertaining. Martini and Tux are part of my everyday crew.</p><div className="cat-names"><span>✦ Martini</span><span>✦ Tux</span></div></div></article></div></div></section>
      <Zodiac />
      <JaguarsTracker />
    </main>
    <footer className="site-footer"><div className="container footer-inner"><div><a className="wordmark" href="#home">CG<span>.</span></a><p>Curious by nature. Always moving forward.</p></div><a href="#home">Back to top ↑</a><span>© {new Date().getFullYear()} Cristobal Gonzalez</span></div></footer>
  </>
}
