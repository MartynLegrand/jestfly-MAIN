import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ResourcesConfigTab = () => {
  const [config, setConfig] = useState({
    title: "JESTFLY UI Resources",
    description: "Documentação e recursos de design para o sistema JESTFLY",
    subtitle: "Developer and Designer Resources",
    enabled: true,
    showUISchemaExporter: true,
    showDocumentation: true,
    showDesignAssets: true,
    showAPIReference: true,
    documentationUrl: "",
    designAssetsUrl: "",
    apiReferenceUrl: "",
    downloadable: true,
    requireAuth: false,
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
        .eq('section', 'resources')
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
          section: 'resources',
          config: JSON.stringify(config),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'section'
        });

      if (error) throw error;
      toast.success("Resources configuration saved!");
    } catch (error: any) {
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Resources Configuration</h2>
        <p className="text-white/60">Configure resource sections and content</p>
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
            <Label>Description</Label>
            <Textarea
              value={config.description}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              className="bg-black/20 border-white/10"
              rows={3}
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

          <div className="flex items-center justify-between">
            <Label>Enable Resources Page</Label>
            <Switch
              checked={config.enabled}
              onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Resource Sections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>UI Schema Exporter</Label>
              <p className="text-sm text-white/50">Show design system exporter</p>
            </div>
            <Switch
              checked={config.showUISchemaExporter}
              onCheckedChange={(checked) => setConfig({ ...config, showUISchemaExporter: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Documentation</Label>
              <p className="text-sm text-white/50">Show documentation section</p>
            </div>
            <Switch
              checked={config.showDocumentation}
              onCheckedChange={(checked) => setConfig({ ...config, showDocumentation: checked })}
            />
          </div>
          {config.showDocumentation && (
            <div className="ml-6">
              <Label>Documentation URL</Label>
              <Input
                placeholder="https://docs.example.com"
                value={config.documentationUrl}
                onChange={(e) => setConfig({ ...config, documentationUrl: e.target.value })}
                className="bg-black/20 border-white/10"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <Label>Design Assets</Label>
              <p className="text-sm text-white/50">Show design assets section</p>
            </div>
            <Switch
              checked={config.showDesignAssets}
              onCheckedChange={(checked) => setConfig({ ...config, showDesignAssets: checked })}
            />
          </div>
          {config.showDesignAssets && (
            <div className="ml-6">
              <Label>Design Assets URL</Label>
              <Input
                placeholder="https://assets.example.com"
                value={config.designAssetsUrl}
                onChange={(e) => setConfig({ ...config, designAssetsUrl: e.target.value })}
                className="bg-black/20 border-white/10"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <Label>API Reference</Label>
              <p className="text-sm text-white/50">Show API reference section</p>
            </div>
            <Switch
              checked={config.showAPIReference}
              onCheckedChange={(checked) => setConfig({ ...config, showAPIReference: checked })}
            />
          </div>
          {config.showAPIReference && (
            <div className="ml-6">
              <Label>API Reference URL</Label>
              <Input
                placeholder="https://api.example.com/docs"
                value={config.apiReferenceUrl}
                onChange={(e) => setConfig({ ...config, apiReferenceUrl: e.target.value })}
                className="bg-black/20 border-white/10"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Access Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Allow Downloads</Label>
              <p className="text-sm text-white/50">Enable resource downloads</p>
            </div>
            <Switch
              checked={config.downloadable}
              onCheckedChange={(checked) => setConfig({ ...config, downloadable: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Require Authentication</Label>
              <p className="text-sm text-white/50">Users must login to access</p>
            </div>
            <Switch
              checked={config.requireAuth}
              onCheckedChange={(checked) => setConfig({ ...config, requireAuth: checked })}
            />
          </div>
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

export default ResourcesConfigTab;
