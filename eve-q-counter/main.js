const counter = document.getElementById("counter")

setInterval(function () {
    fetch("http://localhost:3000/counters/", {
        mode: 'cors',
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    })
        .then(r => r.json())
        .then(data => counter.innerText = data.q)
}, 1000)
