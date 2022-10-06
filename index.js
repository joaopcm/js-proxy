'use strict';

const Event = require('node:events')
const event = new Event()
const eventName = 'counter'
event.on(eventName, msg => console.log('counter updated', msg))

const myCounter = {
  counter: 0,
}
const proxy = new Proxy(myCounter, {
  set: (target, propertyKey, newValue) => {
    event.emit(eventName, { newValue, key: target[propertyKey] })
    target[propertyKey] = newValue
    return true
  },
  get: (object, prop) => {
    // console.log('someone is reading the counter')
    return object[prop]
  }
})

setInterval(function () {
  proxy.counter++
  if (proxy.counter == 10) clearInterval(this)
  console.log('[4] setInterval', proxy.counter)
}, 200)

setTimeout(() => {
  proxy.counter = 4
  console.log('[3] setTimeout', proxy.counter)
}, 100)

setImmediate(() => {
  console.log('[2] setImmediate', proxy.counter)
})

// it executes now, but and stops the life cycle of the event loop
process.nextTick(() => {
  proxy.count = 2
  console.log('[1] process.nextTick', proxy.counter)
})