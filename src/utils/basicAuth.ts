// routes
// import { PATH_AUTH } from '../routes/paths';
//
import axios from './axios';

// ----------------------------------------------------------------------

// const handleTokenExpired = (exp: number) => {
//   let expiredTimer;
//
//   const currentTime = Date.now();
//
//   // Test token expires after 10s
//   // const timeLeft = currentTime + 10000 - currentTime; // ~10s
//   const timeLeft = exp * 1000 - currentTime;
//
//   clearTimeout(expiredTimer);
//
//   expiredTimer = setTimeout(() => {
//     alert('Token expired');
//
//     localStorage.removeItem('accessToken');
//
//     window.location.href = PATH_AUTH.login;
//   }, timeLeft);
// };

const setSession = (accessToken: string | null) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    axios.defaults.headers.common.Authorization = `Basic ${accessToken}`;

    // This function below will handle when token is expired
    // const { exp } = jwtDecode<{ exp: number }>(accessToken); // ~5 days by TR2IT server
    // handleTokenExpired(exp);
  } else {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

export { setSession };
