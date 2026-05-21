const data=EMBEDDED_DATA;
const A=new Map(data.authors.map(a=>[a.id,a]));
let selectedAuthor=null;
function $(s){return document.querySelector(s)}
function y(v){const n=parseInt(v,10);return Number.isFinite(n)?n:null}
function authorName(id){return A.get(id)?.name||id}
function typClass(t){
  if(!t) return "type-other";
  if(t.startsWith("Novel")) return "type-novel";
  if(t.includes("Short")||t.includes("Novella")||t.includes("Novelette")) return "type-short";
  if(t.startsWith("Collection")||t.startsWith("Poetry")) return "type-collection";
  if(t.startsWith("Nonfiction")) return "type-nonfiction";
  if(t.startsWith("Media")||t==="Birth"||t==="Death") return "type-media";
  return "type-other";
}
function link(txt,url){return url?`<a href="${url}" target="_blank" rel="noreferrer">${txt}</a>`:""}
function filters(){return{q:$("#search").value.toLowerCase().trim(),type:$("#typeFilter").value,level:parseInt($("#levelFilter").value,10),start:parseInt($("#startYear").value,10),end:parseInt($("#endYear").value,10)}}
function filteredWorks(forTimeline=false){
  const f=filters();
  return data.works.filter(w=>{
    const hay=[w.title,authorName(w.author_id),w.type_path,w.coauthors,w.series,w.lane].join(" ").toLowerCase();
    const yr=y(w.year);
    const typeOk=!f.type || w.type_path===f.type || (!f.type.includes("/") && w.type_path.startsWith(f.type+"/")) || (f.type.endsWith("/Series") && w.type_path.startsWith(f.type+"/"));
    return (!f.q||hay.includes(f.q))&&typeOk&&(!forTimeline||Number(w.timeline_level||3)<=f.level)&&(!yr||yr>=f.start&&yr<=f.end)
  })
}
function setup(){
  [...new Set(data.works.map(w=>w.type_path).filter(Boolean))].sort().forEach(t=>{$("#typeFilter").insertAdjacentHTML("beforeend",`<option>${t}</option>`)});
  document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab,.panel").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("#"+b.dataset.tab).classList.add("active");render()});
  ["search","typeFilter","levelFilter","authorSort","startYear","endYear"].forEach(id=>$("#"+id).addEventListener("input",render)); $("#showMagazineContext")?.addEventListener("change",render);
  $("#resetBtn").onclick=()=>{$("#search").value="";$("#typeFilter").value="";$("#levelFilter").value="3";$("#authorSort").value="birth";$("#startYear").value=1800;$("#endYear").value=2020;render()};
  render()
}
function tip(e,html){const t=$("#tooltip");t.innerHTML=html;t.style.left=e.clientX+"px";t.style.top=e.clientY+"px";t.style.opacity=1}
function untip(){$("#tooltip").style.opacity=0}
function axis(svg,x,start,end,h){for(let yr=Math.ceil(start/25)*25;yr<=end;yr+=25){const xx=x(yr);svg.insertAdjacentHTML("beforeend",`<line class="grid" x1="${xx}" x2="${xx}" y1="20" y2="${h-20}"/><text class="axis" x="${xx}" y="16" text-anchor="middle">${yr}</text>`)} }
function approxTextWidth(label,size=11){return Math.max(28,Math.round(label.length*(size*0.62)))}
function truncateLabel(s,max=34){return s.length>max?s.slice(0,max-1)+"…":s}

