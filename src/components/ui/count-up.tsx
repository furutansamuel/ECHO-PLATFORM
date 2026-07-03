"use client"

import { useInView } from 'react-intersection-observer';
import { CountUp as CountUpLib } from 'use-count-up';

interface CountUpProps {
    start: number;
    end: number;
    duration: number;
    separator?: string;
    suffix?: string;
    prefix?: string;
}

export const CountUp = (props: CountUpProps) => {
    const { ref, inView } = useInView({
        threshold: 0.3,
        triggerOnce: true,
    });

    return (
        <div ref={ref}>
            {inView ? <CountUpLib isCounting end={props.end} duration={props.duration} thousandsSeparator={props.separator} /> : <span>{props.start}</span>}
        </div>
    );
};
