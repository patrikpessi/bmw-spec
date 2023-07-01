<script lang="ts">
	import { cva } from 'class-variance-authority';
	import type { VariantProps } from 'class-variance-authority';
	import { twMerge } from 'tailwind-merge';

	const input = cva('flex flex-row items-center rounded bg-zinc-800 focus:outline-none focus:border-none', {
		variants: {
			size: {
				small: 'text-xs px-2 py-1',
				medium: 'text-base px-3 py-1',
				large: 'text-lg px-5 py-2'
			}
		},
		defaultVariants: {
			size: 'medium'
		}
	});

	type inputProps = VariantProps<typeof input>;

	export let type: string = 'text';
	export let size: inputProps['size'] = 'medium';
	let classNames: string = '';
	export { classNames as class };
</script>

<input {type} class={twMerge(input({ size }), classNames)} on:input on:change {...$$restProps} />
