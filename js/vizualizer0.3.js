import heart from './../img/heart.svg'
import blackHeart from './../img/blackHeart.svg'

export default class Vizualizer {

    constructor(id, dataLength) {
        if (typeof AudioContext !== "undefined") {
            this.audioContext = new AudioContext();
        } else if (typeof webkitAudioContext !== "undefined") {
            this.audioContext = new webkitAudioContext();
        } else {
            throw new Error('AudioContext not supported. :(');
        }
        this.audioElement = document.getElementById(id);
        this.audioSrc = this.audioContext.createMediaElementSource(this.audioElement);
        this.analyser = this.audioContext.createAnalyser();
        this.audioSrc.connect(this.analyser);
        this.audioSrc.connect(this.audioContext.destination);
        this.dataArray = new Uint8Array(dataLength);
        this.frequencyData = this.analyser.getByteFrequencyData(this.dataArray);
        this.width = document.getElementsByTagName("body")[0].clientWidth;
        this.height = document.getElementsByTagName("body")[0].clientHeight;

        this.svg = d3.select("body").append("svg")
            .attr("width", this.width)
            .attr("height", this.height);
    }

    // Bar Vizualizer

    initBars(barNumber) {
        this.barNumber = barNumber;
        this.bars = this.svg.selectAll("rect").data(this.dataArray).enter().append("rect");
        this.bars.attr("width", this.width / this.barNumber)
            .attr("y", this.height / 2)
            .attr("x", function (data, i) { return (this.width / this.barNumber * i); }.bind(this))
            .attr("style", "fill:#000;");
    }

    setAttributeBars(attribut, value) {
        this.bars.attr(attribut, value);
    }

    renderBars() {
        this.analyser.getByteFrequencyData(this.dataArray);
        this.bars.data(this.dataArray)
            .attr("height", function (data) { return (1 + 0.5 * this.height * data / 255); }.bind(this))
            .attr("style", function (data) { return "fill: rgb(" + 125 + "," + (255 - data) + "," + data + ");"; });
    }

    // Star Visualizer

    initStars(starsNumber) {
        this.starsNumber = starsNumber;
        this.stars = this.svg.selectAll("circle")
            .data(this.dataArray)
            .enter()
            .append("circle");
        this.stars.attr("cx", function (data) { return Math.random() * this.width; }.bind(this))
            .attr("cy", function (data) { return Math.random() * this.height; }.bind(this))
            .attr("fill", "#fff");
    }

    setAttributeStars(attribut, value) {
        this.stars.attr(attribut, value);
    }

    renderStars() {
        this.analyser.getByteFrequencyData(this.dataArray);
        this.stars.data(this.dataArray)
            .attr("style", function (data) { return "opacity:" + data / 255 + ";"; })
            .attr("r", function (data) { return data / 255 * 10; });
    }

    // Text Visualizer

    initText(text, y, x) {
        x = x || this.width / 2;
        y = y || this.height / 2;

        this.text = this.svg.append("text")
            .data(this.dataArray)
            .text(text)
            .attr("font-size", 0)
            .attr("fill", "#fff")
            .attr("opacity", "0.7")
            .attr("text-anchor", "middle")
            .attr("x", x)
            .attr("y", y);
    }

    setAttributeText(attribut, value) {
        this.text.attr(attribut, value);
    }

    renderText() {
        this.analyser.getByteFrequencyData(this.dataArray);
        this.text.data(this.dataArray)
            .attr("font-size", 50 + d3.mean(this.dataArray) * 0.5 * this.height / 255);
    }

    //Circle Visualizer

    initCircle() {
        this.circle = this.svg.append("circle")
            .data(this.dataArray)
            .attr("cx", this.width / 2)
            .attr("cy", this.height / 2)
            .attr("stroke-width", 2)
            .attr("stroke", "#fff")
            .attr("fill", "none")
            .attr("opacity", "0.7");
    }

    setAttributeCircle(attribut, value) {
        this.circle.attr(attribut, value);
    }

    renderCircle() {
        this.analyser.getByteFrequencyData(this.dataArray);
        this.circle.data(this.dataArray)
            .attr("r", 150 + d3.mean(this.dataArray) * 0.5 * this.height / 255);
    }

    //Image Visualizer

    initImage(href, width, height, x, y) {
        width = width || this.width / 2;
        height = height || this.height / 2;
        x = x || this.width / 4;
        y = y || this.height / 4;

        this.image = this.svg.append("image")
            .data(this.dataArray)
            .attr("x", x)
            .attr("y", y)
            .attr("width", width)
            .attr("height", height)
            .attr("xlink:href", href)
            .attr("preserveAspectRatio", "xMidYMid slice");
        this.image.x = x;
        this.image.y = y;
        this.image.width = width;
        this.image.height = height;
    }

