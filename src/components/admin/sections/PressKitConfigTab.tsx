import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const PressKitConfigTab = () => {
  const [config, setConfig] = useState({
    title: "Press Kit",
    subtitle: "Media resources and brand assets for JESTFLY",
    description: "Press kit configuration",
    enabled: true,
    artistBio: "JESTFLY - Electronic music artist and producer",
    pressContact: "press@jestfly.com",
    bookingContact: "booking@jestfly.com",
    showPhotos: true,
    showLogos: true,
    showVideos: true,
    showPressReleases: true,
    showSocialLinks: true,
    allowDownloads: true,
    requireAttribution: true,
    attributionText: "Photo credit: JESTFLY",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const { data } = await supabase
        .from('site_config')
        .select('*')
        .eq('section', 'presskit')
        .single();

      if (data) {
        setConfig({ ...config, ...JSON.parse(data.config) });
      }
    } catch (error) {
      console.log("Using default config");
    }
  };

  const saveConfig = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('site_config')
        .upsert({
          section: 'presskit',
          config: JSON.stringify(config),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'section'
        });

      if (error) throw error;
      toast.success("PressKit configuration saved!");
    } catch (error: any) {
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Press Kit Configuration</h2>
        <p className="text-white/60">Configure press materials and media assets</p>
      </div>

      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Page Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Page Title</Label>
            <Input
              value={config.title}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
              className="bg-black/20 border-white/10"
            />
          </div>

          <div>
            <Label>Subtitle</Label>
            <Input
              value={config.subtitle}
              onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
              className="bg-black/20 border-white/10"
            />
          </div>

          <div>
            <Label>Artist Bio</Label>
            <Textarea
              value={config.artistBio}
              onChange={(e) => setConfig({ ...config, artistBio: e.target.value })}
              className="bg-black/20 border-white/10"
              rows={4}
              placeholder="Enter artist biography for press use"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Enable Press Kit Page</Label>
            <Switch
              checked={config.enabled}
              onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Press Contact Email</Label>
            <Input
              type="email"
              value={config.pressContact}
              onChange={(e) => setConfig({ ...config, pressContact: e.target.value })}
              className="bg-black/20 border-white/10"
              placeholder="press@jestfly.com"
            />
          </div>

          <div>
            <Label>Booking Contact Email</Label>
            <Input
              type="email"
              value={config.bookingContact}
              onChange={(e) => setConfig({ ...config, bookingContact: e.target.value })}
              className="bg-black/20 border-white/10"
              placeholder="booking@jestfly.com"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Media Sections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Show Photos</Label>
              <p className="text-sm text-white/50">Display press photos section</p>
            </div>
            <Switch
              checked={config.showPhotos}
              onCheckedChange={(checked) => setConfig({ ...config, showPhotos: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Show Logos</Label>
              <p className="text-sm text-white/50">Display brand logos section</p>
            </div>
            <Switch
              checked={config.showLogos}
              onCheckedChange={(checked) => setConfig({ ...config, showLogos: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Show Videos</Label>
              <p className="text-sm text-white/50">Display video content</p>
            </div>
            <Switch
              checked={config.showVideos}
              onCheckedChange={(checked) => setConfig({ ...config, showVideos: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Show Press Releases</Label>
              <p className="text-sm text-white/50">Display press releases section</p>
            </div>
            <Switch
              checked={config.showPressReleases}
              onCheckedChange={(checked) => setConfig({ ...config, showPressReleases: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Show Social Links</Label>
              <p className="text-sm text-white/50">Display social media links</p>
            </div>
            <Switch
              checked={config.showSocialLinks}
              onCheckedChange={(checked) => setConfig({ ...config, showSocialLinks: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Usage Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Allow Downloads</Label>
              <p className="text-sm text-white/50">Enable high-res asset downloads</p>
            </div>
            <Switch
              checked={config.allowDownloads}
              onCheckedChange={(checked) => setConfig({ ...config, allowDownloads: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Require Attribution</Label>
              <p className="text-sm text-white/50">Show attribution requirements</p>
            </div>
            <Switch
              checked={config.requireAttribution}
              onCheckedChange={(checked) => setConfig({ ...config, requireAttribution: checked })}
            />
          </div>

          {config.requireAttribution && (
            <div>
              <Label>Attribution Text</Label>
              <Input
                value={config.attributionText}
                onChange={(e) => setConfig({ ...config, attributionText: e.target.value })}
                className="bg-black/20 border-white/10"
                placeholder="Photo credit: JESTFLY"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={loadConfig}>Reset</Button>
        <Button onClick={saveConfig} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default PressKitConfigTab;
