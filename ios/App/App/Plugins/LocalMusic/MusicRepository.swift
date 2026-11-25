
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

    private var artworkDirectory: URL {
        let cachesDirectory = fileManager.urls(
            for: .cachesDirectory,
            in: .userDomainMask
        )[0]

        return cachesDirectory.appendingPathComponent(
            "MusicArtwork",
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

        try fileManager.createDirectory(
            at: artworkDirectory,
            withIntermediateDirectories: true
        )

        let supportedExtensions = [
            "mp3", "m4a", "wav", "aac", "flac"
        ]

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

            // Read embedded audio metadata.
            let metadata = (try? await asset.load(.commonMetadata)) ?? []

            let title = await metadataString(
                for: .commonKeyTitle,
                in: metadata
            ) ?? fileURL.deletingPathExtension().lastPathComponent

            let artist = await metadataString(
                for: .commonKeyArtist,
                in: metadata
            ) ?? "Unknown Artist"

            let album = await metadataString(
                for: .commonKeyAlbumName,
                in: metadata
            ) ?? "Unknown Album"

            // Extract embedded album artwork.
            let coverURL = await extractArtwork(
                from: metadata,
                for: fileURL
            )

            let attributes = try? fileManager.attributesOfItem(
                atPath: fileURL.path
            )

            let song: [String: Any] = [
                "id": fileURL.lastPathComponent,
                "title": title,
                "artist": artist,
                "album": album,
                "albumId": 0,
                "duration": durationMilliseconds,
                "mimeType": mimeType(for: fileURL),
                "name": fileURL.lastPathComponent,
                "size": (attributes?[.size] as? NSNumber)?.int64Value ?? 0,
                "uri": fileURL.absoluteString,
                "coverUri": coverURL?.absoluteString ?? NSNull()
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

    private func metadataString(
        for key: AVMetadataKey,
        in metadata: [AVMetadataItem]
    ) async -> String? {

        guard let item = metadata.first(where: {
            $0.commonKey == key
        }) else {
            return nil
        }

        guard let value = try? await item.load(.stringValue),
            !value.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
        else {
            return nil
        }

        return value
    }

    private func extractArtwork(
        from metadata: [AVMetadataItem],
        for audioURL: URL
    ) async -> URL? {

        guard let artworkItem = metadata.first(where: {
            $0.commonKey == .commonKeyArtwork
        }) else {
            return nil
        }

        guard let artworkData = try? await artworkItem.load(.dataValue) else {
            return nil
        }

        let fileExtension: String

        if artworkData.starts(with: [0x89, 0x50, 0x4E, 0x47]) {
            fileExtension = "png"
        } else if artworkData.starts(with: [0x47, 0x49, 0x46, 0x38]) {
            fileExtension = "gif"
        } else if artworkData.starts(with: [0x52, 0x49, 0x46, 0x46]) &&
                    artworkData.count > 12 &&
                    String(data: artworkData[8..<12], encoding: .ascii) == "WEBP" {
            fileExtension = "webp"
        } else {
            fileExtension = "jpg"
        }

        let artworkName = audioURL
            .deletingPathExtension()
            .lastPathComponent + "." + fileExtension

        let artworkURL = artworkDirectory.appendingPathComponent(
            artworkName
        )

        do {
            try artworkData.write(to: artworkURL, options: .atomic)
            return artworkURL
        } catch {
            print("Unable to save artwork for \(audioURL.lastPathComponent): \(error)")
            return nil
        }
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
