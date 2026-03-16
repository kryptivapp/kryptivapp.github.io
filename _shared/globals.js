/* ═══════════════════════════════════════════════════
   KRYPTIV · GLOBALS
   Real live prices — CoinGecko → Binance → Kraken
   NO hardcoded prices. NO fake data. Ever.
═══════════════════════════════════════════════════ */

/* ── LOCAL STORAGE ── */
const LS = {
  get:   ()  => { try { return JSON.parse(localStorage.getItem('kryptiv_u') || 'null'); } catch { return null; } },
  set:   u   => { try { localStorage.setItem('kryptiv_u', JSON.stringify(u)); } catch {} },
  clear: ()  => { try { localStorage.removeItem('kryptiv_u'); } catch {} },
};

/* ── COIN MANIFEST — ids, symbols, names only. Prices always from API. ── */
const COIN_LIST = [
  { id:'bitcoin',        sym:'BTC',  name:'Bitcoin'    },
  { id:'ethereum',       sym:'ETH',  name:'Ethereum'   },
  { id:'solana',         sym:'SOL',  name:'Solana'     },
  { id:'binancecoin',    sym:'BNB',  name:'BNB'        },
  { id:'ripple',         sym:'XRP',  name:'XRP'        },
  { id:'cardano',        sym:'ADA',  name:'Cardano'    },
  { id:'avalanche-2',    sym:'AVAX', name:'Avalanche'  },
  { id:'polkadot',       sym:'DOT',  name:'Polkadot'   },
  { id:'chainlink',      sym:'LINK', name:'Chainlink'  },
  { id:'dogecoin',       sym:'DOGE', name:'Dogecoin'   },
  { id:'matic-network',  sym:'POL',  name:'Polygon'    },
  { id:'uniswap',        sym:'UNI',  name:'Uniswap'    },
  { id:'near',           sym:'NEAR', name:'NEAR'       },
  { id:'arbitrum',       sym:'ARB',  name:'Arbitrum'   },
  { id:'optimism',       sym:'OP',   name:'Optimism'   },
];

/* ── FREE PLAN COINS ── */
const FREE_COINS = ['BTC', 'SOL'];

/* ── TIERS ── */
const TIERS = ['free', 'budget', 'pro', 'atmosphere'];

/* ── PLANS ── */
const PLANS = [
  {
    id:'free', nm:'FREE', pr:'$0', desc:'Always free · no card required',
    feats:['Bitcoin & Solana — live data','Unlimited AI analysis','Live news feed','Investment simulator']
  },
  {
    id:'budget', nm:'BUDGET', pr:'$3.90 / mo', desc:'per month · cancel anytime',
    feats:['All 15 coins tracked live','3B AI assistant','5 price alerts · Export CSV','Risk & diversification score','Coin detail analysis']
  },
  {
    id:'pro', nm:'PRO', pr:'$14.90 / mo', desc:'per month · cancel anytime',
    feats:['Unlimited coins','8B AI assistant','Personalized portfolio guidance','Early gem alerts','Exchange connect (read-only)','Full historical analytics']
  },
  {
    id:'atmosphere', nm:'ATMOSPHERE', pr:'$44.90 / mo', desc:'per month · invite-only',
    feats:['Everything in Pro','Invite 2 friends → free Pro','Whale movement alerts','Custom AI signals · Experimental AI','AI-generated insight feed','Exclusive deep-dive analysis']
  },
];

