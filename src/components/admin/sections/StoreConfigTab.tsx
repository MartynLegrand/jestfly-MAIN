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
import ProductManager from "@/components/admin/store/ProductManager";
import OrderManager from "@/components/admin/store/OrderManager";

const StoreConfigTab = () => {
  const [config, setConfig] = useState({
    title: "Store",
    description: "Browse our collection",
    showCategories: true,
    showFilters: true,
    itemsPerPage: 12,
    enableCart: true,
    enableWishlist: true,
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
        .eq('section', 'store')
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
          section: 'store',
          config: JSON.stringify(config),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'section'
        });

      if (error) throw error;
      toast.success("Store configuration saved!");
    } catch (error: any) {
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Store Management</h2>
        <p className="text-white/60">Manage products, orders, and store settings</p>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-6">
          <ProductManager />
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <OrderManager />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="space-y-6">
      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
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
            />
          </div>

          <div>
            <Label>Items Per Page</Label>
            <Input
              type="number"
              value={config.itemsPerPage}
              onChange={(e) => setConfig({ ...config, itemsPerPage: parseInt(e.target.value) })}
              className="bg-black/20 border-white/10"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Show Categories</Label>
            <Switch
              checked={config.showCategories}
              onCheckedChange={(checked) => setConfig({ ...config, showCategories: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Show Filters</Label>
            <Switch
              checked={config.showFilters}
              onCheckedChange={(checked) => setConfig({ ...config, showFilters: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Enable Shopping Cart</Label>
            <Switch
              checked={config.enableCart}
              onCheckedChange={(checked) => setConfig({ ...config, enableCart: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Enable Wishlist</Label>
            <Switch
              checked={config.enableWishlist}
              onCheckedChange={(checked) => setConfig({ ...config, enableWishlist: checked })}
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreConfigTab;
