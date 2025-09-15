/* =========================
   TIMER (Task-2 pacing)
========================= */
let running=false, startedAt=null, timerMs=10*60*1000, tickH=null;
const clockEl=document.getElementById("clock");
const startPauseBtn=document.getElementById("startPauseBtn");
const resetBtn=document.getElementById("resetBtn");
const presetBtns=document.querySelectorAll(".preset");
const pad=n=>n<10?`0${n}`:`${n}`;
const msToClock=ms=>{const s=Math.max(0,Math.floor(ms/1000));const m=Math.floor(s/60), r=s%60;return `${pad(m)}:${pad(r)}`};
function tick(){timerMs-=1000;if(timerMs<=0){timerMs=0;stopTimer()}clockEl.textContent=msToClock(timerMs)}
function startTimer(){if(running)return;running=true;if(!startedAt)startedAt=Date.now();tickH=setInterval(tick,1000);startPauseBtn.textContent="⏸"}
function stopTimer(){running=false;clearInterval(tickH);startPauseBtn.textContent="▶"}
function resetTimer(ms=10*60*1000){stopTimer();timerMs=ms;clockEl.textContent=msToClock(timerMs);startedAt=null}
startPauseBtn.addEventListener("click",()=>running?stopTimer():startTimer());
resetBtn.addEventListener("click",()=>resetTimer());
presetBtns.forEach(b=>b.addEventListener("click",()=>resetTimer(Number(b.dataset.min)*60*1000)));
clockEl.textContent=msToClock(timerMs);

/* =========================
   DATA — WORD BANK (Task 2)
========================= */
const WB={
  opinion:{rows:[
    {en:"In my opinion",id:"menurut saya",pos:"Opening: state your side",ex:"In my opinion, employees should prepare for future roles."},
    {en:"From my perspective",id:"dari sudut pandang saya",pos:"Opening (formal)",ex:"From my perspective, focusing on current responsibilities is more effective."},
    {en:"I strongly believe",id:"saya sangat percaya",pos:"Opening (emphasis)",ex:"I strongly believe that adaptability drives long-term success."},
    {en:"I contend that",id:"saya berpendapat bahwa",pos:"Opening (advanced)",ex:"I contend that future-oriented training is more advantageous."},
  ]},
  reason:{rows:[
    {en:"The main reason is that",id:"alasan utama adalah",pos:"Reason (Body)",ex:"The main reason is that industries evolve quickly."},
    {en:"My personal belief is that",id:"keyakinan pribadi saya adalah",pos:"Reason (formal)",ex:"My personal belief is that continuous learning ensures growth."},
    {en:"This is because",id:"hal ini karena",pos:"Reason (simple)",ex:"This is because new tools appear every year."},
    {en:"A key advantage is",id:"keuntungan utama adalah",pos:"Reason (advanced)",ex:"A key advantage is improved mobility across positions."},
  ]},
  example:{rows:[
    {en:"For example",id:"misalnya",pos:"Example",ex:"For example, IT staff who study cybersecurity access better roles."},
    {en:"A clear illustration is",id:"ilustrasi yang jelas adalah",pos:"Example (academic)",ex:"A clear illustration is a nurse who learns electronic charting and becomes a team lead."},
    {en:"For instance",id:"sebagai contoh",pos:"Example (variation)",ex:"For instance, accountants who master analytics move into management."},
    {en:"One case that stands out is",id:"salah satu kasus yang menonjol adalah",pos:"Example (advanced)",ex:"One case that stands out is a clerk who studies Python and automates reports."},
  ]},
  counterpoint:{rows:[
    {en:"While [name] raised a valid point",id:"walaupun [nama] menyampaikan poin yang benar",pos:"Counterpoint (acknowledge)",ex:"While Claire raised a valid point about quick promotions, long-term skills matter more."},
    {en:"Admittedly … however …",id:"memang benar … namun …",pos:"Counterpoint (academic)",ex:"Admittedly, current skills bring recognition; however, roles can become obsolete."},
    {en:"Although … I think …",id:"walaupun … saya pikir …",pos:"Counterpoint (simple)",ex:"Although Paul mentions future opportunities, I think proof of current results is essential."},
    {en:"Granted … yet …",id:"diakui … namun …",pos:"Counterpoint (advanced)",ex:"Granted, short-term results impress managers, yet adaptability sustains careers."},
  ]},
  conclusion:{rows:[
    {en:"Therefore",id:"oleh karena itu",pos:"Conclusion",ex:"Therefore, preparing for future roles is the smarter choice."},
    {en:"In conclusion",id:"kesimpulannya",pos:"Conclusion (final sentence)",ex:"In conclusion, mastering present tasks builds a foundation for growth."},
    {en:"Overall",id:"secara keseluruhan",pos:"Conclusion (variation)",ex:"Overall, both approaches matter, but long-term preparation outweighs short-term rewards."},
    {en:"Taken together",id:"jika digabungkan",pos:"Conclusion (advanced)",ex:"Taken together, these points show that adaptability offers stability."},
  ]},
  connectors:{rows:[
    {en:"first",id:"pertama",pos:"Order",ex:"First, managers value reliable performance."},
    {en:"second",id:"kedua",pos:"Order",ex:"Second, transferable skills widen opportunities."},
    {en:"however",id:"namun",pos:"Contrast",ex:"However, recognition can be temporary."},
    {en:"moreover",id:"selain itu",pos:"Add",ex:"Moreover, cross-training increases mobility."},
    {en:"as a result",id:"hasilnya",pos:"Mini-conclusion",ex:"As a result, employees remain competitive."},
    {en:"consequently",id:"konsekuensinya",pos:"Mini-conclusion",ex:"Consequently, long-term outcomes improve."},
  ]},
};
const WB_ORDER=["opinion","reason","example","counterpoint","conclusion","connectors"];

