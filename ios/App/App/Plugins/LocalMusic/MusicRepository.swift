
import Foundation
import AVFoundation

class MusicRepository {

    private let fileManager = FileManager.default

    private var musicDirectory: URL {
        let documentsDirectory = fileManager.urls(
            for: .documentDirectory,
            in: .userDomainMask
        )[0]

        return documentsDirectory.appendingPathComponent(
            "Music",
            isDirectory: true
        )
    }

    func getSongs(offset: Int, limit: Int) async throws -> [String: Any] {

        guard offset >= 0, limit > 0, limit <= 500 else {
            throw NSError(
                domain: "MusicRepository",
                code: 400,
                userInfo: [
                    NSLocalizedDescriptionKey: "Invalid pagination parameters."
                ]
            )
        }

        try fileManager.createDirectory(
            at: musicDirectory,
            withIntermediateDirectories: true
        )

        let supportedExtensions = ["mp3", "m4a", "wav", "aac", "flac"]

        let files = try fileManager.contentsOfDirectory(
            at: musicDirectory,
            includingPropertiesForKeys: [
                .fileSizeKey,
                .isRegularFileKey
            ],
            options: [.skipsHiddenFiles]
        )

        let musicFiles = files.filter { fileURL in
            let isSupported = supportedExtensions.contains(
                fileURL.pathExtension.lowercased()
            )

            let isRegularFile = (try? fileURL.resourceValues(
                forKeys: [.isRegularFileKey]
            ).isRegularFile) ?? false

            return isSupported && isRegularFile
        }
        .sorted {
            $0.lastPathComponent.localizedStandardCompare(
                $1.lastPathComponent
            ) == .orderedAscending
        }

        let page = Array(musicFiles.dropFirst(offset).prefix(limit))

        var songs: [[String: Any]] = []

        for fileURL in page {

            let asset = AVURLAsset(url: fileURL)

            let duration = try? await asset.load(.duration)
            let durationSeconds = duration?.seconds ?? 0

            let durationMilliseconds: Int64 =
                durationSeconds.isFinite && durationSeconds >= 0
                ? Int64(durationSeconds * 1000)
                : 0

            let attributes = try? fileManager.attributesOfItem(
                atPath: fileURL.path
            )

            let song: [String: Any] = [
                "id": fileURL.lastPathComponent,
                "title": fileURL.deletingPathExtension().lastPathComponent,
                "artist": "Unknown Artist",
                "album": "Unknown Album",
                "duration": durationMilliseconds,
                "mimeType": mimeType(for: fileURL),
                "name": fileURL.lastPathComponent,
                "size": (attributes?[.size] as? NSNumber)?.int64Value ?? 0,
                "uri": fileURL.absoluteString
            ]

            songs.append(song)
        }

        return [
            "songs": songs,
            "offset": offset,
            "limit": limit,
            "hasMore": musicFiles.count > offset + page.count
        ]
    }

    private func mimeType(for fileURL: URL) -> String {

        switch fileURL.pathExtension.lowercased() {
        case "mp3":
            return "audio/mpeg"
        case "m4a":
            return "audio/mp4"
        case "wav":
            return "audio/wav"
        case "aac":
            return "audio/aac"
        case "flac":
            return "audio/flac"
        default:
            return "application/octet-stream"
        }
    }
}
