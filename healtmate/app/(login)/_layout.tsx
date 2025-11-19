import { Stack } from "expo-router";
import "../globals.css";

export default function LoginLayout() {
    return (
        <Stack>
            <Stack.Screen 
               name="login"
               options = {{
                  headerShown : false,
               }}
            />
            <Stack.Screen 
                name="signup"
                options={{
                    headerShown : false,
                }}
            />
            <Stack.Screen 
                name="forgetPassword"
                options={{
                    headerShown : false,
                }}
            />
        </Stack>
    )
}