function computeLabelLayout(items, xFunc, bounds, opts={}){
  const fontSize=opts.fontSize||11;
  const pad=opts.pad||8;
  const labelPad=opts.labelPad||9;
  const maxTracks=opts.maxTracks||6;
  const offsets=opts.trackOffsets||[-14,14,-28,28,-42,42,0];
  const sorted=[...items].sort((a,b)=>(a.year||9999)-(b.year||9999)||a.title.localeCompare(b.title));
  const tracks={};
  const placed=[];
  function ensureTrack(key){if(!tracks[key]) tracks[key]={intervals:[]}; return tracks[key]}
  function fits(intervals,start,end){return intervals.every(iv=>end < iv.start-pad || start > iv.end+pad)}
  function addInterval(intervals,start,end){intervals.push({start,end}); intervals.sort((a,b)=>a.start-b.start)}

  sorted.forEach((item,idx)=>{
    const label=truncateLabel(item.title, opts.maxChars||34);
    const width=approxTextWidth(label,fontSize);
    const xx=xFunc(item.year);
    const canRight=xx+labelPad+width <= bounds.maxX;
    const canLeft=xx-labelPad-width >= bounds.minX;
    const preferred = (!canLeft || (canRight && xx < (bounds.minX+bounds.maxX)/2)) ? 'R' : 'L';
    const sideOrder = preferred==='R' ? ['R','L'] : ['L','R'];
    let chosen=null;

    for(const side of sideOrder){
      if(side==='R' && !canRight) continue;
      if(side==='L' && !canLeft) continue;
      for(let ti=0; ti<Math.min(maxTracks, offsets.length); ti++){
        const offset = offsets[ti];
        const labelX = side==='R' ? xx+labelPad : xx-labelPad;
        const start = side==='R' ? labelX : labelX-width;
        const end = side==='R' ? labelX+width : labelX;
        const trackKey = `${side}_${offset}`;
        const intervals = ensureTrack(trackKey).intervals;
        if(fits(intervals,start,end)){
          addInterval(intervals,start,end);
          chosen={item,label,width,x:xx,labelX,start,end,offset,side};
          break;
        }
      }
      if(chosen) break;
    }

    if(!chosen){
      const side = canRight ? 'R' : 'L';
      const offset = offsets[(idx)%Math.min(maxTracks,offsets.length)] || 0;
      let labelX;
      if(side==='R'){
        labelX=Math.min(xx+labelPad,bounds.maxX-width);
        chosen={item,label,width,x:xx,labelX,start:labelX,end:labelX+width,offset,side};
      }else{
        labelX=Math.max(bounds.minX+width,xx-labelPad);
        chosen={item,label,width,x:xx,labelX,start:labelX-width,end:labelX,offset,side};
      }
      const trackKey = `${side}_${offset}`;
      addInterval(ensureTrack(trackKey).intervals, chosen.start, chosen.end);
    }
    placed.push(chosen);
  });
  return placed;
}


