import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { HexColorPicker } from 'react-colorful';
import {
  Sparkles,
  Upload,
  Share2,
  Save,
  Loader2,
  MonitorPlay,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNFTCardStudio } from '@/hooks/use-nft-card-studio';
import { NFTCard3D } from './NFTCard3D';
import {
  saveNFTCardTemplate,
  queueMarketplaceProduct,
  queueHeroAssignment,
  queueBannerGeneration,
} from '@/services/nft/nftStudioService';

interface Preset {
  id: string;
  title: string;
  collection: string;
  year: string;
  gradientFrom: string;
  gradientTo: string;
  imageUrl?: string;
}

const PRESETS: Preset[] = [
  {
    id: '1',
    title: 'CRYSTAL',
    collection: 'JESTFLY Premium',
    year: '2025',
    gradientFrom: '#ff3697',
    gradientTo: '#ff7b42',
    imageUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400',
  },
  {
    id: '2',
    title: 'DIAMOND',
    collection: 'Elite Series',
    year: '2025',
    gradientFrom: '#00d4ff',
    gradientTo: '#9333ea',
  },
  {
    id: '3',
    title: 'GOLD',
    collection: 'Legendary',
    year: '2025',
    gradientFrom: '#ffd700',
    gradientTo: '#ff8c00',
  },
  {
    id: '4',
    title: 'EMERALD',
    collection: 'Rare Gems',
    year: '2025',
    gradientFrom: '#10b981',
    gradientTo: '#059669',
  },
  {
    id: '5',
    title: 'RUBY',
    collection: 'Fire Collection',
    year: '2025',
    gradientFrom: '#dc2626',
    gradientTo: '#991b1b',
  },
  {
    id: '6',
    title: 'SAPPHIRE',
    collection: 'Ocean Deep',
    year: '2025',
    gradientFrom: '#3b82f6',
    gradientTo: '#1e40af',
  },
];

const TARGETS = [
  { id: 'marketplace', label: 'Marketplace', description: 'NFT Store' },
  { id: 'hero', label: 'Hero/Onboarding', description: 'Homepage Feature' },
  { id: 'banner', label: 'Marketing Banner', description: 'Promo Materials' },
  { id: 'stream', label: 'Stream Overlay', description: 'Live Stream' },
];

