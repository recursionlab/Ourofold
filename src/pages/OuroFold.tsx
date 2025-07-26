import { useState } from 'react';
import { OuroFoldHeader } from '@/components/OuroFoldHeader';
import { SpiralNavigation } from '@/components/SpiralNavigation';
import { IdeaEditor } from '@/components/IdeaEditor';
import { Idea } from '@/components/IdeaCard';
import { useToast } from '@/hooks/use-toast';

// Sample data for demonstration
const sampleIdeas: Idea[] = [
  {
    id: '1',
    title: 'The Nature of Recursive Thinking',
    content: 'How do ideas spawn other ideas? This fundamental question leads us down a spiral of meta-cognition...',
    tags: ['philosophy', 'cognition', 'meta'],
    depth: 0,
    isExpanded: true,
    children: [
      {
        id: '1-1',
        title: 'Self-Reference in Ideas',
        content: 'When an idea references itself, it creates an infinite loop of possibility.',
        tags: ['self-reference', 'infinity'],
        depth: 1,
        isExpanded: false,
        children: [
          {
            id: '1-1-1',
            title: 'Gödel\'s Incompleteness',
            content: 'Mathematical systems that reference themselves reveal fundamental limitations.',
            tags: ['mathematics', 'logic'],
            depth: 2,
            isExpanded: false,
            children: []
          }
        ]
      },
      {
        id: '1-2',
        title: 'Emergent Complexity',
        content: 'Simple rules can generate infinitely complex patterns when applied recursively.',
        tags: ['emergence', 'complexity'],
        depth: 1,
        isExpanded: false,
        children: []
      }
    ]
  },
  {
    id: '2',
    title: 'Digital Origami Patterns',
    content: 'Exploring how folding algorithms can inspire user interface design...',
    tags: ['design', 'origami', 'ui/ux'],
    depth: 0,
    isExpanded: false,
    children: []
  },
  {
    id: '3',
    title: 'Consciousness as Recursive Process',
    content: 'What if awareness is simply the brain observing itself observing itself?',
    tags: ['consciousness', 'neuroscience', 'philosophy'],
    depth: 0,
    isExpanded: false,
    children: []
  }
];

const OuroFold = () => {
  const [ideas, setIdeas] = useState<Idea[]>(sampleIdeas);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSpiralView, setIsSpiralView] = useState(true);
  const { toast } = useToast();

  const findIdeaById = (ideas: Idea[], id: string): Idea | null => {
    for (const idea of ideas) {
      if (idea.id === id) return idea;
      const found = findIdeaById(idea.children, id);
      if (found) return found;
    }
    return null;
  };

  const updateIdeaById = (ideas: Idea[], id: string, updater: (idea: Idea) => Idea): Idea[] => {
    return ideas.map(idea => {
      if (idea.id === id) {
        return updater(idea);
      }
      return {
        ...idea,
        children: updateIdeaById(idea.children, id, updater)
      };
    });
  };

  const addChildToIdea = (ideas: Idea[], parentId: string, newIdea: Idea): Idea[] => {
    return ideas.map(idea => {
      if (idea.id === parentId) {
        return {
          ...idea,
          children: [...idea.children, { ...newIdea, depth: idea.depth + 1 }],
          isExpanded: true
        };
      }
      return {
        ...idea,
        children: addChildToIdea(idea.children, parentId, newIdea)
      };
    });
  };

  const handleToggleExpand = (id: string) => {
    setIdeas(prevIdeas => 
      updateIdeaById(prevIdeas, id, idea => ({
        ...idea,
        isExpanded: !idea.isExpanded
      }))
    );
  };

  const handleAddChild = (parentId: string) => {
    setEditingIdea({
      id: '',
      title: '',
      content: '',
      tags: [],
      depth: 0,
      children: [],
      isExpanded: false
    });
    setIsEditorOpen(true);
    // Store parentId for when saving
    (setEditingIdea as any).parentId = parentId;
  };

  const handleCreateRootIdea = () => {
    setEditingIdea({
      id: '',
      title: '',
      content: '',
      tags: [],
      depth: 0,
      children: [],
      isExpanded: false
    });
    setIsEditorOpen(true);
  };

  const handleEditIdea = (idea: Idea) => {
    setEditingIdea(idea);
    setIsEditorOpen(true);
  };

  const handleReorderIdeas = (reorderedIdeas: Idea[]) => {
    setIdeas(reorderedIdeas);
    toast({
      title: "Ideas reordered",
      description: "Your idea structure has been updated",
    });
  };

  const handleSaveIdea = (savedIdea: Idea) => {
    const parentId = (setEditingIdea as any).parentId;
    
    if (!savedIdea.id) {
      // Creating new idea
      const newIdea = {
        ...savedIdea,
        id: `idea-${Date.now()}`
      };
      
      if (parentId) {
        // Adding as child
        setIdeas(prevIdeas => addChildToIdea(prevIdeas, parentId, newIdea));
        toast({
          title: "Child idea created",
          description: `"${newIdea.title}" added to the spiral`,
        });
      } else {
        // Adding as root
        setIdeas(prevIdeas => [...prevIdeas, newIdea]);
        toast({
          title: "New idea created",
          description: `"${newIdea.title}" added to the spiral`,
        });
      }
    } else {
      // Updating existing idea
      setIdeas(prevIdeas => 
        updateIdeaById(prevIdeas, savedIdea.id, () => savedIdea)
      );
      toast({
        title: "Idea updated",
        description: `"${savedIdea.title}" has been modified`,
      });
    }
    
    // Clear parentId
    delete (setEditingIdea as any).parentId;
  };

  return (
    <div className="min-h-screen bg-background">
      <OuroFoldHeader
        onCreateIdea={handleCreateRootIdea}
        onToggleView={() => setIsSpiralView(!isSpiralView)}
        isSpiraView={isSpiralView}
      />

      {/* Main content */}
      <main className="pt-20">
        {isSpiralView ? (
          <SpiralNavigation
            ideas={ideas}
            onToggleExpand={handleToggleExpand}
            onAddChild={handleAddChild}
            onEdit={handleEditIdea}
            onReorderIdeas={handleReorderIdeas}
          />
        ) : (
          <div className="container mx-auto px-6 py-8">
            <div className="text-center text-muted-foreground">
              List view coming soon...
            </div>
          </div>
        )}
      </main>

      {/* Idea Editor */}
      <IdeaEditor
        idea={editingIdea}
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingIdea(null);
          // Clear parentId
          delete (setEditingIdea as any).parentId;
        }}
        onSave={handleSaveIdea}
      />
    </div>
  );
};

export default OuroFold;