function sortAuthorsForTimeline(authors, fw){
  const mode=$("#authorSort") ? $("#authorSort").value : "birth";
  function firstVisibleWorkYear(authorId){
    const ys=fw.filter(w=>w.author_id===authorId).map(w=>y(w.year)).filter(Boolean);
    return ys.length?Math.min(...ys):9999
  }
  if(mode==="firstpub"){
    return authors.sort((a,b)=>firstVisibleWorkYear(a.id)-firstVisibleWorkYear(b.id)||(a.birth||9999)-(b.birth||9999)||a.name.localeCompare(b.name));
  }

  const known=authors.filter(a=>a.birth).sort((a,b)=>a.birth-b.birth||firstVisibleWorkYear(a.id)-firstVisibleWorkYear(b.id)||a.name.localeCompare(b.name));
  const unknown=authors.filter(a=>!a.birth).sort((a,b)=>firstVisibleWorkYear(a.id)-firstVisibleWorkYear(b.id)||a.name.localeCompare(b.name));

  const ordered=[...known];
  unknown.forEach(u=>{
    const uy=firstVisibleWorkYear(u.id);
    let idx=ordered.findIndex(a=>firstVisibleWorkYear(a.id)>uy);
    if(idx===-1) idx=ordered.length;
    ordered.splice(idx,0,u);
  });
  return ordered;
}
function majorMagazineContext(){
  const majorNames=["Amazing Stories","Astounding Science Fiction / Analog","Unknown / Unknown Worlds","Galaxy Science Fiction","If / If: Worlds of Science Fiction","Weird Tales"];
  const mags=data.magazines.filter(m=>majorNames.includes(m.name));
  return mags.map(m=>({
    id:m.id,name:m.name,start:m.start,end:m.end||Number($("#endYear")?.value||2020),type:m.type,wiki:m.wiki,
    editors:data.editors.filter(ed=>{
      const pub=ed.publication||"";
      return pub===m.name || m.name.includes(pub) || pub.includes(m.name.split(" / ")[0]) || (m.name.includes("Astounding")&&pub.includes("Astounding")) || (m.name.includes("If")&&pub.includes("If")) || (m.name.includes("Galaxy")&&pub.includes("Galaxy"))
    })
  }));
}
function drawBirthMarker(svg,x,y,r=6){
  const p=document.createElementNS("http://www.w3.org/2000/svg","path");
  const d=`M ${x} ${y-r} L ${x-r} ${y+r} L ${x+r} ${y+r} Z`;
  p.setAttribute("d",d); p.setAttribute("class","birth-marker"); return p;
}
function drawDeathMarker(svg,x,y,r=6){
  const rect=document.createElementNS("http://www.w3.org/2000/svg","rect");
  rect.setAttribute("x",x-r); rect.setAttribute("y",y-r); rect.setAttribute("width",r*2); rect.setAttribute("height",r*2);
  rect.setAttribute("transform",`rotate(45 ${x} ${y})`); rect.setAttribute("class","death-marker"); return rect;
}
function openAuthorDetail(authorId, scrollIntoView=false){
  selectedAuthor=authorId;
  renderLifelines();
  renderAuthorDetail("#inlineAuthorDetail");
  if(scrollIntoView){
    setTimeout(()=>$("#inlineAuthorDetail")?.scrollIntoView({behavior:"smooth",block:"start"}),20);
  }
}

