'use client';

import { useState, useEffect, useCallback } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  User,
  MapPin,
  Calendar,
  ShoppingBag,
  Heart,
  Star,
  Settings,
  ChevronRight,
  Sparkles,
  Target,
  Zap
} from 'lucide-react';

// Customer journey stages
interface JourneyStage {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  progress: number;
  nextAction?: string;
  rewards?: string[];
}

interface PersonalizationProfile {
  userId: string;
  preferences: {
    styles: string[];
    categories: string[];
    budgetRange: { min: number; max: number };
    locations: string[];
    installationUrgency: 'low' | 'medium' | 'high';
    communicationPreference: 'email' | 'phone' | 'sms' | 'chat';
  };
  behavior: {
    viewHistory: string[];
    searchHistory: string[];
    cartAbandonments: number;
    averageSessionDuration: number;
    preferredContactTimes: string[];
    devicePreference: 'mobile' | 'desktop' | 'tablet';
  };
  demographics: {
    homeType: string;
    householdSize: number;
    renovationStage: 'planning' | 'budgeting' | 'ready' | 'in-progress';
    diyExperience: 'beginner' | 'intermediate' | 'advanced';
  };
  loyalty: {
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    points: number;
    totalSpent: number;
    visitCount: number;
    lastVisit: Date;
    referralsCount: number;
  };
}

interface CXStore {
  profile: PersonalizationProfile | null;
  journey: JourneyStage[];
  loading: boolean;
  updateProfile: (updates: Partial<PersonalizationProfile>) => void;
  trackEvent: (event: string, data: any) => void;
  updateJourneyProgress: (stageId: string, progress: number) => void;
  getNextJourneyAction: () => string | null;
  personalizedRecommendations: any[];
  updateRecommendations: (recommendations: any[]) => void;
}

const useCXStore = create<CXStore>()(
  persist(
    (set, get) => ({
      profile: null,
      journey: [],
      loading: false,
      personalizedRecommendations: [],

      updateProfile: (updates) => set((state) => ({
        profile: state.profile ? { ...state.profile, ...updates } : null
      })),

      trackEvent: (event, data) => {
        // Enhanced tracking logic
        const state = get();
        if (state.profile) {
          // Update behavior patterns
          const updatedProfile = {
            ...state.profile,
            behavior: {
              ...state.profile.behavior,
              // Track various events
            }
          };
          set({ profile: updatedProfile });
        }
      },

      updateJourneyProgress: (stageId, progress) => set((state) => ({
        journey: state.journey.map(stage =>
          stage.id === stageId
            ? { ...stage, progress, completed: progress >= 100 }
            : stage
        )
      })),

      getNextJourneyAction: () => {
        const { journey } = get();
        const nextStage = journey.find(stage => !stage.completed && stage.nextAction);
        return nextStage?.nextAction || null;
      },

      updateRecommendations: (recommendations) => set({ personalizedRecommendations: recommendations })
    }),
    {
      name: 'cx-store',
      partialize: (state) => ({
        profile: state.profile,
        journey: state.journey.slice(0, 10) // Limit stored journey
      })
    }
  )
);

// Journey stages definition
const DEFAULT_JOURNEY_STAGES: Omit<JourneyStage, 'completed' | 'progress'>[] = [
  {
    id: 'discovery',
    name: 'Discover Your Style',
    description: 'Explore our collection and find your perfect match',
    nextAction: 'Take our style quiz to get personalized recommendations',
    rewards: ['50 loyalty points', 'Free design consultation']
  },
  {
    id: 'planning',
    name: 'Plan Your Space',
    description: 'Measure your space and explore configuration options',
    nextAction: 'Schedule a free measurement service',
    rewards: ['100 loyalty points', '10% off first order']
  },
  {
    id: 'consultation',
    name: 'Expert Consultation',
    description: 'Meet with our design experts for personalized advice',
    nextAction: 'Book your free design consultation',
    rewards: ['Free samples', 'Professional 3D design']
  },
  {
    id: 'decision',
    name: 'Make Your Decision',
    description: 'Review your design and choose your perfect solution',
    nextAction: 'Review your personalized design proposal',
    rewards: ['Installation discount', 'Extended warranty']
  },
  {
    id: 'installation',
    name: 'Professional Installation',
    description: 'Sit back while our experts handle everything',
    nextAction: 'Schedule your installation date',
    rewards: ['200 loyalty points', 'Free follow-up service']
  },
  {
    id: 'enjoyment',
    name: 'Enjoy Your New Space',
    description: 'Experience your transformed space',
    nextAction: 'Share your experience and earn rewards',
    rewards: ['500 bonus points', 'Referral bonus']
  }
];

interface PersonalizationEngineProps {
  userId?: string;
  onPersonalizationUpdate?: (profile: PersonalizationProfile) => void;
}

