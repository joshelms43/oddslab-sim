import { useState, useEffect, useRef, useCallback } from 'react'
import { BOOKIES, ODDS, getAllOpps, fmt } from './data/bookies.js'

// ── ONBOARDING SLIDES ──────────────────────────────────────
const obBox = { background:'var(--gb)', border:'1px solid var(--gbr)', borderRadius:'var(--r)', padding:'13px 15px', textAlign:'left', fontSize:13, color:'var(--t1)', lineHeight:1.6 }
const bankCard = { background:'var(--s1)', border:'1px solid var(--gbr)', borderRadius:14, padding:'14px 28px', display:'inline-block', marginBottom:20, marginTop:8 }

// ── STYLES ─────────────────────────────────────────────────
const styles = {
  appWrap: { display:'flex', flexDirection:'column', minHeight:'100vh', background:'var(--bg)' },
  statusBar: { background:'var(--s1)', borderBottom:'1px solid var(--b1)', padding:'8px 14px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:50 },
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
  coachWrap: { position:'fixed', bottom:0, left:0, right:0, zIndex:600, display:'flex', flexDirection:'column', alignItems:'stretch', padding:'0 0 env(safe-area-inset-bottom)' },
  coachPopup: { background:'var(--s1)', borderTop:'2px solid var(--g)', padding:'16px 18px 20px', boxShadow:'0 -8px 40px rgba(0,0,0,0.6)' },
  coachBtn: { position:'fixed', bottom:18, right:18, width:44, height:44, background:'var(--g)', color:'#0A0D0F', borderRadius:'50%', fontSize:18, cursor:'pointer', boxShadow:'0 4px 14px rgba(0,230,118,0.4)', display:'flex', alignItems:'center', justifyContent:'center', border:'none', zIndex:600 },
  obWrap: { display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', padding:'24px 18px', textAlign:'center', background:'radial-gradient(ellipse at 50% 0%,rgba(0,230,118,0.07) 0%,transparent 60%)' },
  obLogo: { fontSize:20, fontWeight:800, marginBottom:24 },
  obSlide: { width:'100%', maxWidth:480, marginBottom:16 },
  obIcon: { fontSize:38, marginBottom:12 },
  obH: { fontSize:21, fontWeight:800, lineHeight:1.2, marginBottom:10, letterSpacing:-.3 },
  obP: { fontSize:13, color:'var(--t2)', lineHeight:1.7, marginBottom:14, textAlign:'left' },
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
    icon: '🎁',
    title: <>Bookies are handing out <em style={{fontStyle:'normal',color:'var(--g)'}}>free money</em></>,
    body: <>Every Australian bookmaker gives you a <strong>bonus bet</strong> just for signing up. Deposit $50, they hand you $100 free. Sounds great — but there's a catch.</>,
    extra: <div style={obBox}><p>You <strong>can't withdraw the bonus directly</strong>. You have to place it as a bet first. And if you just pick a team and hope for the best, you could lose the lot.</p></div>,
  },
  {
    icon: '💡',
    title: <>The trick — <em style={{fontStyle:'normal',color:'var(--g)'}}>bet both sides</em></>,
    body: <>Place the bonus bet on one team, then use your own cash at Sportsbet to bet on the other team. <strong>One of them always wins.</strong> The bonus money becomes real, withdrawable cash — guaranteed.</>,
    extra: <div style={obBox}><p>OddsLab figures out <strong>exactly which game to use</strong> and how much to bet on each side. You just follow the steps. No maths, no guesswork.</p></div>,
  },
  {
    icon: '🚀',
    title: <>Let's do this <em style={{fontStyle:'normal',color:'var(--g)'}}>in a simulation</em></>,
    body: <>You'll go through a real matched betting trade from start to finish — picking a bookie, scanning the odds, placing 3 bets, and locking in your profit.</>,
    extra: <div style={bankCard}><div style={{fontSize:10,color:'var(--t2)',textTransform:'uppercase',letterSpacing:.6,marginBottom:4}}>Your starting bankroll</div><div style={{fontSize:36,fontWeight:700,fontFamily:'var(--mono)',color:'var(--g)'}}>$1,000.00</div></div>,
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
      body: 'These are the games you can bet on. You don\'t need to pick one yourself — OddsLab will find the best one for you. When you\'re ready, tap <strong>Screenshot all sports</strong> at the bottom, then go to OddsLab to scan.',
      waitFor: { type: 'scan', key: bookieKey },
    },
    {
      title: 'OddsLab is reading the odds',
      body: 'The tool is working out which game gives you the highest guaranteed profit. Click the <strong>OddsLab tab</strong> to see the result.',
      waitFor: { type: 'tab', key: 'oddslab' },
    },
    {
      title: 'Screenshot captured — now scan it',
      body: 'Click the <strong>OddsLab tab</strong> above to switch over.',
      waitFor: { type: 'tab', key: 'oddslab' },
    },
    {
      title: 'Tap Scan to analyse the odds',
      body: 'Tap <strong>Scan screenshots</strong>. OddsLab will read all the odds and find your best opportunity — no maths needed.',
      waitFor: { type: 'scan', key: 'all' },
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
      title: `Day ${bookieKey === 'neds' || bookieKey === 'betr' ? '3' : '2'} — OddsLab is cleared`,
      body: `Fresh start. Head to the <strong>${name} tab</strong> to sign up and claim their bonus offer.`,
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
      body: 'Have a look at the games. When you\'re ready, tap <strong>Screenshot all sports</strong> at the bottom, then head to OddsLab to scan all your screenshots at once.',
      waitFor: { type: 'scan', key: bookieKey },
    },
    {
      title: 'Check your opportunity',
      body: 'Click the <strong>OddsLab tab</strong> to see which game OddsLab picked and how much profit is locked in.',
      waitFor: { type: 'tab', key: 'oddslab' },
    },
    {
      title: 'Screenshot captured — now scan it',
      body: 'Click the <strong>OddsLab tab</strong> above.',
      waitFor: { type: 'tab', key: 'oddslab' },
    },
    {
      title: 'Tap Scan to analyse the odds',
      body: 'Tap <strong>Scan screenshots</strong> to find your best game.',
      waitFor: { type: 'scan', key: 'all' },
    },
    {
      title: 'Place your 3 bets',
      body: 'Tap <strong>Go to bets</strong> on the top result. OddsLab will walk you through each bet one at a time — deposit bet, bonus bet, then the Sportsbet safety net.',
      waitFor: { type: 'gotobets' },
    },
  ]
}

