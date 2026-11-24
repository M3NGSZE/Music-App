import { Outlet } from "react-router";
import Nagivation from "./Navigation";
import MiniPlayer from "./MiniPlayer";

export function MainLayout() {
    return (
        <div className="h-screen w-full overflow-hidden bg-app-bg">
            <main
                id="main-scroll-container"
                className="h-full w-full min-w-0 overflow-x-hidden overflow-y-auto px-3 pt-10 pb-40"
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