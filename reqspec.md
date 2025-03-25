# Dart Scoring App – 501 Game Specification

## 🎯 Overview

Build a sophisticated Dart Scoring App focused on the 501 game format using **manual input mode**. The app should fully support official dart rules, track meaningful player statistics, and guide users clearly during checkout scenarios.

---

## 1. Game Setup

- Support **2 players**
- Allow configuration of:
  - **Number of sets**
  - **Number of legs per set**

---

## 2. Game Logic

- Players start at **501 points**, counting down to **0**
- **Turn-based play**: alternate between players
- **Bust rule**: if a player scores more than their remaining score or ends on an invalid finish, their score reverts to what it was before the turn
- **Checkout rule**: a player can only win a leg if their final dart lands on a **double** or **bullseye**

---

## 3. Manual Input Mode (0–9 only)

- Players manually enter the **total score** for each turn (max 180)
- The app must calculate:
  - Remaining score
  - Detect busts
  - Detect potential checkout scenarios

---

## 4. Checkout Handling (Explicit Logic)

Due to manual input, the app cannot automatically detect checkout attempts. It must **prompt the user** intelligently based on the score and entered points:

### ✅ Checkout Success (score reaches 0)

- **If player has 170 left and enters 170**  
  → No prompt. Player must have used **3 darts**

- **If player has 100 left and enters 100**  
  → Prompt:  
  `"You checked out with 100. How many darts did you use? (2 or 3)"`  
  → Use input to update darts thrown and checkout stats

---

### ❌ No Checkout (score not zero) but within checkout range (≤170)

- **If player has 100 left and enters 60**  
  → Prompt:  
  `"You scored 60 from 100 — did you attempt checkout? If yes, how many darts did you throw? (1 or 2)"`

- **If player has 150 and scores 60**  
  → No prompt — not in checkout range

These prompts ensure **accurate stats** despite manual entry.

---

## 5. Player Statistics (Per Match)

Track and display:

- **Remaining score**
- **Total darts thrown**
- **Three-dart average**
- **Checkout attempts** (based on prompt)
- **Successful checkouts**
- **Checkout percentage** (successes / attempts)

---

## 6. UX Considerations

- Highlight when a player enters **checkout range** (≤170)
- Validate inputs (0–180 only)
- Handle invalid or impossible scores gracefully
- Notify user when:
  - A bust occurs
  - A leg, set, or match is won

---

## 7. Architecture & Extensibility

- Use modular code structure for:
  - Game logic
  - Stats tracking
  - Input prompts
- Prepare for future features:
  - Additional game types (301, 701, Cricket)
  - More than 2 players
  - Online sync
  - UI themes and user accounts

---
