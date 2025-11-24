import { router } from "expo-router";
import { auth, googleProvider } from "../FirebaseConfig";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithCredential,
    GoogleAuthProvider 
} from "firebase/auth";
import { Platform } from "react-native";
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

// Complete the WebBrowser authentication session
WebBrowser.maybeCompleteAuthSession();

// Conditionally import Google Sign-In for native platforms only
let GoogleSignin: any = null;
if (Platform.OS !== 'web') {
    try {
        GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
    } catch (error) {
        console.log('Google Sign-In not available on this platform');
    }
}

export const signIn = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (userCredential.user) {
            router.replace('/(dashboard)');
        }
    } catch (error: any) {
        console.log(error);
        alert(`Sign In Failed: ${error.message}`);
    }
};

export const signUp = async (email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (userCredential.user) {
            router.replace('/(dashboard)');
        }
    } catch (error: any) {
        console.log(error);
        alert(`Sign Up Failed: ${error.message}`);
    }
};

// Configure Google Sign-In for native platforms
export const configureGoogleSignIn = () => {
    if (GoogleSignin && Platform.OS !== 'web') {
        GoogleSignin.configure({
            webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
            offlineAccess: true,
        });
    }
};

// Google Sign-In function with platform detection
export const signInWithGoogle = async () => {
    try {
        if (Platform.OS === 'web') {
            // Web platform - try direct Firebase approach
            try {
                console.log('Starting Google Sign-In for web...');
                
                // Try to use Firebase's signInWithPopup if available
                try {
                    // Check if signInWithPopup is available in the current environment
                    const firebaseAuth = require('firebase/auth');
                    if (firebaseAuth.signInWithPopup) {
                        console.log('Using Firebase signInWithPopup');
                        const result = await firebaseAuth.signInWithPopup(auth, googleProvider);
                        
                        if (result.user) {
                            console.log('Google Sign-In successful:', result.user.email);
                            router.replace('/(dashboard)');
                            return;
                        }
                    }
                } catch (firebaseError) {
                    console.log('Firebase signInWithPopup not available, trying alternative...');
                }
                
                // Fallback: Use Expo AuthSession
                const redirectUri = AuthSession.makeRedirectUri();
                
                const request = new AuthSession.AuthRequest({
                    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!,
                    scopes: ['openid', 'profile', 'email'],
                    redirectUri,
                    responseType: AuthSession.ResponseType.IdToken,
                });
                
                console.log('Using Expo AuthSession fallback');
                console.log('Redirect URI:', redirectUri);
                
                const result = await request.promptAsync({
                    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
                });
                
                if (result.type === 'success' && result.params.id_token) {
                    const credential = GoogleAuthProvider.credential(result.params.id_token);
                    const userCredential = await signInWithCredential(auth, credential);
                    
                    if (userCredential.user) {
                        console.log('Google Sign-In successful via AuthSession:', userCredential.user.email);
                        router.replace('/(dashboard)');
                    }
                } else if (result.type === 'cancel') {
                    alert('Sign-in was cancelled');
                } else {
                    throw new Error('Failed to complete Google Sign-In');
                }
            } catch (webError: any) {
                console.error('Web Google Sign-In Error:', webError);
                
                // Provide helpful error messages
                let errorMessage = 'Google Sign-In failed';
                if (webError.message?.includes('unauthorized_domain')) {
                    errorMessage = 'Domain not authorized. Please add localhost to Firebase authorized domains.';
                } else if (webError.message?.includes('popup')) {
                    errorMessage = 'Please allow popups and try again.';
                } else {
                    errorMessage = `Google Sign-In error: ${webError.message}`;
                }
                
                alert(errorMessage);
                return;
            }
        } else {
            // Native platforms - use react-native-google-signin
            if (!GoogleSignin) {
                alert('Google Sign-In is not available on this platform. Please use email/password authentication.');
                return;
            }

            // Configure Google Sign-In if not already configured
            configureGoogleSignIn();

            // Check if device supports Google Play (Android only)
            if (Platform.OS === 'android') {
                try {
                    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
                } catch (playServicesError) {
                    alert('Google Play Services are required for Google Sign-In');
                    return;
                }
            }
            
            // Get the user's ID token
            const signInResult = await GoogleSignin.signIn();
            console.log('Native Google Sign-In result:', signInResult);
            
            const idToken = signInResult.data?.idToken || signInResult.idToken;
            
            if (!idToken) {
                throw new Error('Failed to get ID token from Google Sign-In');
            }
            
            // Create a Google credential with the token
            const googleCredential = GoogleAuthProvider.credential(idToken);
            
            // Sign-in the user with the credential
            const userCredential = await signInWithCredential(auth, googleCredential);
            
            if (userCredential.user) {
                console.log('Firebase authentication successful:', userCredential.user.email);
                router.replace('/(dashboard)');
            }
        }
    } catch (error: any) {
        console.log('Google Sign-In Error:', error);
        
        // More user-friendly error messages
        let errorMessage = 'Google Sign In Failed';
        
        if (error.code === 'auth/account-exists-with-different-credential') {
            errorMessage = 'An account already exists with this email using a different sign-in method';
        } else if (error.code === 'auth/invalid-credential') {
            errorMessage = 'Invalid credentials. Please try again';
        } else if (error.code === 'auth/operation-not-allowed') {
            errorMessage = 'Google Sign-In is not enabled. Please contact support';
        } else if (error.code === 'auth/user-disabled') {
            errorMessage = 'This account has been disabled';
        } else if (error.code === 'auth/user-not-found') {
            errorMessage = 'No account found with this email';
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Incorrect password';
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        alert(errorMessage);
    }
};

// Sign out function (including Google sign out)
export const signOut = async () => {
    try {
        // Sign out from Firebase
        await auth.signOut();
        
        // Sign out from Google (native platforms only)
        if (GoogleSignin && Platform.OS !== 'web') {
            await GoogleSignin.signOut();
        }
        
        router.replace('/(login)/login');
    } catch (error: any) {
        console.log('Sign Out Error:', error);
        alert(`Sign Out Failed: ${error.message}`);
    }
};