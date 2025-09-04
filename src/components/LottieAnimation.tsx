"use client";

import {useLottie} from 'lottie-react';

interface LottieAnimationProps {
    animationData?: unknown,
    height?: number,
    width?: number,
}

const LottieAnimation = (props: LottieAnimationProps) => {
    const {View} = useLottie({
        animationData: props.animationData,
        loop: true,
        autoplay: true,
        renderer: "svg"
    });

    return (
        <div style={{ width: (props.width?.toString() ?? '100') + 'px', height: (props.height?.toString() ?? '100') + 'px' }}>
            {View}
        </div>
    );
};

export default LottieAnimation;