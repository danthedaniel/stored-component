Stored Components
===

[![npm version](https://badge.fury.io/js/stored-component.svg)](https://badge.fury.io/js/stored-component) [![MIT License](https://img.shields.io/packagist/l/doctrine/orm.svg)]()

Keep a Preact component's state elsewhere for when you'll want it later.

### Installation

```bash
npm install -S stored-component
```

### Usage


#### Basic Usage
Instead of extending from `Component` use `StoredComponent` from the
package. In addition, pass the default prop values to `super()`.

```typescript
import { h } from "preact";
import StoredComponent from "stored-component";

class MyComponent extends StoredComponent {
  constructor(props) {
    super(props, {foo: "bar", enabled: false});
  }

  // ...
}
```

Because the `StoredComponent` class uses the `componentDidUpdate()` callback to
keep the data store in sync, if your component includes an implementation of
`componentDidUpdate()` you'll need to call `super.componentDidUpdate()`:

```typescript
class MyComponent extends StoredComponent {
  constructor(props) {
    super(props, {foo: "bar", enabled: false});
  }

  componentDidUpdate() {
    console.log("Updated!");
    super.componentDidUpdate();
  }
}
```

#### Per-Instance Storage

By default a `StoredComponent` will associate its stored state with its class
name. Without changing this behavior all `MyComponent`s as defined above would
share the same state. This can be overridden by passing in an `id` parameter to
the `StoredComponent` constructor:

```typescript
class MyComponent extends StoredComponent {
  constructor(props) {
    super(props, {foo: "bar", enabled: false}, props.id);
  }

  // ...
}
```

#### Typing

This project supports TypeScript. You can set the state and prop types of your
`StoredComponent`s just as with Preact Components:

```typescript
type StateType = typeof defaultState;
const defaultState = {foo: "bar", enabled: false};

class MyComponent extends StoredComponent<{}, StateType> {
  constructor(props) {
    super(props, defaultState);
  }

  // ...
}
```

#### Recalling the Original State

You can reset a component's state to its default with the `defaultState()`
method on the `StoredComponent` class.

#### Using a Different Data Store

The default data store used is `window.sessionStorage`. Other storage
implementations can be set using the `setStore()` function.

```typescript
import { storage } from "stored-component";
storage.setStore(window.localStorage);
```

Take note that if you use `localStorage` you will need to be aware of state
model changes. If your application is updated with a new state structure, the
old state still sitting in `localStorage` will be loaded up anyway.

### Serialization

Because `localStorage` and `sessionStorage` can only store strings, the
component states are serialized as JSON. This means that values in the state
that can not be serialized as JSON are filtered out.

When recalling a filtered value from the data store, the default value (as
defined when calling `super()`) is used.

For example - if you try to serialize this state:

```javascript
const default = {foo: "", baz: -1, data: null};
let state = {
  foo: "bar",
  baz: 0,
  data: new Promise(...)
};
```
The following JSON will be stored:

```json
{"foo": "bar", "baz": 0}
```

And the following object will be recalled from the store:

```javascript
let state = {
  foo: "bar",
  baz: 0,
  data: null
}
```

In addition, all Arrays have non-serializable values filtered out.
