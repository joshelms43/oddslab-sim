import { useState, useEffect, useRef, useCallback } from 'react'
import { BOOKIES, ODDS, getAllOpps, fmt } from './data/bookies.js'

// ── ONBOARDING SLIDES ──────────────────────────────────────
const obBox = { background:'var(--gb)', border:'1px solid var(--gbr)', borderRadius:'var(--r)', padding:'13px 15px', textAlign:'left', fontSize:13, color:'var(--t1)', lineHeight:1.6 }
const bankCard = { background:'var(--s1)', border:'1px solid var(--gbr)', borderRadius:14, padding:'14px 28px', display:'inline-block', marginBottom:20, marginTop:8 }

// ── STYLES ─────────────────────────────────────────────────
const styles = {
  appWrap: { display:'flex', flexDirection:'column', minHeight:'100vh', background:'var(--bg)' },
  statusBar: { background:'var(--s1)', borderBottom:'1px solid var(--b1)', padding:'10px 18px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:50 },
  sLogo: { fontSize:15, fontWeight:700 },
  sRight: { display:'flex', alignItems:'center', gap:14 },
  sPill: { fontSize:10, fontWeight:600, padding:'3px 8px', borderRadius:12, background:'var(--gb)', color:'var(--g)', border:'1px solid var(--gbr)' },
  appTabs: { background:'var(--s1)', borderBottom:'1px solid var(--b1)', display:'flex', overflowX:'auto' },
  appTab: { padding:'10px 16px', fontSize:12, fontWeight:600, color:'var(--t3)', cursor:'pointer', borderBottom:'2px solid transparent', whiteSpace:'nowrap', transition:'all .15s' },
  appTabOn: { color:'var(--t1)', borderBottomColor:'var(--g)' },
  atBadge: { fontSize:9, fontWeight:700, background:'var(--g)', color:'#0A0D0F', padding:'1px 5px', borderRadius:10, marginLeft:4 },
  bkHdr: { padding:'13px 18px', display:'flex', alignItems:'center', justifyContent:'space-between' },
  bkLogo: { fontSize:19, fontWeight:800, color:'white', letterSpacing:-.5 },
  spTab: { padding:'9px 15px', fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.5)', cursor:'pointer', borderBottom:'2px solid transparent', whiteSpace:'nowrap' },
  spTabOn: { color:'white', borderBottomColor:'white' },
  oBtn: { background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:'var(--rs)', padding:'9px 11px', cursor:'pointer', textAlign:'center', transition:'all .15s' },
  oBtnHighlight: { background:'rgba(0,230,118,0.15)', borderColor:'var(--g)', animation:'oBtnPulse 1.5s infinite' },
  scanStrip: { padding:'10px 18px', background:'#0F0F0F', borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', bottom:0 },
  btnScan: { background:'var(--g)', color:'#0A0D0F', borderRadius:'var(--rs)', padding:'8px 15px', fontSize:12, fontWeight:700 },
  locked: { display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px 22px', textAlign:'center', minHeight:260 },
  lockedH: { fontSize:17, fontWeight:700, marginBottom:7 },
  lockedP: { fontSize:13, color:'var(--t2)', marginBottom:20, lineHeight:1.6, maxWidth:270 },
  btnSignup: { background:'var(--g)', color:'#0A0D0F', borderRadius:'var(--r)', padding:'10px 26px', fontSize:13, fontWeight:700 },
  scCard: { background:'var(--s1)', border:'1px solid var(--b1)', borderRadius:'var(--r)', padding:'12px 15px', marginBottom:8, display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 },
  scCardBest: { borderColor:'var(--g)' },
  spBadge: { fontSize:9, fontWeight:700, padding:'2px 6px', borderRadius:3, display:'inline-block', marginBottom:4 },
  spAfl: { background:'rgba(0,230,118,0.15)', color:'var(--g)' },
  spNrl: { background:'rgba(100,181,246,0.15)', color:'#64B5F6' },
  spNba: { background:'rgba(206,147,216,0.15)', color:'#CE93D8' },
  spMlb: { background:'rgba(255,215,64,0.15)', color:'#FFD740' },
  btnGoto: { background:'var(--g)', color:'#0A0D0F', borderRadius:'var(--rs)', padding:'6px 13px', fontSize:11, fontWeight:700 },
  moOv: { position:'fixed', inset:0, background:'rgba(0,0,0,0.82)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:20 },
  moBox: { background:'var(--s1)', border:'1px solid var(--b2)', borderRadius:14, padding:22, width:'100%', maxWidth:370 },
  moTag: { fontSize:10, fontWeight:700, color:'var(--g)', textTransform:'uppercase', letterSpacing:.6, marginBottom:6 },
  moH: { fontSize:18, fontWeight:700, marginBottom:6 },
  moP: { fontSize:13, color:'var(--t2)', lineHeight:1.6, marginBottom:14 },
  offerBox: { background:'var(--gb)', border:'1px solid var(--gbr)', borderRadius:'var(--r)', padding:'12px 14px', marginBottom:14 },
  moLabel: { fontSize:12, color:'var(--t2)', display:'block', marginBottom:5 },
  moInput: { width:'100%', background:'var(--s2)', border:'1px solid var(--b2)', borderRadius:'var(--rs)', color:'var(--t1)', fontSize:15, padding:'9px 11px', outline:'none', marginBottom:12 },
  moRow: { display:'flex', gap:8 },
  btnGreen: { background:'var(--g)', color:'#0A0D0F', borderRadius:'var(--r)', fontSize:13, fontWeight:700, cursor:'pointer', border:'none', display:'inline-flex', alignItems:'center', justifyContent:'center', flex:1 },
  btnGhost: { background:'var(--s2)', color:'var(--t2)', border:'1px solid var(--b2)', borderRadius:'var(--r)', padding:'10px 14px', fontSize:13, cursor:'pointer' },
  slipOv: { position:'fixed', inset:0, background:'rgba(0,0,0,0.82)', zIndex:300, display:'flex', alignItems:'flex-end', justifyContent:'center' },
  slip: { background:'var(--s1)', borderTop:'1px solid var(--b2)', borderRadius:'14px 14px 0 0', width:'100%', maxWidth:480, padding:20 },
  slipHandle: { width:34, height:3, background:'var(--s3)', borderRadius:2, margin:'0 auto 14px' },
  slipTeam: { background:'var(--s2)', border:'1px solid var(--b1)', borderRadius:'var(--rs)', padding:'9px 11px', cursor:'pointer' },
  slipTeamSel: { borderColor:'var(--g)', background:'var(--gb)' },
  stakeInp: { flex:1, background:'var(--s2)', border:'1px solid var(--b2)', borderRadius:'var(--rs)', color:'var(--t1)', fontSize:16, padding:'8px 11px', outline:'none' },
  retBox: { background:'var(--gb)', border:'1px solid var(--gbr)', borderRadius:'var(--rs)', padding:'9px 13px', marginBottom:11, display:'flex', justifyContent:'space-between', alignItems:'center' },
  pfOv: { position:'fixed', inset:0, background:'rgba(0,0,0,0.93)', zIndex:400, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', textAlign:'center', padding:24, gap:0 },
  coachWrap: { position:'fixed', bottom:18, right:18, zIndex:600, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8 },
  coachPopup: { background:'var(--s1)', border:'1px solid var(--gbr)', borderRadius:12, padding:'14px 15px', width:265, boxShadow:'0 14px 40px rgba(0,0,0,0.5)' },
  coachBtn: { width:42, height:42, background:'var(--g)', color:'#0A0D0F', borderRadius:'50%', fontSize:17, cursor:'pointer', boxShadow:'0 4px 14px rgba(0,230,118,0.4)', display:'flex', alignItems:'center', justifyContent:'center', border:'none' },
  obWrap: { display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', padding:'32px 20px', textAlign:'center', background:'radial-gradient(ellipse at 50% 0%,rgba(0,230,118,0.07) 0%,transparent 60%)' },
  obLogo: { fontSize:22, fontWeight:800, marginBottom:28 },
  obSlide: { width:'100%', maxWidth:500, marginBottom:20 },
  obIcon: { fontSize:44, marginBottom:16 },
  obH: { fontSize:24, fontWeight:800, lineHeight:1.2, marginBottom:10, letterSpacing:-.3 },
  obP: { fontSize:14, color:'var(--t2)', lineHeight:1.75, marginBottom:16, textAlign:'left' },
  obBox: { background:'var(--gb)', border:'1px solid var(--gbr)', borderRadius:'var(--r)', padding:'13px 15px', textAlign:'left', fontSize:13, color:'var(--t1)', lineHeight:1.6 },
  obNav: { display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', maxWidth:500, gap:12 },
  obDot: { width:7, height:7, borderRadius:'50%', background:'var(--s3)', transition:'background .2s' },
  obSkip: { background:'none', border:'none', color:'var(--t3)', fontSize:12, cursor:'pointer', padding:8 },
  obNxt: { background:'var(--g)', color:'#0A0D0F', border:'none', borderRadius:'var(--r)', padding:'11px 22px', fontSize:14, fontWeight:700, cursor:'pointer' },
  bankCard: { background:'var(--s1)', border:'1px solid var(--gbr)', borderRadius:14, padding:'14px 28px', display:'inline-block', marginBottom:20, marginTop:8 },
  bankLabel: { fontSize:10, color:'var(--t2)', textTransform:'uppercase', letterSpacing:.6, marginBottom:4 },
  bankAmt: { fontSize:36, fontWeight:700, fontFamily:'var(--mono)', color:'var(--g)' },
  bsWrap: { display:'flex', justifyContent:'center', minHeight:'100vh', padding:'28px 20px' },
  bsInner: { maxWidth:540, width:'100%' },
  dayPill: { display:'inline-block', fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, background:'var(--gb)', color:'var(--g)', border:'1px solid var(--gbr)', marginBottom:20 },
  bsH: { fontSize:20, fontWeight:700, marginBottom:6 },
  bsP: { fontSize:13, color:'var(--t2)', lineHeight:1.6, marginBottom:20 },
  bsGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 },
  bc: { background:'var(--s1)', border:'1.5px solid var(--b1)', borderRadius:'var(--r)', padding:14, cursor:'pointer', transition:'all .15s', position:'relative' },
  bcSel: { borderColor:'var(--g)', background:'var(--gb)' },
  bcName: { fontSize:15, fontWeight:800, marginBottom:3 },
  bcOffer: { fontSize:11, color:'var(--t2)', marginBottom:6, lineHeight:1.4 },
  bcBonus: { fontSize:12, fontWeight:600, color:'var(--g)' },
  bcCheck: { position:'absolute', top:10, right:10, width:16, height:16, background:'var(--g)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:'#0A0D0F' },
  wdAcc: { background:'var(--s1)', border:'1px solid var(--b1)', borderRadius:'var(--r)', padding:'13px 15px', display:'flex', alignItems:'center', justifyContent:'space-between' },
  wdTotalBox: { background:'var(--gb)', border:'1px solid var(--gbr)', borderRadius:'var(--r)', padding:'15px 18px', marginBottom:20, display:'flex', justifyContent:'space-between', alignItems:'center' },
}


const OB_SLIDES = [
  {
    icon: '👋',
    title: <>Welcome to <em style={{fontStyle:'normal',color:'var(--g)'}}>OddsLab</em></>,
    body: <>This simulator walks you through a completely legal way to make <strong>guaranteed money</strong> from online bookmakers — even if you've never placed a bet in your life.</>,
    extra: <div style={bankCard}><div style={{fontSize:10,color:'var(--t2)',textTransform:'uppercase',letterSpacing:.6,marginBottom:4}}>Your bankroll to get started</div><div style={{fontSize:36,fontWeight:700,fontFamily:'var(--mono)',color:'var(--g)'}}>$1,000.00</div></div>,
  },
  {
    icon: '🎁',
    title: <>Bookies are giving away <em style={{fontStyle:'normal',color:'var(--g)'}}>free money</em></>,
    body: <>Every Australian bookmaker has a welcome offer. Deposit a small amount and they hand you a <strong>bonus bet</strong> on top — free money just for joining. TAB, Ladbrokes, Neds, Betr — they all do it.</>,
    extra: <div style={obBox}><p>For example: deposit <strong>$50</strong> with TAB and they give you a <strong>$100 bonus bet</strong>. You now have $150 to play with — but you only put in $50.</p></div>,
  },
  {
    icon: '⚠️',
    title: <>The catch — you <em style={{fontStyle:'normal',color:'var(--g)'}}>can't just withdraw it</em></>,
    body: <>Here's the problem. Bookmakers aren't silly — they don't let you pocket the bonus bet directly. There are two rules that make it tricky:</>,
    extra: <>
      <div style={obBox}><p><strong>Rule 1:</strong> You can't withdraw a bonus bet. You have to <strong>place it as a real bet first</strong> before any money can leave the account.</p></div>
      <div style={{...obBox, marginTop: 8}}><p><strong>Rule 2:</strong> If your bonus bet wins, you only get the <strong>profit</strong> — not the original stake back. So a $100 bonus bet at odds of 3.00 returns $200, not $300.</p></div>
    </>,
  },
  {
    icon: '🤔',
    title: <>So what's the <em style={{fontStyle:'normal',color:'var(--g)'}}>problem?</em></>,
    body: <>If you just place the bonus bet on a team and hope they win, you might lose. And if you lose, the bonus is gone — you get nothing.</>,
    extra: <div style={obBox}>
      <p style={{marginBottom:10}}>You deposit $50 → get a $100 bonus bet → bet it on Carlton → Carlton loses → <strong>you walk away with $0 profit</strong>.</p>
      <p>The bookie got you to deposit $50 and kept the lot. That's what they're counting on.</p>
    </div>,
  },
  {
    icon: '💡',
    title: <>The solution — <em style={{fontStyle:'normal',color:'var(--g)'}}>bet both sides</em></>,
    body: <>Here's how you guarantee the money. Place the bonus bet on one team, then use your <strong>own cash at Sportsbet</strong> to bet on the other team. One of them always wins.</>,
    extra: <div style={obBox}>
      <p style={{marginBottom:10}}>No matter who wins the game, <strong>one of your bets always pays out</strong>. The bonus money is converted to real money — guaranteed.</p>
      <p>This is called <strong>matched betting</strong>. It's completely legal and thousands of Australians do it every week.</p>
    </div>,
  },
  {
    icon: '🧮',
    title: <>The maths is the <em style={{fontStyle:'normal',color:'var(--g)'}}>hard bit</em></>,
    body: <>The tricky part is knowing which game to use, and exactly how much to bet on each side so the profit is locked in regardless of the result.</>,
    extra: <div style={obBox}><p>OddsLab handles all of that. Take a screenshot of any bookie's odds board, and the tool finds the best game and tells you <strong>exactly what to bet and where</strong> — down to the dollar.</p></div>,
  },
]

// ── INITIAL BOOKIE STATE ───────────────────────────────────
function initBookieState() {
  const state = {}
  Object.keys(BOOKIES).forEach(k => {
    state[k] = { unlocked: false, bal: 0, bonus: 0, deposit: 0, profit: 0 }
  })
  return state
}

// ── COACH STEPS ────────────────────────────────────────────
function getDay1Coach(bookieKey) {
  const name = BOOKIES[bookieKey]?.name || ''
  return [
    {
      title: 'First — meet Sportsbet',
      body: 'Click the <strong>Sportsbet tab</strong> above. This is a separate account you\'ll use as your "safety net." Every time you place a bonus bet with one bookie, you\'ll place a matching bet here — so one of them always wins.',
      waitFor: { type: 'tab', key: 'sportsbet' },
    },
    {
      title: `Good. Now let\'s visit ${name}`,
      body: `Click the <strong>${name} tab</strong>. This is the bookie giving you a bonus bet today. You\'ll deposit a small amount and they\'ll top it up with free money.`,
      waitFor: { type: 'tab', key: bookieKey },
    },
    {
      title: `Claim your bonus at ${name}`,
      body: `Click <strong>Sign up & claim offer</strong>. You\'re about to deposit a small amount of your own money — in return, ${name} gives you a bonus bet on top. That bonus bet is where your profit comes from.`,
      waitFor: { type: 'signup', key: bookieKey },
    },
    {
      title: 'Make your deposit',
      body: 'The amount is pre-filled — it\'s the minimum needed to unlock the bonus. Click <strong>Deposit & claim →</strong> to confirm. This money stays in your account, it\'s not gone.',
      waitFor: { type: 'deposited', key: bookieKey },
    },
    {
      title: 'Have a look at the odds',
      body: 'These are the games you can bet on. You don\'t need to pick one yourself — OddsLab will find the best one for you. When you\'re ready, tap <strong>Scan screenshot</strong> at the bottom.',
      waitFor: { type: 'scan', key: bookieKey },
    },
    {
      title: 'OddsLab is reading the odds',
      body: 'The tool is working out which game gives you the highest guaranteed profit. Click the <strong>OddsLab tab</strong> to see the result.',
      waitFor: { type: 'tab', key: 'oddslab' },
    },
    {
      title: 'Here\'s your best opportunity',
      body: 'The game with the green border gives you the most profit. OddsLab has already worked out exactly what to bet and where. Tap <strong>Go to bets</strong> to start — you\'ll place 3 bets total.',
      waitFor: { type: 'gotobets' },
    },
  ]
}

function getDay2Coach(bookieKey) {
  const name = BOOKIES[bookieKey]?.name || ''
  return [
    {
      title: `Day 2 — welcome back`,
      body: `Same idea as yesterday, new bookie. Sportsbet is still your safety net — it stays open in the background. Click the <strong>${name} tab</strong> to get started.`,
      waitFor: { type: 'tab', key: bookieKey },
    },
    {
      title: `Sign up to ${name}`,
      body: `Click <strong>Sign up & claim offer</strong>. Just like yesterday — deposit a small amount and ${name} gives you a bonus bet on top.`,
      waitFor: { type: 'signup', key: bookieKey },
    },
    {
      title: 'Confirm your deposit',
      body: 'The minimum deposit is pre-filled. Click <strong>Deposit & claim →</strong>. Your bonus bet will appear in your balance straight away.',
      waitFor: { type: 'deposited', key: bookieKey },
    },
    {
      title: 'Scan the odds board',
      body: 'Have a look at the games. When you\'re ready, tap <strong>Scan screenshot</strong> at the bottom — OddsLab will find the best game for you automatically.',
      waitFor: { type: 'scan', key: bookieKey },
    },
    {
      title: 'Check your opportunity',
      body: 'Click the <strong>OddsLab tab</strong> to see which game OddsLab picked and how much profit is locked in.',
      waitFor: { type: 'tab', key: 'oddslab' },
    },
    {
      title: 'Place your 3 bets',
      body: 'Tap <strong>Go to bets</strong> on the top result. OddsLab will walk you through each bet one at a time — bonus bet, deposit bet, then the Sportsbet safety net.',
      waitFor: { type: 'gotobets' },
    },
  ]
}

// ── MAIN APP ───────────────────────────────────────────────
export default function App() {
  // Phase: 'onboarding' | 'bookieSelect' | 'app' | 'withdrawal' | 'end'
  const [phase, setPhase] = useState('onboarding')
  const [obSlide, setObSlide] = useState(0)
  const [day, setDay] = useState(1)
  const [bankroll, setBankroll] = useState(1000)
  const [totalProfit, setTotalProfit] = useState(0)
  const [bookieState, setBookieState] = useState(initBookieState)
  const [selectedBookies, setSelectedBookies] = useState([]) // keys chosen for today
  const [completedBookies, setCompletedBookies] = useState([])
  const [allTimeCompletedBookies, setAllTimeCompletedBookies] = useState([])
  const [activeTab, setActiveTab] = useState('oddslab')
  const [activeSport, setActiveSport] = useState({ tab:'afl', ladbrokes:'afl', neds:'afl', betr:'afl', sportsbet:'afl' })
  const [scanned, setScanned] = useState([])
  const [sbSelectStep, setSbSelectStep] = useState(false) // true = sportsbet chosen on select screen
  const [bsPickedBookies, setBsPickedBookies] = useState([])
  const [dayWake, setDayWake] = useState(null) // { profit }
  const [depositModal, setDepositModal] = useState(null) // { key, amount }
  const [scanningKey, setScanningKey] = useState(null)
  const [betGame, setBetGame] = useState(null)
  const [betStep, setBetStep] = useState(0) // 0=bonus,1=deposit,2=hedge
  const [betSlipOpen, setBetSlipOpen] = useState(false)
  const [stakeInput, setStakeInput] = useState('')
  const [profitFlash, setProfitFlash] = useState(null)
  const [coach, setCoach] = useState({ steps:[], idx:0, hidden:false })
  const [spotTarget, setSpotTarget] = useState(null) // element id to spotlight
  const spotRefs = useRef({})

  // Register a ref for spotlight targeting
  const ref = useCallback((key) => (el) => { spotRefs.current[key] = el }, [])

  // ── COACH HELPERS ──────────────────────────────────────
  const coachSet = useCallback((steps) => {
    setCoach({ steps, idx: 0, hidden: false })
  }, [])

  const coachAdvance = useCallback(() => {
    setCoach(c => ({ ...c, idx: Math.min(c.idx + 1, c.steps.length - 1) }))
  }, [])

  // Fire coach event — check if current step is waiting for this
  const coachEvent = useCallback((eventType, eventKey) => {
    setCoach(c => {
      const step = c.steps[c.idx]
      if (!step?.waitFor) return c
      const { type, key } = step.waitFor
      if (type !== eventType) return c
      if (key && key !== eventKey) return c
      // Advance
      const nextIdx = c.idx + 1
      return { ...c, idx: nextIdx }
    })
  }, [])

  // Spotlight the element the current coach step targets
  useEffect(() => {
    const step = coach.steps[coach.idx]
    if (!step || coach.hidden) { setSpotTarget(null); return }
    // Map waitFor to element id
    const wf = step.waitFor
    if (!wf) { setSpotTarget(null); return }
    const id = wf.type === 'tab' ? `tab-${wf.key}`
              : wf.type === 'signup' ? `signup-${wf.key}`
              : wf.type === 'scan' ? `scan-${wf.key}`
              : wf.type === 'gotobets' ? 'ol-list'
              : null
    setSpotTarget(id)
  }, [coach])

  // ── ONBOARDING ─────────────────────────────────────────
  function obNext() {
    if (obSlide < OB_SLIDES.length - 1) setObSlide(s => s + 1)
    else startSim()
  }

  function startSim() {
    setPhase('bookieSelect')
    setSbSelectStep(false)
    setBsPickedBookies([])
  }

  // ── BOOKIE SELECT ──────────────────────────────────────
  function confirmBS() {
    if (!bookieState.sportsbet.unlocked) {
      // Just unlock sportsbet - no deposit
      setBookieState(s => ({ ...s, sportsbet: { ...s.sportsbet, unlocked: true } }))
      setSbSelectStep(true)
      setBsPickedBookies([])
      return
    }
    // Move to app
    setSelectedBookies(bsPickedBookies)
    setPhase('app')
    setActiveTab('oddslab')
    // Init coach after short delay so tabs render
    // Use sportsbet.unlocked as reliable signal that day 1 is done
    const isDay1 = !bookieState.sportsbet.unlocked || day === 1
    setTimeout(() => {
      if (isDay1) {
        coachSet(getDay1Coach(bsPickedBookies[0]))
      } else {
        coachSet(getDay2Coach(bsPickedBookies[0]))
      }
    }, 100)
  }

  function toggleBsPick(key) {
    const max = day === 3 ? 2 : 1
    setBsPickedBookies(prev => {
      if (prev.includes(key)) return prev.filter(k => k !== key)
      if (prev.length >= max) return prev
      return [...prev, key]
    })
  }

  // ── TAB SWITCH ─────────────────────────────────────────
  function switchTab(key) {
    setActiveTab(key)
    coachEvent('tab', key)
  }

  // ── DEPOSIT ────────────────────────────────────────────
  function openDeposit(key) {
    const b = BOOKIES[key]
    const amount = (key === 'sportsbet' && pendingHedgeDeposit) ? pendingHedgeDeposit : (b.minDep || 50)
    setDepositModal({ key, amount })
    if (key === 'sportsbet' && pendingHedgeDeposit) setPendingHedgeDeposit(null)
    coachEvent('signup', key)
  }

  function confirmDeposit() {
    const { key, amount } = depositModal
    const dep = parseFloat(amount) || 0
    const isSB = key === 'sportsbet'
    const bonus = isSB ? 0 : dep * BOOKIES[key].bonusMul
    setBookieState(s => ({
      ...s,
      [key]: { ...s[key], unlocked: true, bal: dep, bonus, deposit: dep },
    }))
    setBankroll(b => b - dep)
    setDepositModal(null)
    coachEvent('deposited', key)
  }

  // ── SCAN ───────────────────────────────────────────────
  function doScan(key) {
    setScanningKey(key)
    const bk = bookieState[key]
    setTimeout(() => {
      const opps = getAllOpps(key, bk.deposit, bk.bonus)
      setScanned(prev => {
        const existing = new Set(prev.map(g => g.id))
        return [...prev, ...opps.filter(o => !existing.has(o.id))].sort((a,b) => b.profit - a.profit)
      })
      setScanningKey(null)
      coachEvent('scan', key)
    }, 2800)
  }

  // ── BET FLOW ───────────────────────────────────────────
  function startBets(gameId) {
    const game = scanned.find(g => g.id === gameId)
    if (!game) return
    setBetGame(game)
    setBetStep(0)
    setBetSlipOpen(false)
    coachEvent('gotobets')
    // Switch to bookie tab, wait for odds click
    switchTab(game.srcBookie)
    // Coach: find the odds
    coachSet([{
      title: `Bet 1 of 3 — Your bonus bet`,
      body: `Find <strong>${game.backTeam}</strong> (odds <strong>${game.backOdds.toFixed(2)}</strong>) on the board and tap it. This is your <em>bonus bet</em> — it costs you nothing extra, it\'s the free money ${game.backBookie} gave you.`,
      waitFor: { type: 'oddsclick', team: game.backTeam },
    }])
  }

  function handleOddsClick(team, odds, bookieKey) {
    if (!betGame) return
    const g = betGame
    const step = betStep
    const expectedTeam = step < 2 ? g.backTeam : g.hedgeTeam
    if (team !== expectedTeam) return
    // Open bet slip
    setBetSlipOpen(true)
    setStakeInput('')
    const correctStake = step === 0 ? g.bonusStake : step === 1 ? g.depStake : g.hedge
    coachSet([{
      title: `Enter the stake amount`,
      body: `Type <strong>${correctStake.toFixed(2)}</strong> in the stake field — OddsLab has already worked this out for you. Then tap <strong>Confirm bet →</strong>.`,
      waitFor: null,
    }])
  }

  function confirmBet() {
    const g = betGame
    const next = betStep + 1
    setBetSlipOpen(false)
    setStakeInput('')

    if (next < 3) {
      setBetStep(next)
      if (next === 2) {
        // Hedge bet — need to deposit into Sportsbet first
        const hedgeAmt = g.hedge
        coachSet([{
          title: 'Almost there — one more step',
          body: `Bet 1 is placed. Now you need to top up your Sportsbet account with <strong>${fmt(hedgeAmt)}</strong> so you can place the safety net bet. Click the <strong>Sportsbet tab</strong>.`,
          waitFor: { type: 'tab', key: 'sportsbet' },
        }])
        // After tab switch, open deposit modal
        const origCoachSet = coachSet
        const unsub = () => {} // handled via coachEvent flow below
        setTimeout(() => {
          setCoach(c => {
            // When sportsbet tab is clicked, open deposit modal
            return c
          })
        }, 0)
        // Store pending hedge deposit
        setPendingHedgeDeposit(hedgeAmt)
      } else {
        // Bet 2: deposit bet, stay on bookie
        coachSet([{
          title: `Bet 2 of 3 — Your cash bet`,
          body: `Find <strong>${g.backTeam}</strong> (odds <strong>${g.backOdds.toFixed(2)}</strong>) again and tap it. This time you\'re betting your own deposit money — this is what you get back if ${g.backTeam} wins.`,
          waitFor: { type: 'oddsclick', team: g.backTeam },
        }])
      }
    } else {
      // All 3 done
      const profit = g.profit
      setBookieState(s => ({
        ...s,
        [g.srcBookie]: { ...s[g.srcBookie], bonus: 0, profit: s[g.srcBookie].profit + profit },
        sportsbet: { ...s.sportsbet, bal: s.sportsbet.bal - g.hedge },
      }))
      setBankroll(b => b + profit)
      setTotalProfit(p => p + profit)
      if (!completedBookies.includes(g.srcBookie)) {
        setCompletedBookies(prev => [...prev, g.srcBookie])
        setAllTimeCompletedBookies(prev => prev.includes(g.srcBookie) ? prev : [...prev, g.srcBookie])
      }
      setScanned(prev => prev.filter(x => x.id !== g.id))
      setBetGame(null)
      setBetStep(0)
      setProfitFlash({ profit: g.profit, backTeam: g.backTeam, backBookie: g.backBookie, hedgeTeam: g.hedgeTeam })
      coachSet([{
        title: 'All 3 bets placed! 🎉',
        body: 'Your profit is now <strong>locked in</strong>. It doesn\'t matter which team wins — one of your bets always pays out, and you come out ahead either way. Close this to continue.',
        waitFor: null,
      }])
    }
  }

  // Pending hedge deposit amount
  const [pendingHedgeDeposit, setPendingHedgeDeposit] = useState(null)

  // When Sportsbet tab is clicked during hedge flow, show coach step to tap deposit button
  useEffect(() => {
    if (pendingHedgeDeposit && activeTab === 'sportsbet') {
      coachSet([{
        title: 'Top up Sportsbet',
        body: `You need <strong>${fmt(pendingHedgeDeposit)}</strong> in your Sportsbet account to place the safety net bet. Tap <strong>Deposit funds →</strong> below to add it now.`,
        waitFor: { type: 'signup', key: 'sportsbet' },
      }])
    }
  }, [activeTab, pendingHedgeDeposit])

  // After Sportsbet hedge deposit, continue to hedge bet
  useEffect(() => {
    if (!betGame || betStep !== 2) return
    if (!bookieState.sportsbet.unlocked || bookieState.sportsbet.bal <= 0) return
    if (activeTab === 'sportsbet') {
      const g = betGame
      coachSet([{
        title: 'Bet 3 of 3 — Your safety net',
        body: `Find <strong>${g.hedgeTeam}</strong> (odds <strong>${g.hedgeOdds.toFixed(2)}</strong>) and tap it. This is the opposite team — if they win, this bet pays out. Either way, you\'re covered.`,
        waitFor: { type: 'oddsclick', team: g.hedgeTeam },
      }])
    }
  }, [bookieState.sportsbet.bal, activeTab, betStep])

  // OddsClick coach event
  function handleOddsClickCoach(team) {
    setCoach(c => {
      const step = c.steps[c.idx]
      if (step?.waitFor?.type !== 'oddsclick') return c
      if (step.waitFor.team !== team) return c
      return { ...c, idx: c.idx + 1 }
    })
  }

  function onOddsClick(team, odds, bookieKey) {
    handleOddsClick(team, odds, bookieKey)
    handleOddsClickCoach(team)
  }

  // ── PROFIT FLASH CLOSE ─────────────────────────────────
  function closePF() {
    setProfitFlash(null)
    const remaining = selectedBookies.filter(k => !completedBookies.includes(k))
    if (remaining.length > 0) {
      switchTab(remaining[0])
      coachSet([{
        title: `Great work! On to ${BOOKIES[remaining[0]].name}`,
        body: `You\'ve done this before — same process. Click the <strong>${BOOKIES[remaining[0]].name} tab</strong> to sign up and claim their welcome bonus.`,
        waitFor: { type: 'tab', key: remaining[0] },
      }])
    } else if (day < 3) {
      endDay()
    } else {
      setPhase('end')
    }
  }

  // ── DAY END ────────────────────────────────────────────
  function endDay() {
    const dp = completedBookies.reduce((sum, k) => sum + (bookieState[k].profit || 0), 0)
    setDayWake({ profit: dp })
  }

  function advanceDayWake() {
    setDayWake(null)
    setDay(d => d + 1)
    setPhase('withdrawal')
  }

  function confirmWD() {
    const dayProfit = completedBookies.reduce((sum, k) => sum + (bookieState[k].profit || 0), 0)
    setBankroll(b => b + dayProfit)
    setScanned([])
    setCompletedBookies([])
    setSelectedBookies([])
    setBetGame(null)
    setBetStep(0)
    setBetSlipOpen(false)
    setPendingHedgeDeposit(null)
    setPhase('bookieSelect')
    setBsPickedBookies([])
  }

  // ── SCAN ANIMATION ─────────────────────────────────────
  const [scanProgress, setScanProgress] = useState(0)
  const [scanStatus, setScanStatus] = useState('')
  useEffect(() => {
    if (!scanningKey) { setScanProgress(0); setScanStatus(''); return }
    const steps = [
      { p:20, t:'Reading odds board...' },
      { p:45, t:'Extracting team names...' },
      { p:70, t:'Matching to Sportsbet...' },
      { p:90, t:'Calculating profit...' },
      { p:100, t:'Done!' },
    ]
    let i = 0
    const iv = setInterval(() => {
      if (i >= steps.length) { clearInterval(iv); return }
      setScanProgress(steps[i].p)
      setScanStatus(steps[i].t)
      i++
    }, 500)
    return () => clearInterval(iv)
  }, [scanningKey])

  // ── RENDER ─────────────────────────────────────────────
  if (phase === 'onboarding') return <Onboarding slide={obSlide} onNext={obNext} onSkip={startSim} />

  if (phase === 'bookieSelect') return (
    <BookieSelect
      day={day}
      sbUnlocked={bookieState.sportsbet.unlocked}
      sbSelectStep={sbSelectStep}
      picked={bsPickedBookies}
      completedBookies={allTimeCompletedBookies}
      maxPick={day === 3 ? 2 : 1}
      onToggle={toggleBsPick}
      onConfirm={confirmBS}
    />
  )

  if (phase === 'withdrawal') return (
    <Withdrawal
      day={day}
      completedBookies={completedBookies}
      bookieState={bookieState}
      onConfirm={confirmWD}
    />
  )

  if (phase === 'end') return (
    <EndScreen
      totalProfit={totalProfit}
      completedBookies={completedBookies}
      bookieState={bookieState}
    />
  )

  // App phase
  const tabs = ['oddslab', 'sportsbet', ...selectedBookies]
  const currentCoachStep = coach.steps[coach.idx]

  return (
    <div style={styles.appWrap}>
      {/* STATUS BAR */}
      <div style={styles.statusBar}>
        <div style={styles.sLogo}>odds<em style={{fontStyle:'normal',color:'var(--g)'}}>lab</em></div>
        <div style={styles.sRight}>
          <span style={styles.sPill}>Day {day}</span>
          <span style={{fontSize:12}}>Profit: <span style={{fontFamily:'var(--mono)',color:'var(--g)',fontWeight:600}}>{totalProfit >= 0 ? '+' : ''}{fmt(totalProfit)}</span></span>
          <span style={{fontSize:12}}>Bankroll: <span style={{fontFamily:'var(--mono)',color:'var(--g)',fontWeight:600}}>{fmt(bankroll)}</span></span>
        </div>
      </div>

      {/* APP TABS */}
      <div style={styles.appTabs}>
        {tabs.map(k => (
          <div
            key={k}
            id={`tab-${k}`}
            ref={ref(`tab-${k}`)}
            style={{
              ...styles.appTab,
              ...(activeTab === k ? styles.appTabOn : {}),
              ...(k === 'oddslab' && activeTab === k ? { color:'var(--g)', borderBottomColor:'var(--g)' } : {}),
            }}
            onClick={() => switchTab(k)}
          >
            {k === 'oddslab' ? 'OddsLab' : BOOKIES[k].name}
            {k === 'oddslab' && scanned.length > 0 && (
              <span style={styles.atBadge}>{scanned.length}</span>
            )}
          </div>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div style={{flex:1}}>
        {activeTab === 'oddslab' && (
          <OddsLabPanel
            scanned={scanned}
            onGoBets={startBets}
            refFn={ref}
          />
        )}
        {activeTab === 'sportsbet' && (
          <BookiePane
            bookieKey="sportsbet"
            bk={BOOKIES.sportsbet}
            state={bookieState.sportsbet}
            sport={activeSport.sportsbet}
            onSportSwitch={sp => setActiveSport(s => ({...s, sportsbet:sp}))}
            onSignup={() => openDeposit('sportsbet')}
            onScan={null}
            onOddsClick={onOddsClick}
            betGame={betGame}
            betStep={betStep}
            refFn={ref}
            isSportsbet
            pendingHedgeDeposit={pendingHedgeDeposit}
          />
        )}
        {selectedBookies.map(k => activeTab === k && (
          <BookiePane
            key={k}
            bookieKey={k}
            bk={BOOKIES[k]}
            state={bookieState[k]}
            sport={activeSport[k] || 'afl'}
            onSportSwitch={sp => setActiveSport(s => ({...s, [k]:sp}))}
            onSignup={() => openDeposit(k)}
            onScan={() => doScan(k)}
            onOddsClick={onOddsClick}
            betGame={betGame}
            betStep={betStep}
            refFn={ref}
            scanningKey={scanningKey}
            scanProgress={scanProgress}
            scanStatus={scanStatus}
          />
        ))}
      </div>

      {/* DEPOSIT MODAL */}
      {depositModal && (
        <Modal>
          <div style={styles.moTag}>
            {depositModal.key === 'sportsbet' ? 'Deposit' : 'Welcome offer'}
          </div>
          <div style={styles.moH}>
            {depositModal.key === 'sportsbet'
              ? `Deposit into Sportsbet`
              : `${BOOKIES[depositModal.key].name} Welcome Offer`}
          </div>
          <div style={styles.moP}>{BOOKIES[depositModal.key].body}</div>
          {depositModal.key !== 'sportsbet' && (
            <div style={styles.offerBox}>
              <OfferRow label="Your deposit" val={fmt(parseFloat(depositModal.amount)||0)} />
              <OfferRow label="Bonus bet received" val={fmt((parseFloat(depositModal.amount)||0) * BOOKIES[depositModal.key].bonusMul)} />
              <OfferRow label="Total in account" val={fmt((parseFloat(depositModal.amount)||0) * (1 + BOOKIES[depositModal.key].bonusMul))} last />
            </div>
          )}
          <label style={styles.moLabel}>Deposit amount</label>
          <input
            style={styles.moInput}
            type="number"
            value={depositModal.amount}
            onChange={e => setDepositModal(d => ({...d, amount: e.target.value}))}
          />
          <div style={styles.moRow}>
            <button style={styles.btnGhost} onClick={() => setDepositModal(null)}>Cancel</button>
            <button style={styles.btnGreen} onClick={confirmDeposit}>Deposit & claim →</button>
          </div>
        </Modal>
      )}

      {/* BET SLIP */}
      {betSlipOpen && betGame && (
        <BetSlip
          game={betGame}
          step={betStep}
          stakeInput={stakeInput}
          onStakeChange={setStakeInput}
          onConfirm={confirmBet}
          onClose={() => setBetSlipOpen(false)}
        />
      )}

      {/* PROFIT FLASH */}
      {profitFlash && (
        <ProfitFlash {...profitFlash} bankroll={bankroll} onClose={closePF} />
      )}

      {/* DAY WAKE */}
      {dayWake && (
        <DayWake day={day} profit={dayWake.profit} onContinue={advanceDayWake} />
      )}

      {/* COACH */}
      <Coach
        step={currentCoachStep}
        idx={coach.idx}
        total={coach.steps.length}
        hidden={coach.hidden}
        onHide={() => setCoach(c => ({...c, hidden:true}))}
        onShow={() => setCoach(c => ({...c, hidden:false}))}
        onManualNext={() => setCoach(c => ({...c, idx: Math.min(c.idx+1, c.steps.length-1)}))}
      />

      {/* SPOTLIGHT */}
      {spotTarget && !coach.hidden && (
        <Spotlight targetId={spotTarget} />
      )}
    </div>
  )
}

// ── ONBOARDING ─────────────────────────────────────────────
function Onboarding({ slide, onNext, onSkip }) {
  const s = OB_SLIDES[slide]
  return (
    <div style={styles.obWrap}>
      <div style={styles.obLogo}>odds<em style={{fontStyle:'normal',color:'var(--g)'}}>lab</em></div>
      <div style={styles.obSlide}>
        <div style={styles.obIcon}>{s.icon}</div>
        <div style={styles.obH}>{s.title}</div>
        <div style={styles.obP}>{s.body}</div>
        {s.extra}
      </div>
      <div style={styles.obNav}>
        <button style={styles.obSkip} onClick={onSkip}>Skip intro</button>
        <div style={{display:'flex',gap:5}}>
          {OB_SLIDES.map((_,i) => (
            <div key={i} style={{...styles.obDot, ...(i===slide?{background:'var(--g)'}:i<slide?{background:'var(--g)',opacity:.4}:{})}} />
          ))}
        </div>
        <button style={styles.obNxt} onClick={onNext}>
          {slide === OB_SLIDES.length-1 ? 'Start →' : 'Next →'}
        </button>
      </div>
    </div>
  )
}

// ── BOOKIE SELECT ──────────────────────────────────────────
function BookieSelect({ day, sbUnlocked, sbSelectStep, picked, completedBookies, maxPick, onToggle, onConfirm }) {
  const available = Object.values(BOOKIES).filter(b =>
    b.key === 'sportsbet' || (!completedBookies.includes(b.key) && sbUnlocked)
  )
  const showOnlySB = !sbUnlocked
  const canConfirm = showOnlySB ? picked.includes('sportsbet') || sbSelectStep
    : picked.length === maxPick

  const heading = showOnlySB ? 'First, set up Sportsbet'
    : day === 3 ? 'Day 3 — choose two bookies'
    : day === 2 ? 'Day 2 — pick your next bookie'
    : 'Choose your first bonus bookie'

  const subtext = showOnlySB
    ? 'Sportsbet is your safety net account. Sign up for free — no deposit needed yet.'
    : day === 3
    ? 'Pick two bookies you haven\'t used yet. You\'ll do them one at a time — same process as before.'
    : day === 2
    ? 'Great work yesterday. Pick a new bookie — same process, new bonus.'
    : 'Each bookie has a welcome offer — free money just for signing up. Pick one to start.'

  return (
    <div style={styles.bsWrap}>
      <div style={styles.bsInner}>
        <div style={styles.sLogo}>odds<em style={{fontStyle:'normal',color:'var(--g)'}}>lab</em></div>
        <div style={styles.dayPill}>Day {day}</div>
        <div style={styles.bsH}>{heading}</div>
        <div style={styles.bsP}>{subtext}</div>
        <div style={styles.bsGrid}>
          {(showOnlySB ? [BOOKIES.sportsbet] : available.filter(b => b.key !== 'sportsbet')).map(b => {
            const isSel = picked.includes(b.key) || (b.key === 'sportsbet' && sbSelectStep)
            return (
              <div
                key={b.key}
                style={{...styles.bc, ...(isSel ? styles.bcSel : {})}}
                onClick={() => onToggle(b.key)}
              >
                <div style={{...styles.bcName, color:b.color}}>{b.name}</div>
                <div style={styles.bcOffer}>{b.offer}</div>
                <div style={styles.bcBonus}>{b.minDep > 0 ? `Min deposit: ${fmt(b.minDep)}` : 'Sign up free'}</div>
                {isSel && <div style={styles.bcCheck}>✓</div>}
              </div>
            )
          })}
        </div>
        <button
          style={{...styles.btnGreen, width:'100%', padding:'13px 0', fontSize:14, opacity: canConfirm ? 1 : 0.4}}
          onClick={onConfirm}
          disabled={!canConfirm}
        >
          Continue →
        </button>
      </div>
    </div>
  )
}

// ── WITHDRAWAL ─────────────────────────────────────────────
function Withdrawal({ day, completedBookies, bookieState, onConfirm }) {
  const total = completedBookies.reduce((s, k) => s + (bookieState[k].profit || 0), 0)
  return (
    <div style={styles.bsWrap}>
      <div style={{...styles.bsInner, maxWidth:440}}>
        <div style={styles.sLogo}>odds<em style={{fontStyle:'normal',color:'var(--g)'}}>lab</em></div>
        <div style={styles.dayPill}>Day {day}</div>
        <div style={styles.bsH}>Time to withdraw your profit 💰</div>
        <div style={styles.bsP}>Your bets have settled. The profit below is real money sitting in your bookie accounts — you can withdraw it straight to your bank. In this simulator, just tap the button to move on to Day {day + 1}.</div>
        <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:16}}>
          {completedBookies.map(k => (
            <div key={k} style={styles.wdAcc}>
              <div>
                <div style={{fontSize:13,fontWeight:600}}>{BOOKIES[k].name}</div>
                <div style={{fontSize:12,color:'var(--g)',fontFamily:'var(--mono)'}}>+{fmt(bookieState[k].profit||0)}</div>
              </div>
              <div style={{fontSize:11,color:'var(--t3)'}}>Ready</div>
            </div>
          ))}
        </div>
        <div style={styles.wdTotalBox}>
          <div>
            <div style={{fontSize:11,color:'var(--t2)',marginBottom:3}}>Total withdrawing</div>
            <div style={{fontSize:22,fontWeight:700,fontFamily:'var(--mono)',color:'var(--g)'}}>{fmt(total)}</div>
          </div>
          <div style={{fontSize:28}}>🏦</div>
        </div>
        <button style={{...styles.btnGreen,width:'100%',padding:'13px 0',fontSize:14}} onClick={onConfirm}>
          Withdraw to bank →
        </button>
      </div>
    </div>
  )
}

// ── BOOKIE PANE ────────────────────────────────────────────
function BookiePane({ bookieKey, bk, state, sport, onSportSwitch, onSignup, onScan, onOddsClick, betGame, betStep, refFn, scanningKey, scanProgress, scanStatus, isSportsbet, pendingHedgeDeposit }) {
  const sports = ['afl','nrl','nba','mlb']
  const isScanning = scanningKey === bookieKey
  const games = ODDS[bookieKey]?.[sport] || []

  // Determine which team to highlight (if in bet flow)
  const highlightTeam = betGame && (
    (betStep < 2 && betGame.srcBookie === bookieKey) ? betGame.backTeam
    : (betStep === 2 && bookieKey === 'sportsbet') ? betGame.hedgeTeam
    : null
  )

  return (
    <div>
      <div style={{background:bk.color}}>
        <div style={styles.bkHdr}>
          <div style={styles.bkLogo}>{bk.name}</div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:10,color:'rgba(255,255,255,0.55)',marginBottom:1}}>Balance</div>
            <div style={{fontSize:13,fontWeight:700,color:'white',fontFamily:'var(--mono)'}}>{fmt(state.bal)}</div>
            {state.bonus > 0 && <div style={{fontSize:11,color:'rgba(255,255,255,0.75)',fontFamily:'var(--mono)'}}>{fmt(state.bonus)} bonus bet</div>}
          </div>
        </div>
        <div style={{display:'flex',overflow:'auto',background:'rgba(0,0,0,0.2)'}}>
          {sports.map(sp => (
            <div key={sp} style={{...styles.spTab, ...(sport===sp?styles.spTabOn:{})}} onClick={() => onSportSwitch(sp)}>
              {sp.toUpperCase()}
            </div>
          ))}
        </div>
      </div>

      {!state.unlocked ? (
        <div style={styles.locked}>
          <div style={{fontSize:34,marginBottom:12,opacity:.35}}>{isSportsbet ? '🛡️' : '🎁'}</div>
          <div style={styles.lockedH}>{isSportsbet ? 'Sportsbet — Your Safety Net' : `${bk.name} Welcome Offer`}</div>
          <div style={styles.lockedP}>{bk.body}</div>
          {!isSportsbet && (
            <button
              id={`signup-${bookieKey}`}
              ref={refFn(`signup-${bookieKey}`)}
              style={styles.btnSignup}
              onClick={onSignup}
            >
              Sign up & claim offer →
            </button>
          )}
        </div>
      ) : state.unlocked && pendingHedgeDeposit ? (
        <div style={styles.locked}>
          <div style={{fontSize:34,marginBottom:12,opacity:.35}}>🛡️</div>
          <div style={styles.lockedH}>Top up your Sportsbet account</div>
          <div style={{...styles.lockedP, maxWidth:300}}>
            Here's why you need to deposit here: the bonus bet from {bookieKey === 'sportsbet' ? 'your bookie' : 'the other bookie'} can't be withdrawn directly — that's the catch with all bonus bets. You <strong>have to place it as a bet first</strong>.<br/><br/>
            So we place the bonus bet on one team, then use <strong>your own money here at Sportsbet</strong> to bet on the other team. One of them always wins — and together, you come out ahead.
          </div>
          <button
            id={`signup-sportsbet`}
            ref={refFn(`signup-sportsbet`)}
            style={styles.btnSignup}
            onClick={onSignup}
          >
            Deposit {fmt(pendingHedgeDeposit)} →
          </button>
        </div>
      ) : (
        <>
          <div style={{background:'#0C0C0C'}}>
            <div style={{fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:.8,padding:'8px 18px',background:'#0F0F0F',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
              {sport.toUpperCase()}
            </div>
            {games.map(g => (
              <div key={g.id} style={{borderBottom:'1px solid rgba(255,255,255,0.05)',padding:'12px 18px'}}>
                <div style={{fontSize:10,color:'rgba(255,255,255,0.35)',marginBottom:5,textTransform:'uppercase'}}>{g.sport} · {g.time}</div>
                <div style={{fontSize:14,fontWeight:600,color:'white',marginBottom:8}}>{g.team1} v {g.team2}</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
                  {[{team:g.team1,odds:g.t1},{team:g.team2,odds:g.t2}].map(({team,odds}) => {
                    const isHighlight = team === highlightTeam
                    return (
                      <div
                        key={team}
                        style={{
                          ...styles.oBtn,
                          ...(isHighlight ? styles.oBtnHighlight : {}),
                        }}
                        onClick={() => onOddsClick(team, odds, bookieKey)}
                      >
                        <div style={{fontSize:10,color:'rgba(255,255,255,0.5)',marginBottom:3}}>{team}</div>
                        <div style={{fontSize:17,fontWeight:700,color:'white',fontFamily:'var(--mono)'}}>{odds.toFixed(2)}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {onScan && (
            <div
              id={`scan-${bookieKey}`}
              ref={refFn(`scan-${bookieKey}`)}
              style={styles.scanStrip}
            >
              {isScanning ? (
                <div style={{flex:1}}>
                  <div style={{height:4,background:'var(--s3)',borderRadius:2,overflow:'hidden',marginBottom:6}}>
                    <div style={{height:'100%',background:'var(--g)',borderRadius:2,width:`${scanProgress}%`,transition:'width 0.4s'}} />
                  </div>
                  <div style={{fontSize:12,color:'var(--t2)',fontFamily:'var(--mono)'}}>{scanStatus}</div>
                </div>
              ) : (
                <>
                  <p style={{fontSize:12,color:'var(--t2)'}}>Ready to find your best opportunity?</p>
                  <button style={styles.btnScan} onClick={onScan}>📸 Scan screenshot</button>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ── ODDSLAB PANEL ──────────────────────────────────────────
function OddsLabPanel({ scanned, onGoBets, refFn }) {
  return (
    <div style={{padding:'16px 18px'}}>
      <div style={{fontSize:15,fontWeight:700,marginBottom:3}}>Scanned opportunities</div>
      <div style={{fontSize:12,color:'var(--t2)',marginBottom:14}}>Ranked by guaranteed profit. Hit "Go to bets" to start placing.</div>
      <div id="ol-list" ref={refFn('ol-list')}>
        {scanned.length === 0 ? (
          <div style={{textAlign:'center',padding:'44px 20px',color:'var(--t2)'}}>
            <div style={{fontSize:30,marginBottom:9,opacity:.3}}>📸</div>
            <p style={{fontSize:13,lineHeight:1.6}}>No games yet.<br/>Go to a bookie and hit <strong>Scan screenshot</strong>.</p>
          </div>
        ) : scanned.map((g, i) => (
          <div key={g.id} style={{...styles.scCard, ...(i===0?styles.scCardBest:{})}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{...styles.spBadge, ...({afl:styles.spAfl,nrl:styles.spNrl,nba:styles.spNba,mlb:styles.spMlb}[g.sport.toLowerCase()]||{})}}>
                {g.sport}
              </div>
              <div style={{fontSize:13,fontWeight:600,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',marginBottom:2}}>{g.team1} vs {g.team2}</div>
              <div style={{fontSize:11,color:'var(--t2)',fontFamily:'var(--mono)'}}>{g.backBookie} → Sportsbet · {g.time}</div>
            </div>
            <div style={{textAlign:'right',flexShrink:0}}>
              <div style={{fontSize:19,fontWeight:700,fontFamily:'var(--mono)',color:'var(--g)',marginBottom:1}}>+{fmt(g.profit)}</div>
              <div style={{fontSize:10,color:'var(--t3)',marginBottom:7}}>guaranteed</div>
              <button style={styles.btnGoto} onClick={() => onGoBets(g.id)}>Go to bets →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── BET SLIP ───────────────────────────────────────────────
function BetSlip({ game: g, step, stakeInput, onStakeChange, onConfirm, onClose }) {
  const tags = [`Bet 1 of 3 — ${g.backBookie} (bonus bet)`, `Bet 2 of 3 — ${g.backBookie} (deposit)`, `Bet 3 of 3 — Sportsbet (hedge)`]
  const subs = [
    `Your bonus bet on ${g.backTeam}. If you win, only the profit is paid — your stake is not returned.`,
    `Place your locked deposit on the same team. This turns it over so you can withdraw later.`,
    `Your safety net bet on ${g.hedgeTeam}. This guarantees you get paid no matter who wins.`,
  ]
  const team = step < 2 ? g.backTeam : g.hedgeTeam
  const odds = step < 2 ? g.backOdds : g.hedgeOdds
  const isBonus = step === 0
  const stake = parseFloat(stakeInput) || 0
  const ret = isBonus ? stake*(odds-1) : stake*odds

  return (
    <div style={styles.slipOv}>
      <div style={styles.slip}>
        <div style={styles.slipHandle} />
        <div style={{fontSize:10,fontWeight:700,color:'var(--g)',textTransform:'uppercase',letterSpacing:.6,marginBottom:4}}>{tags[step]}</div>
        <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>{g.team1} vs {g.team2}</div>
        <div style={{fontSize:12,color:'var(--t2)',marginBottom:12}}>{subs[step]}</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7,marginBottom:11}}>
          {[g.team1,g.team2].map(t => (
            <div key={t} style={{...styles.slipTeam, ...(t===team?styles.slipTeamSel:{})}}>
              <div style={{fontSize:12,fontWeight:600,marginBottom:2}}>{t}</div>
              <div style={{fontSize:15,fontWeight:700,fontFamily:'var(--mono)',color:'var(--g)'}}>{t===team?odds.toFixed(2):'—'}</div>
            </div>
          ))}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:11}}>
          <div style={{fontSize:12,color:'var(--t2)',whiteSpace:'nowrap'}}>Stake ($)</div>
          <input
            style={styles.stakeInp}
            type="number"
            placeholder="Type amount here"
            value={stakeInput}
            onChange={e => onStakeChange(e.target.value)}
            autoFocus
          />
        </div>
        <div style={styles.retBox}>
          <div style={{fontSize:12,color:'var(--t2)'}}>{isBonus ? 'Profit if wins (stake not returned)' : 'Return if wins'}</div>
          <div style={{fontSize:15,fontWeight:700,fontFamily:'var(--mono)',color:'var(--g)'}}>{fmt(ret)}</div>
        </div>
        <button
          style={{...styles.btnGreen,width:'100%',padding:12,fontSize:13,opacity:stake>0?1:0.4}}
          onClick={confirmBet => { if (stake > 0) onConfirm() }}
          disabled={stake <= 0}
        >
          Confirm bet →
        </button>
      </div>
    </div>
  )

  function confirmBet() { if (stake > 0) onConfirm() }
}

// ── PROFIT FLASH ───────────────────────────────────────────
function ProfitFlash({ profit, backTeam, backBookie, hedgeTeam, bankroll, onClose }) {
  return (
    <div style={styles.pfOv}>
      <div style={{fontSize:12,color:'var(--t2)',marginBottom:8}}>Locked in — no matter who wins</div>
      <div style={{fontSize:58,fontWeight:700,fontFamily:'var(--mono)',color:'var(--g)',marginBottom:8,lineHeight:1}}>+{fmt(profit)}</div>
      <div style={{fontSize:13,color:'var(--t2)',marginBottom:6}}>{backTeam} on {backBookie} · {hedgeTeam} on Sportsbet</div>
      <div style={{fontSize:13,color:'var(--t2)',marginBottom:26}}>New bankroll: <strong style={{color:'var(--g)',fontFamily:'var(--mono)'}}>{fmt(bankroll)}</strong></div>
      <button style={{...styles.btnGreen,padding:'12px 30px',width:'auto'}} onClick={onClose}>Keep going →</button>
    </div>
  )
}

// ── DAY WAKE ───────────────────────────────────────────────
function DayWake({ day, profit, onContinue }) {
  return (
    <div style={styles.pfOv}>
      <div style={{fontSize:11,fontWeight:600,color:'var(--g)',textTransform:'uppercase',letterSpacing:1,marginBottom:10}}>End of Day {day}</div>
      <div style={{fontSize:26,fontWeight:800,marginBottom:8}}>{day===1?'Day one done — well done!':'Another day, another profit!'}</div>
      <div style={{fontSize:14,color:'var(--t2)',marginBottom:24,lineHeight:1.6,maxWidth:340,textAlign:'center'}}>
        {day===1
          ? "Your profit is sitting in the bookie's app. Tomorrow you'll withdraw it to your bank and sign up to a fresh bookie for another round."
          : "Same thing — your profit is ready to withdraw. One more bookie to go after this."}
      </div>
      {profit > 0 && (
        <div style={{...styles.wdTotalBox,marginBottom:24,textAlign:'center',flexDirection:'column',alignItems:'center'}}>
          <div style={{fontSize:11,color:'var(--t2)',marginBottom:3}}>Today's profit</div>
          <div style={{fontSize:34,fontWeight:700,fontFamily:'var(--mono)',color:'var(--g)'}}>+{fmt(profit)}</div>
        </div>
      )}
      <button style={{...styles.btnGreen,padding:'12px 30px',width:'auto'}} onClick={onContinue}>Start Day {day+1} →</button>
    </div>
  )
}

// ── END SCREEN ─────────────────────────────────────────────
function EndScreen({ totalProfit, completedBookies, bookieState }) {
  return (
    <div style={{...styles.pfOv,justifyContent:'center',gap:0}}>
      <div style={{fontSize:20,fontWeight:800,marginBottom:22}}>odds<em style={{fontStyle:'normal',color:'var(--g)'}}>lab</em></div>
      <div style={{fontSize:26,fontWeight:800,lineHeight:1.2,marginBottom:8,textAlign:'center'}}>3 days. Zero risk.<br/>Real money.</div>
      <div style={{fontSize:56,fontWeight:700,fontFamily:'var(--mono)',color:'var(--g)',margin:'12px 0'}}>+{fmt(totalProfit)}</div>
      <div style={{fontSize:13,color:'var(--t2)',maxWidth:400,lineHeight:1.7,marginBottom:22,textAlign:'center'}}>Every dollar was guaranteed before the game started. The real tool makes this just as easy — and there are dozens more bookies waiting.</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:9,width:'100%',maxWidth:400,marginBottom:24}}>
        {completedBookies.map(k => (
          <div key={k} style={{background:'var(--s1)',border:'1px solid var(--b1)',borderRadius:'var(--r)',padding:13,textAlign:'center'}}>
            <div style={{fontSize:10,color:'var(--t2)',marginBottom:3}}>{BOOKIES[k].name}</div>
            <div style={{fontSize:16,fontWeight:700,fontFamily:'var(--mono)',color:'var(--g)'}}>+{fmt(bookieState[k].profit||0)}</div>
          </div>
        ))}
      </div>
      <button style={{...styles.btnGreen,padding:'13px 32px',width:'100%',maxWidth:400,fontSize:14}} onClick={() => window.open('https://oddslab-theta.vercel.app','_blank')}>
        Do this for real → $49/month
      </button>
      <div style={{fontSize:11,color:'var(--t3)',maxWidth:380,lineHeight:1.6,marginTop:12,textAlign:'center'}}>
        Simulated using realistic Australian betting market odds. Matched betting involves financial risk. Please gamble responsibly.
      </div>
    </div>
  )
}

// ── COACH ──────────────────────────────────────────────────
function Coach({ step, idx, total, hidden, onHide, onShow, onManualNext }) {
  const atBottom = !step?.waitFor || step.waitFor.type !== 'scan'
  const wrapStyle = atBottom
    ? styles.coachWrap
    : { ...styles.coachWrap, bottom: 'unset', top: 18 }

  if (!step) return (
    <div style={wrapStyle}>
      <button style={styles.coachBtn} onClick={onShow}>💡</button>
    </div>
  )
  return (
    <div style={wrapStyle}>
      {!hidden && (
        <div style={styles.coachPopup}>
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:7}}>
            <div style={{fontSize:13,fontWeight:700}}>{step.title}</div>
            <button style={{background:'none',border:'none',color:'var(--t3)',cursor:'pointer',fontSize:15,lineHeight:1,padding:'0 0 0 6px'}} onClick={onHide}>✕</button>
          </div>
          <div style={{display:'flex',gap:3,marginBottom:8}}>
            {Array.from({length:total}).map((_,i) => (
              <div key={i} style={{width:5,height:5,borderRadius:'50%',background:i<idx?'rgba(0,230,118,0.4)':i===idx?'var(--g)':'var(--s3)',boxShadow:i===idx?'0 0 4px var(--g)':undefined}} />
            ))}
          </div>
          <div style={{fontSize:12,color:'var(--t2)',lineHeight:1.6,marginBottom:10}} dangerouslySetInnerHTML={{__html:step.body}} />
          {!step.waitFor && (
            <button style={{...styles.btnGreen,padding:'7px 0',fontSize:12}} onClick={onManualNext}>OK →</button>
          )}
        </div>
      )}
      <button style={styles.coachBtn} onClick={hidden ? onShow : onHide}>💡</button>
    </div>
  )
}

// ── SPOTLIGHT ──────────────────────────────────────────────
function Spotlight({ targetId }) {
  const [rect, setRect] = useState(null)
  useEffect(() => {
    const update = () => {
      const el = document.getElementById(targetId)
      if (el) {
        const r = el.getBoundingClientRect()
        setRect({ top: r.top - 6, left: r.left - 6, width: r.width + 12, height: r.height + 12 })
      }
    }
    update()
    const iv = setInterval(update, 500)
    return () => clearInterval(iv)
  }, [targetId])

  if (!rect) return null
  return (
    <div style={{position:'fixed',inset:0,zIndex:149,pointerEvents:'none'}}>
      <div style={{
        position:'absolute',
        top: rect.top, left: rect.left,
        width: rect.width, height: rect.height,
        borderRadius:9,
        pointerEvents:'none',
        border:'2px solid var(--g)',
        animation:'spotPulse 1.6s infinite',
      }} />
      <style>{`@keyframes spotPulse{0%,100%{box-shadow:0 0 0 0 rgba(0,230,118,0.6),0 0 12px 2px rgba(0,230,118,0.25)}55%{box-shadow:0 0 0 6px rgba(0,230,118,0),0 0 18px 4px rgba(0,230,118,0.1)}}`}</style>
    </div>
  )
}

// ── MODAL WRAPPER ──────────────────────────────────────────
function Modal({ children }) {
  return (
    <div style={styles.moOv}>
      <div style={styles.moBox}>{children}</div>
    </div>
  )
}

function OfferRow({ label, val, last }) {
  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:last?0:5,borderTop:last?'1px solid var(--gbr)':undefined,paddingTop:last?6:undefined,marginTop:last?4:undefined}}>
      <span style={{fontSize:12,color:'var(--t2)'}}>{label}</span>
      <span style={{fontSize:13,fontWeight:600,fontFamily:'var(--mono)',color:'var(--g)'}}>{val}</span>
    </div>
  )
}
