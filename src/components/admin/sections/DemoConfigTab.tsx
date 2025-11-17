import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const DemoConfigTab = () => {
  const [config, setConfig] = useState({
    title: "Submit Your Demo",
    subtitle: "Share your music with JESTFLY",
    description: "Demo submission settings",
    enabled: true,
    acceptedFormats: "MP3, WAV, FLAC",
    maxFileSize: 50,
    allowMultipleFiles: true,
    requireSocialMedia: false,
    autoReply: true,
    autoReplyMessage: "Thank you for your submission! We'll review your demo and get back to you soon.",
    submitButtonText: "Submit Demo",
    successMessage: "Your demo has been submitted successfully!",
    termsText: "By submitting, you agree to our terms and conditions.",
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
        .eq('section', 'demo')
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
          section: 'demo',
          config: JSON.stringify(config),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'section'
        });

      if (error) throw error;
      toast.success("Demo configuration saved!");
    } catch (error: any) {
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Demo Submission Configuration</h2>
        <p className="text-white/60">Configure demo submission form and requirements</p>
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
            <Label>Submit Button Text</Label>
            <Input
              value={config.submitButtonText}
              onChange={(e) => setConfig({ ...config, submitButtonText: e.target.value })}
              className="bg-black/20 border-white/10"
            />
          </div>

          <div>
            <Label>Success Message</Label>
            <Textarea
              value={config.successMessage}
              onChange={(e) => setConfig({ ...config, successMessage: e.target.value })}
              className="bg-black/20 border-white/10"
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Enable Demo Submissions</Label>
            <Switch
              checked={config.enabled}
              onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>File Upload Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Accepted Formats</Label>
            <Input
              value={config.acceptedFormats}
              onChange={(e) => setConfig({ ...config, acceptedFormats: e.target.value })}
              className="bg-black/20 border-white/10"
              placeholder="MP3, WAV, FLAC"
            />
          </div>

          <div>
            <Label>Max File Size (MB)</Label>
            <Input
              type="number"
              value={config.maxFileSize}
              onChange={(e) => setConfig({ ...config, maxFileSize: parseInt(e.target.value) })}
              className="bg-black/20 border-white/10"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Allow Multiple Files</Label>
              <p className="text-sm text-white/50">Let users upload multiple tracks</p>
            </div>
            <Switch
              checked={config.allowMultipleFiles}
              onCheckedChange={(checked) => setConfig({ ...config, allowMultipleFiles: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Form Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Require Social Media</Label>
              <p className="text-sm text-white/50">Make social media links required</p>
            </div>
            <Switch
              checked={config.requireSocialMedia}
              onCheckedChange={(checked) => setConfig({ ...config, requireSocialMedia: checked })}
            />
          </div>

          <div>
            <Label>Terms & Conditions Text</Label>
            <Textarea
              value={config.termsText}
              onChange={(e) => setConfig({ ...config, termsText: e.target.value })}
              className="bg-black/20 border-white/10"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Auto-Reply Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Auto-Reply</Label>
              <p className="text-sm text-white/50">Send automatic confirmation email</p>
            </div>
            <Switch
              checked={config.autoReply}
              onCheckedChange={(checked) => setConfig({ ...config, autoReply: checked })}
            />
          </div>

          {config.autoReply && (
            <div>
              <Label>Auto-Reply Message</Label>
              <Textarea
                value={config.autoReplyMessage}
                onChange={(e) => setConfig({ ...config, autoReplyMessage: e.target.value })}
                className="bg-black/20 border-white/10"
                rows={3}
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

export default DemoConfigTab;