    setAttributeImage(attribut, value) {
        this.image.attr(attribut, value);
    }

    renderImage() {
        const scaleCoeff = 1 + d3.mean(this.dataArray) / 255;
        this.analyser.getByteFrequencyData(this.dataArray);
        this.image.data(this.dataArray)
            .attr("transform", "scale(" + scaleCoeff + ")")
            .attr("x", this.image.x - (this.image.width * scaleCoeff - this.image.width) / scaleCoeff)
            .attr("y", this.image.y - (this.image.height * scaleCoeff - this.image.height) / scaleCoeff);
    }

    //Vizualizer Functions

    changeAudio(src) {
        this.audioElement.setAttribute("src", src);
    }

    start() {
        requestAnimationFrame(this.renderFunction);
    }

    stop() {
        this.audioElement.pause();
    }

    setRenderFunction(renderFunction) {
        this.renderFunction = renderFunction;
    }

    // A Little Story

    releaseHeart() {
        this.heart = this.svg
            .selectAll("image")
            .data(this.dataArray)
            .enter()
            .append("image")
            .attr("x", this.width - 175)
            .attr("y", this.height - 100)
            .attr("width", 25)
            .attr("height", 25)
            .attr("xlink:href", heart)
            .attr("preserveAspectRatio", "xMidYMid slice")
            .attr("fill", "#fff")
            .transition()
            .attr("x", function (data, i) { return Math.random() * 2000 - 1000; })
            .attr("y", function (data, i) { return -Math.random() * 1000 - 30; })
            .duration(10000)
            .delay(function (data, i) { return i / 896 * 10000; });

        this.blackHeart = this.svg.append("image")
            .attr("width", 25)
            .attr("height", 25)
            .attr("x", this.width - 175)
            .attr("y", this.height - 100)
            .attr("opacity", 0)
            .attr("xlink:href", blackHeart);
        this.blackHeart
            .transition()
            .attr("x", this.width / 2)
            .attr("y", this.height / 2)
            .attr("opacity", 1)
            .duration(10000)
            .delay(7000)
            .transition()
            .attr("x", -this.width / 2 * 4)
            .attr("y", -this.height / 2 * 4)
            .attr("width", this.width * 5)
            .attr("height", this.height * 5)
            .duration(5000);
    }

    releaseCircles() {
        const i = 0;
        const radius = 150 + 255 * 0.5 * this.height / 255;

        this.circles = this.svg
            .append("circle")
            .attr("cx", this.width / 2)
            .attr("cy", this.height / 2)
            .attr("stroke-width", 2)
            .attr("stroke", "#fff")
            .attr("fill", "none")
            .attr("opacity", "0")
            .attr("r", 50);

        this.circles
            .transition()
            .attr("opacity", 1)
            .duration(5000)
            .transition()
            .attr("opacity", 0)
            .attr("r", radius)
            .duration(500)
            .transition()
            .attr("r", 50)
            .attr("opacity", 1)
            .duration(10)
            .transition()
            .attr("opacity", 0)
            .attr("r", radius)
            .duration(500)
            .transition()
            .attr("r", 50)
            .attr("opacity", 1)
            .duration(10)
            .transition()
            .attr("opacity", 0)
            .attr("r", radius)
            .duration(100)
            .transition()
            .attr("r", 50)
            .attr("opacity", 1)
            .duration(10)
            .transition()
            .attr("opacity", 0)
            .attr("r", radius)
            .duration(500)
            .transition()
            .attr("r", 50)
            .attr("opacity", 1)
            .duration(10)
            .transition()
            .attr("opacity", 0)
            .attr("r", radius)
            .duration(500)
            .transition()
            .attr("r", 50)
            .attr("opacity", 1)
            .duration(10)
            .transition()
            .attr("opacity", 0)
            .attr("r", radius)
            .duration(500)
            .transition()
            .attr("r", 50)
            .attr("opacity", 1)
            .duration(10)
            .transition()
            .attr("opacity", 0)
            .attr("r", radius)
            .duration(500)
            .transition()
            .attr("r", 50)
            .attr("opacity", 1)
            .duration(10)
            .transition()
            .attr("opacity", 0)
            .attr("r", radius)
            .duration(500)
            .transition()
            .attr("r", 50)
            .attr("opacity", 1)
            .duration(10)
            .transition()
            .attr("opacity", 0)
            .attr("r", radius)
            .duration(500)
            .transition()
            .attr("r", 50)
            .attr("opacity", 1)
            .duration(10)
            .transition()
            .attr("opacity", 0)
            .attr("r", radius)
            .duration(500)
            .transition()
            .attr("r", 50)
            .attr("opacity", 1)
            .duration(10)
            .transition()
            .attr("opacity", 0)
            .attr("r", radius)
            .duration(500);
    }

