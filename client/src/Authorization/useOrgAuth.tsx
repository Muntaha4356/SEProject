// import { useEffect, useState } from "react";

// export function useOrgAuth() {
//   const [loading, setLoading] = useState(true);
//   const [isOrgAuth, setIsOrgAuth] = useState(false);
//   // const [signupStep, setSignupStep] = useState(null);

//   useEffect(() => {
//     const check = async () => {
//       try {
//         const res = await fetch("http://localhost:3000/api/org/auth", {
//           credentials: "include"
//         });
//         const data = await res.json();
//         console.log(data.authenticated)
//         setIsOrgAuth(data.authenticated);

//         // // get signup step from localStorage
//         // const step = localStorage.getItem("signupStep");
//         // setSignupStep(step);
//       } catch (err) {
//         console.error("Auth check failed:", err);
//         setIsOrgAuth(false);
//       }
//       setLoading(false);
//     };
//     check();
//   }, []);

//   return { loading, isOrgAuth };
// }


