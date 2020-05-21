# ADR 0002: Why do we expose our data streams as events?

This ADR tries to put more context on why we decided to expose our data streams as events with an API compatible with `EventEmitter` and `EventTarget`.

📅 2020-05-26

## Context

The clever-client exposes most of its data/actions as simple HTTP REST calls, one request => one response.
There are currently two situations where this model is not the best choice and where a streaming or event oriented model is a better solution:

* serving live logs for apps and add-ons
* serving live platform events (pushs, deploys, restarts, stops...)

These two streams used to be exposed with a custom API that accepts callbacks, it looked like this:

```js
const logsStream = new LogsStream({ apiHost, tokens, /* ... */ });
const closeStreamFn = logsStream.openResilientStream({
  onMessage: (msg) => console.log(msg),
  onError: (error) => console.error(error),
});
```

This model is not fundamentally bad but it has limitations:

* It's "too custom". It does not follow any standard (or de-facto standard) and was designed without really thinking about the overall reactive stream landscape.
  * We need to make sure our users can easily wire the clever-client in their existing contexts.
* With 1 single object of the class `LogsStream`, if you call `openResilientStream()` 3 times, you have 3 streams.
  * This mismatch between number of objects and number of open streams is confusing.
* You can only register one `onMessage` listener and one `onError` listener for each stream created with `openResilientStream()`.
* You need to register your listeners when you call `openResilientStream()` and you cannot change those afterwards.
* It lacks a way to know when the stream was automatically reopened because of a network failure.

Hearing about new standards in JavaScript like Observables or Async iterators, we were wondering if those APIs were a better fit for our use case.

## Research

We focused our research on four different kinds of APIs:

