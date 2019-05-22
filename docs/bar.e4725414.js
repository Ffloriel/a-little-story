// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"img/heart.svg":[function(require,module,exports) {
module.exports = "/heart.8b87f66a.svg";
},{}],"img/blackHeart.svg":[function(require,module,exports) {
module.exports = "/blackHeart.4151205e.svg";
},{}],"js/vizualizer0.3.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vizualizer = void 0;

var _heart = _interopRequireDefault(require("./../img/heart.svg"));

var _blackHeart = _interopRequireDefault(require("./../img/blackHeart.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*jslint browser: true, devel: true*/

/*global AudioContext, webkitAudioContext, Uint8Array, d3, requestAnimationFrame*/
var vizualizer = {
  audioElement: 0,
  audioSrc: 0,
  audioContext: 0,
  analyser: 0,
  frequencyData: 0,
  init: function init(id, DataLength) {
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
    this.svg = d3.select("body").append("svg").attr("width", this.width).attr("height", this.height);
  },
  //Bar Visualizer
  initBars: function initBars(barNumber) {
    "use strict";

    this.barNumber = barNumber;
    this.bars = this.svg.selectAll("rect").data(this.dataArray).enter().append("rect");
    this.bars.attr("width", this.width / this.barNumber).attr("y", this.height / 2).attr("x", function (data, i) {
      return this.width / this.barNumber * i;
    }.bind(this)).attr("style", "fill:#000;"); //.attr("transform",  "scale(1, -1) translate(0, -" + this.height + ")");
  },
  setAttributeBars: function setAttributeBars(attribut, value) {
    "use strict";

    this.bars.attr(attribut, value);
  },
  renderBars: function renderBars() {
    "use strict";

    this.analyser.getByteFrequencyData(this.dataArray);
    this.bars.data(this.dataArray).attr("height", function (data) {
      return 1 + 0.5 * this.height * data / 255;
    }.bind(this)).attr("style", function (data) {
      return "fill: rgb(" + 125 + "," + (255 - data) + "," + data + ");";
    });
  },
  //Star Visualizer
  initStars: function initStars(starsNumber) {
    "use strict";

    this.starsNumber = starsNumber;
    this.stars = this.svg.selectAll("circle").data(this.dataArray).enter().append("circle");
    this.stars.attr("cx", function (data) {
      return Math.random() * this.width;
    }.bind(this)).attr("cy", function (data) {
      return Math.random() * this.height;
    }.bind(this)).attr("fill", "#fff");
  },
  setAttributeStars: function setAttributeStars(attribut, value) {
    "use strict";

    this.stars.attr(attribut, value);
  },
  renderStars: function renderStars() {
    "use strict";

    this.analyser.getByteFrequencyData(this.dataArray);
    this.stars.data(this.dataArray).attr("style", function (data) {
      return "opacity:" + data / 255 + ";";
    }).attr("r", function (data) {
      return data / 255 * 10;
    });
  },
  //Text Visualizer
  initText: function initText(text, y, x) {
    "use strict";

    if (typeof x === "undefined") {
      x = this.width / 2;
    }

    if (typeof y === "undefined") {
      y = this.height / 2;
    }

    this.text = this.svg.append("text").data(this.dataArray).text(text).attr("font-size", 0).attr("fill", "#fff").attr("opacity", "0.7").attr("text-anchor", "middle").attr("x", x).attr("y", y);
  },
  setAttributeText: function setAttributeText(attribut, value) {
    "use strict";

    this.text.attr(attribut, value);
  },
  renderText: function renderText() {
    "use strict";

    this.analyser.getByteFrequencyData(this.dataArray);
    this.text.data(this.dataArray).attr("font-size", 50 + d3.mean(this.dataArray) * 0.5 * this.height / 255);
  },
  //Circle Visualizer
  initCircle: function initCircle() {
    "use strict";

    this.circle = this.svg.append("circle").data(this.dataArray).attr("cx", this.width / 2).attr("cy", this.height / 2).attr("stroke-width", 2).attr("stroke", "#fff").attr("fill", "none").attr("opacity", "0.7");
  },
  setAttributeCircle: function setAttributeCircle(attribut, value) {
    "use strict";

    this.circle.attr(attribut, value);
  },
  renderCircle: function renderCircle() {
    "use strict";

    this.analyser.getByteFrequencyData(this.dataArray);
    this.circle.data(this.dataArray).attr("r", 150 + d3.mean(this.dataArray) * 0.5 * this.height / 255);
  },
  //Image Visualizer
  initImage: function initImage(href, width, height, x, y) {
    "use strict";

    if (typeof width === "undefined") {
      width = this.width / 2;
    }

    if (typeof height === "undefined") {
      height = this.height / 2;
    }

    if (typeof x === "undefined") {
      x = this.width / 4;
    }

    if (typeof y === "undefined") {
      y = this.height / 4;
    }

    this.image = this.svg.append("image").data(this.dataArray).attr("x", x).attr("y", y).attr("width", width).attr("height", height).attr("xlink:href", href).attr("preserveAspectRatio", "xMidYMid slice");
    this.image.x = x;
    this.image.y = y;
    this.image.width = width;
    this.image.height = height;
  },
  setAttributeImage: function setAttributeImage(attribut, value) {
    "use strict";

    this.image.attr(attribut, value);
  },
  renderImage: function renderImage() {
    "use strict";

    var scaleCoeff;
    scaleCoeff = 1 + d3.mean(this.dataArray) / 255;
    this.analyser.getByteFrequencyData(this.dataArray);
    this.image.data(this.dataArray).attr("transform", "scale(" + scaleCoeff + ")").attr("x", this.image.x - (this.image.width * scaleCoeff - this.image.width) / scaleCoeff).attr("y", this.image.y - (this.image.height * scaleCoeff - this.image.height) / scaleCoeff);
  },
  //Vizualizer Functions
  changeAudio: function changeAudio(src) {
    "use strict";

    this.audioElement.setAttribute("src", src);
  },
  start: function start() {
    "use strict"; //this.audioElement.play();

    requestAnimationFrame(this.renderFunction);
  },
  stop: function stop() {
    "use strict";

    this.audioElement.pause();
  },
  setRenderFunction: function setRenderFunction(renderFunction) {
    "use strict";

    this.renderFunction = renderFunction;
  },
  // A Little Story
  releaseHeart: function releaseHeart() {
    "use strict";

    this.heart = this.svg.selectAll("image").data(this.dataArray).enter().append("image").attr("x", this.width - 175).attr("y", this.height - 100).attr("width", 25).attr("height", 25).attr("xlink:href", _heart.default).attr("preserveAspectRatio", "xMidYMid slice").attr("fill", "#fff").transition().attr("x", function (data, i) {
      return Math.random() * 2000 - 1000;
    }).attr("y", function (data, i) {
      return -Math.random() * 1000 - 30;
    }).duration(10000).delay(function (data, i) {
      return i / 896 * 10000;
    });
    this.blackHeart = this.svg.append("image").attr("width", 25).attr("height", 25).attr("x", this.width - 175).attr("y", this.height - 100).attr("opacity", 0).attr("xlink:href", _blackHeart.default);
    this.blackHeart.transition().attr("x", this.width / 2).attr("y", this.height / 2).attr("opacity", 1).duration(10000).delay(7000).transition().attr("x", -this.width / 2 * 4).attr("y", -this.height / 2 * 4).attr("width", this.width * 5).attr("height", this.height * 5).duration(5000);
  },
  releaseCircles: function releaseCircles() {
    "use strict";

    var i, radius;
    i = 0;
    radius = 150 + 255 * 0.5 * this.height / 255;
    this.circles = this.svg.append("circle").attr("cx", this.width / 2).attr("cy", this.height / 2).attr("stroke-width", 2).attr("stroke", "#fff").attr("fill", "none").attr("opacity", "0").attr("r", 50);
    this.circles.transition().attr("opacity", 1).duration(5000).transition().attr("opacity", 0).attr("r", radius).duration(500).transition().attr("r", 50).attr("opacity", 1).duration(10).transition().attr("opacity", 0).attr("r", radius).duration(500).transition().attr("r", 50).attr("opacity", 1).duration(10).transition().attr("opacity", 0).attr("r", radius).duration(100).transition().attr("r", 50).attr("opacity", 1).duration(10).transition().attr("opacity", 0).attr("r", radius).duration(500).transition().attr("r", 50).attr("opacity", 1).duration(10).transition().attr("opacity", 0).attr("r", radius).duration(500).transition().attr("r", 50).attr("opacity", 1).duration(10).transition().attr("opacity", 0).attr("r", radius).duration(500).transition().attr("r", 50).attr("opacity", 1).duration(10).transition().attr("opacity", 0).attr("r", radius).duration(500).transition().attr("r", 50).attr("opacity", 1).duration(10).transition().attr("opacity", 0).attr("r", radius).duration(500).transition().attr("r", 50).attr("opacity", 1).duration(10).transition().attr("opacity", 0).attr("r", radius).duration(500).transition().attr("r", 50).attr("opacity", 1).duration(10).transition().attr("opacity", 0).attr("r", radius).duration(500).transition().attr("r", 50).attr("opacity", 1).duration(10).transition().attr("opacity", 0).attr("r", radius).duration(500);
  },
  releaseColorSquare: function releaseColorSquare() {
    "use strict";

    this.colorSquare = this.svg.append("rect").attr("x", this.width + 150).attr("y", this.height / 2 - 100).attr("height", 100).attr("width", 100).attr("fill", "#7E45E8");
    this.colorSquare.transition().attr("x", this.width / 2 + 100).duration(10000); //.ease("linear");
  },
  changeColorSquareColor: function changeColorSquareColor(color, duration) {
    "use strict";

    this.colorSquare.transition().style("fill", color).duration(duration);
  },
  startColorSquareBoom: function startColorSquareBoom() {
    "use strict";

    this.colorSquare.transition().style("fill", "#9FFF6D").attr("y", this.height / 2 - 125).duration(1000).ease("linear").transition().style("fill", "#7E45E8").attr("y", this.height / 2 - 150).duration(800).ease("linear").transition().style("fill", "#B0FFAD").attr("y", this.height / 2 - 175).duration(800).ease("linear").transition().style("fill", "#6D60E8").attr("y", this.height / 2 - 210).duration(800).ease("linear").transition().style("fill", "#9FFF6D").attr("y", this.height / 2 - 160).duration(500).ease("linear").transition().style("fill", "#7E45E8").attr("y", this.height / 2 - 100).ease("linear").duration(400).transition().attr("opacity", 0).duration(500);
  },
  createMainCharacter: function createMainCharacter() {
    "use strict";

    var text;
    this.man = {};
    this.man.headXpos = this.width / 2;
    this.man.headYpos = this.height / 2 - 100;
    this.man.head = this.svg.append("circle").attr("r", 20).attr("stroke", "#000").attr("stroke-width", 2).attr("fill", "#f0f0f0").attr("cx", this.width / 2).attr("cy", this.height / 2 - 100);
    this.man.leftEye = this.svg.append("circle").attr("r", 2).attr("stroke", "#000").attr("stroke-width", 2).attr("fill", "#000").attr("cx", this.width / 2 + 6).attr("cy", this.height / 2 - 105);
    this.man.rightEye = this.svg.append("circle").attr("r", 2).attr("stroke", "#000").attr("stroke-width", 2).attr("fill", "#000").attr("cx", this.width / 2 - 6).attr("cy", this.height / 2 - 105);
    this.smile = [[this.width / 2 - 8, this.height / 2 - 93], [this.width / 2 - 2, this.height / 2 - 90], [this.width / 2 + 2, this.height / 2 - 90], [this.width / 2 + 8, this.height / 2 - 93]];
    text = this.smile[0][0] + "," + this.smile[0][1];
    text += " " + this.smile[1][0] + "," + this.smile[1][1];
    text += " " + this.smile[2][0] + "," + this.smile[2][1];
    text += " " + this.smile[3][0] + "," + this.smile[3][1];
    this.man.smile = this.svg.append("polyline").attr("stroke-width", 2).attr("stroke", "#000").attr("fill", "none").attr("points", text);
    this.man.speech = this.svg.append("text").text("Hello Everybody:").attr("font-size", 40).attr("fill", "#000").attr("opacity", "1").attr("text-anchor", "middle").attr("x", this.width / 2 - 50).attr("y", this.height / 2 - 150);
    this.man.body = this.svg.append("rect").attr("x", this.width / 2 - 25).attr("y", this.height / 2 - 70).attr("width", 50).attr("height", 70).attr("stroke", "#000").attr("stroke-width", 2).attr("fill", "#f0f0f0");
  },
  fadeManSpeech: function fadeManSpeech(duration) {
    "use strict";

    this.man.speech.transition().attr("opacity", "0").duration(duration);
  },
  fadeMan: function fadeMan(duration) {
    "use strict";

    this.man.head.transition().attr("opacity", "0").duration(duration);
    this.man.body.transition().attr("opacity", "0").duration(duration);
    this.man.smile.transition().attr("opacity", "0").duration(duration);
    this.man.leftEye.transition().attr("opacity", "0").duration(duration);
    this.man.rightEye.transition().attr("opacity", "0").duration(duration);
  },
  appearMan: function appearMan(duration) {
    "use strict";

    this.man.head.transition().attr("opacity", "1").duration(duration);
    this.man.body.transition().attr("opacity", "1").duration(duration);
    this.man.smile.transition().attr("opacity", "1").duration(duration);
    this.man.leftEye.transition().attr("opacity", "1").duration(duration);
    this.man.rightEye.transition().attr("opacity", "1").duration(duration);
  },
  getReadyMan: function getReadyMan() {
    "use strict";

    this.man.head.transition().attr("transform", "translate(50, 0)").duration(1000).ease("linear").transition().attr("transform", "translate(" + (this.width - this.man.headXpos - 50) + "," + (this.height - this.man.headYpos - 100) + ")").duration(6000).ease("linear").transition().attr("transform", "translate(" + (this.width - this.man.headXpos + 25) + "," + (this.height - this.man.headYpos - 100) + ")").duration(1000).ease("linear");
    this.man.rightEye.transition().attr("transform", "translate(65, 0)").duration(1000).ease("linear").transition().attr("transform", "translate(" + (this.width - this.man.headXpos - 35) + "," + (this.height - this.man.headYpos - 100) + ")").duration(6000).ease("linear").transition().attr("transform", "translate(" + (this.width - this.man.headXpos + 40) + "," + (this.height - this.man.headYpos - 100) + ")").duration(1000).ease("linear");
    this.man.leftEye.transition().attr("transform", "translate(10, 0)").duration(200).ease("linear").transition().attr("opacity", 0).duration(20);
    this.man.body.transition().attr("transform", "translate(50, 0)").duration(1000).ease("linear").transition().attr("transform", "translate(" + (this.width - this.man.headXpos - 50) + "," + (this.height - this.man.headYpos - 100) + ")").duration(6000).ease("linear").transition().attr("transform", "translate(" + (this.width - this.man.headXpos + 25) + "," + (this.height - this.man.headYpos - 100) + ")").duration(1000).ease("linear");
    this.man.smile.transition().attr("transform", "translate(65, 0)").duration(1000).ease("linear").transition().attr("points", this.smile[0][0] + "," + this.smile[0][1] + " " + this.smile[1][0] + "," + this.smile[1][1] + " " + this.smile[2][0] + "," + this.smile[2][1]).attr("transform", "translate(" + (this.width - this.man.headXpos - 35) + "," + (this.height - this.man.headYpos - 100) + ")").duration(6000).ease("linear").transition().attr("transform", "translate(" + (this.width - this.man.headXpos + 40) + "," + (this.height - this.man.headYpos - 100) + ")").duration(1000).ease("linear");
  },
  startMainCharacter: function startMainCharacter() {
    "use strict";

    this.man.head.transition().attr("transform", "translate(" + (this.width - this.man.headXpos - 100) + "," + (this.height - this.man.headYpos - 100) + ")").duration(3000).ease("linear");
    this.man.rightEye.attr("transform", "translate(" + (this.width - this.man.headXpos + 15) + "," + (this.height - this.man.headYpos - 100) + ")").transition().attr("transform", "translate(" + (this.width - this.man.headXpos - 105) + "," + (this.height - this.man.headYpos - 100) + ")").duration(3000).ease("linear");
    this.man.body.transition().attr("transform", "translate(" + (this.width - this.man.headXpos - 100) + "," + (this.height - this.man.headYpos - 100) + ")").duration(3000).ease("linear");
    this.man.smile.attr("transform", "translate(" + (this.width - this.man.headXpos + 7) + "," + (this.height - this.man.headYpos - 100) + ")").attr("points", this.smile[1][0] + "," + this.smile[1][1] + " " + this.smile[2][0] + "," + this.smile[2][1] + " " + this.smile[3][0] + "," + this.smile[3][1]).transition().attr("transform", "translate(" + (this.width - this.man.headXpos - 113) + "," + (this.height - this.man.headYpos - 100) + ")").duration(3000).ease("linear");
  }
};
exports.vizualizer = vizualizer;
},{"./../img/heart.svg":"img/heart.svg","./../img/blackHeart.svg":"img/blackHeart.svg"}],"audio/12-little-star.mp3":[function(require,module,exports) {
module.exports = "/12-little-star.b49e61c6.mp3";
},{}],"js/bar.js":[function(require,module,exports) {
"use strict";

var _vizualizer = require("./vizualizer0.3");

var _littleStar = _interopRequireDefault(require("./../audio/12-little-star.mp3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var n = 512,
    i = 0;

_vizualizer.vizualizer.init("audio1", n);

_vizualizer.vizualizer.initBars(100);

_vizualizer.vizualizer.initStars(n);

_vizualizer.vizualizer.initText("Have a good day");

_vizualizer.vizualizer.initCircle();

var secondToFrame = function secondToFrame(second) {
  return 60 * second;
};

var audioEl = document.getElementById("audio1");
audioEl.addEventListener("ended", function () {
  _vizualizer.vizualizer.changeAudio(_littleStar.default);

  _vizualizer.vizualizer.audioElement.play();

  audioEl.addEventListener("ended", function () {
    _vizualizer.vizualizer.text.text("The End");

    _vizualizer.vizualizer.stop();
  });
});

var renderFunction = function () {
  var _this = this;

  setTimeout(function () {
    requestAnimationFrame(_this.renderFunction);

    switch (i) {
      case 1:
        _this.createMainCharacter();

      case secondToFrame(3):
        _this.man.speech.text("Enjoy the show :)");

        break;

      case secondToFrame(7):
        _this.man.speech.text("Use Chrome for better compatibility");

        break;

      case secondToFrame(11):
        _this.man.speech.text("Advice: FullScreen with F11 then refresh with F5");

        break;

      case secondToFrame(18):
        _this.man.speech.text("Ready ? Let's go!");

        break;

      case secondToFrame(20):
        _this.getReadyMan();

        break;

      case secondToFrame(28):
        _this.audioElement.play();

        _this.audioElement.volume = 0.5;

        _this.man.speech.attr("font-size", 60);

        _this.man.speech.text("A Little Story");

        break;

      case secondToFrame(32):
        _this.fadeManSpeech(1000);

        _this.startMainCharacter();

        break;

      case secondToFrame(38):
        _this.releaseHeart();

        break;

      case secondToFrame(60):
        _this.svg.style("background-color", "#000");

        _this.blackHeart.remove();

        _this.man.head.attr("transform", null);

        _this.man.body.attr("transform", null);

        _this.man.leftEye.attr("opacity", 1).attr("transform", null);

        _this.man.rightEye.attr("transform", null);

        _this.man.smile.attr("transform", null);

        _this.man.speech.attr("fill", "white").attr("opacity", 1);

        _this.man.speech.text(" ");

        break;

      case secondToFrame(69):
        _this.releaseCircles();

        break;

      case secondToFrame(100):
        _this.circles.remove();

        _this.circle.remove();

        break;

      case secondToFrame(116):
        _this.fadeMan();

        break;

      case secondToFrame(130):
        _this.releaseColorSquare();

        break;

      case secondToFrame(142):
        _this.startColorSquareBoom();

        break;

      case secondToFrame(185):
        _this.bars.transition().attr("opacity", "0").duration(5000).ease("linear");

        break;

      case secondToFrame(61):
        // Poeme
        _this.man.speech.text("I am like a god");

        break;

      case secondToFrame(64):
        _this.man.speech.text("Who can create everything");

        break;

      case secondToFrame(68):
        _this.man.speech.text("The shadow of a planet");

        break;

      case secondToFrame(72):
        _this.man.speech.text("Is a beautiful thing");

        break;

      case secondToFrame(76):
        _this.man.speech.text("But I am feeling odd");

        break;

      case secondToFrame(79):
        _this.man.speech.text("Maybe I am not ready yet");

        break;

      case secondToFrame(83):
        _this.man.speech.text("To create something");

        break;

      case secondToFrame(86):
        _this.man.speech.text("That will be perfect");

        break;

      case secondToFrame(89):
        _this.man.smile.attr("points", _this.smile[0][0] + "," + _this.smile[0][1] + " " + _this.smile[1][0] + "," + _this.smile[1][1] + " " + _this.smile[2][0] + "," + _this.smile[2][1] + " " + _this.smile[3][0] + "," + _this.smile[3][1]);

        _this.man.speech.text("Nothing will stop me");

        break;

      case secondToFrame(92):
        _this.man.speech.text("I will transform the sky");

        break;

      case secondToFrame(95):
        _this.man.speech.text("I hope you are ready");

        break;

      case secondToFrame(98):
        _this.man.speech.text("I am prepared to try");

        break;

      case secondToFrame(103):
        _this.man.speech.text("Twinkle Twinkle Little Star");

        break;

      case secondToFrame(107):
        _this.man.speech.text("The stronger the music is");

        break;

      case secondToFrame(110):
        _this.man.speech.text("The brighter you are");

        break;

      case secondToFrame(114):
        _this.fadeManSpeech(1000);

        break;

      case secondToFrame(163):
        _this.appearMan(1000);

        break;

      case secondToFrame(165):
        _this.man.speech.attr("opacity", 1);

        _this.man.speech.text("See you soon");

        break;

      case secondToFrame(170):
        _this.fadeManSpeech(1000);

        _this.fadeMan(1000);

        break;

      default:
        break;
    }

    if (i >= secondToFrame(76) && i < secondToFrame(100)) {
      _this.renderCircle();
    } else if (i >= secondToFrame(115) && i < secondToFrame(145)) {
      _this.renderStars();
    } else if (i >= secondToFrame(144.5) && i < secondToFrame(185)) {
      _this.renderBars();
    } else if (i >= secondToFrame(185)) {
      _this.renderStars();

      _this.renderText();
    }

    i += 1;
  }, 1000 / 60);
}.bind(_vizualizer.vizualizer);

_vizualizer.vizualizer.setRenderFunction(renderFunction);

_vizualizer.vizualizer.start();
},{"./vizualizer0.3":"js/vizualizer0.3.js","./../audio/12-little-star.mp3":"audio/12-little-star.mp3"}],"../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53258" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/bar.js"], null)
//# sourceMappingURL=/bar.e4725414.map