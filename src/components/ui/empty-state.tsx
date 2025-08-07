import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileX, 
  Search, 
  Users, 
  ShoppingBag, 
  Bell, 
  Calendar, 
  MessageSquare,
  Building2,
  Folder,
  Settings,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

export type EmptyStateIcon = 
  | 'file' 
  | 'search' 
  | 'users' 
  | 'shopping' 
  | 'notifications' 
  | 'calendar' 
  | 'messages'
  | 'building'
  | 'folder'
  | 'settings'
  | 'custom';

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'secondary';
  icon?: ReactNode;
}

export interface EmptyStateProps {
  icon?: EmptyStateIcon;
  customIcon?: ReactNode;
  title: string;
  description?: string;
  actions?: EmptyStateAction[];
  className?: string;
  compact?: boolean;
  illustration?: boolean; // For more visual empty states
}

const iconMap = {
  file: FileX,
  search: Search,
  users: Users,
  shopping: ShoppingBag,
  notifications: Bell,
  calendar: Calendar,
  messages: MessageSquare,
  building: Building2,
  folder: Folder,
  settings: Settings,
};

export function EmptyState({
  icon = 'file',
  customIcon,
  title,
  description,
  actions = [],
  className,
  compact = false,
  illustration = false
}: EmptyStateProps) {
  const IconComponent = customIcon ? null : iconMap[icon as keyof typeof iconMap];

  return (
    <Card className={cn(
      "border-dashed bg-muted/20", 
      compact ? "p-6" : "p-12", 
      className
    )}>
      <CardContent className="flex flex-col items-center justify-center text-center space-y-4 p-0">
        {/* Icon or Illustration */}
        <div className={cn(
          "rounded-full bg-muted flex items-center justify-center",
          compact ? "h-12 w-12" : illustration ? "h-24 w-24" : "h-16 w-16"
        )}>
          {customIcon ? (
            <div className={cn(
              "text-muted-foreground",
              compact ? "h-6 w-6" : illustration ? "h-12 w-12" : "h-8 w-8"
            )}>
              {customIcon}
            </div>
          ) : IconComponent ? (
            <IconComponent className={cn(
              "text-muted-foreground",
              compact ? "h-6 w-6" : illustration ? "h-12 w-12" : "h-8 w-8"
            )} />
          ) : null}
        </div>

        {/* Content */}
        <div className="space-y-2 max-w-md">
          <h3 className={cn(
            "font-medium text-foreground",
            compact ? "text-lg" : "text-xl"
          )}>
            {title}
          </h3>
          {description && (
            <p className={cn(
              "text-muted-foreground leading-relaxed",
              compact ? "text-sm" : "text-base"
            )}>
              {description}
            </p>
          )}
        </div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className={cn(
            "flex gap-2 pt-2",
            actions.length > 2 ? "flex-col sm:flex-row" : "flex-row"
          )}>
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'default'}
                onClick={action.onClick}
                className={cn(
                  compact ? "px-4 py-2 text-sm" : "px-6 py-2"
                )}
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Specialized Empty State Components for common scenarios
export function NoSearchResults({ 
  query, 
  onClearSearch 
}: { 
  query: string; 
  onClearSearch?: () => void;
}) {
  return (
    <EmptyState
      icon="search"
      title="Keine Ergebnisse gefunden"
      description={`Für "${query}" wurden keine passenden Einträge gefunden. Versuchen Sie es mit anderen Suchbegriffen.`}
      actions={onClearSearch ? [{
        label: "Suche zurücksetzen",
        onClick: onClearSearch,
        variant: "outline"
      }] : []}
      compact
    />
  );
}

export function NoDataYet({ 
  title, 
  description, 
  actionLabel, 
  onAction 
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <EmptyState
      icon="folder"
      title={title}
      description={description}
      actions={actionLabel && onAction ? [{
        label: actionLabel,
        onClick: onAction,
        icon: <Plus className="h-4 w-4" />
      }] : []}
      illustration
    />
  );
}

export function NoPermissions({ 
  title = "Keine Berechtigung",
  description = "Sie haben keine Berechtigung, auf diesen Bereich zuzugreifen. Wenden Sie sich an die Verwaltung, wenn Sie glauben, dass dies ein Fehler ist."
}) {
  return (
    <EmptyState
      icon="settings"
      title={title}
      description={description}
      compact
      className="border-amber-200 bg-amber-50"
    />
  );
}

export function MaintenanceMode({
  title = "Wartungsmodus",
  description = "Dieser Bereich ist derzeit nicht verfügbar. Wir arbeiten an Verbesserungen und sind bald wieder da."
}) {
  return (
    <EmptyState
      icon="settings"
      title={title}
      description={description}
      className="border-blue-200 bg-blue-50"
      illustration
    />
  );
}

// Specific empty states for our app
export function NoAnnouncements({ onCreateNew }: { onCreateNew?: () => void }) {
  return (
    <EmptyState
      icon="notifications"
      title="Keine Aushänge vorhanden"
      description="Es sind derzeit keine Aushänge verfügbar. Neue Mitteilungen erscheinen hier, sobald sie veröffentlicht werden."
      actions={onCreateNew ? [{
        label: "Neuen Aushang erstellen",
        onClick: onCreateNew,
        icon: <Plus className="h-4 w-4" />
      }] : []}
      illustration
    />
  );
}

export function NoMarketplaceItems({ onAddItem }: { onAddItem?: () => void }) {
  return (
    <EmptyState
      icon="shopping"
      title="Keine Angebote im Marktplatz"
      description="Der Marktplatz ist noch leer. Seien Sie der Erste und teilen Sie ein Angebot mit Ihrer Nachbarschaft."
      actions={onAddItem ? [{
        label: "Erstes Angebot erstellen",
        onClick: onAddItem,
        icon: <Plus className="h-4 w-4" />
      }] : []}
      illustration
    />
  );
}

export function NoAppointments({ onScheduleNew }: { onScheduleNew?: () => void }) {
  return (
    <EmptyState
      icon="calendar"
      title="Keine Termine vorhanden"
      description="Es sind derzeit keine Termine geplant. Neue Termine werden hier angezeigt."
      actions={onScheduleNew ? [{
        label: "Neuen Termin planen",
        onClick: onScheduleNew,
        icon: <Plus className="h-4 w-4" />
      }] : []}
    />
  );
}

export function NoTickets({ onCreateNew }: { onCreateNew?: () => void }) {
  return (
    <EmptyState
      icon="messages"
      title="Keine Anfragen vorhanden"
      description="Sie haben noch keine Anfragen gestellt. Hier können Sie den Status Ihrer Anliegen verfolgen."
      actions={onCreateNew ? [{
        label: "Neue Anfrage stellen",
        onClick: onCreateNew,
        icon: <Plus className="h-4 w-4" />
      }] : []}
    />
  );
}