export function NFTCardStudio() {
  const { state, updateField } = useNFTCardStudio();
  const { toast } = useToast();
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [showGradientFrom, setShowGradientFrom] = useState(false);
  const [showGradientTo, setShowGradientTo] = useState(false);

  const handlePresetSelect = (preset: Preset) => {
    updateField('selectedPreset', preset.id);
    updateField('title', preset.title);
    updateField('collection', preset.collection);
    updateField('year', preset.year);
    updateField('gradientFrom', preset.gradientFrom);
    updateField('gradientTo', preset.gradientTo);
    if (preset.imageUrl) {
      updateField('imageUrl', preset.imageUrl);
    }
  };

  const toggleTarget = (targetId: string) => {
    const newTargets = state.targets.includes(targetId)
      ? state.targets.filter((t) => t !== targetId)
      : [...state.targets, targetId];
    updateField('targets', newTargets);
  };

  const handleAction = async (action: string) => {
    setPendingAction(action);

    try {
      let result;
      let message = '';

      switch (action) {
        case 'save':
          result = await saveNFTCardTemplate(state);
          message = 'Template saved successfully';
          break;

        case 'publish':
          if (state.targets.includes('marketplace')) {
            result = await queueMarketplaceProduct(state);
            message = 'Queued for marketplace';
          } else {
            result = await saveNFTCardTemplate(state);
            message = 'Template published';
          }
          break;

        case 'hero':
          result = await queueHeroAssignment(state);
          message = 'Queued for hero section';
          break;

        case 'banner':
          result = await queueBannerGeneration(state);
          message = 'Banner generation queued';
          break;

        case 'export':
          // Mock export - in real implementation, would generate image/data
          toast({
            title: 'Export Ready',
            description: 'Card exported successfully',
          });
          setPendingAction(null);
          return;

        case 'share':
          // Mock share - in real implementation, would create shareable link
          toast({
            title: 'Share Link Created',
            description: 'Link copied to clipboard',
          });
          setPendingAction(null);
          return;

        default:
          throw new Error('Unknown action');
      }

      if (result?.success) {
        const suffix = result.fallback === 'local' ? ' (modo offline)' : '';
        toast({
          title: 'Estúdio atualizado',
          description: message + suffix,
        });
      } else {
        throw new Error(result?.error || 'Unknown error');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Failed to complete action',
      });
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-6">
        {/* Preview Card */}
        <Card className="bg-gradient-to-br from-[#0b0d1f] via-[#111433] to-[#1a1f47] border-white/5">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#ff3697]" />
              Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={state.previewContext}
              onValueChange={(value) =>
                updateField('previewContext', value as any)
              }
            >
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
                <TabsTrigger value="hero">Hero</TabsTrigger>
                <TabsTrigger value="banner">Banner</TabsTrigger>
                <TabsTrigger value="stream">Stream</TabsTrigger>
              </TabsList>

              {/* Marketplace Preview */}
              <TabsContent value="marketplace" className="mt-0">
                <div className="bg-[#151835] border border-white/5 rounded-xl p-6 min-h-[500px]">
                  <NFTCard3D
                    title={state.title}
                    collection={state.collection}
                    year={state.year}
                    gradientFrom={state.gradientFrom}
                    gradientTo={state.gradientTo}
                    rotation={state.rotation}
                    imageUrl={state.imageUrl}
                    className="h-[450px]"
                  />
                </div>
              </TabsContent>

              {/* Hero Preview */}
              <TabsContent value="hero" className="mt-0">
                <div className="bg-gradient-to-br from-[#1a1f47] to-[#0b0d1f] rounded-xl p-8 min-h-[500px]">
                  <div className="grid grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                      <h2 className="text-4xl font-bold text-white">
                        {state.title}
                      </h2>
                      <p className="text-white/60">{state.description}</p>
                      <Button className="bg-[#ff3697] hover:bg-[#ff3697]/90">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Get Started
                      </Button>
                    </div>
                    <NFTCard3D
                      title={state.title}
                      collection={state.collection}
                      year={state.year}
                      gradientFrom={state.gradientFrom}
                      gradientTo={state.gradientTo}
                      rotation={state.rotation}
                      imageUrl={state.imageUrl}
                      className="h-[400px]"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Banner Preview */}
              <TabsContent value="banner" className="mt-0">
                <div className="bg-[#05070f] border border-white/5 rounded-xl p-6 min-h-[500px] relative overflow-hidden">
                  <div className="flex items-center justify-between h-full">
                    <div className="space-y-4 max-w-md z-10">
                      <h2 className="text-3xl font-bold text-white">
                        {state.title}
                      </h2>
                      <p className="text-white/60">{state.description}</p>
                      <Button className="bg-[#ff3697] hover:bg-[#ff3697]/90">
                        Learn More
                      </Button>
                    </div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2">
                      <NFTCard3D
                        title={state.title}
                        collection={state.collection}
                        year={state.year}
                        gradientFrom={state.gradientFrom}
                        gradientTo={state.gradientTo}
                        rotation={state.rotation}
                        imageUrl={state.imageUrl}
                        className="h-[400px] w-[300px]"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Stream Preview */}
              <TabsContent value="stream" className="mt-0">
                <div className="bg-[#020617] border border-white/10 rounded-xl p-6 min-h-[500px]">
                  <div className="flex items-start gap-4 h-full">
                    <div className="flex-1 bg-black/50 rounded-lg p-4 flex items-center justify-center text-white/40 min-h-[450px]">
                      [Stream Content]
                    </div>
                    <div className="w-48">
                      <NFTCard3D
                        title={state.title}
                        collection={state.collection}
                        year={state.year}
                        gradientFrom={state.gradientFrom}
                        gradientTo={state.gradientTo}
                        rotation={state.rotation}
                        imageUrl={state.imageUrl}
                        className="h-[200px]"
                      />
                      <Button className="w-full mt-4" size="sm">
                        <MonitorPlay className="w-4 h-4 mr-2" />
                        Go Live
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Controls Card */}
        <Card className="bg-[#0d1026]/90 border-white/5">
          <CardHeader>
            <CardTitle className="text-white">Customization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Presets */}
            <div className="space-y-3">
              <Label className="text-white">Presets</Label>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className={`
                      p-3 rounded-lg border-2 transition-all text-left
                      ${
                        state.selectedPreset === preset.id
                          ? 'border-[#ff3697] bg-[#ff3697]/10 shadow-lg'
                          : 'border-white/10 hover:border-white/30 bg-[#151836]/50'
                      }
                    `}
                  >
                    <div className="text-sm font-medium text-white">
                      {preset.title}
                    </div>
                    <div className="text-xs text-white/60">
                      {preset.collection}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Inputs */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-white">Title</Label>
                <Input
                  value={state.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="bg-[#151836] border-[#1f2347] text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Collection</Label>
                <Input
                  value={state.collection}
                  onChange={(e) => updateField('collection', e.target.value)}
                  className="bg-[#151836] border-[#1f2347] text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Year</Label>
                <Input
                  value={state.year}
                  onChange={(e) => updateField('year', e.target.value)}
                  className="bg-[#151836] border-[#1f2347] text-white"
                />
              </div>
            </div>

            {/* Color Pickers */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-white">Gradient From</Label>
                <div className="flex gap-2">
                  <Input
                    value={state.gradientFrom}
                    onChange={(e) => updateField('gradientFrom', e.target.value)}
                    className="bg-[#151836] border-[#1f2347] text-white flex-1"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowGradientFrom(!showGradientFrom)}
                    className="border-[#1f2347]"
                    style={{ backgroundColor: state.gradientFrom }}
                  />
                </div>
                {showGradientFrom && (
                  <HexColorPicker
                    color={state.gradientFrom}
                    onChange={(color) => updateField('gradientFrom', color)}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-white">Gradient To</Label>
                <div className="flex gap-2">
                  <Input
                    value={state.gradientTo}
                    onChange={(e) => updateField('gradientTo', e.target.value)}
                    className="bg-[#151836] border-[#1f2347] text-white flex-1"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowGradientTo(!showGradientTo)}
                    className="border-[#1f2347]"
                    style={{ backgroundColor: state.gradientTo }}
                  />
                </div>
                {showGradientTo && (
                  <HexColorPicker
                    color={state.gradientTo}
                    onChange={(color) => updateField('gradientTo', color)}
                  />
                )}
              </div>
            </div>

            {/* Rotation Slider */}
            <div className="space-y-2">
              <Label className="text-white">
                Rotation: {state.rotation}°
              </Label>
              <Slider
                value={[state.rotation]}
                onValueChange={([value]) => updateField('rotation', value)}
                min={-160}
                max={160}
                step={1}
                className="py-4"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-white">Description</Label>
              <Textarea
                value={state.description}
                onChange={(e) => updateField('description', e.target.value)}
                className="bg-[#151836] border-[#1f2347] text-white"
                rows={3}
              />
            </div>

            {/* Price & Supply */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-white">Price (JEST)</Label>
                <Input
                  type="number"
                  value={state.price}
                  onChange={(e) => updateField('price', e.target.value)}
                  className="bg-[#151836] border-[#1f2347] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Supply</Label>
                <Input
                  type="number"
                  value={state.supply}
                  onChange={(e) => updateField('supply', e.target.value)}
                  className="bg-[#151836] border-[#1f2347] text-white"
                />
              </div>
            </div>

            {/* Targets */}
            <div className="space-y-3">
              <Label className="text-white">Publish To</Label>
              <div className="space-y-2">
                {TARGETS.map((target) => (
                  <label
                    key={target.id}
                    className={`
                      flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-all
                      ${
                        state.targets.includes(target.id)
                          ? 'border-[#ff3697]/70 bg-[#ff3697]/10'
                          : 'border-white/10 hover:border-white/30'
                      }
                    `}
                  >
                    <Checkbox
                      checked={state.targets.includes(target.id)}
                      onCheckedChange={() => toggleTarget(target.id)}
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">
                        {target.label}
                      </div>
                      <div className="text-xs text-white/60">
                        {target.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-4 border-t border-white/10">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleAction('export')}
                  disabled={!!pendingAction}
                  className="border-white/20 text-white"
                >
                  {pendingAction === 'export' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  Export
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleAction('share')}
                  disabled={!!pendingAction}
                  className="border-white/20 text-white"
                >
                  {pendingAction === 'share' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Share2 className="w-4 h-4 mr-2" />
                  )}
                  Share
                </Button>
              </div>
              <Button
                onClick={() => handleAction('save')}
                disabled={!!pendingAction}
                className="w-full bg-white/10 hover:bg-white/20 text-white"
              >
                {pendingAction === 'save' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Draft
              </Button>
              <Button
                onClick={() => handleAction('publish')}
                disabled={!!pendingAction}
                className="w-full bg-[#ff3697] hover:bg-[#ff3697]/90 text-white"
              >
                {pendingAction === 'publish' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Publish
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default NFTCardStudio;
