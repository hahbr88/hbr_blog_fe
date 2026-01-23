'use client';

import {
	CodeHighlightAdapterProvider,
	createShikiAdapter,
} from '@mantine/code-highlight';
import {
	createTheme,
	type MantineColorsTuple,
	MantineProvider,
	Button,
	TextInput,
	Textarea,
	Select,
	PasswordInput,
	Checkbox,
	ActionIcon,
} from '@mantine/core';

const shikiAdapter = createShikiAdapter(async () => {
	const { createHighlighter } = await import('shiki');

	// 필요한 언어만 넣어도 됨
	const highlighter = await createHighlighter({
		langs: ['ts', 'tsx', 'js', 'json', 'bash', 'python', 'html', 'css', 'yaml'],
		themes: ['github-dark', 'github-light'],
	});

	return highlighter;
});

export default function CustomMantineProviders({
	children,
}: {
	children: React.ReactNode;
}) {
	const myColor: MantineColorsTuple = [
		'#e7f1ff',
		'#d0dfff',
		'#9fbbfc',
		'#81a5f9',
		'#4176f5',
		'#2662f3',
		'#1457f4',
		'#0448da',
		'#0040c4',
		'#0036ad',
	];

	const theme = createTheme({
		colors: {
			myColor,
		},
		primaryColor: 'myColor',
		other: {
			terminal: {
				border: 'rgba(120, 255, 160, 0.25)',
				borderSoft: 'rgba(120, 255, 160, 0.15)',
				bg: 'linear-gradient(180deg, rgba(8, 12, 8, 0.92), rgba(2, 4, 3, 0.86))',
				bgSoft: 'rgba(6, 12, 6, 0.6)',
				fg: 'rgba(200, 255, 220, 0.95)',
				accent: 'rgba(120, 255, 160, 0.85)',
				// glow: '0 0 12px rgba(80, 255, 160, 0.4)',
				// glowStrong: '0 0 40px rgba(40, 255, 120, 0.15)',
			},
		},
		components: {
			Button: Button.extend({
				styles: (theme, props) => ({
					root:
						props.variant === 'terminal'
							? {
									background: theme.other.terminal.bg,
									border: `1px solid ${theme.other.terminal.border}`,
									color: theme.other.terminal.fg,
									// boxShadow: `${theme.other.terminal.glow}, ${theme.other.terminal.glowStrong}`,
									fontFamily:
										'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
									'&:hover': {
										borderColor: theme.other.terminal.accent,
										boxShadow: `${theme.other.terminal.glow}, 0 0 18px rgba(80, 255, 160, 0.55)`,
									},
								}
							: {},
				}),
			}),
			TextInput: TextInput.extend({
				styles: (theme, props) => ({
					input:
						props.variant === 'terminal'
							? {
									backgroundColor: theme.other.terminal.bgSoft,
									border: `1px solid ${theme.other.terminal.border}`,
									color: theme.other.terminal.fg,
									boxShadow: theme.other.terminal.glow,
									fontFamily:
										'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
									'&:focus': {
										borderColor: theme.other.terminal.accent,
										boxShadow: `${theme.other.terminal.glow}, 0 0 18px rgba(80, 255, 160, 0.55)`,
									},
								}
							: {},
					label:
						props.variant === 'terminal'
							? {
									color: theme.other.terminal.accent,
									fontFamily:
										'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
								}
							: {},
				}),
			}),
			Textarea: Textarea.extend({
				styles: (theme, props) => ({
					input:
						props.variant === 'terminal'
							? {
									backgroundColor: theme.other.terminal.bgSoft,
									border: `1px solid ${theme.other.terminal.border}`,
									color: theme.other.terminal.fg,
									boxShadow: theme.other.terminal.glow,
									fontFamily:
										'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
									'&:focus': {
										borderColor: theme.other.terminal.accent,
										boxShadow: `${theme.other.terminal.glow}, 0 0 18px rgba(80, 255, 160, 0.55)`,
									},
								}
							: {},
					label:
						props.variant === 'terminal'
							? {
									color: theme.other.terminal.accent,
									fontFamily:
										'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
								}
							: {},
				}),
			}),
			Select: Select.extend({
				defaultProps: {
					styles: (theme, props) => ({
						input:
							props.variant === 'terminal'
								? {
										backgroundColor: theme.other.terminal.bgSoft,
										border: `1px solid ${theme.other.terminal.border}`,
										color: theme.other.terminal.fg,
										boxShadow: theme.other.terminal.glow,
										fontFamily:
											'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
										'&:focus': {
											borderColor: theme.other.terminal.accent,
											boxShadow: `${theme.other.terminal.glow}, 0 0 18px rgba(80, 255, 160, 0.55)`,
										},
									}
								: {},
						label:
							props.variant === 'terminal'
								? {
										color: theme.other.terminal.accent,
										fontFamily:
											'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
									}
								: {},
						dropdown:
							props.variant === 'terminal'
								? {
										background: theme.other.terminal.bgSoft,
										border: `1px solid ${theme.other.terminal.border}`,
										boxShadow: `${theme.other.terminal.glow}, ${theme.other.terminal.glowStrong}`,
										backdropFilter: 'blur(6px)',
									}
								: {},
						options:
							props.variant === 'terminal'
								? {
										padding: '6px',
									}
								: {},
						option:
							props.variant === 'terminal'
								? {
										color: theme.other.terminal.fg,
										fontFamily:
											'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
										borderRadius: '8px',
										'&[data-hovered]': {
											backgroundColor: 'rgba(20, 50, 30, 0.6)',
										},
										'&[data-selected]': {
											backgroundColor: 'rgba(12, 30, 20, 0.8)',
											border: `1px solid ${theme.other.terminal.border}`,
										},
									}
								: {},
						empty:
							props.variant === 'terminal'
								? {
										color: theme.other.terminal.accent,
										fontFamily:
											'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
									}
								: {},
						groupLabel:
							props.variant === 'terminal'
								? {
										color: theme.other.terminal.accent,
										fontFamily:
											'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
										textTransform: 'uppercase',
										letterSpacing: '0.2em',
									}
								: {},
					}),
				},
			}),
			PasswordInput: PasswordInput.extend({
				styles: (theme, props) => ({
					input:
						props.variant === 'terminal'
							? {
									backgroundColor: theme.other.terminal.bgSoft,
									border: `1px solid ${theme.other.terminal.border}`,
									color: theme.other.terminal.fg,
									boxShadow: theme.other.terminal.glow,
									fontFamily:
										'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
									'&:focus': {
										borderColor: theme.other.terminal.accent,
										boxShadow: `${theme.other.terminal.glow}, 0 0 18px rgba(80, 255, 160, 0.55)`,
									},
								}
							: {},
					label:
						props.variant === 'terminal'
							? {
									color: theme.other.terminal.accent,
									fontFamily:
										'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
								}
							: {},
				}),
			}),
			Checkbox: Checkbox.extend({
				styles: (theme, props) => ({
					input:
						props.variant === 'terminal'
							? {
									backgroundColor: theme.other.terminal.bgSoft,
									border: `1px solid ${theme.other.terminal.border}`,
									boxShadow: theme.other.terminal.glow,
									'&:checked': {
										backgroundColor: theme.other.terminal.bgSoft,
										borderColor: theme.other.terminal.accent,
									},
									'&:indeterminate': {
										backgroundColor: theme.other.terminal.bgSoft,
										borderColor: theme.other.terminal.accent,
									},
								}
							: {},
					icon:
						props.variant === 'terminal'
							? {
									color: theme.other.terminal.accent,
								}
							: {},
					label:
						props.variant === 'terminal'
							? {
									color: theme.other.terminal.fg,
									fontFamily:
										'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
								}
							: {},
				}),
			}),
			ActionIcon: ActionIcon.extend({
				styles: (theme, props) => ({
					root:
						props.variant === 'terminal'
							? {
									background: theme.other.terminal.bg,
									border: `1px solid ${theme.other.terminal.border}`,
									color: theme.other.terminal.fg,
									boxShadow: `${theme.other.terminal.glow}, ${theme.other.terminal.glowStrong}`,
									fontFamily:
										'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
									'&:hover': {
										borderColor: theme.other.terminal.accent,
										boxShadow: `${theme.other.terminal.glow}, 0 0 18px rgba(80, 255, 160, 0.55)`,
									},
								}
							: {},
				}),
			}),
		},
	});
	return (
		<MantineProvider theme={theme}>
			<CodeHighlightAdapterProvider adapter={shikiAdapter}>
				{children}
			</CodeHighlightAdapterProvider>
		</MantineProvider>
	);
}
