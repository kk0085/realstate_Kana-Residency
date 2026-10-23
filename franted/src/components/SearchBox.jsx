import {
    Search,
    MapPin,
    Building2
} from "lucide-react";

import {
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

export default function SearchBox() {

    const navigate = useNavigate();

    const [mode, setMode] = useState("Buy");
    const [city, setCity] = useState("");
    const [type, setType] = useState("Any Type");

    function search(e) {

        e.preventDefault();

        navigate(
            `/properties?city=${city}&type=${type}&mode=${mode}`
        );

    }

    return (
        <form
            onSubmit={search}
            className="
        glass
        p-2
        rounded-2xl
        grid
        lg:grid-cols-[150px_1fr_1fr_190px]
      "
        >

            {/* Buy / Rent */}

            <div className="
        flex
        bg-white/[.04]
        rounded-xl
        p-1
      ">

                {["Buy", "Rent"].map(item => (

                    <button
                        type="button"
                        key={item}
                        onClick={() => setMode(item)}
                        className={`
              flex-1
              rounded-lg
              text-xs
              font-bold
              ${mode === item
                                ? "gradient-btn"
                                : "text-slate-400"
                            }
            `}
                    >
                        {item}
                    </button>

                ))}

            </div>

            {/* Location */}

            <div className="
        flex
        items-center
        gap-3
        px-4
        py-3
        border-t
        lg:border-t-0
        lg:border-l
        border-white/10
      ">

                <MapPin
                    size={18}
                    className="text-violet-400"
                />

                <div className="flex-1">

                    <b className="block text-[10px]">
                        Location
                    </b>

                    <input
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="Select City"
                        className="
              w-full
              bg-transparent
              text-xs
              text-slate-400
              outline-none
            "
                    />

                </div>

            </div>

            {/* Type */}

            <div className="
        flex
        items-center
        gap-3
        px-4
        py-3
        border-t
        lg:border-t-0
        lg:border-l
        border-white/10
      ">

                <Building2
                    size={18}
                    className="text-violet-400"
                />

                <div className="flex-1">

                    <b className="block text-[10px]">
                        Property Type
                    </b>

                    <select
                        value={type}
                        onChange={e => setType(e.target.value)}
                        className="
              w-full
              bg-transparent
              text-xs
              text-slate-400
              outline-none
            "
                    >

                        <option>Any Type</option>
                        <option>Apartment</option>
                        <option>Villa</option>
                        <option>House</option>
                        <option>Plot</option>
                        <option>Commercial</option>

                    </select>

                </div>

            </div>

            <button className="
        gradient-btn
        rounded-xl
        flex
        items-center
        justify-center
        gap-2
        py-3
        text-xs
        font-bold
      ">

                <Search size={15} />

                Search Properties

            </button>

        </form>
    );
}