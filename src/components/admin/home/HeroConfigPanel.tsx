import { useHeroConfig } from '@/hooks/useHeroConfig';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Upload } from 'lucide-react';
import { useState } from 'react';

const HeroConfigPanel = () => {
  const { heroConfig, saving, updateHeroConfig, uploadHeroMedia } = useHeroConfig();
  const [uploading, setUploading] = useState(false);

  if (!heroConfig) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const url = await uploadHeroMedia(file);
    if (url) {
      await updateHeroConfig({ media_url: url });
    }
    setUploading(false);
  };

  return (
    <div className="space-y-6">
      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Media Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Media Type</Label>
            <Select
              value={heroConfig.media_type}
              onValueChange={(value) => updateHeroConfig({ media_type: value as 'video' | '3d' | 'image' })}
            >
              <SelectTrigger className="bg-black/20 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="3d">3D Model</SelectItem>
                <SelectItem value="image">Image</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(heroConfig.media_type === 'video' || heroConfig.media_type === 'image') && (
            <div>
              <Label>Upload Media</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept={heroConfig.media_type === 'video' ? 'video/*' : 'image/*'}
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="bg-black/20 border-white/10"
                />
                {uploading && <span className="text-sm text-white/60">Uploading...</span>}
              </div>
              {heroConfig.media_url && (
                <p className="text-sm text-white/50 mt-2">Current: {heroConfig.media_url}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={heroConfig.title}
              onChange={(e) => updateHeroConfig({ title: e.target.value })}
              className="bg-black/20 border-white/10"
            />
          </div>

          <div>
            <Label>Subtitle</Label>
            <Input
              value={heroConfig.subtitle || ''}
              onChange={(e) => updateHeroConfig({ subtitle: e.target.value })}
              className="bg-black/20 border-white/10"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={heroConfig.description || ''}
              onChange={(e) => updateHeroConfig({ description: e.target.value })}
              className="bg-black/20 border-white/10"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Call to Action</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Button Text</Label>
            <Input
              value={heroConfig.cta_text}
              onChange={(e) => updateHeroConfig({ cta_text: e.target.value })}
              className="bg-black/20 border-white/10"
            />
          </div>

          <div>
            <Label>Button Link</Label>
            <Input
              value={heroConfig.cta_link}
              onChange={(e) => updateHeroConfig({ cta_link: e.target.value })}
              className="bg-black/20 border-white/10"
              placeholder="/store"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Layout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Content Position</Label>
            <Select
              value={heroConfig.content_position}
              onValueChange={(value) => updateHeroConfig({ content_position: value as 'left' | 'center' | 'right' })}
            >
              <SelectTrigger className="bg-black/20 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Overlay Opacity: {heroConfig.overlay_opacity}</Label>
            <Slider
              value={[heroConfig.overlay_opacity]}
              onValueChange={([value]) => updateHeroConfig({ overlay_opacity: value })}
              min={0}
              max={1}
              step={0.1}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeroConfigPanel;
