class QElement {
  constructor(element, priority) {
    this.element = element;
    this.priority = priority;
  }
}

// PriorityQueue class
class PriorityQueue {

  // An array is used to implement priority
  constructor() {
    this.items = [];
  }

  // enqueueElement function to add element to the queue as per priority
  enqueueElement(element, priority) {
    // creating object from queue element
    const qElement = new QElement(element, priority);
    let contain = false;

    // iterating through the entire item array to add element at the correct location of the Queue
    let i = 0;
    while (i < this.items.length) {
      if (this.items[i].priority >= qElement.priority) {
        // Once the correct location is found it is enqueued
        this.items.splice(i, 0, qElement);
        contain = true;
        break;
      }
      i += 1;
    }

    // if the element have the highest priority it is added at the end of the queue
    if (!contain) this.items.push(qElement);
  }

  // dequeueElement method to remove element from the queue
  dequeueElement() {
    // return the dequeued element and remove it.
    // if the queue is empty returns Underflow
    return (this.items.length) ? this.items[0] : null;
  }

  // shiftElement method to remove element from the queue
  shiftElement() {
    // return the dequeued element and remove it.
    // if the queue is empty returns Underflow
    return (this.items.length) ? this.items.shift() : null;
  }
}

module.exports = PriorityQueue;
