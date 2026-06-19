import { getCppCode } from '@lib/algorithms/cpp-code'
import type {
  Algorithm,
  Step,
  LinkedListNodeData,
  HashEntry,
  TreeNodeData,
  RedBlackTreeNodeData,
  DisjointSetItem,
} from '@lib/types'
import { d } from '@lib/algorithms/shared'

// Re-export stack and queue (moved from concepts)
export { stack, queue } from '@lib/algorithms/concepts'

// ════════════════════════════════════════════════════════════════
//  LINKED LIST
// ════════════════════════════════════════════════════════════════

type LLNode = LinkedListNodeData

function ll(nodes: LLNode[]): LLNode[] {
  return nodes
}

export const linkedList: Algorithm = {
  id: 'linked-list',
  name: 'Linked List',
  category: 'Data Structures',
  difficulty: 'easy',
  visualization: 'concept',
  code: `class Node:
    def __init__(self, value):
        self.value = value
        self.next = None


class LinkedList:
    def __init__(self):
        self.head = None
        self.tail = None

    def append(self, value):
        node = Node(value)
        # Empty list: node is first and last
        if self.head is None:
            self.head = node
            self.tail = node
        else:
            self.tail.next = node
            self.tail = node

    def prepend(self, value):
        node = Node(value)
        node.next = self.head
        self.head = node
        if self.tail is None:
            self.tail = node

    def search(self, value):
        current = self.head
        while current is not None:
            if current.value == value:
                return current
            current = current.next
        return None

    def delete(self, value):
        if self.head is None:
            return
        # Removing the first node is a special case
        if self.head.value == value:
            self.head = self.head.next
            if self.head is None:
                self.tail = None
            return
        current = self.head
        while current.next is not None:
            if current.next.value == value:
                if current.next is self.tail:
                    self.tail = current
                current.next = current.next.next
                return
            current = current.next`,
  description: `Linked List

A Linked List is a linear data structure where each element (node) contains a value and a pointer (reference) to the next node.

Unlike arrays, linked lists don't store elements in contiguous memory — each node can be anywhere in memory, connected by pointers.

Operations:
  - append: add node at the end — O(1) with tail pointer
  - prepend: add node at the beginning — O(1)
  - search: traverse to find a value — O(n)
  - delete: remove a node by value — O(n)
  - access by index: traverse from head — O(n)

Advantages:
  - O(1) insertion/deletion at known positions
  - Dynamic size, no wasted memory
  - Efficient insertion at head

Disadvantages:
  - O(n) access by index (no random access)
  - Extra memory for pointers
  - Not cache-friendly`,
  cppCode: getCppCode('linked-list'),

  generateSteps(locale = 'en') {
    const steps: Step[] = []

    steps.push({
      concept: { type: 'linkedList', nodes: [] },
      description: d(
        locale,
        'An empty linked list. Head and tail are both null.',
        'Una lista enlazada vacía. Head y tail son null.',
      ),
      codeLine: 9,
      variables: { head: null, tail: null, size: 0 },
    })

    steps.push({
      concept: {
        type: 'linkedList',
        nodes: ll([{ value: 10, state: 'new' }]),
        operation: 'append(10)',
      },
      description: d(
        locale,
        'append(10): First node. Both head and tail point to it.',
        'append(10): Primer nodo. Tanto head como tail apuntan a él.',
      ),
      codeLine: 16,
      variables: { operation: 'append(10)', head: 10, tail: 10, size: 1 },
    })

    steps.push({
      concept: {
        type: 'linkedList',
        nodes: ll([
          { value: 10, state: 'normal' },
          { value: 20, state: 'new' },
        ]),
        operation: 'append(20)',
      },
      description: d(
        locale,
        'append(20): New node added after tail. Tail now points to 20.',
        'append(20): Nuevo nodo añadido después de tail. Tail ahora apunta a 20.',
      ),
      codeLine: 19,
      variables: { operation: 'append(20)', head: 10, tail: 20, size: 2 },
    })

    steps.push({
      concept: {
        type: 'linkedList',
        nodes: ll([
          { value: 10, state: 'normal' },
          { value: 20, state: 'normal' },
          { value: 30, state: 'new' },
        ]),
        operation: 'append(30)',
      },
      description: d(
        locale,
        'append(30): Chain grows. Each node points to the next via .next pointer.',
        'append(30): La cadena crece. Cada nodo apunta al siguiente via el puntero .next.',
      ),
      codeLine: 19,
      variables: { operation: 'append(30)', head: 10, tail: 30, size: 3 },
    })

    steps.push({
      concept: {
        type: 'linkedList',
        nodes: ll([
          { value: 5, state: 'new' },
          { value: 10, state: 'normal' },
          { value: 20, state: 'normal' },
          { value: 30, state: 'normal' },
        ]),
        operation: 'prepend(5)',
      },
      description: d(
        locale,
        'prepend(5): New node becomes the head. O(1) — no shifting needed!',
        'prepend(5): El nuevo nodo se convierte en head. ¡O(1) — no se necesita desplazar!',
      ),
      codeLine: 22,
      variables: { operation: 'prepend(5)', head: 5, tail: 30, size: 4 },
    })

    // Search for 20
    steps.push({
      concept: {
        type: 'linkedList',
        nodes: ll([
          { value: 5, state: 'current' },
          { value: 10, state: 'normal' },
          { value: 20, state: 'normal' },
          { value: 30, state: 'normal' },
        ]),
        operation: 'search(20)',
      },
      description: d(
        locale,
        'search(20): Start at head (5). Not 20, follow .next pointer...',
        'search(20): Empezar en head (5). No es 20, seguir el puntero .next...',
      ),
      codeLine: 29,
      variables: { operation: 'search(20)', current: 5, target: 20 },
    })

    steps.push({
      concept: {
        type: 'linkedList',
        nodes: ll([
          { value: 5, state: 'normal' },
          { value: 10, state: 'current' },
          { value: 20, state: 'normal' },
          { value: 30, state: 'normal' },
        ]),
        operation: 'search(20)',
      },
      description: d(
        locale,
        'search(20): At node 10. Not 20, keep traversing...',
        'search(20): En nodo 10. No es 20, seguir recorriendo...',
      ),
      codeLine: 31,
      variables: { operation: 'search(20)', current: 10, target: 20 },
    })

    steps.push({
      concept: {
        type: 'linkedList',
        nodes: ll([
          { value: 5, state: 'normal' },
          { value: 10, state: 'normal' },
          { value: 20, state: 'found' },
          { value: 30, state: 'normal' },
        ]),
        operation: 'search(20) → found!',
      },
      description: d(
        locale,
        'search(20): Found it! O(n) worst case — must traverse from head.',
        'search(20): ¡Encontrado! O(n) en el peor caso — se debe recorrer desde head.',
      ),
      codeLine: 33,
      variables: { operation: 'search(20)', found: true, steps: 3 },
    })

    // Delete 20
    steps.push({
      concept: {
        type: 'linkedList',
        nodes: ll([
          { value: 5, state: 'normal' },
          { value: 10, state: 'current' },
          { value: 20, state: 'removing' },
          { value: 30, state: 'normal' },
        ]),
        operation: 'delete(20)',
      },
      description: d(
        locale,
        "delete(20): Found node 20. Set previous node's .next to skip it (10.next = 30).",
        'delete(20): Nodo 20 encontrado. Actualizar .next del anterior para saltarlo (10.next = 30).',
      ),
      codeLine: 51,
      variables: { operation: 'delete(20)', removing: 20 },
    })

    steps.push({
      concept: {
        type: 'linkedList',
        nodes: ll([
          { value: 5, state: 'normal' },
          { value: 10, state: 'normal' },
          { value: 30, state: 'normal' },
        ]),
        operation: 'delete(20) → done',
      },
      description: d(
        locale,
        'Node 20 removed. The list is now [5 → 10 → 30]. O(n) to find the node.',
        'Nodo 20 eliminado. La lista ahora es [5 → 10 → 30]. O(n) para encontrar el nodo.',
      ),
      codeLine: 52,
      variables: { head: 5, tail: 30, size: 3 },
    })

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
//  HASH TABLE
// ════════════════════════════════════════════════════════════════

function hashCode(key: string, size: number): number {
  let h = 0
  for (const ch of key) h = (h + ch.charCodeAt(0)) % size
  return h
}

function makeBuckets(size: number, entries: [string, number, string][]): HashEntry[][] {
  const buckets: HashEntry[][] = Array.from({ length: size }, () => [])
  for (const [key, value, state] of entries) {
    const idx = hashCode(key, size)
    buckets[idx].push({ key, value, state: state as HashEntry['state'] })
  }
  return buckets
}

export const hashTable: Algorithm = {
  id: 'hash-table',
  name: 'Hash Table',
  category: 'Data Structures',
  difficulty: 'intermediate',
  visualization: 'concept',
  code: `class HashTable:
    def __init__(self, size=7):
        # Each bucket chains entries on collisions
        self.buckets = []
        for i in range(size):
            self.buckets.append([])

    def hash(self, key):
        total = 0
        for ch in key:
            total = (total + ord(ch)) % len(self.buckets)
        return total

    def set(self, key, value):
        idx = self.hash(key)
        bucket = self.buckets[idx]
        # Update in place if the key already exists
        for entry in bucket:
            if entry["key"] == key:
                entry["value"] = value
                return
        bucket.append({"key": key, "value": value})

    def get(self, key):
        idx = self.hash(key)
        bucket = self.buckets[idx]
        for entry in bucket:
            if entry["key"] == key:
                return entry["value"]
        return None

    def delete(self, key):
        idx = self.hash(key)
        bucket = self.buckets[idx]
        for i in range(len(bucket)):
            if bucket[i]["key"] == key:
                bucket.pop(i)
                return`,
  description: `Hash Table

A Hash Table (or Hash Map) maps keys to values using a hash function. It provides near-constant time O(1) for insert, lookup, and delete.

How it works:
1. A hash function converts the key into an array index
2. The value is stored at that index (bucket)
3. If two keys hash to the same index → collision

Collision handling (chaining):
  - Each bucket stores a list of entries
  - Multiple keys can share the same bucket

Time Complexity:
  - Average: O(1) for set, get, delete
  - Worst case: O(n) when all keys collide

Space Complexity: O(n)

Applications:
  - Caches, databases, symbol tables
  - Counting frequencies
  - Deduplication`,
  cppCode: getCppCode('hash-table'),

  generateSteps(locale = 'en') {
    const steps: Step[] = []
    const SIZE = 7

    steps.push({
      concept: { type: 'hashTable', buckets: makeBuckets(SIZE, []), size: SIZE },
      description: d(
        locale,
        'An empty hash table with 7 buckets. The hash function maps keys to bucket indices.',
        'Una tabla hash vacía con 7 buckets. La función hash mapea claves a índices de bucket.',
      ),
      codeLine: 4,
      variables: { size: SIZE, entries: 0 },
    })

    // Insert "cat"
    const catH = hashCode('cat', SIZE)
    steps.push({
      concept: {
        type: 'hashTable',
        buckets: makeBuckets(SIZE, [['cat', 3, 'new']]),
        size: SIZE,
        hashingKey: 'cat',
        hashResult: catH,
        operation: 'set("cat", 3)',
      },
      description: d(
        locale,
        `set("cat", 3): hash("cat") = ${catH}. Store in bucket ${catH}.`,
        `set("cat", 3): hash("cat") = ${catH}. Almacenar en bucket ${catH}.`,
      ),
      codeLine: 15,
      variables: { key: 'cat', hash: catH, bucket: catH },
    })

    // Insert "dog"
    const dogH = hashCode('dog', SIZE)
    steps.push({
      concept: {
        type: 'hashTable',
        buckets: makeBuckets(SIZE, [
          ['cat', 3, 'normal'],
          ['dog', 5, 'new'],
        ]),
        size: SIZE,
        hashingKey: 'dog',
        hashResult: dogH,
        operation: 'set("dog", 5)',
      },
      description: d(
        locale,
        `set("dog", 5): hash("dog") = ${dogH}. Different bucket, no collision.`,
        `set("dog", 5): hash("dog") = ${dogH}. Diferente bucket, sin colisión.`,
      ),
      codeLine: 15,
      variables: { key: 'dog', hash: dogH, bucket: dogH },
    })

    // Insert "ant"
    const antH = hashCode('ant', SIZE)
    steps.push({
      concept: {
        type: 'hashTable',
        buckets: makeBuckets(SIZE, [
          ['cat', 3, 'normal'],
          ['dog', 5, 'normal'],
          ['ant', 1, 'new'],
        ]),
        size: SIZE,
        hashingKey: 'ant',
        hashResult: antH,
        operation: 'set("ant", 1)',
      },
      description: d(
        locale,
        `set("ant", 1): hash("ant") = ${antH}. Placed in bucket ${antH}.`,
        `set("ant", 1): hash("ant") = ${antH}. Colocado en bucket ${antH}.`,
      ),
      codeLine: 15,
      variables: { key: 'ant', hash: antH, bucket: antH },
    })

    // Insert "fish" — collision with "dog"!
    const fishH = hashCode('fish', SIZE)
    steps.push({
      concept: {
        type: 'hashTable',
        buckets: makeBuckets(SIZE, [
          ['cat', 3, 'normal'],
          ['dog', 5, 'collision'],
          ['ant', 1, 'normal'],
          ['fish', 8, 'new'],
        ]),
        size: SIZE,
        hashingKey: 'fish',
        hashResult: fishH,
        operation: 'set("fish", 8) — COLLISION!',
      },
      description: d(
        locale,
        `set("fish", 8): hash("fish") = ${fishH}. Collision with "dog"! Both go in the same bucket using chaining.`,
        `set("fish", 8): hash("fish") = ${fishH}. ¡Colisión con "dog"! Ambos van al mismo bucket usando encadenamiento.`,
      ),
      codeLine: 22,
      variables: { key: 'fish', hash: fishH, collision: true },
    })

    // Insert "bee" — another collision
    const beeH = hashCode('bee', SIZE)
    steps.push({
      concept: {
        type: 'hashTable',
        buckets: makeBuckets(SIZE, [
          ['cat', 3, 'normal'],
          ['dog', 5, 'normal'],
          ['ant', 1, 'normal'],
          ['fish', 8, 'collision'],
          ['bee', 2, 'new'],
        ]),
        size: SIZE,
        hashingKey: 'bee',
        hashResult: beeH,
        operation: 'set("bee", 2) — COLLISION!',
      },
      description: d(
        locale,
        `set("bee", 2): hash("bee") = ${beeH}. Another collision! Bucket ${beeH} now has a chain of 3 entries.`,
        `set("bee", 2): hash("bee") = ${beeH}. ¡Otra colisión! Bucket ${beeH} ahora tiene una cadena de 3 entradas.`,
      ),
      codeLine: 22,
      variables: { key: 'bee', hash: beeH, chainLength: 3 },
    })

    // Get "cat"
    steps.push({
      concept: {
        type: 'hashTable',
        buckets: makeBuckets(SIZE, [
          ['cat', 3, 'found'],
          ['dog', 5, 'normal'],
          ['ant', 1, 'normal'],
          ['fish', 8, 'normal'],
          ['bee', 2, 'normal'],
        ]),
        size: SIZE,
        hashingKey: 'cat',
        hashResult: catH,
        operation: 'get("cat") → 3',
      },
      description: d(
        locale,
        `get("cat"): hash → bucket ${catH}. Only one entry, found immediately. O(1)!`,
        `get("cat"): hash → bucket ${catH}. Solo una entrada, encontrada de inmediato. ¡O(1)!`,
      ),
      codeLine: 25,
      variables: { key: 'cat', hash: catH, result: 3 },
    })

    // Get "fish" — requires chain traversal
    steps.push({
      concept: {
        type: 'hashTable',
        buckets: makeBuckets(SIZE, [
          ['cat', 3, 'normal'],
          ['dog', 5, 'normal'],
          ['ant', 1, 'normal'],
          ['fish', 8, 'found'],
          ['bee', 2, 'normal'],
        ]),
        size: SIZE,
        hashingKey: 'fish',
        hashResult: fishH,
        operation: 'get("fish") → 8',
      },
      description: d(
        locale,
        `get("fish"): hash → bucket ${fishH}. Must traverse the chain: "dog" → "fish". Found! Still fast with short chains.`,
        `get("fish"): hash → bucket ${fishH}. Recorrer la cadena: "dog" → "fish". ¡Encontrado! Sigue siendo rápido con cadenas cortas.`,
      ),
      codeLine: 27,
      variables: { key: 'fish', hash: fishH, result: 8, chainSteps: 2 },
    })

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
//  BINARY SEARCH TREE
// ════════════════════════════════════════════════════════════════

function makeTree(values: [number, string][]): (TreeNodeData | null)[] {
  const arr: (TreeNodeData | null)[] = []
  for (const [val, state] of values) {
    insertIntoTreeArray(arr, val, state as TreeNodeData['state'])
  }
  return arr
}

function insertIntoTreeArray(
  arr: (TreeNodeData | null)[],
  value: number,
  state: TreeNodeData['state'],
) {
  let idx = 0
  while (idx < arr.length && arr[idx]) {
    if (value < arr[idx]!.value) idx = 2 * idx + 1
    else idx = 2 * idx + 2
  }
  while (arr.length <= idx) arr.push(null)
  arr[idx] = { value, state }
}

export const binarySearchTree: Algorithm = {
  id: 'binary-search-tree',
  name: 'Binary Search Tree',
  category: 'Data Structures',
  difficulty: 'intermediate',
  visualization: 'concept',
  code: `class BSTNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


class BST:
    def __init__(self):
        self.root = None

    def insert(self, value):
        node = BSTNode(value)
        # First value becomes the root
        if self.root is None:
            self.root = node
            return
        current = self.root
        while True:
            # Smaller values belong on the left
            if value < current.value:
                if current.left is None:
                    current.left = node
                    return
                current = current.left
            else:
                if current.right is None:
                    current.right = node
                    return
                current = current.right

    def search(self, value):
        current = self.root
        while current is not None:
            if value == current.value:
                return current
            # Pick the side that could hold the value
            if value < current.value:
                current = current.left
            else:
                current = current.right
        return None`,
  description: `Binary Search Tree (BST)

A BST is a tree where each node has at most two children, and for every node:
  - Left subtree contains only values less than the node
  - Right subtree contains only values greater than the node

This ordering property enables efficient search by halving the search space at each step.

Operations:
  - insert: compare and go left/right — O(h)
  - search: compare and go left/right — O(h)
  - delete: find and restructure — O(h)

Where h = height of the tree:
  - Balanced tree: h = O(log n) → efficient!
  - Degenerate (all one side): h = O(n) → like a linked list

Applications:
  - Ordered data storage
  - Range queries
  - Priority queues (with balancing)`,
  cppCode: getCppCode('binary-search-tree'),

  generateSteps(locale = 'en') {
    const steps: Step[] = []

    steps.push({
      concept: { type: 'binaryTree', nodes: [], treeType: 'bst' },
      description: d(
        locale,
        'An empty BST. The first inserted value becomes the root.',
        'Un BST vacío. El primer valor insertado se convierte en la raíz.',
      ),
      codeLine: 10,
      variables: { root: null },
    })

    // Insert 8 (root)
    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: makeTree([[8, 'new']]),
        treeType: 'bst',
        operation: 'insert(8)',
      },
      description: d(
        locale,
        'insert(8): Tree is empty, 8 becomes the root.',
        'insert(8): El árbol está vacío, 8 se convierte en la raíz.',
      ),
      codeLine: 16,
      variables: { operation: 'insert(8)', root: 8 },
    })

    // Insert 3
    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: makeTree([
          [8, 'comparing'],
          [3, 'new'],
        ]),
        treeType: 'bst',
        operation: 'insert(3)',
      },
      description: d(
        locale,
        'insert(3): 3 < 8, go left. Left is empty → place here.',
        'insert(3): 3 < 8, ir a la izquierda. Izquierda vacía → colocar aquí.',
      ),
      codeLine: 22,
      variables: { operation: 'insert(3)', compare: '3 < 8', direction: 'left' },
    })

    // Insert 10
    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: makeTree([
          [8, 'comparing'],
          [3, 'normal'],
          [10, 'new'],
        ]),
        treeType: 'bst',
        operation: 'insert(10)',
      },
      description: d(
        locale,
        'insert(10): 10 ≥ 8, go right. Right is empty → place here.',
        'insert(10): 10 ≥ 8, ir a la derecha. Derecha vacía → colocar aquí.',
      ),
      codeLine: 27,
      variables: { operation: 'insert(10)', compare: '10 ≥ 8', direction: 'right' },
    })

    // Insert 1
    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: makeTree([
          [8, 'normal'],
          [3, 'comparing'],
          [10, 'normal'],
          [1, 'new'],
        ]),
        treeType: 'bst',
        operation: 'insert(1)',
      },
      description: d(
        locale,
        'insert(1): 1 < 8 → left to 3. 1 < 3 → left again. Empty → place here.',
        'insert(1): 1 < 8 → izquierda a 3. 1 < 3 → izquierda de nuevo. Vacío → colocar aquí.',
      ),
      codeLine: 22,
      variables: { operation: 'insert(1)', path: '8 → 3 → left' },
    })

    // Insert 6
    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: makeTree([
          [8, 'normal'],
          [3, 'comparing'],
          [10, 'normal'],
          [1, 'normal'],
          [6, 'new'],
        ]),
        treeType: 'bst',
        operation: 'insert(6)',
      },
      description: d(
        locale,
        'insert(6): 6 < 8 → left to 3. 6 ≥ 3 → right. Empty → place here.',
        'insert(6): 6 < 8 → izquierda a 3. 6 ≥ 3 → derecha. Vacío → colocar aquí.',
      ),
      codeLine: 27,
      variables: { operation: 'insert(6)', path: '8 → 3 → right' },
    })

    // Insert 14
    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: makeTree([
          [8, 'normal'],
          [3, 'normal'],
          [10, 'comparing'],
          [1, 'normal'],
          [6, 'normal'],
          [14, 'new'],
        ]),
        treeType: 'bst',
        operation: 'insert(14)',
      },
      description: d(
        locale,
        'insert(14): 14 ≥ 8 → right to 10. 14 ≥ 10 → right. Empty → place here.',
        'insert(14): 14 ≥ 8 → derecha a 10. 14 ≥ 10 → derecha. Vacío → colocar aquí.',
      ),
      codeLine: 27,
      variables: { operation: 'insert(14)', path: '8 → 10 → right' },
    })

    // Search for 6
    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: makeTree([
          [8, 'current'],
          [3, 'normal'],
          [10, 'normal'],
          [1, 'normal'],
          [6, 'normal'],
          [14, 'normal'],
        ]),
        treeType: 'bst',
        operation: 'search(6): at root 8',
      },
      description: d(
        locale,
        'search(6): Start at root (8). 6 < 8, go left...',
        'search(6): Empezar en la raíz (8). 6 < 8, ir a la izquierda...',
      ),
      codeLine: 35,
      variables: { operation: 'search(6)', current: 8, compare: '6 < 8' },
    })

    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: makeTree([
          [8, 'normal'],
          [3, 'current'],
          [10, 'normal'],
          [1, 'normal'],
          [6, 'normal'],
          [14, 'normal'],
        ]),
        treeType: 'bst',
        operation: 'search(6): at node 3',
      },
      description: d(
        locale,
        'search(6): At node 3. 6 ≥ 3, go right...',
        'search(6): En nodo 3. 6 ≥ 3, ir a la derecha...',
      ),
      codeLine: 41,
      variables: { operation: 'search(6)', current: 3, compare: '6 ≥ 3' },
    })

    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: makeTree([
          [8, 'normal'],
          [3, 'normal'],
          [10, 'normal'],
          [1, 'normal'],
          [6, 'found'],
          [14, 'normal'],
        ]),
        treeType: 'bst',
        operation: 'search(6) → found!',
      },
      description: d(
        locale,
        'search(6): Found! Only 3 comparisons (root → 3 → 6). O(log n) on a balanced tree.',
        'search(6): ¡Encontrado! Solo 3 comparaciones (raíz → 3 → 6). O(log n) en un árbol balanceado.',
      ),
      codeLine: 36,
      variables: { operation: 'search(6)', found: true, comparisons: 3 },
    })

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
//  HEAP (MIN HEAP)
// ════════════════════════════════════════════════════════════════