/* ── AI PRESET QUESTIONS ── */
const AI_PRESETS = [
  {
    id:'invest',
    label:'Should I invest in',
    build:(sym,c) => `${sym} (${c ? c.name : sym}) is currently trading at ${c ? fp(c.price) : 'current market price'} with a 24h change of ${c ? fc(c.ch) : 'unknown'}. Market cap rank: ${c ? '#'+c.rank : 'top 20'}. Should I invest in ${sym} right now? Give a thorough, honest analysis covering: current momentum, on-chain signals, macro environment, key risks, and a clear recommendation. Be direct.`
  },
  {
    id:'outlook',
    label:'Outlook for',
    build:(sym,c) => `${sym} is currently at ${c ? fp(c.price) : 'current price'}, ${c ? fc(c.ch) : ''} today. What is the current market outlook for ${sym}? Cover short-term price action (next 1–2 weeks), medium-term thesis (1–3 months), key macro factors, support/resistance levels to watch, and any catalysts upcoming. Be thorough.`
  },
  {
    id:'cashout',
    label:'Should I cash out of',
    build:(sym,c) => `I hold ${sym} which is currently at ${c ? fp(c.price) : 'current price'} (24h: ${c ? fc(c.ch) : 'N/A'}). Should I take profit or continue holding? Give me a detailed analysis: profit-taking strategy, what price levels matter, risk factors for holding vs selling, tax considerations, and a clear recommendation.`
  },
  {
    id:'compare',
    label:'Compare BTC vs',
    build:(sym,c,coins) => {
      const btc = coins ? coins.find(x=>x.sym==='BTC') : null;
      return `Compare Bitcoin (BTC${btc ? ', currently '+fp(btc.price)+', 24h: '+fc(btc.ch) : ''}) against ${sym} (${c ? fp(c.price)+', 24h: '+fc(c.ch) : 'current price'}) as investments right now. Cover: risk profile, liquidity, growth potential, use case strength, which suits a conservative vs aggressive investor, and a clear verdict.`;
    }
  },
];

/* ── UTILITIES ── */
function genId() {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({length:5}, ()=>c[Math.floor(Math.random()*c.length)]).join('');
}
const fp = p => {
  if (p == null || isNaN(p)) return '—';
  if (p >= 1000) return '$' + p.toLocaleString('en', {minimumFractionDigits:2, maximumFractionDigits:2});
  if (p >= 1)    return '$' + p.toFixed(2);
  if (p >= 0.01) return '$' + p.toFixed(4);
  return '$' + p.toFixed(6);
};
const fc = c => {
  if (c == null || isNaN(c)) return '—';
  return (c >= 0 ? '+' : '') + c.toFixed(2) + '%';
};
const fv = v => {
  if (v == null || isNaN(v)) return '—';
  if (v >= 1e12) return '$' + (v/1e12).toFixed(2) + 'T';
  if (v >= 1e9)  return '$' + (v/1e9).toFixed(2) + 'B';
  if (v >= 1e6)  return '$' + (v/1e6).toFixed(2) + 'M';
  return '$' + v.toLocaleString('en', {maximumFractionDigits:0});
};

/* ── NAV ITEMS ── */
const NAV_ITEMS = [
  { id:'dashboard', lbl:'Feed',      icon:'bolt',              path:'/Dashboard/'  },
  { id:'markets',   lbl:'Markets',   icon:'candlestick_chart', path:'/Markets/'    },
  { id:'portfolio', lbl:'Portfolio', icon:'donut_small',       path:'/Portfolio/'  },
  { id:'ai',        lbl:'AI',        icon:'smart_toy',         path:'/AI/'         },
  { id:'news',      lbl:'News',      icon:'newspaper',         path:'/News/'       },
  { id:'account',   lbl:'Account',   icon:'person',            path:'/Account/'    },
  { id:'plans',     lbl:'Plans',     icon:'workspace_premium', path:'/Plans/'      },
  { id:'privacy',   lbl:'Privacy',   icon:'shield',            path:'/Privacy/'    },
];

/* ── SESSION ── */
function getUser()    { return LS.get(); }
function requireAuth() {
  const u = getUser();
  if (!u?.kryptid) { window.location.href = '/'; return null; }
  return u;
}

