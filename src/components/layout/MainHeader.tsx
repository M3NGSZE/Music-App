import { Settings } from "lucide-react";
import { useNavigate } from "react-router";

interface MainHeaderProps {
    title: string
}

const MainHeader = ({ title }: MainHeaderProps) => {

    const navigate = useNavigate();

    return (
        <header className="flex items-center justify-between">
            <h1 className="font-black text-4xl">{title}</h1>
            <button
                className="flex items-center justify-center border rounded-full border-white/15 bg-white/10 p-3 backdrop-blur-xl shadow-lg"
                onClick={() => navigate("/settings")}
            >
                <Settings size={23} />
            </button>
        </header>
    );
};

export default MainHeader;