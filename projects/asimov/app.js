const coreColor = { Robot:'#80d8ff', Spacer:'#6ee7c8', Empire:'#ffb86b', Foundation:'#d7b7ff' };
const coreBandY = { Robot:86, Spacer:124, Empire:166, Foundation:216 };
const locById = Object.fromEntries(LOCATIONS.map(d => [d.id, d]));
const bookById = Object.fromEntries(BOOKS.map(d => [d.id, d]));
const universeBooks = [...BOOKS].sort((a,b)=>a.universeOrder-b.universeOrder);
const locationBooks = d3.rollup(BOOKS.flatMap(b => b.locationIds.map(id => ({id, book:b}))), v => v.map(d=>d.book).sort((a,b)=>a.published-b.published), d => d.id);
const locationCores = new Map(Array.from(locationBooks, ([id, books]) => [id, new Set(books.map(b => b.core))]));

let selectedId = 'foundation';
let selectedWorldId = 'terminus';
let activeCores = new Set(Object.keys(coreColor));
let playTimer = null;
let activeDomain = 'all';
let galaxyZoom;
let xySwapped = false;
let timelineScaleMode = 'segmented';
let bibSort = { key:'year', dir:1 };
let bibliographyControlsReady = false;

const tooltip = d3.select('#tooltip');
const fmt = d3.format(',.0f');

function midYear(b){ return (b.universeStart + b.universeEnd)/2; }
function colorFor(b){ return coreColor[b.core] || '#fff'; }
const bibDomainColors = {};
function hashHue(str){ let h=0; for(const ch of String(str||'')) h=(h*31+ch.charCodeAt(0))%360; return h; }
function bibColor(d){
  const key = d.series_or_cluster && d.series_or_cluster !== 'standalone' && d.series_or_cluster !== 'collections' ? d.series_or_cluster : d.domain;
  if(!bibDomainColors[key]) bibDomainColors[key] = `hsl(${hashHue(key)}, 72%, 68%)`;
  return bibDomainColors[key];
}
function bibTitle(d){ return d.title || '—'; }
function cleanLabel(v){ return String(v || '—').replaceAll('_',' '); }

function showTip(event, html){ tooltip.html(html).style('opacity',1); moveTip(event); }
function moveTip(event){ tooltip.style('left', `${event.clientX}px`).style('top', `${event.clientY}px`); }
function hideTip(){ tooltip.style('opacity',0); }
function bookTip(b){ return `<b>${b.title}</b>Published: ${b.published}<br/>Universe date: ${b.dateLabel}<br/>Series: ${b.core}`; }
function locTip(l){
  const books = locationBooks.get(l.id) || [];
  const names = books.length ? books.map(b=>`${b.title} (${b.published}, ${b.dateLabel})`).join('<br/>') : 'No directly connected V1 books';
  return `<b>${l.name}</b>${l.type}<br/>${l.region}<br/>Certainty: ${l.certainty}<hr/>Connected books:<br/>${names}`;
}
function shortTitle(t){
  return t
    .replace('Foundation and Empire','Foundation & Empire')
    .replace('Foundation and Earth','Foundation & Earth')
    .replace('Prelude to Foundation','Prelude to Foundation')
    .replace('Forward the Foundation','Forward the Foundation')
    .replace(/^The /,'');
}
function coreIsActive(core){ return activeCores.has(core); }
function bookIsActive(b){ return coreIsActive(b.core); }
function locationIsActive(l){
  const cores = locationCores.get(l.id);
  if(!cores || !cores.size) return true;
  return Array.from(cores).some(c => activeCores.has(c));
}
function locationPrimaryCore(l){
  if(l.id==='earth'||l.id==='moon'||l.id==='solar_system') return 'Robot';
  if(l.type.includes('Spacer') || l.id==='spacer_worlds' || ['aurora','solaria','melpomenia','baleyworld','alpha','space_route'].includes(l.id)) return 'Spacer';
  if(['tyrann','rhodia','florina','sark','earth_empire'].includes(l.id)) return 'Empire';
  return 'Foundation';
}
function seriesNeighbours(book){
  const groupKey = Object.keys(SERIES_ORDERS).find(k => SERIES_ORDERS[k].includes(book.id));
  if(!groupKey) return {group:'—', prev:null, next:null};
  const arr = SERIES_ORDERS[groupKey];
  const i = arr.indexOf(book.id);
  return {group:groupKey, prev: i>0 ? bookById[arr[i-1]] : null, next: i<arr.length-1 ? bookById[arr[i+1]] : null};
}
function chronoNeighbours(book){
  const i = universeBooks.findIndex(d => d.id === book.id);
  return {prev: i>0 ? universeBooks[i-1] : null, next: i<universeBooks.length-1 ? universeBooks[i+1] : null};
}
function meta(label, value){ return `<div class="meta"><span>${label}</span><b>${value || '—'}</b></div>`; }

function selectWorld(id, chooseEarliest=true){
  const l = locById[id];
  if(!l) return;
  selectedWorldId = id;
  const books = locationBooks.get(id) || [];
  document.querySelector('#worldTitle').textContent = l.name;
  document.querySelector('#worldMeta').innerHTML = `${l.type} · ${l.region}<br>${l.notes || ''}`;
  document.querySelector('#worldBookList').innerHTML = books.length
    ? books.map(b => `<button type="button" class="world-book-button ${b.id===selectedId?'active':''}" data-book="${b.id}"><b>${b.title}</b><span>${b.published} · ${b.dateLabel}</span></button>`).join('')
    : '<p>No directly connected V1 books.</p>';
  document.querySelectorAll('.world-book-button').forEach(btn => btn.addEventListener('click', () => selectBook(btn.dataset.book, {fromWorldPanel:true})));
  d3.selectAll('.node').classed('selected-world', d => d.id === selectedWorldId);
  if(chooseEarliest && books.length) selectBook(books[0].id, {selectedWorld:id});
}

