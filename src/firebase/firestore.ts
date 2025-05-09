import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

interface MainDoc {
	timestamp: Timestamp;
}

async function getMainDoc(): Promise<MainDoc> {
	let mainDocRef = doc(db, "emilyx", "main");
	let mainDoc = await getDoc(mainDocRef);

	if (!mainDoc.exists()) {
		throw new Error("Firestore: Main doc 'emilyx/main' does not exist");
	}

	return mainDoc.data() as MainDoc;
}

export async function getTimestamp(): Promise<number> {
	let mainDoc = await getMainDoc();
	return mainDoc.timestamp.toMillis();
}
