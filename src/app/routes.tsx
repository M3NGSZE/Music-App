import { createBrowserRouter } from "react-router";
import { MainLayout } from "../components/layout/MainLayout";
import { HomePage } from "../features/home/pages/Homepage";
import { SearchPage } from "../features/search/pages/SearchPage";
import { LibraryPage } from "../features/library/pages/LibraryPage";
import NotFoundPage from "../pages/NotFoundPage";

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
                path: "*",
                element: <NotFoundPage/>
            }
            
        ],
    },
]);

export default router;