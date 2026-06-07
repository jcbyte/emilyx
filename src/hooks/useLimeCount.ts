import useLocalStorage, { type ValueFunction } from "./useLocalStorage";

// Simple wrapper to ensure lime count is consistently typed (and correct key)
export default function useLimeCount(): [number, (v: ValueFunction<number>) => void] {
	const [limes, setLimes] = useLocalStorage<number>("limes", 0);
	return [limes, setLimes];
}
