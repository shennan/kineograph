module.exports = Kineograph;

/**
*		Initialize a new `Kineograph`.
*
*		@api public
*/

function Kineograph(imgs) {

	if(!document || !imgs) return;

	var el = mixin( document.createElement('div') );

	el.className = 'kineograph';

	if(imgs instanceof Array)
		imgs = {'_default':imgs};

	for(var i in imgs){
		for(var j in imgs[i]){
			image.apply(el, [imgs[i][j], i]);
		}
	}

  return el;

};

/**
*		Public variables
*
*		@api public
*/

Kineograph.prototype._images = {};
Kineograph.prototype._animations = [];
Kineograph.prototype._animating = undefined;
Kineograph.prototype._unloop = false;
Kineograph.prototype._timeouts = [];
Kineograph.prototype._finish = false;
Kineograph.prototype._fps = 25;

/**
*		Add an animation to the end of the cue and start playing if it isn't already.
*
*		@param {String} ani - the animation name to add
*		@param {Number} loop - the number of times the animation should play
*		@param {Function} callback - the optional method to call when finished
*		@return {Kineograph}
*		@api public
*/

Kineograph.prototype.play = function(ani, loop, callback){

	add.apply(this, [ani, loop, callback]);
	
	if(!this._animating) this.next();

	return this;
	
}

/**
*		Begin animating the next animation in the cue
*
*		@return {Kineograph}
*		@api public
*/

Kineograph.prototype.next = function(){

	this._unloop = false;
	this.stop();

	if(!this._animations.length){ this._animating = false; return; }

	this._animating = this._animations.shift();
	
	play.apply(this, [this._animating.ani, this._animating.loop, this._animating.callback]);

	return this;

}

/**
*		Unloop any currently looping animations and allow the sequence to move onwards.
*
*		@return {Kineograph}
*		@api public
*/

Kineograph.prototype.unloop = function(){

	this._unloop = true;

	return this;

}

/**
*		Stop any currently playing animations, without prejudice.
*
*		@return {Kineograph}
*		@api public
*/

Kineograph.prototype.stop = function(){

	while(this._timeouts.length){
		
		clearTimeout(this._timeouts.shift());
	
	}

	this._animating = undefined;

	return this;

}

/**
*		Mixin the emitter properties.
*
*		@param {HTMLElement} el
*		@return {HTMLElement}
*		@api private
*/

function mixin(el) {
  
  for (var key in Kineograph.prototype){
    el[key] = Kineograph.prototype[key];
  }

  return el;

}

/**
*		Add a frame to the animation
*
*		@param {String} path - the relative path to the image
*		@param {String} key - an animtion name for the image
*		@api private
*/

function image(path, key){

	var img = this.appendChild( document.createElement( 'img' ) );
	img.src = path;

	if(this._images === {}){
		show.apply(this, [img])
	}else{
		img.style.visibility = 'hidden';
	}

	if(this._images[key])
		this._images[key].push(img);
	else
		this._images[key] = [img];

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

	if(!this._images[ani])
		throw new Error(ani + 'does not exist');

	this._animations.push({ani:ani, loop:loop, callback:callback});

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

	var self = this;

	for(var i = 0; i < this._images[ani].length; i++){
		
		var timeout = setTimeout(function(img, last){
			
			return function(){

				show(img);

				if(last){

					if(indefinate && !self._unloop){
						play.apply(self, [ani, loop, callback]);
					}else{
						if(!loop || self._unloop){
							if(callback)
								callback();
							self.next();
						}else{
							play.apply(self, [ani, loop, callback]);
						}
					}
				}
			}

		}(this._images[ani][i], !(i < this._images[ani].length - 1)), 1000 / this._fps * i);

		this._timeouts.push(timeout);

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

	if(this._showing)
		this._showing.style.visibility = 'hidden';

	this._showing = img;

}