# Ledger — Personal Finance Dashboard

A minimal, clean finance dashboard built using plain HTML, CSS, and JavaScript (no frameworks).

This project focuses on simplicity, UI clarity, and real-world usability — without overengineering.

---

## What this is

This is a **single-page finance tracker** where you can:

* Track income & expenses
* Visualize spending
* Manage transactions
* Switch between admin/view-only modes

Everything runs directly in the browser — no backend, no setup headaches.

---

## Getting Started

You don’t need anything fancy.

Just open the file:

```bash
# Windows
start index.html

# Mac
open index.html
```

Or if you prefer a server:

```bash
npx serve .
# or
python3 -m http.server 8080
```

---

## Why I built this

I wanted to create a **realistic dashboard UI** that:

* Looks modern (not template-ish)
* Works without frameworks
* Demonstrates actual frontend logic (state, filtering, charts, etc.)

Also useful as:

* Portfolio project
* UI reference
* Practice for frontend interviews

---

## Features

### Dashboard

* Total balance, income, expenses
* Monthly comparison
* Trend chart (3M / 6M / 1Y)
* Category-wise spending breakdown

### Transactions

* Add / edit / delete entries
* Filter by type (income/expense)
* Category filters
* Search (live)
* Sorting (date & amount)
* Pagination

### Insights

* Top spending category
* Savings rate
* Average daily spend
* Largest transaction
* Monthly comparison charts

---

## Roles (Frontend-only)

You can switch roles from the sidebar:

| Role   | Access                        |
| ------ | ----------------------------- |
| Admin  | Full access (add/edit/delete) |
| Viewer | Read-only                     |

No authentication — just simulated for UI behavior.

---

## Data Storage

* Uses `localStorage`
* Key: `ledger_txns`
* Data persists after refresh

To reset:

```js
localStorage.clear();
```

---

## Design Notes

* Dark mode by default (because it just looks better)
* Light mode toggle included
* Fonts:

  * DM Sans (main UI)
  * DM Mono (numbers)
  * DM Serif Display (headings)

Tried to keep things:

* clean
* readable
* not overdesigned

---

## Tech Stack

* HTML5
* CSS3 (variables + responsive design)
* Vanilla JavaScript
* Chart.js (via CDN)

---

## Responsiveness

* Desktop → full layout
* Tablet → stacked charts
* Mobile → sidebar drawer + simplified UI

---

## Project Structure

```
index.html
├── styles (inside <style>)
├── layout (sidebar, pages, modal)
└── scripts (state + logic)
```

Yes, everything is in one file — intentional for simplicity.

---

## Limitations

* No backend (data is local only)
* No authentication (role switching is UI-only)
* Not optimized for large datasets

---

## Possible Improvements

If you want to extend this:

* Add backend (Node + MongoDB)
* Export data (CSV / PDF)
* Add budgets per category
* Add authentication
* Convert to React (component-based)

---

## Final Note

This project is less about perfection and more about **practical frontend thinking**.

If you're reviewing this:

* Focus on logic
* UI decisions
* usability

---