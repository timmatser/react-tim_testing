import { createContext, ReactNode, useEffect, useReducer } from 'react';
// utils
import axios from '../utils/axios';
import { setSession } from '../utils/basicAuth';
// @types
import { ActionMap, AuthState, AuthUser, BasicAuthContextType } from '../@types/auth';
import { HOST_ORIGIN_API } from '../config';
// import BasicLoginModule from '../sections/auth/login/BasicLoginModule';
import keycloakService from "../sections/auth/keycloakService"




// ----------------------------------------------------------------------

enum Types {
  Initial = 'INITIALIZE',
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  Register = 'REGISTER',
}

type BasicAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean;
    user: AuthUser;
  };
  [Types.Login]: {
    user: AuthUser;
  };
  [Types.Logout]: undefined;
  [Types.Register]: {
    user: AuthUser;
  };
};

export type BasicAuthActions = ActionMap<BasicAuthPayload>[keyof ActionMap<BasicAuthPayload>];

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const BasicAuthReducer = (state: AuthState, action: BasicAuthActions) => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        // temporarily disabled function below for testing
        // isAuthenticated: action.payload.isAuthenticated,
        isAuthenticated: true,
        isInitialized: true,
        user: action.payload.user,
      };
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    case 'REGISTER':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };

    default:
      return state;
  }
};

const AuthContext = createContext<BasicAuthContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(BasicAuthReducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken) {
          setSession(accessToken);

          // const response = await axios.get(`/${API_LANG}/account.json`);
          // const { user } = response.data;

          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: true,
              user: null,
            },
          });
        } else {
          dispatch({
            type: Types.Initial,
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: Types.Initial,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (email: string, password: string) => {
    const isLoggedIn = await keycloakService.login(email, password);
  
    if (isLoggedIn) {
      dispatch({
        type: Types.Login,
        payload: {
          user: {
            email: email,
          },
        },
      });
    } else {
      // Handle failed login
    }
  };
  

  // const login = async (username: string, password: string) => {
  //   const response = await axios.post(`${HOST_ORIGIN_API}/login`, {
  //     email: username,
  //     password: password,
  //   });

  //   setSession(response.data.access_token);

  //   dispatch({
  //     type: Types.Login,
  //     payload: {
  //       user: {
  //         email: username,
  //       },
  //     },
  //   });
  // };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const response = await axios.post('/api/account/register', {
      email,
      password,
      firstName,
      lastName,
    });
    const { accessToken, user } = response.data;

    localStorage.setItem('accessToken', accessToken);

    dispatch({
      type: Types.Register,
      payload: {
        user,
      },
    });
  };

  const logout = async () => {
    keycloakService.logout();
    setSession(null);
    dispatch({ type: Types.Logout });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'basic',
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
