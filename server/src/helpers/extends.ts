// @ts-nocheck
import express from 'express'

var origUse = express.Router.use

express.Router.use = function (fn) {
  if (typeof fn === 'string' && Array.isArray(this.stack)) {
    var offset = this.stack.length
    var result = origUse.apply(this, arguments)
    var layer
    for (; offset < this.stack.length; offset++) {
      layer = this.stack[offset]
      // I'm not sure if my check for `fast_slash` is the way to go here
      // But if I don't check for it, each stack element will add a slash to the path
      if (layer && layer.regexp && !layer.regexp.fast_slash)
        layer.__mountpath = fn
    }
    return result
  } else {
    return origUse.apply(this, arguments)
  }
}
