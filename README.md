# Stepwise — Algorithm Visualizer

Stepwise is an interactive algorithm visualizer for learning Data Structures and Algorithms through step-by-step animations, synced Python and C++ code, variable state, and plain-English explanations.

<img src="src/assets/stepwise-preview.png" alt="Stepwise website preview" width="100%">

## What It Is

Stepwise helps students and self-learners see how algorithms actually move through data. Pick an algorithm, press play, step forward or backward, and watch the visualization, Python/C++ code highlight, variables, and explanation update together.

## Algorithms Covered

Stepwise currently includes 45+ algorithms and DSA concepts across core learning categories.

| Category | Algorithms / Concepts |
|---|---|
| **Concepts** | Big O Notation, Worst-case Analysis, Recursion, Two Pointers, Sliding Window, Space Complexity, Memoization, Greedy vs DP |
| **Data Structures** | Stack, Queue, Linked List, Hash Table, Binary Search Tree, Heap, Union-Find / Disjoint Sets, Red-Black Tree |
| **Sorting** | Bubble Sort, Selection Sort, Insertion Sort, Quick Sort, Merge Sort, Heap Sort, Counting Sort, Radix Sort, Shell Sort, Bucket Sort |
| **Searching** | Binary Search, Linear Search, Jump Search, Interpolation Search, Quickselect / Median Finding |
| **Graphs** | Breadth-First Search, Depth-First Search, Dijkstra, Prim, Kruskal's MST, Topological Sort |
| **Dynamic Programming** | Fibonacci DP, Knapsack 0/1, Longest Common Subsequence |
| **Backtracking** | N-Queens Problem, Sudoku Solver, Maze Pathfinding |
| **Divide and Conquer** | Tower of Hanoi |
| **Math** | Sieve of Eratosthenes |

## Tech Stack

![Astro](https://img.shields.io/badge/Astro-000000?style=for-the-badge&logo=astro&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![D3.js](https://img.shields.io/badge/D3.js-F9A03C?style=for-the-badge&logo=d3.js&logoColor=white)
![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)

## Run Locally

Requirements:

- Node.js `>=22.12.0`
- pnpm

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm run dev
```

Build for production:

```bash
pnpm run build
```

Preview the production build:

```bash
pnpm run preview
```

## CI/CD

This repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml`.

On pull requests and pushes to `main`, the workflow:

- Installs dependencies with pnpm
- Builds the Astro site
- Uploads the `dist` artifact
- Deploys to GitHub Pages on pushes to `main`

In GitHub, enable Pages with **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Found a Bug or Want to Suggest an Algorithm?

Open an issue on GitHub with:

- What you expected to happen
- What actually happened
- Steps to reproduce, if it is a bug
- The algorithm or concept you want added, if it is a request

## Inspiration

This project was inspired by my Data Structures and Algorithms class and my technical interview preparation. While learning topics like sorting, searching, recursion, trees, graphs, and dynamic programming, I realized that reading code alone is not always enough to fully understand how an algorithm works. Many times, the difficult part is not the syntax, but seeing how the data changes at each step and why the algorithm makes certain decisions. I wanted to build something that makes DSA concepts easier to follow by connecting the code, visual steps, variable changes, and explanation together in one place. The goal is to help students and interview candidates understand algorithms, practice with confidence, and build stronger problem-solving skills.

## Author

Built by Sai Rithwik Kukunuri :) Consider leaving a 🌟 if this adds value, and all feedback is very welcome. Feel free to message me on [LinkedIn](https://www.linkedin.com/in/rithwik0801).