function selectBook(id, opts={}){
  selectedId = id;
  const b = bookById[id];
  if(!b) return;
  const sn = seriesNeighbours(b);
  const cn = chronoNeighbours(b);
  document.querySelector('#bookTitle').textContent = b.title;
  document.querySelector('#bookMeta').innerHTML = [
    meta('Published', b.published),
    meta('Universe date', b.dateLabel),
    meta('Series', b.core),
    meta('Author', b.author)
  ].join('');
  document.querySelector('#bookNotes').textContent = b.notes || '';
  wireNav('#seriesPrev', sn.prev);
  wireNav('#seriesNext', sn.next);
  wireNav('#chronoPrev', cn.prev);
  wireNav('#chronoNext', cn.next);

  const locs = b.locationIds.map(id => locById[id]).filter(Boolean);
  document.querySelector('#locationNotes').innerHTML = locs.map(l => `<button type="button" class="inline-world-button" data-world="${l.id}"><b>${l.name}</b> <span>(${l.certainty})</span><br>${l.notes}</button>`).join('');
  document.querySelectorAll('.inline-world-button').forEach(btn => btn.addEventListener('click', () => selectWorld(btn.dataset.world)));

  if(opts.selectedWorld){
    selectedWorldId = opts.selectedWorld;
  } else if(!opts.fromWorldPanel && b.locationIds.length){
    selectedWorldId = b.routeLocation || b.locationIds[0];
  }
  if(selectedWorldId) selectWorld(selectedWorldId, false);

  d3.selectAll('.node')
    .classed('active-world', d => b.locationIds.includes(d.id))
    .classed('selected-world', d => d.id === selectedWorldId)
    .classed('dimmed', false);
  d3.selectAll('.time-mark').classed('active-mark', d => d.id === id);
  d3.selectAll('.scatter').classed('active-mark', d => d.id === id);
  d3.selectAll('.route-dot').attr('opacity', d => d.bookId === id ? 1 : .24).attr('r', d => d.bookId === id ? 5 : 2.6);
  drawSelectedWorldLinks(b);
  applyFilters();
}
function wireNav(selector, target){
  const btn = document.querySelector(selector);
  btn.textContent = target ? target.title : '—';
  btn.disabled = !target;
  btn.onclick = target ? () => { activateTab('map'); selectBook(target.id); } : null;
}

function drawLegend(target='#mapLegend'){
  const legend = d3.select(target).html('');
  Object.entries(coreColor).forEach(([name, color]) => {
    const label = legend.append('label').attr('class','chip').classed('disabled', !activeCores.has(name));
    label.html(`<input type="checkbox" ${activeCores.has(name)?'checked':''}/><i style="background:${color}"></i>${name}`);
    label.select('input').on('change', (e) => {
      if(e.target.checked) activeCores.add(name); else activeCores.delete(name);
      drawLegend('#mapLegend'); drawLegend('#xyLegend'); applyFilters();
    });
  });
}

function makeSpiralPoints(count, armCount=4){
  const pts=[];
  for(let i=0;i<count;i++){
    const arm=i%armCount;
    const t=i/13 + arm*Math.PI*2/armCount;
    const r=18 + i*1.55;
    const noiseR=(Math.sin(i*12.9898)*0.5+Math.cos(i*78.233)*0.5)*18;
    const noiseT=Math.sin(i*5.123)*0.11;
    pts.push({ x:600 + Math.cos(t+noiseT)*(r+noiseR)*1.12, y:380 + Math.sin(t+noiseT)*(r+noiseR)*0.62, r:Math.max(.35, 1.9-(i/count)*1.15), o:.07+((i*19)%17)/90 });
  }
  return pts.filter(d => d.x>10 && d.x<1190 && d.y>20 && d.y<740);
}
function makeSpacerDots(){
  return d3.range(50).map(i => {
    const angle = i * 2.399963 + (i%5)*0.03;
    const rad = 10 + Math.sqrt(i/49)*52;
    return {x:390 + Math.cos(angle)*rad, y:424 + Math.sin(angle)*rad*.72, r: i%9===0 ? 2.3 : 1.65, label:`Spacer world ${i+1}`};
  });
}

