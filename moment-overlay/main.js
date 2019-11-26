const time = document.getElementById("moment")

const getTimeRemaining = () => {
    let now = moment();
    let deadline = now.clone().hour(20).minute(40).second(0);
    console.log(deadline)
    if (now.isAfter(deadline)) {
        // disable RSVP button here
        return "Closed";
    } else {
        // enable RSVP button here
        // returns “in x hours”, “in x minutes”, “in a few seconds”
        console.log(deadline.from(now))
        return deadline.from(now, "HH-mm-ss");
    }
}

time.innerHTML = getTimeRemaining()