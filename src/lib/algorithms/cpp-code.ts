const commonHeaders = `#include <algorithm>
#include <cmath>
#include <functional>
#include <iostream>
#include <queue>
#include <stack>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <vector>
using namespace std;
`

export const CPP_CODE: Record<string, string> = {
  'big-o-notation': `${commonHeaders}
int constant_time(const vector<int>& values) {
    return values.empty() ? -1 : values[0];
}

int linear_time(const vector<int>& values) {
    int total = 0;
    for (int value : values) {
        total += value;
    }
    return total;
}

int quadratic_time(const vector<int>& values) {
    int pairs = 0;
    for (int a : values) {
        for (int b : values) {
            if (a < b) pairs++;
        }
    }
    return pairs;
}`,

  recursion: `${commonHeaders}
int factorial(int n) {
    if (n <= 1) {
        return 1;
    }

    return n * factorial(n - 1);
}`,

  'two-pointers': `${commonHeaders}
vector<int> two_sum_sorted(const vector<int>& arr, int target) {
    int left = 0;
    int right = (int)arr.size() - 1;

    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) return {left, right};
        if (sum < target) {
            left++;
        } else {
            right--;
        }
    }

    return {};
}`,

  'sliding-window': `${commonHeaders}
int longest_unique_substring(const string& s) {
    unordered_map<char, int> last_seen;
    int start = 0;
    int best = 0;

    for (int end = 0; end < (int)s.size(); end++) {
        char ch = s[end];
        if (last_seen.count(ch) && last_seen[ch] >= start) {
            start = last_seen[ch] + 1;
        }
        last_seen[ch] = end;
        best = max(best, end - start + 1);
    }

    return best;
}`,

  'space-complexity': `${commonHeaders}
void swap_in_place(vector<int>& values, int i, int j) {
    int temp = values[i];
    values[i] = values[j];
    values[j] = temp;
}

vector<int> copy_array(const vector<int>& values) {
    vector<int> copy;
    for (int value : values) {
        copy.push_back(value);
    }
    return copy;
}`,

  'worst-case-analysis': `${commonHeaders}
vector<int> quicksort_bad_case(vector<int> array) {
    if (array.size() <= 1) return array;

    int pivot = array.back();
    vector<int> left;
    vector<int> right;

    for (int i = 0; i < (int)array.size() - 1; i++) {
        if (array[i] < pivot) left.push_back(array[i]);
        else right.push_back(array[i]);
    }

    left = quicksort_bad_case(left);
    right = quicksort_bad_case(right);
    left.push_back(pivot);
    left.insert(left.end(), right.begin(), right.end());
    return left;
}`,

  memoization: `${commonHeaders}
int fibonacci_memo(int n, unordered_map<int, int>& memo) {
    if (n <= 1) return n;
    if (memo.count(n)) return memo[n];

    memo[n] = fibonacci_memo(n - 1, memo) + fibonacci_memo(n - 2, memo);
    return memo[n];
}`,

  'greedy-vs-dp': `${commonHeaders}
vector<int> greedy_change(vector<int> coins, int amount) {
    sort(coins.rbegin(), coins.rend());
    vector<int> result;

    for (int coin : coins) {
        while (amount >= coin) {
            result.push_back(coin);
            amount -= coin;
        }
    }

    return amount == 0 ? result : vector<int>{};
}`,

  stack: `${commonHeaders}
class Stack {
public:
    void push(int value) {
        items.push_back(value);
    }

    int pop() {
        int value = items.back();
        items.pop_back();
        return value;
    }

    int peek() const {
        return items.back();
    }

private:
    vector<int> items;
};`,

  queue: `${commonHeaders}
class SimpleQueue {
public:
    void enqueue(int value) {
        items.push(value);
    }

    int dequeue() {
        int value = items.front();
        items.pop();
        return value;
    }

private:
    queue<int> items;
};`,

  'linked-list': `${commonHeaders}
struct Node {
    int value;
    Node* next;
    Node(int v) : value(v), next(nullptr) {}
};

void insert_front(Node*& head, int value) {
    Node* node = new Node(value);
    node->next = head;
    head = node;
}

bool contains(Node* head, int target) {
    while (head != nullptr) {
        if (head->value == target) return true;
        head = head->next;
    }
    return false;
}`,

  'hash-table': `${commonHeaders}
class HashTable {
public:
    void put(const string& key, int value) {
        table[key] = value;
    }

    int get(const string& key) const {
        return table.at(key);
    }

    bool contains(const string& key) const {
        return table.count(key) > 0;
    }

private:
    unordered_map<string, int> table;
};`,

  'binary-search-tree': `${commonHeaders}
struct BSTNode {
    int value;
    BSTNode* left;
    BSTNode* right;
    BSTNode(int v) : value(v), left(nullptr), right(nullptr) {}
};

BSTNode* insert(BSTNode* root, int value) {
    if (root == nullptr) return new BSTNode(value);
    if (value < root->value) root->left = insert(root->left, value);
    else root->right = insert(root->right, value);
    return root;
}`,

  heap: `${commonHeaders}
class MinHeap {
public:
    void push(int value) {
        data.push_back(value);
        push_heap(data.begin(), data.end(), greater<int>());
    }

    int pop() {
        pop_heap(data.begin(), data.end(), greater<int>());
        int value = data.back();
        data.pop_back();
        return value;
    }

private:
    vector<int> data;
};`,

  'union-find': `${commonHeaders}
class UnionFind {
public:
    UnionFind(int n) : parent(n), rank(n, 0) {
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    void unite(int a, int b) {
        int root_a = find(a);
        int root_b = find(b);
        if (root_a == root_b) return;

        if (rank[root_a] < rank[root_b]) swap(root_a, root_b);
        parent[root_b] = root_a;
        if (rank[root_a] == rank[root_b]) rank[root_a]++;
    }

private:
    vector<int> parent;
    vector<int> rank;
};`,

  'red-black-tree': `${commonHeaders}
enum Color { RED, BLACK };

struct RBNode {
    int value;
    Color color;
    RBNode* left;
    RBNode* right;
    RBNode(int v) : value(v), color(RED), left(nullptr), right(nullptr) {}
};

// Real red-black trees rebalance with rotations and recoloring.
// This compact insert shows the search-tree placement step.
RBNode* bst_insert(RBNode* root, int value) {
    if (root == nullptr) return new RBNode(value);
    if (value < root->value) root->left = bst_insert(root->left, value);
    else root->right = bst_insert(root->right, value);
    return root;
}`,

  'bubble-sort': `${commonHeaders}
void bubble_sort(vector<int>& array) {
    int n = array.size();
    for (int pass = 0; pass < n - 1; pass++) {
        for (int i = 0; i < n - pass - 1; i++) {
            if (array[i] > array[i + 1]) {
                swap(array[i], array[i + 1]);
            }
        }
    }
}`,

  'selection-sort': `${commonHeaders}
void selection_sort(vector<int>& array) {
    for (int i = 0; i < (int)array.size(); i++) {
        int min_index = i;
        for (int j = i + 1; j < (int)array.size(); j++) {
            if (array[j] < array[min_index]) min_index = j;
        }
        swap(array[i], array[min_index]);
    }
}`,

  'insertion-sort': `${commonHeaders}
void insertion_sort(vector<int>& array) {
    for (int i = 1; i < (int)array.size(); i++) {
        int key = array[i];
        int j = i - 1;
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            j--;
        }
        array[j + 1] = key;
    }
}`,

  'quick-sort': `${commonHeaders}
int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            swap(arr[i], arr[j]);
            i++;
        }
    }
    swap(arr[i], arr[high]);
    return i;
}

void quick_sort(vector<int>& arr, int low, int high) {
    if (low >= high) return;
    int pivot_index = partition(arr, low, high);
    quick_sort(arr, low, pivot_index - 1);
    quick_sort(arr, pivot_index + 1, high);
}`,

  'merge-sort': `${commonHeaders}
void merge_sort(vector<int>& arr) {
    if (arr.size() <= 1) return;

    int mid = arr.size() / 2;
    vector<int> left(arr.begin(), arr.begin() + mid);
    vector<int> right(arr.begin() + mid, arr.end());
    merge_sort(left);
    merge_sort(right);

    merge(left.begin(), left.end(), right.begin(), right.end(), arr.begin());
}`,

  'heap-sort': `${commonHeaders}
void heap_sort(vector<int>& array) {
    make_heap(array.begin(), array.end());
    for (auto end = array.end(); end != array.begin(); --end) {
        pop_heap(array.begin(), end);
    }
}`,

  'counting-sort': `${commonHeaders}
vector<int> counting_sort(const vector<int>& array) {
    int max_value = *max_element(array.begin(), array.end());
    vector<int> count(max_value + 1, 0);
    for (int value : array) count[value]++;

    vector<int> output;
    for (int value = 0; value <= max_value; value++) {
        while (count[value]-- > 0) output.push_back(value);
    }
    return output;
}`,

  'radix-sort': `${commonHeaders}
void radix_sort(vector<int>& array) {
    int max_value = *max_element(array.begin(), array.end());
    for (int exp = 1; max_value / exp > 0; exp *= 10) {
        stable_sort(array.begin(), array.end(), [exp](int a, int b) {
            return (a / exp) % 10 < (b / exp) % 10;
        });
    }
}`,

  'shell-sort': `${commonHeaders}
void shell_sort(vector<int>& array) {
    for (int gap = array.size() / 2; gap > 0; gap /= 2) {
        for (int i = gap; i < (int)array.size(); i++) {
            int temp = array[i];
            int j = i;
            while (j >= gap && array[j - gap] > temp) {
                array[j] = array[j - gap];
                j -= gap;
            }
            array[j] = temp;
        }
    }
}`,

  'bucket-sort': `${commonHeaders}
void bucket_sort(vector<int>& array, int bucket_size = 5) {
    int min_value = *min_element(array.begin(), array.end());
    int max_value = *max_element(array.begin(), array.end());
    int bucket_count = (max_value - min_value) / bucket_size + 1;
    vector<vector<int>> buckets(bucket_count);

    for (int value : array) {
        buckets[(value - min_value) / bucket_size].push_back(value);
    }

    array.clear();
    for (auto& bucket : buckets) {
        sort(bucket.begin(), bucket.end());
        array.insert(array.end(), bucket.begin(), bucket.end());
    }
}`,

  'binary-search': `${commonHeaders}
int binary_search_index(const vector<int>& array, int target) {
    int low = 0;
    int high = (int)array.size() - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (array[mid] == target) return mid;
        if (array[mid] < target) low = mid + 1;
        else high = mid - 1;
    }

    return -1;
}`,

  'linear-search': `${commonHeaders}
int linear_search(const vector<int>& array, int target) {
    for (int i = 0; i < (int)array.size(); i++) {
        if (array[i] == target) return i;
    }
    return -1;
}`,

  'jump-search': `${commonHeaders}
int jump_search(const vector<int>& array, int target) {
    int n = array.size();
    int step = max(1, (int)sqrt(n));
    int prev = 0;

    while (prev < n && array[min(step, n) - 1] < target) {
        prev = step;
        step += max(1, (int)sqrt(n));
    }

    for (int i = prev; i < min(step, n); i++) {
        if (array[i] == target) return i;
    }
    return -1;
}`,

  'interpolation-search': `${commonHeaders}
int interpolation_search(const vector<int>& array, int target) {
    int low = 0;
    int high = (int)array.size() - 1;

    while (low <= high && target >= array[low] && target <= array[high]) {
        if (array[low] == array[high]) return array[low] == target ? low : -1;
        int pos = low + (target - array[low]) * (high - low) / (array[high] - array[low]);
        if (array[pos] == target) return pos;
        if (array[pos] < target) low = pos + 1;
        else high = pos - 1;
    }

    return -1;
}`,

  quickselect: `${commonHeaders}
int quickselect(vector<int>& array, int k) {
    int left = 0;
    int right = (int)array.size() - 1;

    while (left <= right) {
        int pivot = array[right];
        int store = left;
        for (int i = left; i < right; i++) {
            if (array[i] < pivot) swap(array[store++], array[i]);
        }
        swap(array[store], array[right]);
        if (store == k) return array[store];
        if (store < k) left = store + 1;
        else right = store - 1;
    }

    return -1;
}`,

  bfs: `${commonHeaders}
vector<int> bfs(const vector<vector<int>>& graph, int start) {
    vector<int> order;
    vector<bool> visited(graph.size(), false);
    queue<int> q;
    q.push(start);
    visited[start] = true;

    while (!q.empty()) {
        int node = q.front();
        q.pop();
        order.push_back(node);
        for (int next : graph[node]) {
            if (!visited[next]) {
                visited[next] = true;
                q.push(next);
            }
        }
    }
    return order;
}`,

  dfs: `${commonHeaders}
void dfs_visit(const vector<vector<int>>& graph, int node, vector<bool>& visited, vector<int>& order) {
    visited[node] = true;
    order.push_back(node);
    for (int next : graph[node]) {
        if (!visited[next]) dfs_visit(graph, next, visited, order);
    }
}`,

  dijkstra: `${commonHeaders}
vector<int> dijkstra(const vector<vector<pair<int, int>>>& graph, int start) {
    const int INF = 1e9;
    vector<int> dist(graph.size(), INF);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    dist[start] = 0;
    pq.push({0, start});

    while (!pq.empty()) {
        auto [cost, node] = pq.top();
        pq.pop();
        if (cost != dist[node]) continue;
        for (auto [next, weight] : graph[node]) {
            if (cost + weight < dist[next]) {
                dist[next] = cost + weight;
                pq.push({dist[next], next});
            }
        }
    }
    return dist;
}`,

  prim: `${commonHeaders}
int prim_mst(const vector<vector<pair<int, int>>>& graph, int start) {
    vector<bool> used(graph.size(), false);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    pq.push({0, start});
    int total = 0;

    while (!pq.empty()) {
        auto [weight, node] = pq.top();
        pq.pop();
        if (used[node]) continue;
        used[node] = true;
        total += weight;
        for (auto [next, edge_weight] : graph[node]) {
            if (!used[next]) pq.push({edge_weight, next});
        }
    }
    return total;
}`,

  'kruskal-mst': `${commonHeaders}
class UnionFind {
public:
    UnionFind(int n) : parent(n), rank(n, 0) {
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    void unite(int a, int b) {
        int root_a = find(a);
        int root_b = find(b);
        if (root_a == root_b) return;
        if (rank[root_a] < rank[root_b]) swap(root_a, root_b);
        parent[root_b] = root_a;
        if (rank[root_a] == rank[root_b]) rank[root_a]++;
    }

private:
    vector<int> parent;
    vector<int> rank;
};

struct Edge {
    int weight;
    int from;
    int to;
};

int kruskal(int vertices, vector<Edge> edges) {
    sort(edges.begin(), edges.end(), [](Edge a, Edge b) { return a.weight < b.weight; });
    UnionFind uf(vertices);
    int total = 0;
    for (Edge edge : edges) {
        if (uf.find(edge.from) != uf.find(edge.to)) {
            uf.unite(edge.from, edge.to);
            total += edge.weight;
        }
    }
    return total;
}`,

  'topological-sort': `${commonHeaders}
vector<int> topological_sort(const vector<vector<int>>& graph) {
    vector<int> indegree(graph.size(), 0);
    for (auto edges : graph) {
        for (int next : edges) indegree[next]++;
    }

    queue<int> q;
    for (int i = 0; i < (int)indegree.size(); i++) {
        if (indegree[i] == 0) q.push(i);
    }

    vector<int> order;
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        order.push_back(node);
        for (int next : graph[node]) {
            if (--indegree[next] == 0) q.push(next);
        }
    }
    return order;
}`,

  'fibonacci-dp': `${commonHeaders}
int fibonacci(int n) {
    if (n <= 1) return n;
    vector<int> dp(n + 1);
    dp[0] = 0;
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}`,

  knapsack: `${commonHeaders}
int knapsack(const vector<int>& weights, const vector<int>& values, int capacity) {
    vector<int> dp(capacity + 1, 0);
    for (int i = 0; i < (int)weights.size(); i++) {
        for (int c = capacity; c >= weights[i]; c--) {
            dp[c] = max(dp[c], dp[c - weights[i]] + values[i]);
        }
    }
    return dp[capacity];
}`,

  lcs: `${commonHeaders}
int lcs(const string& a, const string& b) {
    vector<vector<int>> dp(a.size() + 1, vector<int>(b.size() + 1, 0));
    for (int i = 1; i <= (int)a.size(); i++) {
        for (int j = 1; j <= (int)b.size(); j++) {
            if (a[i - 1] == b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[a.size()][b.size()];
}`,

  'n-queens': `${commonHeaders}
bool is_safe(const vector<int>& queens, int row, int col) {
    for (int r = 0; r < row; r++) {
        int c = queens[r];
        if (c == col || abs(c - col) == row - r) return false;
    }
    return true;
}

bool solve_n_queens(int n, int row, vector<int>& queens) {
    if (row == n) return true;
    for (int col = 0; col < n; col++) {
        if (is_safe(queens, row, col)) {
            queens[row] = col;
            if (solve_n_queens(n, row + 1, queens)) return true;
        }
    }
    return false;
}`,

  'sudoku-solver': `${commonHeaders}
bool solve_sudoku(vector<vector<int>>& board) {
    for (int r = 0; r < 9; r++) {
        for (int c = 0; c < 9; c++) {
            if (board[r][c] != 0) continue;
            for (int value = 1; value <= 9; value++) {
                board[r][c] = value;
                if (solve_sudoku(board)) return true;
            }
            board[r][c] = 0;
            return false;
        }
    }
    return true;
}`,

  'maze-pathfinding': `${commonHeaders}
bool maze_bfs(const vector<vector<int>>& maze, pair<int, int> start, pair<int, int> end) {
    int rows = maze.size();
    int cols = maze[0].size();
    vector<vector<bool>> visited(rows, vector<bool>(cols, false));
    queue<pair<int, int>> q;
    q.push(start);
    visited[start.first][start.second] = true;

    vector<pair<int, int>> dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    while (!q.empty()) {
        auto [r, c] = q.front();
        q.pop();
        if (make_pair(r, c) == end) return true;
        for (auto [dr, dc] : dirs) {
            int nr = r + dr;
            int nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && maze[nr][nc] == 0 && !visited[nr][nc]) {
                visited[nr][nc] = true;
                q.push({nr, nc});
            }
        }
    }
    return false;
}`,

  'tower-of-hanoi': `${commonHeaders}
void hanoi(int n, char source, char target, char auxiliary) {
    if (n == 0) return;
    hanoi(n - 1, source, auxiliary, target);
    cout << "Move disk " << n << " from " << source << " to " << target << endl;
    hanoi(n - 1, auxiliary, target, source);
}`,

  'sieve-of-eratosthenes': `${commonHeaders}
vector<int> sieve_of_eratosthenes(int n) {
    vector<bool> is_prime(n + 1, true);
    is_prime[0] = is_prime[1] = false;

    for (int p = 2; p * p <= n; p++) {
        if (!is_prime[p]) continue;
        for (int multiple = p * p; multiple <= n; multiple += p) {
            is_prime[multiple] = false;
        }
    }

    vector<int> primes;
    for (int i = 2; i <= n; i++) {
        if (is_prime[i]) primes.push_back(i);
    }
    return primes;
}`,
}

export function getCppCode(id: string): string {
  return (
    CPP_CODE[id] ??
    `${commonHeaders}
// C++ version coming soon for this algorithm.
// The Python version is still available in the Python tab.`
  )
}