function renderLifelines(){
  const el=$("#lifelineChart");
  el.innerHTML="";
  const f=filters(), left=240, right=60, top=52, rowH=44, contextRowH=30, w=Math.max(1180,el.clientWidth-40), plot=w-left-right, x=yr=>left+((yr-f.start)/(f.end-f.start))*plot;
  const fw=filteredWorks(true);
  let authors=data.authors.filter(a=>fw.some(w=>w.author_id===a.id));
  authors=sortAuthorsForTimeline(authors, fw);
  const showContext=!!$("#showMagazineContext")?.checked;
  const contexts=showContext?majorMagazineContext().filter(m=>m.start<=f.end && (m.end||f.end)>=f.start):[];
  const authorTop=top + (showContext ? contexts.length*contextRowH + 24 : 0);
  const h=authorTop+authors.length*rowH+46;
  const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.setAttribute("width",w);
  svg.setAttribute("height",h);
  axis(svg,x,f.start,f.end,h);

  if(showContext){
    contexts.forEach((m,i)=>{
      const yy=top+i*contextRowH;
      const x1=x(Math.max(m.start,f.start)), x2=x(Math.min(m.end||f.end,f.end));
      svg.insertAdjacentHTML("beforeend",`<text class="context-label" x="8" y="${yy+5}">${m.name}</text>`);
      svg.insertAdjacentHTML("beforeend",`<line class="context-mag-line" x1="${x1}" x2="${x2}" y1="${yy}" y2="${yy}"/>`);
      const dot=document.createElementNS("http://www.w3.org/2000/svg","circle");
      dot.setAttribute("class","context-start"); dot.setAttribute("cx",x1); dot.setAttribute("cy",yy); dot.setAttribute("r",4);
      dot.onmousemove=e=>tip(e,`<strong>${m.name}</strong><br>${m.start}${m.end?"–"+m.end:"–"}`);
      dot.onmouseleave=untip; svg.appendChild(dot);
      m.editors.forEach(ed=>{
        const s=Math.max(ed.start||m.start,f.start), e=Math.min(ed.end||f.end,f.end);
        if(!s || s>f.end || e<f.start) return;
        const ey=yy+9;
        svg.insertAdjacentHTML("beforeend",`<line class="context-editor-line" x1="${x(s)}" x2="${x(e)}" y1="${ey}" y2="${ey}"/>`);
        const sd=document.createElementNS("http://www.w3.org/2000/svg","circle");
        sd.setAttribute("class","context-editor-dot"); sd.setAttribute("cx",x(s)); sd.setAttribute("cy",ey); sd.setAttribute("r",3.5);
        sd.onmousemove=evt=>tip(evt,`<strong>${ed.person}</strong><br>${ed.role}<br>${ed.publication}<br>${ed.start}${ed.end?"–"+ed.end:"–"}`);
        sd.onmouseleave=untip; svg.appendChild(sd);
      });
    });
  }

  authors.forEach((a,i)=>{
    const baseY=authorTop+i*rowH;
    const lab=document.createElementNS("http://www.w3.org/2000/svg","text");
    lab.setAttribute("class","author-label"+(selectedAuthor===a.id?" selected":""));
    lab.setAttribute("x",8);
    lab.setAttribute("y",baseY+5);
    lab.textContent=a.name;
    lab.onclick=()=>openAuthorDetail(a.id,true);
    svg.appendChild(lab);

    if(a.birth){
      const d=a.death||f.end;
      svg.insertAdjacentHTML("beforeend",`<line class="life" x1="${x(Math.max(a.birth,f.start))}" x2="${x(Math.min(d,f.end))}" y1="${baseY}" y2="${baseY}"/>`);
    }

    const works=fw.filter(w=>w.author_id===a.id);
    works.forEach(wk=>{
      const yr=y(wk.year); if(!yr) return;
      const c=document.createElementNS("http://www.w3.org/2000/svg","circle");
      c.setAttribute("class","dot "+typClass(wk.type_path));
      c.setAttribute("cx",x(yr)); c.setAttribute("cy",baseY); c.setAttribute("r",5);
      c.onmousemove=e=>tip(e,`<strong>${wk.title}</strong><br>${a.name}, ${yr}<br>${wk.type_path}`);
      c.onmouseleave=untip;
      svg.appendChild(c);
    });

    const labelCandidates = works.filter(w=>y(w.year) && Number(w.timeline_level||3)<=1);
    const placed = computeLabelLayout(labelCandidates, yr=>x(yr), {minX:left+6,maxX:w-right-6}, {fontSize:10.5,maxTracks:4,maxChars:26,trackOffsets:[-14,14,-26,26,0]});
    placed.forEach(p=>{
      const labelY=baseY+4+p.offset;
      const leader=document.createElementNS("http://www.w3.org/2000/svg","line");
      const anchorX = p.side==='R' ? p.labelX-3 : p.labelX+3;
      leader.setAttribute('x1',p.x); leader.setAttribute('x2',anchorX); leader.setAttribute('y1',baseY+(p.offset>0?5:-5)); leader.setAttribute('y2',labelY-4);
      leader.setAttribute('class','label-leader');
      svg.appendChild(leader);
      const tx=document.createElementNS("http://www.w3.org/2000/svg","text");
      tx.setAttribute('class','work-title work-title-shadow main-label');
      tx.setAttribute('x',p.labelX);
      tx.setAttribute('y',labelY);
      tx.setAttribute('text-anchor', p.side==='R' ? 'start' : 'end');
      tx.textContent=p.label;
      tx.onmousemove=e=>tip(e,`<strong>${p.item.title}</strong><br>${a.name}, ${p.item.year}<br>${p.item.type_path}`);
      tx.onmouseleave=untip;
      svg.appendChild(tx);
    });
  });
  el.appendChild(svg);
}

