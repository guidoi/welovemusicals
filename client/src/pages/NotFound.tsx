import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <Card className="mx-4 w-full max-w-lg border border-gold/20 bg-card shadow-lg shadow-black/30">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gold/15 animate-pulse" />
              <AlertCircle className="relative h-16 w-16 text-gold" />
            </div>
          </div>

          <h1 className="mb-2 text-4xl font-bold text-foreground">404</h1>

          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Seite nicht gefunden
          </h2>

          <p className="mb-8 leading-relaxed text-muted-foreground">
            Die von dir aufgerufene Seite gibt es leider nicht.
            <br />
            Vielleicht wurde sie verschoben oder entfernt.
          </p>

          <div
            id="not-found-button-group"
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button
              onClick={handleGoHome}
              className="rounded-lg bg-gold px-6 py-2.5 text-background shadow-md transition-all duration-200 hover:bg-gold-light hover:shadow-lg"
            >
              <Home className="w-4 h-4 mr-2" />
              Zur Startseite
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
