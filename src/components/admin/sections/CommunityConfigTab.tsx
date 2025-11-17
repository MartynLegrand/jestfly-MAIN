import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Settings, Shield, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import CommunityModerationTab from "./CommunityModerationTab";
import CommunityAnalyticsTab from "./CommunityAnalyticsTab";

const CommunityConfigTab = () => {
  const [config, setConfig] = useState({
    title: "Community",
    description: "Community page settings",
    enabled: true,
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
        .eq('section', 'community')
        .single();

      if (data) {
        setConfig(JSON.parse(data.config));
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
          section: 'community',
          config: JSON.stringify(config),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'section'
        });

      if (error) throw error;
      toast.success("Community configuration saved!");
    } catch (error: any) {
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Community Management</h2>
        <p className="text-white/60">Manage community settings, moderation, and analytics</p>
      </div>

      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList className="bg-gray-800/50">
          <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="moderation" className="data-[state=active]:bg-purple-600">
            <Shield className="h-4 w-4 mr-2" />
            Moderation
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4">
          <Card className="glass-morphism bg-gray-900/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Page Title</Label>
                <Input
                  value={config.title}
                  onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  className="bg-black/20 border-white/10 text-white"
                />
              </div>

              <div>
                <Label className="text-white">Description</Label>
                <Textarea
                  value={config.description}
                  onChange={(e) => setConfig({ ...config, description: e.target.value })}
                  className="bg-black/20 border-white/10 text-white"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-white">Enable Community Section</Label>
                <Switch
                  checked={config.enabled}
                  onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={loadConfig} className="border-white/10 text-white">
              Reset
            </Button>
            <Button onClick={saveConfig} disabled={loading} className="bg-purple-600 hover:bg-purple-700">
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="moderation">
          <CommunityModerationTab />
        </TabsContent>

        <TabsContent value="analytics">
          <CommunityAnalyticsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityConfigTab;
