(function () {

	var root = this;

  if (typeof module !== 'undefined' && module.exports)
    module.exports = factory;
  else
    root.kineograph = factory;

  function factory (imgs) {

    return new Kineograph(imgs);

  }

	/**
	*		Initialize a new `Kineograph`.
	*
	*		@api public
	*/

	function Kineograph(imgs) {

		if (!document || !imgs) return;

		var _images = {};
		var _animations = [];
		var _animating = undefined;
		var _showing = undefined;
		var _unloop = false;
		var _unloop_callback = undefined;
		var _timeouts = [];
		var _finish = false;
		var _fps = 25;
		var _enabled = true;

		var self = document.createElement('div');

		self.className = 'kineograph';

		if (imgs instanceof Array)
			imgs = {'_default':imgs};

		for(var i in imgs){
			for(var j in imgs[i]){
				image(imgs[i][j], i);
			}
		}

		/**
		*		Add an animation to the end of the cue and start playing if it isn't already.
		*
		*		@param {String} ani - the animation name to add
		*		@param {Number} loop - the number of times the animation should play
		*		@param {Function} callback - the optional method to call when finished
		*		@param {Number} duration - a duration for the animation, this will affect the frame rate
		*		@return {Kineograph}
		*		@api public
		*/

		self.play = function(ani, loop, callback, duration){

			if (!_enabled){ return self; }

			add(ani, loop, callback, duration);
			
			if (!_animating) self.next();

			return self;
			
		}

		/**
		*		Begin animating the next animation in the cue
		*
		*		@return {Kineograph}
		*		@api public
		*/

		self.next = function(){

			if (!_enabled){ return self; }

			_unloop = false;
			self.stop();

			if (!_animations.length){ _animating = false; return; }

			_animating = _animations.shift();
			
			play(_animating.ani, _animating.loop, _animating.callback, _animating.fps)

			return self;

		}

		/**
		*		Unloop any currently looping animations and allow the sequence to move onwards.
		*
		*		@param {Function} callback - callback which is called when the loop has finished gracefully
		*		@return {Kineograph}
		*		@api public
		*/

		self.unloop = function(callback){

			if (!_enabled){ return self; }

			_unloop = true;
			_unloop_callback = callback;

			return self;

		}

		/**
		*		Stop any currently playing animations, without prejudice.
		*
		*		@param {boolean} clear - whether to clear the current animations
		*		@return {Kineograph}
		*		@api public
		*/

		self.stop = function(clear){

			if (!_enabled){ return self; }

			while(_timeouts.length){
				
				clearTimeout(_timeouts.shift());
			
			}

			_animating = undefined;

			if (clear){

				while(_animations.length){

					_animations.shift();

				}
			}

			return self;

		}

		/**
		*		Change the fps.
		*
		*		@param {Number} fps - the desired frames per second
		*		@return {Kineograph}
		*		@api public
		*/

		self.fps = function(fps){

			if (!_enabled){ return self; }

			if (typeof fps === 'number')
				_fps = fps;

			return self;

		}

		/**
		*		Enable/disable the animation so as to accept/reject calls to its api.
		*
		*		@param {Boolean} enable - whether to enable or disable the Kineograph
		*		@return {Kineograph}
		*		@api public
		*/

		self.enable = function(enable){

			if (typeof enable === 'undefined')
				enable = true;

			_enabled = enable;

			return self;

		}

		/**
		*		Add a frame to the animation
		*
		*		@param {String} path - the relative path to the image
		*		@param {String} key - an animtion name for the image
		*		@api private
		*/

		function image(path, key){

			var img = self.appendChild( document.createElement( 'img' ) );
			img.src = path;
			img.style.visibility = 'hidden';

			if (_images[key])
				_images[key].push(img);
			else
				_images[key] = [img];

		}

		/**
		*		Add an animation to the cue
		*
		*		@param {String} ani - the animation name to add
		*		@param {Number} loop - the number of times the animation should play
		*		@param {Function} callback - the optional method to call when finished
		*		@param {Number} duration - a duration for the animation, this will affect the frame rate
		*		@api private
		*/

		function add(ani, loop, callback, duration){

			ani = typeof ani === 'string' ? ani : '_default';
			loop = typeof loop === 'number' ? parseInt(loop) : 1;

			if (!_images[ani])
				throw new Error(ani + ' does not exist');
				
			var fps = duration ? _images[ani].length / (duration / 1000) : _fps;

			_animations.push({ani:ani, loop:loop, callback:callback, fps:fps});

		}

		/**
		*		Play a sequence of images from start to end
		*
		*		@param {String} ani - the animation name to play
		*		@param {Number} loop - the number of times the animation should play
		*		@param {Function} callback - the optional method to call when finished
		*		@param {Number} fps - the fps that this particular animation should play at
		*		@api private
		*/

		function play(ani, loop, callback, fps){

			var indefinate = !loop;
			
			loop--;

			for(var i = 0; i < _images[ani].length; i++){
				
				var timeout = setTimeout(function(img, last){
					
					return function(){

						show(img);

						if (last){

							if (indefinate && !_unloop){
								play(ani, loop, callback, fps);
							}else{
								if (!loop || _unloop){
									if (callback)
										callback.apply(self);
									if (_unloop_callback)
										_unloop_callback.apply(self);
									self.next();
								}else{
									play(ani, loop, callback, fps);
								}
							}
						}
					}

				}(_images[ani][i], !(i < _images[ani].length - 1)), 1000 / fps * i);

				_timeouts.push(timeout);

			}
		}

		/**
		*		Show a particular image
		*
		*		@param {HTMLElement} img - the image element to show
		*		@api private
		*/

		function show(img){

			img.style.visibility = 'visible';

			if (_showing)
				_showing.style.visibility = 'hidden';

			_showing = img;

		}

	  return self;

	};
})();