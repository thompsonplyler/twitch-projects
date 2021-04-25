let banner = document.getElementById("banner")

setInterval(function () {
    fetch("http://localhost:3000/tabstate/", {
        mode: 'cors',
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    })
        .then(r => r.json())
        .then(data => {
            
                console.log(data.tabState)
            
        })
}, 30)

document.addEventListener("DOMContentLoaded", function(){
    console.log("I've loaded!")
})