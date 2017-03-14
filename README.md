# dont-parse-html-with-regex

Don't use this module, seriously. stop.

I was searching for a solution to parse html with pure js, mainly because i wanted to use it in react-native, but couldn't find anything.
They also said you couldn't parse html with regex. *cough* [stackoverflow](http://stackoverflow.com/questions/1732348/regex-match-open-tags-except-xhtml-self-contained-tags#1732454) *cough*.
But fuck the rules, i did it anyways.

This probably doesnt work in weird wonky html situations, because we all know how fu- i mean messy html can be sometimes.

Please don't actually use this for a long-term solution. There's much better solutions out there and you should use them.

Now close this tab, remove your browser history and never look at this again.

You're still here? Alright, well you must be feeling adventurous. Fine.

Here's some code to get you started then

```js
var simplify = require('./index')

var parser = new simplify()

parser.parse(`
<title>Hi there this is a title</title>
<meta description="yeh a meta tag that isnt ended">
<meta description="yeh a meta tag thats self ending" />
<h1>They said it couldnt be done</h1>
<p>But fuck the rules, <a href="http://lux.moe">i did it anyways</a></p>
Wew some random text now
`, (err, data) => {
  console.log(data)
})
```
And you should get something like this:
```js
[ { type: 'tag',
    name: 'title',
    attributes: [],
    children: [ [Object] ] },
  { type: 'tag', name: 'meta', attributes: [ [Object] ] },
  { type: 'tag',
    name: 'meta',
    attributes: [ [Object] ],
    children: [] },
  { type: 'tag',
    name: 'h1',
    attributes: [],
    children: [ [Object] ] },
  { type: 'tag',
    name: 'p',
    attributes: [],
    children: [ [Object], [Object] ] },
  { type: 'text', value: 'Wew some random text now' } ]
```

Well h̷̀́a̡͜v͞e̵͞ f̵͟͡͡͞ú̸̵͟n̨̛͢