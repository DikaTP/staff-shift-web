import React, { createContext, useReducer } from "react";

const initialState = {
  shifts: [],
  page: 1,
  limit: 10,
  count: 0,
  total_page: 0,
  total_display: 0,
};

const ShiftContext = createContext();

let ownReducer = (state, action) => {
  switch(action.type){
    default:
      return action.payload.data
  }
}

function ShiftProvider(props) {
  const [state, dispatch] = useReducer(ownReducer, initialState);
  return (
    <ShiftContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {props.children}
    </ShiftContext.Provider>
  );
}
export { ShiftContext, ShiftProvider };