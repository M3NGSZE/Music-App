import { Settings } from "lucide-react";
import SingleButton from "../common/SingleButton";

interface MainHeaderProps {
    title: string
}

const MainHeader = ({ title }: MainHeaderProps) => {

    return (
        <header className="flex items-center justify-between">
            <h1 className="font-black text-4xl">{title}</h1>
            <SingleButton
                direction="forward"
                forwardRoute="/settings"
                icon={<Settings size={23} />}
            />
        </header>
    );
};

export default MainHeader;