'use client';

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react';

type WindowStackValue = {
	register: (id: string) => void;
	unregister: (id: string) => void;
	bringToFront: (id: string) => void;
	getZIndex: (id: string) => number;
};

const WindowStackContext = createContext<WindowStackValue | null>(null);

export function WindowStackProvider({
	children,
	baseZIndex = 20,
}: {
	children: React.ReactNode;
	baseZIndex?: number;
}) {
	const [order, setOrder] = useState<string[]>([]);

	const register = useCallback((id: string) => {
		setOrder((prev) => (prev.includes(id) ? prev : [...prev, id]));
	}, []);

	const unregister = useCallback((id: string) => {
		setOrder((prev) => prev.filter((entry) => entry !== id));
	}, []);

	const bringToFront = useCallback((id: string) => {
		setOrder((prev) => {
			if (!prev.includes(id)) return [...prev, id];
			return [...prev.filter((entry) => entry !== id), id];
		});
	}, []);

	const getZIndex = useCallback(
		(id: string) => {
			const index = order.indexOf(id);
			if (index === -1) return baseZIndex;
			return baseZIndex + index;
		},
		[baseZIndex, order],
	);

	const value = useMemo(
		() => ({ register, unregister, bringToFront, getZIndex }),
		[bringToFront, getZIndex, register, unregister],
	);

	return (
		<WindowStackContext.Provider value={value}>
			{children}
		</WindowStackContext.Provider>
	);
}

export function useWindowStack() {
	const ctx = useContext(WindowStackContext);
	if (!ctx) {
		throw new Error('useWindowStack must be used within WindowStackProvider');
	}
	return ctx;
}
