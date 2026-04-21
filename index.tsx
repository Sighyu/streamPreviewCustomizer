/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./style.css";

import { Logger } from "@utils/Logger";
import definePlugin from "@utils/types";

import { getAllImages, getImage, loadImages } from "./ImageStore";
import { settings } from "./settings";

const logger = new Logger("StreamPreviewCustomizer", "#7289da");

let sequentialIndex = 0;

export default definePlugin({
    name: "StreamPreviewCustomizer",
    description: "Replace your stream thumbnail with a custom image. Supports random, sequential, or pinned selection.",
    authors: [{
        name: "Ryu",
        id: 1020416187219316766n
    }],
    settings,

    patches: [
        {
            find: '"Failed to post stream preview"',
            replacement: {
                match: /(\i)\.toDataURL\("image\/jpeg"\)/,
                replace: "await $self.capturePreview($1)",
            },
        },
    ],

    async start() {
        sequentialIndex = 0;
        await loadImages();
    },

    async capturePreview(canvas: HTMLCanvasElement): Promise<string> {
        logger.debug("capturePreview called", { canvasWidth: canvas.width, canvasHeight: canvas.height });

        const url = this.getCustomPreview();
        if (!url) {
            logger.debug("No custom preview — using real canvas screenshot");
            return canvas.toDataURL("image/jpeg");
        }

        logger.debug("Custom preview URL found, loading image…");
        const img = new Image();
        img.src = url;
        try {
            await img.decode();
        } catch (err) {
            logger.error("img.decode() failed, falling back to canvas screenshot", err);
            return canvas.toDataURL("image/jpeg");
        }
        logger.debug("Image decoded", { naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight });

        const PREVIEW_WIDTH = 512;
        const PREVIEW_HEIGHT = 288;
        const scale = Math.min(PREVIEW_WIDTH / img.naturalWidth, PREVIEW_HEIGHT / img.naturalHeight);
        const scaledWidth = img.naturalWidth * scale;
        const scaledHeight = img.naturalHeight * scale;
        logger.debug("Scaling", { scale, scaledWidth, scaledHeight });

        canvas.width = scaledWidth;
        canvas.height = scaledHeight;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, scaledWidth, scaledHeight);

        const result = canvas.toDataURL("image/jpeg");
        logger.debug("capturePreview done", { dataUrlLength: result.length });
        return result;
    },

    getCustomPreview(): string | null {
        const { mode, selectedId } = settings.store;
        const images = getAllImages();
        logger.debug("getCustomPreview", { mode, selectedId, imageCount: images.length });

        if (mode === "disabled" || images.length === 0) {
            logger.debug("Custom preview disabled or no images");
            return null;
        }

        switch (mode) {
            case "specific":
                return getImage(selectedId)?.dataUrl ?? null;
            case "random":
                return images[Math.floor(Math.random() * images.length)].dataUrl;
            case "sequential": {
                const img = images[sequentialIndex % images.length];
                sequentialIndex = (sequentialIndex + 1) % images.length;
                return img.dataUrl;
            }
        }
        return null;
    },
});
