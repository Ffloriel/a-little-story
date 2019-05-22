/*jslint browser: true, devel: true*/
/*global AudioContext, webkitAudioContext, Uint8Array, d3, requestAnimationFrame*/

import heart from './../img/heart.svg'
import blackHeart from './../img/blackHeart.svg'

export var vizualizer = {
    audioElement: 0,
    audioSrc: 0,
    audioContext: 0,
    analyser: 0,
    frequencyData: 0,
    init: function (id, DataLength) {
        "use strict";
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
        this.dataArray = new Uint8Array(DataLength);
        this.frequencyData = this.analyser.getByteFrequencyData(this.dataArray);
        this.width = document.getElementsByTagName("body")[0].clientWidth;
        this.height = document.getElementsByTagName("body")[0].clientHeight;

        this.svg = d3.select("body").append("svg")
            .attr("width", this.width)
            .attr("height", this.height);
    },

    //Bar Visualizer

    initBars: function (barNumber) {
        "use strict";
        this.barNumber = barNumber;
        this.bars = this.svg.selectAll("rect").data(this.dataArray).enter().append("rect");
        this.bars.attr("width", this.width / this.barNumber)
            .attr("y", this.height / 2)
            .attr("x", function (data, i) { return (this.width / this.barNumber * i); }.bind(this))
            .attr("style", "fill:#000;");
        //.attr("transform",  "scale(1, -1) translate(0, -" + this.height + ")");
    },
    setAttributeBars: function (attribut, value) {
        "use strict";
        this.bars.attr(attribut, value);
    },
    renderBars: function () {
        "use strict";
        this.analyser.getByteFrequencyData(this.dataArray);
        this.bars.data(this.dataArray)
            .attr("height", function (data) { return (1 + 0.5 * this.height * data / 255); }.bind(this))
            .attr("style", function (data) { return "fill: rgb(" + 125 + "," + (255 - data) + "," + data + ");"; });
    },

    //Star Visualizer

    initStars: function (starsNumber) {
        "use strict";
        this.starsNumber = starsNumber;
        this.stars = this.svg.selectAll("circle")
            .data(this.dataArray)
            .enter()
            .append("circle");
        this.stars.attr("cx", function (data) { return Math.random() * this.width; }.bind(this))
            .attr("cy", function (data) { return Math.random() * this.height; }.bind(this))
            .attr("fill", "#fff");
    },
    setAttributeStars: function (attribut, value) {
        "use strict";
        this.stars.attr(attribut, value);
    },
    renderStars: function () {
        "use strict";
        this.analyser.getByteFrequencyData(this.dataArray);
        this.stars.data(this.dataArray)
            .attr("style", function (data) { return "opacity:" + data / 255 + ";"; })
            .attr("r", function (data) { return data / 255 * 10; });
    },

    //Text Visualizer

    initText: function (text, y, x) {
        "use strict";
        if (typeof (x) === "undefined") {
            x = this.width / 2;
        }
        if (typeof (y) === "undefined") {
            y = this.height / 2;
        }
        this.text = this.svg.append("text")
            .data(this.dataArray)
            .text(text)
            .attr("font-size", 0)
            .attr("fill", "#fff")
            .attr("opacity", "0.7")
            .attr("text-anchor", "middle")
            .attr("x", x)
            .attr("y", y);
    },
    setAttributeText: function (attribut, value) {
        "use strict";
        this.text.attr(attribut, value);
    },
    renderText: function () {
        "use strict";
        this.analyser.getByteFrequencyData(this.dataArray);
        this.text.data(this.dataArray)
            .attr("font-size", 50 + d3.mean(this.dataArray) * 0.5 * this.height / 255);
    },

    //Circle Visualizer

    initCircle: function () {
        "use strict";
        this.circle = this.svg.append("circle")
            .data(this.dataArray)
            .attr("cx", this.width / 2)
            .attr("cy", this.height / 2)
            .attr("stroke-width", 2)
            .attr("stroke", "#fff")
            .attr("fill", "none")
            .attr("opacity", "0.7");
    },
    setAttributeCircle: function (attribut, value) {
        "use strict";
        this.circle.attr(attribut, value);
    },
    renderCircle: function () {
        "use strict";
        this.analyser.getByteFrequencyData(this.dataArray);
        this.circle.data(this.dataArray)
            .attr("r", 150 + d3.mean(this.dataArray) * 0.5 * this.height / 255);
    },

    //Image Visualizer
    initImage: function (href, width, height, x, y) {
        "use strict";
        if (typeof (width) === "undefined") {
            width = this.width / 2;
        }
        if (typeof (height) === "undefined") {
            height = this.height / 2;
        }
        if (typeof (x) === "undefined") {
            x = this.width / 4;
        }
        if (typeof (y) === "undefined") {
            y = this.height / 4;
        }
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
    },
    setAttributeImage: function (attribut, value) {
        "use strict";
        this.image.attr(attribut, value);
    },
    renderImage: function () {
        "use strict";
        var scaleCoeff;
        scaleCoeff = 1 + d3.mean(this.dataArray) / 255;
        this.analyser.getByteFrequencyData(this.dataArray);
        this.image.data(this.dataArray)
            .attr("transform", "scale(" + scaleCoeff + ")")
            .attr("x", this.image.x - (this.image.width * scaleCoeff - this.image.width) / scaleCoeff)
            .attr("y", this.image.y - (this.image.height * scaleCoeff - this.image.height) / scaleCoeff);
    },

    //Vizualizer Functions

    changeAudio: function (src) {
        "use strict";
        this.audioElement.setAttribute("src", src);
    },
    start: function () {
        "use strict";
        //this.audioElement.play();
        requestAnimationFrame(this.renderFunction);
    },
    stop: function () {
        "use strict";
        this.audioElement.pause();
    },
    setRenderFunction: function (renderFunction) {
        "use strict";
        this.renderFunction = renderFunction;

    },

    // A Little Story

    releaseHeart: function () {
        "use strict";
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
    },
    releaseCircles: function () {
        "use strict";
        var i, radius;
        i = 0;
        radius = 150 + 255 * 0.5 * this.height / 255;

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
    },
    releaseColorSquare: function () {
        "use strict";

        this.colorSquare = this.svg.append("rect")
            .attr("x", this.width + 150)
            .attr("y", this.height / 2 - 100)
            .attr("height", 100)
            .attr("width", 100)
            .attr("fill", "#7E45E8");

        this.colorSquare.transition()
            .attr("x", this.width / 2 + 100)
            .duration(10000);
        //.ease("linear");
    },
    changeColorSquareColor: function (color, duration) {
        "use strict";
        this.colorSquare.transition()
            .style("fill", color)
            .duration(duration);
    },
    startColorSquareBoom: function () {
        "use strict";
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
    },

    createMainCharacter: function () {
        "use strict";
        var text;
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
    },
    fadeManSpeech: function (duration) {
        "use strict";
        this.man.speech.transition()
            .attr("opacity", "0")
            .duration(duration);
    },
    fadeMan: function (duration) {
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
    },
    appearMan: function (duration) {
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
    },
    getReadyMan: function () {
        "use strict";
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
    },
    startMainCharacter: function () {
        "use strict";
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



};