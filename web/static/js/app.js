import { createStore, combineReducers, applyMiddleware } from 'redux';
import React from 'react';
import { render } from 'react-dom';
import axios from 'axios'
import thunk from 'redux-thunk'

// return value of this becomes state
// this is called a reducer
function counter(state=0, action){
  switch (action.type){
    case "INCREMENT":
      return state + 1
    case "DECREMENT":
      return state - 1
    default:
      return state
  }
}

function lastMessage(state='no message yet', action){
  switch (action.type) {
    case "INCREMENT":
      return "Was incremented"
    case "DECREMENT":
      return "Was decremented"
    default:
      return "Not a real answer";
  }
}

function factsReducer(state="No facts yet", action){
  switch (action.type) {
    case "NEW_FACT":
      return action.payload
    default:
      return "Not a real answer";
  }
}

function getFact(){
  return (dispatch) => {
    axios.get("http://numbersapi.com/42/math").then( data =>{
      dispatch({type: "NEW_FACT", payload: data})
    })
  }
}

const rootReducer = combineReducers({
    counter: counter,
    lastMessage: lastMessage,
    fact: factsReducer
  }
)

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

function increment(){
  store.dispatch({type:"INCREMENT"})
}

function decrement(){
  store.dispatch({type:"DECREMENT"})
}

const App = (props) => {
  const {lastMessage, counterValue, fact, getFact} = props
  return(
    <div>
      The last message was: {lastMessage}
      <br />
      The current value is {counterValue}
      <br />
      <button onClick={props.increment}>Increment</button>
      <button onClick={props.decrement}>Decrement</button>
      <button onClick={getFact}>Get Fact</button>
      <div>
        Random Fact {fact}
      </div>
    </div>
  )
}

store.subscribe(() => {
  render(<App 
    counterValue={store.getState().counter} 
    lastMessage={store.getState().lastMessage}
    increment={increment} decrement={decrement}
    getFact = { getFact }
    fact = {store.getState().fact}
    />, 
  document.getElementById('container'))
})

store.dispatch({type:"BEEF"})

// axios.get("http://numbersapi.com/42/math").then( data => console.log(data))