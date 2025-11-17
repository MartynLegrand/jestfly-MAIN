import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HeroConfigPanel from "@/components/admin/home/HeroConfigPanel";
import CardBuilder from "@/components/admin/home/CardBuilder";

const HomeConfigTabNew = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Home Page Configuration</h2>
        <p className="text-white/60">Customize your homepage content and appearance</p>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4 mt-6">
          <HeroConfigPanel />
        </TabsContent>

        <TabsContent value="cards" className="space-y-4 mt-6">
          <CardBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomeConfigTabNew;
