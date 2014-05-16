## kineograph

![kineograph](kineograph.jpg?raw=true)

#### what is it?

A [kineograph](http://en.wikipedia.org/wiki/Flip_book) was the official term for a Flip Book, an early animation apparatus patented by John Barnes Linnett.

#### what is it really?

A tiny javascript animation library for succinct, behavioural animations.

#### why doesn't it use css sprites?

Becuase CSS sprites can't be effortlessly positioned in a fluid-layout. Go and create staggered `@media` queries, or use this...

## install

```
$ component install shennan/kineograph
```

## usage

```js
var Kineograph = require('kineograph')

var anim = new Kineograph({
	hop:[
		'anim/hop1.png',
		'anim/hop2.png',
		'anim/hop3.png'
	],
	skip:[
		'anim/skip1.png',
		'anim/skip2.png',
		'anim/skip3.png'
	]
})

// hop twice then skip once
anim.play('hop', 2, function(){
	anim.play('skip', 1, function(){

	})	
})
```

## api

### `var anim = new Kineograph(animations)`

Create a new animator - pass in an object that contains named animation sequences (an array of image paths)

If you pass an array it will be named '_default'

```js
var anim = new Kineograph({
	hop:[
		'anim/hop1.png',
		'anim/hop2.png',
		'anim/hop3.png'
	],
	skip:[
		'anim/skip1.png',
		'anim/skip2.png',
		'anim/skip3.png'
	]
})

```

### `anim.play(name, loop, callback)`

Play a given animation sequence a number of times - run callback when completed.

### `anim.stop()`

Stop the current animation.

## license

MIT