EOQ Mission Control Simulator

Overview

This project is an interactive browser based simulation of an Economic Order Quantity (EOQ) inventory system. It allows users to experiment with inventory parameters and observe, in real time, how decisions affect stock levels, costs, and profit.

The simulator combines operations management logic with dynamic visualization to demonstrate how inventory systems behave over time.

Features
Real-time inventory simulation
Visualization of stock levels and reorder point (ROP)
Tracking of revenue, total cost, and net profit
Holding cost accumulation over time
Lost sales tracking when inventory is depleted
Manual ordering and automatic reorder policy
Lead time with animated shipment arrivals
Adjustable simulation speed

**Model Description**
The system simulates a continuous review inventory model with the following components:

Demand (D): constant demand rate per unit time
Order Quantity (Q): size of each replenishment
Lead Time (L): delay between placing and receiving an order
Setup Cost (K): fixed cost per order
Unit Purchasing Price (P): cost/price per unit ordered
Holding Cost (h): cost per unit held per unit time
Selling Price: revenue per unit sold

**Inventory Dynamics
**At each time step:
Inventory decreases based on demand
If inventory reaches zero, unmet demand is counted as lost sales
Holding cost accumulates based on current inventory level
Revenue accumulates based on fulfilled demand

**Replenishment**
Orders are placed manually or automatically
Each order arrives after the specified lead time
Upon arrival, inventory is increased by Q

**Reorder Policy**
Automatic ordering is triggered when inventory falls below a threshold
The simulation visualizes the reorder point (ROP) over time

**Outputs and Visualization**
The simulation displays:
Inventory level over time
Reorder point (ROP)
Procurement (ordering) costs
Holding costs
Lost sales (cumulative)
Total revenue
Total cost
Net profit

All outputs are updated in real time using interactive charts.

**How to Run**
1)Open the EOQ.html file in any web browser
2)Set the input parameters (demand, costs, lead time, etc.)
3)Click Launch Mission
4)Use:
  Place Order for manual control
  Auto-Order to enable automatic replenishment
  Pause/Resume to control simulation
  Reset to restart

**Purpose**
This project was developed as an interactive tool to:
  illustrate EOQ and inventory control concepts
  support teaching and experimentation in operations management
  demonstrate how business models can be implemented as real-time computational systems
