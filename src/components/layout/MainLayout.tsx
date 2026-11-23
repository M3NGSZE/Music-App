import { Outlet } from "react-router";
import Nagivation from "./Navigation";
import MiniPlayer from "./MiniPlayer";

export function MainLayout() {
    return (
        <div className="h-screen overflow-hidden bg-app-bg">
            <main
                id="main-scroll-container"
                className="h-full overflow-y-auto hide-scrollbar pb-40 px-6 pt-15"
            >
                <Outlet />
            </main>

            <div className="fixed bottom-5 left-0 z-50 flex w-full flex-col items-center gap-2">
                <MiniPlayer />
                <Nagivation />
            </div>
        </div>
    );
}