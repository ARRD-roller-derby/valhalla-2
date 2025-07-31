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

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
      <p>Count: {counter.count}</p>
      <Counter />
      <AuthButton />
    </div>

  );
};

export default Home;
