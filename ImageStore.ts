/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { get, set } from "@api/DataStore";

const STORAGE_KEY = "StreamPreviewCustomizer_images";

export interface StoredPreviewImage {
    id: string;
    name: string;
    dataUrl: string;
    type: string;
    addedAt: number;
}

type ImageStore = Record<string, StoredPreviewImage>;

let cache: ImageStore = {};

export async function loadImages(): Promise<void> {
    cache = (await get<ImageStore>(STORAGE_KEY)) ?? {};
}

export function getAllImages(): StoredPreviewImage[] {
    return Object.values(cache).sort((a, b) => a.addedAt - b.addedAt);
}

export function getImage(id: string): StoredPreviewImage | undefined {
    return cache[id];
}

export async function saveImage(file: File): Promise<StoredPreviewImage> {
    const id = crypto.randomUUID();
    const buffer = await file.arrayBuffer();
    const dataUrl = await bufferToDataUrl(buffer, file.type);

    const image: StoredPreviewImage = {
        id,
        name: file.name,
        dataUrl,
        type: file.type,
        addedAt: Date.now(),
    };

    cache[id] = image;
    await set(STORAGE_KEY, cache);
    return image;
}

export async function deleteImage(id: string): Promise<void> {
    delete cache[id];
    await set(STORAGE_KEY, cache);
}

function bufferToDataUrl(buffer: ArrayBuffer, type: string): Promise<string> {
    const blob = new Blob([new Uint8Array(buffer)], { type });
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}
