const pushMp3 = document.getElementById("push")
const hopMp3 = document.getElementById("hop")
const climbMp3 = document.getElementById("climb")

let randomTime

// countdown timer 
function startTimer(duration, display) {
    var timer = duration, minutes, seconds;

    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
        }

        // console.log(seconds)


    }, 1000);
}
sporadicTimer()

// observe length of audio playback. Do not interrupt audio playback. 
// if the cue is to change, issue exercise order. If the cue is not to 
// change, check again to see if berating command. 


function sporadicTimer() {
    let changeValue = false
    let exerciseValue = 0
    setInterval(function () {
        let changeValue = Math.floor(Math.random() * 2)
        if (changeValue) {
            exerciseValue = Math.floor(Math.random() * 3)
        }

        switch (exerciseValue) {
            case 0: exercise = "push";
                break;
            case 1: exercise = "hop";
                break;
            case 2: exercise = "climb"
        }
        if (changeValue) {
            switch (exercise) {
                case "push": pushMp3.play();
                    break;
                case "hop": hopMp3.play();
                    break;
                case "climb": climbMp3.play();
                    console.log(climbMp3.duration);
                    break;
            };
        }



    }, 800)
}
