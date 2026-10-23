import {
    Heart,
    MapPin,
    BedDouble,
    Bath,
    Ruler
} from "lucide-react";

import {
    Link
} from "react-router-dom";

import { useState } from "react";

export default function PropertyCard({ property }) {

    const [liked, setLiked] = useState(false);

    return (
        <Link
            to={`/properties/${property.id}`}
            className="
        property-card
        rounded-xl
        overflow-hidden
        block
        hover:-translate-y-1
        transition
      "
        >

            <div className="
        relative
        h-48
        overflow-hidden
      ">

                <img
                    src={property.image}
                    alt={property.title}
                    className="
            w-full
            h-full
            object-cover
            hover:scale-105
            transition
            duration-500
          "
                />

                <span className="
          absolute
          top-3
          left-3
          gradient-btn
          rounded-full
          px-3
          py-1
          text-[8px]
          font-bold
        ">
                    {property.tag}
                </span>

                <button
                    onClick={e => {
                        e.preventDefault();
                        setLiked(!liked);
                    }}
                    className="
            absolute
            top-3
            right-3
            rounded-full
            bg-black/50
            p-2
          "
                >
                    <Heart
                        size={14}
                        className={
                            liked
                                ? "fill-pink-500 text-pink-500"
                                : ""
                        }
                    />
                </button>

            </div>

            <div className="p-4">

                <h3 className="text-lg font-bold">
                    {property.price}
                </h3>

                <p className="
          mt-1
          text-xs
          font-semibold
        ">
                    {property.title}
                </p>

                <p className="
          mt-2
          flex
          gap-1
          items-center
          text-[9px]
          text-slate-500
        ">
                    <MapPin size={11} />
                    {property.city}
                </p>

                <div className="
          mt-4
          pt-3
          border-t
          border-white/5
          flex
                flex-wrap
          gap-3
          text-[9px]
          text-slate-400
        ">

                    {property.beds > 0 && (
                        <span className="flex gap-1">
                            <BedDouble size={11} />
                            {property.beds} Beds
                        </span>
                    )}

                    {property.baths > 0 && (
                        <span className="flex gap-1">
                            <Bath size={11} />
                            {property.baths} Baths
                        </span>
                    )}

                    <span className="flex gap-1">
                        <Ruler size={11} />
                        {property.area}
                    </span>

                </div>

            </div>

        </Link>
    );
}