/* =========================
   UNIVERSAL TEMPLATES (Task-2)
========================= */
const TEMPLATES={
  opinion:{
    simple:   "In my opinion, it is better to focus on [side].",
    easy:     "I strongly believe that [side] is more important.",
    academic: "From my perspective, employees benefit more from [side].",
    advanced: "Ultimately, I contend that [side] plays a more crucial role in employees’ success."
  },
  reason:{
    simple:   "The main reason is that [reason].",
    easy:     "This is because [reason].",
    academic: "The primary justification is that [reason].",
    advanced: "The foremost reason is that [expanded reason]."
  },
  example:{
    simple:   "For example, [brief example].",
    easy:     "For instance, [brief example].",
    academic: "A clear illustration of this is [detailed example].",
    advanced: "Consider this: [extended example (cause → effect)]."
  },
  counterpoint:{
    simple:   "While [classmate] thinks differently, I believe [counter].",
    easy:     "Although [classmate] mentioned [opposite idea], I think [counter].",
    academic: "Admittedly, [classmate] raised a valid point; however, this overlooks [counter-idea].",
    advanced: "While [classmate] rightly highlights [opposite idea], that view neglects [your stronger point]."
  },
  conclusion:{
    simple:   "Therefore, [restate opinion].",
    easy:     "In conclusion, [side] provides better [benefit].",
    academic: "In summary, prioritizing [side] proves more advantageous.",
    advanced: "Overall, [side] safeguards employability in a rapidly changing economy; thus, it outweighs the alternative."
  }
};

// Section traversal order for “All”
const ALL_ORDER=["opinion","reason","example","counterpoint","conclusion"];

/* =========================
   WORD BANK TRAINER
========================= */
const wbSet=document.getElementById("wbSet");
const wbField=document.getElementById("wbField");
const wbCase=document.getElementById("wbCase");
const wbAuto=document.getElementById("wbAuto");
const wbShuffle=document.getElementById("wbShuffle");
const wbReset=document.getElementById("wbReset");

