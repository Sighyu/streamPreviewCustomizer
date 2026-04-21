/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { useForceUpdater } from "@utils/react";
import { Button, Forms, React, showToast, Toasts } from "@webpack/common";

import { deleteImage, getAllImages, saveImage, StoredPreviewImage } from "./ImageStore";
import { settings } from "./settings";

const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";

export function ImageCard({ image, isPinned, showPin, onPin, onDelete }: {
    image: StoredPreviewImage;
    isPinned: boolean;
    showPin: boolean;
    onPin: () => void;
    onDelete: () => void;
}) {
    return (
        <div className={`spc-card${isPinned ? " spc-card-pinned" : ""}`}>
            <img
                className="spc-card-thumb"
                src={image.dataUrl}
                alt={image.name}
                draggable={false}
            />
            <div className="spc-card-name" title={image.name}>{image.name}</div>
            <div className="spc-card-actions">
                {showPin && (
                    <Button
                        size={Button.Sizes.MIN}
                        color={isPinned ? Button.Colors.BRAND : Button.Colors.PRIMARY}
                        onClick={onPin}
                        title={isPinned ? "Pinned for Specific mode" : "Pin (use in Specific mode)"}
                    >
                        {isPinned ? "Pinned" : "Pin"}
                    </Button>
                )}
                <Button
                    size={Button.Sizes.MIN}
                    color={Button.Colors.RED}
                    onClick={onDelete}
                >
                    Delete
                </Button>
            </div>
        </div>
    );
}

export function ImageLibrary() {
    const forceUpdate = useForceUpdater();
    const { mode, selectedId } = settings.use(["mode", "selectedId"]);
    const images = getAllImages();
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            await saveImage(file);
            forceUpdate();
            showToast("Image saved!", Toasts.Type.SUCCESS);
        } catch {
            showToast("Failed to save image.", Toasts.Type.FAILURE);
        }
        e.target.value = "";
    }

    async function handleDelete(id: string) {
        await deleteImage(id);
        if (settings.store.selectedId === id) settings.store.selectedId = "";
        forceUpdate();
    }

    function handlePin(id: string) {
        settings.store.selectedId = id;
    }

    return (
        <div className="spc-library">
            <div className="spc-notice">
                <img className="spc-notice-icon" src="https://cdn.discordapp.com/emojis/1377410038615900190.gif" alt="warning" />
                Animated images (GIF, APNG, animated WebP) will be converted to a static frame. (Untested: uploading a raw GIF directly instead of going through the canvas draw.)
            </div>
            <div className="spc-upload-row">
                <Button
                    size={Button.Sizes.SMALL}
                    onClick={() => fileInputRef.current?.click()}
                >
                    Upload Image
                </Button>
                <Forms.FormText className="spc-image-count">
                    {images.length} image{images.length !== 1 ? "s" : ""} in library
                </Forms.FormText>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={IMAGE_ACCEPT}
                    style={{ display: "none" }}
                    onChange={handleUpload}
                />
            </div>
            {images.length === 0 ? (
                <div className="spc-empty-state">
                    <Forms.FormText>
                        No images yet. Upload a JPEG, PNG, or WebP to use as your stream preview thumbnail.
                    </Forms.FormText>
                </div>
            ) : (
                <div className="spc-grid">
                    {images.map(img => (
                        <ImageCard
                            key={img.id}
                            image={img}
                            isPinned={img.id === selectedId && mode === "specific"}
                            showPin={mode === "specific"}
                            onPin={() => handlePin(img.id)}
                            onDelete={() => handleDelete(img.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
