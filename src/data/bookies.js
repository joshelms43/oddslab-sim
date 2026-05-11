// ── BOOKIE CONFIG ──────────────────────────────────────────
export const BOOKIES = {
  sportsbet: {
    key: 'sportsbet', name: 'Sportsbet', color: '#E8501A',
    offer: 'Your safety net — sign up free',
    body: 'Sign up to Sportsbet for free. You\'ll deposit only what you need for each hedge bet — right before you place it.',
    minDep: 0, bonusMul: 0,
  },
  tab: {
    key: 'tab', name: 'TAB', color: '#0057A8',
    offer: 'Deposit $50 → $100 bonus bet',
    body: 'TAB gives you a $100 bonus bet when you deposit $50.',
    minDep: 50, bonusMul: 2,
  },
  ladbrokes: {
    key: 'ladbrokes', name: 'Ladbrokes', color: '#E30613',
    offer: 'Deposit $50 → $150 bonus bet',
    body: 'Ladbrokes gives you a $150 bonus bet when you deposit $50.',
    minDep: 50, bonusMul: 3,
  },
  neds: {
    key: 'neds', name: 'Neds', color: '#FF8C00',
    offer: 'Deposit $100 → $100 bonus bet',
    body: 'Neds matches your $100 deposit with a $100 bonus bet.',
    minDep: 100, bonusMul: 1,
  },
  betr: {
    key: 'betr', name: 'Betr', color: '#FF6B35',
    offer: 'Deposit $50 → $200 bonus bet',
    body: 'Betr gives you a massive $200 bonus bet when you deposit just $50.',
    minDep: 50, bonusMul: 4,
  },
}

// ── ODDS DATA ──────────────────────────────────────────────
export const ODDS = {
  sportsbet: {
    afl: [
      { id:'sb-a1', sport:'AFL', team1:'Collingwood', team2:'Carlton',    time:'Sat 3:20pm · MCG',        t1:2.75, t2:1.58 },
      { id:'sb-a2', sport:'AFL', team1:'Sydney Swans', team2:'GWS Giants', time:'Sat 5:40pm · SCG',        t1:1.85, t2:2.10 },
      { id:'sb-a3', sport:'AFL', team1:'Melbourne',   team2:'Hawthorn',   time:'Sun 1:10pm · MCG',        t1:1.50, t2:2.70 },
    ],
    nrl: [
      { id:'sb-n1', sport:'NRL', team1:'Broncos', team2:'Panthers', time:'Fri 7:50pm · Suncorp',    t1:2.10, t2:1.82 },
      { id:'sb-n2', sport:'NRL', team1:'Storm',   team2:'Roosters', time:'Sun 4:05pm · AAMI Park',  t1:1.60, t2:2.40 },
    ],
    nba: [
      { id:'sb-b1', sport:'NBA', team1:'Lakers', team2:'Thunder', time:'Mon 11:00am AEST', t1:2.05, t2:1.82 },
      { id:'sb-b2', sport:'NBA', team1:'76ers',  team2:'Knicks',  time:'Mon 9:30am AEST',  t1:1.90, t2:1.95 },
    ],
    mlb: [
      { id:'sb-m1', sport:'MLB', team1:'Yankees', team2:'Red Sox', time:'Sun 9:10am AEST', t1:1.65, t2:2.25 },
      { id:'sb-m2', sport:'MLB', team1:'Dodgers', team2:'Braves',  time:'Mon 6:00am AEST', t1:1.55, t2:2.50 },
    ],
  },
  tab: {
    afl: [
      { id:'t-a1', sport:'AFL', team1:'Collingwood', team2:'Carlton',    time:'Sat 3:20pm · MCG',        t1:2.90, t2:1.50 },
      { id:'t-a2', sport:'AFL', team1:'Sydney Swans', team2:'GWS Giants', time:'Sat 5:40pm · SCG',        t1:1.92, t2:2.05 },
      { id:'t-a3', sport:'AFL', team1:'Melbourne',   team2:'Hawthorn',   time:'Sun 1:10pm · MCG',        t1:1.55, t2:2.65 },
    ],
    nrl: [
      { id:'t-n1', sport:'NRL', team1:'Broncos', team2:'Panthers', time:'Fri 7:50pm · Suncorp',   t1:2.25, t2:1.75 },
      { id:'t-n2', sport:'NRL', team1:'Storm',   team2:'Roosters', time:'Sun 4:05pm · AAMI Park', t1:1.65, t2:2.35 },
    ],
    nba: [
      { id:'t-b1', sport:'NBA', team1:'Lakers', team2:'Thunder', time:'Mon 11:00am AEST', t1:2.15, t2:1.78 },
      { id:'t-b2', sport:'NBA', team1:'76ers',  team2:'Knicks',  time:'Mon 9:30am AEST',  t1:1.95, t2:1.90 },
    ],
    mlb: [
      { id:'t-m1', sport:'MLB', team1:'Yankees', team2:'Red Sox', time:'Sun 9:10am AEST', t1:1.68, t2:2.20 },
    ],
  },
  ladbrokes: {
    afl: [
      { id:'l-a1', sport:'AFL', team1:'Collingwood', team2:'Carlton',  time:'Sat 3:20pm · MCG',  t1:2.95, t2:1.48 },
      { id:'l-a2', sport:'AFL', team1:'Melbourne',   team2:'Hawthorn', time:'Sun 1:10pm · MCG',  t1:1.58, t2:2.60 },
    ],
    nrl: [
      { id:'l-n1', sport:'NRL', team1:'Broncos', team2:'Panthers', time:'Fri 7:50pm · Suncorp', t1:2.30, t2:1.72 },
    ],
    nba: [
      { id:'l-b1', sport:'NBA', team1:'Lakers', team2:'Thunder', time:'Mon 11:00am AEST', t1:2.10, t2:1.80 },
    ],
    mlb: [
      { id:'l-m1', sport:'MLB', team1:'Yankees', team2:'Red Sox', time:'Sun 9:10am AEST', t1:1.70, t2:2.18 },
    ],
  },
  neds: {
    afl: [
      { id:'n-a1', sport:'AFL', team1:'Collingwood',  team2:'Carlton',    time:'Sat 3:20pm · MCG', t1:2.88, t2:1.52 },
      { id:'n-a2', sport:'AFL', team1:'Sydney Swans', team2:'GWS Giants', time:'Sat 5:40pm · SCG', t1:1.94, t2:2.03 },
    ],
    nrl: [{ id:'n-n1', sport:'NRL', team1:'Broncos', team2:'Panthers', time:'Fri 7:50pm · Suncorp', t1:2.22, t2:1.76 }],
    nba: [{ id:'n-b1', sport:'NBA', team1:'Lakers',  team2:'Thunder',  time:'Mon 11:00am AEST',     t1:2.12, t2:1.79 }],
    mlb: [{ id:'n-m1', sport:'MLB', team1:'Dodgers', team2:'Braves',   time:'Mon 6:00am AEST',      t1:1.60, t2:2.42 }],
  },
  betr: {
    afl: [
      { id:'b-a1', sport:'AFL', team1:'Collingwood',  team2:'Carlton',    time:'Sat 3:20pm · MCG',        t1:2.92, t2:1.51 },
      { id:'b-a2', sport:'AFL', team1:'Sydney Swans', team2:'GWS Giants', time:'Sat 5:40pm · SCG',        t1:1.94, t2:2.02 },
    ],
    nrl: [{ id:'b-n1', sport:'NRL', team1:'Storm',  team2:'Roosters', time:'Sun 4:05pm · AAMI Park', t1:1.67, t2:2.32 }],
    nba: [{ id:'b-b1', sport:'NBA', team1:'76ers',  team2:'Knicks',   time:'Mon 9:30am AEST',         t1:1.97, t2:1.88 }],
    mlb: [{ id:'b-m1', sport:'MLB', team1:'Yankees', team2:'Red Sox', time:'Sun 9:10am AEST',         t1:1.71, t2:2.16 }],
  },
}