function renderGlobal(){
  const el=$("#globalTimeline"); el.innerHTML="";
  const f=filters(),left=90,right=40,top=42,rowH=30,w=Math.max(1180,el.clientWidth-40),plot=w-left-right,x=yr=>left+((yr-f.start)/(f.end-f.start))*plot;
  let ev=[];
  data.authors.forEach(a=>{
    if(a.birth>=f.start&&a.birth<=f.end)ev.push({year:a.birth,label:a.name+" born",type:"Birth",detail:a.name});
    if(a.death>=f.start&&a.death<=f.end)ev.push({year:a.death,label:a.name+" dies",type:"Death",detail:a.name})
  });
  filteredWorks(true).forEach(w=>{if(y(w.year))ev.push({year:y(w.year),label:w.title,type:w.type_path,detail:authorName(w.author_id)})});
  data.magazines.forEach(m=>{
    if(m.start<=f.end&&(m.end||f.end)>=f.start)ev.push({year:m.start,end:m.end||f.end,label:m.name,type:"Magazine",detail:m.type,mag:m});
  });
  data.editors.forEach(ed=>{
    if(ed.start>=f.start&&ed.start<=f.end)ev.push({year:ed.start,label:`${ed.person} starts at ${ed.publication}`,type:"Editor start",detail:ed.role});
    if(ed.end&&ed.end>=f.start&&ed.end<=f.end)ev.push({year:ed.end,label:`${ed.person} exits ${ed.publication}`,type:"Editor exit",detail:ed.role});
  });
  ev.sort((a,b)=>a.year-b.year||a.label.localeCompare(b.label));
  const h=top+ev.length*rowH+45;
  const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.setAttribute("width",w); svg.setAttribute("height",h); axis(svg,x,f.start,f.end,h);

  ev.forEach((e,i)=>{
    const yy=top+i*rowH;
    const xx=x(e.year);
    if(e.type==="Magazine" && e.end&&e.end!==e.year){
      const x1=x(Math.max(e.year,f.start)), x2=x(Math.min(e.end,f.end));
      svg.insertAdjacentHTML("beforeend",`<line class="magline" x1="${x1}" x2="${x2}" y1="${yy}" y2="${yy}"/>`);
      const relatedEditors=data.editors.filter(ed=>{
        const pub=ed.publication||"";
        return pub===e.label || e.label.includes(pub) || pub.includes(e.label.split(" / ")[0]) || (e.label.includes("Astounding")&&pub.includes("Astounding")) || (e.label.includes("If")&&pub.includes("If")) || (e.label.includes("Galaxy")&&pub.includes("Galaxy"))
      });
      relatedEditors.forEach(ed=>{
        const s=Math.max(ed.start||e.year,f.start), ee=Math.min(ed.end||f.end,f.end);
        if(!s || s>f.end || ee<f.start) return;
        const ey=yy+9;
        svg.insertAdjacentHTML("beforeend",`<line class="editorline" x1="${x(s)}" x2="${x(ee)}" y1="${ey}" y2="${ey}"/>`);
        const sd=document.createElementNS("http://www.w3.org/2000/svg","circle");
        sd.setAttribute("class","context-editor-dot"); sd.setAttribute("cx",x(s)); sd.setAttribute("cy",ey); sd.setAttribute("r",3.5);
        sd.onmousemove=evt=>tip(evt,`<strong>${ed.person}</strong><br>${ed.role}<br>${ed.publication}<br>${ed.start}${ed.end?"–"+ed.end:"–"}`);
        sd.onmouseleave=untip; svg.appendChild(sd);
      });
      const labelText=`${e.year}–${e.end} · ${e.label}`;
      const labelX=Math.min(Math.max(x2+12,left+4),w-360);
      const bg=document.createElementNS("http://www.w3.org/2000/svg","rect");
      bg.setAttribute("class","global-row-label-bg");
      bg.setAttribute("x",labelX-5); bg.setAttribute("y",yy-12);
      bg.setAttribute("width",Math.min(approxTextWidth(labelText,12)+10,w-labelX-10));
      bg.setAttribute("height",19); bg.setAttribute("rx",5);
      svg.appendChild(bg);
      const tx=document.createElementNS("http://www.w3.org/2000/svg","text");
      tx.setAttribute("class","global-band-label"); tx.setAttribute("x",labelX); tx.setAttribute("y",yy+4);
      tx.textContent=labelText;
      tx.onmousemove=evt=>tip(evt,`<strong>${e.label}</strong><br>${e.type}<br>${e.detail||""}`);
      tx.onmouseleave=untip;
      svg.appendChild(tx);
    }else{
      if(e.type==="Birth"){
        const bm=drawBirthMarker(svg,xx,yy,6);
        bm.onmousemove=evt=>tip(evt,`<strong>${e.label}</strong><br>${e.year}<br>${e.detail||""}`);
        bm.onmouseleave=untip;
        svg.appendChild(bm);
      }else if(e.type==="Death"){
        const dm=drawDeathMarker(svg,xx,yy,5.5);
        dm.onmousemove=evt=>tip(evt,`<strong>${e.label}</strong><br>${e.year}<br>${e.detail||""}`);
        dm.onmouseleave=untip;
        svg.appendChild(dm);
      }else if(e.type==="Editor start" || e.type==="Editor exit"){
        const marker=document.createElementNS("http://www.w3.org/2000/svg","circle");
        marker.setAttribute("class","context-editor-dot"); marker.setAttribute("cx",xx); marker.setAttribute("cy",yy); marker.setAttribute("r",5);
        marker.onmousemove=evt=>tip(evt,`<strong>${e.label}</strong><br>${e.year}<br>${e.detail||""}`);
        marker.onmouseleave=untip;
        svg.appendChild(marker);
      }else{
        svg.insertAdjacentHTML("beforeend",`<circle class="dot ${typClass(e.type)}" cx="${xx}" cy="${yy}" r="5"/>`)
      }
      const tx=document.createElementNS("http://www.w3.org/2000/svg","text");
      tx.setAttribute("class","event-label"); tx.setAttribute("x",Math.min(xx+10,w-360)); tx.setAttribute("y",yy+4);
      tx.textContent=`${e.year} · ${e.label}`;
      tx.onmousemove=evt=>tip(evt,`<strong>${e.label}</strong><br>${e.type}<br>${e.detail||""}`);
      tx.onmouseleave=untip;
      svg.appendChild(tx)
    }
  });
  el.appendChild(svg)
}