* Events ([`EventEmitter`](https://nodejs.org/api/events.html#events_class_eventemitter) from Node.js and [`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) from the DOM)
* Streams ([Node.js streams](https://nodejs.org/api/stream.html) and browser [WHATWG streams](https://github.com/whatwg/streams))
* Observables ([ECMAScript draft](https://github.com/tc39/proposal-observable))
* Async iterators ([ECMAScript 2018 standard](https://github.com/tc39/proposal-async-iteration))

We also found this awesome [Stackoverflow response](https://stackoverflow.com/questions/39439653/events-vs-streams-vs-observables-vs-async-iterators/47214496#47214496) by [Domenic Denicola](https://twitter.com/domenic).
It was a goldmine to make sense of all those APIs and the underlying concepts.
In this document, we'll quote sentences from Domenic's SO answer in italics.

We also looked at how easy/hard it would be to use those APIs with reactive stream libraries like:

* [RxJS](https://github.com/ReactiveX/rxjs)
* [Bacon.js](https://github.com/baconjs/bacon.js)
* [xstream](https://github.com/staltz/xstream)
* [Most.js](https://github.com/cujojs/most)
* [Kefir](https://github.com/kefirjs/kefir)

### Concepts

#### push vs. pull

There is a big difference between push and pull APIs, the SO answer explains it very well.
If you want to choose an API between Events, Streams, Observables or Async iterators, you need to know what kind data source you expose.

* _Async pull APIs are a good fit for cases where data is pulled from a source._
  * ex: reading a file from the FS
* _Push APIs are a good fit for when something is generating data, and the data being generated does not care about whether anyone wants it or not._
  * ex: mouse clicks or messages received from a WebSocket

Important fact:

_It's worth noting that you can build either approach on top of the other in a pinch:_

* _To build push on top of pull, constantly be pulling from the pull API, and then push out the chunks to any consumers._
* _To build pull on top of push, subscribe to the push API immediately, create a buffer that accumulates all results, and when someone pulls, grab it from that buffer. (Or wait until the buffer becomes non-empty, if your consumer is pulling faster than the wrapped push API is pushing.)_

_The latter is generally much more code to write than the former._

#### hot vs. cold

When you look at observables, it's also important to know if you want to expose hot or cold observables. 

* [This article](https://www.davesexton.com/blog/post/Hot-and-Cold-Observables.aspx) by Dave Sexton is a really nice explanation of this concept. 
* In his two articles on why they created xstreams, André Staltz also talks about hot vs. cold Observables:
  * [Why we actually built xstream](https://staltz.com/why-we-built-xstream.html)
  * [Why we built xstream](https://staltz.com/why-we-actually-built-xstream.html) 

Quoting Dave Sexton:

_In summary, common sense tells us that:_ 

* _Hot observables are always running and they broadcast notifications to all observers._
* _Cold observables generate notifications for each observer._

#### Backpressure

Backpressure explained by Kevin Ghadyani in [this article](https://itnext.io/lossless-backpressure-in-rxjs-b6de30a1b6d4):

_Backpressure occurs when your consumer is slower than your producer._

_A few examples of backpressure are mouse movement events, window resize events, and parsing a file._
_All of these could either cause more events to occur than your consumer can process or, in the case of reading a file, too much memory for your machine to deal with._

_To deal with these issues, you could either have lossy or lossless methods._
_Lossy methods include sampling, throttling, and debouncing._
_Whereas lossless methods include buffering and pausing._

_Lossless backpressure is really important when reading a file; for example, because you don’t want pieces of the file to go missing as you’re processing it._
_On the other hand, events like mouse movement can be lossy because your monitor can only update so many times a second and the mouse movement event emits much more frequently._

### APIs

Now that we talked briefly about concepts, we'll dig into the four different kinds of APIs.

#### Events

Node.js and browsers share a very similar events API, it consists of an object on which you can add/remove event listeners.

* Node.js calls them [`EventEmitter`](https://nodejs.org/api/events.html#events_class_eventemitter) and uses them in lots of its APIs.
  * Ex: if you create a TCP server with `net.createServer()`, you get a [`net.Server`](https://nodejs.org/api/net.html#net_class_net_server) object which extends `EventEmitter`. 
  * Calls can be chained
  * `addListener()`/`on()` to add a listener
  * `removeListener()`/`off()` to remove a listener
  * `emit()` to emit an event
  * `once()` to add a one time listener (returns a promise)
  * `removeAllListeners()`
* The browser DOM calls them [`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) and uses them in lots of its APIs.
  * Ex: any element in the DOM extends `EventTarget`. Other examples include [`EventSource`](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) for SSE, [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) or even [`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest).
  * Calls cannot be chained
  * `addEventListener()` to add a listener
  * `removeEventListener()` to remove a listener
  * `dispatchEvent()` to emit an event

NOTES:

* This is a push based API.
* Closing the source of an `EventEmitter`/`EventTarget` so it stops emitting events is not part of the API, but most of the usage we saw in Node.js or the browser have a `.close()` method.
* Dispatching errors is just a naming convention, it's not part of the API.
* The method to emit events is exposed to the consumer.
* Most userland libs can directly use and `EventEmitter`/`EventTarget` but they do it on one type of event.

#### Observables

There is an [Observable](https://github.com/tc39/proposal-observable) draft at TC39.
The project seem stale but even if it does not become an ECMAScript standard, it could be seen as a de-facto standard.
Indeed, most of userland libs we looked at are compatible with Observable.

NOTES:

* This is a push based API.
* _Observables are a more refined version of EventTarget._
* _Their primary innovation is that the subscription itself is represented by a first-class object, the Observable, which you can then apply combinators (such as filter, map, etc.) over._
* _They also make the choice to bundle together three signals (conventionally named next, complete, and error) into one, and give these signals special semantics so that the combinators respect them._
  * This limitation to three signals has pros and cons.
* _Another nice feature of observables over events is that generally only the creator of the observable can cause it to generate those next/error/complete signals. Whereas on EventTarget, anyone can call dispatchEvent(). This separation of responsibilities makes for better code, in my experience._
* It's very easy to create an Observable from an `EventEmitter`/`EventTarget`.

#### Streams

Both [Node.js streams](https://nodejs.org/api/stream.html) and [WHATWG streams](https://github.com/whatwg/streams) share similar goals but with different APIs and semantics.
Look at this [FAQ](https://github.com/whatwg/streams/blob/master/FAQ.md#what-are-the-main-differences-between-these-streams-and-nodejs-streams) for details...

NOTES:

* This is a pull based API (see exception for Node.js).
* All Node.js streams are instances of `EventEmitter` which can be confusing. It comes from the "two reading modes":
  * In flowing mode, data is read from the underlying system automatically and provided to an application as quickly as possible using events via the EventEmitter interface.
  * In paused mode, the stream.read() method must be called explicitly to read chunks of data from the stream.
* As described in the [WHATWG streams FAQ](https://github.com/whatwg/streams/blob/master/FAQ.md#how-do-readable-streams-relate-to-async-iterables):
  * Readable streams and Observables/EventTarget are not terribly related.
  * Observables/EventTarget are specifically designed for multi-consumer scenarios, and have no support for backpressure.
  * They are generally a bad fit for anything related to I/O, whereas streams excel there.

#### Async iterators

Added in [ECMAScript 2018](https://github.com/tc39/proposal-async-iteration), async iterators are a great standard to expose pull based streams of data.

If you get an async iterator, you can read from it like this:

```js
// In this example readLines(file) returns an async iterator
for await (const line of readLines(file)) {
  console.log(line);
}
```

NOTES:

* This is a pull based API.
* As described in the [WHATWG streams FAQ](https://github.com/whatwg/streams/blob/master/FAQ.md#how-do-readable-streams-relate-to-async-iterables):
  * Readable streams are conceptually a special case of async iterables, with a focus on I/O.
* Node.js v10 introduced [async iterator support on their streams](https://nodejs.org/api/stream.html#stream_streams_compatibility_with_async_generators_and_async_iterators).

## Solution for our context

Now that we know more about the JavaScript landscape of reactive streams and event oriented programming, we can choose a solution for our context:

* serving live logs for apps and add-ons
* serving live platform events (pushs, deploys, restarts, stops...)

### We chose to expose our data as events (`EventEmitter`/`EventTarget`)

Between Events, Streams, Observables or Async iterators, we chose to expose those data as events.
Here are the reasons:

* Our data come from push based sources (SSE and WS) => events or observables are a better choice than streams or async iterators.
* Most libraries are compatible with the proposed Observables draft. They could be considered as a de-facto standard because of this compatibility but the draft seems stale and lacks operators or backpressure support. It doesn't give strong future proof feelings.
* Most libraries are compatible with events. They are implemented by runtimes like Node.js and browsers (`EventEmitter`/`EventTarget`) and have been used for a long time. We don't expect this model to drastically change in the future.
* Events can expose more than just three signals compared to Observables, it allows us to emit events for `ping` received by the source or emit `open`/`close` events when auto retry are attempted in case of network failures.
* It's simple to create an Observable from events.
  * NOTE: Most libraries have functions to do that in one call. You can also do it by hand, it allows for more control and is still quiet simple to write.
* If you want to expose an Observable, you have to respect an API which means bundling more code than what's needed for `EventEmitter`/`EventTarget` in the clever-client. 

### We're using a lib called `component/emitter`

To expose those data as events, we're using a lib called [component/emitter](https://github.com/component/emitter).
Here are the reasons:

* It's so tiny [534b min+gzip](https://bundlephobia.com/result?p=component-emitter@1.3.0)
  * Reduced impact on bundle size of the clever-client.
  * Reduced complexity, the source it dead simple and could be forked and maintained if necessary.
* It's "isomorphic", so it's compatible with method names from both Node.js `EventEmitter` and browser `EventTarget`.

### Exposing SSE/WS as events

We receive our logs from an SSE connection and our plateform events from a WS.
Those are both implemented as `EventEmitter` in the libs we use and as `EventTarget` in the browser standard.
Why do we need to re-expose them with the same model?

This layer allows us to:

* Add a network failure detection system based on pings
* Add an auto retry behaviour when such network failures occur
* Change the implementation detail, moving from a WS to an SSE or from an SSE to polling

### Naming our classes `*Stream`

We're naming our classes with a `*Stream` suffix: `LogsStream`, `EventsStream`...

This may be confusing when you think about Node.js streams of WHATWG streams as opposed to the other APIs but we're using this prefix in a more general/global sense.

### Future use cases

What about future data we would want to expose?
Does this API fit all situations?

It depends...
As we already explained in "push vs. pull", this `EventEmitter`/`EventTarget` API really works because right now, we're only consuming push sources without any support for backpressure (SSE and WS).

If we need to expose data from a pull based API, we would consider two solutions:

1. Expose data with this API, pushing events to the user and hiding the implementation detail of pulling from the source (without backpressure support).
2. Expose data with async iterators. They are low level, directly available in the language and widely available in Node.js and modern browsers. They would be a better choice for us than streams.

This would highly depend on whether the data is "infinite" or not.

* Infinite example: In the console app overview live map, we poll Warp10 with HTTP calls to retrieve live access logs.
* Finite example: In the clever-tools `accesslogs` command, without `-f` option, we need to retrieve access for the last 24 hours, so we chose to query Warp10 in batch of one hour. 

NOTES:

* If the data is finite by nature, async iterators and a really good fit.
* If the data is infinite, we'll need to question our need to change the implementation from pulling to pushing with an SSE or a WS.
* We could also expose both (1) and (2) on the same object, it's what Node.js do with its streams.

#### Special note about access logs

For the access logs, prior to this study, we chosed to expose them with this `EventEmitter`/`EventTarget` API even if we're consuming a pull based source (polling from Warp10).
This is because we have both finite (default) and infinite (with `-f`) use cases.
It would have been confusing to use async iterator for finite and events for infinite.
