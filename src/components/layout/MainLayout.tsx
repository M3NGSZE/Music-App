import { Outlet } from "react-router";
import CardMusicPlayer from "../common/CardMusicPlayer";
import Nagivation from "./Navigation";

export function MainLayout() {
    return (
        <>
            <main>
                <Outlet/>
            </main>
            <CardMusicPlayer />
            <Nagivation />
        </>
    );
}