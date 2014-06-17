module.exports = Kineograph;

/**
*		Initialize a new `Kineograph`.
*
*		@api public
*/

function Kineograph(imgs) {

	if(!document || !imgs) return;

	var self = document.createElement('div');

	self.className = 'kineograph';

	if(imgs instanceof Array)
		imgs = {'_default':imgs};

	for(var i in imgs){
		for(var j in imgs[i]){
			image(imgs[i][j], i);
		}
	}

	/**
	*		Public variables
	*
	*		@api public
	*/

	var _images = {};
	var _animations = [];
	var _animating = undefined;
	var _unloop = false;
	var _unloop_callback = undefined;
	var _timeouts = [];
	var _finish = false;
	var _fps = 25;

	/**
	*		Add an animation to the end of the cue and start playing if it isn't already.
	*
	*		@param {String} ani - the animation name to add
	*		@param {Number} loop - the number of times the animation should play
	*		@param {Function} callback - the optional method to call when finished
	*		@return {Kineograph}
	*		@api public
	*/

	self.play = function(ani, loop, callback){

		add(ani, loop, callback)
		
		if(!_animating) self.next();

		return self;
		
	}

	/**
	*		Begin animating the next animation in the cue
	*
	*		@return {Kineograph}
	*		@api public
	*/

	self.next = function(){

		_unloop = false;
		self.stop();

		if(!_animations.length){ _animating = false; return; }

		_animating = _animations.shift();
		
		play(_animating.ani, _animating.loop, _animating.callback)

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

		_unloop = true;
		_unloop_callback = callback;

		return self;

	}

	/**
	*		Stop any currently playing animations, without prejudice.
	*
	*		@return {Kineograph}
	*		@api public
	*/

	self.stop = function(){

		while(_timeouts.length){
			
			clearTimeout(_timeouts.shift());
		
		}

		_animating = undefined;

		return self;

	}

	/**
	*		Change the fps.
	*
	*		@return {Kineograph}
	*		@api public
	*/

	self.fps = function(val){

		if(typeof val === 'number')
			_fps = val;

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

		if(_images[key])
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
	*		@api private
	*/

	function add(ani, loop, callback){

		ani = typeof ani === 'string' ? ani : '_default';
		loop = typeof loop === 'number' ? parseInt(loop) : 1;

		if(!_images[ani])
			throw new Error(ani + ' does not exist');

		_animations.push({ani:ani, loop:loop, callback:callback});

	}

	/**
	*		Play a sequence of images from start to end
	*
	*		@param {String} ani - the animation name to play
	*		@param {Number} loop - the number of times the animation should play
	*		@param {Function} callback - the optional method to call when finished
	*		@api private
	*/

	function play(ani, loop, callback){

		var indefinate = !loop;
		
		loop--;

		for(var i = 0; i < _images[ani].length; i++){
			
			var timeout = setTimeout(function(img, last){
				
				return function(){

					show(img);

					if(last){

						if(indefinate && !_unloop){
							play(ani, loop, callback);
						}else{
							if(!loop || _unloop){
								if(callback)
									callback();
								if(_unloop_callback)
									_unloop_callback();
								self.next();
							}else{
								play(ani, loop, callback);
							}
						}
					}
				}

			}(_images[ani][i], !(i < _images[ani].length - 1)), 1000 / _fps * i);

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

		if(_showing)
			_showing.style.visibility = 'hidden';

		_showing = img;

	}

  return self;

};

