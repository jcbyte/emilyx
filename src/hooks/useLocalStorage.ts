import { useEffect, useState } from "react";

export type ValueFunction<T> = T | ((arg: T) => T);

// Custom event name for same-tab communication
const STORAGE_EVENT = "localstorage-update";

export default function useLocalStorage<T>(key: string, initialValue: T): [T, (v: ValueFunction<T>) => void] {
	const [value, setV] = useState<T>(() => {
		const item = window.localStorage.getItem(key);
		return item ? JSON.parse(item) : initialValue;
	});

	function setValue(v: ValueFunction<T>) {
		setV((currentValue) => {
			const storeValue: T = v instanceof Function ? v(currentValue) : v;
			return storeValue;
		});
	}

	// This is performed in a `useEffect` rather than in `setValue` in order to prevent broadcasting a stale update during render
	useEffect(() => {
		// Update localstorage with the new value
		window.localStorage.setItem(key, JSON.stringify(value));
		// Send an event, so all hooks update the state
		window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key, newValue: value } }));
	}, [key, value]);

	// Handle updating this state when modified elsewhere
	useEffect(() => {
		function handleStorageEvent(ev: CustomEvent<{ key: string; newValue: T }>) {
			if (ev.detail.key === key) {
				setV(ev.detail.newValue);
			}
		}

		window.addEventListener(STORAGE_EVENT, handleStorageEvent as EventListener);
		return () => window.removeEventListener(STORAGE_EVENT, handleStorageEvent as EventListener);
	}, [key]);

	return [value, setValue];
}