/* ════════════════════════════════════════════════════
   LIVE PRICE ENGINE
   Fetches real data from CoinGecko.
   Falls back to Binance REST.
   Falls back to Kraken REST.
   If ALL fail → returns null (UI shows error, no fake data).
════════════════════════════════════════════════════ */

const PRICE_CACHE_KEY = 'kryptiv_prices';
const CACHE_TTL_MS    = 60_000; // 1 minute

/* Map CoinGecko response → our coin shape */
function cgToCoins(data) {
  return data.map((c, i) => ({
    id:    c.id,
    sym:   c.symbol.toUpperCase(),
    name:  c.name,
    price: c.current_price,
    ch:    c.price_change_percentage_24h ?? 0,
    ch1h:  c.price_change_percentage_1h_in_currency ?? null,
    ch7d:  c.price_change_percentage_7d_in_currency ?? null,
    mc:    c.market_cap ? c.market_cap / 1e9 : null,  // billions
    vol:   c.total_volume ? c.total_volume / 1e9 : null,
    rank:  c.market_cap_rank ?? (i + 1),
    ath:   c.ath,
    atl:   c.atl,
    supply:c.circulating_supply,
    hist:  null, // loaded on demand per coin
    _src:  'coingecko',
  }));
}

/* Binance fallback — only gets price + 24h change for top symbols */
const BINANCE_SYMS = ['BTCUSDT','ETHUSDT','SOLUSDT','BNBUSDT','XRPUSDT',
                      'ADAUSDT','AVAXUSDT','DOTUSDT','LINKUSDT','DOGEUSDT',
                      'MATICUSDT','UNIUSDT','NEARUSDT','ARBUSDT','OPUSDT'];
const BINANCE_MAP  = {
  'BTCUSDT':'BTC','ETHUSDT':'ETH','SOLUSDT':'SOL','BNBUSDT':'BNB',
  'XRPUSDT':'XRP','ADAUSDT':'ADA','AVAXUSDT':'AVAX','DOTUSDT':'DOT',
  'LINKUSDT':'LINK','DOGEUSDT':'DOGE','MATICUSDT':'POL','UNIUSDT':'UNI',
  'NEARUSDT':'NEAR','ARBUSDT':'ARB','OPUSDT':'OP'
};

async function fetchBinance() {
  const syms = BINANCE_SYMS.map(s => `"${s}"`).join(',');
  const r = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=[${syms}]`);
  if (!r.ok) throw new Error('Binance HTTP ' + r.status);
  const data = await r.json();
  return data.map((t, i) => {
    const sym  = BINANCE_MAP[t.symbol] || t.symbol.replace('USDT','');
    const meta = COIN_LIST.find(c => c.sym === sym) || { id:sym.toLowerCase(), name:sym };
    return {
      id:    meta.id,
      sym,
      name:  meta.name,
      price: parseFloat(t.lastPrice),
      ch:    parseFloat(t.priceChangePercent),
      ch1h:  null,
      ch7d:  null,
      mc:    null,
      vol:   parseFloat(t.quoteVolume) / 1e9,
      rank:  i + 1,
      ath:   null, atl:null, supply:null, hist:null,
      _src:  'binance',
    };
  }).filter(c => c.price > 0);
}

async function fetchKraken() {
  // Kraken has limited pairs but is reliable
  const pairs = 'XBTUSD,ETHUSD,SOLUSD,XRPUSD,ADAUSD,LINKUSD,DOGEUSD,UNIUSD,NEARUSD';
  const r = await fetch(`https://api.kraken.com/0/public/Ticker?pair=${pairs}`);
  if (!r.ok) throw new Error('Kraken HTTP ' + r.status);
  const data = await r.json();
  if (data.error?.length) throw new Error('Kraken: ' + data.error[0]);
  const KMAP = {'XXBTZUSD':'BTC','XETHZUSD':'ETH','SOLUSDT':'SOL','XXRPZUSD':'XRP',
                'XADAZUSD':'ADA','LINKUSD':'LINK','XDGUSD':'DOGE','UNIUSD':'UNI',
                'NEARUSD':'NEAR','SOLUSD':'SOL'};
  return Object.entries(data.result).map(([pair, t], i) => {
    const sym  = KMAP[pair] || pair.replace('USD','').replace('Z','').replace('X','').slice(0,4);
    const meta = COIN_LIST.find(c => c.sym === sym) || { id:sym.toLowerCase(), name:sym };
    const price = parseFloat(t.c[0]);
    const open  = parseFloat(t.o);
    const ch    = open > 0 ? ((price - open) / open) * 100 : 0;
    return {
      id:meta.id, sym, name:meta.name, price, ch,
      ch1h:null, ch7d:null, mc:null,
      vol: parseFloat(t.v[1]) * price / 1e9,
      rank:i+1, ath:null, atl:null, supply:null, hist:null,
      _src:'kraken',
    };
  }).filter(c => c.price > 0);
}

