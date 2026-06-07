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
			window.localStorage.setItem(key, JSON.stringify(storeValue));
			// Send an event, so all hooks update the state
			window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key, newValue: storeValue } }));
			return storeValue;
		});
	}

	// Update the state, when receiving the event that it has been updated
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
