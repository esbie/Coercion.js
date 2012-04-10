# Coercion.js
##### A JavaScript mini-lib that handles optional arguments with panache.

#### Sometimes optional arguments just need a hug:
```js
myAsyncFunc(requiredUrl, {optional: "stuff"}, requiredCallback);
```

#### But supporting optional arguments gets ugly fast:
```js
function myAsyncFunc(url, optionsHash, cb) {
  if(argument.length == 2){
    cb = optionsHash;
    optionsHash = {};
  }
  ...
}
```

#### Coercion helps:
```js
coercion([coercion.required.String, coercion.optional.Object, coercion.required.Function], function(url, optionsHash, cb){
  ...
})
```

#### Wait a minute, type checking arguments? Seriously, this isn't Java.
I know, I know, but it's the only thing JavaScript provides to help us Get It Right(tm). Plus, coercion will alert you when the function definition you've created is ambiguous, or if someone tries to call your function without an argument that's required.

#### Give me more examples
Check out the test suite, it's pretty self explanatory. Here's a snippet:

```js
it('handles 1 reqd, 1 opt, 1 reqd', function(){
  this.coerced = coercion([
    coercion.required.String,
    coercion.optional.String,
    coercion.required.String
  ], this.spy)("string1", "string2");
  expect(this.spy).toHaveBeenCalledWith("string1", null, "string2");
});

it('handles 1 opt, 1 reqd, 1 reqd', function(){
  this.coerced = coercion([
    coercion.optional.String,
    coercion.required.String,
    coercion.required.String
  ], this.spy)("string1", "string2");
  expect(this.spy).toHaveBeenCalledWith(null, "string1", "string2");
});

it('handles 1 reqd, 1 reqd, 1 opt', function(){
  this.coerced = coercion([
    coercion.required.String,
    coercion.required.String,
    coercion.optional.String
  ], this.spy)("string1", "string2");
  expect(this.spy).toHaveBeenCalledWith("string1", "string2", null);
});
```
