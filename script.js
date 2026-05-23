const data=EMBEDDED_DATA;
const A=new Map(data.authors.map(a=>[a.id,a]));
const PUBLICATIONS=data.publications||data.magazines||[];
const PUBLICATION_BY_ID=new Map(PUBLICATIONS.map(p=>[p.id,p]));
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
function activeTab(){return document.querySelector(".tab.active")?.dataset.tab || "lifelines"}
function controlApplies(id,tab=activeTab()){
  const el=$("#"+id);
  const wrapper=el?.closest(".context-control");
  if(!wrapper) return true;
  return (wrapper.dataset.tabs||"").split(/\s+/).includes(tab);
}
function filters(){
  const tab=activeTab();
  return{
    q:controlApplies("search",tab)?$("#search").value.toLowerCase().trim():"",
    type:controlApplies("typeFilter",tab)?$("#typeFilter").value:"",
    level:controlApplies("levelFilter",tab)?parseInt($("#levelFilter").value,10):3,
    start:controlApplies("startYear",tab)?parseInt($("#startYear").value,10):1800,
    end:controlApplies("endYear",tab)?parseInt($("#endYear").value,10):2020
  }
}
function filteredWorks(forTimeline=false){
  const f=filters();
  return data.works.filter(w=>{
    const hay=[w.title,authorName(w.author_id),w.type_path,w.coauthors,w.series,w.lane].join(" ").toLowerCase();
    const yr=y(w.year);
    const typeOk=!f.type || w.type_path===f.type || (!f.type.includes("/") && w.type_path.startsWith(f.type+"/")) || (f.type.endsWith("/Series") && w.type_path.startsWith(f.type+"/"));
    return (!f.q||hay.includes(f.q))&&typeOk&&(!forTimeline||Number(w.timeline_level||3)<=f.level)&&(!yr||yr>=f.start&&yr<=f.end)
  })
}

function sourceLabel(v){
  if(v==="Original reading list") return "Reading list";
  if(v==="User addition") return "Additional Favourites";
  return v||"Reading list";
}
function setTheme(theme){
  document.body.classList.remove("theme-archive","theme-pulp","theme-space","theme-archivePlus","theme-atomicPulp","theme-newWave","theme-neonOrbit");
  document.body.classList.add("theme-"+(theme||"archive"));
}
function selectedGlobalTypes(){
  const boxes=[...document.querySelectorAll(".global-event-filter")];
  if(!boxes.length) return new Set(["works","media","birth","death","magazines","editor-tenures","editor-events"]);
  return new Set(boxes.filter(b=>b.checked).map(b=>b.value));
}
function relatedEditorsForPublication(label){
  return data.editors.filter(ed=>{
    const p=PUBLICATIONS.find(pub=>pub.name===label);
    return (p && ed.publication_id===p.id) || publicationMatches(ed.publication,label);
  });
}
function publicationMatches(pub,label){
  pub=pub||""; label=label||"";
  return pub===label || label.includes(pub) || pub.includes(label.split(" / ")[0]) || (label.includes("Astounding")&&pub.includes("Astounding")) || (label.includes("If")&&pub.includes("If")) || (label.includes("Galaxy")&&pub.includes("Galaxy"));
}
function publicationLaneForEditor(ed){
  const match=PUBLICATION_BY_ID.get(ed.publication_id) || PUBLICATIONS.find(m=>publicationMatches(ed.publication,m.name));
  return match ? match.name : ed.publication;
}
function buildGlobalEvents(){
  const f=filters(), selected=selectedGlobalTypes();
  const events=[], spans=[];
  if(selected.has("birth")){
    data.authors.forEach(a=>{if(a.birth>=f.start&&a.birth<=f.end)events.push({year:a.birth,label:a.name+" born",kind:"birth",type:"Birth",detail:a.name,priority:1})});
  }
  if(selected.has("death")){
    data.authors.forEach(a=>{if(a.death>=f.start&&a.death<=f.end)events.push({year:a.death,label:a.name+" dies",kind:"death",type:"Death",detail:a.name,priority:2})});
  }
  filteredWorks(true).forEach(w=>{
    const yr=y(w.year); if(!yr) return;
    const isMedia=w.type_path && w.type_path.startsWith("Media");
    if((isMedia && !selected.has("media")) || (!isMedia && !selected.has("works"))) return;
    events.push({year:yr,label:w.title,kind:isMedia?"media":"work",type:w.type_path,detail:authorName(w.author_id),priority:Number(w.timeline_level||3),work:w});
  });
  if(selected.has("magazines")){
    PUBLICATIONS.forEach(m=>{
      const end=m.end||f.end;
      if(m.start<=f.end&&end>=f.start)spans.push({start:m.start,end:end,label:m.name,kind:"publication",type:m.publication_type||m.type||"Publication",detail:m.type,priority:1,mag:m,lane:m.name});
    });
  }
  if(selected.has("editor-tenures")){
    data.editors.forEach(ed=>{
      const end=ed.end||f.end;
      if(ed.start<=f.end&&end>=f.start)spans.push({start:ed.start,end:end,label:ed.person+" · "+ed.publication,kind:"editor-tenure",type:"Editor tenure",detail:ed.role,priority:1,editor:ed,lane:publicationLaneForEditor(ed)});
    });
  }
  if(selected.has("editor-events")){
    data.editors.forEach(ed=>{
      if(ed.start>=f.start&&ed.start<=f.end)events.push({year:ed.start,label:`${ed.person} starts at ${ed.publication}`,kind:"editor-start",type:"Editor start",detail:ed.role,priority:1,editor:ed});
      if(ed.end&&ed.end>=f.start&&ed.end<=f.end)events.push({year:ed.end,label:`${ed.person} exits ${ed.publication}`,kind:"editor-exit",type:"Editor exit",detail:ed.role,priority:1,editor:ed});
    });
  }
  events.sort((a,b)=>a.year-b.year||a.priority-b.priority||a.label.localeCompare(b.label));
  spans.sort((a,b)=>a.start-b.start||a.label.localeCompare(b.label));
  return {events,spans};
}
function globalKindClass(d){
  if(d.kind==="birth") return "birth";
  if(d.kind==="death") return "death";
  if(d.kind==="media") return "type-media";
  if(d.kind==="editor-start"||d.kind==="editor-exit") return "type-editor";
  if(d.kind==="work") return typClass(d.type);
  return "type-other";
}
function eventSymbol(kind){
  if(kind==="birth") return "▲";
  if(kind==="death") return "◆";
  if(kind==="media") return "▶";
  if(kind==="editor-start") return "✚";
  if(kind==="editor-exit") return "×";
  if(kind==="work") return "●";
  return "•";
}