function drawGalaxy(){
  const svg = d3.select('#galaxy'); svg.selectAll('*').remove();
  const defs = svg.append('defs');
  defs.html(`
    <filter id="softGlow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="armBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="8"/></filter>
    <radialGradient id="coreGrad"><stop offset="0" stop-color="#fff" stop-opacity=".84"/><stop offset=".2" stop-color="#dbe4ff" stop-opacity=".52"/><stop offset=".55" stop-color="#8da0ff" stop-opacity=".18"/><stop offset="1" stop-color="#778cff" stop-opacity="0"/></radialGradient>
  `);
  svg.append('rect').attr('width',1200).attr('height',760).attr('fill','transparent');
  const viewport = svg.append('g').attr('class','galaxy-viewport');
  const back = viewport.append('g').attr('class','galaxy-backdrop');
  const routeLayer = viewport.append('g').attr('class','route-layer');
  viewport.append('g').attr('class','selected-link-layer');
  const nodeLayer = viewport.append('g').attr('class','node-layer');
  galaxyZoom = d3.zoom().scaleExtent([0.75, 7]).on('zoom', e => viewport.attr('transform', e.transform));
  svg.call(galaxyZoom);

  back.selectAll('circle.star').data(d3.range(180).map(i=>({x:(i*73)%1200,y:(i*139)%760,r:(i%5?0.7:1.2),o:.15+(i%7)/25}))).join('circle').attr('class','star').attr('cx',d=>d.x).attr('cy',d=>d.y).attr('r',d=>d.r).attr('opacity',d=>d.o);
  const line = d3.line().x(d=>d.x).y(d=>d.y).curve(d3.curveCatmullRom.alpha(.6));
  for(let arm=0; arm<4; arm++){
    const pts = d3.range(260).map(i => { const t = i/18 + arm*Math.PI/2; const r = 8 + i*2.15; return {x:600 + Math.cos(t)*r*1.12, y:380 + Math.sin(t)*r*.62}; });
    back.append('path').attr('d', line(pts)).attr('class','galaxy-arm');
    back.append('path').attr('d', line(pts)).attr('class','galaxy-arm-thin');
  }
  back.selectAll('circle.dust').data(makeSpiralPoints(900)).join('circle').attr('class','dust').attr('cx',d=>d.x).attr('cy',d=>d.y).attr('r',d=>d.r).attr('opacity',d=>d.o);
  back.append('circle').attr('cx',600).attr('cy',380).attr('r',104).attr('fill','url(#coreGrad)').attr('class','core-glow');

  [24,40,58].forEach(r => back.append('circle').attr('cx',390).attr('cy',424).attr('r',r).attr('fill','none').attr('stroke','rgba(110,231,200,.15)').attr('stroke-dasharray','3 8'));
  back.selectAll('circle.spacer-dot').data(makeSpacerDots()).join('circle').attr('class','spacer-dot').attr('cx',d=>d.x).attr('cy',d=>d.y).attr('r',d=>d.r).attr('fill',coreColor.Spacer).attr('opacity',.34);

  const routePoints = universeBooks.map(b => ({...locById[b.routeLocation], bookId:b.id, book:b})).filter(d=>d.x);
  routeLayer.append('path').datum(routePoints).attr('class','route').attr('d',d3.line().x(d=>d.x).y(d=>d.y).curve(d3.curveCatmullRom.alpha(.45)));
  routeLayer.selectAll('circle').data(routePoints).join('circle').attr('class','route-dot').attr('cx',d=>d.x).attr('cy',d=>d.y).attr('r',2.6).attr('fill','#8bdcff').attr('opacity',.24);

  const displayLocations = LOCATIONS.filter(d => d.id !== 'galaxia');
  const nodes = nodeLayer.selectAll('g').data(displayLocations).join('g').attr('class','node')
    .on('mousemove',(e,d)=>showTip(e,locTip(d))).on('mouseleave',hideTip).on('click',(e,d)=>selectWorld(d.id));
  nodes.append('circle').attr('class','hit-target').attr('cx',d=>d.x).attr('cy',d=>d.y).attr('r',d=>Math.max(16,d.r+10)).attr('fill','transparent').attr('stroke','none');
  nodes.append('circle').attr('cx',d=>d.x).attr('cy',d=>d.y).attr('r',d=>Math.max(4,d.r)).attr('fill',d=>locationFill(d)).attr('fill-opacity',d=> d.type.includes('region') ? .16 : .9).attr('stroke','rgba(255,255,255,.62)');
  nodes.append('text').attr('x',d=>d.x+10).attr('y',d=>d.y + labelDy(d)).attr('class','label').text(d=>d.name);
}
function labelDy(d){
  if(['earth','moon','aurora','solaria','melpomenia','alpha','baleyworld'].includes(d.id)) return -10;
  if(['terminus','trantor','florina','sark'].includes(d.id)) return -12;
  return -9;
}
function locationFill(d){
  if(d.id==='earth'||d.id==='moon'||d.id==='solar_system') return coreColor.Robot;
  if(d.type.includes('Spacer') || d.id==='spacer_worlds' || ['aurora','solaria','melpomenia','baleyworld','alpha','space_route'].includes(d.id)) return coreColor.Spacer;
  if(['tyrann','rhodia','florina','sark','earth_empire'].includes(d.id)) return coreColor.Empire;
  if(['trantor','terminus','terminus_planned','anacreon','kalgan','sayshell'].includes(d.id)) return coreColor.Foundation;
  if(d.id==='gaia') return 'var(--gaia)';
  return '#dfe8ff';
}
function drawSelectedWorldLinks(book){
  const layer = d3.select('.selected-link-layer');
  if(layer.empty()) return;
  layer.selectAll('*').remove();
  const route = locById[book.routeLocation] || locById[book.locationIds[0]];
  if(!route) return;
  const links = book.locationIds.map(id => locById[id]).filter(Boolean).filter(l => l.id !== route.id).map(l => ({source:route, target:l}));
  layer.selectAll('line').data(links).join('line').attr('class','book-world-link').attr('x1',d=>d.source.x).attr('y1',d=>d.source.y).attr('x2',d=>d.target.x).attr('y2',d=>d.target.y);
}


