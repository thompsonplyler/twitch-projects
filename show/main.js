
const imageHolder = document.getElementById("image-change");
const dwightButton = document.getElementById("dwight");
const madeleineButton = document.getElementById("madeleine");
const cocoButton = document.getElementById("coco");
const imageSpot = document.getElementById("image-change")

let whoIsIt = "";

const buttonz = Array.from(document.getElementsByClassName("btn"));

buttonz.forEach(button=>{
    button.addEventListener("click",e=>clickHandler(e,button));
});

function clickHandler(e,button){
    kidHandler(button.id)
}

function kidHandler(kid){
    if (whoIsIt === kid){
        whoIsIt = ""
        imageSpot.classList = "fun5"
    }
    else {
        whoIsIt = kid
        imageSpot.classList = `kid-status-${kid}`
    }
}