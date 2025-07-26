import { useMemo } from 'react';
import { Idea, IdeaCard } from './IdeaCard';
import { cn } from '@/lib/utils';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';

interface SpiralNavigationProps {
  ideas: Idea[];
  onToggleExpand: (id: string) => void;
  onAddChild: (parentId: string) => void;
  onEdit: (idea: Idea) => void;
  onReorderIdeas: (reorderedIdeas: Idea[]) => void;
}

export const SpiralNavigation = ({ ideas, onToggleExpand, onAddChild, onEdit, onReorderIdeas }: SpiralNavigationProps) => {
  const flattenedIdeas = useMemo(() => {
    const flatten = (ideas: Idea[], depth = 0): Idea[] => {
      const result: Idea[] = [];
      
      ideas.forEach(idea => {
        result.push({ ...idea, depth });
        if (idea.isExpanded && idea.children.length > 0) {
          result.push(...flatten(idea.children, depth + 1));
        }
      });
      
      return result;
    };
    
    return flatten(ideas);
  }, [ideas]);

  const getSpiralPosition = (index: number, depth: number) => {
    const angle = (index * 15 + depth * 30) * (Math.PI / 180);
    const radius = 50 + depth * 80;
    const spiralRadius = Math.min(radius, 300);
    
    // Create a more organic spiral by varying the radius slightly
    const variation = Math.sin(index * 0.5) * 10;
    const finalRadius = spiralRadius + variation;
    
    return {
      transform: `translate(${Math.cos(angle) * finalRadius}px, ${Math.sin(angle) * finalRadius}px)`,
      zIndex: 100 - index,
      opacity: Math.max(0.3, 1 - (depth * 0.15)),
    };
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(flattenedIdeas);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Reconstruct the tree structure from flattened items
    // For now, we'll just reorder at the root level
    const rootIdeas = items.filter(idea => idea.depth === 0);
    onReorderIdeas(rootIdeas);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="relative min-h-screen p-8 overflow-hidden">
        {/* Background cosmic effect */}
        <div className="fixed inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent animate-pulse" />
          <div className="absolute inset-0 bg-gradient-conic from-primary/10 via-transparent to-primary/10 animate-spin-slow" />
        </div>

        {/* Central anchor point */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full animate-glow-pulse" />

        {/* Spiral container */}
        <Droppable droppableId="spiral-ideas">
          {(provided) => (
            <div 
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="relative flex justify-center items-center min-h-screen"
            >
              <div className="relative w-full max-w-6xl">
                {flattenedIdeas.map((idea, index) => {
                  const spiralStyle = getSpiralPosition(index, idea.depth);
                  
                  return (
                    <div
                      key={idea.id}
                      className={cn(
                        "absolute transition-all duration-500 ease-out",
                        "animate-spiral-in"
                      )}
                      style={{
                        ...spiralStyle,
                        animationDelay: `${index * 100}ms`,
                        left: '50%',
                        top: '50%',
                        transform: `translate(-50%, -50%) ${spiralStyle.transform}`,
                      }}
                    >
                      <div className="w-80 max-w-80">
                        <IdeaCard
                          idea={idea}
                          index={index}
                          onToggleExpand={onToggleExpand}
                          onAddChild={onAddChild}
                          onEdit={onEdit}
                          isDragDisabled={idea.depth > 0} // Only allow root ideas to be dragged in spiral view
                        />
                      </div>
                    </div>
                  );
                })}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>

        {/* Connection lines */}
        <svg className="absolute inset-0 pointer-events-none opacity-20">
          {flattenedIdeas.map((idea, index) => {
            if (index === 0) return null;
            
            const currentPos = getSpiralPosition(index, idea.depth);
            const prevPos = getSpiralPosition(index - 1, flattenedIdeas[index - 1].depth);
            
            // Extract transform values for line positioning
            const currentMatch = currentPos.transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
            const prevMatch = prevPos.transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
            
            if (!currentMatch || !prevMatch) return null;
            
            const x1 = parseFloat(prevMatch[1]) + window.innerWidth / 2;
            const y1 = parseFloat(prevMatch[2]) + window.innerHeight / 2;
            const x2 = parseFloat(currentMatch[1]) + window.innerWidth / 2;
            const y2 = parseFloat(currentMatch[2]) + window.innerHeight / 2;
            
            return (
              <line
                key={`line-${idea.id}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="hsl(var(--primary))"
                strokeWidth="1"
                strokeDasharray="2,4"
                className="animate-pulse"
              />
            );
          })}
        </svg>
      </div>
    </DragDropContext>
  );
};