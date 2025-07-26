import { Button } from '@/components/ui/button';
import { Plus, Search, Settings, Layers3 } from 'lucide-react';

interface OuroFoldHeaderProps {
  onCreateIdea: () => void;
  onToggleView: () => void;
  isSpiraView: boolean;
}

export const OuroFoldHeader = ({ onCreateIdea, onToggleView, isSpiraView }: OuroFoldHeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/30">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and title */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Layers3 className="h-8 w-8 text-primary animate-glow-pulse" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                OuroFold
              </h1>
              <p className="text-xs text-muted-foreground">Recursive Idea Notebook</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search through the spiral..."
                className="w-full pl-10 pr-4 py-2 bg-input/50 border border-border/50 rounded-lg focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleView}
              className="border-border/50 hover:bg-muted/50"
            >
              {isSpiraView ? 'List View' : 'Spiral View'}
            </Button>
            
            <Button
              onClick={onCreateIdea}
              className="bg-primary hover:bg-primary-deep text-primary-foreground shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Idea
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-muted/50"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};