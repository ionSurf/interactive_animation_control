const FlareExample = (function() {
	//const _ViewCenter = [600.0, 600.0];
	const _ViewCenter = [512.0, 384.0];
	//const _Scale = 0.25;
	const _Scale = 0.5;
	const _ScreenScale = 1.0;

	const _ScreenMouse = vec2.create();
	const _WorldMouse = vec2.create();

	/**
	 * @constructs FlareExample
	 * 
	 * @param {Element} canvas - a canvas element object on the html page that's rendering this example.
	 * @param {onReadyCallback} ready - callback that's called after everything's been properly initialized.
	 */
	function FlareExample(canvas, ready)
	{
		/** Build and initialize the Graphics object. */
		this._Graphics = new Flare.Graphics(canvas);
		this._Graphics.initialize(() =>
		{
			this._LastAdvanceTime = Date.now();
			this._ViewTransform = mat2d.create();
			this._AnimationInstance = null;
			this._AnimationInstance2 = null;
			this._Animation = null;
			this._Animation2 = null;
			this._SoloSkaterAnimation = null;

			const _This = this;

			/** Start the render loop. */
			//_ScheduleAdvance(_This);
			//_Advance(_This);

			document.addEventListener("keydown", function(ev)
			{
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
	function _Advance(_This)
	{
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

		if (_This._AnimationInstance2)
		{ 
			const ai2 = _This._AnimationInstance2;
			/** Compute the new time and apply it */
			ai2.time = ai2.time + elapsed;
			ai2.apply(_This._ActorInstance, 1.0);
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
	function _Draw(viewer, graphics)
	{
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
	function _ScheduleAdvance(viewer)
	{
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
	FlareExample.prototype.load = function(url, callback)
	{
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
	FlareExample.prototype.setActor = function(actor)
	{
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

		if (actorInstance)
		{
			/*console.log(actorInstance.root.x);
			actorInstance.root.x = 450;
			console.log(actorInstance.root.x);*/
			//console.log(actorInstance.root);

			/** ActorArtboard.initialize() */
			actorInstance.initialize(this._Graphics);
			if (actorInstance._Animations.length)
			{
				/** Instantiate the Animation. */
				this._Animation = actorInstance._Animations[0];
				this._AnimationInstance = new Flare.AnimationInstance(this._Animation._Actor, this._Animation);

				this._Animation2 = actorInstance._Animations[1];
				this._AnimationInstance2 = new Flare.AnimationInstance(this._Animation2._Actor, this._Animation2);

				if (!this._AnimationInstance)
				{
					console.log("NO ANIMATION IN HERE!?");
					return;
				}


				if (!this._AnimationInstance2)
				{
					console.log("NO ANIMATION IN HERE!?");
					return;
				}

			}
		}
	};

	/** Set the renderer's viewport to the desired width/height. */
	FlareExample.prototype.setSize = function(width, height)
	{
		this._Graphics.setSize(width, height);
	};

	/**
	 * Animate elements based on mouse x position on canvas.
	 * 
	 * @param {String} animationName - The name of the animation
	 * @param {float} percentage - The elapsed anmimation duration.
	 */
	FlareExample.prototype.updateAnimation = function( animationName, percentage ) {
		const actor = this._Actor;
		const actorArtboardInstance = this._ActorInstance;
		const animationInstance = this._AnimationInstance;

		if ( actor && actorArtboardInstance ) {
	
		/*const elapsed = (now - _This._LastAdvanceTime) / 1000.0;
		_This._LastAdvanceTime = now;

		const actor = _This._ActorInstance; */

		if (animationInstance) { 
			const ai = animationInstance;
			/** Compute the new time and apply it */
			//ai.time = ai.time + elapsed;
			ai.time = percentage;
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
			actorArtboardInstance.advance(percentage);
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
	 * Animate elements based on mouse x position on canvas.
	 * 
	 * @param {String} animationName - The name of the animation
	 * @param {float} percentage - The elapsed anmimation duration.
	 */
	FlareExample.prototype.updateNodePosition = function({ nodeName, nodeValue }) {
		// Default use node
		//console.log( nodeName, nodeValue );
		const actorArtboardInstance = this._ActorInstance;
		if (actorArtboardInstance) {
			console.log(actorArtboardInstance);
			actorArtboardInstance.root.scaleX = nodeValue*.01;
			actorArtboardInstance.advance(this._LastAdvanceTime);
			_Draw(this, this._Graphics);
		}
	};

	return FlareExample;
}());