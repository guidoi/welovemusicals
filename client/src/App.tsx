import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect, useLayoutEffect, useRef } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import MusicalDetail from "./pages/MusicalDetail";
import CityDetail from "./pages/CityDetail";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import { didRouteChange, getScrollToTopOptions } from "./lib/route-scroll";

function ScrollToTop() {
  const [location] = useLocation();
  const prevLocation = useRef<string | null>(null);

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useLayoutEffect(() => {
    // Reset synchronously before paint so city cards opened from a deep home-page anchor start at the city hero.
    if (didRouteChange(prevLocation.current, location)) {
      window.scrollTo(getScrollToTopOptions());
    }
    prevLocation.current = location;
  }, [location]);

  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/musical/:slug"} component={MusicalDetail} />
        <Route path={"/stadt/:slug"} component={CityDetail} />
        <Route path={"/impressum"} component={Impressum} />
        <Route path={"/datenschutz"} component={Datenschutz} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