function heapNodes(
  values: number[],
  highlights: Record<number, TreeNodeData['state']> = {},
): (TreeNodeData | null)[] {
  return values.map((v, i) => ({
    value: v,
    state: highlights[i] ?? 'normal',
  }))
}

export const heap: Algorithm = {
  id: 'heap',
  name: 'Heap',
  category: 'Data Structures',
  difficulty: 'intermediate',
  visualization: 'concept',
  code: `class MinHeap:
    def __init__(self):
        self.heap = []

    def insert(self, value):
        self.heap.append(value)
        # Fix the heap upward from last spot
        self.bubble_up(len(self.heap) - 1)

    def bubble_up(self, i):
        while i > 0:
            parent = (i - 1) // 2
            # Stop when parent not larger than child
            if self.heap[parent] <= self.heap[i]:
                break
            temp = self.heap[parent]
            self.heap[parent] = self.heap[i]
            self.heap[i] = temp
            i = parent

    def extract_min(self):
        min_value = self.heap[0]
        last = self.heap.pop()
        # Move last value to top, sink down
        if len(self.heap) > 0:
            self.heap[0] = last
            self.bubble_down(0)
        return min_value

    def bubble_down(self, i):
        while 2 * i + 1 < len(self.heap):
            smallest = 2 * i + 1
            right = smallest + 1
            # Choose the smaller of the two children
            if right < len(self.heap) and self.heap[right] < self.heap[smallest]:
                smallest = right
            if self.heap[i] <= self.heap[smallest]:
                break
            temp = self.heap[i]
            self.heap[i] = self.heap[smallest]
            self.heap[smallest] = temp
            i = smallest`,
  description: `Heap (Min Heap)

A Heap is a complete binary tree where every parent is smaller (min-heap) or larger (max-heap) than its children. It's stored as an array.

Array-to-tree mapping (0-indexed):
  - Parent of i: Math.floor((i - 1) / 2)
  - Left child of i: 2 * i + 1
  - Right child of i: 2 * i + 2

Operations:
  - insert: add at end, bubble up — O(log n)
  - extractMin: remove root, bubble down — O(log n)
  - peek: return root — O(1)

The heap property is maintained by:
  - bubbleUp: swap with parent while smaller
  - bubbleDown: swap with smallest child while larger

Applications:
  - Priority queues
  - Heap Sort
  - Dijkstra's algorithm
  - Finding k-th smallest/largest`,
  cppCode: getCppCode('heap'),

  generateSteps(locale = 'en') {
    const steps: Step[] = []

    steps.push({
      concept: { type: 'binaryTree', nodes: [], treeType: 'heap', heapType: 'min' },
      description: d(
        locale,
        'An empty min-heap. The smallest element is always at the root.',
        'Un min-heap vacío. El elemento más pequeño siempre está en la raíz.',
      ),
      codeLine: 3,
      variables: { heapType: 'min', size: 0 },
    })

    // Insert 8
    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: heapNodes([8], { 0: 'new' }),
        treeType: 'heap',
        heapType: 'min',
        operation: 'insert(8)',
      },
      description: d(
        locale,
        'insert(8): First element, becomes the root.',
        'insert(8): Primer elemento, se convierte en la raíz.',
      ),
      codeLine: 5,
      variables: { operation: 'insert(8)', heap: '[8]' },
    })

    // Insert 5
    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: heapNodes([8, 5], { 1: 'new', 0: 'comparing' }),
        treeType: 'heap',
        heapType: 'min',
        operation: 'insert(5): bubble up?',
      },
      description: d(
        locale,
        'insert(5): Added at end. 5 < 8 (parent) → must bubble up!',
        'insert(5): Añadido al final. 5 < 8 (padre) → ¡debe subir!',
      ),
      codeLine: 12,
      variables: { operation: 'insert(5)', child: 5, parent: 8, swap: true },
    })

    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: heapNodes([5, 8], { 0: 'placed', 1: 'normal' }),
        treeType: 'heap',
        heapType: 'min',
        operation: 'insert(5): swapped!',
      },
      description: d(
        locale,
        'Swapped! 5 is now the root. Heap property restored.',
        '¡Intercambiado! 5 es ahora la raíz. Propiedad del heap restaurada.',
      ),
      codeLine: 16,
      variables: { heap: '[5, 8]' },
    })

    // Insert 10
    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: heapNodes([5, 8, 10], { 2: 'new' }),
        treeType: 'heap',
        heapType: 'min',
        operation: 'insert(10)',
      },
      description: d(
        locale,
        'insert(10): Added at end. 10 ≥ 5 (parent) → no bubble up needed.',
        'insert(10): Añadido al final. 10 ≥ 5 (padre) → no necesita subir.',
      ),
      codeLine: 6,
      variables: { operation: 'insert(10)', heap: '[5, 8, 10]' },
    })

    // Insert 1 — bubbles all the way to root
    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: heapNodes([5, 8, 10, 1], { 3: 'new', 1: 'comparing' }),
        treeType: 'heap',
        heapType: 'min',
        operation: 'insert(1): bubble up...',
      },
      description: d(
        locale,
        'insert(1): Added at end. 1 < 8 (parent) → bubble up!',
        'insert(1): Añadido al final. 1 < 8 (padre) → ¡subir!',
      ),
      codeLine: 12,
      variables: { operation: 'insert(1)', child: 1, parent: 8, swap: true },
    })

    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: heapNodes([5, 1, 10, 8], { 1: 'current', 0: 'comparing' }),
        treeType: 'heap',
        heapType: 'min',
        operation: 'insert(1): keep bubbling...',
      },
      description: d(
        locale,
        'Swapped 1 and 8. Now 1 < 5 (parent) → keep bubbling up!',
        'Intercambiados 1 y 8. Ahora 1 < 5 (padre) → ¡seguir subiendo!',
      ),
      codeLine: 16,
      variables: { child: 1, parent: 5, swap: true },
    })

    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: heapNodes([1, 5, 10, 8], { 0: 'placed' }),
        treeType: 'heap',
        heapType: 'min',
        operation: 'insert(1): done!',
      },
      description: d(
        locale,
        'Swapped 1 and 5. Now 1 is the root — the minimum! Heap property restored.',
        'Intercambiados 1 y 5. Ahora 1 es la raíz — ¡el mínimo! Propiedad del heap restaurada.',
      ),
      codeLine: 16,
      variables: { heap: '[1, 5, 10, 8]' },
    })

    // Insert 7
    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: heapNodes([1, 5, 10, 8, 7], { 4: 'new' }),
        treeType: 'heap',
        heapType: 'min',
        operation: 'insert(7)',
      },
      description: d(
        locale,
        'insert(7): Added at end. 7 ≥ 5 (parent) → stays in place.',
        'insert(7): Añadido al final. 7 ≥ 5 (padre) → se queda en su sitio.',
      ),
      codeLine: 6,
      variables: { heap: '[1, 5, 10, 8, 7]' },
    })

    // Extract min
    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: heapNodes([7, 5, 10, 8], { 0: 'current', 1: 'comparing', 2: 'comparing' }),
        treeType: 'heap',
        heapType: 'min',
        operation: 'extractMin(): removed 1, bubble down...',
      },
      description: d(
        locale,
        'extractMin(): Remove root (1), move last element (7) to root. Now bubble down — compare with children.',
        'extractMin(): Eliminar raíz (1), mover último (7) a la raíz. Ahora descender — comparar con hijos.',
      ),
      codeLine: 30,
      variables: { extracted: 1, 'root now': 7, leftChild: 5, rightChild: 10 },
    })

    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: heapNodes([5, 7, 10, 8], { 0: 'placed', 1: 'placed' }),
        treeType: 'heap',
        heapType: 'min',
        operation: 'extractMin(): done!',
      },
      description: d(
        locale,
        'Swapped 7 and 5 (smallest child). Heap property restored! New min is 5.',
        'Intercambiados 7 y 5 (hijo más pequeño). ¡Propiedad del heap restaurada! Nuevo mínimo es 5.',
      ),
      codeLine: 39,
      variables: { heap: '[5, 7, 10, 8]', min: 5 },
    })

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
//  UNION-FIND / DISJOINT SETS
// ════════════════════════════════════════════════════════════════

