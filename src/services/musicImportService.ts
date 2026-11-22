
import { FilePicker } from "@capawesome/capacitor-file-picker";

export async function selectMusicFiles() {
    const result = await FilePicker.pickFiles({
        types: ["audio/*"],
        limit: 0,
        readData: false,
    });

    return result.files;
}

export async function getMusicFileBlob(
    file: Awaited<ReturnType<typeof selectMusicFiles>>[number]
): Promise<Blob> {

    if (file.blob) {
        return file.blob;
    }

    if (file.webPath) {
        const response = await fetch(file.webPath);

        if (!response.ok) {
            throw new Error("Unable to read selected music file.");
        }

        return await response.blob();
    }

    throw new Error("No accessible file data found.");
}