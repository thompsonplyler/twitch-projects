/*
Audio app flow when champWardPlaced happens: 
  1.) Find out if a file already exists with that champion name. 
  2.) If the file doesn't exist, write it and play the audio file. 
  3.) If the file exists, play the audio file. 
*/

let playbackQueue = [];
let isPlaying = false;
let isAudioActivated = false; // Flag for user activation

const handleChampWardPlaced = async (champ) => {
  let audio_file = `./public/${champ}_ward_placed.mp3`;
  playVideo(audio_file);
}
const handleChampWardPurchased = async (champ) => {

}
document.addEventListener("DOMContentLoaded", () => {
  let socket = io("http://localhost:3000");

  const activateButton = document.getElementById('activate-audio');
  const video = document.getElementById("video"); // Get video element

  if (activateButton && video) {
    activateButton.addEventListener('click', () => {
      console.log('Audio activation button clicked.');
      isAudioActivated = true;
      // Attempt a dummy play on activation to satisfy browser
      video.muted = false;
      video.play().then(() => {
        console.log('Post-activation play successful (or already playing).');
        video.pause(); // Immediately pause if it started
      }).catch(error => {
        console.warn("Post-activation play attempt failed:", error);
      });
      activateButton.style.display = 'none'; // Hide button after click
    });
  } else {
    console.warn('Could not find activate button or video element.');
  }

  socket.on("connected", () => {
    console.log("Successfully connected to Socket/IO.");
  });

  socket.on("getZhonyas", () => {
    let audio_file = "./public/getzhonyas.mp3"
    playVideo(audio_file);
  });

  socket.on("getLichBane", () => {
    let audio_file = "./public/getlichbane.mp3"
    playVideo(audio_file);
  });

  socket.on("getRabadons", () => {
    let audio_file = "./public/getrabadons.mp3"
    playVideo(audio_file);
  });

  socket.on("goldThresholdHit", () => {
    console.log("Command received: GOLD THRESHOLD HIT (Icarus)");
    let icarus_song = "./public/icarus_song_001.mp3";
    playVideo(icarus_song);
  });

  socket.on("goldThresholdRepeat", () => {
    console.log("Command received: GOLD THRESHOLD REPEAT (Icarus)");
    let icarus_song = "./public/icarus_song_001.mp3";
    playVideo(icarus_song);
  });

  socket.on("delayedAffordabilityWarning", () => {
    console.log("Command received: DELAYED AFFORDABILITY WARNING (Idiot)");
    let idiot_song = "./public/idiot_song_001.mp3";
    playVideo(idiot_song);
  });

  socket.on("villain", () => {
    console.log("Command received: VILLAIN");
    let villain = "./public/villain.webm";
    playVideo(villain);
  });

  socket.on("hextech", () => {
    console.log("Command received: HEXTECH");
    let villain = "./public/hextech.webm";
    playVideo(villain);
  });

  socket.on("rabadon", () => {
    console.log("Command received: RABADON");
    let villain = "./public/rabadon.webm";
    playVideo(villain);
  });

  socket.on("notop", () => {
    console.log("Command received: NO TOP");
    let villain = "./public/notop.webm";
    playVideo(villain);
  });

  socket.on("pureskill", () => {
    console.log("Command received: PURE SKILL");
    let villain = "./public/pureskill.webm";
    playVideo(villain);
  });

  socket.on("youneedme", () => {
    console.log("Command received: YOU NEED ME");
    let villain = "./public/youneedme.webm";
    playVideo(villain);
  });

  socket.on("lurker", () => {
    console.log("Command received: Lurker!");
    let villain = "./public/lurker01.webm";
    playVideo(villain);
  });

  socket.on("potion", () => {
    console.log("Command received: Potion!");
    let villain = "./public/potions.webm";
    playVideo(villain);
  });

  socket.on("specialneeds", () => {
    console.log("Command received: Special needs!");
    let villain = "./public/darthfrodious.webm";
    playVideo(villain);
  });
  socket.on("redWardPlaced", () => {
    console.log("Command received: Red ward placed!");
    let villain = "./public/redwardPlaced.mp3";
    playVideo(villain);
  });

  socket.on("redWardPurchased", () => {
    console.log("Command received: Red ward purchased!");
    let villain = "./public/redwardPurchased.mp3";
    playVideo(villain);
  });

  socket.on("getVoidStaff", () => {
    let audio_file = "./public/getvoidstaff.mp3"
    playVideo(audio_file);
  });

  socket.on("champWardPurchased", async (champ) => {
    console.log(`Command received: ${champ} ward purchased!`);
    let audio_file = `./public/${champ}_ward_purchased.mp3`;
    playVideo(audio_file);
  });
  socket.on("champWardPlaced", async (champ) => {
    console.log(`Command received: ${champ} ward placed!`);
    let audio_file = `./public/${champ}_ward_placed.mp3`;
    playVideo(audio_file);
  });
});