function updateContextualControls(tab=activeTab()){
  const search=$("#search")?.closest("label");
  if(search && !search.classList.contains("context-control")){
    search.classList.add("context-control");
    search.dataset.tabs="lifelines reading";
  }
  document.querySelectorAll(".context-control").forEach(control=>{
    const tabs=(control.dataset.tabs||"").split(/\s+/);
    control.classList.toggle("control-hidden",!tabs.includes(tab));
  });
}

function setup(){
  document.body.classList.add("theme-archive");
  [...new Set(data.works.map(w=>w.type_path).filter(Boolean))].sort().forEach(t=>{$("#typeFilter").insertAdjacentHTML("beforeend",`<option>${t}</option>`)});
  document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab,.panel").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("#"+b.dataset.tab).classList.add("active");updateContextualControls(b.dataset.tab);render()});
  ["search","typeFilter","levelFilter","authorSort","startYear","endYear"].forEach(id=>$("#"+id)?.addEventListener("input",render));
  $("#showMagazineContext")?.addEventListener("change",render);
  $("#themeSelect")?.addEventListener("change",e=>{setTheme(e.target.value); render()});
  document.querySelectorAll(".global-event-filter").forEach(cb=>cb.addEventListener("change",renderGlobal));
  $("#globalScale")?.addEventListener("input",renderGlobal);
  $("#globalLabelDensity")?.addEventListener("input",renderGlobal);
  $("#globalAll")?.addEventListener("click",()=>{document.querySelectorAll(".global-event-filter").forEach(cb=>cb.checked=true);renderGlobal()});
  $("#globalNone")?.addEventListener("click",()=>{document.querySelectorAll(".global-event-filter").forEach(cb=>cb.checked=false);renderGlobal()});
  $("#resetBtn").onclick=()=>{$("#search").value="";$("#typeFilter").value="";$("#levelFilter").value="3";if($("#authorSort")) $("#authorSort").value="birth";$("#startYear").value=1800;$("#endYear").value=2020;if($("#themeSelect")){$("#themeSelect").value="archive";setTheme("archive")}render()};
  // Explicit default: open the Author timeline first.
  document.querySelectorAll(".tab,.panel").forEach(x=>x.classList.remove("active"));
  document.querySelector('[data-tab="lifelines"]')?.classList.add("active");
  $("#lifelines")?.classList.add("active");
  updateContextualControls("lifelines");
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
      if(opts.dropUnplaced) return;
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
  const majorNames=["Amazing Stories","Astounding Science Fiction / Analog","Unknown / Unknown Worlds","Galaxy Science Fiction","If / If: Worlds of Science Fiction","If / Worlds of If","Weird Tales"];
  const mags=PUBLICATIONS.filter(m=>majorNames.includes(m.name));
  return mags.map(m=>({
    id:m.id,name:m.name,start:m.start,end:m.end||Number($("#endYear")?.value||2020),type:m.type,wiki:m.wiki,
    editors:data.editors.filter(ed=>ed.publication_id===m.id || publicationMatches(ed.publication,m.name))
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
  if(window.d3) renderLifelinesD3();
  else renderLifelinesNative();
}

function renderLifelinesD3(){
  const el=$("#lifelineChart");
  el.innerHTML="";
  const f=filters(), left=240, right=60, top=52, rowH=44, contextRowH=30, w=Math.max(1180,el.clientWidth-40), plot=w-left-right;
  const x=d3.scaleLinear().domain([f.start,f.end]).range([left,w-right]);
  const fw=filteredWorks(true);
  let authors=data.authors.filter(a=>fw.some(w=>w.author_id===a.id));
  authors=sortAuthorsForTimeline(authors, fw);
  const showContext=!!$("#showMagazineContext")?.checked;
  const contexts=showContext?majorMagazineContext().filter(m=>m.start<=f.end && (m.end||f.end)>=f.start):[];
  const authorTop=top + (showContext ? contexts.length*contextRowH + 24 : 0);
  const h=authorTop+authors.length*rowH+46;
  const svg=d3.select(el).append("svg").attr("width",w).attr("height",h);

  for(let yr=Math.ceil(f.start/25)*25;yr<=f.end;yr+=25){
    const xx=x(yr);
    svg.append("line").attr("class","grid").attr("x1",xx).attr("x2",xx).attr("y1",20).attr("y2",h-20);
    svg.append("text").attr("class","axis").attr("x",xx).attr("y",16).attr("text-anchor","middle").text(yr);
  }

  if(showContext){
    contexts.forEach((m,i)=>{
      const yy=top+i*contextRowH;
      const x1=x(Math.max(m.start,f.start)), x2=x(Math.min(m.end||f.end,f.end));
      svg.append("text").attr("class","context-label").attr("x",8).attr("y",yy+5).text(m.name);
      svg.append("line").attr("class","context-mag-line").attr("x1",x1).attr("x2",x2).attr("y1",yy).attr("y2",yy);
      svg.append("circle").attr("class","context-start").attr("cx",x1).attr("cy",yy).attr("r",4)
        .on("mousemove",event=>tip(event,`<strong>${m.name}</strong><br>${m.start}${m.end?"–"+m.end:"–"}`))
        .on("mouseleave",untip);
      m.editors.forEach(ed=>{
        const s=Math.max(ed.start||m.start,f.start), e=Math.min(ed.end||f.end,f.end);
        if(!s || s>f.end || e<f.start) return;
        const ey=yy+9;
        svg.append("line").attr("class","context-editor-line").attr("x1",x(s)).attr("x2",x(e)).attr("y1",ey).attr("y2",ey);
        svg.append("circle").attr("class","context-editor-dot").attr("cx",x(s)).attr("cy",ey).attr("r",3.5)
          .on("mousemove",event=>tip(event,`<strong>${ed.person}</strong><br>${ed.role}<br>${ed.publication}<br>${ed.start}${ed.end?"–"+ed.end:"–"}`))
          .on("mouseleave",untip);
      });
    });
  }

  authors.forEach((a,i)=>{
    const baseY=authorTop+i*rowH;
    svg.append("text")
      .attr("class","author-label"+(selectedAuthor===a.id?" selected":""))
      .attr("x",8)
      .attr("y",baseY+5)
      .text(a.name)
      .on("click",()=>openAuthorDetail(a.id,true));

    if(a.birth){
      const d=a.death||f.end;
      svg.append("line")
        .attr("class","author-name-guide")
        .attr("x1",150)
        .attr("x2",Math.max(150,x(Math.max(a.birth,f.start))-8))
        .attr("y1",baseY)
        .attr("y2",baseY);
      svg.append("line").attr("class","life")
        .attr("x1",x(Math.max(a.birth,f.start)))
        .attr("x2",x(Math.min(d,f.end)))
        .attr("y1",baseY)
        .attr("y2",baseY);
    }

    const works=fw.filter(w=>w.author_id===a.id);
    const labelCandidates=works.filter(w=>y(w.year) && Number(w.timeline_level||3)<=1);
    const placed=computeLabelLayout(labelCandidates, yr=>x(yr), {minX:left+6,maxX:w-right-6}, {fontSize:10.5,maxTracks:5,maxChars:26,trackOffsets:[-14,14,-26,26,0],dropUnplaced:true});

    placed.forEach(p=>{
      const labelY=baseY+4+p.offset;
      const anchorX=p.side==='R' ? p.labelX-3 : p.labelX+3;
      const baselineY=labelY+3;
      const tailX=p.side==='R' ? anchorX+17 : anchorX-17;
      svg.append("polyline")
        .attr("class","label-leader")
        .attr("points",`${p.x},${baseY} ${anchorX},${baselineY} ${tailX},${baselineY}`);
    });

    works.forEach(wk=>{
      const yr=y(wk.year); if(!yr) return;
      svg.append("circle")
        .attr("class","dot "+typClass(wk.type_path))
        .attr("cx",x(yr))
        .attr("cy",baseY)
        .attr("r",5)
        .on("mousemove",event=>tip(event,`<strong>${wk.title}</strong><br>${a.name}, ${yr}<br>${wk.type_path}`))
        .on("mouseleave",untip);
    });

    placed.forEach(p=>{
      const labelY=baseY+4+p.offset;
      svg.append("text")
        .attr("class","work-title work-title-shadow main-label")
        .attr("x",p.labelX)
        .attr("y",labelY)
        .attr("text-anchor",p.side==='R' ? 'start' : 'end')
        .text(p.label)
        .on("mousemove",event=>tip(event,`<strong>${p.item.title}</strong><br>${a.name}, ${p.item.year}<br>${p.item.type_path}`))
        .on("mouseleave",untip);
    });
  });
}

function renderLifelinesNative(){
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
      const guide=document.createElementNS("http://www.w3.org/2000/svg","line");
      guide.setAttribute("class","author-name-guide");
      guide.setAttribute("x1",150);
      guide.setAttribute("x2",Math.max(150,x(Math.max(a.birth,f.start))-8));
      guide.setAttribute("y1",baseY);
      guide.setAttribute("y2",baseY);
      svg.appendChild(guide);
      svg.insertAdjacentHTML("beforeend",`<line class="life" x1="${x(Math.max(a.birth,f.start))}" x2="${x(Math.min(d,f.end))}" y1="${baseY}" y2="${baseY}"/>`);
    }

    const works=fw.filter(w=>w.author_id===a.id);
    const labelCandidates = works.filter(w=>y(w.year) && Number(w.timeline_level||3)<=1);
    const placed = computeLabelLayout(labelCandidates, yr=>x(yr), {minX:left+6,maxX:w-right-6}, {fontSize:10.5,maxTracks:4,maxChars:26,trackOffsets:[-14,14,-26,26,0]});
    placed.forEach(p=>{
      const labelY=baseY+4+p.offset;
      const anchorX = p.side==='R' ? p.labelX-3 : p.labelX+3;
      const baselineY=labelY+3;
      const tailX=p.side==='R' ? anchorX+17 : anchorX-17;
      const leader=document.createElementNS("http://www.w3.org/2000/svg","polyline");
      leader.setAttribute('points',`${p.x},${baseY} ${anchorX},${baselineY} ${tailX},${baselineY}`);
      leader.setAttribute('class','label-leader');
      svg.appendChild(leader);
    });
    works.forEach(wk=>{
      const yr=y(wk.year); if(!yr) return;
      const c=document.createElementNS("http://www.w3.org/2000/svg","circle");
      c.setAttribute("class","dot "+typClass(wk.type_path));
      c.setAttribute("cx",x(yr)); c.setAttribute("cy",baseY); c.setAttribute("r",5);
      c.onmousemove=e=>tip(e,`<strong>${wk.title}</strong><br>${a.name}, ${yr}<br>${wk.type_path}`);
      c.onmouseleave=untip;
      svg.appendChild(c);
    });
    placed.forEach(p=>{
      const labelY=baseY+4+p.offset;
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
  const el=$("#globalTimeline");
  const stream=$("#globalEventStream");
  if(!el || !stream) return;
  el.innerHTML="";
  stream.innerHTML="";
  const f=filters();
  const scale=Number($("#globalScale")?.value||9);
  const density=Number($("#globalLabelDensity")?.value||2);
  const {events,spans}=buildGlobalEvents();
  const pxPerYear=scale*7;
  const margin={top:112,right:70,bottom:150,left:150};
  const width=Math.max(960,(f.end-f.start)*pxPerYear+margin.left+margin.right);
  const spanLaneGap=0, spanRowGap=21, spanLabelRowH=11, eventLaneH=26;
  const labelRows=Math.max(8, density*6);
  const axisY=46;
  const x=yr=>margin.left+((yr-f.start)/(f.end-f.start))*(width-margin.left-margin.right);

  const sorted=[...events].sort((a,b)=>a.year-b.year||a.priority-b.priority||a.label.localeCompare(b.label));
  const rowsTop=[], rowsBottom=[];
  function reserve(rows, x1, x2, maxRows){
    for(let i=0;i<maxRows;i++){
      if(!rows[i]) rows[i]=[];
      if(rows[i].every(iv=>x2 < iv[0]-8 || x1 > iv[1]+8)){rows[i].push([x1,x2]); return i;}
    }
    return -1;
  }
  const maxRows=density*5;
  const labelled=[];
  sorted.forEach((d,idx)=>{
    const xx=x(d.year);
    const label=`${d.year} · ${truncateLabel(d.label,36)}`;
    const widthGuess=approxTextWidth(label,12);
    const side=idx%2===0?"top":"bottom";
    let row=reserve(side==="top"?rowsTop:rowsBottom, xx-widthGuess/2, xx+widthGuess/2, maxRows);
    const show = row>=0 && (density===3 || d.priority<=density || d.kind==="birth" || d.kind==="death" || d.kind.startsWith("editor"));
    labelled.push({...d,xx,show,row:row<0?0:row,side,label});
  });

  function layoutSpanRows(items){
    const rows=[];
    let maxRow=0;
    const laidOut=items.map(item=>{
      const x1=x(Math.max(item.start,f.start)), x2=x(Math.min(item.end,f.end));
      let row=0;
      if(item.kind==="editor-tenure"){
        row=rows.findIndex((r,idx)=>idx>0 && r.every(iv=>x2 < iv[0]-12 || x1 > iv[1]+12));
        if(row<0) row=Math.max(1,rows.length);
      }
      if(!rows[row]) rows[row]=[];
      rows[row].push([x1,x2]);
      maxRow=Math.max(maxRow,row);
      return {...item,_x1:x1,_x2:x2,_row:row};
    });
    return {items:laidOut,maxRow};
  }
  const spanLanes=[...new Set(spans.map(s=>s.lane))].sort((a,b)=>{
    const aStart=Math.min(...spans.filter(s=>s.lane===a).map(s=>s.start));
    const bStart=Math.min(...spans.filter(s=>s.lane===b).map(s=>s.start));
    return aStart-bStart || a.localeCompare(b);
  });
  function titleMarkers(pub){
    const seen=new Set([pub.name]);
    return (pub.title_history||[])
      .filter(h=>h.start_year>=f.start && h.start_year<=f.end)
      .filter(h=>{
        if(seen.has(h.title)) return false;
        seen.add(h.title);
        return true;
      })
      .map(h=>({year:h.start_year,label:h.title}));
  }
  function relationMarkers(pub){
    return (pub.related_publications||[])
      .map(rel=>{
        const target=PUBLICATION_BY_ID.get(rel.publication_id)?.name || rel.publication_id || "another publication";
        if(rel.relationship==="merged_into"){
          return {year:pub.end||rel.year,label:`Merged into ${target}`};
        }
        if(rel.relationship==="absorbed"){
          return {year:rel.year,label:`Absorbed ${target}`};
        }
        return {year:rel.year,label:`${rel.relationship.replaceAll("_"," ")} ${target}`};
      })
      .filter(rel=>{
        const yr=y(rel.year);
        return yr && yr>=f.start && yr<=f.end;
      });
  }
  function labelRowCountForLane(items){
    const rows=[];
    function reserve(x,label){
      const text=truncateLabel(label,30);
      const width=approxTextWidth(text,10);
      const start=x, end=x+width+8;
      let row=rows.findIndex(r=>r.every(iv=>end < iv[0]-10 || start > iv[1]+10));
      if(row<0) row=rows.length;
      if(!rows[row]) rows[row]=[];
      rows[row].push([start,end]);
    }
    items.filter(s=>s.kind==="publication").forEach(s=>{
      reserve(s._x1+8,s.label);
      titleMarkers(s.mag).forEach(h=>reserve(x(h.year)+4,h.label));
      relationMarkers(s.mag).forEach(h=>reserve(x(h.year)+4,h.label));
    });
    return Math.max(1,rows.length);
  }
  const spanRowsByLane={};
  let spanCursor=margin.top;
  spanLanes.forEach(lane=>{
    const laneItems=spans.filter(s=>s.lane===lane).sort((a,b)=>a.kind.localeCompare(b.kind)||a.start-b.start || (b.end-b.start)-(a.end-a.start));
    const layout=layoutSpanRows(laneItems);
    const labelTopPad=6 + labelRowCountForLane(layout.items)*spanLabelRowH;
    spanRowsByLane[lane]={baseY:spanCursor+labelTopPad,items:layout.items};
    const laneBottom=(layout.maxRow+1)*spanRowGap;
    spanCursor += labelTopPad + laneBottom - spanRowGap + 8 + spanLaneGap;
  });
  const publicationGuideEnd=spanCursor-8;
  const yBase=spanCursor + labelRows*eventLaneH + 34;
  const height=yBase + labelRows*eventLaneH + margin.bottom;

  function packedLaneLabels(group){
    const rows=[];
    const labels=[];
    function reserveLabel(x,label,kind,baseY,lineY){
      const text=truncateLabel(label,kind==="editor"?22:30);
      const width=approxTextWidth(text,kind==="editor"?10:10);
      const start=x, end=x+width+8;
      let row=rows.findIndex(r=>r.every(iv=>end < iv[0]-10 || start > iv[1]+10));
      if(row<0) row=rows.length;
      if(!rows[row]) rows[row]=[];
      rows[row].push([start,end]);
      labels.push({x,y:baseY-12-(row*spanLabelRowH),lineY,text,kind});
    }
    group.items.forEach(s=>{
      if(s.kind==="publication"){
        const yy=group.baseY+s._row*spanRowGap;
        reserveLabel(s._x1+8,s.label,"publication",group.baseY,yy);
        titleMarkers(s.mag).forEach(h=>reserveLabel(x(h.year)+4,h.label,"publication-title",group.baseY,yy));
        relationMarkers(s.mag).forEach(h=>reserveLabel(x(h.year)+4,h.label,"publication-relation",group.baseY,yy));
      }else{
        const yy=group.baseY+s._row*spanRowGap;
        labels.push({x:s._x1+8,y:yy-5,lineY:yy,text:truncateLabel(s.editor?.person||s.label,24),kind:"editor"});
      }
    });
    return labels;
  }
  const tickStep=20;
  const tickYears=[];
  for(let yr=Math.ceil(f.start/tickStep)*tickStep; yr<=f.end; yr+=tickStep) tickYears.push(yr);

  function drawNative(){
    const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
    svg.setAttribute("width",width); svg.setAttribute("height",height);
    el.appendChild(svg);
    svg.insertAdjacentHTML("afterbegin",`<defs><linearGradient id="globalYearFade" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="var(--line)" stop-opacity=".38"/><stop offset="100%" stop-color="var(--line)" stop-opacity="0"/></linearGradient></defs>`);
    function add(tag, attrs={}, text=""){
      const node=document.createElementNS("http://www.w3.org/2000/svg",tag);
      Object.entries(attrs).forEach(([k,v])=>node.setAttribute(k,v));
      if(text) node.textContent=text;
      svg.appendChild(node);
      return node;
    }
    tickYears.forEach(yr=>{
      const xx=x(yr);
      add("text",{class:"axis",x:xx,y:axisY-12,"text-anchor":"middle"},String(yr));
    });
    add("line",{x1:margin.left,x2:width-margin.right,y1:axisY,y2:axisY,stroke:"var(--line)","stroke-width":1});
    add("line",{x1:margin.left,x2:width-margin.right,y1:yBase,y2:yBase,stroke:"var(--line)","stroke-width":2});
    spanLanes.forEach(lane=>{
      const group=spanRowsByLane[lane];
      add("text",{class:"global-lane-label",x:12,y:group.baseY+5},lane);
      group.items.forEach(s=>{
        const yy=group.baseY+s._row*spanRowGap;
        const cls=s.kind==="publication"?"global-band-mag":"global-band-editor";
        if(s.kind==="publication") add("line",{class:"publication-name-guide",x1:126,x2:Math.max(126,s._x1-8),y1:yy,y2:yy});
        const line=add("line",{class:cls,x1:s._x1,x2:s._x2,y1:yy,y2:yy});
        line.onmousemove=evt=>tip(evt,`<strong>${s.label}</strong><br>${s.type}<br>${s.start}${s.end?"–"+s.end:"–"}<br>${s.detail||""}`);
        line.onmouseleave=untip;
        if(s.kind==="publication"){
          titleMarkers(s.mag).forEach(h=>{
            const hx=x(h.year);
            add("line",{class:"publication-title-tick",x1:hx,x2:hx,y1:yy-8,y2:yy+8});
          });
          relationMarkers(s.mag).forEach(h=>{
            const hx=x(h.year);
            add("line",{class:"publication-relation-tick",x1:hx,x2:hx,y1:yy-9,y2:yy+9});
          });
        }
      });
      packedLaneLabels(group).forEach(label=>{
        const cls=label.kind==="editor"?"publication-editor-label":"publication-title-label";
        add("text",{class:cls,x:label.x,y:label.y},label.text);
      });
    });
    tickYears.forEach(yr=>{
      const xx=x(yr);
      add("line",{class:"global-year-guide",x1:xx,x2:xx,y1:axisY+8,y2:publicationGuideEnd});
    });
    labelled.forEach(d=>{
      if(d.kind==="birth"){
        const r=6; 
        const p=add("path",{class:"global-event-dot birth",d:`M ${d.xx} ${yBase-r} L ${d.xx-r} ${yBase+r} L ${d.xx+r} ${yBase+r} Z`});
        p.onmousemove=evt=>tip(evt,`<strong>${d.label}</strong><br>${d.year}<br>${d.type}<br>${d.detail||""}`); p.onmouseleave=untip;
      }else if(d.kind==="death"){
        const r=5.5;
        const rect=add("rect",{class:"global-event-dot death",x:d.xx-r,y:yBase-r,width:r*2,height:r*2,transform:`rotate(45 ${d.xx} ${yBase})`});
        rect.onmousemove=evt=>tip(evt,`<strong>${d.label}</strong><br>${d.year}<br>${d.type}<br>${d.detail||""}`); rect.onmouseleave=untip;
      }else{
        const c=add("circle",{class:"global-event-dot "+globalKindClass(d),cx:d.xx,cy:yBase,r:d.kind.startsWith("editor")?5:4.8});
        c.onmousemove=evt=>tip(evt,`<strong>${d.label}</strong><br>${d.year}<br>${d.type}<br>${d.detail||""}`); c.onmouseleave=untip;
      }
      if(d.show){
        const labelY=d.side==="top" ? yBase-18-(d.row*eventLaneH) : yBase+28+(d.row*eventLaneH);
        add("line",{class:"global-connector",x1:d.xx,x2:d.xx,y1:yBase+(d.side==="top"?-7:7),y2:labelY+(d.side==="top"?4:-10)});
        const tx=add("text",{class:"global-label",x:d.xx,y:labelY,"text-anchor":"middle"},d.label);
        tx.onmousemove=evt=>tip(evt,`<strong>${d.label}</strong><br>${d.year}<br>${d.type}<br>${d.detail||""}`); tx.onmouseleave=untip;
      }
    });
  }

  if(window.d3){
    const svg=d3.select(el).append("svg").attr("width",width).attr("height",height);
    const defs=svg.append("defs");
    const grad=defs.append("linearGradient").attr("id","globalYearFade").attr("x1","0").attr("x2","0").attr("y1","0").attr("y2","1");
    grad.append("stop").attr("offset","0%").attr("stop-color","var(--line)").attr("stop-opacity",".38");
    grad.append("stop").attr("offset","100%").attr("stop-color","var(--line)").attr("stop-opacity","0");
    const xScale=d3.scaleLinear().domain([f.start,f.end]).range([margin.left,width-margin.right]);
    const axis=d3.axisTop(xScale).tickValues(tickYears).tickFormat(d3.format("d"));
    svg.append("g").attr("class","global-axis").attr("transform",`translate(0,${axisY})`).call(axis);
    svg.append("line").attr("x1",margin.left).attr("x2",width-margin.right).attr("y1",yBase).attr("y2",yBase).attr("stroke","var(--line)").attr("stroke-width",2);
    spanLanes.forEach(lane=>{
      const group=spanRowsByLane[lane];
      svg.append("text").attr("class","global-lane-label").attr("x",12).attr("y",group.baseY+5).text(lane);
      group.items.forEach(s=>{
        const yy=group.baseY+s._row*spanRowGap;
        const cls=s.kind==="publication"?"global-band-mag":"global-band-editor";
        if(s.kind==="publication"){
          svg.append("line").attr("class","publication-name-guide").attr("x1",126).attr("x2",Math.max(126,s._x1-8)).attr("y1",yy).attr("y2",yy);
        }
        svg.append("line")
          .attr("class",cls)
          .attr("x1",s._x1).attr("x2",s._x2)
          .attr("y1",yy).attr("y2",yy)
          .on("mousemove",(event)=>tip(event,`<strong>${s.label}</strong><br>${s.type}<br>${s.start}${s.end?"–"+s.end:"–"}<br>${s.detail||""}`))
          .on("mouseleave",untip);
        if(s.kind==="publication"){
          titleMarkers(s.mag).forEach(h=>{
            const hx=x(h.year);
            svg.append("line").attr("class","publication-title-tick").attr("x1",hx).attr("x2",hx).attr("y1",yy-8).attr("y2",yy+8);
          });
          relationMarkers(s.mag).forEach(h=>{
            const hx=x(h.year);
            svg.append("line").attr("class","publication-relation-tick").attr("x1",hx).attr("x2",hx).attr("y1",yy-9).attr("y2",yy+9);
          });
        }
      });
      packedLaneLabels(group).forEach(label=>{
        svg.append("text")
          .attr("class",label.kind==="editor"?"publication-editor-label":"publication-title-label")
          .attr("x",label.x)
          .attr("y",label.y)
          .text(label.text);
      });
    });
    tickYears.forEach(yr=>{
      const xx=x(yr);
      svg.append("line").attr("class","global-year-guide").attr("x1",xx).attr("x2",xx).attr("y1",axisY+8).attr("y2",publicationGuideEnd);
    });
    const markers=svg.selectAll(".global-event-dot").data(labelled).enter();
    markers.append(d=>d.kind==="birth"?document.createElementNS("http://www.w3.org/2000/svg","path"):d.kind==="death"?document.createElementNS("http://www.w3.org/2000/svg","rect"):document.createElementNS("http://www.w3.org/2000/svg","circle"))
      .attr("class",d=>"global-event-dot "+globalKindClass(d))
      .each(function(d){
        const sel=d3.select(this);
        if(d.kind==="birth"){
          const r=6;
          sel.attr("d",`M ${d.xx} ${yBase-r} L ${d.xx-r} ${yBase+r} L ${d.xx+r} ${yBase+r} Z`);
        }else if(d.kind==="death"){
          const r=5.5;
          sel.attr("x",d.xx-r).attr("y",yBase-r).attr("width",r*2).attr("height",r*2).attr("transform",`rotate(45 ${d.xx} ${yBase})`);
        }else{
          sel.attr("cx",d.xx).attr("cy",yBase).attr("r",d.kind.startsWith("editor")?5:4.8);
        }
      })
      .on("mousemove",(event,d)=>tip(event,`<strong>${d.label}</strong><br>${d.year}<br>${d.type}<br>${d.detail||""}`))
      .on("mouseleave",untip);
    labelled.filter(d=>d.show).forEach(d=>{
      const labelY=d.side==="top" ? yBase-18-(d.row*eventLaneH) : yBase+28+(d.row*eventLaneH);
      svg.append("line").attr("class","global-connector").attr("x1",d.xx).attr("x2",d.xx).attr("y1",yBase+(d.side==="top"?-7:7)).attr("y2",labelY+(d.side==="top"?4:-10));
      svg.append("text")
        .attr("class","global-label")
        .attr("x",d.xx)
        .attr("y",labelY)
        .attr("text-anchor","middle")
        .text(d.label)
        .on("mousemove",(event)=>tip(event,`<strong>${d.label}</strong><br>${d.year}<br>${d.type}<br>${d.detail||""}`))
        .on("mouseleave",untip);
    });
  }else{
    drawNative();
  }

  stream.innerHTML=`<h3>TimeStream</h3><div class="event-stream-list">${sorted.map(d=>`<div class="event-stream-item event-kind-${d.kind}"><div class="event-stream-year">${d.year}</div><div><div class="event-stream-label"><span class="event-symbol">${eventSymbol(d.kind)}</span>${d.label}</div><div class="event-stream-meta">${d.type}${d.detail?` · ${d.detail}`:""}</div></div></div>`).join("")}</div>`;
}
function renderWorksTable(){const tb=$("#worksTable tbody");tb.innerHTML="";filteredWorks(false).sort((a,b)=>authorName(a.author_id).localeCompare(authorName(b.author_id))||(a.year||9999)-(b.year||9999)).forEach(w=>{const a=A.get(w.author_id)||{};const links=[link("Author Wiki",a.wiki),link("Author GR",a.goodreads),link("Work Wiki",w.wiki),link("Work GR",w.goodreads)].filter(Boolean).join(" · ");tb.insertAdjacentHTML("beforeend",`<tr><td>${authorName(w.author_id)}</td><td><strong>${w.title}</strong>${w.first_publication_context?`<br><small>First publication: ${w.first_publication_context}</small>`:""}</td><td>${w.type_path}</td><td>${w.year||""}</td><td>${w.coauthors||"—"}</td><td>${w.series||"Standalone"}</td><td>${sourceLabel(w.list_source)}</td><td>${links||"—"}</td></tr>`)});}
function titleHistoryLabel(pub){
  const history=pub.title_history||[];
  if(!history.length) return "";
  return history.map(h=>`${h.title} (${h.start_year}${h.end_year?"–"+h.end_year:"–"})`).join("; ");
}
function renderMagTable(){const tb=$("#magTable tbody");tb.innerHTML="";const f=filters();[...PUBLICATIONS].filter(m=>(m.start||0)<=f.end&&(m.end||f.end)>=f.start).sort((a,b)=>a.start-b.start).forEach(m=>{const es=data.editors.filter(e=>e.publication_id===m.id||publicationMatches(e.publication,m.name));const history=titleHistoryLabel(m);tb.insertAdjacentHTML("beforeend",`<tr><td><strong>${m.name}</strong>${history?`<br><small>${history}</small>`:""}</td><td>${m.publication_type||m.type}</td><td>${m.start}${m.end?"–"+m.end:"–"}</td><td>${es.map(e=>e.person).join("; ")||"—"}</td><td>${es.map(e=>e.role).join("; ")||"—"}</td><td>${es.map(e=>e.start+(e.end?"–"+e.end:"–")).join("; ")||"—"}</td><td>${link("Wiki",m.wiki)||"—"}</td></tr>`)});}

function seriesLabel(w){
  const broadLanes=new Set(["works","standalone novels","short fiction","other fiction","other novels","edited anthologies","nonfiction","adaptations","media"]);
  if(w.type_path && w.type_path.startsWith("Nonfiction")) return "Nonfiction";
  if(w.coauthors) return "Collaborations";
  if(w.type_path && (w.type_path.startsWith("Collection") || w.type_path.startsWith("Poetry"))) return "Collections";
  if(w.author_id==="isaac_asimov" && w.series==="Foundation universe"){
    const lane=(w.lane||"").toLowerCase();
    if(lane.includes("robot") || lane.includes("spacer")) return "Robot / Spacer series";
    if(lane.includes("empire")) return "Empire series";
    if(lane.includes("merged")) return "Merged Foundation universe";
    if(lane.includes("foundation")) return "Foundation series";
  }
  if(w.lane && !broadLanes.has(w.lane.toLowerCase())) return w.lane;
  if(w.series && !broadLanes.has(w.series.toLowerCase())) return w.series;
  return "Standalone / other works";
}
function laneRank(label){
  const lower=label.toLowerCase();
  if(lower==="standalone / other works") return 10;
  if(lower==="collections") return 20;
  if(lower==="collaborations") return 90;
  if(lower==="nonfiction") return 100;
  if(lower.includes("robot") || lower.includes("spacer")) return 30;
  if(lower.includes("empire")) return 31;
  if(lower.includes("foundation")) return 32;
  if(lower.includes("space odyssey")) return 33;
  if(lower.includes("rama")) return 34;
  if(lower.includes("tarzan")) return 35;
  if(lower.includes("barsoom")) return 36;
  if(lower.includes("pellucidar")) return 37;
  return 50;
}
function sortedLaneLabels(ws){return [...new Set(ws.map(seriesLabel))].sort((a,b)=>laneRank(a)-laneRank(b)||a.localeCompare(b))}

function computeAuthorDetailLabels(ws, lanes, xFunc, bounds){
  const placed=[], occupied=[];
  const offsets=[-18,18,-30,30,-8,8];
  const labelPad=10;
  function collides(box){
    return occupied.some(o=>!(box.x2 < o.x1-8 || box.x1 > o.x2+8 || box.y2 < o.y1-4 || box.y1 > o.y2+4));
  }
  function addBox(box){occupied.push(box)}
  const candidates=ws
    .filter(w=>w.year)
    .map(w=>({work:w,lane:seriesLabel(w),rank:Number(w.timeline_level||3),year:y(w.year)}))
    .filter(d=>lanes.includes(d.lane))
    .sort((a,b)=>a.rank-b.rank||a.year-b.year||a.work.title.localeCompare(b.work.title));
  candidates.forEach(d=>{
    const laneIndex=lanes.indexOf(d.lane);
    const baseY=bounds.top+laneIndex*bounds.rowH;
    const xx=xFunc(d.year);
    const label=truncateLabel(d.work.title,34);
    const width=approxTextWidth(label,10.5);
    const sideOrder=xx < (bounds.minX+bounds.maxX)/2 ? ["R","L"] : ["L","R"];
    let chosen=null;
    for(const offset of offsets){
      for(const side of sideOrder){
        const labelX=side==="R" ? xx+labelPad : xx-labelPad;
        const x1=side==="R" ? labelX : labelX-width;
        const x2=side==="R" ? labelX+width : labelX;
        const y=baseY+4+offset;
        const box={x1,x2,y1:y-11,y2:y+3};
        if(x1<bounds.minX || x2>bounds.maxX || y<baseY-bounds.rowH/2+15 || y>baseY+bounds.rowH/2-4) continue;
        if(!collides(box)){
          chosen={item:d.work,label,x:xx,labelX,offset,side,lane:d.lane,baseY};
          addBox(box);
          break;
        }
      }
      if(chosen) break;
    }
    if(chosen) placed.push(chosen);
  });
  return placed;
}

function renderAuthorDetail(targetSelector="#authorDetail"){
  const el=$(targetSelector);
  if(!selectedAuthor){el.className="card detail empty";el.textContent=targetSelector==="#inlineAuthorDetail"?"":"Click an author to view their bibliography timeline.";return}
  const a=A.get(selectedAuthor);
  const ws=data.works.filter(w=>w.author_id===selectedAuthor).sort((p,q)=>(p.year||9999)-(q.year||9999));
  const workLanes=sortedLaneLabels(ws);
  const lanes=["Timeline",...workLanes];
  const years=ws.map(w=>w.year).filter(Boolean);
  const minYear=years.length?Math.min(...years):(a.birth||1800);
  const maxYear=years.length?Math.max(...years):(a.death||2020);
  const start=Math.min(a.birth||minYear,minYear)-5;
  const end=Math.max(a.death||maxYear,maxYear)+5;
  el.className="card detail";
  const miniId = targetSelector==="#inlineAuthorDetail" ? "authorMiniInline" : "authorMiniBottom";
  el.innerHTML=`<div class="detail-head"><div><h3>${a.name}</h3><div>${a.birth||"Dates unknown"}${a.birth?"–"+(a.death||""):""}</div><div>${link("Wikipedia",a.wiki)} ${a.goodreads?" · "+link("Goodreads",a.goodreads):""}</div></div><div><small>Series / sections</small><br>${workLanes.map(l=>`<span class="pill">${l}</span>`).join("")}</div></div><div class="mini" id="${miniId}"></div><div class="tablewrap"><table><thead><tr><th>Title</th><th>Type</th><th>Year</th><th>Collaborator</th><th>Series / section</th><th>List source</th><th>Links</th></tr></thead><tbody>${ws.map(w=>`<tr><td><strong>${w.title}</strong></td><td>${w.type_path}</td><td>${w.year||""}</td><td>${w.coauthors||"—"}</td><td>${seriesLabel(w)}</td><td>${sourceLabel(w.list_source)}</td><td>${[link("Wiki",w.wiki),link("GR",w.goodreads)].filter(Boolean).join(" · ")||"—"}</td></tr>`).join("")}</tbody></table></div>`;
  renderAuthorMini(a,ws,lanes,start,end,miniId)
}

function renderAuthorMini(a,ws,lanes,start,end,miniId="authorMiniInline"){
  const el=$("#"+miniId);
  const left=210,right=50,top=60,rowH=60,w=Math.max(1260,el.clientWidth-40),plot=w-left-right,x=yr=>left+((yr-start)/(end-start))*plot;
  const h=top+lanes.length*rowH+34;
  const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.setAttribute("width",w); svg.setAttribute("height",h);
  for(let yr=Math.ceil(start/10)*10;yr<=end;yr+=10){
    const xx=x(yr);
    svg.insertAdjacentHTML("beforeend",`<line class="grid" x1="${xx}" x2="${xx}" y1="20" y2="${h-20}"/><text class="axis" x="${xx}" y="16" text-anchor="middle">${yr}</text>`);
  }
  const labelPlacements=computeAuthorDetailLabels(ws,lanes,x,{minX:left+6,maxX:w-right-6,top,rowH});

  lanes.forEach((lane,idx)=>{
    const baseY=top+idx*rowH;
    const rowShade=document.createElementNS("http://www.w3.org/2000/svg","rect");
    rowShade.setAttribute('class','lane-band'+(idx%2? ' alt':''));
    rowShade.setAttribute('x',0); rowShade.setAttribute('y',baseY-rowH/2+8); rowShade.setAttribute('width',w); rowShade.setAttribute('height',rowH-10);
    svg.appendChild(rowShade);

    const laneText=document.createElementNS("http://www.w3.org/2000/svg","text");
    laneText.setAttribute('class','author-label'); laneText.setAttribute('x',8); laneText.setAttribute('y',baseY+5); laneText.textContent=lane;
    svg.appendChild(laneText);

    if(lane==="Timeline"){
      if(a.birth){
        const life=document.createElementNS("http://www.w3.org/2000/svg","line");
        life.setAttribute("class","life detail-life");
        life.setAttribute("x1",x(a.birth));
        life.setAttribute("x2",x(a.death||end));
        life.setAttribute("y1",baseY);
        life.setAttribute("y2",baseY);
        life.onmousemove=e=>tip(e,`<strong>${a.name}</strong><br>${a.birth}${a.death?"–"+a.death:"–"}`);
        life.onmouseleave=untip;
        svg.appendChild(life);
      }
      return;
    }

    const items=ws.filter(w=>seriesLabel(w)===lane && w.year);
    const placed=labelPlacements.filter(p=>p.lane===lane);
    items.forEach(w=>{
      const timelineY=top;
      const connector=document.createElementNS("http://www.w3.org/2000/svg","line");
      connector.setAttribute("class","detail-timeline-connector");
      connector.setAttribute("x1",x(w.year)); connector.setAttribute("x2",x(w.year));
      connector.setAttribute("y1",timelineY+5); connector.setAttribute("y2",baseY-7);
      svg.appendChild(connector);
    });
    placed.forEach(p=>{
      const labelY=baseY+4+p.offset;
      const anchorX = p.side==='R' ? p.labelX-4 : p.labelX+4;
      const baselineY=labelY+3;
      const leader=document.createElementNS("http://www.w3.org/2000/svg","polyline");
      const tailX=p.side==='R' ? anchorX+34 : anchorX-34;
      leader.setAttribute('points',`${p.x},${baseY} ${anchorX},${baselineY} ${tailX},${baselineY}`);
      leader.setAttribute('class','label-leader');
      svg.appendChild(leader);
    });
    items.forEach(w=>{
      const timelineY=top;
      const marker=document.createElementNS("http://www.w3.org/2000/svg","circle");
      marker.setAttribute("class","detail-timeline-dot "+typClass(w.type_path));
      marker.setAttribute("cx",x(w.year));
      marker.setAttribute("cy",timelineY);
      marker.setAttribute("r",3.4);
      marker.onmousemove=e=>tip(e,`<strong>${w.title}</strong><br>${w.year}<br>${w.type_path}`); marker.onmouseleave=untip;
      svg.appendChild(marker);
      const c=document.createElementNS("http://www.w3.org/2000/svg","circle");
      c.setAttribute('class','dot '+typClass(w.type_path)); c.setAttribute('cx',x(w.year)); c.setAttribute('cy',baseY); c.setAttribute('r',6);
      c.onmousemove=e=>tip(e,`<strong>${w.title}</strong><br>${w.year}<br>${w.type_path}`); c.onmouseleave=untip;
      svg.appendChild(c);
    });
    placed.forEach(p=>{
      const labelY=baseY+4+p.offset;
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
