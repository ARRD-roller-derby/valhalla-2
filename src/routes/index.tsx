import { type VoidComponent, onMount } from "solid-js";
import Counter from "~/feature/Counter";
import { counter } from "~/feature/counter.store";
import { AuthButton } from "~/feature/AuthButton/AuthButton";

const Home: VoidComponent = () => {
  onMount(async () => {
    const rest = await fetch('/api/badges')
    const data = await rest.json()
    console.log('data', data)
  });

  return (
    <main class="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#026d56] to-[#152a2c]">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
        <p>Count: {counter.count}</p>
        <Counter />
        <AuthButton />
      </div>
    </main>
  );
};

export default Home;
