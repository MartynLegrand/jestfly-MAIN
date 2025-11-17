import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Award,
  Clock,
  CheckCircle2,
  Gift,
  Coins,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { walletService, rewardsService } from '@/services/nft';
import { supabase } from '@/integrations/supabase/client';
import type { UserWallet, ProductTransaction, RewardsMission, UserReward } from '@/types/nftTypes';

const WalletPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [transactions, setTransactions] = useState<ProductTransaction[]>([]);
  const [missions, setMissions] = useState<RewardsMission[]>([]);
  const [userRewards, setUserRewards] = useState<UserReward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWalletData();
    }
  }, [user]);

  const loadWalletData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [walletData, transactionData, missionsData, rewardsData] = await Promise.all([
        walletService.getWallet(user.id),
        walletService.getTransactionHistory(user.id),
        loadMissions(),
        loadUserRewards(),
      ]);

      setWallet(walletData);
      setTransactions(transactionData);
      setMissions(missionsData);
      setUserRewards(rewardsData);
    } catch (error) {
      console.error('Error loading wallet data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load wallet data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMissions = async () => {
    return rewardsService.getActiveMissions();
  };

  const loadUserRewards = async () => {
    if (!user) return [];
    return rewardsService.getUserRewards(user.id);
  };

  const hasMissionCompleted = (missionId: string) => {
    return userRewards.some(reward => reward.mission_id === missionId);
  };

  const completeMission = async (missionId: string) => {
    if (!user) return;

    try {
      await rewardsService.completeMission(user.id, missionId);

      toast({
        title: 'Mission Completed!',
        description: `You earned ${rewardAmount} Jest Coins!`,
      });

      // Reload data
      await loadWalletData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to complete mission',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (transaction: ProductTransaction) => {
    if (transaction.amount_jestcoin > 0) {
      return <TrendingDown className="w-4 h-4 text-red-400" />;
    }
    return <TrendingUp className="w-4 h-4 text-green-400" />;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 flex items-center justify-center">
        <Card className="glass-morphism border-white/10 max-w-md">
          <CardContent className="p-8 text-center">
            <Wallet className="w-16 h-16 mx-auto mb-4 text-purple-400" />
            <h2 className="text-2xl font-bold mb-2">Login Required</h2>
            <p className="text-white/70 mb-4">
              Please login to access your wallet
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <Coins className="w-16 h-16 animate-spin mx-auto mb-4 text-purple-400" />
          <p className="text-white/70">Loading wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gradient">
            <Wallet className="inline-block w-12 h-12 mr-4" />
            My Wallet
          </h1>
          <p className="text-white/70 max-w-2xl">
            Manage your Jest Coins, view transaction history, and complete missions to earn rewards.
          </p>
        </div>

        {/* Wallet Balance Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-morphism border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-400" />
                Current Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-yellow-400">
                {wallet?.balance?.toLocaleString() || 0}
                <span className="text-lg ml-2">JC</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Total Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-400">
                {wallet?.total_earned?.toLocaleString() || 0}
                <span className="text-lg ml-2">JC</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-400" />
                Total Spent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-red-400">
                {wallet?.total_spent?.toLocaleString() || 0}
                <span className="text-lg ml-2">JC</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Transactions and Missions */}
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="transactions">Transaction History</TabsTrigger>
            <TabsTrigger value="missions">Missions & Rewards</TabsTrigger>
          </TabsList>

          {/* Transaction History Tab */}
          <TabsContent value="transactions">
            <Card className="glass-morphism border-white/10">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-12 text-white/50">
                    <Clock className="w-12 h-12 mx-auto mb-4" />
                    <p>No transactions yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          {getTransactionIcon(transaction)}
                          <div>
                            <p className="font-semibold">
                              {transaction.product?.name || 'Transaction'}
                            </p>
                            <p className="text-sm text-white/50">
                              {formatDate(transaction.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {transaction.amount_jestcoin > 0 && (
                            <p className="font-semibold text-red-400">
                              -{transaction.amount_jestcoin} JC
                            </p>
                          )}
                          {transaction.amount_money > 0 && (
                            <p className="text-sm text-white/70">
                              ${transaction.amount_money.toFixed(2)}
                            </p>
                          )}
                          <Badge
                            variant={
                              transaction.status === 'completed'
                                ? 'default'
                                : transaction.status === 'failed'
                                ? 'destructive'
                                : 'secondary'
                            }
                            className="mt-1"
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Missions Tab */}
          <TabsContent value="missions">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {missions.map((mission) => {
                const isCompleted = hasMissionCompleted(mission.id);
                return (
                  <Card
                    key={mission.id}
                    className={`glass-morphism border-white/10 ${
                      isCompleted ? 'opacity-60' : ''
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                          ) : (
                            <Award className="w-5 h-5 text-purple-400" />
                          )}
                          {mission.title}
                        </span>
                        {mission.is_daily && (
                          <Badge variant="secondary">Daily</Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-white/70 mb-4">
                        {mission.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Gift className="w-5 h-5 text-yellow-400" />
                          <span className="text-xl font-bold text-yellow-400">
                            {mission.reward_amount} JC
                          </span>
                        </div>
                        <Button
                          onClick={() =>
                            completeMission(mission.id)
                          }
                          disabled={isCompleted}
                          size="sm"
                        >
                          {isCompleted ? 'Completed' : 'Claim Reward'}
                        </Button>
                      </div>
                      {mission.max_completions && (
                        <p className="text-xs text-white/50 mt-2">
                          Max completions: {mission.max_completions}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WalletPage;
