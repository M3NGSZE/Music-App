import { Settings } from "lucide-react";
import { useNavigate } from "react-router";

export function LibraryPage(){

    const navigate = useNavigate();

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="font-black text-4xl">Library</h1>
                <button 
                    className="flex items-center justify-center border rounded-full border-white/15 bg-white/10 p-3 backdrop-blur-xl shadow-lg"
                    onClick={() => navigate("/settings")}
                >
                    <Settings size={23}/>
                </button>
            </div>
        </div>
    );
}