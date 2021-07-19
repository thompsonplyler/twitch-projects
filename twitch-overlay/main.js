const sc6Words = document.getElementById("sc6-words")
const pf2Words = document.getElementById("pf2-words")
let win = document.getElementById("win")
let loss = document.getElementById("loss")
// sc6Words.innerText = `If you're into SoulCalibur 6,\n let me know,\ngive me a follow,\n and let's play in between rounds of League!`
// pf2Words.innerText = `Wednesday nights I stream Pathfinder.\n\n It's like D&D, but even nerdier.\n\n 8pm after normal stream, usually.`
// pf2Words.innerText = `I usually stream Pathfinder on Wed nights.\nBut not tomorrow. \n It's like D&D, but even nerdier.\n 8pm after normal stream, usually.`
const minutes = 60
let winTotal = 0
let lossTotal = 0

tl = new TimelineLite({ repeat: -1, repeatDelay: minutes * 3 })

// tl.addLabel("display", 5)
tl.set(".pet-pet1", { x: -4500 })
tl.set(".pet-pet2", { x: -4500 })
tl.set(".pet-pet3", { x: -4500 })
tl.to(".pet-pet1", 1, { x: 0 })
tl.to(".pet-pet1", 1, { x: -4500 }, "+=5")
tl.to(".pet-pet2", 1, { x: 0 }, "-=1.5")
tl.to(".pet-pet2", 1, { x: -4500 }, "+=2")
tl.to(".pet-pet3", 1, { x: 0 }, "-=1.5")
tl.to(".pet-pet3", 1, { x: -4500 }, "+=3")

// tl2 = new TimelineLite({ repeat: -1, repeatDelay: minutes * 5 })
// tl2.set(".sc6-   beg", { x: 4500 })
// tl2.to(".sc6-beg", 1, { x: 0 })
// tl2.to(".sc6-beg", 1, { x: 4500 }, "+=5")

tl4 = new TimelineLite({ repeat: -1, repeatDelay: minutes * 10 })
tl4.set(".pf2-announcement", { x: 4500 })
tl4.to(".pf2-announcement", 1, { x: 0 })
tl4.to(".pf2-announcement", 1, { x: 4500 }, "+=7")

tl3 = new TimelineLite({ repeat: -1, repeatDelay: minutes * 8 })
tl3.set(".variety-announcement1", { x: -4500 })
tl3.set(".variety-announcement2", { x: -4500 })
tl3.to(".variety-announcement1", 1, { x: 0 })
tl3.to(".variety-announcement1", 1, { x: -4500 }, "+=5")
tl3.to(".variety-announcement2", 1, { x: 0 }, "-=1.5")
tl3.to(".variety-announcement2", 1, { x: -4500 }, "+=5")
// TweenMax.set(".thing", { x: -4500 })

// const move = () => {
//     TweenMax.to(".thing", 1, { x: 0 });
//     TweenMax.to(".thing", 1, { delay: 5, x: -4500 });
// }

// setInterval(move, 5000)

const fetcher = () => {
    var requestOptions = {
        method: 'POST',
        redirect: 'follow'
      };
      
      fetch("http://fresh-under-one-sky-email-api.herokuapp.com/api/v1/today/?summoner_name=EveOnlyFans&region=na", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log("Hey, I'm an array!", result)
            let dummy = JSON.parse(result)
            console.log(dummy)
            winTotal = 0
            lossTotal = 0
            
            
            for (i=0;i<dummy.length;i++){
                if (dummy[i]== "Win"){
                    winTotal++
                }

                if (dummy[i]=="Fail"){
                    lossTotal++
                }
            }
            
                console.log(`
                Total Wins: ${winTotal}
                Total Losses: ${lossTotal}
                `)
            resultLogger()
        })
        .catch(error => console.log('error', error));
}

fetcher()


const resultLogger = () => {
        win.innerHTML=winTotal
        loss.innerHTML=lossTotal
}

const fetcherInterval =()=>{
    setInterval(fetcher,15000)
}

fetcherInterval()