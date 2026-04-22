# StreamPreviewCustomizer

Replace the Discord stream thumbnail with a custom image instead of the live screenshot.

## Preview

<img width="350" height="245" alt="Image" src="https://github.com/user-attachments/assets/b241680f-561f-41a0-8f60-bbd3afc29301" />

<img width="435" height="290" alt="Image" src="https://github.com/user-attachments/assets/0ffd8e82-889c-45a7-b2ac-9457abc30b37" />

<img width="604" height="658" alt="Image" src="https://github.com/user-attachments/assets/83f6c521-8bf0-4b5d-9821-c3d0f25c649d" />

## Features

- You can upload any JPEG, PNG, Gif, or WebP image to the settings page of the plugin
- 4 selection modes for how the thumbnail is chosen each stream
- Pin button only appears when **Specific image (Pinned)** mode is active

## Modes

| Mode | Behavior |
|---|---|
| **Disabled** | Uses the real live screenshot (default) |
| **Random** | Picks a random image from your library each time |
| **Specific (Pinned)** | Always uses whichever image you have pinned |
| **Sequential** | Cycles through your library in order |

## Installation

> **This plugin requires a source build of Equicord. (Haven't tested with Vencord but it should work) ** It does **not** work with the pre-built installer versions  you need to have cloned the repo and be building from source.

1. Clone this repo into your `src/userplugins/` folder:
   ```
   git clone https://github.com/Sighyu/streamPreviewCustomizer.git
   ```
2. In the Equicord or Vencord repo root, run:
   ```
   pnpm build
   ```
3. Restart Discord
4. Enable **StreamPreviewCustomizer** in User Settings > Plugins

## Usage

1. Open **User Settings > Plugins > StreamPreviewCustomizer**
2. Set **Mode** to anything other than *Disabled*
3. Click **Upload Image** to add images to your library
4. *(Specific mode only)* Click **Pin** on the image you want to always use
5. Start a stream
6. Profit??

## Notes

- the preview images are scaled to fit within the 512×288 (Discord's thumbnail size) while preserving the aspect ratio
- Pinned image selection (Pin/Pinned button) is only visible when **Specific image (Pinned)** mode is active
- **Animated images (GIF, APNG, animated WebP) will be converted to a static frame** — the plugin draws onto a canvas, so only the first frame is captured. Uploading a raw GIF directly has not been tested.