function renderWorksTable(){const tb=$("#worksTable tbody");tb.innerHTML="";filteredWorks(false).sort((a,b)=>authorName(a.author_id).localeCompare(authorName(b.author_id))||(a.year||9999)-(b.year||9999)).forEach(w=>{const a=A.get(w.author_id)||{};const links=[link("Author Wiki",a.wiki),link("Author GR",a.goodreads),link("Work Wiki",w.wiki),link("Work GR",w.goodreads)].filter(Boolean).join(" · ");tb.insertAdjacentHTML("beforeend",`<tr><td>${authorName(w.author_id)}</td><td><strong>${w.title}</strong>${w.first_publication_context?`<br><small>First publication: ${w.first_publication_context}</small>`:""}</td><td>${w.type_path}</td><td>${w.year||""}</td><td>${w.coauthors||"—"}</td><td>${w.series||"Standalone"}</td><td>${w.list_source||"Original reading list"}</td><td>${links||"—"}</td></tr>`)});}
function renderMagTable(){const tb=$("#magTable tbody");tb.innerHTML="";data.magazines.sort((a,b)=>a.start-b.start).forEach(m=>{const es=data.editors.filter(e=>e.publication===m.name||m.name.includes(e.publication)||e.publication.includes(m.name.split(" / ")[0]));tb.insertAdjacentHTML("beforeend",`<tr><td><strong>${m.name}</strong></td><td>${m.type}</td><td>${m.start}${m.end?"–"+m.end:"–"}</td><td>${es.map(e=>e.person).join("; ")||"—"}</td><td>${es.map(e=>e.role).join("; ")||"—"}</td><td>${es.map(e=>e.start+(e.end?"–"+e.end:"–")).join("; ")||"—"}</td><td>${link("Wiki",m.wiki)||"—"}</td></tr>`)});}

