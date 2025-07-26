import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { X, Plus, Save } from 'lucide-react';
import { Idea } from './IdeaCard';

interface IdeaEditorProps {
  idea: Idea | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (idea: Idea) => void;
}

export const IdeaEditor = ({ idea, isOpen, onClose, onSave }: IdeaEditorProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (idea) {
      setTitle(idea.title);
      setContent(idea.content);
      setTags(idea.tags);
    } else {
      setTitle('');
      setContent('');
      setTags([]);
    }
    setNewTag('');
  }, [idea, isOpen]);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    if (!title.trim()) return;
    
    const updatedIdea: Idea = {
      id: idea?.id || `idea-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      tags,
      depth: idea?.depth || 0,
      children: idea?.children || [],
      isExpanded: idea?.isExpanded || false,
    };

    onSave(updatedIdea);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-sm border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            {idea ? 'Edit Idea' : 'Create New Idea'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your idea title..."
              className="bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/30"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium">
              Content
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your idea in detail..."
              rows={8}
              className="bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/30 resize-none"
            />
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Tags</Label>
            
            {/* Add new tag */}
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add a tag..."
                className="flex-1 bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/30"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                size="sm"
                className="bg-primary/20 hover:bg-primary/30 border border-primary/50"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Display tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-accent/50 hover:bg-accent/70 text-accent-foreground group cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag}
                    <X className="h-3 w-3 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border/30">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-border/50 hover:bg-muted/50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title.trim()}
            className="bg-primary hover:bg-primary-deep text-primary-foreground shadow-lg hover:shadow-xl transition-all"
          >
            <Save className="h-4 w-4 mr-2" />
            {idea ? 'Update' : 'Create'} Idea
          </Button>
        </div>

        {/* Keyboard shortcut hint */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border/20">
          Press <kbd className="px-1 py-0.5 bg-muted/50 rounded text-xs">Ctrl + Enter</kbd> to save
        </div>
      </DialogContent>
    </Dialog>
  );
};