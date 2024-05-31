const getDuration = () => {
  const whatWillStart = "Stream will start";
  const time = document.getElementById("moment");

  const now = moment().unix();
  const deadline = moment().clone().hour(9).minute(15).second(0).unix();

  const difference = deadline - now;
  const hours = Math.floor(difference / 3600);
  const minutes = Math.floor((difference % 3600) / 60);
  const seconds = Math.floor(difference % 60);
  console.log(hours);

  if (hours > 0) {
    time.innerText = `${whatWillStart} in
        ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  } else if (hours < 1 && minutes > 0) {
    time.innerText = `${whatWillStart} in\n ${minutes} minutes, ${seconds} seconds`;
  } else if (seconds < 1) {
    time.innerText = ``;
  } else {
    time.innerText = `${whatWillStart} in\n ${seconds} seconds`;
  }
};

const timer = setInterval(getDuration, 1000);