function seriesLabel(w){
  if(w.type_path && w.type_path.startsWith("Nonfiction")) return "Nonfiction";
  if(w.type_path && (w.type_path.startsWith("Collection") || w.type_path.startsWith("Poetry"))) return "Short story collections";
  if(w.author_id==="isaac_asimov" && w.series==="Foundation universe"){
    const lane=(w.lane||"").toLowerCase();
    if(lane.includes("robot") || lane.includes("spacer")) return "Robot / Spacer series";
    if(lane.includes("empire")) return "Empire series";
    if(lane.includes("merged")) return "Merged Foundation universe";
    if(lane.includes("foundation")) return "Foundation series";
  }
  if(w.series) return w.series;
  if(w.type_path && (w.type_path.includes("Short story") || w.type_path.includes("Novella") || w.type_path.includes("Novelette"))) return "Short fiction";
  if(w.type_path && w.type_path.startsWith("Media")) return "Adaptations / media";
  return "Standalone novels";
}
function laneRank(label){
  const lower=label.toLowerCase();
  if(lower==="standalone novels") return 0;
  if(lower==="short story collections") return 10;
  if(lower.includes("robot") || lower.includes("spacer")) return 20;
  if(lower.includes("empire")) return 21;
  if(lower.includes("foundation")) return 22;
  if(lower==="short fiction") return 30;
  if(lower.includes("adaptation") || lower.includes("media")) return 90;
  if(lower==="nonfiction") return 100;
  return 40;
}
function sortedLaneLabels(ws){return [...new Set(ws.map(seriesLabel))].sort((a,b)=>laneRank(a)-laneRank(b)||a.localeCompare(b))}

function renderAuthorDetail(targetSelector="#authorDetail"){
  const el=$(targetSelector);
  if(!selectedAuthor){el.className="card detail empty";el.textContent=targetSelector==="#inlineAuthorDetail"?"":"Click an author to view their bibliography timeline.";return}
  const a=A.get(selectedAuthor);
  const ws=data.works.filter(w=>w.author_id===selectedAuthor).sort((p,q)=>(p.year||9999)-(q.year||9999));
  const lanes=sortedLaneLabels(ws);
  const years=ws.map(w=>w.year).filter(Boolean);
  const minYear=years.length?Math.min(...years):(a.birth||1800);
  const maxYear=years.length?Math.max(...years):(a.death||2020);
  const start=Math.min(a.birth||minYear,minYear)-5;
  const end=Math.max(a.death||maxYear,maxYear)+5;
  el.className="card detail";
  const miniId = targetSelector==="#inlineAuthorDetail" ? "authorMiniInline" : "authorMiniBottom";
  el.innerHTML=`<div class="detail-head"><div><h3>${a.name}</h3><div>${a.birth||"Dates unknown"}${a.birth?"–"+(a.death||""):""}</div><div>${link("Wikipedia",a.wiki)} ${a.goodreads?" · "+link("Goodreads",a.goodreads):""}</div></div><div><small>Series / sections</small><br>${lanes.map(l=>`<span class="pill">${l}</span>`).join("")}</div></div><div class="mini" id="${miniId}"></div><div class="tablewrap"><table><thead><tr><th>Title</th><th>Type</th><th>Year</th><th>Collaborator</th><th>Series / section</th><th>List source</th><th>Links</th></tr></thead><tbody>${ws.map(w=>`<tr><td><strong>${w.title}</strong></td><td>${w.type_path}</td><td>${w.year||""}</td><td>${w.coauthors||"—"}</td><td>${seriesLabel(w)}</td><td>${w.list_source||"Original reading list"}</td><td>${[link("Wiki",w.wiki),link("GR",w.goodreads)].filter(Boolean).join(" · ")||"—"}</td></tr>`).join("")}</tbody></table></div>`;
  renderAuthorMini(a,ws,lanes,start,end,miniId)
}