// ── MAIN APP ───────────────────────────────────────────────
export default function App() {
  // Phase: 'onboarding' | 'bookieSelect' | 'app' | 'withdrawal' | 'end'
  const [phase, setPhase] = useState('onboarding')
  const [betStartTime, setBetStartTime] = useState(null)
  const [elapsedSecs, setElapsedSecs] = useState(0)
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
  const [screenshots, setScreenshots] = useState({}) // { bookieKey: true } — captured but not yet scanned
  const [sbSelectStep, setSbSelectStep] = useState(false) // true = sportsbet chosen on select screen
  const [bsPickedBookies, setBsPickedBookies] = useState([])
  const [dayWake, setDayWake] = useState(null) // { profit }
  const [depositModal, setDepositModal] = useState(null) // { key, amount }
  const [scanningKey, setScanningKey] = useState(null)
  const [betGame, setBetGame] = useState(null)
  const [betStep, setBetStep] = useState(0) // 0=deposit,1=bonus,2=hedge
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
              : wf.type === 'scan' && wf.key !== 'all' ? `screenshot-${wf.key}`
              : wf.type === 'scan' && wf.key === 'all' ? 'scan-all-btn'
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
    setTimeout(() => {
      if (day === 1) {
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
    // If betGame is already set and this deposit is for that bookie, resume bet flow
    if (betGame && betGame.srcBookie === key && !isSB) {
      setTimeout(() => {
        coachSet([{
          title: `Bet 1 of 3 — Your deposit bet`,
          body: `Find <strong>${betGame.backTeam}</strong> (odds <strong>${betGame.backOdds.toFixed(2)}</strong>) on the board and tap it. This is a cash bet using your own deposit money.`,
          waitFor: { type: 'oddsclick', team: betGame.backTeam },
        }])
      }, 100)
    }
  }

  // ── SCREENSHOT ─────────────────────────────────────────
  function takeScreenshot(key) {
    // Block if a different bookie already screenshotted and not yet scanned
    const existing = Object.keys(screenshots)
    if (existing.length > 0 && !existing.includes(key)) {
      coachSet([{
        title: 'One bookie at a time',
        body: 'You already have a screenshot ready to scan. Head to the <strong>OddsLab tab</strong> and scan it first before taking a new one.',
        waitFor: null,
      }])
      switchTab('oddslab')
      return
    }
    setScreenshots(s => ({ ...s, [key]: true }))
    coachEvent('scan', key)
  }

  function clearScreenshots() {
    setScreenshots({})
    setScanned([])
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
    }, 2800)
  }

  function scanAllScreenshots() {
    const keys = Object.keys(screenshots)
    if (keys.length === 0) return
    setScanningKey('all')
    setTimeout(() => {
      let allOpps = []
      keys.forEach(key => {
        const bk = bookieState[key]
        if (!bk) return
        const opps = getAllOpps(key, bk.deposit, bk.bonus)
        allOpps = [...allOpps, ...opps]
      })
      setScanned(prev => {
        const existing = new Set(prev.map(g => g.id))
        return [...prev, ...allOpps.filter(o => !existing.has(o.id))].sort((a,b) => b.profit - a.profit)
      })
      setScanningKey(null)
      coachEvent('scan', 'all')
    }, 2800)
  }

  // ── BET FLOW ───────────────────────────────────────────
  // ── TIMER ──────────────────────────────────────────────
  useEffect(() => {
    if (!betStartTime) return
    const iv = setInterval(() => setElapsedSecs(Math.floor((Date.now() - betStartTime) / 1000)), 1000)
    return () => clearInterval(iv)
  }, [betStartTime])

  function startBets(gameId) {
    if (!betStartTime) setBetStartTime(Date.now())
    const game = scanned.find(g => g.id === gameId)
    if (!game) return
    setBetGame(game)
    setBetStep(0)
    setBetSlipOpen(false)
    coachEvent('gotobets')
    // Check if bookie is unlocked — if not, send to sign up first
    if (!bookieState[game.srcBookie]?.unlocked) {
      switchTab(game.srcBookie)
      coachSet([{
        title: `First, sign up to ${BOOKIES[game.srcBookie].name}`,
        body: `Tap <strong>Sign up & claim offer →</strong> to deposit and get your bonus bet. Then we'll place the bets.`,
        waitFor: { type: 'signup', key: game.srcBookie },
      }])
      return
    }
    switchTab(game.srcBookie)
    coachSet([{
      title: `Bet 1 of 3 — Your deposit bet`,
      body: `Find <strong>${game.backTeam}</strong> (odds <strong>${game.backOdds.toFixed(2)}</strong>) on the board and tap it. This is a cash bet using your own deposit money — you get this back if ${game.backTeam} wins.`,
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
    const correctStake = step === 0 ? g.depStake : step === 1 ? g.bonusStake : g.hedge
    const stakeBody = step === 1
      ? `First tap the <strong>Bonus Bet switch</strong> to activate your free money, then type <strong>${correctStake.toFixed(2)}</strong> as the stake. OddsLab calculated that amount. Then tap <strong>Confirm bet →</strong>.`
      : `Type <strong>${correctStake.toFixed(2)}</strong> in the stake field — OddsLab has already worked this out for you. Then tap <strong>Confirm bet →</strong>.`
    coachSet([{
      title: step === 1 ? `Activate your bonus bet` : `Enter the stake amount`,
      body: stakeBody,
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
          body: `Both bets at ${g.backBookie} are placed. Now top up your Sportsbet account with <strong>${fmt(hedgeAmt)}</strong> so you can place the safety net bet. Click the <strong>Sportsbet tab</strong>.`,
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
        // Bet 2: bonus bet, stay on bookie
        coachSet([{
          title: `Bet 2 of 3 — Your bonus bet`,
          body: `Find <strong>${g.backTeam}</strong> (odds <strong>${g.backOdds.toFixed(2)}</strong>) again — but this time flip the <strong>Bonus Bet switch</strong> on the bet slip. This uses the free money the bookie gave you, not your own cash.`,
          waitFor: { type: 'oddsclick', team: g.backTeam },
        }])
      }
    } else {
      // All 3 done
      const profit = g.profit
      setBookieState(s => ({
        ...s,
        [g.srcBookie]: { ...s[g.srcBookie], bonus: 0, profit: s[g.srcBookie].profit + profit, totalBack: g.totalBack },
        sportsbet: { ...s.sportsbet, bal: s.sportsbet.bal - g.hedge },
      }))
      // totalBack is what you receive from the winning bet
      // bankroll already had -dep and -hedge subtracted, so add totalBack back
      setBankroll(b => b + g.totalBack)
      setTotalProfit(p => p + profit)
      if (!completedBookies.includes(g.srcBookie)) {
        setCompletedBookies(prev => [...prev, g.srcBookie])
        setAllTimeCompletedBookies(prev => prev.includes(g.srcBookie) ? prev : [...prev, g.srcBookie])
      }
      setScanned(prev => prev.filter(x => x.id !== g.id))
      setBetGame(null)
      setBetStep(0)
      // Randomly pick which team "won" for the result moment
      const backWon = Math.random() > 0.5
      setProfitFlash({
        profit: g.profit,
        totalBack: g.totalBack,
        backTeam: g.backTeam,
        backBookie: g.backBookie,
        hedgeTeam: g.hedgeTeam,
        depStake: g.depStake,
        bonusStake: g.bonusStake,
        hedge: g.hedge,
        backOdds: g.backOdds,
        hedgeOdds: g.hedgeOdds,
        winTeam: backWon ? g.backTeam : g.hedgeTeam,
        winBookie: backWon ? g.backBookie : 'Sportsbet',
        winReturn: backWon ? g.totalBack : g.hedge * g.hedgeOdds,
      })
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
    setPhase('end')
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
    // Return any remaining Sportsbet balance
    const sbBalance = bookieState.sportsbet.bal || 0
    setBankroll(b => b + sbBalance)
    // Clear all game/bet state for the new day
    setScanned([])
    setScreenshots({})
    setBetGame(null)
    setBetStep(0)
    setBetSlipOpen(false)
    setPendingHedgeDeposit(null)
    setCompletedBookies([])
    setSelectedBookies([])
    // Reset sportsbet balance for new day (keep unlocked)
    setBookieState(s => ({
      ...s,
      sportsbet: { ...s.sportsbet, bal: 0 },
    }))
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
      elapsedSecs={elapsedSecs}
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
          <span style={{fontSize:11,color:'var(--t2)'}}>Profit: <span style={{fontFamily:'var(--mono)',color:'var(--g)',fontWeight:700}}>{totalProfit >= 0 ? '+' : ''}{fmt(totalProfit)}</span></span>
          <span style={{fontSize:11,color:'var(--t2)'}}>Bankroll: <span style={{fontFamily:'var(--mono)',color:'var(--g)',fontWeight:700}}>{fmt(bankroll)}</span></span>
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
      <div style={{flex:1, paddingBottom: 140}}>
        {activeTab === 'oddslab' && (
          <OddsLabPanel
            scanned={scanned}
            screenshots={screenshots}
            onGoBets={startBets}
            onScanAll={scanAllScreenshots}
            onClear={clearScreenshots}
            scanningAll={scanningKey === 'all'}
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
            onScreenshot={null}
            onOddsClick={onOddsClick}
            betGame={betGame}
            betStep={betStep}
            refFn={ref}
            isSportsbet
            pendingHedgeDeposit={pendingHedgeDeposit}
            hasScreenshot={false}
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
            onScreenshot={() => takeScreenshot(k)}
            onOddsClick={onOddsClick}
            betGame={betGame}
            betStep={betStep}
            refFn={ref}
            hasScreenshot={!!screenshots[k]}
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
          bonusBalance={betGame ? bookieState[betGame.srcBookie]?.bonus : 0}
          correctStake={betGame ? (betStep === 0 ? betGame.depStake : betStep === 1 ? betGame.bonusStake : betGame.hedge) : 0}
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
          {slide === OB_SLIDES.length-1 ? "Let's go →" : 'Next →'}
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
  const totalProfit = completedBookies.reduce((s, k) => s + (bookieState[k].profit || 0), 0)
  const totalDeposit = completedBookies.reduce((s, k) => s + (bookieState[k].deposit || 0), 0)
  const totalWithdraw = completedBookies.reduce((s, k) => s + (bookieState[k].totalBack || (bookieState[k].deposit + bookieState[k].profit) || 0), 0)
  return (
    <div style={styles.bsWrap}>
      <div style={{...styles.bsInner, maxWidth:440}}>
        <div style={styles.sLogo}>odds<em style={{fontStyle:'normal',color:'var(--g)'}}>lab</em></div>
        <div style={styles.dayPill}>Day {day}</div>
        <div style={styles.bsH}>Withdraw your winnings 💰</div>
        <div style={styles.bsP}>The game has settled. Here's what's sitting in your bookie account right now, ready to withdraw to your bank.</div>
        <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:16}}>
          {completedBookies.map(k => (
            <div key={k} style={styles.wdAcc}>
              <div>
                <div style={{fontSize:13,fontWeight:600}}>{BOOKIES[k].name}</div>
                <div style={{fontSize:11,color:'var(--t2)'}}>
                  Profit: <span style={{fontFamily:'var(--mono)',color:'var(--g)'}}>+{fmt(bookieState[k].profit||0)}</span>
                </div>
              </div>
              <div style={{fontSize:14,fontWeight:700,fontFamily:'var(--mono)',color:'white'}}>{fmt(bookieState[k].totalBack || 0)}</div>
            </div>
          ))}
        </div>
        <div style={{background:'rgba(0,230,118,0.06)',border:'1px solid rgba(0,230,118,0.15)',borderRadius:8,padding:'12px 16px',marginBottom:16,fontSize:12,color:'var(--t2)',lineHeight:1.6}}>
          This is the <strong style={{color:'white'}}>full payout</strong> from the winning bet — your original deposit is inside that number. Your pure profit is <strong style={{color:'var(--g)'}}>+{fmt(totalProfit)}</strong>. It would have been the same amount no matter which team won.
        </div>
        <div style={styles.wdTotalBox}>
          <div>
            <div style={{fontSize:11,color:'var(--t2)',marginBottom:3}}>Total withdrawing</div>
            <div style={{fontSize:22,fontWeight:700,fontFamily:'var(--mono)',color:'var(--g)'}}>{fmt(totalWithdraw)}</div>
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
function BookiePane({ bookieKey, bk, state, sport, onSportSwitch, onSignup, onScreenshot, onOddsClick, betGame, betStep, refFn, isSportsbet, pendingHedgeDeposit, hasScreenshot }) {
  const sports = ['afl','nrl','nba','mlb']
  const isScanning = false
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
            Here's why you need to deposit here: the bonus bet from your bookie can't be withdrawn directly — you have to <strong>place it as a bet first</strong>.<br/><br/>
            So we place the bonus bet on one team, then use <strong>your own money here at Sportsbet</strong> to bet on the other team. One of them always wins — and together, you come out ahead.<br/><br/>
            <span style={{color:'var(--g)',fontWeight:600}}>OddsLab has calculated exactly how much you need — no maths required.</span>
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

          {onScreenshot && (
            <div
              id={`screenshot-${bookieKey}`}
              ref={refFn(`screenshot-${bookieKey}`)}
              style={styles.scanStrip}
            >
              {hasScreenshot ? (
                <>
                  <p style={{fontSize:12,color:'var(--g)',fontWeight:600}}>✓ Screenshot captured</p>
                  <button style={{...styles.btnScan,background:'var(--s2)',color:'var(--t2)',border:'1px solid var(--b2)'}} onClick={onScreenshot}>Retake</button>
                </>
              ) : (
                <>
                  <p style={{fontSize:12,color:'var(--t2)'}}>Capture the odds board for OddsLab to analyse</p>
                  <button style={styles.btnScan} onClick={onScreenshot}>📸 Screenshot all sports</button>
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
function OddsLabPanel({ scanned, screenshots, onGoBets, onScanAll, onClear, scanningAll, refFn }) {
  const screenshotCount = Object.keys(screenshots).length
  const totalSports = screenshotCount * 4
  return (
    <div style={{padding:'16px 18px'}}>
      {screenshotCount > 0 && scanned.length === 0 && (
        <div style={{background:'var(--gb)',border:'1px solid var(--gbr)',borderRadius:'var(--r)',padding:'14px 16px',marginBottom:16}}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>
            {screenshotCount} bookie{screenshotCount > 1 ? 's' : ''} screenshotted — {totalSports} sport screens ready
          </div>
          <div style={{fontSize:12,color:'var(--t2)',marginBottom:12}}>OddsLab will read all of them and find your best opportunity across every bookie.</div>
          {scanningAll ? (
            <div style={{fontSize:12,color:'var(--g)',fontFamily:'var(--mono)'}}>Scanning...</div>
          ) : (
            <div style={{display:'flex',gap:8}}>
              <button
                id="scan-all-btn"
                ref={refFn('scan-all-btn')}
                style={{...styles.btnGreen,padding:'9px 16px',fontSize:12,flex:1}}
                onClick={onScanAll}
              >
                📸 Scan {totalSports} screenshots
              </button>
              <button
                style={{background:'var(--s2)',border:'1px solid var(--b2)',color:'var(--t2)',borderRadius:'var(--r)',padding:'9px 14px',fontSize:12,cursor:'pointer'}}
                onClick={onClear}
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}
      {scanned.length > 0 && (
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <div>
            <div style={{fontSize:15,fontWeight:700}}>Scanned opportunities</div>
            <div style={{fontSize:12,color:'var(--t2)'}}>Ranked by guaranteed profit</div>
          </div>
          <button
            style={{background:'var(--s2)',border:'1px solid var(--b2)',color:'var(--t2)',borderRadius:'var(--r)',padding:'6px 12px',fontSize:11,cursor:'pointer'}}
            onClick={onClear}
          >
            Clear all
          </button>
        </div>
      )}
      <div id="ol-list" ref={refFn('ol-list')}>
        {scanned.length === 0 && screenshotCount === 0 ? (
          <div style={{textAlign:'center',padding:'44px 20px',color:'var(--t2)'}}>
            <div style={{fontSize:30,marginBottom:9,opacity:.3}}>📸</div>
            <p style={{fontSize:13,lineHeight:1.6}}>No games yet.<br/>Go to a bookie tab, browse the odds, then tap <strong>Take Screenshot</strong>.</p>
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
function BetSlip({ game: g, step, stakeInput, onStakeChange, onConfirm, onClose, bonusBalance, correctStake }) {
  const [bonusToggled, setBonusToggled] = useState(false)
  const tags = [
    `Bet 1 of 3 — ${g.backBookie} (your deposit)`,
    `Bet 2 of 3 — ${g.backBookie} (bonus bet)`,
    `Bet 3 of 3 — Sportsbet (safety net)`,
  ]
  const subs = [
    `A regular cash bet on ${g.backTeam} using your own deposit money. If ${g.backTeam} wins, you get your stake back plus profit.`,
    `Now use your bonus bet — the free money ${g.backBookie} gave you. Toggle the switch below to activate it, then enter the stake amount.`,
    `Your safety net bet on ${g.hedgeTeam} at Sportsbet. If ${g.hedgeTeam} wins, this pays out. Either way — you're covered.`,
  ]
  const team = step < 2 ? g.backTeam : g.hedgeTeam
  const odds = step < 2 ? g.backOdds : g.hedgeOdds
  const isBonus = step === 1
  const stake = parseFloat(stakeInput) || 0
  const ret = isBonus ? stake * (odds - 1) : stake * odds

  // Validation
  const stakeCorrect = stake > 0 && Math.abs(stake - correctStake) < 0.1
  const toggleCorrect = isBonus ? bonusToggled : !bonusToggled
  const canConfirm = stakeCorrect && toggleCorrect

  let errorMsg = null
  if (stake > 0 && !stakeCorrect) errorMsg = `OddsLab calculated $${correctStake.toFixed(2)} — please enter that exact amount.`
  else if (isBonus && !bonusToggled) errorMsg = 'Tap the Bonus Bet switch above to activate your free money.'
  else if (!isBonus && bonusToggled) errorMsg = 'Turn off the Bonus Bet switch — this is a regular cash bet.'

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

        {step !== 2 && (
        <div
          style={{display:'flex',alignItems:'center',justifyContent:'space-between',background: bonusToggled ? 'var(--gb)' : 'var(--s2)',border:`1px solid ${bonusToggled ? 'var(--gbr)' : 'var(--b2)'}`,borderRadius:'var(--rs)',padding:'10px 13px',marginBottom:11,cursor: isBonus ? 'pointer' : 'default',transition:'all .2s',opacity: isBonus ? 1 : 0.4}}
          onClick={() => isBonus && setBonusToggled(t => !t)}
        >
          <div>
            <div style={{fontSize:12,fontWeight:600,marginBottom:1,color: bonusToggled ? 'var(--g)' : 'var(--t1)'}}>Bonus Bet {bonusToggled ? '✓ Active' : ''}</div>
            <div style={{fontSize:11,color:'var(--t2)'}}>Balance: <span style={{fontFamily:'var(--mono)',color: bonusToggled ? 'var(--g)' : 'var(--t2)'}}>{fmt(bonusBalance || 0)}</span></div>
          </div>
          <div style={{width:42,height:24,background: bonusToggled ? 'var(--g)' : 'var(--s3)',borderRadius:12,display:'flex',alignItems:'center',justifyContent: bonusToggled ? 'flex-end' : 'flex-start',padding:'0 3px',transition:'all .2s'}}>
            <div style={{width:18,height:18,background:'#0A0D0F',borderRadius:'50%'}} />
          </div>
        </div>
        )}

        <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:11}}>
          <div style={{fontSize:12,color:'var(--t2)',whiteSpace:'nowrap'}}>Stake ($)</div>
          <input
            style={{...styles.stakeInp, ...(stake > 0 && !stakeCorrect ? {borderColor:'#ff4444'} : stakeCorrect ? {borderColor:'var(--g)'} : {})}}
            type="number"
            placeholder={`Enter $${correctStake.toFixed(2)}`}
            value={stakeInput}
            onChange={e => onStakeChange(e.target.value)}
            autoFocus
          />
        </div>
        <div style={styles.retBox}>
          <div style={{fontSize:12,color:'var(--t2)'}}>{isBonus ? 'Profit if wins (bonus stake not returned)' : 'Return if wins'}</div>
          <div style={{fontSize:15,fontWeight:700,fontFamily:'var(--mono)',color:'var(--g)'}}>{fmt(ret)}</div>
        </div>
        {errorMsg && (
          <div style={{fontSize:11,color:'#ff8800',textAlign:'center',marginBottom:8,padding:'6px 10px',background:'rgba(255,136,0,0.08)',borderRadius:6}}>
            ⚠️ {errorMsg}
          </div>
        )}
        <button
          style={{...styles.btnGreen,width:'100%',padding:12,fontSize:13,opacity:canConfirm?1:0.4}}
          onClick={() => { if (canConfirm) onConfirm() }}
          disabled={!canConfirm}
        >
          Confirm bet →
        </button>
      </div>
    </div>
  )
}

// ── PROFIT FLASH ───────────────────────────────────────────
function ProfitFlash({ profit, totalBack, backTeam, backBookie, hedgeTeam, depStake, bonusStake, hedge, backOdds, hedgeOdds, winTeam, winBookie, winReturn, bankroll, onClose }) {
  const loseTeam = winTeam === backTeam ? hedgeTeam : backTeam
  // Show what would have happened if the other team won
  const altReturn = winTeam === backTeam
    ? (hedge * hedgeOdds).toFixed(2)
    : totalBack?.toFixed(2) || '—'

  return (
    <div style={styles.pfOv}>
      <div style={{fontSize:11,fontWeight:600,color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:1,marginBottom:16}}>Game result</div>

      {/* Team won moment */}
      <div style={{background:'var(--gb)',border:'1px solid var(--gbr)',borderRadius:12,padding:'16px 20px',marginBottom:20,width:'100%',maxWidth:320,textAlign:'center'}}>
        <div style={{fontSize:12,color:'var(--t2)',marginBottom:6}}>🏆 Winner</div>
        <div style={{fontSize:22,fontWeight:800,marginBottom:4}}>{winTeam}</div>
        <div style={{fontSize:12,color:'var(--t2)'}}>Your {winBookie} bet pays out</div>
        <div style={{fontSize:28,fontWeight:700,fontFamily:'var(--mono)',color:'var(--g)',marginTop:6}}>{fmt(parseFloat(winReturn) || 0)}</div>
      </div>

      {/* Profit locked */}
      <div style={{fontSize:13,color:'var(--t2)',marginBottom:4}}>Your guaranteed profit</div>
      <div style={{fontSize:52,fontWeight:700,fontFamily:'var(--mono)',color:'var(--g)',marginBottom:4,lineHeight:1}}>+{fmt(profit)}</div>

      {/* The key insight */}
      <div style={{background:'rgba(0,230,118,0.06)',border:'1px solid rgba(0,230,118,0.15)',borderRadius:8,padding:'12px 16px',marginBottom:20,maxWidth:320,width:'100%',textAlign:'left'}}>
        <div style={{fontSize:12,fontWeight:600,color:'var(--g)',marginBottom:6}}>What if {loseTeam} had won instead?</div>
        <div style={{fontSize:12,color:'var(--t2)',lineHeight:1.6}}>
          Your other bet would have paid out <strong style={{color:'white'}}>{fmt(parseFloat(altReturn) || 0)}</strong> — and your profit would still be <strong style={{color:'var(--g)'}}>+{fmt(profit)}</strong>. The numbers are set up so it's always the same, no matter who wins.
        </div>
      </div>

      <div style={{fontSize:12,color:'var(--t2)',marginBottom:20}}>Bankroll: <strong style={{color:'var(--g)',fontFamily:'var(--mono)'}}>{fmt(bankroll)}</strong></div>
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
function EndScreen({ totalProfit, elapsedSecs }) {
  const mins = Math.floor(elapsedSecs / 60)
  const secs = elapsedSecs % 60
  const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs} seconds`
  return (
    <div style={{...styles.pfOv, justifyContent:'center', gap:0, overflowY:'auto', alignItems:'center'}}>
      <div style={{fontSize:20,fontWeight:800,marginBottom:16}}>odds<em style={{fontStyle:'normal',color:'var(--g)'}}>lab</em></div>
      <div style={{fontSize:11,fontWeight:600,color:'var(--t2)',textTransform:'uppercase',letterSpacing:1,marginBottom:8}}>You just made</div>
      <div style={{fontSize:62,fontWeight:800,fontFamily:'var(--mono)',color:'var(--g)',lineHeight:1,marginBottom:8}}>+{fmt(totalProfit)}</div>
      {elapsedSecs > 0 && (
        <div style={{fontSize:13,color:'var(--t2)',marginBottom:24}}>in <strong style={{color:'white'}}>{timeStr}</strong></div>
      )}
      <div style={{fontSize:14,fontWeight:600,maxWidth:320,lineHeight:1.8,marginBottom:28,textAlign:'center',color:'var(--t1)'}}>
        You did this using real odds, real offers, and real techniques.<br/>Why not do it for real?
      </div>
      <button
        style={{...styles.btnGreen,padding:'16px 32px',width:'100%',maxWidth:380,fontSize:16,fontWeight:700,marginBottom:12,borderRadius:14}}
        onClick={() => window.open('https://oddslab-theta.vercel.app','_blank')}
      >
        Try OddsLab free for 3 days →
      </button>
      <div style={{fontSize:11,color:'var(--t3)',maxWidth:340,lineHeight:1.6,marginTop:8,textAlign:'center'}}>
        Simulated using realistic Australian betting market odds. Matched betting involves financial risk. Please gamble responsibly.
      </div>
    </div>
  )
}


// ── COACH ──────────────────────────────────────────────────
function Coach({ step, idx, total, hidden, onHide, onShow, onManualNext }) {
  const isTopMode = step?.waitFor?.type === 'scan' && step?.waitFor?.key !== 'all'
  const wrapStyle = isTopMode
    ? { ...styles.coachWrap, bottom:'unset', top:0, borderTop:'none', borderBottom:'2px solid var(--g)', boxShadow:'0 8px 40px rgba(0,0,0,0.6)' }
    : styles.coachWrap

  if (!step || hidden) return <button style={styles.coachBtn} onClick={onShow}>💡</button>

  return (
    <div style={wrapStyle}>
      {!isTopMode && step?.waitFor && (
        <div style={{textAlign:'center',fontSize:24,lineHeight:1,marginBottom:2,animation:'bounce 1s infinite'}}>↑</div>
      )}
      <div style={styles.coachPopup}>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:6}}>
          <div style={{fontSize:14,fontWeight:700,flex:1,paddingRight:8,lineHeight:1.3}}>{step.title}</div>
          <button style={{background:'none',border:'none',color:'var(--t3)',cursor:'pointer',fontSize:16,lineHeight:1,flexShrink:0}} onClick={onHide}>✕</button>
        </div>
        <div style={{display:'flex',gap:3,marginBottom:10}}>
          {Array.from({length:total}).map((_,i) => (
            <div key={i} style={{height:3,flex:1,borderRadius:2,background:i<idx?'rgba(0,230,118,0.5)':i===idx?'var(--g)':'var(--s3)',transition:'background .3s'}} />
          ))}
        </div>
        <div style={{fontSize:13,color:'var(--t2)',lineHeight:1.65,marginBottom:step.waitFor?0:12}} dangerouslySetInnerHTML={{__html:step.body}} />
        {!step.waitFor && (
          <button style={{...styles.btnGreen,padding:'10px 0',fontSize:13,marginTop:12}} onClick={onManualNext}>Got it →</button>
        )}
      </div>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}`}</style>
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
