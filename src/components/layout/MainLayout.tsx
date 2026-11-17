import { Outlet } from "react-router";
import Nagivation from "./Navigation";
import MiniPlayer from "../common/MiniPlayer";

export function MainLayout() {
    return (
        <div className="min-h-screen bg-app-bg">
            <main className="pb-28">
                <Outlet/>
            </main>
            <div className="fixed bottom-5 left-0 z-50 flex w-full flex-col items-center gap-2">
                <MiniPlayer />
                <Nagivation />
            </div>
            
        </div>
    );
}