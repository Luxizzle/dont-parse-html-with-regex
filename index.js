module.exports = class DontParseRegexWithHtml {
  constructor(handlers = [], options = {}) {
    this.handlers = handlers

    this.options = Object.assign({
      startTag: /<([a-z1-9]+)(?:\s+|([^>]+))*>/i,
      endTag: /<\/([a-z1-9]+)[^>]*>/i,
      attr: /([a-z-]+)(?:=\\?"([^"]*)\\?")?/gi,

      fixUnendedTags: true
    }, options)

    this.reset()
  }

  reset() {
    this.stack = []
    this.result = []
  }

  findHandler(tag) {
    return this.handlers.find((handler) => {
      if (Array.isArray(handler.tag)) {
        return handler.tag.find((t) => {
          return t === tag
        })
      } else {
        return handler.tag === tag
      }
    })
  }

  parse(html, cb) {
    this.reset()
    while (html.length > 0) {
      var chars = true
      if (html.indexOf('</') == 0) { // end tag

        match = html.match(this.options.endTag);

        if (match) {
          html = html.substring(match[0].length);
          match[0].replace(this.options.endTag, this.parseEndTag.bind(this));
          chars = false;
        }

      } else if (html.indexOf('<') == 0) { // start tag
        var match = html.match(this.options.startTag);

        if (match) {
          html = html.substring(match[0].length);
          match[0].replace(this.options.startTag, this.parseStartTag.bind(this))
          chars = false
        }

      } 
      
      if (chars) {
        var index = html.indexOf("<");

        var text = index < 0 ? html : html.substring(0, index);
        html = index < 0 ? "" : html.substring(index);

        this.parseChars(text)
      }
    }
    //console.log(this.findLastTag('b'))
    if (cb) cb(null, this.stack);
    return this.stack
  }

  findLastTag(tag = '') {
    /*
    for (var i = this.stack.length - 1; i >= 0; i--) {
      var node = this.stack[i]
      if (node.type === 'tag' && node.name === tag) {
        return i
        break;
      }
    }
    */

    return this.stack.map( (n) => n.name ).lastIndexOf(tag) // much simpler
  }

  parseStartTag(match, tag, attrs = '') {
    //console.log(`<${tag} ${attrs.trim()}>`)

    attrs = attrs.trim()
    var selfEnding = attrs.charAt(attrs.length - 1) == '/'
    var attrsList = []
    attrs.replace(this.options.attr, (match, name, value = true) => {
      attrsList.push({
        name: name,
        value: value,
        match: match
      })
    })

    this.stack.push({
      type: 'tag',
      name: tag,
      attributes: attrsList
    })

    if (selfEnding) {
      this.combine(this.findLastTag(tag))
    } 

  }

  parseEndTag(match, tag) {
    //console.log(`</${tag}>`)

    this.combine(this.findLastTag(tag))
  }

  combine(from) {
    var dump = []
    for (var i = this.stack.length - 1; i >= from; i--) {
      var node = this.stack[i]
      if (i === from) {
        node.children = dump
      } else {
        this.stack.splice(i, 1)
        dump.unshift(node)
      }
    }

    //console.log(dump)
  }

  parseChars(chars) {
    //console.log(chars)
    chars = chars.trim()
    if (chars.length === 0) return;
    this.stack.push({
      type: 'text',
      value: chars
    })
  }
}