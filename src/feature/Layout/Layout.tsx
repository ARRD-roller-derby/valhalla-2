import type { JSX } from "solid-js";

type LayoutProps = {
  children: JSX.Element
}

export function Layout(props: LayoutProps): JSX.Element {

  return (
    <div class="flex flex-col min-h-screen bg-bg text-text">
      <main class="flex-1">
        {props.children}
      </main>
    </div >
  )
}