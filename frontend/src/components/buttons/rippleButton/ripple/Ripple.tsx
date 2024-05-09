import React, {useState, useLayoutEffect} from "react";
import styles from "./Ripple.module.css";


const useDebouncedRippleCleanUp = (
    rippleCount: number,
    duration: number,
    cleanUpFunction: () => void,
) => {
    useLayoutEffect(() => {
        let bounce: NodeJS.Timeout | undefined = undefined;
        if (rippleCount > 0) {
            clearTimeout(bounce);

            bounce = setTimeout(() => {
                cleanUpFunction();
                clearTimeout(bounce);
            }, duration * 4);
        }

        return () => clearTimeout(bounce);
    }, [rippleCount, duration, cleanUpFunction]);
};

interface RippleProps {
    duration: number,
    color: string
}

const Ripple: React.FC<RippleProps> = ({duration, color}) => {
    const [rippleArray,
        setRippleArray] = useState<
        Array<{
            x: number; y: number; size: number;
        }>>([]);

    useDebouncedRippleCleanUp(rippleArray.length, duration, () => {
        setRippleArray([]);
    });

    const addRipple:React.MouseEventHandler<HTMLDivElement> = (event: React.MouseEvent<HTMLDivElement>) => {
        const rippleContainer = event.currentTarget.getBoundingClientRect();
        const size =
            rippleContainer.width > rippleContainer.height
                ? rippleContainer.width
                : rippleContainer.height;
        const x = event.pageX - rippleContainer.x - size / 2;
        const y = event.pageY - rippleContainer.y - size / 2;
        const newRipple = {
            x,
            y,
            size,
        };

        setRippleArray([...rippleArray, newRipple]);
    };

    return (
        <div className={styles.rippleContainer} onMouseDown={addRipple}>
            {rippleArray.length > 0 &&
                rippleArray.map((ripple, index) => {
                    return (
                        <span
                            key={"span" + index}
                            style={{
                                top: ripple.y,
                                left: ripple.x,
                                width: ripple.size,
                                height: ripple.size,
                                backgroundColor: color,
                                animationDuration: `${duration}ms`
                            }}
                        />
                    );
                })}
        </div>
    );
};

export default Ripple;
