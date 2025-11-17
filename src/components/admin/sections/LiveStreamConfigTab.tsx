import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const LiveStreamConfigTab = () => {
  const [config, setConfig] = useState({
    title: "Live Stream",
    subtitle: "Watch JESTFLY perform live",
    description: "Live streaming configuration",
    enabled: true,
    streamProvider: "youtube",
    youtubeChannelId: "",
    twitchChannel: "",
    customEmbedCode: "",
    showChat: true,
    showSchedule: true,
    scheduleText: "Check back for upcoming shows",
    notificationEnabled: true,
    notificationText: "Get notified when we go live!",
    archiveEnabled: true,
    archiveUrl: "",
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
        .eq('section', 'livestream')
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
          section: 'livestream',
          config: JSON.stringify(config),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'section'
        });

      if (error) throw error;
      toast.success("LiveStream configuration saved!");
    } catch (error: any) {
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Live Stream Configuration</h2>
        <p className="text-white/60">Configure live streaming platform and settings</p>
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

          <div className="flex items-center justify-between">
            <Label>Enable Live Stream Page</Label>
            <Switch
              checked={config.enabled}
              onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Stream Provider</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Platform</Label>
            <select
              value={config.streamProvider}
              onChange={(e) => setConfig({ ...config, streamProvider: e.target.value })}
              className="w-full bg-black/20 border-white/10 border rounded-md px-3 py-2 text-white"
            >
              <option value="youtube">YouTube</option>
              <option value="twitch">Twitch</option>
              <option value="custom">Custom Embed</option>
            </select>
          </div>

          {config.streamProvider === 'youtube' && (
            <div>
              <Label>YouTube Channel ID</Label>
              <Input
                value={config.youtubeChannelId}
                onChange={(e) => setConfig({ ...config, youtubeChannelId: e.target.value })}
                className="bg-black/20 border-white/10"
                placeholder="UCxxxxxxxxxxxxxx"
              />
            </div>
          )}

          {config.streamProvider === 'twitch' && (
            <div>
              <Label>Twitch Channel Name</Label>
              <Input
                value={config.twitchChannel}
                onChange={(e) => setConfig({ ...config, twitchChannel: e.target.value })}
                className="bg-black/20 border-white/10"
                placeholder="channelname"
              />
            </div>
          )}

          {config.streamProvider === 'custom' && (
            <div>
              <Label>Custom Embed Code</Label>
              <Textarea
                value={config.customEmbedCode}
                onChange={(e) => setConfig({ ...config, customEmbedCode: e.target.value })}
                className="bg-black/20 border-white/10"
                rows={4}
                placeholder="<iframe src='...'></iframe>"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Show Chat</Label>
              <p className="text-sm text-white/50">Display live chat alongside stream</p>
            </div>
            <Switch
              checked={config.showChat}
              onCheckedChange={(checked) => setConfig({ ...config, showChat: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Show Schedule</Label>
              <p className="text-sm text-white/50">Display upcoming stream schedule</p>
            </div>
            <Switch
              checked={config.showSchedule}
              onCheckedChange={(checked) => setConfig({ ...config, showSchedule: checked })}
            />
          </div>

          {config.showSchedule && (
            <div>
              <Label>Schedule Text</Label>
              <Textarea
                value={config.scheduleText}
                onChange={(e) => setConfig({ ...config, scheduleText: e.target.value })}
                className="bg-black/20 border-white/10"
                rows={2}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Notifications & Archive</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Notifications</Label>
              <p className="text-sm text-white/50">Allow users to get notified</p>
            </div>
            <Switch
              checked={config.notificationEnabled}
              onCheckedChange={(checked) => setConfig({ ...config, notificationEnabled: checked })}
            />
          </div>

          {config.notificationEnabled && (
            <div>
              <Label>Notification CTA Text</Label>
              <Input
                value={config.notificationText}
                onChange={(e) => setConfig({ ...config, notificationText: e.target.value })}
                className="bg-black/20 border-white/10"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Archive</Label>
              <p className="text-sm text-white/50">Show past stream recordings</p>
            </div>
            <Switch
              checked={config.archiveEnabled}
              onCheckedChange={(checked) => setConfig({ ...config, archiveEnabled: checked })}
            />
          </div>

          {config.archiveEnabled && (
            <div>
              <Label>Archive URL</Label>
              <Input
                value={config.archiveUrl}
                onChange={(e) => setConfig({ ...config, archiveUrl: e.target.value })}
                className="bg-black/20 border-white/10"
                placeholder="https://youtube.com/playlist?list=..."
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

export default LiveStreamConfigTab;
