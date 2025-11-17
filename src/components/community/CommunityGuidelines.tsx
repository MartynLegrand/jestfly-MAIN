import { Shield, Heart, MessageSquare, Flag, Users, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface GuidelineItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const guidelines: GuidelineItem[] = [
  {
    icon: <Heart className="h-6 w-6 text-pink-500" />,
    title: 'Be Respectful',
    description: 'Treat all community members with respect and kindness. No harassment, bullying, or hate speech.',
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-blue-500" />,
    title: 'Keep It Relevant',
    description: 'Share content related to music, DJ culture, and the JestFly community. Stay on topic.',
  },
  {
    icon: <Shield className="h-6 w-6 text-green-500" />,
    title: 'No Spam',
    description: 'Avoid posting repetitive content, excessive self-promotion, or misleading information.',
  },
  {
    icon: <Users className="h-6 w-6 text-purple-500" />,
    title: 'Protect Privacy',
    description: "Don't share personal information (yours or others) without consent. Respect everyone's privacy.",
  },
  {
    icon: <Flag className="h-6 w-6 text-orange-500" />,
    title: 'Report Issues',
    description: 'If you see content that violates our guidelines, report it. Help us keep the community safe.',
  },
  {
    icon: <CheckCircle className="h-6 w-6 text-cyan-500" />,
    title: 'Be Authentic',
    description: 'Be yourself and share genuine content. Authenticity builds trust and connection.',
  },
];

interface CommunityGuidelinesProps {
  onAccept?: () => void;
  showAcceptButton?: boolean;
}

export default function CommunityGuidelines({ onAccept, showAcceptButton = false }: CommunityGuidelinesProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Community Guidelines</h1>
        <p className="text-white/60 max-w-2xl mx-auto">
          Welcome to the JestFly community! These guidelines help us maintain a positive, safe, and
          vibrant space for all music lovers and creators.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {guidelines.map((guideline, index) => (
          <Card
            key={index}
            className="bg-gray-900/50 border-white/10 hover:border-purple-500/30 transition-all duration-300"
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-800/50 rounded-lg">{guideline.icon}</div>
                <CardTitle className="text-white text-lg">{guideline.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-white/70 text-sm">{guideline.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-6 w-6 text-purple-400" />
            Enforcement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-white/80 text-sm">
          <p>
            <strong>First violation:</strong> Warning and content removal
          </p>
          <p>
            <strong>Second violation:</strong> Temporary suspension (7 days)
          </p>
          <p>
            <strong>Third violation:</strong> Permanent account suspension
          </p>
          <p className="text-white/60 text-xs mt-4">
            Serious violations (harassment, hate speech, illegal content) may result in immediate
            permanent suspension without warning.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-white/70 text-sm">
          <p>
            <strong className="text-white">Age Requirement:</strong> You must be 13 years or older
            to use the JestFly community.
          </p>
          <p>
            <strong className="text-white">Content Rights:</strong> Only share content you have the
            right to share. Respect copyright and intellectual property.
          </p>
          <p>
            <strong className="text-white">Safety:</strong> Never share your password, financial
            information, or engage in suspicious activities.
          </p>
          <p>
            <strong className="text-white">Contact:</strong> For questions or concerns, contact us
            at support@jestfly.com
          </p>
        </CardContent>
      </Card>

      {showAcceptButton && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={onAccept}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
          >
            I Accept the Community Guidelines
          </Button>
        </div>
      )}
    </div>
  );
}
