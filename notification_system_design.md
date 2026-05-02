# Campus Notifications System Design

## Approach & Architecture
The system consists of a unified full-stack architecture separated into distinct environments:
- **Backend (notification_app_be)**: A light Express API wrapper that acts as an intermediary. It fetches payloads securely from the `evaluation-service`, integrates seamlessly with our telemetry logger, and executes computationally intensive algorithms offloading the client.
- **Frontend (notification_app_fe)**: A React Single Page Application (SPA) utilizing Material UI for responsive, component-driven layouts. It communicates exclusively with our backend API wrapper.
- **Logging Middleware (logging_middleware)**: A centralized, framework-agnostic component handling observability and diagnostics for both frontend and backend events via strict schema validation.

## Stage 1 Priority Logic: Data Structures (Min-Heap)
To fulfill the priority sorting optimally:
1. **Weights Assignment**: Placement (3) > Result (2) > Event (1).
2. **Tiebreaker**: For identical categories, newer timestamps are scored higher.
3. **Data Structure Strategy**: Instead of sorting the entire array `O(N log N)`, we maintain a continuous stream using a **Min-Heap (Priority Queue) limited to size K (Top N)**.

### Handling Continuous Stream & Time Complexity
When dealing with massive or continuous data streams, inserting into a bounded Min-Heap is highly efficient. 
- **Time Complexity**: Inserting an element into the heap is `O(log K)`. Iterating through `N` stream elements results in `O(N log K)` where `K` is our limited "Top N" parameter. This is vastly superior to `O(N log N)`.
- **Scalability**: By bounding the heap to size `K`, the spatial overhead is strictly `O(K)` memory. The backend effortlessly discards irrelevant objects during traversal rather than caching them.

## Logging Design
The logging design relies on strict, fail-safe validations:
- **Constraints Validation**: Automatically filters packages mapped to execution boundaries (`frontend` vs `backend`). 
- **Error Boundaries**: Uses `try/catch` silently masking standard `console.log` overrides, guaranteeing telemetry tracking without standard stdout/stderr clutter. It logs application startup, fetches, component mutations, and errors consistently.

## API Flow
1. **Client** navigates to `Priority Page`.
2. **Frontend** issues a request: `GET /api/priority-notifications?n=5`.
3. **Backend** contacts the evaluation-service, maps the JSON payload dynamically into the Min-Heap, extracts the exact Top 5 items, tracks completion in the Logger, and routes it back.
4. **Error Handling**: Missing tokens, network closures, or malformed data trigger 500 error boundaries and alert the user gracefully with visual fallbacks, simultaneously dispatching a `"fatal" | "error"` log constraint asynchronously.
