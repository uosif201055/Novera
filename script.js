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
// Chapter progress is stored locally until user accounts are available.
let progress = {step:0,completed:false};
try { progress = {...progress,...JSON.parse(localStorage.getItem("novera.chapter1") || "{}")}; } catch (_) {}
const percent = progress.completed ? 100 : Math.min(80,Math.max(0,Number(progress.step)||0)*20);
document.getElementById("learning-fill").style.width = percent+"%";
document.getElementById("learning-percent").textContent = percent+"%";
document.getElementById("learning-track").setAttribute("aria-valuenow",String(percent));
document.getElementById("learning-status").textContent = progress.completed ? "chapter 1 completed" : percent ? "chapter 1 in progress" : "chapter 1 not started";
document.getElementById("learning-link").textContent = progress.completed ? "review chapter 1 ↗" : percent ? "continue chapter 1 ↗" : "start chapter 1 ↗";