function segmentedScale(width){
  const segments = [
    {a:1990,b:3700,w:.29,label:'Robot / Spacer'},
    {a:4800,b:12600,w:.25,label:'Empire'},
    {a:23600,b:24200,w:.46,label:'Foundation'}
  ];
  const left=76; let x=left; const total=width-left-42;
  return {
    mode:'segmented', left, right:width-42,
    segments:segments.map(s=>{ const sw=total*s.w; const out={...s,x0:x,x1:x+sw}; x+=sw; return out; }),
    x(year){ const s=this.segments.find(s=>year>=s.a && year<=s.b) || (year<3700?this.segments[0]:year<12600?this.segments[1]:this.segments[2]); return s.x0 + (year-s.a)/(s.b-s.a)*(s.x1-s.x0); }
  };
}
function continuousTimelineScale(width){
  const left=76, right=width-42;
  const scale=d3.scaleLinear().domain([1900,24300]).range([left,right]);
  return { mode:'continuous', left, right, x:year=>scale(year), scale };
}
function getTimelineScale(width){ return timelineScaleMode === 'continuous' ? continuousTimelineScale(width) : segmentedScale(width); }
function estimateLabelWidth(text){ return Math.min(210, Math.max(62, text.length*6.45)); }
function durationXs(d, sx){
  const x1=sx.x(d.universeStart), x2=sx.x(d.universeEnd || d.universeStart);
  const hasDuration = d.universeEnd && d.universeEnd !== d.universeStart;
  const minW = hasDuration ? 16 : 0;
  const a = Math.min(x1,x2), b = Math.max(x1,x2);
  return {x1:a, x2:Math.max(a+minW,b), hasDuration};
}
function markLayout(data, sx){
  const byCore = d3.group(data, d=>d.core);
  const offsets = [-8, 8, -17, 17, -26, 26, 0];
  const out = new Map();
  byCore.forEach((arr, core)=>{
    const placed=[];
    [...arr].sort((a,b)=>sx.x(midYear(a))-sx.x(midYear(b))).forEach(d=>{
      const xs=durationXs(d,sx); const cx=(xs.x1+xs.x2)/2;
      let chosen=0;
      for(const off of offsets){
        const collision = placed.some(p => Math.abs(p.y-(coreBandY[core]+off)) < 11 && !(xs.x1 > p.x2+8 || xs.x2 < p.x1-8));
        if(!collision){ chosen=off; break; }
      }
      placed.push({x1:xs.x1,x2:xs.x2,y:coreBandY[core]+chosen});
      out.set(d.id,{...xs,cx,y:coreBandY[core]+chosen,baseY:coreBandY[core],offset:chosen});
    });
  });
  return out;
}
function lineIntersect(a,b,c,d){
  function orient(p,q,r){ return (q.y-p.y)*(r.x-q.x) - (q.x-p.x)*(r.y-q.y); }
  const o1=orient(a,b,c), o2=orient(a,b,d), o3=orient(c,d,a), o4=orient(c,d,b);
  return (o1*o2<0 && o3*o4<0);
}
function labelLayout(data, sx, marks){
  const rowsByCore = {
    Robot:[-34,-52,-70,34,52,70,-88,88,-106,106],
    Spacer:[-36,-56,34,54,-76,74,-96,94,-116,112],
    Empire:[-36,-56,34,54,-76,74,-96,94,-116,112],
    Foundation:[-36,-56,34,54,-76,74,-96,94,-116,112]
  };
  const placed=[]; const leaders=[]; const out=new Map();
  const sorted=[...data].sort((a,b)=>marks.get(a.id).cx-marks.get(b.id).cx || a.universeOrder-b.universeOrder);
  sorted.forEach(d=>{
    const m=marks.get(d.id); const text=shortTitle(d.title); const w=estimateLabelWidth(text);
    const sideOptions = m.cx > sx.right-220 ? [-1,1] : m.cx < sx.left+170 ? [1,-1] : [1,-1];
    let best=null;
    for(const side of sideOptions){
      for(const row of rowsByCore[d.core] || [-40,40,-62,62]){
        const y=m.baseY+row;
        if(y < 16 || y > 350) continue;
        const anchor = m.cx + side*(18 + Math.min(42, Math.abs(row)*0.25));
        const textStart = side>0 ? anchor + 8 : anchor - 8 - w;
        const textEnd = textStart + w;
        const leaderX = side>0 ? textStart : textEnd;
        if(textStart < 8 || textEnd > 1172) continue;
        const box={x1:textStart-4,x2:textEnd+4,y1:y-13,y2:y+5};
        const leaderA={x:m.cx,y:m.y}, leaderB={x:leaderX,y};
        const overlaps=placed.filter(p => !(box.x1>p.x2 || box.x2<p.x1 || box.y1>p.y2 || box.y2<p.y1)).length;
        const crossings=leaders.filter(seg => lineIntersect(leaderA, leaderB, seg.a, seg.b)).length;
        const longLeader=Math.hypot(leaderB.x-leaderA.x, leaderB.y-leaderA.y);
        const score=overlaps*140 + crossings*95 + Math.abs(row)*0.45 + longLeader*0.03 + (side<0?5:0);
        const candidate={side,y,leaderX,textStart,textEnd,w,score,box,markX:m.cx,leaderA,leaderB};
        if(!best || score<best.score) best=candidate;
        if(score===0) break;
      }
      if(best && best.score===0) break;
    }
    if(!best){
      const y=Math.max(18, Math.min(342, m.baseY + (m.cx > 600 ? -118 : 118)));
      const side=m.cx > 600 ? -1 : 1;
      const anchor=m.cx + side*30;
      const textStart = side>0 ? anchor + 8 : anchor - 8 - w;
      const textEnd = textStart + w;
      const leaderX = side>0 ? textStart : textEnd;
      best={side,y,leaderX,textStart,textEnd,w,score:999,box:{x1:textStart-4,x2:textEnd+4,y1:y-13,y2:y+5},markX:m.cx,leaderA:{x:m.cx,y:m.y},leaderB:{x:leaderX,y}};
    }
    placed.push({...best.box,side:best.side,markX:best.markX,leaderX:best.leaderX});
    leaders.push({a:best.leaderA,b:best.leaderB});
    out.set(d.id,best);
  });
  return out;
}
function drawTimelineAxis(svg, sx, W, H, axisY){
  const eraLabelY = axisY + 46;
  const tickLabelY = axisY + 20;
  if(sx.mode === 'segmented'){
    const tickSets = [
      [2000,2500,3000,3500],
      [5000,8000,11000],
      [23600,23800,24000,24200]
    ];
    sx.segments.forEach((s,i)=>{
      svg.append('line').attr('x1',s.x0).attr('x2',s.x1).attr('y1',axisY).attr('y2',axisY).attr('stroke','#61718f').attr('stroke-width',2);
      svg.append('text').attr('x',(s.x0+s.x1)/2).attr('y',eraLabelY).attr('class','small-label timeline-era-label').attr('text-anchor','middle').text(`${s.label}: ${s.a}–${s.b}`);
      const ticks = tickSets[i];
      ticks.forEach(t=>{
        const x=s.x0+(t-s.a)/(s.b-s.a)*(s.x1-s.x0);
        svg.append('line').attr('x1',x).attr('x2',x).attr('y1',axisY-6).attr('y2',axisY+6).attr('stroke','#50617f');
        svg.append('text').attr('x',x).attr('y',tickLabelY).attr('class','small-label timeline-year-label').attr('text-anchor','middle').text(fmt(t));
      });
      if(i<sx.segments.length-1){
        const bx=s.x1+8;
        svg.append('path').attr('class','break-mark').attr('d',`M${bx-3},${axisY-10} l8,20 M${bx+7},${axisY-10} l8,20`);
      }
    });
  } else {
    const axis=d3.axisBottom(sx.scale).tickValues([2000,4000,6000,8000,10000,12000,16000,20000,24000]).tickFormat(d3.format('d'));
    svg.append('line').attr('x1',sx.left).attr('x2',sx.right).attr('y1',axisY).attr('y2',axisY).attr('stroke','#61718f').attr('stroke-width',2);
    svg.append('g').attr('class','axis timeline-year-axis').attr('transform',`translate(0,${axisY})`).call(axis);
    svg.append('text').attr('x',(sx.left+sx.right)/2).attr('y',eraLabelY).attr('class','small-label timeline-era-label').attr('text-anchor','middle').text('Continuous in-universe timeline: 1900–24300 CE');
  }
}
function drawTimeline(){
  const svg=d3.select('#timeline'); svg.selectAll('*').remove();
  const W=1180,H=430, axisY=372;
  svg.attr('viewBox',`0 0 ${W} ${H}`);
  const sx=getTimelineScale(W);
  Object.entries(coreBandY).forEach(([core,y]) => {
    svg.append('rect').attr('class','band-bg').attr('x',sx.left).attr('y',y-15).attr('width',sx.right-sx.left).attr('height',30).attr('fill',coreColor[core]);
    svg.append('text').attr('x',14).attr('y',y+4).attr('class','band-label').attr('fill',coreColor[core]).text(core);
  });
  drawTimelineAxis(svg, sx, W, H, axisY);
  const marksLayout=markLayout(universeBooks, sx);
  const labels=labelLayout(universeBooks, sx, marksLayout);
  const marks = svg.append('g').selectAll('g').data(universeBooks).join('g').attr('class','time-mark').on('mousemove',(e,d)=>showTip(e,bookTip(d))).on('mouseleave',hideTip).on('click',(e,d)=>selectBook(d.id));
  marks.each(function(d){
    const g=d3.select(this);
    const m=marksLayout.get(d.id); const lab=labels.get(d.id);
    const markW=Math.max(0, m.x2-m.x1);
    if(m.hasDuration || markW > 16){
      const h=12;
      g.append('rect')
        .attr('class','duration-band')
        .attr('x',m.x1).attr('y',m.y-h/2)
        .attr('width',Math.max(14,markW)).attr('height',h)
        .attr('rx',h/2).attr('ry',h/2)
        .attr('fill',colorFor(d))
        .attr('stroke','rgba(255,255,255,.55)');
    } else {
      g.append('circle').attr('cx',m.cx).attr('cy',m.y).attr('r',5.2).attr('fill',colorFor(d)).attr('stroke','rgba(255,255,255,.55)');
    }
    g.insert('rect', ':first-child')
      .attr('class','hit-target')
      .attr('x',Math.min(m.x1, lab.textStart)-8)
      .attr('y',Math.min(m.y, lab.y)-18)
      .attr('width',Math.abs(Math.max(m.x2, lab.textEnd)-Math.min(m.x1, lab.textStart))+20)
      .attr('height',Math.abs(Math.max(m.y, lab.y)-Math.min(m.y, lab.y))+36)
      .attr('fill','transparent')
      .attr('stroke','none');
    const uY = lab.y + 4;
    const u1 = lab.side > 0 ? lab.textStart : lab.textEnd - 8;
    const u2 = lab.side > 0 ? lab.textStart + 8 : lab.textEnd;
    const leaderX = lab.side > 0 ? u1 : u2;
    g.append('line')
      .attr('class','timeline-leader')
      .attr('x1',m.cx).attr('y1',m.y)
      .attr('x2',leaderX).attr('y2',uY)
      .attr('stroke',colorFor(d));
    g.append('line')
      .attr('class','timeline-underline')
      .attr('x1',u1).attr('y1',uY)
      .attr('x2',u2).attr('y2',uY)
      .attr('stroke',colorFor(d));
    g.append('text')
      .attr('class','small-label timeline-label')
      .attr('text-anchor','start')
      .attr('x',lab.side > 0 ? lab.textStart + 10 : lab.textStart)
      .attr('y',lab.y)
      .text(shortTitle(d.title));
  });
}

