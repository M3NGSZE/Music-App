
import { FilePicker } from "@capawesome/capacitor-file-picker";

export async function selectMusicFiles() {
    const result = await FilePicker.pickFiles({
        types: ["audio/*"],
        limit: 0,
        readData: false,
    });

    return result.files;
}
