<script lang="ts">
	import { cva } from 'class-variance-authority';
	import type { VariantProps } from 'class-variance-authority';
	import { twMerge } from 'tailwind-merge';

	const button = cva('flex flex-row items-center rounded', {
		variants: {
			size: {
				small: 'text-sm px-1 py-0.5',
				medium: 'text-base px-2 py-1',
				large: 'text-lg px-3 py-2'
			},
			emphasis: {
				high: 'bg-blue-500 text-white',
				medium: 'bg-zinc-700 text-white',
				low: 'bg-transparent text-white border border-white'
			}
		},
		defaultVariants: {
			size: 'medium',
			emphasis: 'medium'
		}
	});

	type buttonProps = VariantProps<typeof button>;

	export let type: 'button' | 'reset' | 'submit' = 'button';
	export let size: buttonProps['size'] = 'medium';
	export let emphasis: buttonProps['emphasis'] = 'medium';
	let classNames: string = '';
	export { classNames as class };
</script>

<button {type} class={twMerge(button({ size, emphasis }), classNames)} on:click|self|stopPropagation {...$$restProps}>
	<slot />
</button>