const wbTarget=document.getElementById("wbTarget");
const wbInput=document.getElementById("wbInput");
const wbArti=document.getElementById("wbArti");
const wbPos=document.getElementById("wbPos");
const wbExample=document.getElementById("wbExample");

const wbIndex=document.getElementById("wbIndex");
const wbCorrect=document.getElementById("wbCorrect");
const wbMistakes=document.getElementById("wbMistakes");
const wbStreak=document.getElementById("wbStreak");

let order=[], idx=0, correct=0, mistakes=0, streak=0;
const _cycleOrder=["en","pos","ex"];
let _cycleIdx=0;

const rowsForSet = () => {
  if(wbSet.value==="all"){
    return WB_ORDER.flatMap(k=>WB[k].rows);
  }
  return WB[wbSet.value].rows;
};
const shuffleArr=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const normalize=(s)=>{const t=s.replace(/\s+/g," ").trim(); return wbCase.checked?t.toLowerCase():t;};
const getField=()=> wbField.value==="cycle" ? _cycleOrder[_cycleIdx] : wbField.value;
const pickTarget=(row)=>{
  const f=getField();
  if(f==="pos") return row.pos;
  if(f==="ex")  return row.ex;
  return row.en;
};

function loadWB(resetOrder=true){
  const rows=rowsForSet();
  if(resetOrder){ order=rows.map((_,i)=>i); }
  const i=order[idx] ?? 0;
  const r=rows[i];

  wbTarget.textContent=pickTarget(r);
  wbArti.textContent=r.id ?? "—";
  wbPos.textContent=r.pos ?? "—";
  wbExample.textContent=r.ex ?? "—";

  wbInput.value="";
  wbIndex.textContent=`${idx+1}/${rows.length}`;
}
function wbCheck(){
  const rows=rowsForSet();
  const r=rows[order[idx]];
  const A=normalize(wbInput.value);
  const B=normalize(pickTarget(r));

  if(A===B){
    wbInput.classList.remove("badInput");
    wbInput.classList.add("goodInput");
    correct++; streak++;
    wbCorrect.textContent=correct;
    wbStreak.textContent=streak;

    if(wbAuto.checked){
      if(wbField.value==="cycle" && _cycleIdx < _cycleOrder.length-1){
        _cycleIdx++; wbInput.value=""; wbInput.classList.remove("goodInput"); loadWB(false); return;
      }
      _cycleIdx=0;
      const rows2=rowsForSet();
      if(idx < rows2.length-1){ idx++; loadWB(false); }
      wbInput.value=""; wbInput.classList.remove("goodInput");
    }
  }else{
    wbInput.classList.remove("goodInput");
    wbInput.classList.add("badInput");
  }
}
wbInput.addEventListener("keydown",(e)=>{
  if(e.key==="Enter"){
    if(wbInput.value.trim()==="") return;
    const rows=rowsForSet();
    const r=rows[order[idx]];
    const A=normalize(wbInput.value);
    const B=normalize(pickTarget(r));
    if(A!==B){ mistakes++; streak=0; wbMistakes.textContent=mistakes; wbStreak.textContent=streak; }
    wbCheck();
  }
});
wbShuffle.addEventListener("click",()=>{
  const rows=rowsForSet();
  order=shuffleArr(rows.map((_,i)=>i));
  idx=0; correct=0; mistakes=0; streak=0; _cycleIdx=0;
  wbCorrect.textContent=0; wbMistakes.textContent=0; wbStreak.textContent=0;
  loadWB(false);
});
wbReset.addEventListener("click",()=>{
  idx=0; correct=0; mistakes=0; streak=0; _cycleIdx=0;
  wbCorrect.textContent=0; wbMistakes.textContent=0; wbStreak.textContent=0;
  loadWB(true);
});
wbSet.addEventListener("change",()=>{
  idx=0; correct=0; mistakes=0; streak=0; _cycleIdx=0;
  wbCorrect.textContent=0; wbMistakes.textContent=0; wbStreak.textContent=0;
  loadWB(true);
});
wbField.addEventListener("change",()=>{ _cycleIdx=0; loadWB(false); });

