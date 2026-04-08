Kristen Cookies Process Simulation

Overview
This is an interactive simulation based on the Harvard Business School case: Kristen’s Cookie Company.

The goal of this tool is to visualize and analyze the production process, identify the bottleneck, and understand how capacity changes under different operational scenarios.

---

What This Simulation Does

* Models the full cookie production process step by step
* Allows users to change processing times for each task
* Calculates the capacity of each resource
* Identifies the bottleneck automatically
* Shows system capacity (dozens per hour)
* Visualizes how resources compare in performance

---

Process Structure

The process includes:

* Wash & Mix (Kristen)
* Dish Up (Kristen)
* Load Oven (Roommate)
* Baking (Oven)
* Cooling (Counter)
* Packaging (Roommate)
* Payment (Roommate)

Each step has a time (in minutes) that can be adjusted.

---

Capacity Logic

For each resource:

Capacity = (Number of resources × 60) / Processing time

The system capacity is:

Minimum of all resource capacities

This determines the bottleneck.

---

Key Features

* Adjustable processing times for all steps
* Ability to change the number of workers or ovens
* Automatic bottleneck detection
* Real time capacity calculation
* Visual comparison of resource capacities
* Flow diagram of the entire process

---

What You Can Analyze

This simulation is designed to explore operational questions such as:

* What happens if we hire an additional worker?
* What happens if we add another oven?
* What if a task becomes faster due to training or better equipment?
* What if we improve a non-bottleneck resource?
* What happens if a resource becomes slower (e.g., fatigue or illness)?
* How does the bottleneck shift under different scenarios?
* How does system capacity change with parallelization?

---

How to Run

Open the HTML file in your browser:
Then:

1. Adjust step times if needed
2. Change number of resources (workers, ovens)
3. Observe:

   * Capacity of each resource
   * Bottleneck
   * Total system capacity

---

Technologies

HTML
CSS
JavaScript

---

Purpose

This project was created to:

* Support teaching of process analysis and bottleneck concepts
* Provide an interactive alternative to static case calculations
* Help understand capacity, utilization, and flow systems
* Demonstrate how operations management models can be implemented as interactive tools
