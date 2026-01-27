'use client';

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react';

type DockItem = {
	id: string;
	label: string;
	onRestore: () => void;
};

type DockContextValue = {
	items: DockItem[];
	registerDockItem: (item: DockItem) => void;
	unregisterDockItem: (id: string) => void;
};

const DockContext = createContext<DockContextValue | null>(null);

export function DockProvider({ children }: { children: React.ReactNode }) {
	const [items, setItems] = useState<DockItem[]>([]);

	const registerDockItem = useCallback((item: DockItem) => {
		setItems((prev) => {
			const exists = prev.some((entry) => entry.id === item.id);
			if (exists) {
				return prev.map((entry) => (entry.id === item.id ? item : entry));
			}
			return [...prev, item];
		});
	}, []);

	const unregisterDockItem = useCallback((id: string) => {
		setItems((prev) => prev.filter((entry) => entry.id !== id));
	}, []);

	const value = useMemo(
		() => ({ items, registerDockItem, unregisterDockItem }),
		[items, registerDockItem, unregisterDockItem],
	);

	return <DockContext.Provider value={value}>{children}</DockContext.Provider>;
}

export function useDock() {
	const ctx = useContext(DockContext);
	if (!ctx) {
		throw new Error('useDock must be used within DockProvider');
	}
	return ctx;
}
