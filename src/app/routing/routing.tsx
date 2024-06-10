import {createBrowserRouter, Outlet, RouterProvider,} from "react-router-dom";
import {Layout} from "@/widgets/Layout.tsx";
import {FabricsPage} from "@/pages/fabrics/fabrics-page.tsx";
import {ModelsPage} from "@/pages/fabrics/models-page.tsx";
import {OrdersPage} from "@/pages/fabrics/orders-page.tsx";
import {PrivateRouter} from "@/app/providers/PrivateRouter.tsx";

const router = createBrowserRouter([
    {
        element: <Layout>
            <Outlet/>
        </Layout>,
        children: [
            {
                path: '/',
                element: <div>1</div>
            },
            {
                path: 'fabric',
                element: <FabricsPage/>
            },
            {
                path: 'models',
                element: <ModelsPage/>
            },
            {
                path: 'orders',
                element: <PrivateRouter><OrdersPage/></PrivateRouter>
            }
        ]
    },
]);
export const CurrentRootProvider = () => (
    <RouterProvider router={router}/>
)
