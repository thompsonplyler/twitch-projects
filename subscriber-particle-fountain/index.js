var d = document, $d = $(d),
    w = window, $w = $(w),
    wWidth = $w.width(), wHeight = $w.height(),
    credit = $('.credit > a'),
    particles = $('.particles'),
    particleArr = [],
    particleCount = 0,
    sizes = [
        15, 20, 25, 35, 45
    ],
    colors = [
        '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
        '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
        '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
        '#FF5722', '#795548', '#9E9E9E', '#607D8B', '#777777'
    ],

    mouseX = $w.width() / 2, mouseY = $w.height() / 2;

function updateParticleCount() {
    gsap.set('.particle-count > .number', { innerText: particleCount });
};

$w
    .on('resize', function () {
        wWidth = $w.width();
        wHeight = $w.height();
    });

$d
    .on('mousemove touchmove', function (event) {
        event.preventDefault();
        event.stopPropagation();
        mouseX = event.clientX;
        mouseY = event.clientY;
        if (!!event.originalEvent.touches) {
            mouseX = event.originalEvent.touches[0].clientX;
            mouseY = event.originalEvent.touches[0].clientY;
        }
    })
    .on('mousedown touchstart', function (event) {
        if (event.target === credit.get(0)) {
            return;
        }
        mouseX = event.clientX;
        mouseY = event.clientY;
        if (!!event.originalEvent.touches) {
            mouseX = event.originalEvent.touches[0].clientX;
            mouseY = event.originalEvent.touches[0].clientY;
        }

        isTouchDown = true;
        gsap.delayedCall(1 / 60, limitCreation);
    });

$d.on('mouseup mouseleave touchend touchcancel touchleave', function () {
    isTouchDown = false;
})

var isTouchDown = false;
function limitCreation() {
    createParticle(event);

    if (isTouchDown) {
        gsap.delayedCall(1 / 60, limitCreation);
    }
}


function createParticle(event) {
    var particle = $('<div class="particle"/>'),
        size = sizes[Math.floor(Math.random() * sizes.length)],
        color = colors[Math.floor(Math.random() * colors.length)],
        negative = size / 2,
        speedHorz = Math.random() * 10,
        speedUp = Math.random() * 25,
        spinVal = 360 * Math.random(),
        spinSpeed = ((36 * Math.random())) * (Math.random() <= .5 ? -1 : 1),
        otime,
        time = otime = (1 + (.5 * Math.random())) * 1000,
        top = (mouseY - negative),
        left = (mouseX - negative),
        direction = Math.random() <= .5 ? -1 : 1,
        life = 10;

    gsap.set(particle, {
        height: size + 'px',
        width: size + 'px',
        top: 0,
        left: 0,
        y: top,
        x: left,
        background: color,
        rotation: spinVal
    })
    particle.appendTo(particles);
    particleCount++;
    updateParticleCount();
    particleArr.push(particle);

    var ySetter = gsap.quickSetter(particle, "y", "px"),
        xSetter = gsap.quickSetter(particle, "x", "px"),
        oSetter = gsap.quickSetter(particle, "opacity"),
        rSetter = gsap.quickSetter(particle, "rotation", "deg");

    particle.update = function () {
        time = time - life;
        left = left - (speedHorz * direction);
        top = top - speedUp;
        speedUp = Math.min(size, speedUp - 1);
        spinVal = spinVal + spinSpeed;

        ySetter(top);
        xSetter(left);
        oSetter(((time / otime) / 2) + .25);
        rSetter(spinVal);

        if (time <= 0 || left <= -size || left >= wWidth + size || top >= wHeight + size) {
            particle.remove();
            particleCount--;
            updateParticleCount();
            var index = particleArr.indexOf(particle);
            if (index > -1) {
                particleArr.splice(index, 1);
            }
        }
    }
}

gsap.ticker.add(function () {
    $(particleArr).each(function (i) {
        if (this.update) {
            this.update();
        }
    });
})