function dsItems(
  parents: number[],
  ranks: number[],
  states: Record<number, DisjointSetItem['state']> = {},
): DisjointSetItem[] {
  return parents.map((parent, value) => ({
    value,
    parent,
    rank: ranks[value] ?? 0,
    state: states[value] ?? 'normal',
  }))
}

export const unionFind: Algorithm = {
  id: 'union-find',
  name: 'Union-Find / Disjoint Sets',
  category: 'Data Structures',
  difficulty: 'intermediate',
  visualization: 'concept',
  code: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        if self.parent[x] != x:
            # Path compression points x directly to the root
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, a, b):
        root_a = self.find(a)
        root_b = self.find(b)

        if root_a == root_b:
            return False

        # Union by rank keeps the tree shallow
        if self.rank[root_a] < self.rank[root_b]:
            self.parent[root_a] = root_b
        elif self.rank[root_a] > self.rank[root_b]:
            self.parent[root_b] = root_a
        else:
            self.parent[root_b] = root_a
            self.rank[root_a] += 1

        return True`,
  description: `Union-Find / Disjoint Sets

Union-Find keeps track of elements split into non-overlapping sets. It answers two questions efficiently:
  - find(x): which set does x belong to?
  - union(a, b): merge the sets containing a and b

The two key optimizations are path compression and union by rank.