    releaseColorSquare() {
        this.colorSquare = this.svg.append("rect")
            .attr("x", this.width + 150)
            .attr("y", this.height / 2 - 100)
            .attr("height", 100)
            .attr("width", 100)
            .attr("fill", "#7E45E8");

        this.colorSquare.transition()
            .attr("x", this.width / 2 + 100)
            .duration(10000);
    }

    changeColorSquareColor(color, duration) {
        this.colorSquare.transition()
            .style("fill", color)
            .duration(duration);
    }

    startColorSquareBoom() {
        this.colorSquare.transition()
            .style("fill", "#9FFF6D")
            .attr("y", this.height / 2 - 125)
            .duration(1000)
            .ease("linear")
            .transition()
            .style("fill", "#7E45E8")
            .attr("y", this.height / 2 - 150)
            .duration(800)
            .ease("linear")
            .transition()
            .style("fill", "#B0FFAD")
            .attr("y", this.height / 2 - 175)
            .duration(800)
            .ease("linear")
            .transition()
            .style("fill", "#6D60E8")
            .attr("y", this.height / 2 - 210)
            .duration(800)
            .ease("linear")
            .transition()
            .style("fill", "#9FFF6D")
            .attr("y", this.height / 2 - 160)
            .duration(500)
            .ease("linear")
            .transition()
            .style("fill", "#7E45E8")
            .attr("y", this.height / 2 - 100)
            .ease("linear")
            .duration(400)
            .transition()
            .attr("opacity", 0)
            .duration(500);
    }

    createMainCharacter() {
        let text;
        this.man = {};
        this.man.headXpos = this.width / 2;
        this.man.headYpos = this.height / 2 - 100;
        this.man.head = this.svg.append("circle")
            .attr("r", 20)
            .attr("stroke", "#000")
            .attr("stroke-width", 2)
            .attr("fill", "#f0f0f0")
            .attr("cx", this.width / 2)
            .attr("cy", this.height / 2 - 100);
        this.man.leftEye = this.svg.append("circle")
            .attr("r", 2)
            .attr("stroke", "#000")
            .attr("stroke-width", 2)
            .attr("fill", "#000")
            .attr("cx", this.width / 2 + 6)
            .attr("cy", this.height / 2 - 105);
        this.man.rightEye = this.svg.append("circle")
            .attr("r", 2)
            .attr("stroke", "#000")
            .attr("stroke-width", 2)
            .attr("fill", "#000")
            .attr("cx", this.width / 2 - 6)
            .attr("cy", this.height / 2 - 105);

        this.smile = [
            [this.width / 2 - 8, this.height / 2 - 93],
            [this.width / 2 - 2, this.height / 2 - 90],
            [this.width / 2 + 2, this.height / 2 - 90],
            [this.width / 2 + 8, this.height / 2 - 93]
        ];

        text = this.smile[0][0] + "," + this.smile[0][1];
        text += " " + this.smile[1][0] + "," + this.smile[1][1];
        text += " " + this.smile[2][0] + "," + this.smile[2][1];
        text += " " + this.smile[3][0] + "," + this.smile[3][1];

        this.man.smile = this.svg.append("polyline")
            .attr("stroke-width", 2)
            .attr("stroke", "#000")
            .attr("fill", "none")
            .attr("points", text);

        this.man.speech = this.svg.append("text")
            .text("Hello Everybody:")
            .attr("font-size", 40)
            .attr("fill", "#000")
            .attr("opacity", "1")
            .attr("text-anchor", "middle")
            .attr("x", this.width / 2 - 50)
            .attr("y", this.height / 2 - 150);

        this.man.body = this.svg.append("rect")
            .attr("x", this.width / 2 - 25)
            .attr("y", this.height / 2 - 70)
            .attr("width", 50)
            .attr("height", 70)
            .attr("stroke", "#000")
            .attr("stroke-width", 2)
            .attr("fill", "#f0f0f0");
    }

    fadeManSpeech(duration) {
        "use strict";
        this.man.speech.transition()
            .attr("opacity", "0")
            .duration(duration);
    }

    fadeMan(duration) {
        "use strict";
        this.man.head.transition()
            .attr("opacity", "0")
            .duration(duration);
        this.man.body.transition()
            .attr("opacity", "0")
            .duration(duration);
        this.man.smile.transition()
            .attr("opacity", "0")
            .duration(duration);
        this.man.leftEye.transition()
            .attr("opacity", "0")
            .duration(duration);
        this.man.rightEye.transition()
            .attr("opacity", "0")
            .duration(duration);
    }

