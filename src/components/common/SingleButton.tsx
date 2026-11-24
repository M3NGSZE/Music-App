
import { useLocation, useNavigate } from "react-router";
import type { ReactNode } from "react";

interface ButtonProps {
    forwardRoute?: string;
    backwardRoute?: string;
    direction: "forward" | "back";
    icon: ReactNode;
}

const SingleButton = ({
    forwardRoute,
    backwardRoute,
    direction,
    icon,
}: ButtonProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = () => {
        if (direction === "forward" && forwardRoute) {
            navigate(forwardRoute, {
                state: { from: location.pathname },
            });
            return;
        }

        if (direction === "back") {
            const previousRoute = location.state?.from;

            if (previousRoute) {
                navigate(previousRoute);
            } else if (backwardRoute) {
                navigate(backwardRoute);
            } else {
                navigate(-1);
            }
        }
    };

    return (
        <button
            className="flex items-center justify-center border rounded-full border-white/15 bg-white/10 p-3 backdrop-blur-xl shadow-lg"
            onClick={handleClick}
        >
            {icon}
        </button>
    );
};

export default SingleButton;