function renderAuthorMini(a,ws,lanes,start,end,miniId="authorMiniInline"){
  const el=$("#"+miniId);
  const left=210,right=50,top=54,rowH=60,w=Math.max(1260,el.clientWidth-40),plot=w-left-right,x=yr=>left+((yr-start)/(end-start))*plot;
  const h=top+lanes.length*rowH+34;
  const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.setAttribute("width",w); svg.setAttribute("height",h);
  axis(svg,x,start,end,h);

  lanes.forEach((lane,idx)=>{
    const baseY=top+idx*rowH;
    const rowShade=document.createElementNS("http://www.w3.org/2000/svg","rect");
    rowShade.setAttribute('class','lane-band'+(idx%2? ' alt':''));
    rowShade.setAttribute('x',0); rowShade.setAttribute('y',baseY-rowH/2+8); rowShade.setAttribute('width',w); rowShade.setAttribute('height',rowH-10);
    svg.appendChild(rowShade);

    const laneText=document.createElementNS("http://www.w3.org/2000/svg","text");
    laneText.setAttribute('class','author-label'); laneText.setAttribute('x',8); laneText.setAttribute('y',baseY+5); laneText.textContent=lane;
    svg.appendChild(laneText);

    const items=ws.filter(w=>seriesLabel(w)===lane && w.year);
    const placed=computeLabelLayout(items, yr=>x(yr), {minX:left+6,maxX:w-right-6}, {fontSize:11,maxTracks:6,maxChars:36,trackOffsets:[-16,16,-30,30,-44,44,0]});
    items.forEach(w=>{
      const c=document.createElementNS("http://www.w3.org/2000/svg","circle");
      c.setAttribute('class','dot '+typClass(w.type_path)); c.setAttribute('cx',x(w.year)); c.setAttribute('cy',baseY); c.setAttribute('r',6);
      c.onmousemove=e=>tip(e,`<strong>${w.title}</strong><br>${w.year}<br>${w.type_path}`); c.onmouseleave=untip;
      svg.appendChild(c);
    });
    placed.forEach(p=>{
      const labelY=baseY+4+p.offset;
      const leader=document.createElementNS("http://www.w3.org/2000/svg","line");
      const anchorX = p.side==='R' ? p.labelX-4 : p.labelX+4;
      leader.setAttribute('x1',p.x); leader.setAttribute('x2',anchorX); leader.setAttribute('y1',baseY+(p.offset>0?5:-5)); leader.setAttribute('y2',labelY-4); leader.setAttribute('class','label-leader');
      svg.appendChild(leader);
      const tx=document.createElementNS("http://www.w3.org/2000/svg","text");
      tx.setAttribute('class','work-title work-title-shadow'); tx.setAttribute('x',p.labelX); tx.setAttribute('y',labelY); tx.setAttribute('text-anchor', p.side==='R' ? 'start' : 'end'); tx.textContent=p.label;
      tx.onmousemove=e=>tip(e,`<strong>${p.item.title}</strong><br>${p.item.year}<br>${p.item.type_path}`); tx.onmouseleave=untip;
      svg.appendChild(tx);
    });
  });
  el.appendChild(svg)
}

function render(){renderLifelines();renderGlobal();renderWorksTable();renderMagTable();renderAuthorDetail("#inlineAuthorDetail"); const bottom=$("#authorDetail"); if(bottom){bottom.className="card detail empty"; bottom.textContent="";}}
setup();
