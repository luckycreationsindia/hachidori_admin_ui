"use client";

import React, {useState} from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Terminal} from "lucide-react";
import {useRouter, useSearchParams} from "next/navigation";
import {signIn, useSession} from "next-auth/react";
import LottieAnimation from "@/components/LottieAnimation";
import loadingSvg from "@/assets/animations/loading.json";

export default function LoginPage() {
    type AlertVariant = "default" | "destructive" | null | undefined;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [alertTitle, setAlertTitle] = useState("Heads up!");
    const [alertDescription, setAlertDescription] = useState("Please do not share your credentials with anyone.");
    const [alertVariant, setAlertVariant] = useState<AlertVariant>("default");

    const {status} = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setAlertTitle("Login Failed");
                setAlertDescription(result.error || "Login failed. Please check your credentials.");
                setAlertVariant("destructive");
                setIsLoading(false);
            } else {
                router.replace(callbackUrl);
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) {
            setAlertTitle("Login Failed");
            setAlertDescription("An unexpected error occurred during login.");
            setAlertVariant("destructive");
            setIsLoading(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <LottieAnimation animationData={loadingSvg} height={200} width={200}/>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md rounded-lg shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">Login</CardTitle>
                    <CardDescription>Enter your email below to log in to your account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                placeholder="*******"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <Button type="submit" className="w-full rounded-md py-2" disabled={isLoading}>
                            {isLoading ? "Signing In..." : "Sign In"}
                            <div hidden={!isLoading} className="flex justify-center">
                                <LottieAnimation animationData={loadingSvg} height={30} width={30}/>
                            </div>
                        </Button>
                        <Alert variant={alertVariant} hidden={isLoading}>
                            <Terminal/>
                            <AlertTitle>{alertTitle}</AlertTitle>
                            <AlertDescription>
                                {alertDescription}
                            </AlertDescription>
                        </Alert>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                        By signing in, you agree to our{" "}
                        <a href="#" className="underline">Terms of Service</a> and{" "}
                        <a href="#" className="underline">Privacy Policy</a>.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}