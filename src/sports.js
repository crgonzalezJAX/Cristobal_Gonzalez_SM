const BASE = 'https://site.api.espn.com/apis'
const JAGUARS_ID = '30'

async function getJson(url, signal) {
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error(`Sports feed returned ${response.status}`)
  return response.json()
}

function flattenStandings(group) {
  return [ ...(group?.standings?.entries || []), ...(group?.children || []).flatMap(flattenStandings) ]
}

function stat(entry, name) {
  const value = entry?.stats?.find(item => item.name === name || item.abbreviation === name)
  return value?.displayValue ?? (value?.value != null ? String(value.value) : '—')
}

function normalizeGame(event) {
  const competition = event?.competitions?.[0]
  const competitors = competition?.competitors || []
  const jaguars = competitors.find(item => item.team?.id === JAGUARS_ID)
  const opponent = competitors.find(item => item.team?.id !== JAGUARS_ID)
  if (!jaguars || !opponent) return null
  return {
    id: event.id,
    date: event.date,
    status: event.status?.type?.shortDetail || event.status?.type?.description || 'Scheduled',
    state: event.status?.type?.state || 'pre',
    home: jaguars.homeAway === 'home',
    jaguarsScore: jaguars.score,
    opponentScore: opponent.score,
    opponent: opponent.team?.displayName || 'Opponent',
    opponentAbbreviation: opponent.team?.abbreviation || 'OPP',
    link: event.links?.find(link => link.rel?.includes('summary'))?.href || 'https://www.espn.com/nfl/team/_/name/jax/jacksonville-jaguars'
  }
}

export async function loadJaguars(signal) {
  const [scoreboardResult, scheduleResult, standingsResult] = await Promise.allSettled([
    getJson(`${BASE}/site/v2/sports/football/nfl/scoreboard`, signal),
    getJson(`${BASE}/site/v2/sports/football/nfl/teams/jax/schedule`, signal),
    getJson(`${BASE}/v2/sports/football/nfl/standings`, signal)
  ])
  if ([scoreboardResult, scheduleResult, standingsResult].every(result => result.status === 'rejected')) {
    throw new Error('Sports feeds unavailable')
  }
  const scoreboard = scoreboardResult.status === 'fulfilled' ? scoreboardResult.value : {}
  const schedule = scheduleResult.status === 'fulfilled' ? scheduleResult.value : {}
  const standings = standingsResult.status === 'fulfilled' ? standingsResult.value : {}
  const games = [...new Map([...(schedule.events || []), ...(scoreboard.events || [])].map(event => [event.id, event])).values()]
    .map(normalizeGame).filter(Boolean).sort((a, b) => new Date(a.date) - new Date(b.date))
  const now = Date.now()
  const live = games.find(game => game.state === 'in')
  const next = games.find(game => new Date(game.date).getTime() >= now - 3 * 60 * 60 * 1000 && game.state === 'pre')
  const latest = [...games].reverse().find(game => game.state === 'post')
  const featured = live || next || latest || null
  const entry = flattenStandings(standings).find(item => item.team?.id === JAGUARS_ID)
  const scoreboardTeam = (scoreboard.events || []).flatMap(event => event.competitions?.[0]?.competitors || []).find(item => item.team?.id === JAGUARS_ID)
  const summaryRecord = scoreboardTeam?.records?.find(record => record.type === 'total')?.summary
  return {
    featured,
    record: entry ? `${stat(entry, 'wins')}-${stat(entry, 'losses')}${stat(entry, 'ties') !== '0' && stat(entry, 'ties') !== '—' ? `-${stat(entry, 'ties')}` : ''}` : summaryRecord || '—',
    divisionRank: entry ? stat(entry, 'divisionRank') : '—',
    games: games.filter(game => game.id !== featured?.id).slice(-5).reverse(),
    updatedAt: new Date()
  }
}
