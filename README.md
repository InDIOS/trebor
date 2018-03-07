# trebor

[![Build Status](https://travis-ci.org/InDIOS/trebor.svg?branch=master)](https://travis-ci.org/InDIOS/trebor)

A node js module to make standalone reactive web components.

# How to use

```bash
npm i trebor -D
```
or

```bash
npm i trebor -g
```

# Example

### Let's make a `Counter` component:

First we'll make an html file with name `counter`.
```html
<!-- counter.html -->
<style>
  .negative {
    color: crimson;
  }
</style>

<div class="container">
  <h3 class="title is-3">Counter Example</h3>
  <label>Counter: </label>
  <strong :class="negative()">{{ count }}</strong>
  <br/>
  <button class="button is-primary" @click="increment()">Increment</button>
  <button class="button is-danger" @click="decrement()">Decrement</button>
</div>

<script>
  export default {
    model: {
      count: 0,
      increment(){
        this.count = this.count + 1;
      },
      decrement(){
        this.count = this.count - 1;
      },
      negative() {
        return { 'negative': this.count < 0 };
      }
    }
  };
</script>
```
Then we'll compile the `counter` file to convert it in a standalone component

```bash
trebor -i counter.html
```
In the directory will appear two `js` files, one with `es` sufix and other with `umd` sufix. We'll use the file with `umd` sufix. Make a file named `index.html` like that

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Counter Component</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.5.0/css/bulma.min.css">
</head>

<body>
  <main></main>
  
  <!-- Load Counter component -->
  <script src="counter.umd.js"></script>
  <!-- Initialize and Mount Counter component -->
  <script>
    var counter = new Counter();
    counter.$mount('main');
  </script>
</body>

</html>
```
Open the `index.html` file in the browser and see how the magic happens 🎉👍😁
