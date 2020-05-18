let flareObject;

const canvas = document.querySelector("#canvas1");
const coordI = document.querySelector("#indicator");

const rootNodeSlider01 = document.querySelector("#root-x-scale");
const rootNodeSlider02 = document.querySelector("#root-y-scale");

const rectangleScaleXSlider = document.querySelector("#rectangle-x-scale");
const rectangleScaleYSlider = document.querySelector("#rectangle-y-scale");

const animationSlider01 = document.querySelector("#rectangle-width-animation");

function onMouseCoordsChangeHandle(event) {
  coordI.textContent = `Coordinates: ${event.clientX}, ${
    event.clientY
  } : cursor at : ${(event.clientX * 2.0) / 512}`;
}

const mouseStream = Rx.Observable.fromEvent(canvas, "mousemove");

const sliderStream01 = Rx.Observable.fromEvent(rootNodeSlider01, "input").pluck(
  "target",
  "value"
); //console.log(sliderStream01);

const myInputStream = Rx.Observable.fromEvent(document, "mousemove");

const sliderStream03 = Rx.Observable.fromEvent(
  animationSlider01,
  "input"
).pluck("target", "value"); //console.log(sliderStream01);

mouseStream.subscribe(event => {
  onMouseCoordsChangeHandle(event);
});

function onLoad() {
  flareObject = new FlareObject(document.getElementById("canvas1"), function() {
    flareObject.load("./lib/flr/coffee-grinds2.flr", function(error) {
      if (error) {
        console.log("failed to load actor file...", error);
      } else {
        // Clear loader
        document.querySelector("html").style.overflow = "visible";
        document.querySelector("body").style.overflow = "visible";
        document.querySelector("#splash-screen").style.display = "none";
      }
    });
    flareObject.setSize(540, 540);

    /**
     * Mouse events handlers
     */

    mouseStream.subscribe(event => {
      //console.log( event );
      flareObject.updateAnimation({
        animationName: "mainAnimation",
        //elapsedTime: (event.clientX * 2.18) / 540
        elapsedTime: (event.layerX * 2.18) / 540
      });
      //flareObject.updateAnimation('mainAnimation',(event.clientX * 2.0 / 540));
    });
    
    /*sliderStream01.subscribe((value) => {
        flareObject.updateNodeScaleX({
          nodeName: 'Rectangle',
          nodeValue: value * 0.01
        });*/
  });
}