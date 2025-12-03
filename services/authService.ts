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
let isGoogleSignInAvailable = false;

// Only try to load on native platforms, and catch all errors silently
if (Platform.OS !== 'web') {
    try {
        // This will fail in Expo Go - that's expected
        const GoogleSignInModule = require('@react-native-google-signin/google-signin');
        GoogleSignin = GoogleSignInModule?.GoogleSignin;
        isGoogleSignInAvailable = !!GoogleSignin;
        if (isGoogleSignInAvailable) {
            console.log('✅ Google Sign-In module loaded');
        }
    } catch {
        // Silent fail - expected in Expo Go
        isGoogleSignInAvailable = false;
    }
} else {
    // Web platform uses different method
    isGoogleSignInAvailable = true;
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
    if (!isGoogleSignInAvailable || !GoogleSignin || Platform.OS === 'web') {
        console.log('⚠️ Skipping Google Sign-In configuration:', {
            available: isGoogleSignInAvailable,
            hasModule: !!GoogleSignin,
            platform: Platform.OS
        });
        return;
    }
    
    try {
        // Use platform-specific client ID if available, fallback to web client ID
        const clientId = Platform.OS === 'ios' 
            ? (process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID)
            : (process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID);
            
        console.log(`🔧 Configuring Google Sign-In for ${Platform.OS}`);
        console.log('Using client ID:', clientId ? 'Found' : 'Missing');
        
        GoogleSignin.configure({
            webClientId: clientId,
            offlineAccess: true,
            forceCodeForRefreshToken: true,
            iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID, // iOS specific
        });
        
        console.log('✅ Google Sign-In configured successfully');
    } catch (error) {
        console.error('❌ Failed to configure Google Sign-In:', error);
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
            if (!isGoogleSignInAvailable || !GoogleSignin) {
                console.error('❌ Google Sign-In module not available');
                console.error('Platform:', Platform.OS);
                console.error('GoogleSignin object:', GoogleSignin);
                alert('Google Sign-In is not configured for mobile yet. Please:\n\n1. Set up Firebase iOS/Android apps\n2. Add GoogleService files\n3. Rebuild the app\n\nFor now, please use email/password authentication.');
                return;
            }

            console.log('🔵 Starting Google Sign-In for', Platform.OS);

            // Configure Google Sign-In if not already configured
            configureGoogleSignIn();

            // Check if device supports Google Play (Android only)
            if (Platform.OS === 'android') {
                try {
                    console.log('Checking Google Play Services...');
                    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
                    console.log('✅ Google Play Services available');
                } catch (playServicesError: any) {
                    console.error('❌ Google Play Services error:', playServicesError);
                    alert('Google Play Services are required for Google Sign-In. Please update Google Play Services and try again.');
                    return;
                }
            }
            
            // Get the user's ID token
            console.log('Opening Google Sign-In dialog...');
            const signInResult = await GoogleSignin.signIn();
            console.log('✅ Google Sign-In completed:', {
                hasIdToken: !!signInResult.data?.idToken || !!signInResult.idToken,
                user: signInResult.data?.user?.email || signInResult.user?.email
            });
            
            // Try multiple ways to get the ID token (different versions return different structures)
            const idToken = signInResult.data?.idToken || signInResult.idToken || signInResult.data?.user?.idToken;
            
            if (!idToken) {
                console.error('❌ No ID token received from Google Sign-In');
                console.error('Sign-in result structure:', JSON.stringify(signInResult, null, 2));
                throw new Error('Failed to get ID token from Google Sign-In. Please try again.');
            }
            
            console.log('Creating Firebase credential...');
            // Create a Google credential with the token
            const googleCredential = GoogleAuthProvider.credential(idToken);
            
            console.log('Signing in to Firebase...');
            // Sign-in the user with the credential
            const userCredential = await signInWithCredential(auth, googleCredential);
            
            if (userCredential.user) {
                console.log('✅ Firebase authentication successful:', userCredential.user.email);
                router.replace('/(dashboard)');
            } else {
                throw new Error('Firebase authentication failed');
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
        
        router.replace('../');
    } catch (error: any) {
        console.log('Sign Out Error:', error);
        alert(`Sign Out Failed: ${error.message}`);
    }
};