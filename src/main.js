import {
    Application,
    audio,
    loader,
    state,
    plugin,
    pool
} from "melonjs";

import TitleScreen from "./scripts/stage/title.js";
import PlayScreen from "./scripts/stage/play.js";
import PlayerEntity from "./scripts/renderables/player.js";
import DataManifest from "./resources.js";
import { startPacmanCanvas } from "./pacman.js";
import "./index.css";

// Start the separate HTML5 Pac-Man canvas.
startPacmanCanvas();

// Create the melonJS application.
const app = new Application(1218, 562, {
    parent: "screen",
    scale: "auto"
});

// Wait for the melonJS renderer to initialize.
await app.init();

// Initialize audio support.
audio.init("mp3,ogg");

// Allow images and textures to load across origins.
loader.setOptions({
    crossOrigin: "anonymous"
});

// Load the debug panel during development.
if (import.meta.env.DEV) {
    import("@melonjs/debug-plugin").then((debugPlugin) => {
        plugin.register(
            debugPlugin.DebugPanelPlugin,
            "debugPanel"
        );
    });
}

// Preload all registered visual and audio resources.
loader.preload(DataManifest, () => {
    state.set(state.MENU, new TitleScreen());
    state.set(state.PLAY, new PlayScreen());

    pool.register("mainPlayer", PlayerEntity);

    state.change(state.PLAY, false);
});