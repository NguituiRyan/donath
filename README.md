# Camila Nutrition

A multi-page website for **Camila**, a nutritionist serving **Kenya & Tanzania**.
Built as a fast, static site (HTML + Tailwind CSS + vanilla JavaScript) — no build step required.

🌍 Eat well · move well · live well — with local food and realistic habits.

## Pages

| Page | File | What it does |
|------|------|--------------|
| Home | `index.html` | Intro, balanced-plate guide, links to every tool |
| TDEE Calculator | `calculator.html` | Mifflin-St Jeor calorie & macro calculator; can push a goal to the tracker |
| Food Tracker | `tracker.html` | Full-featured food diary with Kenyan & East-African foods, saved in the browser |
| Local Nutrition | `nutrition.html` | Eating well with affordable East-African foods |
| Blood Sugar & Insulin | `blood-sugar.html` | How insulin works + 5 practical tips |
| Exercise | `exercise.html` | Walking/cardio, gym strength and home workouts |
| Contact | `contact.html` | Consultation request form + social links |

## Features

- **TDEE calculator** — biological sex, age, height, weight, activity → maintenance, fat-loss and lean-gain targets plus protein/carb/fat macros.
- **Food tracker** — a large food database (200+ Kenyan & East-African plus general foods) with real serving sizes per food (serving spoon, portion, cup, piece, grams…). Per-meal logging with a serving picker and live nutrition preview, editable entries, recent/frequent/"my foods" tabs, food-group filter, a macro donut, protein/carb/fat bars and fibre/sugar/sodium totals, water log, quick-add calories, exercise calories, daily notes, repeat-yesterday and date navigation. All data is stored privately in the browser via `localStorage`.
- **Personalised goals** — calorie & macro goals depend on the person: set your sex, age, height, weight, activity and goal right in the tracker, or use the TDEE calculator. The two share one saved profile, so a goal set in either place flows to the other.
- **Responsive, accessible** design with an Organic Biophilic style (nutrition-green palette, Lora + Raleway fonts).

## Tech

- Static HTML, one page per topic
- [Tailwind CSS](https://tailwindcss.com) via the Play CDN (config in `js/tailwind-config.js`)
- Vanilla JS — shared nav/footer injected by `js/components.js`
- No backend; the contact form is front-end only (wire up a service like Formspree to receive submissions)

## Project structure

```
.
├── index.html / calculator.html / tracker.html / nutrition.html
├── blood-sugar.html / exercise.html / contact.html
├── css/styles.css
├── js/
│   ├── components.js      # shared header + footer + interactions
│   ├── tailwind-config.js # shared Tailwind theme
│   ├── calculator.js      # TDEE calculator
│   ├── tracker.js         # food tracker
│   └── contact.js         # contact form
├── data/foods.js          # food database
└── vercel.json
```

## Local preview

Any static server works, e.g.:

```bash
python -m http.server 4321
# then open http://localhost:4321
```

## Deploy (Vercel)

This is a static site with **no build step**. On Vercel: import the repo, leave the build command empty and the output directory as the project root. Pushes to the default branch auto-deploy.

---

_Educational content — not a substitute for medical advice._
