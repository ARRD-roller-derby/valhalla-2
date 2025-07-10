import { createStore } from "solid-js/store";

type Counter = {
  count: number;
  increment: () => void;
  decrement: () => void;
};

export const [counter, setCounter] = createStore<Counter>({
  count: 0,
  increment: () => setCounter("count", (c) => c + 1),
  decrement: () => setCounter("count", (c) => c - 1),
});