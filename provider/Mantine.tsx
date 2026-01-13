'use client';

import {
	CodeHighlightAdapterProvider,
	createShikiAdapter,
} from '@mantine/code-highlight';
import {
	createTheme,
	type MantineColorsTuple,
	MantineProvider,
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
	});
	return (
		<MantineProvider theme={theme}>
			<CodeHighlightAdapterProvider adapter={shikiAdapter}>
				{children}
			</CodeHighlightAdapterProvider>
		</MantineProvider>
	);
}
