import { Outlet } from "react-router";
import Nagivation from "./Navigation";
import MiniPlayer from "../common/MiniPlayer";

export function MainLayout() {
    return (
        <div className="min-h-screen bg-[#0B0B12]">
            <main className="pb-28">
                <Outlet/>
            </main>
            <MiniPlayer />
            <Nagivation />
        </div>
    );
}