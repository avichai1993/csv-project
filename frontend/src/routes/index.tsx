/**
 * Route Definitions
 *
 * Defines all application routes using React Router.
 */

import {
  createBrowserRouter,
  Navigate,
  type RouteObject,
} from "react-router-dom";
import TargetListPage from "./TargetListPage";

/**
 * Application routes
 */
const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/targets" replace />,
  },
  {
    path: "/targets",
    element: <TargetListPage />,
  },
  {
    path: "/targets/:id",
    element: <TargetListPage />, // Detail view handled via modal
  },
];

/**
 * Router instance
 */
export const router = createBrowserRouter(routes);

export default router;
