import { useState } from "react";
import { getMusicFileBlob, selectMusicFiles } from "../services/musicImportService";

type PickedMusicFile = Awaited<
    ReturnType<typeof selectMusicFiles>
>[number];

export default function MusicFilePickerTest() {
    const [files, setFiles] = useState<PickedMusicFile[]>([]);
    const [error, setError] = useState<string | null>(null);

    async function handleSelectMusic() {
        try {
            setError(null);

            const selectedFiles = await selectMusicFiles();

            setFiles(selectedFiles);

            console.log("Selected music files:", selectedFiles);

            for (const file of selectedFiles) {
                const blob = await getMusicFileBlob(file);

                console.log("Music name:", file.name);
                console.log("Blob size:", blob.size);
                console.log("Blob type:", blob.type);

                console.log("Path:", file.path);
                console.log("Web Path:", file.webPath);
                console.log("MIME Type:", file.mimeType);
                console.log("Size:", file.size);
            }
            
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Something went wrong."
            );
        }
    }

    return (
        <div className="p-4">
            <button
                onClick={handleSelectMusic}
                className="rounded-xl bg-white/10 px-4 py-3 text-white"
            >
                Select Music Files
            </button>

            {error && (
                <p className="mt-3 text-sm text-red-400">{error}</p>
            )}

            <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                    <div
                        key={`${file.name}-${index}`}
                        className="rounded-lg bg-white/5 p-3 text-white"
                    >
                        <p>{file.name}</p>
                        <p className="text-xs text-white/50">
                            {file.mimeType} · {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}