Path compression:
  During find(x), every node on the search path is rewired directly to the root.

Union by rank:
  Attach the shorter tree under the taller tree, keeping future finds fast.

Time Complexity:
  find:  almost O(1), amortized O(α(n))
  union: almost O(1), amortized O(α(n))

Space Complexity: O(n)

Applications:
  - Kruskal's minimum spanning tree
  - Connected components
  - Cycle detection in undirected graphs
  - Network connectivity`,
  cppCode: getCppCode('union-find'),

  generateSteps(locale = 'en') {
    const steps: Step[] = []

    steps.push({
      concept: {
        type: 'disjointSet',
        items: dsItems([0, 1, 2, 3, 4, 5], [0, 0, 0, 0, 0, 0]),
        operation: 'make_set(0..5)',
      },
      description: d(
        locale,
        'Start with six separate sets. Every item is its own parent and every rank is 0.',
        'Comenzar con seis conjuntos separados. Cada elemento es su propio padre y cada rango es 0.',
      ),
      codeLine: 3,
      variables: { parent: '[0,1,2,3,4,5]', rank: '[0,0,0,0,0,0]' },
    })

    steps.push({
      concept: {
        type: 'disjointSet',
        items: dsItems([0, 0, 2, 3, 4, 5], [1, 0, 0, 0, 0, 0], { 0: 'root', 1: 'union' }),
        operation: 'union(0, 1): equal rank → attach 1 under 0',
      },
      description: d(
        locale,
        'union(0, 1): roots have equal rank, so 1 points to 0 and rank[0] increases.',
        'union(0, 1): las raíces tienen el mismo rango, así que 1 apunta a 0 y rank[0] aumenta.',
      ),
      codeLine: 25,
      variables: { root_a: 0, root_b: 1, 'rank[0]': 1 },
    })

    steps.push({
      concept: {
        type: 'disjointSet',
        items: dsItems([0, 0, 2, 2, 4, 5], [1, 0, 1, 0, 0, 0], { 2: 'root', 3: 'union' }),
        operation: 'union(2, 3): create another set',
      },
      description: d(
        locale,
        'union(2, 3): another two-node set is formed with 2 as the root.',
        'union(2, 3): se forma otro conjunto de dos nodos con 2 como raíz.',
      ),
      codeLine: 25,
      variables: { root_a: 2, root_b: 3, 'rank[2]': 1 },
    })

    steps.push({
      concept: {
        type: 'disjointSet',
        items: dsItems([0, 0, 0, 2, 4, 5], [2, 0, 1, 0, 0, 0], {
          0: 'root',
          2: 'union',
          3: 'find',
        }),
        operation: 'union(1, 3): merge roots 0 and 2',
        path: [1, 0, 3, 2],
      },
      description: d(
        locale,
        'union(1, 3): find(1) reaches root 0 and find(3) reaches root 2. Equal rank, so 2 attaches under 0.',
        'union(1, 3): find(1) llega a raíz 0 y find(3) llega a raíz 2. Mismo rango, así que 2 se une bajo 0.',
      ),
      codeLine: 13,
      variables: { root_a: 0, root_b: 2, parent: '[0,0,0,2,4,5]' },
    })

    steps.push({
      concept: {
        type: 'disjointSet',
        items: dsItems([0, 0, 0, 0, 4, 5], [2, 0, 1, 0, 0, 0], {
          0: 'root',
          3: 'compressed',
        }),
        operation: 'find(3): path compression',
        path: [3, 2, 0],
      },
      description: d(
        locale,
        'find(3): 3 used to point to 2, and 2 points to 0. Path compression rewires 3 directly to 0.',
        'find(3): 3 apuntaba a 2 y 2 apunta a 0. La compresión de camino conecta 3 directamente a 0.',
      ),
      codeLine: 9,
      variables: { x: 3, root: 0, parent: '[0,0,0,0,4,5]' },
    })

    steps.push({
      concept: {
        type: 'disjointSet',
        items: dsItems([0, 0, 0, 0, 4, 4], [2, 0, 1, 0, 1, 0], { 4: 'root', 5: 'union' }),
        operation: 'union(4, 5)',
      },
      description: d(
        locale,
        'union(4, 5): creates a second component. We can now ask whether any two nodes share a root.',
        'union(4, 5): crea un segundo componente. Ahora podemos preguntar si dos nodos comparten raíz.',
      ),
      codeLine: 25,
      variables: { connected_0_3: true, connected_0_5: false },
    })

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
//  RED-BLACK TREE
// ════════════════════════════════════════════════════════════════

function rbNodes(
  values: (number | null)[],
  colors: Record<number, RedBlackTreeNodeData['color']>,
  states: Record<number, RedBlackTreeNodeData['state']> = {},
): (RedBlackTreeNodeData | null)[] {
  return values.map((value, idx) =>
    value == null
      ? null
      : {
          value,
          color: colors[idx] ?? 'black',
          state: states[idx] ?? 'normal',
        },
  )
}

export const redBlackTree: Algorithm = {
  id: 'red-black-tree',
  name: 'Red-Black Tree',
  category: 'Data Structures',
  difficulty: 'advanced',
  visualization: 'concept',
  code: `RED = "red"
