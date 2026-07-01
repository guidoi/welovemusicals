import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect, useRef, lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

// Lazy-loaded routes (Code-Splitting)
const MusicalDetail = lazy(() => import("./pages/MusicalDetail"));
const CityDetail = lazy(() => import("./pages/CityDetail"));
const Impressum = lazy(() => import("./pages/Impressum"));
const Datenschutz = lazy(() => import("./pages/Datenschutz"));

function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function ScrollToTop() {
  const [location] = useLocation();
  const prevLocation = useRef<string | null>(null);

  useEffect(() => {
    // Only scroll if the location actually changed (not on first render)
    if (prevLocation.current !== null && prevLocation.current !== location) {
      // Use requestAnimationFrame to ensure scroll happens after paint
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
    }
    prevLocation.current = location;
  }, [location]);

  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path={"/"} component={Home} />
          <Route path={"/musical/:slug"} component={MusicalDetail} />
          <Route path={"/stadt/:slug"} component={CityDetail} />
          <Route path={"/impressum"} component={Impressum} />
          <Route path={"/datenschutz"} component={Datenschutz} />
          <Route path={"/404"} component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
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