// Main function to add media to the queue
const playVideo = (url) => {
  playbackQueue.push(url);
  playNextInQueue(); // Attempt to play immediately if queue was empty
};

// Function to play the next item in the queue if player is free
const playNextInQueue = () => {
  // Check for activation first
  if (!isAudioActivated) {
    console.warn("Audio not activated by user click yet. Skipping playback.");
    // Make sure the queue doesn't grow indefinitely if never activated
    // Option 1: Clear item - playbackQueue.shift(); 
    // Option 2: Do nothing (items wait until activation)
    return;
  }

  console.log(`playNextInQueue called. isPlaying: ${isPlaying}, queue length: ${playbackQueue.length}`);
  if (isPlaying || playbackQueue.length === 0) {
    if (isPlaying) console.log('Player is busy.');
    if (playbackQueue.length === 0) console.log('Queue is empty.');
    return;
  }

  isPlaying = true;
  const url = playbackQueue.shift(); // Get the next URL from the queue

  const videoDiv = document.getElementById("video-div");
  const videoElement = document.getElementById("video");

  // Remove any existing source elements before setting the new src
  while (videoElement.firstChild) {
    videoElement.removeChild(videoElement.firstChild);
  }

  const onLoadedMetadata = () => {
    videoElement.removeEventListener('loadedmetadata', onLoadedMetadata);
    const durationMs = videoElement.duration * 1000;
    console.log(`Playing: ${url}, Duration: ${videoElement.duration}s (${durationMs}ms)`);
    // Use setTimeout to call replaceClass after duration
    setTimeout(replaceClass, durationMs);
    videoElement.muted = false; // Ensure video is unmuted before playing
    videoElement.play().catch(error => {
      console.error("Error playing media:", error);
      // If playback fails, mark as not playing and try next
      isPlaying = false;
      playNextInQueue();
    });
  };

  videoElement.addEventListener('loadedmetadata', onLoadedMetadata);

  // Handle potential errors when setting src or loading
  videoElement.onerror = () => {
    console.error(`Error loading media: ${url}`);
    videoElement.onerror = null; // Prevent multiple error triggers
    videoElement.removeEventListener('loadedmetadata', onLoadedMetadata); // Clean up listener
    isPlaying = false; // Mark as not playing
    playNextInQueue(); // Try the next item in the queue
  }

  videoElement.setAttribute("src", url);
  videoElement.load(); // Explicitly load the new source
  videoDiv.classList.remove("hidden-video");
  videoDiv.classList.add("shown-video");
  videoElement.setAttribute("style", "width:100vw");
};

// hides the video in question and unloads it.
const replaceClass = () => {
  const videoDiv = document.getElementById("video-div");
  const video = document.getElementById("video");
  video.pause();
  video.removeAttribute("src"); // Remove the source attribute
  video.load(); // Reset the media element
  videoDiv.classList.remove("shown-video");
  videoDiv.classList.add("hidden-video");

  isPlaying = false; // Mark player as free
  playNextInQueue(); // Attempt to play the next item in the queue
};
