import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const HomeConfigTab = () => {
  const [config, setConfig] = useState({
    heroTitle: "MKSHA",
    heroSubtitle: "It was the year 2076. The substance had arrived.",
    heroDescription: "",
    showCrystal: true,
    crystalAnimation: true,
    showGallery: true,
    showFeatures: true,
    ctaText: "Get Started",
    ctaLink: "/store",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .eq('section', 'home')
        .single();

      if (data) {
        setConfig(JSON.parse(data.config));
      }
    } catch (error) {
      console.log("No saved config, using defaults");
    }
  };

  const saveConfig = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('site_config')
        .upsert({
          section: 'home',
          config: JSON.stringify(config),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'section'
        });

      if (error) throw error;

      toast.success("Home configuration saved!");
    } catch (error: any) {
      toast.error("Error saving configuration: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Home Page Configuration</h2>
        <p className="text-white/60">Customize your homepage content and appearance</p>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Main banner content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="heroTitle">Title</Label>
                <Input
                  id="heroTitle"
                  value={config.heroTitle}
                  onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
                  className="bg-black/20 border-white/10"
                />
              </div>

              <div>
                <Label htmlFor="heroSubtitle">Subtitle</Label>
                <Input
                  id="heroSubtitle"
                  value={config.heroSubtitle}
                  onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
                  className="bg-black/20 border-white/10"
                />
              </div>

              <div>
                <Label htmlFor="heroDescription">Description</Label>
                <Textarea
                  id="heroDescription"
                  value={config.heroDescription}
                  onChange={(e) => setConfig({ ...config, heroDescription: e.target.value })}
                  className="bg-black/20 border-white/10"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle>Call to Action</CardTitle>
              <CardDescription>Primary action button</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ctaText">Button Text</Label>
                <Input
                  id="ctaText"
                  value={config.ctaText}
                  onChange={(e) => setConfig({ ...config, ctaText: e.target.value })}
                  className="bg-black/20 border-white/10"
                />
              </div>

              <div>
                <Label htmlFor="ctaLink">Button Link</Label>
                <Input
                  id="ctaLink"
                  value={config.ctaLink}
                  onChange={(e) => setConfig({ ...config, ctaLink: e.target.value })}
                  className="bg-black/20 border-white/10"
                  placeholder="/store"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle>Features Toggle</CardTitle>
              <CardDescription>Enable or disable homepage sections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show 3D Crystal</Label>
                  <p className="text-sm text-white/50">Display animated crystal model</p>
                </div>
                <Switch
                  checked={config.showCrystal}
                  onCheckedChange={(checked) => setConfig({ ...config, showCrystal: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Crystal Animation</Label>
                  <p className="text-sm text-white/50">Enable crystal rotation</p>
                </div>
                <Switch
                  checked={config.crystalAnimation}
                  onCheckedChange={(checked) => setConfig({ ...config, crystalAnimation: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Gallery</Label>
                  <p className="text-sm text-white/50">Display image gallery section</p>
                </div>
                <Switch
                  checked={config.showGallery}
                  onCheckedChange={(checked) => setConfig({ ...config, showGallery: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Features</Label>
                  <p className="text-sm text-white/50">Display features section</p>
                </div>
                <Switch
                  checked={config.showFeatures}
                  onCheckedChange={(checked) => setConfig({ ...config, showFeatures: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="display" className="space-y-4">
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>Visual appearance options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/50">Additional display settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={loadConfig}>Reset</Button>
        <Button onClick={saveConfig} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default HomeConfigTab;