BLACK = "black"

class Node:
    def __init__(self, value):
        self.value = value
        self.color = RED
        self.left = self.right = self.parent = None

def insert(root, value):
    node = bst_insert(root, Node(value))
    fix_insert(node)
    return root

def fix_insert(node):
    while node.parent and node.parent.color == RED:
        parent = node.parent
        grandparent = parent.parent

        if parent == grandparent.left:
            uncle = grandparent.right
            if uncle and uncle.color == RED:
                parent.color = BLACK
                uncle.color = BLACK
                grandparent.color = RED
                node = grandparent
            else:
                if node == parent.right:
                    node = parent
                    rotate_left(node)
                parent.color = BLACK
                grandparent.color = RED
                rotate_right(grandparent)
        else:
            # symmetric cases
            pass

    root.color = BLACK`,
  description: `Red-Black Tree

A Red-Black Tree is a self-balancing binary search tree. It stores one extra bit of information per node: red or black.

Rules:
  1. Every node is red or black
  2. The root is black
  3. NIL leaves are black
  4. Red nodes cannot have red children
  5. Every path from a node to descendant NIL leaves has the same black height

Insertion starts like a normal BST insertion. New nodes are inserted red, then fix_insert restores the rules with recoloring and rotations.

Time Complexity:
  Search: O(log n)
  Insert: O(log n)
  Delete: O(log n)

