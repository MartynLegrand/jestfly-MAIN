import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductManager from "@/components/admin/store/ProductManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const StoreConfigTabNew = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Store Management</h2>
        <p className="text-white/60">Manage your products, categories, and store settings</p>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4 mt-6">
          <ProductManager />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4 mt-6">
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Organize your products into categories</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/60">Category management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-6">
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle>Store Settings</CardTitle>
              <CardDescription>Configure store behavior and features</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/60">Store settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreConfigTabNew;