async function fetchCoinGecko() {
  const ids = COIN_LIST.map(c => c.id).join(',');
  const url = `https://api.coingecko.com/api/v3/coins/markets` +
    `?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=15&page=1` +
    `&sparkline=false&price_change_percentage=1h%2C24h%2C7d`;
  const r = await fetch(url);
  if (!r.ok) throw new Error('CoinGecko HTTP ' + r.status);
  const data = await r.json();
  if (!Array.isArray(data) || data.length === 0) throw new Error('CoinGecko: empty response');
  return cgToCoins(data);
}

/* Fetch 7d historical sparkline for a single coin (CoinGecko) */
async function fetchCoinHistory(coinId) {
  const r = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7&interval=daily`
  );
  if (!r.ok) return null;
  const d = await r.json();
  return d.prices || null; // [[timestamp, price], ...]
}

/* ── MAIN FETCH — try CG → Binance → Kraken ── */
async function fetchLivePrices() {
  // Check cache first
  try {
    const cached = JSON.parse(sessionStorage.getItem(PRICE_CACHE_KEY) || 'null');
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      return { coins: cached.coins, src: cached.src + ' (cached)' };
    }
  } catch {}

  const errors = [];

  // 1. CoinGecko
  try {
    const coins = await fetchCoinGecko();
    sessionStorage.setItem(PRICE_CACHE_KEY, JSON.stringify({ coins, ts: Date.now(), src:'CoinGecko' }));
    return { coins, src:'CoinGecko' };
  } catch(e) { errors.push('CoinGecko: ' + e.message); }

  // 2. Binance
  try {
    const coins = await fetchBinance();
    sessionStorage.setItem(PRICE_CACHE_KEY, JSON.stringify({ coins, ts: Date.now(), src:'Binance' }));
    return { coins, src:'Binance' };
  } catch(e) { errors.push('Binance: ' + e.message); }

  // 3. Kraken
  try {
    const coins = await fetchKraken();
    sessionStorage.setItem(PRICE_CACHE_KEY, JSON.stringify({ coins, ts: Date.now(), src:'Kraken' }));
    return { coins, src:'Kraken' };
  } catch(e) { errors.push('Kraken: ' + e.message); }

  // All failed
  return { coins: null, src: null, errors };
}

/* ── PRICE UPDATER — polls every 30s, updates window._liveCoins ── */
let _priceInterval = null;

function startPriceUpdates(onUpdate, onError) {
  async function tick() {
    const result = await fetchLivePrices();
    if (result.coins) {
      window._liveCoins = result.coins;
      window._priceSource = result.src;
      if (onUpdate) onUpdate(result.coins, result.src);
    } else {
      if (onError) onError(result.errors);
    }
  }
  tick(); // immediate
  if (_priceInterval) clearInterval(_priceInterval);
  _priceInterval = setInterval(tick, 30_000);
  return () => clearInterval(_priceInterval);
}
