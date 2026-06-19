# Stepwise — Algorithm Visualizer

Stepwise is an interactive algorithm visualizer for learning Data Structures and Algorithms through step-by-step animations, synced Python code, variable state, and plain-English explanations.

> TODO: Upload a screenshot or hero image of the website here so visitors can quickly see what Stepwise looks like.

## What It Is

Stepwise helps students and self-learners see how algorithms actually move through data. Pick an algorithm, press play, step forward or backward, and watch the visualization, code highlight, variables, and explanation update together.

## Algorithms Covered

### Concepts

- Big O Notation
- Worst-case Analysis
- Recursion
- Two Pointers
- Sliding Window
- Space Complexity
- Memoization
- Greedy vs DP

### Data Structures

- Stack
- Queue
- Linked List
- Hash Table
- Binary Search Tree
- Heap
- Union-Find / Disjoint Sets
- Red-Black Tree

### Sorting

- Bubble Sort
- Selection Sort
- Insertion Sort
- Quick Sort
- Merge Sort
- Heap Sort
- Counting Sort
- Radix Sort
- Shell Sort
- Bucket Sort

### Searching

- Binary Search
- Linear Search
- Jump Search
- Interpolation Search
- Quickselect / Median Finding

### Graphs

- Breadth-First Search
- Depth-First Search
- Dijkstra
- Prim
- Kruskal's MST
- Topological Sort

### Dynamic Programming

- Fibonacci DP
- Knapsack 0/1
- Longest Common Subsequence

### Backtracking

- N-Queens Problem
- Sudoku Solver
- Maze Pathfinding

### Divide and Conquer

- Tower of Hanoi

### Math

- Sieve of Eratosthenes

## Tech Stack

- Astro
- TypeScript
- React
- Tailwind CSS
- D3.js
- Monaco Editor

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

## Credits

Stepwise is released under the MIT license.

Credits to the original `alg0.dev` project by Najmul H. Bappy, which inspired the foundation for this visual algorithm learning experience.
