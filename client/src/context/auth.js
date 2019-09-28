import React, { createContext, useReducer } from "react";
import jwtDecode from "jwt-decode";

const initialState = {
  user: null
};

// cek token
if (localStorage.getItem("jwtToken")) {
  // jika ada token
  const decodedToken = jwtDecode(localStorage.getItem("jwtToken"));
  // apakah token masih valid
  // token valid selama 1000 detik
  if (decodedToken.exp * 1000 < Date.now()) {
    // jika > 1000 detik
    localStorage.removeItem("jwtToken");
  } else {
    // < 1000 detik
    initialState.user = decodedToken;
  }
}

const AuthContext = createContext({
  user: null,
  login: userData => {},
  logout: () => {}
});

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload
      };
    case "LOGOUT":
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
};

const AuthProvider = props => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const login = userData => {
    localStorage.setItem("jwtToken", userData.token);
    dispatch({ type: "LOGIN", payload: userData });
  };
  const logout = () => {
    localStorage.removeItem("jwtToken");
    dispatch({ type: "LOGOUT" });
  };
  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        login,
        logout
      }}
      {...props}
    />
  );
};

export { AuthContext, AuthProvider };
