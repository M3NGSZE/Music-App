
import Foundation
import AVFoundation
import Capacitor

@objc(NativeAudioPlayerPlugin)
public class NativeAudioPlayerPlugin: CAPPlugin, CAPBridgedPlugin, AVAudioPlayerDelegate {

    public let identifier = "NativeAudioPlayerPlugin"
    public let jsName = "NativeAudioPlayer"

    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "play", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "pause", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "resume", returnType: CAPPluginReturnPromise)
    ]

    private var audioPlayer: AVAudioPlayer?

    
    @objc func play(_ call: CAPPluginCall) {
        guard let uri = call.getString("uri"),
            let url = URL(string: uri),
            url.isFileURL else {
            call.reject("Valid local audio file URI is required.")
            return
        }

        do {
            try AVAudioSession.sharedInstance().setCategory(
                .playback,
                mode: .default
            )

            try AVAudioSession.sharedInstance().setActive(true)

            audioPlayer?.stop()
            audioPlayer = nil

            let player = try AVAudioPlayer(contentsOf: url)
            player.delegate = self
            player.prepareToPlay()

            guard player.play() else {
                call.reject("Unable to start audio playback.")
                return
            }

            audioPlayer = player
            call.resolve()

        } catch {
            call.reject("Unable to play audio.", nil, error)
        }
    }

    @objc func pause(_ call: CAPPluginCall) {
        audioPlayer?.pause()
        call.resolve()
    }

    @objc func resume(_ call: CAPPluginCall) {
        guard let player = audioPlayer else {
            call.reject("No audio player initialized.")
            return
        }

        guard player.play() else {
            call.reject("Unable to resume playback.")
            return
        }

        call.resolve()
    }

    func audioPlayerDidFinishPlaying(
        _ player: AVAudioPlayer,
        successfully flag: Bool
    ) {
        guard player === audioPlayer else {
            return
        }

        guard flag else {
            return
        }

        notifyListeners("playbackCompleted", data: [:])
    }
}
