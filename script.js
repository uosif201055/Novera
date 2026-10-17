const foundations = [
  { number: "01", name: "earth / ground", symbol: "◈", description: "exploring the land beneath us including rocks soil and solid materials" },
  { number: "02", name: "sky / wind", symbol: "≋", description: "exploring air weather motion and the atmosphere above us" },
  { number: "03", name: "water", symbol: "◉", description: "exploring water its behavior and its role in the natural world" }
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