function scatterLabelLayout(data, x, y, xValue, yValue, W, H, m){
  const placed=[]; const leaders=[]; const out=new Map();
  const offsets=[
    {dx:14,dy:-16},{dx:14,dy:20},{dx:-14,dy:-16},{dx:-14,dy:20},
    {dx:28,dy:-32},{dx:28,dy:36},{dx:-28,dy:-32},{dx:-28,dy:36},
    {dx:44,dy:-48},{dx:-44,dy:52},{dx:58,dy:6},{dx:-58,dy:6}
  ];
  [...data].sort((a,b)=>x(xValue(a))-x(xValue(b)) || y(yValue(a))-y(yValue(b))).forEach(d=>{
    const px=x(xValue(d)), py=y(yValue(d));
    const text=shortTitle(d.title); const w=estimateLabelWidth(text); const h=16;
    let best=null;
    for(const off of offsets){
      const side=off.dx>=0?1:-1;
      const anchor=px+off.dx;
      const textStart=side>0?anchor+7:anchor-7-w;
      const textEnd=textStart+w;
      const leaderX=side>0?textStart:textEnd;
      const ly=py+off.dy;
      if(textStart<m.l+2 || textEnd>W-m.r-2 || ly<m.t+12 || ly>H-m.b-12) continue;
      const box={x1:textStart-4,x2:textEnd+4,y1:ly-13,y2:ly+5};
      const leaderA={x:px,y:py}, leaderB={x:leaderX,y:ly};
      const overlaps=placed.filter(p => !(box.x1>p.x2 || box.x2<p.x1 || box.y1>p.y2 || box.y2<p.y1)).length;
      const crossings=leaders.filter(seg => lineIntersect(leaderA, leaderB, seg.a, seg.b)).length;
      const dist=Math.hypot(off.dx,off.dy);
      const score=overlaps*150 + crossings*100 + dist*0.35;
      const cand={px,py,ly,side,leaderX,textStart,textEnd,w,score,box,leaderA,leaderB};
      if(!best || score<best.score) best=cand;
      if(score===0) break;
    }
    if(!best){
      const side=px>W/2?-1:1, ly=Math.max(m.t+14, Math.min(H-m.b-14, py+20));
      const anchor=px+side*18; const textStart=side>0?anchor+7:anchor-7-w;
      const textEnd=textStart+w; const leaderX=side>0?textStart:textEnd;
      best={px,py,ly,side,leaderX,textStart,textEnd,w,score:999,box:{x1:textStart-4,x2:textEnd+4,y1:ly-13,y2:ly+5},leaderA:{x:px,y:py},leaderB:{x:leaderX,y:ly}};
    }
    placed.push(best.box); leaders.push({a:best.leaderA,b:best.leaderB}); out.set(d.id,best);
  });
  return out;
}
function drawXY(){
  const svg=d3.select('#xyPlot'); svg.selectAll('*').remove(); const W=1180,H=440, m={l:86,r:34,t:26,b:60};
  svg.attr('viewBox',`0 0 ${W} ${H}`);
  const xValue = xySwapped ? midYear : (d=>d.published);
  const yValue = xySwapped ? (d=>d.published) : midYear;
  const xLabel = xySwapped ? 'In-universe year' : 'Publication year';
  const yLabel = xySwapped ? 'Publication year' : 'In-universe year';
  const xDomain = xySwapped ? [1900,24300] : d3.extent(BOOKS,d=>d.published);
  const yDomain = xySwapped ? d3.extent(BOOKS,d=>d.published) : [1900,24300];
  const x=d3.scaleLinear().domain(xDomain).nice().range([m.l,W-m.r]);
  const y=d3.scaleLinear().domain(yDomain).nice().range([H-m.b,m.t]);
  const xTicks = xySwapped ? [2000,4000,8000,12000,16000,20000,24000] : undefined;
  const yTicks = xySwapped ? undefined : [2000,4000,8000,12000,16000,20000,24000];
  svg.append('g').attr('class','grid').attr('transform',`translate(0,${H-m.b})`).call(d3.axisBottom(x).tickValues(xTicks).tickSize(-(H-m.t-m.b)).tickFormat(''));
  svg.append('g').attr('class','grid').attr('transform',`translate(${m.l},0)`).call(d3.axisLeft(y).tickValues(yTicks).tickSize(-(W-m.l-m.r)).tickFormat(''));
  svg.append('g').attr('class','axis').attr('transform',`translate(0,${H-m.b})`).call(d3.axisBottom(x).tickValues(xTicks).tickFormat(d3.format('d')));
  svg.append('g').attr('class','axis').attr('transform',`translate(${m.l},0)`).call(d3.axisLeft(y).tickValues(yTicks).tickFormat(d3.format('d')));
  svg.append('text').attr('x',W/2).attr('y',H-18).attr('class','label').attr('text-anchor','middle').text(xLabel);
  svg.append('text').attr('x',-H/2).attr('y',22).attr('class','label').attr('text-anchor','middle').attr('transform','rotate(-90)').text(yLabel);
  const labels=scatterLabelLayout(BOOKS, x, y, xValue, yValue, W, H, m);
  const pts=svg.append('g').selectAll('g').data(BOOKS).join('g').attr('class','scatter-point').on('mousemove',(e,d)=>showTip(e,bookTip(d))).on('mouseleave',hideTip).on('click',(e,d)=>selectBook(d.id));
  pts.append('circle').attr('class','hit-target').attr('cx',d=>x(xValue(d))).attr('cy',d=>y(yValue(d))).attr('r',13).attr('fill','transparent').attr('stroke','none');
  pts.append('circle').attr('class','scatter').attr('cx',d=>x(xValue(d))).attr('cy',d=>y(yValue(d))).attr('r',6).attr('fill',d=>colorFor(d)).attr('fill-opacity',.82).attr('stroke','rgba(255,255,255,.55)');
  pts.append('line').attr('class','timeline-leader xy-leader')
    .attr('x1',d=>x(xValue(d))).attr('y1',d=>y(yValue(d)))
    .attr('x2',d=>labels.get(d.id).side > 0 ? labels.get(d.id).textStart : labels.get(d.id).textEnd)
    .attr('y2',d=>labels.get(d.id).ly + 4).attr('stroke',d=>colorFor(d));
  pts.append('line').attr('class','timeline-underline xy-underline')
    .attr('x1',d=>labels.get(d.id).side > 0 ? labels.get(d.id).textStart : labels.get(d.id).textEnd - 8)
    .attr('y1',d=>labels.get(d.id).ly + 4)
    .attr('x2',d=>labels.get(d.id).side > 0 ? labels.get(d.id).textStart + 8 : labels.get(d.id).textEnd)
    .attr('y2',d=>labels.get(d.id).ly + 4).attr('stroke',d=>colorFor(d));
  pts.append('text').attr('class','small-label xy-label')
    .attr('x',d=>labels.get(d.id).side > 0 ? labels.get(d.id).textStart + 10 : labels.get(d.id).textStart)
    .attr('y',d=>labels.get(d.id).ly).text(d=>shortTitle(d.title));
  applyFilters();
}

