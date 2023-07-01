<script lang="ts">
	import { cva } from 'class-variance-authority';
	import type { VariantProps } from 'class-variance-authority';
	import { twMerge } from 'tailwind-merge';

	const button = cva('flex flex-row items-center rounded', {
		variants: {
			size: {
				small: 'text-xs px-2 py-1',
				medium: 'text-base px-3 py-1',
				large: 'text-lg px-5 py-1.5'
			},
			emphasis: {
				high: 'bg-blue-500 hover:bg-blue-600 text-white',
				medium: 'bg-zinc-700 hover:bg-zinc-800 text-white',
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

<button {type} class={twMerge(button({ size, emphasis }), classNames)} on:click|stopPropagation {...$$restProps}>
	<slot />
</button>
