

/**
* Streams declaration
*/

/*handleMouseMoveEvent( event ) {
  
}*/

const canvas = document.querySelector('#canvas1');
const coordI = document.querySelector('#INDICATOR'); console.log(coordI);
//var coordI = document.getElementById('#INDICATOR'); console.log(coordI);
//const coordI = document.getElementById('INDICATOR'); console.log(coordI);

const mouseStream = Rx.Observable
  .fromEvent(canvas, 'mousemove');

function onMouseCoordsChangeHandle(event) {
  coordI.textContent = `Coordinates: ${event.clientX}, ${event.clientY}`;
}

/*const mouseCoorObserver = mouseStream.pipe( map( event => `Coordinates: ${event.pageX}, ${event.pageY}` ) )
  .subscribe( val => coordI.innerHTML(val) );*/
/*const mouseCoorObserver = mouseStream.pipe( Rx.operators.map( event => `Coordinates: ${event.pageX}, ${event.pageY}` ) );
console.log(mouseCoorObserver);*/
//.subscribe( val => onMouseCoordsChangeHandle(val) );

/*const mouseCoorObserver = mouseStream.subscribe( () => {
  onMouseCoordsChangeHandle(output.textContent);
} );*/

Rx.Observable
  .fromEvent(canvas, 'mousemove')
  .subscribe((event) => {
    onMouseCoordsChangeHandle(event)
  });

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