function setupBibliographyControls(){
  if(bibliographyControlsReady) return;
  const fillSelect = (selector, values, label) => {
    const sel=document.querySelector(selector);
    sel.innerHTML = `<option value="all">${label}</option>` + values.map(v=>`<option value="${String(v).replaceAll('"','&quot;')}">${cleanLabel(v)}</option>`).join('');
    sel.addEventListener('change', drawBibliography);
  };
  fillSelect('#bibDomainFilter', Array.from(new Set(ASIMOV_WORKS.map(d=>d.domain))).sort(), 'All domains');
  fillSelect('#bibTypeFilter', Array.from(new Set(ASIMOV_WORKS.map(d=>d.type))).sort(), 'All types');
  fillSelect('#bibSeriesFilter', Array.from(new Set(ASIMOV_WORKS.map(d=>d.series_or_cluster))).sort(), 'All series / clusters');
  fillSelect('#bibFictionFilter', Array.from(new Set(ASIMOV_WORKS.map(d=>d.fiction_status))).sort(), 'Fiction + nonfiction');
  bibliographyControlsReady = true;
}
function filteredBibliography(){
  setupBibliographyControls();
  const q = document.querySelector('#bibSearch').value.trim().toLowerCase();
  const domain = document.querySelector('#bibDomainFilter').value;
  const type = document.querySelector('#bibTypeFilter').value;
  const series = document.querySelector('#bibSeriesFilter').value;
  const fiction = document.querySelector('#bibFictionFilter').value;
  return ASIMOV_WORKS.filter(d =>
    (domain==='all'||d.domain===domain) &&
    (type==='all'||d.type===type) &&
    (series==='all'||d.series_or_cluster===series) &&
    (fiction==='all'||d.fiction_status===fiction) &&
    (!q || Object.values(d).join(' ').toLowerCase().includes(q))
  );
}

function selectBibliographyEntry(id){
  const d = ASIMOV_WORKS.find(x => x.id === id);
  if(!d) return;
  d3.selectAll('.bib-dot').classed('active-bib', x => x.id === id);
  d3.selectAll('.bib-mark-label').classed('active-bib-label', x => x.id === id);
  const linkedBook = bookById[id];
  if(linkedBook){ activateTab('map'); selectBook(id); return; }
  showTip({clientX: window.innerWidth/2, clientY: 120}, `<b>${d.title}</b>Published: ${d.year}<br/>Type: ${cleanLabel(d.type)}<br/>Series / domain: ${cleanLabel(d.series_or_cluster || d.domain)}<br/>${d.notes || ''}`);
}