Space Complexity: O(n)

Red-Black Trees are used in ordered maps/sets because they keep operations logarithmic while avoiding excessive rotations.`,
  cppCode: getCppCode('red-black-tree'),

  generateSteps(locale = 'en') {
    const steps: Step[] = []

    steps.push({
      concept: {
        type: 'redBlackTree',
        nodes: rbNodes([10], { 0: 'black' }, { 0: 'placed' }),
        operation: 'insert(10): root is always black',
      },
      description: d(
        locale,
        'Insert 10. A Red-Black Tree always forces the root to black.',
        'Insertar 10. Un árbol Red-Black siempre fuerza la raíz a negro.',
      ),
      codeLine: 38,
      variables: { root: 10, color: 'black' },
    })

    steps.push({
      concept: {
        type: 'redBlackTree',
        nodes: rbNodes([10, 5], { 0: 'black', 1: 'red' }, { 1: 'new' }),
        operation: 'insert(5): new nodes start red',
      },
      description: d(
        locale,
        'Insert 5 as a red child. Parent is black, so no rule is broken.',
        'Insertar 5 como hijo rojo. El padre es negro, así que no se rompe ninguna regla.',
      ),
      codeLine: 7,
      variables: { inserted: 5, parent: 10, violation: false },
    })

    steps.push({
      concept: {
        type: 'redBlackTree',
        nodes: rbNodes([10, 5, 15], { 0: 'black', 1: 'red', 2: 'red' }, { 2: 'new' }),
        operation: 'insert(15): red child of black root',
      },
      description: d(
        locale,
        'Insert 15. Red children under a black parent are allowed.',
        'Insertar 15. Los hijos rojos bajo un padre negro están permitidos.',
      ),
      codeLine: 7,
      variables: { inserted: 15, parent: 10, violation: false },
    })

    steps.push({
      concept: {
        type: 'redBlackTree',
        nodes: rbNodes(
          [10, 5, 15, 1],
          { 0: 'black', 1: 'red', 2: 'red', 3: 'red' },
          {
            1: 'current',
            2: 'current',
            3: 'new',
          },
        ),
        operation: 'insert(1): red parent + red uncle',
      },
      description: d(
        locale,
        'Insert 1. Parent 5 is red and uncle 15 is red, so we recolor parent and uncle black, grandparent red.',
        'Insertar 1. El padre 5 y el tío 15 son rojos, así que se recolorean a negro y el abuelo a rojo.',
      ),
      codeLine: 22,
      variables: { parent: 5, uncle: 15, grandparent: 10, case: 'recolor' },
    })

    steps.push({
      concept: {
        type: 'redBlackTree',
        nodes: rbNodes(
          [10, 5, 15, 1],
          { 0: 'black', 1: 'black', 2: 'black', 3: 'red' },
          {
            0: 'recolor',
            1: 'recolor',
            2: 'recolor',
          },
        ),
        operation: 'recolor and force root black',
      },
      description: d(
        locale,
        'After recoloring, the root is set back to black. Black height is preserved.',
        'Después de recolorear, la raíz vuelve a negro. La altura negra se conserva.',
      ),
      codeLine: 38,
      variables: { root: 'black', blackHeight: 'balanced' },
    })

    steps.push({
      concept: {
        type: 'redBlackTree',
        nodes: rbNodes(
          [10, 5, 15, 1, 7, null, null, null, null, 6],
          {
            0: 'black',
            1: 'black',
            2: 'black',
            3: 'red',
            4: 'red',
            9: 'red',
          },
          {
            4: 'current',
            9: 'new',
          },
        ),
        operation: 'insert(6): triangle case',
      },
      description: d(
        locale,
        'Insert 6 creates a triangle under node 7. First rotate left at parent to turn it into a line.',
        'Insertar 6 crea un triángulo bajo 7. Primero rotar a la izquierda en el padre para convertirlo en línea.',
      ),
      codeLine: 29,
      variables: { case: 'left-right', action: 'rotate_left(parent)' },
    })

    steps.push({
      concept: {
        type: 'redBlackTree',
        nodes: rbNodes(
          [10, 6, 15, 5, 7, null, null, 1],
          {
            0: 'black',
            1: 'black',
            2: 'black',
            3: 'red',
            4: 'red',
            7: 'red',
          },
          {
            0: 'rotating',
            1: 'placed',
          },
        ),
        operation: 'rotate right at grandparent',
      },
      description: d(
        locale,
        'Then recolor and rotate right at the grandparent. The tree is balanced again with all Red-Black rules restored.',
        'Luego recolorear y rotar a la derecha en el abuelo. El árbol queda balanceado con todas las reglas restauradas.',
      ),
      codeLine: 33,
      variables: { action: 'rotate_right(grandparent)', balanced: true },
    })

    return steps
  },
}
