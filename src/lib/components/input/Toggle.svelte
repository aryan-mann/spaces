<script lang="ts">
	interface Props {
		label: string;
		checked?: boolean;
		display?: { checked: string; unchecked: string };
		onchange?: (checked: boolean) => void;
	}

	let {
		label,
		checked = $bindable(false),
		display = { checked: '✓', unchecked: '✗' },
		onchange
	}: Props = $props();

	function handleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		checked = target.checked;
		onchange?.(checked);
	}
</script>

<label class="toggle inline-flex items-center bg-primary-100 py-1 px-2 shadow">
	<input type="checkbox" class="sr-only" {checked} onchange={handleChange} />
	<span class="select-none whitespace-nowrap">{label}</span>
	<div
		class="px-4 py-[1px] rounded ml-3 transition-colors duration-500 select-none"
		data-checked={checked}
	>
		<span class:text-black={checked} class:text-red-800={!checked}>
			{checked ? display.checked : display.unchecked}
		</span>
	</div>
</label>

<style lang="scss">
	label.toggle {
		box-shadow: 6px 6px 0px -3px #343333;
	}
	label.toggle div {
		@apply px-4 py-[1px] rounded ml-3 transition-colors duration-500 select-none;

		&[data-checked='true'] {
			@apply bg-green-300;

			&:hover {
				@apply bg-green-400;
			}
		}
		&[data-checked='false'] {
			@apply bg-yellow-300;

			&:hover {
				@apply bg-yellow-400;
			}
		}
	}
</style>
