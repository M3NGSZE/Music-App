import { Pause, SkipBack, SkipForward } from "lucide-react";

export default function MiniPlayer() {
    return (
      <div className="flex justify-center pt-2">
        <div className="w-[90%] bg-amber-700 flex rounded-xl">
          <div className="flex w-[70%] p-2 gap-3">
            <div className="bg-gray-400 w-[20%] rounded-lg">
              <img
                src="assets/music/album-coverw.jpg"
                alt=""
                className="w-full rounded-lg"
              />
            </div>
            <span className="flex flex-col justify-center">
              <p className="text-xl font-medium">Music Title</p>
              <p className="text-[14px]">Artis Name</p>
            </span>
          </div>
          <div className="flex items-center justify-center w-[30%] gap-2 ">
            <button>
              <SkipBack size={23} />
            </button>
            <button>
              <Pause size={23} />
            </button>
            <button>
              <SkipForward size={23} />
            </button>
          </div>
        </div>
      </div>
    );
}