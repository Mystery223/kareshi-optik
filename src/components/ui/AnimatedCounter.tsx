"use client";

import { useEffect, useState, useRef } from "react";
import { useInView, animate } from "framer-motion";

interface AnimatedCounterProps {
    from: number;
    to: number;
    duration?: number;
}

export default function AnimatedCounter({ from, to, duration = 2 }: AnimatedCounterProps) {
    const [count, setCount] = useState(from);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (inView) {
            const controls = animate(from, to, {
                duration: duration,
                onUpdate(value) {
                    setCount(Math.floor(value));
                },
            });
            return () => controls.stop();
        }
    }, [from, to, duration, inView]);

    return <span ref={ref}>{count}</span>;
}
