import { useHomeCards } from '@/hooks/useHomeCards';
import { Skeleton } from '@/components/ui/skeleton';
import HomeCard from './HomeCard';

const CardGrid = () => {
  const { cards, loading } = useHomeCards();

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!cards.length) {
    return null;
  }

  return (
    <div className="container mx-auto px-6 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <HomeCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
};

export default CardGrid;
