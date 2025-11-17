import { useHomeCards } from '@/hooks/useHomeCards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import CardEditor from './CardEditor';
import { HomepageCard } from '@/types/home';

const CardBuilder = () => {
  const { cards, loading } = useHomeCards();
  const [editingCard, setEditingCard] = useState<HomepageCard | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Homepage Cards</h3>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus size={16} />
          Add Card
        </Button>
      </div>

      {(isCreating || editingCard) && (
        <CardEditor
          card={editingCard}
          onClose={() => {
            setIsCreating(false);
            setEditingCard(null);
          }}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Card
            key={card.id}
            className={'glass-morphism cursor-pointer hover:border-purple-500 transition-all ' + 
              (card.is_published ? 'border-green-500/30' : 'border-yellow-500/30')}
            onClick={() => setEditingCard(card)}
          >
            <CardContent className="p-4">
              {card.image_url && (
                <img
                  src={card.image_url}
                  alt={card.title}
                  className="w-full h-32 object-cover rounded-md mb-3"
                />
              )}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-white">{card.title}</h4>
                  <span className={'px-2 py-1 rounded text-xs ' + 
                    (card.is_published ? 'bg-green-600/30 text-green-300' : 'bg-yellow-600/30 text-yellow-300')}>
                    {card.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-sm text-white/60 line-clamp-2">{card.description}</p>
                <span className="text-xs text-purple-400">{card.card_type}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {loading && <p className="text-center text-white/60">Loading cards...</p>}
      {!loading && cards.length === 0 && (
        <Card className="glass-morphism">
          <CardContent className="p-12 text-center">
            <p className="text-white/60 mb-4">No cards yet. Create your first card!</p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus size={16} className="mr-2" />
              Create First Card
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CardBuilder;
