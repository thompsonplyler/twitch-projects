const getDuration = () => {
    const time = document.getElementById("moment")
    

    const now = moment().unix()
    const deadline = moment().clone().hour(18).minute(00).second(0).unix();


    const difference = deadline-now;
    const hours = Math.floor(difference / 3600);
    const minutes = Math.floor((difference % 3600) / 60);
    const seconds = Math.floor( difference % 60) 

    if (hours > 1){
        time.innerHTML = `${hours} hours, ${minutes} minutes, ${seconds} seconds`    
    }
    else if (hours < 1 && minutes > 1){
        time.innerHTML = `${minutes} minutes, ${seconds} seconds`
    }
    else if (seconds < 0) {
        time.innerHTML = "SEMPER FI!"
    }
    else {
        time.innerHTML = `${seconds} seconds.`
    }
}

const timer = setInterval(getDuration,1000)