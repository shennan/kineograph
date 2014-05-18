## kineograph

![kineograph](kineograph.jpg?raw=true)

#### what is it?

A [kineograph](http://en.wikipedia.org/wiki/Flip_book) was the official term for a Flip Book, an early animation apparatus patented by John Barnes Linnett.

#### what is it really?

A tiny javascript animation library for succinct, behavioural animations.

#### why doesn't it use css sprites?

Becuase CSS sprites can't be effortlessly positioned in a fluid-layout. Go and create staggered `@media` queries, or use this...

## install

Install with [component](https://github.com/component/component):

```
$ component install shennan/kineograph
```

## usage

The simplest usage is to pass an array of images to the Kineograph factory method:

```js
var kineograph = require('kineograph');

var anim = kineograph(['path/to/image1.png', 'path/to/image3.png', 'path/to/image2.png']);

anim.play();
```

For more complex sequences, you can specify individual animation names by passing an object to the factory method:

```js
var anim = kineograph({
	hop:[
		'path/to/hop1.png',
		'path/to/hop2.png',
		'path/to/hop3.png'
	],
	skip:[
		'path/to/skip1.png',
		'path/to/skip2.png',
		'path/to/skip3.png'
	]
});
```

You can then chain animations which will be added to the animation queue:

```js
anim.play('hop').play('skip');
```

You may want to have a never ending loop by specifying 0 as the second argument:

anim.play('hop', 0);

To break out of that loop, you can call `unloop`:

anim.unloop().play('skip');

In the above scenario, our Kineograph will wait for the looped animation to finish gracefully before moving onto the next animation.

## api

#### `var anim = kineograph(animations)`

Create a new kineograph - pass in an object that contains named animation sequences, or an array of image paths which will automatically be named '_default'.

#### `anim.play(name, loop, callback)`

Play a given animation sequence a number of times and run a callback method when completed.

#### `anim.unloop(callback)`

Finish the current animation gracefully. Run the callback method associated with the animation, as well as the callback animation passed to the unloop method.

#### `anim.stop()`

Stop the current animation. Don't run the callback associated with it, and don't finish gracefully.

## license

MIT