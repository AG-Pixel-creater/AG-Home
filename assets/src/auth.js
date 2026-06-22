import {
    getAuth,
    signInWithEmailAndPassword,
    signInWithPopup,
    GithubAuthProvider,
    fetchSignInMethodsForEmail,
    linkWithCredential,
    EmailAuthProvider,
    GoogleAuthProvider
  } from "firebase/auth";
  
  const auth = getAuth();
  const githubProvider = new GithubAuthProvider();
  
  export function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Login successful:", userCredential.user);
      })
      .catch((error) => {
        console.error("Login failed:", error.message);
      });
  }
  
  export async function loginWithGithub() {
    try {
      console.log("Attempting GitHub login...");
      const result = await signInWithPopup(auth, githubProvider);
      console.log("GitHub login successful:", result.user);
      return { success: true, user: result.user };
    } catch (error) {
      console.error("GitHub login error:", error);
      
      if (error.code === "auth/popup-blocked") {
        return { 
          success: false, 
          error: "Please allow popups for this site to use GitHub login" 
        };
      }
      
      if (error.code === "auth/cancelled-popup-request") {
        return { 
          success: false, 
          error: "Login cancelled. Please try again." 
        };
      }
  
      if (error.code === "auth/account-exists-with-different-credential") {
        const email = error.customData.email;
        const signInMethods = await fetchSignInMethodsForEmail(auth, email);
        
        return {
          success: false,
          error: `An account with email ${email} already exists. Please login with ${signInMethods[0]}`
        };
      }
  
      return { 
        success: false, 
        error: error.message || "Failed to login with GitHub" 
      };
    }
  }
  