import {
    Link
} from "react-router-dom";

import {
    MapPin
} from "lucide-react";

export default function ProjectCard({ project }) {

    return (
        <Link
            to={`/projects/${project.id}`}
            className="
        rounded-xl
        overflow-hidden
        bg-[#071027]
        border
        border-white/10
        block
        hover:border-violet-500/50
        transition
      "
        >

            <img
                src={project.image}
                alt={project.name}
                className="
          w-full
          h-48
          object-cover
        "
            />

            <div className="p-4">

                <h3 className="font-bold text-sm">
                    {project.name}
                </h3>

                <p className="
          mt-2
          flex
          gap-1
          text-[9px]
          text-slate-500
        ">
                    <MapPin size={11} />
                    {project.city}
                </p>

                <div className="
          mt-4
          flex
                flex-wrap
          justify-between
                gap-2
          text-[10px]
          text-slate-400
        ">

                    <span>
                        {project.price}
                    </span>

                    <span>
                        Possession {project.possession}
                    </span>

                </div>

            </div>

        </Link>
    );
}