/* =========================
   KARAOKE DRILL (Task-2)
========================= */
const secSelect=document.getElementById("secSelect");
const styleSelect=document.getElementById("styleSelect");
const showPunct=document.getElementById("showPunct");
const autoNextSec=document.getElementById("autoNextSec");
const resetDrill=document.getElementById("resetDrill");
const secTemplate=document.getElementById("secTemplate");
const secTyped=document.getElementById("secTyped");
const secProg=document.getElementById("secProg");
const secErr=document.getElementById("secErr");
const secAcc=document.getElementById("secAcc");
const secWpm=document.getElementById("secWpm");
const secBar=document.getElementById("secBar");

let tStart=null, allIdx=0;
const tokenSplit=(s,withP)=> s.split(withP?/(\s+|[.,;:!?—-])/:/(\s+)/).filter(x=>x.length>0);
const sectionKey=()=> secSelect.value!=="all" ? secSelect.value : ALL_ORDER[allIdx] || "conclusion";
const templateFor=(section,style)=> TEMPLATES[section][style];
const fullResponse=(style)=> ALL_ORDER.map(k=>templateFor(k,style)).join("\n\n");
const templateText=()=> secSelect.value==="all" ? fullResponse(styleSelect.value) : templateFor(sectionKey(), styleSelect.value);

function renderTemplate(){
  const txt=templateText();
  const toks=tokenSplit(txt, showPunct.checked);
  secTemplate.innerHTML=toks.map(t=>{
    if(/\s+/.test(t)) return `<span class="tk space">${t}</span>`;
    if(showPunct.checked && /^[.,;:!?—-]$/.test(t)) return `<span class="tk punct">${t}</span>`;
    return `<span class="tk good">${t}</span>`;
  }).join("");
}
function updateKaraoke(){
  const txt=templateText();
  const tgt=tokenSplit(txt, showPunct.checked);
  const mine=tokenSplit(secTyped.value, showPunct.checked);

  let wrong=0, match=0;
  const out=tgt.map((tok,i)=>{
    const my=mine[i] ?? "";
    const isSpace=/^\s+$/.test(tok);
    const isPunct=/^[.,;:!?—-]$/.test(tok);
    if(isSpace) return `<span class="tk space">${tok}</span>`;
    const ok=(my||"")===tok;
    if(ok){ match++; return `<span class="tk good">${tok}</span>`; }
    if(isPunct && !showPunct.checked){ return `<span class="tk punct">${tok}</span>`; }
    wrong++; return `<span class="tk bad">${my||tok}</span>`;
  }).join("");
  secTemplate.innerHTML=out;

  const total=tgt.filter(t=>!/^\s+$/.test(t)).length;
  const prog = total? Math.min(100, Math.round((match/total)*100)) : 0;
  const acc  = (match+wrong)? Math.round((match/(match+wrong))*100) : 0;

  secProg.textContent=prog+"%";
  secAcc.textContent=acc+"%";
  secErr.textContent=wrong;
  secBar.style.width=prog+"%";

  if(!tStart) tStart=Date.now();
  const mins=(Date.now()-tStart)/60000;
  const words=secTyped.value.trim().split(/\s+/).filter(Boolean).length;
  secWpm.textContent= mins>0 ? Math.round(words/mins) : 0;

  if(autoNextSec.checked && prog===100 && wrong===0 && secSelect.value==="all"){
    if(allIdx < ALL_ORDER.length-1){ allIdx++; resetKaraoke(false); }
  }
}
function resetKaraoke(hard=true){
  if(hard){ if(secSelect.value==="all") allIdx=0; }
  secTyped.value=""; tStart=null;
  renderTemplate(); updateKaraoke();
}
secSelect.addEventListener("change", ()=> resetKaraoke(true));
styleSelect.addEventListener("change", ()=> { renderTemplate(); updateKaraoke(); });
showPunct.addEventListener("change", ()=>{ renderTemplate(); updateKaraoke(); });
resetDrill.addEventListener("click", ()=> resetKaraoke(true));
secTyped.addEventListener("input", updateKaraoke);

