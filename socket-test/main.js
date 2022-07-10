document.addEventListener("DOMContentLoaded", () => {
  let socket = io("http://localhost:3000");

  socket.on("connected", () => {
    console.log("Successfully connected to Socket/IO.");
  });
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
