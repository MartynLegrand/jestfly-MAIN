import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AirdropConfigTab = () => {
  const [config, setConfig] = useState({
    title: "Token Airdrop",
    subtitle: "Claim your JEST tokens",
    description: "Airdrop system settings",
    enabled: true,
    isActive: false,
    airdropName: "JEST Token Launch Airdrop",
    tokenSymbol: "JEST",
    tokenAmount: 100,
    totalSupply: 10000,
    claimStartDate: "",
    claimEndDate: "",
    eligibilityCriteria: "Early supporters and community members",
    requireWallet: true,
    requireKYC: false,
    autoDistribute: false,
    claimButtonText: "Claim Tokens",
    successMessage: "Tokens claimed successfully!",
    termsUrl: "/terms",
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
        .eq('section', 'airdrop')
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
          section: 'airdrop',
          config: JSON.stringify(config),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'section'
        });

      if (error) throw error;
      toast.success("Airdrop configuration saved!");
    } catch (error: any) {
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Airdrop Configuration</h2>
        <p className="text-white/60">Configure token airdrop campaign settings</p>
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
            <Label>Enable Airdrop Page</Label>
            <Switch
              checked={config.enabled}
              onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Airdrop Campaign</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Campaign Name</Label>
            <Input
              value={config.airdropName}
              onChange={(e) => setConfig({ ...config, airdropName: e.target.value })}
              className="bg-black/20 border-white/10"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Token Symbol</Label>
              <Input
                value={config.tokenSymbol}
                onChange={(e) => setConfig({ ...config, tokenSymbol: e.target.value })}
                className="bg-black/20 border-white/10"
                placeholder="JEST"
              />
            </div>
            <div>
              <Label>Tokens Per User</Label>
              <Input
                type="number"
                value={config.tokenAmount}
                onChange={(e) => setConfig({ ...config, tokenAmount: parseInt(e.target.value) })}
                className="bg-black/20 border-white/10"
              />
            </div>
          </div>

          <div>
            <Label>Total Supply (tokens)</Label>
            <Input
              type="number"
              value={config.totalSupply}
              onChange={(e) => setConfig({ ...config, totalSupply: parseInt(e.target.value) })}
              className="bg-black/20 border-white/10"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Campaign Active</Label>
              <p className="text-sm text-white/50">Enable airdrop claiming</p>
            </div>
            <Switch
              checked={config.isActive}
              onCheckedChange={(checked) => setConfig({ ...config, isActive: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Claim Start Date</Label>
            <Input
              type="datetime-local"
              value={config.claimStartDate}
              onChange={(e) => setConfig({ ...config, claimStartDate: e.target.value })}
              className="bg-black/20 border-white/10"
            />
          </div>

          <div>
            <Label>Claim End Date</Label>
            <Input
              type="datetime-local"
              value={config.claimEndDate}
              onChange={(e) => setConfig({ ...config, claimEndDate: e.target.value })}
              className="bg-black/20 border-white/10"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Eligibility & Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Eligibility Criteria</Label>
            <Textarea
              value={config.eligibilityCriteria}
              onChange={(e) => setConfig({ ...config, eligibilityCriteria: e.target.value })}
              className="bg-black/20 border-white/10"
              rows={3}
              placeholder="Who can claim tokens..."
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Require Wallet Connection</Label>
              <p className="text-sm text-white/50">Users must connect wallet</p>
            </div>
            <Switch
              checked={config.requireWallet}
              onCheckedChange={(checked) => setConfig({ ...config, requireWallet: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Require KYC</Label>
              <p className="text-sm text-white/50">Verify identity before claim</p>
            </div>
            <Switch
              checked={config.requireKYC}
              onCheckedChange={(checked) => setConfig({ ...config, requireKYC: checked })}
            />
          </div>

          <div>
            <Label>Terms & Conditions URL</Label>
            <Input
              value={config.termsUrl}
              onChange={(e) => setConfig({ ...config, termsUrl: e.target.value })}
              className="bg-black/20 border-white/10"
              placeholder="/terms"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Distribution Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-Distribute</Label>
              <p className="text-sm text-white/50">Automatically send tokens on claim</p>
            </div>
            <Switch
              checked={config.autoDistribute}
              onCheckedChange={(checked) => setConfig({ ...config, autoDistribute: checked })}
            />
          </div>

          <div>
            <Label>Claim Button Text</Label>
            <Input
              value={config.claimButtonText}
              onChange={(e) => setConfig({ ...config, claimButtonText: e.target.value })}
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

export default AirdropConfigTab;
