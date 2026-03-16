/* ═══════════════════════════════════════════════════
   KRYPTIV · APP SHELL
   Loads real prices → renders app
   Shows error if all APIs fail (no fake fallback)
═══════════════════════════════════════════════════ */

/* ── SPARKLINE ── */
function Spark({prices, ch, w=44, h=20}) {
  // If we have real price array use it, else generate directional line
  let pts;
  if (prices && prices.length >= 2) {
    const vals = prices.slice(-12);
    const mn = Math.min(...vals), mx = Math.max(...vals), rng = mx - mn || 1;
    pts = vals.map((v, i) => ({ x:(i/(vals.length-1))*w, y: h - ((v-mn)/rng)*h }));
  } else {
    pts = Array.from({length:12}, (_,i) => {
      const t = i/11, tr = (ch||0)>=0 ? t*.3 : -t*.3;
      return { x:(i/11)*w, y: h - (0.5 + tr + Math.sin(i*1.4)*.08)*h };
    });
  }
  const d = pts.map((p,i) => `${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const color = (ch||0) >= 0 ? 'rgba(255,255,255,.7)' : 'rgba(255,255,255,.3)';
  return (
    <svg width={w} height={h} style={{display:'block'}}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.2"/>
    </svg>
  );
}

/* ── BIG SPARK ── */
function BigSpark({prices, ch}) {
  const sw=320, sh=72;
  let pts;
  if (prices && prices.length >= 2) {
    const vals = prices.map(p => typeof p === 'number' ? p : p[1]);
    const mn = Math.min(...vals), mx = Math.max(...vals), rng = mx-mn||1;
    pts = vals.map((v,i) => ({ x:(i/(vals.length-1))*sw, y:sh-((v-mn)/rng)*sh }));
  } else {
    pts = Array.from({length:24}, (_,i) => {
      const t=i/23, base=(ch||0)/100*1.5;
      return { x:(i/23)*sw, y:sh-(0.5+base*t+Math.sin(i*.8)*.06)*sh };
    });
  }
  const d = pts.map((p,i) => `${i===0?'M':'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const color = (ch||0) >= 0 ? 'rgba(255,255,255,.6)' : 'rgba(255,255,255,.2)';
  return (
    <svg viewBox={`0 0 ${sw} ${sh}`} preserveAspectRatio="none" style={{width:'100%',height:sh,display:'block'}}>
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#fff" stopOpacity={(ch||0)>=0?.08:.03}/>
          <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={`${d} L${sw},${sh} L0,${sh} Z`} fill="url(#sg)"/>
      <path d={d} fill="none" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
}

/* ── TICKER ── */
function Ticker({coins}) {
  if (!coins || coins.length === 0) return <div className="tb-ticker"/>;
  const items = [...coins, ...coins];
  return (
    <div className="tb-ticker">
      <div className="ticker-track">
        {items.map((c,i) => (
          <div key={i} className="tick">
            <span className="tick-sym">{c.sym}</span>
            <span className="tick-pr">{fp(c.price)}</span>
            <span className={`tick-ch ${(c.ch||0)>=0?'up':'dn'}`}>
              {(c.ch||0)>=0?'▴':'▾'}{Math.abs(c.ch||0).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── PRICE ERROR STATE ── */
function PriceError({errors, onRetry}) {
  return (
    <div style={{
      position:'fixed', inset:0, zIndex:500,
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      background:'rgba(0,0,0,.92)', backdropFilter:'blur(20px)', padding:32, textAlign:'center',
    }}>
      <span className="mi" style={{fontSize:36, color:'rgba(255,100,80,.8)', marginBottom:16}}>wifi_off</span>
      <div style={{fontFamily:'var(--disp)', fontSize:28, letterSpacing:3, marginBottom:8}}>
        COULD NOT LOAD PRICES
      </div>
      <div style={{fontFamily:'var(--mono)', fontSize:8, color:'var(--w4)', letterSpacing:2, lineHeight:2.2, marginBottom:24, maxWidth:360}}>
        KRYPTIV REQUIRES A LIVE INTERNET CONNECTION.<br/>
        WE TRIED COINGECKO, BINANCE, AND KRAKEN.<br/>
        ALL FAILED. NO FAKE DATA WILL BE SHOWN.
      </div>
      {errors && errors.length > 0 && (
        <div style={{fontFamily:'var(--mono)', fontSize:8, color:'rgba(255,100,80,.5)', marginBottom:20, lineHeight:2}}>
          {errors.map((e,i) => <div key={i}>{e}</div>)}
        </div>
      )}
      <button
        onClick={onRetry}
        style={{padding:'11px 24px', background:'var(--w)', color:'#000', border:'none',
          fontFamily:'var(--sans)', fontWeight:700, fontSize:9, letterSpacing:3,
          textTransform:'uppercase', cursor:'pointer'}}
      >
        RETRY
      </button>
    </div>
  );
}

/* ── PRICE LOADING STATE ── */
function PriceLoading() {
  return (
    <div style={{
      position:'fixed', inset:0, zIndex:500,
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      background:'rgba(0,0,0,.88)', backdropFilter:'blur(12px)',
    }}>
      <div style={{fontFamily:'var(--disp)', fontSize:42, letterSpacing:2, marginBottom:8, animation:'pulse 1.8s ease-in-out infinite'}}>KRYPTIV</div>
      <div style={{fontFamily:'var(--mono)', fontSize:8, letterSpacing:5, color:'var(--w4)', textTransform:'uppercase', marginBottom:16}}>Fetching live prices…</div>
      <div style={{display:'flex', gap:6}}>
        {[0,1,2].map(i => <div key={i} style={{width:4,height:4,background:'var(--w4)',animation:`pulse 1.2s ease-in-out ${i*.2}s infinite`}}/>)}
      </div>
    </div>
  );
}

/* ── MOBILE NAV OVERLAY ── */
function NavOverlay({view, go, onClose}) {
  return (
    <div className="nav-ov" onClick={onClose}>
      <div className="nav-ov-header" onClick={e=>e.stopPropagation()}>
        <div className="nav-ov-logo">KRYPTIV</div>
        <button className="nav-ov-close-btn" onClick={onClose}>
          <span className="mi">close</span>
        </button>
      </div>
      <div className="nav-ov-list" onClick={e=>e.stopPropagation()}>
        {NAV_ITEMS.map(n => (
          <div key={n.id} className={`nav-ov-it${view===n.id?' on':''}`} onClick={()=>go(n.id)}>
            <span className="mi">{n.icon}</span>
            {n.lbl}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── APP SHELL ── */
function AppShell({user, setUser, view, children}) {
  const {useState: useS, useEffect: useE} = React;
  const [navOpen,   setNavOpen]   = useS(false);
  const [coins,     setCoins]     = useS(null);      // null = loading
  const [priceErr,  setPriceErr]  = useS(null);      // array of error strings
  const [priceSrc,  setPriceSrc]  = useS('');
  const [retryKey,  setRetryKey]  = useS(0);

  useE(() => {
    let stopped = false;
    const stop = startPriceUpdates(
      (newCoins, src) => {
        if (stopped) return;
        setCoins(newCoins);
        setPriceSrc(src);
        setPriceErr(null);
        window._liveCoins = newCoins;
      },
      (errors) => {
        if (stopped) return;
        // Only show error if we have no coins yet
        setCoins(prev => {
          if (!prev) setPriceErr(errors);
          return prev;
        });
      }
    );
    return () => { stopped = true; stop(); };
  }, [retryKey]);

  const go = id => {
    setNavOpen(false);
    const n = NAV_ITEMS.find(x => x.id === id);
    if (n) window.location.href = n.path;
  };

  const handleSignOut = () => { LS.clear(); window.location.href = '/'; };

  if (priceErr) return <PriceError errors={priceErr} onRetry={() => { setPriceErr(null); setRetryKey(k=>k+1); }}/>;
  if (!coins)   return <PriceLoading/>;

  const availCoins = user.tier === 'free'
    ? coins.filter(c => FREE_COINS.includes(c.sym))
    : coins;

  return (
    <div className="app">
      {/* ── SIDEBAR ── */}
      <div className="sidebar">
        <div className="sb-head">
          <div className="sb-logo">KRYPTIV</div>
          <div className="sb-uid">ID <span>{user.kryptid}</span></div>
        </div>
        <div className="sb-hr"/>
        <nav className="sb-nav">
          <div className="nav-grp">Navigation</div>
          {NAV_ITEMS.map(n => (
            <div key={n.id} className={`nav-it${view===n.id?' on':''}`} onClick={()=>go(n.id)}>
              <span className="mi">{n.icon}</span>
              {n.lbl}
              {n.id==='ai' && <span className="nav-badge">FREE</span>}
            </div>
          ))}
        </nav>
        <div className="sb-foot">
          <div className="sb-hr" style={{marginBottom:8}}/>
          <div className="tier-row" onClick={()=>go('plans')}>
            <div className="tier-dot"/>
            <div className="tier-info">
              <div className="tier-lbl">Plan</div>
              <div className="tier-nm">{(user.tier||'free').toUpperCase()}</div>
            </div>
            <span className="mi" style={{fontSize:13,color:'var(--w4)'}}>chevron_right</span>
          </div>
          <div className="sb-logout" onClick={handleSignOut}>
            <span className="mi">logout</span>{user.name}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="content">
        <div className="topbar">
          <div className="tb-logo">KRYPTIV</div>
          <div className="tb-title">{NAV_ITEMS.find(n=>n.id===view)?.lbl}</div>
          <Ticker coins={coins}/>
          <div className="tb-right">
            <div className="ic-btn" title={`Live data · ${priceSrc}`}>
              <span className="mi" style={{fontSize:10, color:'rgba(130,255,150,.7)'}}>fiber_manual_record</span>
            </div>
            <div className="tier-chip" onClick={()=>go('plans')}>{(user.tier||'free').toUpperCase()}</div>
          </div>
        </div>

        <div className="main">
          {/* Pass coins + availCoins into children via context trick */}
          {React.cloneElement(children, { coins, availCoins, priceSrc })}
        </div>
      </div>

      {/* ── BOTTOM NAV (mobile) ── */}
      <div className="botnav">
        {['dashboard','ai','news'].map(id => {
          const n = NAV_ITEMS.find(x=>x.id===id);
          return (
            <button key={id} className={`bn-it${view===id?' on':''}`} onClick={()=>go(id)}>
              <span className="mi">{n.icon}</span>{n.lbl}
            </button>
          );
        })}
        <button className="bn-more-btn" onClick={()=>setNavOpen(true)}>
          <div className="bn-sq"><span className="mi">grid_view</span></div>
          <div className="bn-sq-lbl">More</div>
        </button>
      </div>

      {navOpen && <NavOverlay view={view} go={go} onClose={()=>setNavOpen(false)}/>}
    </div>
  );
}
