
import Capacitor

@objc(LocalMusicPlugin)
public class LocalMusicPlugin: CAPPlugin, CAPBridgedPlugin {

    public let identifier = "LocalMusicPlugin"
    public let jsName = "LocalMusic"

    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(
            name: "getSongs",
            returnType: CAPPluginReturnPromise
        )
    ]

    private let musicRepository = MusicRepository()

    @objc func getSongs(_ call: CAPPluginCall) {

        let offset = call.getInt("offset") ?? 0
        let limit = call.getInt("limit") ?? 100

        Task {
            do {
                let result = try await musicRepository.getSongs(
                    offset: offset,
                    limit: limit
                )

                call.resolve(result)

            } catch {
                call.reject(
                    "Unable to retrieve local music.",
                    nil,
                    error
                )
            }
        }
    }
}
