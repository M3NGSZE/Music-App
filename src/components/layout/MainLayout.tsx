import { Outlet } from "react-router";
import Nagivation from "./Navigation";
import MiniPlayer from "../common/MiniPlayer";

export function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1">
                <Outlet/>
            </main>
            <div className="sticky bottom-0">
                <MiniPlayer />
                <Nagivation />
            </div>
        </div>
    );
}