// ── CALC ───────────────────────────────────────────────────
export function calcProfit(dep, bonus, backOdds, hedgeOdds) {
  const bonusWin = bonus * (backOdds - 1)
  const depWin = dep * backOdds
  const totalBack = bonusWin + depWin
  const hedge = totalBack / hedgeOdds
  return {
    hedge: +hedge.toFixed(2),
    profit: +(totalBack - dep - hedge).toFixed(2),
    totalBack: +totalBack.toFixed(2),
  }
}

export function getAllOpps(bookieKey, deposit, bonus) {
  const sports = ['afl', 'nrl', 'nba', 'mlb']
  const all = []
  sports.forEach(sp => {
    const bookieGames = ODDS[bookieKey]?.[sp] || []
    const sbGames = ODDS.sportsbet?.[sp] || []
    bookieGames.forEach(bg => {
      const sg = sbGames.find(g => g.team1 === bg.team1 && g.team2 === bg.team2)
      if (!sg) return
      const p1 = calcProfit(deposit, bonus, bg.t1, sg.t2).profit
      const p2 = calcProfit(deposit, bonus, bg.t2, sg.t1).profit
      const useT1 = p1 >= p2
      const r = calcProfit(deposit, bonus, useT1 ? bg.t1 : bg.t2, useT1 ? sg.t2 : sg.t1)
      all.push({
        id: bg.id, sport: bg.sport, team1: bg.team1, team2: bg.team2, time: bg.time,
        backTeam: useT1 ? bg.team1 : bg.team2,
        backOdds: useT1 ? bg.t1 : bg.t2,
        hedgeTeam: useT1 ? bg.team2 : bg.team1,
        hedgeOdds: useT1 ? sg.t2 : sg.t1,
        bonusStake: bonus, depStake: deposit,
        hedge: r.hedge,
        profit: Math.max(0, r.profit),
        totalBack: r.totalBack,
        backBookie: BOOKIES[bookieKey].name,
        srcBookie: bookieKey,
      })
    })
  })
  return all.sort((a, b) => b.profit - a.profit)
}

export const fmt = n => '$' + Math.abs(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
