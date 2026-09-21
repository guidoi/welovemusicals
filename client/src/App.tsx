import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { lazy, Suspense, useEffect, useLayoutEffect, useRef } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { didRouteChange, resetScrollToTop } from "./lib/route-scroll";
import { ConsentProvider } from "./contexts/ConsentContext";
import CookieConsent from "./components/CookieConsent";
import OptionalConsentServices from "./components/OptionalConsentServices";
import { PricingProvider } from "./contexts/PricingContext";
import { getAdminAccessRedirect } from "./lib/admin-access-domain";

// Detail- und Rechteseiten sind nicht Teil der Startseiten-Interaktion. Durch
// Lazy Loading bleibt das initiale JavaScript der organisch wichtigsten
// Einstiegsseite kleiner; jede Route lädt ihren Code bei Bedarf nach.
const MusicalDetail = lazy(() => import("./pages/MusicalDetail"));
const CityDetail = lazy(() => import("./pages/CityDetail"));
const Impressum = lazy(() => import("./pages/Impressum"));
const Datenschutz = lazy(() => import("./pages/Datenschutz"));
const PriceSalesAdmin = lazy(() => import("./pages/PriceSalesAdmin"));

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
      resetScrollToTop((options) => window.scrollTo(options));
    }
    prevLocation.current = location;
  }, [location]);

  return null;
}

function PriceSalesAdminRoute() {
  const redirectUrl = getAdminAccessRedirect(window.location);

  useEffect(() => {
    if (redirectUrl) window.location.replace(redirectUrl);
  }, [redirectUrl]);

  if (redirectUrl) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#111018] px-6 text-center text-sm text-white/70">
        Verwaltung wird geöffnet …
      </main>
    );
  }

  return <PriceSalesAdmin />;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<main className="min-h-screen bg-background" aria-busy="true" />}>
        <Switch>
          <Route path={"/"} component={Home} />
          <Route path={"/musical/:slug"} component={MusicalDetail} />
          <Route path={"/stadt/:slug"} component={CityDetail} />
          <Route path={"/impressum"} component={Impressum} />
          <Route path={"/datenschutz"} component={Datenschutz} />
          <Route path={"/verwaltung/preise"} component={PriceSalesAdminRoute} />
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
      <ConsentProvider>
        <PricingProvider>
          <ThemeProvider defaultTheme="dark">
            <TooltipProvider>
              <Toaster />
              <Router />
              <OptionalConsentServices />
              <CookieConsent />
            </TooltipProvider>
          </ThemeProvider>
        </PricingProvider>
      </ConsentProvider>
    </ErrorBoundary>
  );
}

export default App;
