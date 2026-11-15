import { createBrowserRouter } from "react-router";
import { MainLayout } from "../components/layout/MainLayout";
import { HomePage } from "../features/home/pages/Homepage";
import { LibraryPage } from "../features/library/pages/Librarypage";
import { SearchPage } from "../features/search/pages/SearchPage";
import { PlayListsPage } from "../features/playlists/pages/PlayListsPage";
import { SettingPage } from "../features/settings/pages/SettingPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "library",
                element: <LibraryPage />,
            },
            {
                path: "search",
                element: <SearchPage />,
            },
            {
                path: "playlists",
                element: <PlayListsPage />,
            },
            {
                path: "settings",
                element: <SettingPage />,
            },
        ],
    },
]);

export default router;