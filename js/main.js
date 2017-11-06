// jshint esversion: 6
$(document).ready(function() {
    $(".play").click(function() {
        // Check if the next button appeared
        var next = $("#nextPom").css("visibility") === "visible";
        // play at first time
        if (!next && $(this).hasClass("start")) {
            //  if timeCalcul is the end and next button is appeared
            $(this).removeClass("start");
            $(this).children("i")
                .removeClass("fa-play")
                .addClass("fa-pause");
            // Hide Up Down button
            $(".timeUp ,.timeDown").css("visibility", "hidden");
            // Dot animation . -> .. -> ...
            timePannel.blinkDot();
            // Assign start setup time in order to cacul progress percentage
            timeCalcul.start = $(".timeNotice li:nth-child(1)").html() * 60;
            // Start time count Down
            timeCalcul.count();
            // Start draw pie
            pie.draw();

        }
        // play -> pause
        else if (!next && !$(this).hasClass("paused")) {
            $(this).addClass("paused");
            $(this).children("i")
                .removeClass("fa-pause")
                .addClass("fa-play");
            // init min ... -> min .
            $(".timeNotice li:nth-child(3)").html(".");
            // Stop dot animation
            timePannel.blinkDotCancel();
            // blink time notice
            timePannel.blinkTimeNotice();
            // pause count timeCalcul
            timeCalcul.countCancel();
            console.log("paused, current timeCalcul.remain: " + timeCalcul.remain);
            console.log("paused, current pie.currentStepAngle: " + pie.currentStepAngle);
            // pause pie animation
            pie.drawCancel();
        }
        // pause -> resume
        else if (!next && $(this).hasClass("paused")) {
            $(this).removeClass("paused");
            $(this).children("i")
                .removeClass("fa-play")
                .addClass("fa-pause");
            // Dot animation . -> .. -> ...
            timePannel.blinkDot();
            // cancel blink time notice
            timePannel.blinkTimeNoticeCancel();
            // resume count down timeCalcul
            timeCalcul.count();
            // draw pie
            pie.draw();
        }
    });

    $(".resetOne").click(function() {
        timePannel.init();
        pomsPannel.resetOne();
        timeCalcul.init();
        pie.init();
    });

    $(".resetAll").click(function() {
        timePannel.init();
        pomsPannel.resetAll();
        timeCalcul.init();
        pie.init();
    });

    $(".timeUp").click(function() {
        var currTime = $(".timeNotice li:nth-child(1)").html();
        if (currTime < 45) {
            $(".timeNotice li:nth-child(1)").html(+currTime + 1);
            // add 5min to timeCalcul.remain
            timeCalcul.set(1 * 60);
        }
    });

    $(".timeDown").click(function() {
        var currTime = $(".timeNotice li:nth-child(1)").html();
        if (currTime > 0) {
            $(".timeNotice li:nth-child(1)").html(+currTime - 1);
            // remove 5min to timeCalcul.remain
            timeCalcul.set(-1 * 60);
        }
    });

    $("#nextPom").click(function() {
        timePannel.init();
        pomsPannel.flag = 0;
        $(this).css("visibility", "hidden");
        timeCalcul.init();
        pie.init();
    });

    var timePannel = {
        intervalIDDot: null,
        intervalIDNotice: null,
        init: function() {
            $(".play")
                .removeClass("paused")
                .removeClass("start")
                .addClass("start");
            $(".play").children("i")
                .removeClass("fa-pause")
                .addClass("fa-play");
            // Stop dot animation
            this.blinkDotCancel();
            // Visible Up Down button
            $(".timeUp ,.timeDown").css("visibility", "visible");
            // init 00 min -> 25 min
            $(".timeNotice li:nth-child(1)").html("25");
            // init min ... -> min .
            $(".timeNotice li:nth-child(3)").html(".");
            // stop blink time notice
            this.blinkTimeNoticeCancel();
            // timeCalcul init
            timeCalcul.init();
            // indicate next >> button
            $(".timePannel .nextPom").css("visibility", "hidden");
            // ctrCenter.init();
        },
        blinkDot: function() {
            this.intervalIDDot = window.setInterval(callback, 1000);

            function callback() {
                var currText = $(".timeNotice li:nth-child(3)").html();
                if (currText !== "...") {
                    $(".timeNotice li:nth-child(3)").html(currText + ".");
                } else {
                    $(".timeNotice li:nth-child(3)").html("");
                }
            }
        },
        blinkDotCancel: function() {
            window.clearInterval(this.intervalIDDot);
        },
        blinkTimeNotice: function() {
            this.intervalIDNotice = window.setInterval(callback, 1000);

            function callback() {
                if ($(".timeNotice").css("visibility") === "visible") {
                    $(".timeNotice").css("visibility", "hidden");
                } else {
                    $(".timeNotice").css("visibility", "visible");
                }
            }
        },
        blinkTimeNoticeCancel: function() {
            window.clearInterval(this.intervalIDNotice);
            $(".timeNotice").css("visibility", "visible");

        },
        countDown: function() {
            var temp = timeCalcul.remain / 60;
            $(".timeNotice li:nth-child(1)").html(Math.floor(temp) + 1);
        },
    };

    var timeCalcul = {
        start: null,
        remain: 25 * 60,
        intervalIDRemain: null,
        set: function(s) {
            this.remain += s;
            pie.oneStepAngleSet();
            console.log("timeCalcul.remain: ", this.remain);
            console.log("pie.oneStepAngle: ", pie.oneStepAngle);
        },
        init: function() {
            this.start = null;
            this.remain = 25 * 60;
            this.countCancel();
        },
        count: function() {
            this.intervalIDRemain = window.setInterval(callback.bind(timeCalcul), 1000);

            function callback() {
                if (this.remain >= 0) {
                    --this.remain;
                    timePannel.countDown();
                    // update percentage of progress
                    pomsPannel.update();
                } else {
                    ctrCenter.end();
                }

            }
        },
        countCancel: function() {
            window.clearInterval(this.intervalIDRemain);
            console.log("count canceled: ", this.remain, this.intervalIDRemain);
        }
    };

    var pie = {
        ctx: document.getElementById('canvas').getContext('2d'),
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: canvas.width / 2 * 0.7,
        fps: 5,
        oneStepAngle: (2 / timeCalcul.remain / 5).toFixed(5),
        oneStepAngleSet: function() {
            this.oneStepAngle = (2 / timeCalcul.remain / 5).toFixed(5);
        },
        currentStepAngle: null,
        intervalIDPie: null,
        init: function() {
            this.currentStepAngle = null;
            this.drawCancel();
            this.oneStepAngleSet();
            this.clear();

            // background shade
            this.ctx.beginPath();
            this.ctx.strokeStyle = "#F7F7F7";
            this.ctx.lineWidth = 15;
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            this.ctx.stroke();

            //round end, bevel join, not at top or left of canvas
            this.ctx.beginPath();
            this.ctx.strokeStyle = "#E33E25";
            this.ctx.lineWidth = 4;
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            this.ctx.stroke();
        },
        draw: function() {
            if (this.currentStepAngle <= 2) {
                this.intervalIDPie = window.setInterval(callback.bind(pie), 1000 / this.fps);
            }

            function callback() {
                this.clear();

                // background shade
                this.ctx.beginPath();
                this.ctx.strokeStyle = "#F7F7F7";
                this.ctx.lineWidth = 15;
                this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                this.ctx.stroke();

                //round end, bevel join, not at top or left of canvas
                this.ctx.beginPath();
                this.ctx.strokeStyle = "#E33E25";
                this.ctx.lineWidth = 4;
                this.ctx.arc(this.x, this.y, this.radius, (-0.5 + this.currentStepAngle) * Math.PI, 1.5 * Math.PI, false); // full circle
                if (this.currentStepAngle <= 2) {
                    this.ctx.stroke();
                }

                this.currentStepAngle = +((+this.currentStepAngle + +this.oneStepAngle).toFixed(5));
                console.log("pie.currentStepAngle: ", pie.currentStepAngle);
            }
        },
        drawCancel: function() {
            window.clearInterval(this.intervalIDPie);
            console.log("intervalIDPie: ", this.intervalIDPie);
        },
        drawEnd: function() {
            this.clear();
            // background shade
            this.ctx.beginPath();
            this.ctx.strokeStyle = "#F7F7F7";
            this.ctx.lineWidth = 15;
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            this.ctx.stroke();
        },
        clear: function() {
            this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

    } // end of pie;

    var pomsPannel = {
        flag: 0,
        stat: [0, 0, 0, 0],
        update: function() {
            // Convert from remain to ongoing, meaning, percentage 0 to 100;
            var percentage = 100 - timeCalcul.remain / timeCalcul.start * 100;
            // if percentage === 25 || 50 || 75 || 100
            if ((percentage % 25 === 0) && (percentage / 25 > this.flag)) {
                this.flag = percentage / 25;
                for (var i = 0; i < 4; i++) {
                    if (this.stat[i] < 4) {
                        this.stat[i]++;
                        break;
                    }
                }
                this.draw();
            } else {
                // flagging to start - 1 % ~ 24 %
                this.flag = -1;
            }
        },
        resetOne: function() {
            if (this.flag === -1) {
                this.flag = 0;
            } else {
                for (var i = 3; i > -1; i--) {
                    if (this.stat[i] > 0) {
                        this.stat[i] = 0;
                        this.flag = 0;
                        this.draw();
                        break;
                    }
                }
            }
        },
        resetAll: function() {
            for (var i = 0; i < this.stat.length; i++) {
                this.stat[i] = 0;
            }
            console.log(this.stat);
            this.flag = 0;
            this.draw();
        },
        draw: function() {
            console.log("pomsPannel stat: ", this.stat);
            for (var i = 0; i < 4; i++) {
                var select = "#pom" + (i + 1) + ">circle";
                var rate = this.stat[i] * 25 + " 100";
                $(select).css("stroke-dasharray", rate);
            }
        }
    };

    var ctrCenter = {
        init: function() {
            pie.init();
        },
        start: function() {},
        pause: function() {},
        resume: function() {},
        end: function() {
            timeCalcul.countCancel();
            timePannel.blinkDotCancel();
            // indicate next >> button
            $(".timePannel .nextPom").css("visibility", "visible");
            pie.drawCancel();
            pie.drawEnd();
            console.log("timeCalcul.remain: ", timeCalcul.remain);
        }
    };

    ctrCenter.init();
    timePannel.init();
}); // end of document
