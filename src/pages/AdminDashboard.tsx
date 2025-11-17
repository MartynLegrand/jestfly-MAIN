import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  LayoutDashboard, 
  Home,
  Store,
  Users,
  Calendar,
  FileText,
  Music,
  FileImage,
  User,
  Video,
  Gift,
  Settings,
  Sparkles,
  Palette,
  Type,
  Image as ImageIcon,
  Box,
  Globe
} from "lucide-react";

// Import existing admin tabs
import NFTGeneratorTab from "@/components/admin/NFTGeneratorTab";
import ColorsTab from "@/components/admin/ColorsTab";
import FontsTab from "@/components/admin/FontsTab";
import ModelTab from "@/components/admin/ModelTab";
import MaterialTab from "@/components/admin/MaterialTab";
import LayoutTab from "@/components/admin/LayoutTab";
import ElementsTab from "@/components/admin/ElementsTab";
import SettingsTab from "@/components/admin/SettingsTab";

// Import section tabs (we'll create these)
import HomeConfigTab from "@/components/admin/sections/HomeConfigTab";
import StoreConfigTab from "@/components/admin/sections/StoreConfigTab";
import CommunityConfigTab from "@/components/admin/sections/CommunityConfigTab";
import BookingsConfigTab from "@/components/admin/sections/BookingsConfigTab";
import ResourcesConfigTab from "@/components/admin/sections/ResourcesConfigTab";
import NotesConfigTab from "@/components/admin/sections/NotesConfigTab";
import DemoConfigTab from "@/components/admin/sections/DemoConfigTab";
import PressKitConfigTab from "@/components/admin/sections/PressKitConfigTab";
import ProfileConfigTab from "@/components/admin/sections/ProfileConfigTab";
import LiveStreamConfigTab from "@/components/admin/sections/LiveStreamConfigTab";
import AirdropConfigTab from "@/components/admin/sections/AirdropConfigTab";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const dashboardSections = [
    { id: "home", label: "Home", icon: Home, description: "Configure homepage" },
    { id: "store", label: "Store", icon: Store, description: "Manage store settings" },
    { id: "nft", label: "NFT Store", icon: Sparkles, description: "NFT marketplace" },
    { id: "community", label: "Community", icon: Users, description: "Community settings" },
    { id: "bookings", label: "Bookings", icon: Calendar, description: "Booking system" },
    { id: "resources", label: "Resources", icon: FileText, description: "Resources page" },
    { id: "notes", label: "Notes", icon: FileText, description: "Notes system" },
    { id: "demo", label: "Demo Submission", icon: Music, description: "Demo submissions" },
    { id: "presskit", label: "Press Kit", icon: FileImage, description: "Press materials" },
    { id: "profile", label: "Profile", icon: User, description: "User profiles" },
    { id: "livestream", label: "Live Stream", icon: Video, description: "Streaming config" },
    { id: "airdrop", label: "Airdrop", icon: Gift, description: "Airdrop system" },
  ];

  const designSections = [
    { id: "colors", label: "Colors", icon: Palette, description: "Color scheme" },
    { id: "fonts", label: "Fonts", icon: Type, description: "Typography" },
    { id: "layout", label: "Layout", icon: LayoutDashboard, description: "Page layouts" },
    { id: "elements", label: "Elements", icon: Box, description: "UI elements" },
    { id: "models", label: "3D Models", icon: Box, description: "3D assets" },
    { id: "material", label: "Materials", icon: Sparkles, description: "3D materials" },
  ];

  const creativeTools = [
    { id: "studio", label: "Creative Studio", icon: Sparkles, description: "NFT Card Studio", route: "/admin/studio" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">Admin Dashboard</h1>
          <p className="text-white/60">Configure all aspects of your platform</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Navigation Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
            {/* Sidebar */}
            <div className="space-y-4">
              <Card className="neo-blur border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Pages</CardTitle>
                  <CardDescription>Configure each section</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1 p-2">
                  <TabsList className="flex flex-col h-auto bg-transparent space-y-1">
                    <TabsTrigger
                      value="dashboard"
                      className="w-full justify-start gap-2 data-[state=active]:bg-purple-600"
                    >
                      <LayoutDashboard size={16} />
                      Overview
                    </TabsTrigger>
                    <Separator className="my-2" />
                    {dashboardSections.map((section) => (
                      <TabsTrigger
                        key={section.id}
                        value={section.id}
                        className="w-full justify-start gap-2 data-[state=active]:bg-purple-600"
                      >
                        <section.icon size={16} />
                        {section.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </CardContent>
              </Card>

              <Card className="neo-blur border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Design</CardTitle>
                  <CardDescription>Visual customization</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1 p-2">
                  <TabsList className="flex flex-col h-auto bg-transparent space-y-1">
                    {designSections.map((section) => (
                      <TabsTrigger
                        key={section.id}
                        value={section.id}
                        className="w-full justify-start gap-2 data-[state=active]:bg-purple-600"
                      >
                        <section.icon size={16} />
                        {section.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </CardContent>
              </Card>

              <Card className="neo-blur border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg text-white">System</CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <TabsList className="flex flex-col h-auto bg-transparent">
                    <TabsTrigger
                      value="settings"
                      className="w-full justify-start gap-2 data-[state=active]:bg-purple-600"
                    >
                      <Settings size={16} />
                      Settings
                    </TabsTrigger>
                  </TabsList>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <Card className="neo-blur border-white/10 min-h-[600px]">
                <CardContent className="p-6">
                  {/* Dashboard Overview */}
                  <TabsContent value="dashboard" className="mt-0">
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Platform Overview</h2>
                        <p className="text-white/60">Quick access to all configuration sections</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dashboardSections.map((section) => (
                          <Card
                            key={section.id}
                            className="glass-morphism bg-purple-900/20 hover:bg-purple-900/30 transition-all cursor-pointer"
                            onClick={() => setActiveTab(section.id)}
                          >
                            <CardContent className="p-4">
                              <section.icon className="mb-3 text-purple-400 glow-purple" size={24} />
                              <h3 className="text-lg font-medium mb-1 text-white">{section.label}</h3>
                              <p className="text-sm text-gray-400">{section.description}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      <Separator className="my-6" />

                      <div>
                        <h3 className="text-xl font-semibold text-white mb-4">Design & Appearance</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {designSections.map((section) => (
                            <Card
                              key={section.id}
                              className="glass-morphism bg-blue-900/20 hover:bg-blue-900/30 transition-all cursor-pointer"
                              onClick={() => setActiveTab(section.id)}
                            >
                              <CardContent className="p-4">
                                <section.icon className="mb-3 text-blue-400" size={24} />
                                <h3 className="text-lg font-medium mb-1 text-white">{section.label}</h3>
                                <p className="text-sm text-gray-400">{section.description}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      <Separator className="my-6" />

                      <div>
                        <h3 className="text-xl font-semibold text-white mb-4">Creative Tools</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {creativeTools.map((tool) => (
                            <Card
                              key={tool.id}
                              className="glass-morphism bg-pink-900/20 hover:bg-pink-900/30 transition-all cursor-pointer"
                              onClick={() => navigate(tool.route)}
                            >
                              <CardContent className="p-4">
                                <tool.icon className="mb-3 text-pink-400" size={24} />
                                <h3 className="text-lg font-medium mb-1 text-white">{tool.label}</h3>
                                <p className="text-sm text-gray-400">{tool.description}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Page Configuration Tabs */}
                  <TabsContent value="home" className="mt-0">
                    <HomeConfigTab />
                  </TabsContent>

                  <TabsContent value="store" className="mt-0">
                    <StoreConfigTab />
                  </TabsContent>

                  <TabsContent value="nft" className="mt-0">
                    <NFTGeneratorTab />
                  </TabsContent>

                  <TabsContent value="community" className="mt-0">
                    <CommunityConfigTab />
                  </TabsContent>

                  <TabsContent value="bookings" className="mt-0">
                    <BookingsConfigTab />
                  </TabsContent>

                  <TabsContent value="resources" className="mt-0">
                    <ResourcesConfigTab />
                  </TabsContent>

                  <TabsContent value="notes" className="mt-0">
                    <NotesConfigTab />
                  </TabsContent>

                  <TabsContent value="demo" className="mt-0">
                    <DemoConfigTab />
                  </TabsContent>

                  <TabsContent value="presskit" className="mt-0">
                    <PressKitConfigTab />
                  </TabsContent>

                  <TabsContent value="profile" className="mt-0">
                    <ProfileConfigTab />
                  </TabsContent>

                  <TabsContent value="livestream" className="mt-0">
                    <LiveStreamConfigTab />
                  </TabsContent>

                  <TabsContent value="airdrop" className="mt-0">
                    <AirdropConfigTab />
                  </TabsContent>

                  {/* Design Tabs */}
                  <TabsContent value="colors" className="mt-0">
                    <ColorsTab />
                  </TabsContent>

                  <TabsContent value="fonts" className="mt-0">
                    <FontsTab />
                  </TabsContent>

                  <TabsContent value="layout" className="mt-0">
                    <LayoutTab />
                  </TabsContent>

                  <TabsContent value="elements" className="mt-0">
                    <ElementsTab />
                  </TabsContent>

                  <TabsContent value="models" className="mt-0">
                    <ModelTab />
                  </TabsContent>

                  <TabsContent value="material" className="mt-0">
                    <MaterialTab />
                  </TabsContent>

                  <TabsContent value="settings" className="mt-0">
                    <SettingsTab />
                  </TabsContent>
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
