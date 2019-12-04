const sc6Words = document.getElementById("sc6-words")
const pf2Words = document.getElementById("pf2-words")
sc6Words.innerText = `If you're into SoulCalibur 6,\n let me know,\ngive me a follow,\n and let's play in between rounds of League!`
pf2Words.innerText = `Wednesday nights I stream Pathfinder.\n\n It's like D&D, but even nerdier.\n\n 8pm after normal stream, usually.`
const minutes = 60

tl = new TimelineMax({ repeat: -1, repeatDelay: minutes * 3 })

// tl.addLabel("display", 5)
tl.set(".pet-pet1", { x: -4500 })
tl.set(".pet-pet2", { x: -4500 })
tl.to(".pet-pet1", 1, { x: 0 })
tl.to(".pet-pet1", 1, { x: -4500 }, "+=5")
tl.to(".pet-pet2", 1, { x: 0 },"-=1.5")
tl.to(".pet-pet2", 1, { x: -4500 }, "+=2")

tl2 = new TimelineMax({ repeat: -1, repeatDelay: minutes * 5 })
tl2.set(".sc6-beg", {x:4500})
tl2.to(".sc6-beg", 1, {x:0})
tl2.to(".sc6-beg", 1, {x:4500}, "+=5")

tl4 = new TimelineMax({ repeat: -1, repeatDelay: minutes * 10 })
tl4.set(".pf2-announcement", {x:4500})
tl4.to(".pf2-announcement", 1, {x:0})
tl4.to(".pf2-announcement", 1, {x:4500}, "+=5")

tl3 = new TimelineMax({ repeat: -1, repeatDelay: minutes * 8 })
tl3.set(".variety-announcement1", {x:-4500})
tl3.set(".variety-announcement2", {x:-4500})
tl3.to(".variety-announcement1", 1, {x:0})
tl3.to(".variety-announcement1", 1, {x:-4500}, "+=5")
tl3.to(".variety-announcement2", 1, {x:0}, "-=1.5")
tl3.to(".variety-announcement2", 1, {x:-4500}, "+=5")
// TweenMax.set(".thing", { x: -4500 })

// const move = () => {
//     TweenMax.to(".thing", 1, { x: 0 });
//     TweenMax.to(".thing", 1, { delay: 5, x: -4500 });
// }

// setInterval(move, 5000)