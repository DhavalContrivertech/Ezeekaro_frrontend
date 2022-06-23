import React from "react";
import axios from "axios";

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true };
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!localStorage.getItem("id_token"),
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUserState, useUserDispatch, loginUser, signOut };

// ###########################################################

function loginUser(dispatch, login, password, history, setIsLoading, setError) {
  setError(false);
  setIsLoading(true);

  console.log(login , password)

  if (!!login && !!password) {
    let body = {
      Email : login,
      Password : password
    }
    axios.post("http://localhost:5000/User/LoginUser" , body).then((res) => {
      if (res.status == 200) {
          if(res.data.FindUser.Role === 'admin'){
            dispatch({ type: "LOGIN_SUCCESS" });
            setError(null);
            setIsLoading(false);  
          }
      }else{
        dispatch({ type: "LOGIN_FAILURE" });
        setError(true);
        setIsLoading(false);
      }
    })
  //   setTimeout(() => {
  //     localStorage.setItem("id_token", "1");
  //     dispatch({ type: "LOGIN_SUCCESS" });
  //     setError(null);
  //     setIsLoading(false);

  //     history.push("/app/dashboard");
  //   }, 2000);
  } else {
    dispatch({ type: "LOGIN_FAILURE" });
    setError(true);
    setIsLoading(false);
  }
}

function signOut(dispatch, history) {
  localStorage.removeItem("id_token");
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}
