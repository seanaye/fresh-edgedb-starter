/** @jsx h */
import { h, ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";

interface CounterProps {
  start: number;
  name: string
}

export default function CounterInput(props: CounterProps) {
  const [count, setCount] = useState(props.start);
  const btn = tw`px-2 py-1 border(gray-100 1) hover:bg-gray-200`;
  return (
    <div class={tw`flex gap-2 w-full`}>
      <p class={tw`flex-grow-1 font-bold text-xl`}>{count}</p>
      <button
        class={btn}
        type="button"
        onClick={() => setCount(count - 1)}
        disabled={!IS_BROWSER}
      >
        -1
      </button>
      <button
        class={btn}
        type="button"
        onClick={() => setCount(count + 1)}
        disabled={!IS_BROWSER}
      >
        +1
      </button>
      <input name={props.name} class={tw`hidden`} value={count} />
    </div>
  );
}
