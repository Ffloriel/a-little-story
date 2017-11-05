
var n, i;
n = 512;
i = 0;

vizualizer.init("audio1", n);
vizualizer.initBars(100);
vizualizer.initStars(n);
vizualizer.initText("Have a good day");
vizualizer.initCircle();
var secondToFrame = function (second) {
    "use strict";
    return 60 * second;
};
i = 0;

document.getElementById("audio1").addEventListener("ended", function () {
    "use strict";
    vizualizer.changeAudio("audio/12%20little%20star.mp3");
    vizualizer.audioElement.play();
    document.getElementById("audio1").addEventListener("ended", function () {
        vizualizer.text.text("The End");
        vizualizer.stop();
    }, false);
}, false);

var renderFunction = function () {
    "use strict";
    setTimeout(function () {
        requestAnimationFrame(this.renderFunction);
        if (i === 1) {
            this.createMainCharacter();
        } else if (i === secondToFrame(3)) {
            this.man.speech.text("Enjoy the show :)");
        } else if (i === secondToFrame(7)) {
            this.man.speech.text("Use Chrome for better compatibility");
        } else if (i === secondToFrame(11)) {
            this.man.speech.text("Advice: FullScreen with F11 then refresh with F5");
        } else if (i === secondToFrame(18)) {
            this.man.speech.text("Ready ? Let's go!");
        } else if (i === secondToFrame(20)) {
            this.getReadyMan();
        } else if (i === secondToFrame(28)) {
            this.audioElement.play();
            this.audioElement.volume = 0.5;
            this.man.speech.attr("font-size", 60);
            this.man.speech.text("A Little Story");
        } else if (i === secondToFrame(32)) {
            this.fadeManSpeech(1000);
            this.startMainCharacter();
        } else if (i === secondToFrame(38)) {
            this.releaseHeart();
        } else if (i === secondToFrame(60)) {
            this.svg.style("background-color", "#000");
            this.blackHeart.remove();
            this.man.head.attr("transform", null);
            this.man.body.attr("transform", null);
            this.man.leftEye.attr("opacity", 1)
                .attr("transform", null);
            this.man.rightEye.attr("transform", null);
            
            this.man.smile.attr("transform", null);
            
            this.man.speech.attr("fill", "white")
                .attr("opacity", 1);
            this.man.speech.text(" ");
            
        } else if (i === secondToFrame(69)) {
            this.releaseCircles();
        } else if (i === secondToFrame(100)) {
            this.circles.remove();
            this.circle.remove();
        } else if (i === secondToFrame(116)) {
            this.fadeMan();
        } else if (i === secondToFrame(130)) {
            this.releaseColorSquare();
        } else if (i === secondToFrame(142)) {
            this.startColorSquareBoom();
        } else if (i === secondToFrame(185)) {
            this.bars.transition()
                .attr("opacity", "0")
                .duration(5000)
                .ease("linear");
        } else if (i === secondToFrame(61)) {//         Poeme
            this.man.speech.text("I am like a god");
        } else if (i === secondToFrame(64)) {
            this.man.speech.text("Who can create everything");
        } else if (i === secondToFrame(68)) {
            this.man.speech.text("The shadow of a planet");
        } else if (i === secondToFrame(72)) {
            this.man.speech.text("Is a beautiful thing");
        } else if (i === secondToFrame(76)) {
            this.man.speech.text("But I am feeling odd");
        } else if (i === secondToFrame(79)) {
            this.man.speech.text("Maybe I am not ready yet");
        } else if (i === secondToFrame(83)) {
            this.man.speech.text("To create something");
        } else if (i === secondToFrame(86)) {
            this.man.speech.text("That will be perfect");
        } else if (i === secondToFrame(89)) {
            this.man.smile
                .attr("points", this.smile[0][0] + "," + this.smile[0][1] + " " + this.smile[1][0] + "," + this.smile[1][1] + " " + this.smile[2][0] + "," + this.smile[2][1] + " " + this.smile[3][0] + "," + this.smile[3][1]);
            this.man.speech.text("Nothing will stop me");
        } else if (i === secondToFrame(92)) {
            this.man.speech.text("I will transform the sky");
        } else if (i === secondToFrame(95)) {
            this.man.speech.text("I hope you are ready");
        } else if (i === secondToFrame(98)) {
            this.man.speech.text("I am prepared to try");
        } else if (i === secondToFrame(103)) {
            this.man.speech.text("Twinkle Twinkle Little Star");
        } else if (i === secondToFrame(107)) {
            this.man.speech.text("The stronger the music is");
        } else if (i === secondToFrame(110)) {
            this.man.speech.text("The brighter you are");
        } else if (i === secondToFrame(114)) {
            this.fadeManSpeech(1000);
        } else if (i === secondToFrame(163)) {
            this.appearMan(1000);
        } else if (i === secondToFrame(165)) {
            this.man.speech.attr("opacity", 1);
            this.man.speech.text("See you soon");
        } else if (i === secondToFrame(170)) {
            this.fadeManSpeech(1000);
            this.fadeMan(1000);
        }

        if (i >= secondToFrame(76) && i < secondToFrame(100)) {
            this.renderCircle();
        } else if (i >= secondToFrame(115) && i < secondToFrame(145)) {
            this.renderStars();
        } else if (i >= secondToFrame(144.5) && i < secondToFrame(185)) {
            this.renderBars();
        } else if (i >= secondToFrame(185)) {
            this.renderStars();
            this.renderText();
        }


        i += 1;
    }.bind(this), 1000 / 60);
}.bind(vizualizer);

vizualizer.setRenderFunction(renderFunction);
vizualizer.start();
