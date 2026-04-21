/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";

import { ImageLibrary } from "./components";

export const settings = definePluginSettings({
    mode: {
        type: OptionType.SELECT,
        description: "How to pick the custom preview image each time a thumbnail is posted",
        options: [
            { label: "Disabled (use real screenshot)", value: "disabled", default: true },
            { label: "Random", value: "random" },
            { label: "Specific image (Pinned)", value: "specific" },
            { label: "Sequential (cycle in order)", value: "sequential" },
        ],
    },
    selectedId: {
        type: OptionType.STRING,
        description: "ID of the pinned image used in Specific mode",
        hidden: true,
        default: "",
    },
    imageLibrary: {
        type: OptionType.COMPONENT,
        description: "",
        component: ImageLibrary,
    },
});
