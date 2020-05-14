let flareObject;

const canvas = document.querySelector("#canvas1");
const coordI = document.querySelector("#indicator");

const animationSlider01 = document.querySelector("#rectangle-width-animation");

function onMouseCoordsChangeHandle(event) {
  coordI.textContent = `Coordinates: ${event.layerX}, ${
    event.layerY
  } : cursor at : ${(event.clientX * 2.0) / 512}`;
}

const mouseStream = Rx.Observable.fromEvent(canvas, "mousemove");


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
    flareObject.load("./assets/flr/coffee-grinder-xy-test01.flr", function(error) {
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
        //elapsedTime: (event.clientX * 2.18) / 540
        elapsedAnimation1: (event.layerY * 2.30) / 540,
        elapsedAnimation2: 2.30 - (event.layerX * 2.30) / 540
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