const FlareObject = (function() {
	//const _ViewCenter = [512.0, 384.0];
	const _ViewCenter = [540.0, 540.0];
	const _Scale = 0.769;
	const _ScreenScale = 1.0;

	const _ScreenMouse = vec2.create();
	const _WorldMouse = vec2.create();

	/**
	 * @constructs FlareObject
	 * 
	 * @param {Element} canvas - a canvas element object on the html page that's rendering this example.
	 * @param {onReadyCallback} ready - callback that's called after everything's been properly initialized.
	 */
	function FlareObject(canvas, ready) {
		/** Build and initialize the Graphics object. */
		this._Graphics = new Flare.Graphics(canvas);
		this._Graphics.initialize(() =>
		{
			this._LastAdvanceTime = Date.now();
			this._ViewTransform = mat2d.create();
			this._AnimationInstance = null;
			this._Animation = null;
			this._SoloSkaterAnimation = null;

			// New values
			this._Animations = [];
			this._animationInstances = [];
			this._isAnimaitonPlaying = false;

			const _This = this;

			/** Start the render loop. */
			//_ScheduleAdvance(_This);
			//_Advance(_This);

			document.addEventListener("keydown", function(ev) {
				//console.log('keydown ' + ev.keyCode);
				// 68 D
				// 65 A
				// 39 right
				// 37 left
				switch (ev.keyCode)
				{
					case 32: // Enter
						break;
					case 16: // Shift
						break;
					case 68: // 'D'
					case 39: // right
						break;
					case 65: // 'A'
					case 37: // left
						break;
					case 87:
					case 38:
						break;
					case 11: // Space bar toggles playback
						break;

				}
			});
			/** Call-back. */
			ready();
		}, "../build/",); // -> Matrix connection
	}

	/**
	 * Advance the current viewport and, if present, the AnimationInstance and Actor.
	 * 
	 * @param {Object} _This - the current viewer.
	 */
	function _Advance(_This) {
		//_This.setSize(window.innerWidth, window.innerHeight);

		const now = Date.now();
		const elapsed = (now - _This._LastAdvanceTime) / 1000.0;
		_This._LastAdvanceTime = now;

		const actor = _This._ActorInstance; 

		if (_This._AnimationInstance)
		{ 
			const ai = _This._AnimationInstance;
			/** Compute the new time and apply it */
			ai.time = ai.time + elapsed;
			ai.apply(_This._ActorInstance, 1.0);
		}


		if (actor)
		{
			const graphics = _This._Graphics;

			const w = graphics.viewportWidth;
			const h = graphics.viewportHeight;

			const vt = _This._ViewTransform;
			vt[0] = _Scale;
			vt[3] = _Scale;
			vt[4] = (-_ViewCenter[0] * _Scale + w / 2);
			vt[5] = (-_ViewCenter[1] * _Scale + h / 2);
			/** Advance the actor to its new time. */
			//console.log(actor);
			actor.advance(elapsed);
			//actor.root.x += 0.1;
		}

		_Draw(_This, _This._Graphics);
		/** Schedule a new frame. */
		_ScheduleAdvance(_This);
	}

	/**
	 * Performs the drawing operation onto the canvas.
	 * 
	 * @param {Object} viewer - the object containing the reference to the Actor that'll be drawn.
	 * @param {Object} graphics - the renderer.
	 */
	function _Draw(viewer, graphics) {
		if (!viewer._Actor)
		{
			return;
		}

		//graphics.clear([0.3628, 0.3628, 0.3628, 1.0]);
		//graphics.clear([1.0, 1.0, 1.0, 1.0]);
		graphics.clear([0.3628, 0.3628, 0.3628, 0.0]);
		graphics.setView(viewer._ViewTransform);
		viewer._ActorInstance.draw(graphics);
		graphics.flush();
	}

	/** Schedule the next frame. */
	function _ScheduleAdvance(viewer) {
		clearTimeout(viewer._AdvanceTimeout);
		window.requestAnimationFrame(function()
		{
			_Advance(viewer);
		});
	}

	/**
	 * Loads the Flare file from disk.
	 * 
	 * @param {string} url - the .flr file location.
	 * @param {onSuccessCallback} callback - the callback that's triggered upon a successful load.
	 */
	FlareObject.prototype.load = function(url, callback) {
		const loader = new Flare.ActorLoader();
		const _This = this;
		loader.load(url, function(actor)
		{
			if (!actor || actor.error)
			{
				callback(!actor ? null : actor.error);
			}
			else
			{
				_This.setActor(actor);
				callback();
			}
		});
	};

	/**
	 * Cleans up old resources, and then initializes Actors and Animations, storing the instance references for both.
	 * This is the final step of the setup process for a Flare file.
	 */
	FlareObject.prototype.setActor = function(actor) {
		/** Cleanup */
		if (this._Actor)
		{
			this._Actor.dispose(this._Graphics);
		}
		if (this._ActorInstance)
		{
			this._ActorInstance.dispose(this._Graphics);
		}
		/** Initialize all the Artboards within this Actor. */
		actor.initialize(this._Graphics);

		/** Creates new ActorArtboard instance */
		const actorInstance = actor.makeInstance(); // Makes an instance of an artboard -> actorInstance == ActorArtboardInstance
		actorInstance.initialize(this._Graphics);

		this._Actor = actor;
		this._ActorInstance = actorInstance;

		if (actorInstance) {
			/*console.log(actorInstance.root.x);
			actorInstance.root.x = 450;
			console.log(actorInstance.root.x);*/
			//console.log(actorInstance.root);

			/** ActorArtboard.initialize() */
			actorInstance.initialize(this._Graphics); console.log(actorInstance);
			if (actorInstance._Animations.length) {
				/** Instantiate the Animation. */
				this._Animation = actorInstance._Animations[0];
				this._AnimationInstance = new Flare.AnimationInstance(this._Animation._Actor, this._Animation);


				if (!this._AnimationInstance)
				{
					console.log("NO ANIMATION IN HERE!?");
					return;
				}



			}
		}
	};

	/** Set the renderer's viewport to the desired width/height. */
	FlareObject.prototype.setSize = function(width, height)
	{
		this._Graphics.setSize(width, height);
	};

	/**
	 * Animate elements based on mouse x position on canvas.
	 * 
	 * @param {String} animationName - The name of the animation
	 * @param {float} percentage - The elapsed anmimation duration.
	 */
	FlareObject.prototype.updateAnimation = function( { animationName = '', elapsedTime = 1.0 } ) {
		const actor = this._Actor;
		const actorArtboardInstance = this._ActorInstance;
		const animationInstance = this._AnimationInstance;

		if ( actor && actorArtboardInstance && animationName != '' ) {
			//const actorNode = actorArtboardInstance.animations.find();
	
			/*const elapsed = (now - _This._LastAdvanceTime) / 1000.0;
			_This._LastAdvanceTime = now;

			const actor = _This._ActorInstance; */

			if (animationInstance) { 
				const ai = animationInstance;
				/** Compute the new time and apply it */
				//ai.time = ai.time + elapsed;
				ai.time = elapsedTime;
				ai.apply(actorArtboardInstance, 1.0);
			}

			if (actorArtboardInstance) {
				const graphics = this._Graphics;

				const w = graphics.viewportWidth;
				const h = graphics.viewportHeight;

				const vt = this._ViewTransform;
				vt[0] = _Scale;
				vt[3] = _Scale;
				vt[4] = (-_ViewCenter[0] * _Scale + w / 2);
				vt[5] = (-_ViewCenter[1] * _Scale + h / 2);
				/** Advance the actor to its new time. */
				//console.log(percentage);
				actorArtboardInstance.advance(elapsedTime);
				//actor.root.x += 0.1;
			}

			_Draw(this, this._Graphics);

//			
		} else {
			// Neither an actor nor an ActorArtboardinstance have been created
			return false;
		}
	}

	/**
	 * Change a node's x scale factor.
	 * 
	 * @param {String} animationName - The name of the animation
	 * @param {float} percentage - The elapsed anmimation duration.
	 */
	FlareObject.prototype.updateNodeScaleX = function({ nodeName, nodeValue }) {
		const actorArtboardInstance = this._ActorInstance;
		if (actorArtboardInstance && nodeName != '') {
			const actorNode = actorArtboardInstance.getNode( nodeName ); //console.log( actorNode );
			actorNode.root.scaleX = nodeValue;
			actorArtboardInstance.advance(this._LastAdvanceTime);
			_Draw(this, this._Graphics);
		}
	};

	/**
	 * Change a node's y scale factor.
	 * 
	 * @param {String} animationName - The name of the animation
	 * @param {float} percentage - The elapsed anmimation duration.
	 */
	FlareObject.prototype.updateNodeScaleY = function({ nodeName, nodeValue }) {
		const actorArtboardInstance = this._ActorInstance;
		if (actorArtboardInstance && nodeName != '') {
			const actorNode = actorArtboardInstance.getNode( nodeName ); //console.log( actorNode );
			actorNode.root.scaleY = nodeValue;
			actorArtboardInstance.advance(this._LastAdvanceTime);
			_Draw(this, this._Graphics);
		}
	};

	/**
	 * Change a node's scale factor.
	 * 
	 * @param {String} animationName - The name of the animation
	 * @param {float} percentage - The elapsed anmimation duration.
	 */
	FlareObject.prototype.updateNodeScale = function({ nodeName, nodeValue }) {
		const actorArtboardInstance = this._ActorInstance;
		if (actorArtboardInstance && nodeName != '') {
			const actorNode = actorArtboardInstance.getNode( nodeName ); //console.log( actorNode );
			actorNode.root.scale = nodeValue;
			actorArtboardInstance.advance(this._LastAdvanceTime);
			_Draw(this, this._Graphics);
		}
	};

	/**
	 * Update the node's position based on a vector.
	 * 
	 * @param {String} animationName - The name of the animation
	 * @param {float} percentage - The elapsed anmimation duration.
	 */
	FlareObject.prototype.updateNodePosition = function({ nodeName = '', xPosition = undefined, yPosition = undefined }) {
		const actorArtboardInstance = this._ActorInstance;
		if (actorArtboardInstance && nodeName != '') {
			const actorNode = actorArtboardInstance.getNode( nodeName ); //console.log( actorNode );
			if ( actorNode ) {
				actorNode.x = (xPosition != undefined) ? xPosition : actorNode.x ;
				actorNode.x = (yPosition != undefined) ? yPosition : actorNode.y ;
				actorArtboardInstance.advance(this._LastAdvanceTime);
				_Draw(this, this._Graphics);
			}
		}
	};

	/**
	 * Update the node's position based on a vector.
	 * 
	 * @param {String} animationName - The name of the animation
	 * @param {float} percentage - The elapsed anmimation duration.
	 */
	FlareObject.prototype.updateNodeRotation = function({ nodeName = '', rotation = undefined }) {
		const actorArtboardInstance = this._ActorInstance;
		if (actorArtboardInstance && nodeName != '') {
			const actorNode = actorArtboardInstance.getNode( nodeName ); //console.log( actorNode );
			if ( actorNode ) {
				actorNode.rotation = (rotation != undefined) ? rotation : actorNode.rotation ;
				actorArtboardInstance.advance(this._LastAdvanceTime);
				_Draw(this, this._Graphics);
			}
		}
	};

	/**
	 * Update the node's position based on a vector.
	 * 
	 * @param {String} animationName - The name of the animation
	 * @param {float} percentage - The elapsed anmimation duration.
	 */
	FlareObject.prototype.updateNodeOpacity = function({ nodeName = '', opacity = 1.0 }) {
		const actorArtboardInstance = this._ActorInstance;
		if (actorArtboardInstance && nodeName != '') {
			const actorNode = actorArtboardInstance.getNode( nodeName ); //console.log( actorNode );
			if ( actorNode ) {
				actorNode.opacity = opacity;
				actorArtboardInstance.advance(this._LastAdvanceTime);
				_Draw(this, this._Graphics);
			}
		}
	};

	return FlareObject;
}());