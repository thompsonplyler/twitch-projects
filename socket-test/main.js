
/*
Audio app flow when champWardPlaced happens: 
  1.) Find out if a file already exists with that champion name. 
  2.) If the file doesn't exist, write it and play the audio file. 
  3.) If the file exists, play the audio file. 
*/

const handleChampWardPlaced = async (champ) => {
  let audio_file = `./public/${champ}_ward_placed.mp3`;
  playVideo(audio_file, 2500);
}
const handleChampWardPurchased = async (champ) => {

}
document.addEventListener("DOMContentLoaded", () => {
  let socket = io("http://localhost:3000");

  socket.on("connected", () => {
    console.log("Successfully connected to Socket/IO.");
  });

  socket.on("getZhonyas"), () => {
    let audio_file = "./public/getzhonyas.mp3"
    playVideo(audio_file, 2500)
  }

  socket.on("getLichBane"), () => {
    let audio_file = "./public/getlichbane.mp3"
    playVideo(audio_file, 2500)
  }

  socket.on("getRabadons"), () => {
    let audio_file = "./public/getrabadons.mp3"
    playVideo(audio_file, 2500)
  }

  socket.on("gold", () => {
    console.log("Command received: SPEND YOUR GOLD");
    let scrooge = "./public/scrooge.webm";
    playVideo(scrooge, 5000);
  });

  socket.on("villain", () => {
    console.log("Command received: VILLAIN");
    let villain = "./public/villain.webm";
    playVideo(villain, 7000);
  });

  socket.on("hextech", () => {
    console.log("Command received: HEXTECH");
    let villain = "./public/hextech.webm";
    playVideo(villain, 7000);
  });

  socket.on("rabadon", () => {
    console.log("Command received: RABADON");
    let villain = "./public/rabadon.webm";
    playVideo(villain, 9000);
  });

  socket.on("notop", () => {
    console.log("Command received: NO TOP");
    let villain = "./public/notop.webm";
    playVideo(villain, 6000);
  });

  socket.on("pureskill", () => {
    console.log("Command received: PURE SKILL");
    let villain = "./public/pureskill.webm";
    playVideo(villain, 5500);
  });

  socket.on("youneedme", () => {
    console.log("Command received: YOU NEED ME");
    let villain = "./public/youneedme.webm";
    playVideo(villain, 4100);
  });

  socket.on("lurker", () => {
    console.log("Command received: Lurker!");
    let villain = "./public/lurker01.webm";
    playVideo(villain, 5600);
  });

  socket.on("potion", () => {
    console.log("Command received: Potion!");
    let villain = "./public/potions.webm";
    playVideo(villain, 4600);
  });

  socket.on("specialneeds", () => {
    console.log("Command received: Special needs!");
    let villain = "./public/darthfrodious.webm";
    playVideo(villain, 4500);
  });
  socket.on("redWardPlaced", () => {
    console.log("Command received: Red ward placed!");
    let villain = "./public/redwardPlaced.mp3";
    playVideo(villain, 2500);
  });

  socket.on("redWardPurchased", () => {
    console.log("Command received: Red ward purchased!");
    let villain = "./public/redwardPurchased.mp3";
    playVideo(villain, 2500);
  });

  socket.on("getVoidStaff"), () => {
    let audio_file = "./public/getvoidstaff.mp3"
    playVideo(audio_file, 2500)
  }




  socket.on("", () => {
    console.log("Command received: Red ward purchased!");
    let villain = "./public/redwardPurchased.mp3";
    playVideo(villain, 2500);
  });

  socket.on("champWardPurchased", async (champ) => {
    console.log(`Command received: ${champ} ward purchased!`);
    let audio_file = `./public/${champ}_ward_purchased.mp3`;
    playVideo(audio_file, 2500);
  });
  socket.on("champWardPlaced", async (champ) => {
    console.log(`Command received: ${champ} ward placed!`);
    let audio_file = `./public/${champ}_ward_placed.mp3`;
    playVideo(audio_file, 2500);

  });
});

const playVideo = (url, time) => {
  const videoDiv = document.getElementById("video-div");
  const video = document.getElementById("video");
  video.setAttribute("src", url);
  video.setAttribute("style", "width:100vw");
  videoDiv.classList.remove("hidden-video");
  videoDiv.classList.add("shown-video");
  console.log(video.duration);

  setTimeout(replaceClass, time);
};

// hides the video in question and unloads it.
const replaceClass = () => {
  videoDiv = document.getElementById("video-div");
  video = document.getElementById("video");
  video.pause();
  video.removeAttribute("src");
  video.load();
  videoDiv.classList.remove("shown-video");
  videoDiv.classList.add("hidden-video");
  return;
};
