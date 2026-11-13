import { Pause } from "lucide-react";

export default function CardMusicPlayer() {
    return (
        <div className="flex justify-center pt-2">
            <div className="w-[90%] bg-amber-700 flex rounded-lg">
                <div className="flex w-[80%] p-2 gap-3">
                    <div className="bg-gray-400 w-[20%] rounded-lg">
                        <img src="" alt="" className="w-full"/>
                    </div>
                    <div className="">
                        <span>
                            <p className="text-xl font-medium">Music Title</p>
                            <p className="text-[14px]">Artis Name</p>
                        </span>
                    </div>
                </div>
                <div className="flex items-center justify-center w-[20%]">
                    <button>
                        <Pause size={26} />
                    </button>
                </div>
            </div>
        </div>
    );
}