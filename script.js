const foundations = [
  { number: "01", name: "lithra", symbol: "◈", description: "land and everything naturally found on or beneath it" },
  { number: "02", name: "aethra", symbol: "≋", description: "exploring air weather motion and the atmosphere above us" },
  { number: "03", name: "hydria", symbol: "◉", description: "exploring water its behavior and its role in the natural world" }
];
const cards = document.getElementById("foundation-cards");
for (const item of foundations) {
  const article = document.createElement("article");
  article.className = "foundation-card";
  const number = document.createElement("span"); number.className = "card-number"; number.textContent = item.number + " / foundation";
  const symbol = document.createElement("div"); symbol.className = "symbol"; symbol.setAttribute("aria-hidden", "true"); symbol.textContent = item.symbol;
  const heading = document.createElement("h3"); heading.textContent = item.name;
  const description = document.createElement("p"); description.textContent = item.description;
  article.append(number, symbol, heading, description);
  cards.append(article);
}
document.getElementById("year").textContent = new Date().getFullYear();
// Chapters are registered once here; progress is read separately for each one.
const chapters = [
  {id:"000",name:"introduction",url:"chapter-1.html",key:"novera.chapter1",parts:5},
  {id:"001",name:"lithra",url:"chapter-001.html",key:"novera.chapter001",parts:14}
];
// Future chapters are added to this catalog when their lessons are published.
function getChapterProgress(chapter) {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(chapter.key) || "{}") || {}; } catch (_) {}
  const completed = saved.completed === true;
  const rawStep = Number(saved.step);
  const step = Number.isFinite(rawStep) ? Math.max(0,Math.min(chapter.parts-1,Math.floor(rawStep))) : 0;
  // A saved first step without completion can also mean the chapter was opened.
  const started = completed || step > 0 || (saved.answers && Object.keys(saved.answers).length > 0);
  return {completed,started,percent:completed?100:Math.round(step/chapter.parts*100)};
}
function renderJourney(){
  const progress = chapters.map(chapter=>({...chapter,...getChapterProgress(chapter)}));
  const completedCount=progress.filter(ch=>ch.completed).length;
  const overall=Math.round(progress.reduce((sum,ch)=>sum+ch.percent,0)/progress.length);
  const next=progress.find(ch=>!ch.completed);
  const status=document.getElementById("learning-status");
  status.textContent=completedCount===progress.length?"all published chapters completed":completedCount+" of "+progress.length+" chapters completed";
  document.getElementById("learning-percent").textContent=overall+"%";
  document.getElementById("learning-fill").style.width=overall+"%";
  document.getElementById("learning-track").setAttribute("aria-valuenow",String(overall));
  document.getElementById("journey-count").textContent="overall progress across "+progress.length+" available chapters";
  const list=document.getElementById("chapter-progress-list");
  list.replaceChildren();
  for(const ch of progress){
    const card=document.createElement("article");card.className="chapter-progress-card";
    const head=document.createElement("div");head.className="chapter-progress-head";
    const title=document.createElement("strong");title.textContent="chapter "+ch.id+" / "+ch.name;
    const statusText=document.createElement("span");statusText.textContent=ch.completed?"completed":ch.started?"in progress":"not started";
    head.append(title,statusText);
    const track=document.createElement("div");track.className="chapter-mini-track";
    track.setAttribute("role","progressbar");track.setAttribute("aria-label","chapter "+ch.id+" completion");
    track.setAttribute("aria-valuemin","0");track.setAttribute("aria-valuemax","100");track.setAttribute("aria-valuenow",String(ch.percent));
    const fill=document.createElement("div");fill.style.width=ch.percent+"%";track.append(fill);
    const link=document.createElement("a");link.href=ch.url;link.textContent=ch.completed?"review chapter ↗":ch.started?"continue chapter ↗":"start chapter ↗";
    card.append(head,track,link);list.append(card);
  }
  const title=document.getElementById("next-chapter-title"),detail=document.getElementById("next-chapter-detail"),link=document.getElementById("learning-link"),hero=document.getElementById("hero-next-link"),discovery=document.getElementById("discovery-link");
  if(next){
    const verb=next.started?"continue":"start";
    title.textContent="chapter "+next.id+" / "+next.name;
    detail.textContent=next.started?"pick up where you left off":"your next available chapter";
    link.href=next.url;link.textContent=verb+" chapter "+next.id+" ↗";
    hero.href=next.url;hero.innerHTML="";hero.append(document.createTextNode(verb+" chapter "+next.id+" "));const arrow=document.createElement("span");arrow.setAttribute("aria-hidden","true");arrow.textContent="↗";hero.append(arrow);
    discovery.href=next.url;discovery.textContent=verb+" chapter "+next.id+" ↗";
    document.getElementById("discovery-detail").textContent="chapter "+next.id+" / "+next.name;
  } else {
    title.textContent="all available chapters completed";
    detail.textContent="you have finished every published chapter. chapter 002 / aethra is planned but not published yet";
    link.href="chapter-001.html";link.textContent="review lithra ↗";
    hero.href="chapter-001.html";hero.textContent="review lithra ↗";
    discovery.href="chapter-001.html";discovery.textContent="review lithra ↗";
    document.getElementById("discovery-detail").textContent="chapter 002 / aethra is coming later";
  }
}
renderJourney();
window.addEventListener("pageshow",renderJourney);
window.addEventListener("storage",renderJourney);
