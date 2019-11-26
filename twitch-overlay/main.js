tl = new TimelineMax({ repeat: -1, repeatDelay: 180 })

// tl.addLabel("display", 5)
tl.set(".thing", { x: -4500 })
tl.to(".thing", 1, { x: 0 })
tl.to(".thing", 1, { x: -4500 }, "+=5")
// TweenMax.set(".thing", { x: -4500 })

// const move = () => {
//     TweenMax.to(".thing", 1, { x: 0 });
//     TweenMax.to(".thing", 1, { delay: 5, x: -4500 });
// }

// setInterval(move, 5000)