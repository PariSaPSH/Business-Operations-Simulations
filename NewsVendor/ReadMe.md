Newsvendor Simulation Game

Overview
This is an interactive browser based simulation of the Newsvendor problem. The user chooses an order quantity each round and observes how demand uncertainty affects sales, leftover inventory, lost sales, and profit.

The goal is to understand the trade off between overordering (waste) and underordering (lost sales).

---

Features

* Multi-round decision game
* Random demand each round
* Tracks:

  * Sales
  * Leftover (waste)
  * Lost sales
  * Daily profit
  * Total profit
* Economic summary:

  * Underage cost (Cu)
  * Overage cost (Co)
  * Critical ratio (CR)
* History table of all rounds
* Expected value calculator for any Q

---

Demand Distribution

Demand is randomly generated as:

400 with probability 0.2
450 with probability 0.3
500 with probability 0.3
650 with probability 0.2

(see Demand.png)

---

How the Model Works

Each round:

1. You choose order quantity Q

2. Demand is realized

3. The system computes:

Sales = min(Q, Demand)
Leftover = max(Q - Demand, 0)
Lost Sales = max(Demand - Q, 0)

4. Profit is:

Profit = (price × sales) − (cost × Q) + (salvage × leftover)

---

Economic Logic

Underage Cost (Cu) = price − cost
Overage Cost (Co) = cost − salvage

Critical Ratio (CR) = Cu / (Cu + Co)

CR represents the optimal service level target.

---

Expected Value Analyzer

You can test any Q and compute:

Expected Profit = sum over all demand scenarios of
(probability × profit)

This helps compare decisions and find better order quantities.

---

How to Run

1. Open the HTML file in your browser
2. Set:
   * price
   * cost
   * salvage value
   * number of rounds
3. Click "Start Game"
4. Enter Q each round
5. Click the sun to simulate demand

---

Technologies

HTML
CSS
JavaScript

---

Purpose

This project is designed to:

* Teach the Newsvendor model interactively
* Show decision making under uncertainty
* Connect theory with simulation
* Demonstrate implementation of business models in code
