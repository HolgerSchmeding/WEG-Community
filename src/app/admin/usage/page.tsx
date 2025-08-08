"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity,
  CreditCard, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

interface UsageData {
  currentMonth: {
    aiRequests: number;
    maxRequests: number;
    cost: number;
    budget: number;
  };
  breakdown: Array<{
    service: string;
    requests: number;
    cost: number;
    avgResponseTime: string;
  }>;
  dailyUsage: Array<{
    day: string;
    requests: number;
  }>;
  metrics: {
    totalRequests: number;
    totalCost: number;
    weeklyAverage: number;
    projectedMonthly: number;
    costPerRequest: number;
  };
  lastUpdated: string;
}

export default function UsagePage() {
  const [usageData, setUsageData] = React.useState<UsageData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchUsage() {
      try {
        const response = await fetch('/api/usage');
        if (!response.ok) {
          throw new Error('Failed to fetch usage data');
        }
        const data = await response.json();
        setUsageData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchUsage();
  }, []);

  if (loading) {
    return (
      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="font-headline text-4xl font-bold tracking-tight">
              AI-Service Verbrauch
            </h1>
            <p className="mt-2 text-muted-foreground">
              Lade Verbrauchsdaten...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-gray-200 rounded w-full mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="max-w-6xl mx-auto text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="font-headline text-2xl font-bold tracking-tight mb-2">
            Fehler beim Laden der Daten
          </h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  if (!usageData) {
    return null;
  }

  const usagePercentage = (usageData.currentMonth.aiRequests / usageData.currentMonth.maxRequests) * 100;
  const costPercentage = (usageData.currentMonth.cost / usageData.currentMonth.budget) * 100;

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-headline text-4xl font-bold tracking-tight">
            AI-Service Verbrauch
          </h1>
          <p className="mt-2 text-muted-foreground">
            Überwachen Sie Ihren Verbrauch an Premium AI-Anfragen und Kosten
          </p>
        </div>

        {/* Übersicht Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI-Anfragen (Monat)</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usageData.currentMonth.aiRequests.toLocaleString()}
              </div>
              <div className="flex items-center justify-between mt-2">
                <Progress value={usagePercentage} className="flex-1 mr-2" />
                <Badge variant={usagePercentage > 80 ? "destructive" : "secondary"}>
                  {usagePercentage.toFixed(1)}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                von {usageData.currentMonth.maxRequests.toLocaleString()} verfügbar
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kosten (Monat)</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usageData.currentMonth.cost.toFixed(2)}€
              </div>
              <div className="flex items-center justify-between mt-2">
                <Progress value={costPercentage} className="flex-1 mr-2" />
                <Badge variant={costPercentage > 80 ? "destructive" : "secondary"}>
                  {costPercentage.toFixed(1)}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                von {usageData.currentMonth.budget.toFixed(2)}€ Budget
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                Aktiv
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Alle Services verfügbar
              </p>
              <div className="flex items-center mt-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                Nächste Abrechnung: 01.09.2025
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Service-Aufschlüsselung</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {usageData.breakdown.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{service.service}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>{service.requests} Anfragen</span>
                      <span>Ø {service.avgResponseTime}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{service.cost.toFixed(2)}€</div>
                    <div className="text-sm text-muted-foreground">
                      {(service.cost / service.requests * 100).toFixed(1)}¢ pro Anfrage
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Wöchentlicher Verlauf */}
        <Card>
          <CardHeader>
            <CardTitle>Wöchentlicher Verlauf</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end space-x-2 h-32">
              {usageData.dailyUsage.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="bg-primary rounded w-full"
                    style={{ height: `${(day.requests / 60) * 100}%`, minHeight: '4px' }}
                  />
                  <span className="text-xs text-muted-foreground mt-2">{day.day}</span>
                  <span className="text-xs font-medium">{day.requests}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
