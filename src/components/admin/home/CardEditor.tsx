import { useState, useEffect } from 'react';
import { useHomeCards } from '@/hooks/useHomeCards';
import { HomepageCard, CardFormData } from '@/types/home';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { X, Save, Trash2 } from 'lucide-react';

interface CardEditorProps {
  card: HomepageCard | null;
  onClose: () => void;
}

const CardEditor = ({ card, onClose }: CardEditorProps) => {
  const { createCard, updateCard, deleteCard } = useHomeCards();
  const [formData, setFormData] = useState<CardFormData>({
    card_type: 'custom',
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    social_network: '',
    nft_id: '',
    is_published: false,
  });

  useEffect(() => {
    if (card) {
      setFormData({
        card_type: card.card_type,
        title: card.title,
        description: card.description || '',
        image_url: card.image_url || '',
        link_url: card.link_url || '',
        social_network: card.social_network || '',
        nft_id: card.nft_id || '',
        is_published: card.is_published,
      });
    }
  }, [card]);

  const handleSave = async () => {
    if (card) {
      await updateCard(card.id, formData);
    } else {
      await createCard(formData);
    }
    onClose();
  };

  const handleDelete = async () => {
    if (card && confirm('Are you sure you want to delete this card?')) {
      await deleteCard(card.id);
      onClose();
    }
  };

  return (
    <Card className="glass-morphism border-purple-500">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{card ? 'Edit Card' : 'Create New Card'}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={16} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Card Type</Label>
          <Select
            value={formData.card_type}
            onValueChange={(value) => setFormData({ ...formData, card_type: value as any })}
          >
            <SelectTrigger className="bg-black/20 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="custom">Custom</SelectItem>
              <SelectItem value="social">Social Media</SelectItem>
              <SelectItem value="nft">NFT</SelectItem>
              <SelectItem value="link">Link</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Title</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="bg-black/20 border-white/10"
            placeholder="Card title"
          />
        </div>

        <div>
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="bg-black/20 border-white/10"
            placeholder="Card description"
            rows={3}
          />
        </div>

        <div>
          <Label>Image URL</Label>
          <Input
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="bg-black/20 border-white/10"
            placeholder="/placeholder.svg"
          />
        </div>

        <div>
          <Label>Link URL</Label>
          <Input
            value={formData.link_url}
            onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
            className="bg-black/20 border-white/10"
            placeholder="/store or https://..."
          />
        </div>

        {formData.card_type === 'social' && (
          <div>
            <Label>Social Network</Label>
            <Select
              value={formData.social_network}
              onValueChange={(value) => setFormData({ ...formData, social_network: value })}
            >
              <SelectTrigger className="bg-black/20 border-white/10">
                <SelectValue placeholder="Select network" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <Switch
              checked={formData.is_published}
              onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
            />
            <Label>Published</Label>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave} className="flex-1 gap-2">
            <Save size={16} />
            {card ? 'Update' : 'Create'}
          </Button>
          {card && (
            <Button onClick={handleDelete} variant="destructive" className="gap-2">
              <Trash2 size={16} />
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CardEditor;
