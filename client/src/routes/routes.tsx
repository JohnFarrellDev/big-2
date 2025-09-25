import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Home } from "./home/home";
import Lobby from "./lobby/lobby";

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  path: "/",
  component: () => <Home />,
  getParentRoute: () => rootRoute,
});

const lobbyRoute = createRoute({
  path: "/lobby/$lobbyId",
  component: () => <Lobby />,
  getParentRoute: () => rootRoute,
});

const routeTree = rootRoute.addChildren([indexRoute, lobbyRoute]);

export const router = createRouter({ routeTree });