function drawBibliography(){
  setupBibliographyControls();
  const data = filteredBibliography();
  const svg=d3.select('#bibTimeline');
  svg.selectAll('*').remove();
  const W=1180,H=820,m={l:190,r:34,t:56,b:58};
  svg.attr('viewBox',`0 0 ${W} ${H}`);
  const years = d3.extent(ASIMOV_WORKS,d=>+d.year);
  const x=d3.scaleLinear().domain(years).nice().range([m.l,W-m.r]);
  const axisY = Math.round(H/2);

  const fictionCategory = d => {
    if(d.series_or_cluster && !['standalone','Standalone SF','Standalone mystery','General SF collections'].includes(d.series_or_cluster)) return d.series_or_cluster;
    if(d.subdomain) return d.subdomain;
    return cleanLabel(d.domain);
  };
  const nonfictionCategory = d => d.domain || d.series_or_cluster || 'nonfiction';
  const isFictionLike = d => d.fiction_status !== 'nonfiction';

  const fictionCats = Array.from(new Set(data.filter(isFictionLike).map(fictionCategory))).sort((a,b)=>a.localeCompare(b));
  const nonfictionCats = Array.from(new Set(data.filter(d=>!isFictionLike(d)).map(nonfictionCategory))).sort((a,b)=>a.localeCompare(b));
  const rowGapFromAxis = 58;
  const yFiction = d3.scalePoint().domain(fictionCats).range([axisY-rowGapFromAxis,m.t]).padding(0.8);
  const yNonfiction = d3.scalePoint().domain(nonfictionCats).range([axisY+rowGapFromAxis,H-m.b]).padding(0.8);
  const yFor = d => isFictionLike(d) ? yFiction(fictionCategory(d)) : yNonfiction(nonfictionCategory(d));
  const colorKey = d => isFictionLike(d) ? fictionCategory(d) : nonfictionCategory(d);

  svg.append('g').attr('class','grid').attr('transform',`translate(0,${axisY})`).call(d3.axisBottom(x).tickSize(-(H-m.t-m.b)).tickFormat(''));
  svg.append('g').attr('class','axis').attr('transform',`translate(0,${axisY})`).call(d3.axisBottom(x).tickFormat(d3.format('d')));
  svg.append('line').attr('x1',m.l).attr('x2',W-m.r).attr('y1',axisY).attr('y2',axisY).attr('class','bib-zero-line');
  svg.append('text').attr('class','bib-section-label').attr('x',m.l).attr('y',m.t-18).text('Fiction: series / genre above the timeline');
  svg.append('text').attr('class','bib-section-label').attr('x',m.l).attr('y',H-12).text('Nonfiction: domains below the timeline');

  const catAxis = svg.append('g').attr('class','bib-categories');
  catAxis.selectAll('text.fiction-cat').data(fictionCats).join('text')
    .attr('class','bib-cat-label fiction-cat').attr('x',m.l-12).attr('y',d=>yFiction(d)).attr('text-anchor','end').attr('dominant-baseline','middle')
    .text(d=>cleanLabel(d));
  catAxis.selectAll('text.nonfiction-cat').data(nonfictionCats).join('text')
    .attr('class','bib-cat-label nonfiction-cat').attr('x',m.l-12).attr('y',d=>yNonfiction(d)).attr('text-anchor','end').attr('dominant-baseline','middle')
    .text(d=>cleanLabel(d));
  catAxis.selectAll('line.cat-line').data([...fictionCats.map(d=>({d,y:yFiction(d)})),...nonfictionCats.map(d=>({d,y:yNonfiction(d)}))]).join('line')
    .attr('class','bib-cat-guide').attr('x1',m.l-5).attr('x2',W-m.r).attr('y1',d=>d.y).attr('y2',d=>d.y);

  // Nudge marks that share the same year/category so they do not sit exactly on top of one another.
  const buckets = d3.group(data, d => `${d.year}|${isFictionLike(d)?'f':'n'}|${colorKey(d)}`);
  const offsets = new Map();
  for(const group of buckets.values()){
    const sorted=[...group].sort((a,b)=>String(a.title).localeCompare(b.title));
    sorted.forEach((d,i)=>{
      const n=sorted.length;
      const spread=(i-(n-1)/2)*10;
      offsets.set(d.id, spread);
    });
  }
  const markX = d => x(+d.year) + (offsets.get(d.id)||0);
  const markY = d => yFor(d);

  // Connect books of recurring series or clusters with thin lines.
  const groups = d3.group(data.filter(d=>isFictionLike(d) && d.series_or_cluster && !['standalone','Standalone SF','Standalone mystery','General SF collections','Complete Stories','Mystery collections'].includes(d.series_or_cluster)), d=>d.series_or_cluster);
  const line = d3.line().x(d=>markX(d)).y(d=>markY(d)).curve(d3.curveMonotoneX);
  svg.append('g').selectAll('path').data(Array.from(groups.values()).filter(g=>g.length>1)).join('path')
    .attr('class','bib-series-line').attr('d',g=>line([...g].sort((a,b)=>a.year-b.year))).attr('stroke',g=>bibColor(g[0]));

  const marks=svg.append('g').selectAll('path').data(data).join('path')
    .attr('class','bib-dot')
    .attr('d',d=>isFictionLike(d) ? d3.symbol().type(d3.symbolCircle).size(58)() : d3.symbol().type(d3.symbolDiamond).size(74)())
    .attr('transform',d=>`translate(${markX(d)},${markY(d)})`)
    .attr('fill',d=>bibColor({...d, series_or_cluster: colorKey(d)}))
    .attr('fill-opacity',.88).attr('stroke','rgba(255,255,255,.62)')
    .on('mousemove',(e,d)=>showTip(e,`<b>${d.title}</b>Published: ${d.year}<br/>Type: ${cleanLabel(d.type)}<br/>${isFictionLike(d)?'Series / genre':'Domain'}: ${cleanLabel(colorKey(d))}<br/>Domain: ${cleanLabel(d.domain)}`))
    .on('mouseleave',hideTip)
    .on('click',(e,d)=>selectBibliographyEntry(d.id));

  placeBibLabels(svg, data, markX, markY, isFictionLike, W, H, m, colorKey);
  renderBibTable(data);
}

