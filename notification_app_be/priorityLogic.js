class MinHeap {
  constructor() {
    this.heap = [];
  }

  getPriorityScore(type) {
    switch (type?.toLowerCase()) {
      case 'placement': return 3;
      case 'result': return 2;
      case 'event': return 1;
      default: return 0;
    }
  }

  // Returns positive if a > b (a is higher priority)
  compare(a, b) {
    const scoreA = this.getPriorityScore(a.notification_type || a.type || a.Type);
    const scoreB = this.getPriorityScore(b.notification_type || b.type || b.Type);

    if (scoreA !== scoreB) {
      return scoreA - scoreB; 
    }

    const timeA = new Date(a.timestamp || a.created_at || a.Timestamp).getTime();
    const timeB = new Date(b.timestamp || b.created_at || b.Timestamp).getTime();
    return timeA - timeB;
  }

  push(val) {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.bubbleDown(0);
    return min;
  }

  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  size() {
    return this.heap.length;
  }

  bubbleUp(index) {
    while (index > 0) {
      const parentIdx = Math.floor((index - 1) / 2);
      if (this.compare(this.heap[index], this.heap[parentIdx]) >= 0) break;
      
      const temp = this.heap[index];
      this.heap[index] = this.heap[parentIdx];
      this.heap[parentIdx] = temp;
      
      index = parentIdx;
    }
  }

  bubbleDown(index) {
    const length = this.heap.length;
    while (true) {
      let leftChildIdx = 2 * index + 1;
      let rightChildIdx = 2 * index + 2;
      let smallest = index;

      if (leftChildIdx < length && this.compare(this.heap[leftChildIdx], this.heap[smallest]) < 0) {
        smallest = leftChildIdx;
      }
      if (rightChildIdx < length && this.compare(this.heap[rightChildIdx], this.heap[smallest]) < 0) {
        smallest = rightChildIdx;
      }

      if (smallest === index) break;

      const temp = this.heap[index];
      this.heap[index] = this.heap[smallest];
      this.heap[smallest] = temp;
      
      index = smallest;
    }
  }
}

const getTopNNotifications = (notifications, n = 5) => {
  if (!notifications || notifications.length === 0) return [];
  
  const minHeap = new MinHeap();
  
  for (const notif of notifications) {
    minHeap.push(notif);
    if (minHeap.size() > n) {
      minHeap.pop();
    }
  }

  // The heap contains top N, but they are in min-heap order (lowest priority of the top N at the root)
  // We want to return them in descending order (highest priority first)
  const result = [];
  while (minHeap.size() > 0) {
    result.push(minHeap.pop());
  }
  
  return result.reverse();
};

module.exports = { getTopNNotifications };
