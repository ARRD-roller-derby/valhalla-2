import { counter, setCounter } from "./counter.store";

export default function Counter() {
  return (
    <div>
      <button onClick={() => setCounter("count", (c) => c + 1)}>Increment</button>
      <button onClick={() => setCounter("count", (c) => c - 1)}>Decrement</button>
      <p>Count: {counter.count}</p>
    </div>
  );
}