/* =========================
   FULL RESPONSE BUILDER
========================= */
const sideSelect=document.getElementById("sideSelect");
const builderStyle=document.getElementById("builderStyle");
const buildBtn=document.getElementById("buildBtn");
const copyBuild=document.getElementById("copyBuild");
const useInKaraoke=document.getElementById("useInKaraoke");
const buildOut=document.getElementById("buildOut");

function buildLines(side, style){
  const sidePhrase = side==="paul" ? "future-oriented skills" : "current-job skills";
  const reason = side==="paul"
    ? "industries change rapidly, so adaptability keeps workers competitive"
    : "managers reward immediate results, which accelerates promotions";
  const example = side==="paul"
    ? "an IT specialist who learns cybersecurity can switch teams when demand rises"
    : "a new accountant who automates monthly reports is noticed and promoted quickly";
  const counter = side==="paul"
    ? "recognition is fleeting if a role becomes outdated"
    : "without strong performance today, future opportunities remain out of reach";
  const benefit = side==="paul" ? "stability" : "recognition";

  const L1=TEMPLATES.opinion[style].replace("[side]", sidePhrase);
  const L2=TEMPLATES.reason[style]
           .replace("[reason]", reason)
           .replace("[expanded reason]", reason);
  const L3=TEMPLATES.example[style]
           .replace("[brief example]", example)
           .replace("[detailed example]", example)
           .replace("[extended example (cause → effect)]", example);
  const L4=TEMPLATES.counterpoint[style]
           .replace("[classmate]", side==="paul"?"Claire":"Paul")
           .replace("[opposite idea]","the alternative approach")
           .replace("[counter]", counter)
           .replace("[counter-idea]", counter)
           .replace("[your stronger point]", counter);
  const L5=TEMPLATES.conclusion[style]
           .replace("[restate opinion]", side==="paul"?"we should prioritize future skills":"we should focus on current responsibilities")
           .replace("[side]", sidePhrase)
           .replace("[benefit]", benefit);

  return [L1,L2,L3,L4,L5];
}

buildBtn.addEventListener("click", ()=>{
  const lines=buildLines(sideSelect.value, builderStyle.value);
  buildOut.value=lines.join(" ");
});
copyBuild.addEventListener("click", ()=> {
  navigator.clipboard.writeText(buildOut.value||"");
});
useInKaraoke.addEventListener("click", ()=>{
  // Feed the built text into karaoke as a “custom template” by temporarily replacing template text.
  const text = buildOut.value.trim();
  if(!text){ alert("Build a response first."); return; }
  // Overwrite only the OPINION template temporarily to inject as one block
  TEMPLATES.opinion.simple = text; // stash
  secSelect.value = "opinion";
  styleSelect.value = "simple";
  renderTemplate(); updateKaraoke();
  window.scrollTo({top:0,behavior:"smooth"});
});

/* =========================
   INIT
========================= */
function init(){
  // WB
  order=rowsForSet().map((_,i)=>i);
  idx=0; correct=0; mistakes=0; streak=0; _cycleIdx=0;
  wbCorrect.textContent=0; wbMistakes.textContent=0; wbStreak.textContent=0;
  loadWB(true);

  // Karaoke
  renderTemplate();
  updateKaraoke();

  // QoL hotkeys
  document.addEventListener("keydown",(e)=>{
    if(e.target===wbInput || e.target===secTyped || e.target===buildOut) return;
    if(e.code==="Space"){ e.preventDefault(); running?stopTimer():startTimer(); }
    if(e.key==="r"||e.key==="R"){ resetTimer(); }
  });
}
document.addEventListener("DOMContentLoaded", init);