function placeBibLabels(svg, data, markX, markY, isFictionLike, W, H, m, colorKey){
  const labels=[];
  const sorted=[...data].sort((a,b)=> d3.ascending(markY(a),markY(b)) || d3.ascending(markX(a),markX(b)));
  const approxWidth = d => Math.min(130, Math.max(36, d.title.length*5.2));
  const intersects=(a,b)=>!(a.x+a.w<b.x || b.x+b.w<a.x || a.y+10<b.y || b.y+10<a.y);
  for(const d of sorted){
    const mx=markX(d), my=markY(d);
    const baseSide = isFictionLike(d) ? -1 : 1;
    const candidates=[];
    for(const side of [baseSide, -baseSide]){
      for(const dx of [12, -12, 32, -32, 56, -56, 84, -84]){
        for(const step of [0,1,2,3,4,5,6]){
          const ly = my + side*(16 + step*9);
          const lx = mx + dx;
          const w=approxWidth(d);
          candidates.push({lx,ly,w,score:Math.abs(dx)*0.25+step*8+(side!==baseSide?30:0)});
        }
      }
    }
    candidates.sort((a,b)=>a.score-b.score);
    let chosen=candidates.find(c=>{
      const box={x:Math.max(m.l,c.lx),y:c.ly-5,w:c.w,h:11};
      if(box.x+box.w>W-m.r) box.x=W-m.r-box.w;
      if(box.x<m.l) box.x=m.l;
      if(c.ly<m.t+8 || c.ly>H-m.b-8) return false;
      return !labels.some(l=>intersects(box,l.box));
    }) || candidates[0];
    let lx=Math.max(m.l, Math.min(W-m.r-approxWidth(d), chosen.lx));
    const ly=Math.max(m.t+8, Math.min(H-m.b-8, chosen.ly));
    const underlineY = ly + 6;
    const tickEnd = lx + 8;
    labels.push({d,box:{x:lx,y:ly-5,w:approxWidth(d),h:11},mx,my,lx,ly,tickEnd,underlineY});
  }
  const g=svg.append('g').attr('class','bib-label-layer');
  g.selectAll('path').data(labels).join('path')
    .attr('class','bib-label-leader')
    .attr('d',l=>`M${l.mx},${l.my} L${l.lx},${l.underlineY} L${l.tickEnd},${l.underlineY}`)
    .attr('stroke',l=>bibColor({...l.d, series_or_cluster: colorKey(l.d)}));
  g.selectAll('text').data(labels).join('text')
    .attr('class','bib-mark-label')
    .attr('x',l=>l.tickEnd+3).attr('y',l=>l.ly)
    .attr('fill',l=>bibColor({...l.d, series_or_cluster: colorKey(l.d)}))
    .style('cursor','pointer')
    .on('mousemove',(e,l)=>showTip(e,`<b>${l.d.title}</b>Published: ${l.d.year}<br/>Type: ${cleanLabel(l.d.type)}<br/>Domain: ${cleanLabel(l.d.domain)}`))
    .on('mouseleave',hideTip)
    .on('click',(e,l)=>selectBibliographyEntry(l.d.id))
    .text(l=>l.d.title);
}


function renderBibTable(data){
  const table = document.querySelector('#bibTable');
  if(!table) return;
  const cols = [
    {key:'title', label:'Title'},
    {key:'year', label:'Year'},
    {key:'type', label:'Type'},
    {key:'series_or_cluster', label:'Series / cluster'},
    {key:'domain', label:'Domain'},
    {key:'fiction_status', label:'Fiction / nonfiction'},
    {key:'notes', label:'Notes'}
  ];
  const sorted = [...data].sort((a,b)=>{
    const key=bibSort.key;
    const av=a[key] ?? '', bv=b[key] ?? '';
    if(key==='year') return bibSort.dir * ((+av||0) - (+bv||0));
    return bibSort.dir * String(av).localeCompare(String(bv));
  });
  table.innerHTML = `
    <thead><tr>${cols.map(c=>`<th data-key="${c.key}">${c.label}${bibSort.key===c.key ? (bibSort.dir>0?' ↑':' ↓') : ''}</th>`).join('')}</tr></thead>
    <tbody>${sorted.map(d=>`<tr data-id="${d.id}" tabindex="0">
      <td>${d.title || ''}</td>
      <td>${d.year || ''}</td>
      <td>${cleanLabel(d.type)}</td>
      <td>${cleanLabel(d.series_or_cluster)}</td>
      <td>${cleanLabel(d.domain)}</td>
      <td>${cleanLabel(d.fiction_status)}</td>
      <td>${d.notes || ''}</td>
    </tr>`).join('')}</tbody>`;
  table.querySelectorAll('th').forEach(th=>th.addEventListener('click',()=>{
    const key = th.dataset.key;
    if(bibSort.key===key) bibSort.dir *= -1;
    else bibSort = {key, dir:key==='year'?1:1};
    renderBibTable(data);
  }));
  table.querySelectorAll('tbody tr').forEach(row=>{
    row.addEventListener('click',()=>selectBibliographyEntry(row.dataset.id));
    row.addEventListener('keydown',(e)=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); selectBibliographyEntry(row.dataset.id); } });
  });
}

function bibY(d, axisY){
  return d.fiction_status === 'nonfiction' ? axisY + 50 : axisY - 50;
}
function bibSymbol(d){
  const size = d.fiction_status === 'nonfiction' ? 74 : 58;
  if(d.fiction_status === 'nonfiction') return d3.symbol().type(d3.symbolDiamond).size(size)();
  return d3.symbol().type(d3.symbolCircle).size(size)();
}

function applyFilters(){
  d3.selectAll('.node').classed('filtered', d => !locationIsActive(d));
  d3.selectAll('.time-mark').classed('filtered', d => !bookIsActive(d));
  d3.selectAll('.scatter').classed('filtered', d => !bookIsActive(d));
  d3.selectAll('.route-dot').classed('filtered', d => !bookIsActive(d.book));
  d3.selectAll('.spacer-dot').classed('filtered', () => !activeCores.has('Spacer'));
}
function activateTab(name){
  document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active', b.dataset.tab===name));
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.toggle('active', p.id===`tab-${name}`));
  if(name==='xy') drawXY();
  if(name==='bibliography') drawBibliography();
}
function initTabs(){ document.querySelectorAll('.tab').forEach(btn => btn.addEventListener('click', () => activateTab(btn.dataset.tab))); }
function initButtons(){
  document.querySelector('#resetZoom').addEventListener('click',()=> d3.select('#galaxy').transition().duration(500).call(galaxyZoom.transform, d3.zoomIdentity));
  document.querySelector('#playRoute').addEventListener('click',()=>{
    if(playTimer){ clearInterval(playTimer); playTimer=null; return; }
    let i=0; selectBook(universeBooks[i].id);
    playTimer=setInterval(()=>{ i++; if(i>=universeBooks.length){ clearInterval(playTimer); playTimer=null; return; } selectBook(universeBooks[i].id); }, 850);
  });
  document.querySelector('#bibSearch').addEventListener('input', drawBibliography);
  document.querySelector('#swapXY').addEventListener('click', ()=>{ xySwapped=!xySwapped; drawXY(); });
  document.querySelector('#toggleTimelineScale').addEventListener('click', (e)=>{ timelineScaleMode = timelineScaleMode === 'segmented' ? 'continuous' : 'segmented'; e.target.textContent = timelineScaleMode === 'segmented' ? 'Use unbroken scale' : 'Use discontinuity scale'; drawTimeline(); selectBook(selectedId, {fromWorldPanel:true}); });
}

drawLegend('#mapLegend');
drawLegend('#xyLegend');
drawGalaxy();
drawTimeline();
drawXY();
drawBibliography();
initTabs();
initButtons();
selectBook(selectedId);
