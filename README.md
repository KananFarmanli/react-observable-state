







# react-observable-state 

react-observable-state is a lightweight state management library for React applications. It uses the power of Observable pattern and React hooks to manage and update application state efficiently. The library provides an easy way to subscribe to state changes, and it updates only the components that are subscribed to specific parts of the state.

## Installation

    npm install react-observable-state

## Usage

```js
import { useObservable, Observable } from "react-observable-state";

```
Then, create a global state using the Observable function:

```js

const State = Observable({
  counter: 0,
  user: {
    name: 'John Doe',
    email: 'john.doe@example.com',
  },
});
```
or

```js

const State = Observable();
State.counter = 0,
State.user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
  }

```
In your React components, you can use the useObservable hook to subscribe to state changes:

```js

import React from 'react';
import { useObservable } from 'react-observable-state';

const Counter = () => {
  const state = useObservable('counter');
  const increment = () => state.update({ counter: state.counter + 1 });

  return (
    <div>
      <p>Counter: {state.counter}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
};

```
Here, we subscribe to changes in the counter property of the state. Whenever the counter value is updated, the Counter component will re-render.


You can subscribe to other states at the same time

```js 

window.State = Observable();

State.userFirst = {
  name: 'John Doe',
  email: 'john.doe@example.com',
}
State.userSecond = {
  name: 'Smith',
  email: 'not indicated',
};


const App = () => {

  const state = useObservable('userFirst, userSecond');

  const handleClick = () => {
    State.update({ userFirst: { email: 'not indicated' }, userSecond: { name: "Simon Smith" } });
  };

  return (
    <div>
      <p>{state.userFirst.email}</p>
      <p>{state.userSecond.name}</p>
      <button onClick={handleClick}>Change</button>
    </div>
  );
};

export default App;

```

## Overall

This code exports two functions useObservable and Observable.

Observable function creates an object with the ability to notify subscribers of any changes to its properties. It does so by creating a Proxy object, which intercepts property accesses and updates, and sends notifications to all subscribed functions. The subscribe function adds a new subscriber to a particular property path. The update function updates the object with a new partial object.

useObservable is a custom React hook that takes in a comma-separated list of property paths and an optional timeout value. It creates a state variable with useState and a rerender function. Then it uses useEffect and the juxt function from Ramda to subscribe to the specified property paths and pass the rerender function to each subscription. Finally, it returns the observable object created by the Observable function.

The throttle and debounce functions from the throttle-debounce library are used to limit the number of times the component rerenders in response to changes in the observable object. The without, split, keys, and juxt functions from Ramda are used to manipulate arrays and objects in a functional programming style.

Overall, this code provides a way to manage state in a React application using an observable object with subscribers, allowing for reactive updates to the UI without the need for manual state management.

### Good luck and do not forget 42 the answer to life the universe and everything.








