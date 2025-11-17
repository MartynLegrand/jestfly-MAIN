import { Sparkles } from 'lucide-react';
import { NFTCardStudio } from '@/components/nft/NFTCardStudio';

export function AdminNFTStudio() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <div className="container mx-auto py-10 space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-[#ff3697]" />
            <h1 className="text-4xl font-bold text-white">NFT Card Studio</h1>
          </div>
          <p className="text-white/60 text-lg">
            Create, customize and publish NFT cards for multiple destinations
          </p>
        </div>

        <NFTCardStudio />
      </div>
    </div>
  );
}

export default AdminNFTStudio;
