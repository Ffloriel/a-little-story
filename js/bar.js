import { vizualizer } from './vizualizer0.3';
import littlestar from './../audio/12-little-star.mp3';

let n = 512,
    i = 0;

vizualizer.init("audio1", n);
vizualizer.initBars(100);
vizualizer.initStars(n);
vizualizer.initText("Have a good day");
vizualizer.initCircle();
const secondToFrame = second => 60 * second;

const audioEl = document.getElementById("audio1");

audioEl.addEventListener("ended", () => {
    vizualizer.changeAudio(littlestar);
    vizualizer.audioElement.play();

    audioEl.addEventListener("ended", () => {
        vizualizer.text.text("The End");
        vizualizer.stop();
    });
});

const renderFunction = function () {
    setTimeout(() => {
        requestAnimationFrame(this.renderFunction);
        switch (i) {
            case 1:
                this.createMainCharacter();
            case secondToFrame(3):
                this.man.speech.text("Enjoy the show :)");
                break;
            case secondToFrame(7):
                this.man.speech.text("Use Chrome for better compatibility");
                break;
            case secondToFrame(11):
                this.man.speech.text("Advice: FullScreen with F11 then refresh with F5");
                break;
            case secondToFrame(18):
                this.man.speech.text("Ready ? Let's go!");
                break;
            case secondToFrame(20):
                this.getReadyMan();
                break;
            case secondToFrame(28):
                this.audioElement.play();
                this.audioElement.volume = 0.5;
                this.man.speech.attr("font-size", 60);
                this.man.speech.text("A Little Story");
                break;
            case secondToFrame(32):
                this.fadeManSpeech(1000);
                this.startMainCharacter();
                break;
            case secondToFrame(38):
                this.releaseHeart();
                break;
            case secondToFrame(60):
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
                break;
            case secondToFrame(69):
                this.releaseCircles();
                break;
            case secondToFrame(100):
                this.circles.remove();
                this.circle.remove();
                break;
            case secondToFrame(116):
                this.fadeMan();
                break;
            case secondToFrame(130):
                this.releaseColorSquare();
                break;
            case secondToFrame(142):
                this.startColorSquareBoom();
                break;
            case secondToFrame(185):
                this.bars.transition()
                    .attr("opacity", "0")
                    .duration(5000)
                    .ease("linear");
                break;
            case secondToFrame(61): // Poeme
                this.man.speech.text("I am like a god");
                break;
            case secondToFrame(64):
                this.man.speech.text("Who can create everything");
                break;
            case secondToFrame(68):
                this.man.speech.text("The shadow of a planet");
                break;
            case secondToFrame(72):
                this.man.speech.text("Is a beautiful thing");
                break;
            case secondToFrame(76):
                this.man.speech.text("But I am feeling odd");
                break;
            case secondToFrame(79):
                this.man.speech.text("Maybe I am not ready yet");
                break;
            case secondToFrame(83):
                this.man.speech.text("To create something");
                break;
            case secondToFrame(86):
                this.man.speech.text("That will be perfect");
                break;
            case secondToFrame(89):
                this.man.smile
                    .attr("points", this.smile[0][0] + "," + this.smile[0][1] + " " + this.smile[1][0] + "," + this.smile[1][1] + " " + this.smile[2][0] + "," + this.smile[2][1] + " " + this.smile[3][0] + "," + this.smile[3][1]);
                this.man.speech.text("Nothing will stop me");
                break;
            case secondToFrame(92):
                this.man.speech.text("I will transform the sky");
                break;
            case secondToFrame(95):
                this.man.speech.text("I hope you are ready");
                break;
            case secondToFrame(98):
                this.man.speech.text("I am prepared to try");
                break;
            case secondToFrame(103):
                this.man.speech.text("Twinkle Twinkle Little Star");
                break;
            case secondToFrame(107):
                this.man.speech.text("The stronger the music is");
                break;
            case secondToFrame(110):
                this.man.speech.text("The brighter you are");
                break;
            case secondToFrame(114):
                this.fadeManSpeech(1000);
                break;
            case secondToFrame(163):
                this.appearMan(1000);
                break;
            case secondToFrame(165):
                this.man.speech.attr("opacity", 1);
                this.man.speech.text("See you soon");
                break;
            case secondToFrame(170):
                this.fadeManSpeech(1000);
                this.fadeMan(1000);
                break;
            default:
                break;
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
    }, 1000 / 60);
}.bind(vizualizer);

vizualizer.setRenderFunction(renderFunction);
vizualizer.start();
