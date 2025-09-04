import {Suspense} from 'react';
import LoginForm from './login-form';
import LottieAnimation from '@/components/LottieAnimation';
import loadingSvg from "@/assets/animations/loading.json";

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center p-4">
                    <LottieAnimation animationData={loadingSvg} height={200} width={200}/>
                </div>
            }
        >
            <LoginForm/>
        </Suspense>
    );
}
