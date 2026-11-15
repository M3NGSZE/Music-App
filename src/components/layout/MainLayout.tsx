import { Outlet } from "react-router";
import CardMusicPlayer from "../common/CardMusicPlayer";
import Nagivation from "./Navigation";

export function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1">
                <Outlet/>
            </main>
            <div className="sticky bottom-0">
                <CardMusicPlayer />
                <Nagivation />
            </div>
        </div>
    );
}