    appearMan(duration) {
        "use strict";
        this.man.head.transition()
            .attr("opacity", "1")
            .duration(duration);
        this.man.body.transition()
            .attr("opacity", "1")
            .duration(duration);
        this.man.smile.transition()
            .attr("opacity", "1")
            .duration(duration);
        this.man.leftEye.transition()
            .attr("opacity", "1")
            .duration(duration);
        this.man.rightEye.transition()
            .attr("opacity", "1")
            .duration(duration);
    }

    getReadyMan() {
        this.man.head
            .transition()
            .attr("transform", "translate(50, 0)")
            .duration(1000)
            .ease("linear")
            .transition()
            .attr("transform", "translate(" + (this.width - this.man.headXpos - 50) + "," + (this.height - this.man.headYpos - 100) + ")")
            .duration(6000)
            .ease("linear")
            .transition()
            .attr("transform", "translate(" + (this.width - this.man.headXpos + 25) + "," + (this.height - this.man.headYpos - 100) + ")")
            .duration(1000)
            .ease("linear");
        this.man.rightEye
            .transition()
            .attr("transform", "translate(65, 0)")
            .duration(1000)
            .ease("linear")
            .transition()
            .attr("transform", "translate(" + (this.width - this.man.headXpos - 35) + "," + (this.height - this.man.headYpos - 100) + ")")
            .duration(6000)
            .ease("linear")
            .transition()
            .attr("transform", "translate(" + (this.width - this.man.headXpos + 40) + "," + (this.height - this.man.headYpos - 100) + ")")
            .duration(1000)
            .ease("linear");
        this.man.leftEye
            .transition()
            .attr("transform", "translate(10, 0)")
            .duration(200)
            .ease("linear")
            .transition()
            .attr("opacity", 0)
            .duration(20);

        this.man.body
            .transition()
            .attr("transform", "translate(50, 0)")
            .duration(1000)
            .ease("linear")
            .transition()
            .attr("transform", "translate(" + (this.width - this.man.headXpos - 50) + "," + (this.height - this.man.headYpos - 100) + ")")
            .duration(6000)
            .ease("linear")
            .transition()
            .attr("transform", "translate(" + (this.width - this.man.headXpos + 25) + "," + (this.height - this.man.headYpos - 100) + ")")
            .duration(1000)
            .ease("linear");

        this.man.smile
            .transition()
            .attr("transform", "translate(65, 0)")
            .duration(1000)
            .ease("linear")
            .transition()
            .attr("points", this.smile[0][0] + "," + this.smile[0][1] + " " + this.smile[1][0] + "," + this.smile[1][1] + " " + this.smile[2][0] + "," + this.smile[2][1])
            .attr("transform", "translate(" + (this.width - this.man.headXpos - 35) + "," + (this.height - this.man.headYpos - 100) + ")")
            .duration(6000)
            .ease("linear")
            .transition()
            .attr("transform", "translate(" + (this.width - this.man.headXpos + 40) + "," + (this.height - this.man.headYpos - 100) + ")")
            .duration(1000)
            .ease("linear");
    }

    startMainCharacter() {
        this.man.head
            .transition()
            .attr("transform", "translate(" + (this.width - this.man.headXpos - 100) + "," + (this.height - this.man.headYpos - 100) + ")")
            .duration(3000)
            .ease("linear");
        this.man.rightEye
            .attr("transform", "translate(" + (this.width - this.man.headXpos + 15) + "," + (this.height - this.man.headYpos - 100) + ")")
            .transition()
            .attr("transform", "translate(" + (this.width - this.man.headXpos - 105) + "," + (this.height - this.man.headYpos - 100) + ")")
            .duration(3000)
            .ease("linear");

        this.man.body
            .transition()
            .attr("transform", "translate(" + (this.width - this.man.headXpos - 100) + "," + (this.height - this.man.headYpos - 100) + ")")
            .duration(3000)
            .ease("linear");

        this.man.smile
            .attr("transform", "translate(" + (this.width - this.man.headXpos + 7) + "," + (this.height - this.man.headYpos - 100) + ")")
            .attr("points", this.smile[1][0] + "," + this.smile[1][1] + " " + this.smile[2][0] + "," + this.smile[2][1] + " " + this.smile[3][0] + "," + this.smile[3][1])
            .transition()
            .attr("transform", "translate(" + (this.width - this.man.headXpos - 113) + "," + (this.height - this.man.headYpos - 100) + ")")
            .duration(3000)
            .ease("linear");
    }

}