export default function PersonalizationEngine({
  userId = 'anonymous',
  onPersonalizationUpdate
}: PersonalizationEngineProps) {
  const {
    profile,
    journey,
    loading,
    updateProfile,
    trackEvent,
    updateJourneyProgress,
    getNextJourneyAction,
    personalizedRecommendations,
    updateRecommendations
  } = useCXStore();

  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    initializePersonalization();
  }, [userId]);

  const initializePersonalization = async () => {
    setIsInitializing(true);

    try {
      // Initialize or load profile
      if (!profile) {
        const newProfile: PersonalizationProfile = {
          userId,
          preferences: {
            styles: [],
            categories: [],
            budgetRange: { min: 0, max: 10000 },
            locations: [],
            installationUrgency: 'medium',
            communicationPreference: 'email'
          },
          behavior: {
            viewHistory: [],
            searchHistory: [],
            cartAbandonments: 0,
            averageSessionDuration: 0,
            preferredContactTimes: [],
            devicePreference: 'desktop'
          },
          demographics: {
            homeType: '',
            householdSize: 1,
            renovationStage: 'planning',
            diyExperience: 'beginner'
          },
          loyalty: {
            tier: 'bronze',
            points: 0,
            totalSpent: 0,
            visitCount: 0,
            lastVisit: new Date(),
            referralsCount: 0
          }
        };

        updateProfile(newProfile);

        // Initialize journey
        const initializedJourney = DEFAULT_JOURNEY_STAGES.map(stage => ({
          ...stage,
          completed: false,
          progress: 0
        }));

        useCXStore.setState({ journey: initializedJourney });
      }

      // Track session start
      trackEvent('session_start', {
        userId,
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      });

    } catch (error) {
      console.error('Error initializing personalization:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const getLoyaltyColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'gold': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'silver': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-orange-600 bg-orange-50 border-orange-200';
    }
  };

  const getLoyaltyIcon = (tier: string) => {
    switch (tier) {
      case 'platinum': return Target;
      case 'gold': return Star;
      case 'silver': return Zap;
      default: return Sparkles;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  if (isInitializing) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
          <span>Personalizing your experience...</span>
        </div>
      </Card>
    );
  }

  const nextAction = getNextJourneyAction();

  return (
    <div className="space-y-6">
      {/* Customer Profile Summary */}
      {profile && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Welcome back!</h3>
                <p className="text-sm text-gray-600">Your personalized experience</p>
              </div>
            </div>

            {/* Loyalty Status */}
            <div className="flex items-center gap-2">
              <Badge className={`${getLoyaltyColor(profile.loyalty.tier)} border`}>
                {(() => {
                  const Icon = getLoyaltyIcon(profile.loyalty.tier);
                  return <Icon className="w-3 h-3 mr-1" />;
                })()}
                {profile.loyalty.tier.charAt(0).toUpperCase() + profile.loyalty.tier.slice(1)}
              </Badge>
              <div className="text-right">
                <p className="text-sm font-semibold">{profile.loyalty.points.toLocaleString()} pts</p>
                <p className="text-xs text-gray-600">
                  ${((profile.loyalty.totalSpent || 0) / 100).toFixed(0)} spent
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-lg font-semibold">{profile.behavior.viewHistory.length}</p>
              <p className="text-xs text-gray-600">Items Viewed</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Heart className="w-5 h-5 text-red-500 mx-auto mb-1" />
              <p className="text-lg font-semibold">{profile.loyalty.referralsCount}</p>
              <p className="text-xs text-gray-600">Referrals</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <p className="text-lg font-semibold">{profile.preferences.locations.length}</p>
              <p className="text-xs text-gray-600">Service Areas</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <p className="text-lg font-semibold">{profile.loyalty.visitCount}</p>
              <p className="text-xs text-gray-600">Visits</p>
            </div>
          </div>
        </Card>
      )}

      {/* Customer Journey Progress */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Your Journey to Perfect Storage
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Track your progress and unlock rewards along the way
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Customize
          </Button>
        </div>

        <div className="space-y-4">
          {journey.map((stage, index) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex items-start gap-4">
                {/* Stage Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  stage.completed
                    ? 'bg-green-500 text-white'
                    : stage.progress > 0
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stage.completed ? (
                    <span className="text-lg">✓</span>
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>

                {/* Stage Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{stage.name}</h4>
                    <span className="text-sm text-gray-600">{stage.progress}%</span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{stage.description}</p>

                  {/* Progress Bar */}
                  <Progress
                    value={stage.progress}
                    className="h-2 mb-3"
                    indicatorClassName={getProgressColor(stage.progress)}
                  />

                  {/* Rewards */}
                  {stage.rewards && stage.rewards.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {stage.rewards.map((reward, rewardIndex) => (
                        <Badge key={rewardIndex} variant="outline" className="text-xs">
                          <Sparkles className="w-3 h-3 mr-1 text-yellow-500" />
                          {reward}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Next Action */}
                  {stage.nextAction && !stage.completed && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      onClick={() => {
                        // Handle next action
                        trackEvent('journey_action_clicked', {
                          stageId: stage.id,
                          action: stage.nextAction
                        });
                      }}
                    >
                      {stage.nextAction}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Connection Line */}
              {index < journey.length - 1 && (
                <div className="absolute left-5 top-10 w-0.5 h-8 bg-gray-200 ml-4"></div>
              )}
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Next Best Action */}
      {nextAction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold mb-2">Your Next Step</h4>
              <p className="text-blue-100">{nextAction}</p>
            </div>
            <Button
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => {
                trackEvent('next_action_clicked', { action: nextAction });
              }}
            >
              Get Started
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}