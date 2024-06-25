function shuffle(array) {
    var currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      var randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

var money = 1000;
var currentProfit = 0;
var profitMultiplier = 0; // TODO: Make this dependent on the number of bombs

// Sets up the tile buttons for the mines
var i = 0;
for (var y = 0; y < 5; y++) {
    for (var x = 0; x < 5; x++) {
        var tile = document.createElement("button");
        tile.id = `tile${i}`;
        tile.className = "tile";
        tile.innerText = "\u2060";
        tile.disabled = true;
        tile.onclick = tileClick;
        document.getElementById("tileContainer").appendChild(tile);
        i++;
    }
    document.getElementById("tileContainer").appendChild(document.createElement("br"))
}

tileValues = [];

// Creates the tile's values for either a bomb or a diamond
function resetMine(bombCount) {
    tileValues = [];
    for (var i = 0; i < 25; i++) {
        document.getElementById(`tile${i}`).innerText = "\u2060";
    }
    for (var i = 0; i < bombCount; i++) {
        tileValues.push(false);
    }
    for (var i = 0; i < (25 - bombCount); i++) {
        tileValues.push(true);
    }
    shuffle(tileValues);
}

function revealTiles() {
    for (var i = 0; i < 25; i++) {
        document.getElementById(`tile${i}`).innerText = tileValues[i] ? "💎" : "🧨";
        document.getElementById(`tile${i}`).disabled = true;
    }
    document.getElementById("playButton").disabled = false;
}

// The onClick function for the tile that reveals its value and HANDLES THE GAME LOGIC
function tileClick(e) {
    e.preventDefault();
    const tileValue = tileValues[parseInt(e.target.id.replace("tile", ""))];

    // Reveals the value
    e.target.innerText = tileValue ? "💎" : "🧨";

    // Handles game logic
    if (tileValue == false) {
        setTimeout(() => {
            alert("You have lost!");
        }, 400);
        revealTiles();

        if (money <= 0) {
            alert("You have gone bankrupt!");
            money = 1000;
            currentProfit = 0;
        }
    }
    else {
        currentProfit *= profitMultiplier;
    }
    updateMoneyCount();
    updateProfitCount();
}

// resetMine(4);

// Resets the tiles to new values and hides the their values
document.getElementById("playButton").onclick = (e) => {
    var betAmount = parseInt(document.getElementById("betAmountInput").value);
    if (betAmount > money) {
        alert("You do not have sufficient funds for this bet!");
        return;
    }
    
    money -= betAmount;
    currentProfit = betAmount;

    resetMine(parseInt(document.getElementById("bombCountInput").value));
    for (var i = 0; i < 25; i++) {
        document.getElementById(`tile${i}`).disabled = false;
    }
    document.getElementById("playButton").disabled = true;

    profitMultiplier = 0.3 * parseInt(document.getElementById("bombCountInput").value)

    updateMoneyCount();
    updateProfitCount();
}

// DONE: Implement the cash out, profit amount and bet amount input fields

function updateMoneyCount() {
    document.getElementById("moneyCount").innerText = `Money: ${currencyFormatter.format(money)}`;
}

function updateProfitCount() {
    document.getElementById("profitCount").innerText = `Profit: ${currencyFormatter.format(currentProfit)} (${profitMultiplier}x)`;
}

document.getElementById("cashOutButton").onclick = (e) => {
    money += currentProfit;
    currentProfit = 0;
    revealTiles();
    updateMoneyCount();
    updateProfitCount();
}

updateMoneyCount();
updateProfitCount();