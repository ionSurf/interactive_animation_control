let flareObject;

var a;

const canvas = document.querySelector('#canvas1');
const coordI = document.querySelector('#indicator');

const rootNodeSlider01 = document.querySelector('#root-x-scale');
const rootNodeSlider02 = document.querySelector("#root-y-scale");

const rectangleScaleXSlider = document.querySelector("#rectangle-x-scale");
const rectangleScaleYSlider = document.querySelector("#rectangle-y-scale");

const animationSlider01 = document.querySelector("#rectangle-width-animation");

/*Rx.Observable.fromEvent(animationSlider01, 'input').subscribe( (e) => {
  console.log(e);
});*/

function onMouseCoordsChangeHandle(event) {
    coordI.textContent = `Coordinates: ${event.clientX}, ${event.clientY} : cursor at : ${ event.clientX * 2.0 / 512 }`;
}

const mouseStream = Rx.Observable
  .fromEvent(canvas, 'mousemove');

const sliderStream01 = Rx.Observable
  .fromEvent( rootNodeSlider01, 'input' ).pluck('target', 'value'); //console.log(sliderStream01);

const myInputStream = Rx.Observable.fromEvent( document, 'mousemove' );

/*myInputStream.subscribe( (event) => {
  console.log('x: ' + event.clientX);
} );

myInputStream.subscribe( (event) => {
  console.log('y: ' + event.clientY);
} );*/

const sliderStream03 = Rx.Observable
  .fromEvent( animationSlider01, 'input' ).pluck('target', 'value'); //console.log(sliderStream01);

/*Rx.Observable
  .fromEvent(canvas, 'mousemove')
  .subscribe((event) => {
    onMouseCoordsChangeHandle(event)
  });*/

mouseStream.subscribe((event) => {
    onMouseCoordsChangeHandle(event);
});

function onLoad() {
  flareObject = new FlareObject(
    document.getElementById("canvas1"),
    function () {
      flareObject.load("./assets/rectangleAnimationLoopsA.flr", function (error) {
        if (error) {
          console.log("failed to load actor file...", error);
        }
      });
      flareObject.setSize(512, 384);
      
      /**
       * Mouse events handlers
       */
      mouseStream.subscribe( (event) => {
          flareObject.updateAnimation('SquareHeightAnimation',(event.clientX * 2.0 / 512));
      } );

      sliderStream03.subscribe( (event) => {
        flareObject.updateAnimation('SquareWidthAnimation',(event.clientX * 2.0 / 512));
      } );

      sliderStream01.subscribe((value) => {
        flareObject.updateNodeScaleX({
          nodeName: 'Rectangle',
          nodeValue: value * 0.01
        });
      });

      /*rootNodeSlider01.oninput = function() {
        flareObject.updateNodePosition({
            nodeName: 'Rectangle',
            nodeValue: this.value
        });
      }*/

      rootNodeSlider02.oninput = function() {
        flareObject.updateNodePosition({
            nodeName: 'rectangleNode',
            nodeValue: this.value
        });
      }

      animationSlider01.oninput = function() {
        flareObject.updateAnimation({
          animationName: 'RectangleWidthAnimation',
          cursorPosition: this.value,
          relative: true
        });
      }
    }
  );
}