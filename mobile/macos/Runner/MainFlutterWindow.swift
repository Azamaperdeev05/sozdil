import Cocoa
import FlutterMacOS

class MainFlutterWindow: NSWindow {
  override func awakeFromNib() {
    let flutterViewController = FlutterViewController()
    // portrait window: the game layout is designed for phone proportions
    var windowFrame = self.frame
    windowFrame.size = NSSize(width: 460, height: 860)
    self.contentViewController = flutterViewController
    self.setFrame(windowFrame, display: true)
    self.center()
    self.minSize = NSSize(width: 360, height: 640)
    self.title = "Сөзділ"

    RegisterGeneratedPlugins(registry: flutterViewController)

    super.awakeFromNib()
  }
}
