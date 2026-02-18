import { Muxer, ArrayBufferTarget } from "mp4-muxer";
import { renderShareCard } from "./shareCardRenderer";

/**
 * Generates an MP4 video of the game history.
 *
 * @param {Object} currentSentence - The final sentence state.
 * @param {Array} currentCards - The final cards state.
 * @param {Array} undoStack - History of previous states.
 * @returns {Promise<Blob>} - The generated video file as a Blob.
 */
export const generateVideo = async (
  currentSentence,
  currentCards,
  undoStack,
) => {
  const CONFIG = {
    width: 1080,
    height: 1080,
    fps: 30, // Frames per second
    firstSentenceTime: 2, // Initial pause
    transitionTime: 1.5, // Time per step
    lastSentenceTime: 4, // Final pause
    bitrate: 2_000_000, // 2 Mbps
  };

  // 1. Construct History
  // We need to be careful not to duplicate the final frame.
  // The 'undoStack' might essentially be a 'fullHistory' that already includes the current state.

  let history = [...undoStack];
  const currentState = { sentence: currentSentence, cards: currentCards };

  // Check if the last item in history is effectively the same as the current state
  // We use JSON.stringify for a quick deep comparison of these specific game objects
  const lastState = history.length > 0 ? history[history.length - 1] : null;

  const isDuplicate =
    lastState &&
    JSON.stringify(lastState.sentence) ===
      JSON.stringify(currentState.sentence) &&
    JSON.stringify(lastState.cards) === JSON.stringify(currentState.cards);

  // Only append if it's new (or if history is empty)
  if (!isDuplicate) {
    history.push(currentState);
  }

  // 2. Initialize Muxer
  const muxer = new Muxer({
    target: new ArrayBufferTarget(),
    video: {
      codec: "avc", // H.264
      width: CONFIG.width,
      height: CONFIG.height,
    },
    fastStart: "in-memory",
  });

  // 3. Initialize VideoEncoder
  const encoder = new VideoEncoder({
    output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
    error: (e) => console.error("Video encoding error:", e),
  });

  encoder.configure({
    codec: "avc1.42001f", // Baseline Profile
    width: CONFIG.width,
    height: CONFIG.height,
    bitrate: CONFIG.bitrate,
    framerate: CONFIG.fps,
  });

  // 4. Setup Offscreen Canvas
  const canvas = new OffscreenCanvas(CONFIG.width, CONFIG.height);
  const ctx = canvas.getContext("2d", {
    alpha: false,
  });

  // Helper: Load a DataURL into a bitmap
  const loadBitmap = async (url) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return createImageBitmap(blob);
  };

  // Helper: Record N seconds
  let timestamp = 0; // microseconds
  const frameDuration = 1e6 / CONFIG.fps;

  const recordDuration = async (seconds) => {
    const framesToRecord = Math.round(seconds * CONFIG.fps);

    for (let i = 0; i < framesToRecord; i++) {
      const frame = new VideoFrame(canvas, {
        timestamp: timestamp,
        duration: frameDuration,
      });

      const isKeyFrame = timestamp === 0;
      encoder.encode(frame, { keyFrame: isKeyFrame });

      frame.close();
      timestamp += frameDuration;
    }
  };

  // 5. Main Generation Loop
  try {
    for (let i = 0; i < history.length; i++) {
      const state = history[i];

      const dataUrl = await renderShareCard({
        sentence: state.sentence,
        cards: state.cards,
        moveCount: i,
      });

      // Draw to video canvas
      const bitmap = await loadBitmap(dataUrl);
      ctx.drawImage(bitmap, 0, 0);
      bitmap.close();

      // Record Duration based on position
      if (i === 0) {
        // Start: Hold for longer
        await recordDuration(CONFIG.firstSentenceTime);
      } else if (i === history.length - 1) {
        // End: Hold for longest
        await recordDuration(CONFIG.lastSentenceTime);
      } else {
        // Transitions: Hold for a short step
        await recordDuration(CONFIG.transitionTime);
      }
    }

    // 6. Finalize
    await encoder.flush();
    muxer.finalize();

    const { buffer } = muxer.target;
    return new Blob([buffer], { type: "video/mp4" });
  } catch (err) {
    console.error("Error generating video:", err);
    throw err;
  }
};
