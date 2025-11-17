import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const BookingsConfigTab = () => {
  const [config, setConfig] = useState({
    title: "Book JESTFLY",
    subtitle: "Ready to bring the future of sound to your event? Book JESTFLY for your next party, festival, or private event and experience a sonic journey like no other.",
    description: "Booking system configuration",
    enabled: true,
    showDJBooking: true,
    showStudioBooking: true,
    showConsultation: true,
    djBookingTitle: "DJ Booking",
    djBookingDescription: "Book JESTFLY for your event",
    studioBookingTitle: "Studio Sessions",
    studioBookingDescription: "Book studio time",
    consultationTitle: "Consultation",
    consultationDescription: "Schedule a consultation",
    emailNotifications: true,
    requirePhone: true,
    allowMultipleDates: false,
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
        .eq('section', 'bookings')
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
          section: 'bookings',
          config: JSON.stringify(config),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'section'
        });

      if (error) throw error;
      toast.success("Bookings configuration saved!");
    } catch (error: any) {
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Bookings Configuration</h2>
        <p className="text-white/60">Configure booking types, content, and settings</p>
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
            <Label>Subtitle / Hero Text</Label>
            <Textarea
              value={config.subtitle}
              onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
              className="bg-black/20 border-white/10"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Enable Bookings Page</Label>
            <Switch
              checked={config.enabled}
              onCheckedChange={(checked) => setConfig({ ...config, enabled: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Booking Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>DJ Booking</Label>
              <Switch
                checked={config.showDJBooking}
                onCheckedChange={(checked) => setConfig({ ...config, showDJBooking: checked })}
              />
            </div>
            {config.showDJBooking && (
              <div className="ml-6 space-y-2">
                <Input
                  placeholder="Title"
                  value={config.djBookingTitle}
                  onChange={(e) => setConfig({ ...config, djBookingTitle: e.target.value })}
                  className="bg-black/20 border-white/10"
                />
                <Textarea
                  placeholder="Description"
                  value={config.djBookingDescription}
                  onChange={(e) => setConfig({ ...config, djBookingDescription: e.target.value })}
                  className="bg-black/20 border-white/10"
                  rows={2}
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Studio Sessions</Label>
              <Switch
                checked={config.showStudioBooking}
                onCheckedChange={(checked) => setConfig({ ...config, showStudioBooking: checked })}
              />
            </div>
            {config.showStudioBooking && (
              <div className="ml-6 space-y-2">
                <Input
                  placeholder="Title"
                  value={config.studioBookingTitle}
                  onChange={(e) => setConfig({ ...config, studioBookingTitle: e.target.value })}
                  className="bg-black/20 border-white/10"
                />
                <Textarea
                  placeholder="Description"
                  value={config.studioBookingDescription}
                  onChange={(e) => setConfig({ ...config, studioBookingDescription: e.target.value })}
                  className="bg-black/20 border-white/10"
                  rows={2}
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Consultation</Label>
              <Switch
                checked={config.showConsultation}
                onCheckedChange={(checked) => setConfig({ ...config, showConsultation: checked })}
              />
            </div>
            {config.showConsultation && (
              <div className="ml-6 space-y-2">
                <Input
                  placeholder="Title"
                  value={config.consultationTitle}
                  onChange={(e) => setConfig({ ...config, consultationTitle: e.target.value })}
                  className="bg-black/20 border-white/10"
                />
                <Textarea
                  placeholder="Description"
                  value={config.consultationDescription}
                  onChange={(e) => setConfig({ ...config, consultationDescription: e.target.value })}
                  className="bg-black/20 border-white/10"
                  rows={2}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Form Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-white/50">Send confirmation emails</p>
            </div>
            <Switch
              checked={config.emailNotifications}
              onCheckedChange={(checked) => setConfig({ ...config, emailNotifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Require Phone Number</Label>
              <p className="text-sm text-white/50">Make phone field required</p>
            </div>
            <Switch
              checked={config.requirePhone}
              onCheckedChange={(checked) => setConfig({ ...config, requirePhone: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Allow Multiple Dates</Label>
              <p className="text-sm text-white/50">Enable multi-date selection</p>
            </div>
            <Switch
              checked={config.allowMultipleDates}
              onCheckedChange={(checked) => setConfig({ ...config, allowMultipleDates: checked })}
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

export default BookingsConfigTab;
