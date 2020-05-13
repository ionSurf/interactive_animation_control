let flareExample;

const canvas = document.querySelector('#canvas1');
const coordI = document.querySelector('#INDICATOR');

const rootNodeSlider01 = document.querySelector('#root-x-scale');
const rootNodeSlider02 = document.querySelector("#root-y-scale");

function onMouseCoordsChangeHandle(event) {
    coordI.textContent = `Coordinates: ${event.clientX}, ${event.clientY} : cursor at : ${ event.clientX * 2.0 / 512 }`;
}

const mouseStream = Rx.Observable
  .fromEvent(canvas, 'mousemove');

const sliderStream01 = Rx.Observable
  .fromEvent( rootNodeSlider01, 'oninput' ); //console.log(sliderStream01);

/*Rx.Observable
  .fromEvent(canvas, 'mousemove')
  .subscribe((event) => {
    onMouseCoordsChangeHandle(event)
  });*/

mouseStream.subscribe((event) => {
    onMouseCoordsChangeHandle(event);
});

function onLoad() {
  flareExample = new FlareExample(
    document.getElementById("canvas1"),
    function () {
      flareExample.load("./assets/rectangleAnimationLoopsA.flr", function (error) {
        if (error) {
          console.log("failed to load actor file...", error);
        }
      });
      flareExample.setSize(512, 384);
      
      /**
       * Mouse events handlers
       */
      mouseStream.subscribe( (event) => {
          flareExample.updateAnimation('SquareHeightAnimation',(event.clientX * 2.0 / 512));
      } );

      rootNodeSlider01.oninput = function() {
        flareExample.updateNodePosition({
            nodeName: 'rectangleNode',
            nodeValue: this.value
        });
      }

      /*sliderStream01.subscribe( (event) => {
          console.log(event);
        flareExample.updateNodePosition({
            nodeName: 'rectangleNode',
            nodeValue: event.value
        });
    } );*/
    }
  );
}


/**
* Streams declaration
*/

/*handleMouseMoveEvent( event ) {
  
}*/


//var coordI = document.getElementById('#INDICATOR'); console.log(coordI);
//const coordI = document.getElementById('INDICATOR'); console.log(coordI);





/*const mouseCoorObserver = mouseStream.pipe( map( event => `Coordinates: ${event.pageX}, ${event.pageY}` ) )
  .subscribe( val => coordI.innerHTML(val) );*/
/*const mouseCoorObserver = mouseStream.pipe( Rx.operators.map( event => `Coordinates: ${event.pageX}, ${event.pageY}` ) );
console.log(mouseCoorObserver);*/
//.subscribe( val => onMouseCoordsChangeHandle(val) );

/*const mouseCoorObserver = mouseStream.subscribe( () => {
  onMouseCoordsChangeHandle(output.textContent);
} );*/



/*const axisDividerObserver = mouseStream.subscribe(
  event =>
);*/

//document.getElementById("root").innerHTML = `${subscription2}`;
/*
const output = document.querySelector('output');
const button = document.querySelector('button');

Rx.Observable
    .fromEvent(document, 'click')
    .subscribe(() => {
      coordI.textContent = Math.random().toString(36).slice(2);
    });*/