import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, Plus, Edit3, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Idea {
  id: string;
  title: string;
  content: string;
  tags: string[];
  depth: number;
  children: Idea[];
  isExpanded?: boolean;
}

interface IdeaCardProps {
  idea: Idea;
  onToggleExpand: (id: string) => void;
  onAddChild: (parentId: string) => void;
  onEdit: (idea: Idea) => void;
  style?: React.CSSProperties;
}

export const IdeaCard = ({ idea, onToggleExpand, onAddChild, onEdit, style }: IdeaCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleExpand = () => {
    if (idea.children.length > 0) {
      onToggleExpand(idea.id);
    }
  };

  return (
    <div 
      style={style}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card 
        className={cn(
          "relative p-4 bg-card/90 backdrop-blur-sm border-border/50 transition-all duration-300",
          "hover:shadow-[0_8px_32px_hsl(var(--primary)_/_0.3)] hover:border-primary/50",
          "animate-fold-in",
          isHovered && "animate-glow-pulse"
        )}
        style={{
          transformStyle: 'preserve-3d',
          marginLeft: `${idea.depth * 20}px`,
        }}
      >
        {/* Depth indicator line */}
        {idea.depth > 0 && (
          <div 
            className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-primary-deep rounded-full opacity-60"
            style={{ left: `-${idea.depth * 10}px` }}
          />
        )}

        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            {/* Header with expand/collapse */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExpand}
                className={cn(
                  "h-6 w-6 p-0 hover:bg-primary/20",
                  idea.children.length === 0 && "invisible"
                )}
              >
                {idea.isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
              
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary opacity-60" />
                <h3 className="font-semibold text-foreground text-lg">
                  {idea.title}
                </h3>
              </div>
            </div>

            {/* Content */}
            {idea.content && (
              <p className="text-muted-foreground text-sm leading-relaxed pl-8">
                {idea.content}
              </p>
            )}

            {/* Tags */}
            {idea.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pl-8">
                {idea.tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs bg-accent/50 hover:bg-accent/70 transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className={cn(
            "flex gap-1 transition-opacity duration-200",
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(idea)}
              className="h-8 w-8 p-0 hover:bg-primary/20"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddChild(idea.id)}
              className="h-8 w-8 p-0 hover:bg-primary/20"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Children count indicator */}
        {idea.children.length > 0 && (
          <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full shadow-lg">
            {idea.children.length}
          </div>
        )}
      </Card>
    </div>
  );
};