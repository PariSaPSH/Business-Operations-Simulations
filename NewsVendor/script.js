let currentDay = 1,
    totalDays = 5,
    cumulativeProfit = 0,
    isGameActive = false;

let price = 2.5,
    cost = 2.0,
    salvage = 1.0;

function drawDemand() {
    let r = Math.random();
    if (r < 0.2) return 400;
    if (r < 0.5) return 450;
    if (r < 0.8) return 500;
    return 650;
}

function startGame() {
    price = parseFloat(document.getElementById("inputP").value);
    cost = parseFloat(document.getElementById("inputC").value);
    salvage = parseFloat(document.getElementById("inputS").value);
    totalDays = parseInt(document.getElementById("totalDaysInput").value);

    let Cu = price - cost,
        Co = cost - salvage,
        CR = (Cu + Co) > 0 ? Cu / (Cu + Co) : 0;

    document.getElementById("dispCu").innerText = Cu.toFixed(2);
    document.getElementById("dispCo").innerText = Co.toFixed(2);
    document.getElementById("dispCR").innerText = CR.toFixed(4);

    currentDay = 1;
    cumulativeProfit = 0;
    isGameActive = true;

    document.getElementById("setupArea").style.display = "none";
    document.getElementById("gameArea").style.display = "block";
    document.getElementById("historySection").style.display = "block";
    document.getElementById("analyzerSection").style.display = "block";
    document.getElementById("totalDaysDisplay").innerText = totalDays;
    document.querySelector("#historyTable tbody").innerHTML = "";
    updateDisplays(1, 0, "-", "-", "-", "-", "-");
    document.getElementById("playBtn").classList.remove("disabled");
}

function playRound() {
    if (!isGameActive) return;

    let Q = parseInt(document.getElementById("Q").value);
    if (isNaN(Q) || Q < 0) {
        alert("Enter a valid Q.");
        return;
    }

    document.getElementById("analyzeQ").value = Q;

    let demand = drawDemand(),
        sales = Math.min(Q, demand),
        leftover = Math.max(Q - demand, 0),
        lost = Math.max(demand - Q, 0);

    let dailyProfit = (price * sales) - (cost * Q) + (salvage * leftover);
    cumulativeProfit += dailyProfit;

    updateDisplays(currentDay, cumulativeProfit, demand, sales, lost, leftover, dailyProfit.toFixed(2));
    addToTable(currentDay, Q, demand, dailyProfit, cumulativeProfit);

    if (currentDay >= totalDays) {
        endGame();
    } else {
        currentDay++;
        document.getElementById("dayDisplay").innerText = currentDay;
    }
}

function addToTable(d, q, dem, dp, cp) {
    let row = document.querySelector("#historyTable tbody").insertRow();
    row.innerHTML = `<td>${d}</td><td>${q}</td><td>${dem}</td><td>$${dp.toFixed(2)}</td><td><strong>$${cp.toFixed(2)}</strong></td>`;
}

function updateDisplays(day, cp, dem, sal, los, lef, dp) {
    document.getElementById("dayDisplay").innerText = day;
    document.getElementById("cumProfitDisplay").innerText = cp.toFixed(2);
    document.getElementById("demandBox").innerText = dem;
    document.getElementById("salesBox").innerText = sal;
    document.getElementById("lostBox").innerText = los;
    document.getElementById("leftoverBox").innerText = lef;
    document.getElementById("profitBox").innerText = dp;
}

function endGame() {
    isGameActive = false;
    document.getElementById("playBtn").classList.add("disabled");
    alert("Sim Finished! Total Profit: $" + cumulativeProfit.toFixed(2));
}

function calculateExpectedValue() {
    let Q = parseInt(document.getElementById("analyzeQ").value);
    const scenarios = [
        { d: 400, p: 0.2 },
        { d: 450, p: 0.3 },
        { d: 500, p: 0.3 },
        { d: 650, p: 0.2 }
    ];

    let ev = scenarios.reduce((acc, s) => {
        let sales = Math.min(Q, s.d),
            left = Math.max(Q - s.d, 0);
        return acc + (s.p * ((price * sales) - (cost * Q) + (salvage * left)));
    }, 0);

    document.getElementById("analysisResult").innerHTML = `Q = ${Q} → Expected Daily Profit: $${ev.toFixed(2)}`;
}
