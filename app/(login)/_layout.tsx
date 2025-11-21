import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import "../globals.css";

export default function LoginLayout() {
    return (
        <>
            <StatusBar style="dark" backgroundColor="#FFFFFF" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: Platform.OS === 'ios' ? 'slide_from_bottom' : 'slide_from_right',
                    gestureEnabled: true,
                    contentStyle: {
                        backgroundColor: '#FFFFFF',
                    },
                }}
            >
                <Stack.Screen 
                    name="login"
                    options={{
                        headerShown: false,
                        title: 'Sign In',
                        gestureEnabled: true,
                    }}
                />
                <Stack.Screen 
                    name="signup"
                    options={{
                        headerShown: false,
                        title: 'Sign Up',
                        gestureEnabled: true,
                    }}
                />
                <Stack.Screen 
                    name="forgetPassword"
                    options={{
                        headerShown: false,
                        title: 'Reset Password',
                        gestureEnabled: true,
                        presentation: 'modal',
                    }}
                />
            </Stack>
        </>
    );
}