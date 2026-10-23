import {
    Building2,
    Users,
    Star,
    MapPin
} from "lucide-react";
import { useEffect, useState } from "react";

const stats = [
    [Building2, "1,200+", "Properties Listed"],
    [Users, "850+", "Happy Clients"],
    [Star, "15+", "Years Experience"],
    [MapPin, "25+", "Prime Locations"]
];

export default function Stats() {

    return (
        <div className="
      glass
      max-w-7xl
      mx-auto
      -mt-7
      relative
      z-20
      rounded-2xl
      grid
      grid-cols-2
      sm:grid-cols-4
      overflow-hidden
    ">

            {stats.map(([Icon, number, label]) => (

                <div
                    key={label}
                    className="
            p-5
            lg:p-7
            flex
            items-center
            gap-3
            border-white/10
            border-r
          "
                >

                    <Icon
                        size={28}
                        className="text-violet-400"
                    />

                    <div>

                        <CountUp value={number} />

                        <p className="
              text-[9px]
              text-slate-400
            ">
                            {label}
                        </p>

                    </div>

                </div>

            ))}

        </div>
    );
}

function CountUp({ value }) {
    const [displayValue, setDisplayValue] = useState(0);
    const targetValue = Number(value.replace(/[^0-9]/g, ""));

    useEffect(() => {
        const duration = 900;
        const startTime = performance.now();
        let animationFrame;

        const updateValue = (currentTime) => {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);

            setDisplayValue(Math.floor(targetValue * easedProgress));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(updateValue);
            }
        };

        animationFrame = requestAnimationFrame(updateValue);

        return () => cancelAnimationFrame(animationFrame);
    }, [targetValue]);

    return <b className="text-xl">{displayValue.toLocaleString()}+</b>;
}