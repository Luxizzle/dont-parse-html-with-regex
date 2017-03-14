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