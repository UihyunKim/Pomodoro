// jshint esversion: 6
$(document).ready(function() {
    $(".pause").click(function() {
        if (!$(this).hasClass("paused")) {
            $(this).addClass("paused");
            timeGraph.pause();
        } else {
            $(this).removeClass("paused");
            timeGraph.resume();
        }
    });

    $(".reset").click(function() {
        $(".pause").removeClass("paused");
        timeGraph.init();
    });

    function canvasApp() {
        var theCanvas = document.getElementById('canvas');
        if (!theCanvas || !theCanvas.getContext) return;
        var context = theCanvas.getContext('2d');
        if (!context) return;

        var canvas = {
            drawScreen: function(pausePoint) {
                var radian = Math.PI / 180;
                var x = theCanvas.width / 2;
                var y = theCanvas.height / 2;
                var radius = x * 0.7;
                // background shadow circle
                context.beginPath();
                context.strokeStyle = "#F7F7F7";
                context.lineWidth = 15;
                context.arc(x, y, radius, 0, radian * 360);
                context.stroke();
                context.closePath();

                //round end, bevel join, not at top or left of canvas
                context.beginPath();
                context.strokeStyle = "#E33E25";
                context.lineWidth = 5;
                context.arc(x, y, radius, radian * -90, radian * (pausePoint - 90), false); // full circle
                context.stroke();
                context.closePath();
                // console.log(pausePoint, pausePoint - 90);
                timeGraph.timeStock.shift();
            },
            clear: function() {
                console.log("clear works");
                context.clearRect(0, 0, theCanvas.width, theCanvas.height);
            }
        }; // end of var canvas obj;

        return canvas;
    } // end of canvasApp();

    function canvasPoms() {
        var theCanvas = document.getElementById('canvas');
        if (!theCanvas || !theCanvas.getContext) return;
        var context = theCanvas.getContext('2d');
        if (!context) return;

        var canvas = {
            drawScreen: function(pausePoint) {
                var radian = Math.PI / 180;
                var x = theCanvas.width / 2;
                var y = theCanvas.height / 2;
                var radius = x * 0.7;
                console.log(x, y);

                //round end, bevel join, not at top or left of canvas
                context.beginPath();
                context.strokeStyle = "#E33E25";
                context.lineWidth = 5;
                context.arc(x, y, radius, radian * -90, radian * (pausePoint - 90), false); // full circle
                context.stroke();
                context.closePath();
                // console.log(pausePoint, pausePoint - 90);
                timeGraph.timeStock.shift();
            },
            clear: function() {
                console.log("clear works");
                context.clearRect(0, 0, theCanvas.width, theCanvas.height);
            }
        }; // end of var canvas obj;

        return canvas;
    } // end of canvasPoms();

    var timeGraph = {
        timeStock: [],
        time: null,
        interval: null,
        pausePoint: 0,
        init: function() {
            this.timeStock = [];
            this.time = null;
            this.interval = null;
            this.pausePoint = 0;
            console.log("init clicked");
            canvasApp().clear();
        },
        start: function() {
            if (this.interval === null) this.interval = this.time / 360;
            for (var i = 0; i <= 360 - this.pausePoint; i++) {
                var timeID = setTimeout(canvasApp().drawScreen, this.interval * i, this.pausePoint + i);
                this.timeStock.push(timeID);
            }
            console.log(this.timeStock);
        },
        pause: function() {
            this.pausePoint = 360 - this.timeStock.length;
            for (var i = 0; i < this.timeStock.length; i++) {
                clearTimeout(this.timeStock[i]);
            }
            console.log(this.pausePoint);
        },
        resume: function() {
            this.timeStock = [];
            this.start();
        }
    };

    timeGraph.time = 1000;
    timeGraph.start();
}); // end of document
