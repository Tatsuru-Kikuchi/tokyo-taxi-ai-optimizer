import React, { useState, useEffect } from 'react';
import './MobileAppStrategy.css';

const MobileAppStrategy = () => {
  const [activeApp, setActiveApp] = useState('driver-app');
  const [appMetrics, setAppMetrics] = useState({
    downloadProjections: 25000,
    userEngagement: 87,
    appStoreRating: 4.8,
    monthlyActiveUsers: 12500
  });

  const mobileApps = {
    'driver-app': {
      title: 'TaxiAI Driver Pro',
      icon: '📱',
      description: 'Professional driver application with AI-powered positioning and earnings optimization',
      targetUsers: 'Tokyo taxi drivers and fleet operators',
      features: [
        {
          category: 'AI Positioning Intelligence',
          features: [
            'Real-time weather-demand correlation alerts',
            '3-hour predictive positioning recommendations',
            'Competition density visualization',
            'Optimal waiting zone identification',
            'Traffic disruption opportunity alerts'
          ]
        },
        {
          category: 'Revenue Optimization',
          features: [
            'Daily earnings tracking and analysis',
            'Route efficiency scoring',
            'Peak hour demand predictions',
            'Surge pricing optimization alerts',
            'Weekly performance analytics'
          ]
        },
        {
          category: 'Professional Tools',
          features: [
            'Customer rating and feedback system',
            'Trip history and documentation',
            'Expense tracking and tax reporting',
            'Vehicle maintenance reminders',
            'Professional development insights'
          ]
        },
        {
          category: 'Safety & Compliance',
          features: [
            'Emergency assistance integration',
            'Route safety scoring',
            'Regulatory compliance monitoring',
            'Insurance claim assistance',
            'Health and safety alerts'
          ]
        }
      ],
      monetization: {
        model: 'Freemium with Premium Subscription',
        basicFeatures: 'Weather alerts, basic positioning, trip tracking',
        premiumFeatures: 'Advanced AI predictions, analytics, priority support',
        pricing: '¥2,000/month basic, ¥3,500/month premium',
        targetConversion: '35% to premium within 3 months'
      },
      technicalSpecs: {
        platforms: ['iOS 14+', 'Android 10+'],
        offlineCapability: 'Core features work offline',
        dataUsage: 'Optimized for minimal data consumption',
        batteryOptimization: 'Background processing optimized',
        languages: ['Japanese', 'English', 'Korean', 'Chinese']
      }
    },
    'passenger-app': {
      title: 'SmartRide Tokyo',
      icon: '🚖',
      description: 'Intelligent passenger application for optimal transportation decisions',
      targetUsers: 'Tokyo residents, tourists, and business travelers',
      features: [
        {
          category: 'Smart Transportation Assistant',
          features: [
            'Multi-modal transportation comparison',
            'Weather-aware travel recommendations',
            'Real-time taxi availability predictions',
            'Alternative transport suggestions',
            'Cost-benefit analysis for travel options'
          ]
        },
        {
          category: 'Convenience Features',
          features: [
            'One-tap taxi booking',
            'Estimated wait time predictions',
            'Fare estimation with weather adjustments',
            'Favorite locations and routes',
            'Trip sharing and splitting'
          ]
        },
        {
          category: 'Tourist & Business Tools',
          features: [
            'Multilingual support and translation',
            'Tourist destination recommendations',
            'Business travel expense tracking',
            'Cultural etiquette guidance',
            'Local events and weather integration'
          ]
        },
        {
          category: 'Social & Community',
          features: [
            'Community-driven traffic updates',
            'Local recommendations sharing',
            'Safety check-in features',
            'Environmental impact tracking',
            'Loyalty rewards program'
          ]
        }
      ],
      monetization: {
        model: 'Freemium with Premium Features',
        basicFeatures: 'Basic booking, wait times, fare estimates',
        premiumFeatures: 'Advanced predictions, priority booking, premium support',
        pricing: '¥500/month premium subscription',
        targetConversion: '25% to premium within 6 months'
      },
      technicalSpecs: {
        platforms: ['iOS 14+', 'Android 10+', 'Web Progressive App'],
        accessibility: 'Full accessibility compliance',
        dataSync: 'Cross-device synchronization',
        offlineMode: 'Limited offline functionality',
        languages: ['Japanese', 'English', 'Korean', 'Chinese', 'Spanish']
      }
    },
    'fleet-management': {
      title: 'FleetAI Command',
      icon: '🚛',
      description: 'Enterprise fleet management with AI-powered optimization',
      targetUsers: 'Taxi fleet operators and transportation companies',
      features: [
        {
          category: 'Fleet Intelligence Dashboard',
          features: [
            'Real-time fleet positioning and status',
            'Driver performance analytics',
            'Vehicle utilization optimization',
            'Maintenance scheduling automation',
            'Revenue optimization recommendations'
          ]
        },
        {
          category: 'Operational Management',
          features: [
            'Shift scheduling optimization',
            'Fuel consumption monitoring',
            'Route efficiency analysis',
            'Customer service quality tracking',
            'Regulatory compliance monitoring'
          ]
        },
        {
          category: 'Business Intelligence',
          features: [
            'Advanced reporting and analytics',
            'Market trend analysis',
            'Competitive benchmarking',
            'ROI tracking and optimization',
            'Strategic planning insights'
          ]
        },
        {
          category: 'Enterprise Integration',
          features: [
            'ERP system integration',
            'Third-party API connectivity',
            'Custom reporting tools',
            'Multi-location management',
            'Enterprise security compliance'
          ]
        }
      ],
      monetization: {
        model: 'Enterprise SaaS Licensing',
        pricingTiers: 'Tier 1: ¥50,000/month (50 vehicles), Tier 2: ¥150,000/month (200 vehicles)',
        customEnterprise: 'Custom pricing for 500+ vehicles',
        contractTerms: 'Annual contracts with volume discounts',
        targetMargin: '75% gross margin'
      },
      technicalSpecs: {
        platforms: ['Web Dashboard', 'iOS Management App', 'Android Management App'],
        security: 'Enterprise-grade security and encryption',
        scalability: 'Cloud-native architecture for unlimited scaling',
        integration: 'REST APIs and webhook support',
        compliance: 'SOC 2, GDPR, and local privacy regulations'
      }
    }
  };

  const appDevelopmentRoadmap = {
    'Q4-2025': {
      milestone: 'MVP Launch & Beta Testing',
      driverApp: [
        'Core AI positioning features',
        'Basic weather integration',
        'Trip tracking and earnings',
        'iOS and Android beta releases'
      ],
      passengerApp: [
        'Basic booking functionality',
        'Multi-modal comparison',
        'Wait time predictions',
        'Beta user testing program'
      ],
      fleetApp: [
        'Fleet dashboard MVP',
        'Basic analytics',
        'Driver management',
        'Pilot customer testing'
      ]
    },
    'Q1-2026': {
      milestone: 'Public Launch & User Acquisition',
      driverApp: [
        'Advanced AI predictions',
        'Premium subscription launch',
        'App store optimization',
        'Driver onboarding campaigns'
      ],
      passengerApp: [
        'Public app store launch',
        'Marketing campaign launch',
        'Tourist market targeting',
        'Premium features rollout'
      ],
      fleetApp: [
        'Enterprise sales launch',
        'Advanced analytics suite',
        'Integration partnerships',
        'Customer success program'
      ]
    },
    'Q2-Q3-2026': {
      milestone: 'Scale & Optimization',
      driverApp: [
        'International localization',
        'Advanced features rollout',
        'Partnership integrations',
        'Performance optimization'
      ],
      passengerApp: [
        'Social features launch',
        'Tourist guide integration',
        'Business traveler tools',
        'Loyalty program launch'
      ],
      fleetApp: [
        'Enterprise feature expansion',
        'Multi-city deployment',
        'Advanced AI integration',
        'Custom enterprise solutions'
      ]
    }
  };

  const marketingStrategy = {
    driverAcquisition: {
      channels: [
        'Direct outreach at taxi stands and driver rest areas',
        'Partnership with taxi driver associations',
        'Referral programs with existing drivers',
        'Digital marketing through driver-focused platforms',
        'Trade show participation and industry events'
      ],
      messaging: [
        'Increase earnings by 30% with AI positioning',
        'University research-proven revenue improvements',
        'Professional tools for modern taxi drivers',
        'Join the future of transportation technology'
      ],
      incentives: [
        'Free premium subscription for first 3 months',
        'Referral bonuses for bringing other drivers',
        'Performance bonuses for top users',
        'Exclusive early access to new features'
      ]
    },
    passengerAcquisition: {
      channels: [
        'App store optimization and featured placement',
        'Tourist information center partnerships',
        'Hotel and business district marketing',
        'Social media campaigns and influencer partnerships',
        'Transit station advertising and QR codes'
      ],
      messaging: [
        'Smart transportation decisions for Tokyo',
        'Save time and money with AI recommendations',
        'Perfect for tourists and business travelers',
        'Weather-smart travel planning'
      ],
      incentives: [
        'Free rides for new user signups',
        'Tourist discount packages',
        'Business traveler premium perks',
        'Loyalty points and rewards'
      ]
    },
    enterpriseAcquisition: {
      channels: [
        'Direct B2B sales and enterprise partnerships',
        'Industry conference presentations',
        'Taxi company association partnerships',
        'Government transportation authority outreach',
        'Academic research showcase and validation'
      ],
      messaging: [
        'Proven 25% fleet efficiency improvements',
        'University research-backed optimization',
        'Enterprise-grade security and compliance',
        'ROI-focused fleet management solution'
      ],
      incentives: [
        'Free pilot programs for fleet evaluation',
        'Custom enterprise pricing and terms',
        'Dedicated customer success management',
        'Priority feature development'
      ]
    }
  };

  const competitiveAnalysis = {
    driverApps: {
      competitors: ['GO Driver', 'JapanTaxi Driver', 'DiDi Driver'],
      advantages: [
        'Only app with weather-AI integration',
        'University research validation',
        'Superior prediction accuracy (94.7% vs 67%)',
        'Academic credibility and trust'
      ],
      pricing: 'Premium positioning justified by proven ROI'
    },
    passengerApps: {
      competitors: ['GO', 'Uber', 'JapanTaxi', 'DiDi'],
      advantages: [
        'Multi-modal transportation intelligence',
        'Weather-aware decision support',
        'Tourist and business traveler focus',
        'Local expertise and partnerships'
      ],
      pricing: 'Competitive with value-added intelligence'
    },
    fleetApps: {
      competitors: ['Traditional fleet management', 'Custom enterprise solutions'],
      advantages: [
        'AI-powered optimization capabilities',
        'Weather intelligence integration',
        'Academic research backing',
        'Modern cloud-native architecture'
      ],
      pricing: 'Premium enterprise pricing with ROI justification'
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAppMetrics(prev => ({
        ...prev,
        downloadProjections: prev.downloadProjections + Math.floor(Math.random() * 100),
        userEngagement: Math.min(prev.userEngagement + (Math.random() - 0.5) * 2, 95),
        appStoreRating: Math.min(prev.appStoreRating + (Math.random() - 0.5) * 0.1, 5.0),
        monthlyActiveUsers: prev.monthlyActiveUsers + Math.floor(Math.random() * 200)
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mobile-app-strategy">
      <div className="app-header">
        <h1>📱 Mobile App Strategy</h1>
        <div className="app-metrics">
          <div className="metric">
            <span className="value">{appMetrics.downloadProjections.toLocaleString()}</span>
            <span className="label">Download Projections</span>
          </div>
          <div className="metric">
            <span className="value">{appMetrics.userEngagement.toFixed(1)}%</span>
            <span className="label">User Engagement</span>
          </div>
          <div className="metric">
            <span className="value">{appMetrics.appStoreRating.toFixed(1)}</span>
            <span className="label">App Store Rating</span>
          </div>
          <div className="metric">
            <span className="value">{appMetrics.monthlyActiveUsers.toLocaleString()}</span>
            <span className="label">Monthly Active Users</span>
          </div>
        </div>
      </div>

      <div className="app-tabs">
        {Object.keys(mobileApps).map((app) => (
          <button
            key={app}
            className={`app-tab ${activeApp === app ? 'active' : ''}`}
            onClick={() => setActiveApp(app)}
          >
            {mobileApps[app].icon} {mobileApps[app].title}
          </button>
        ))}
      </div>

      <div className="app-content">
        <div className="app-overview">
          <h2>{mobileApps[activeApp].title}</h2>
          <p>{mobileApps[activeApp].description}</p>
          <div className="target-users">
            <strong>Target Users:</strong> {mobileApps[activeApp].targetUsers}
          </div>
        </div>

        <div className="app-features">
          <h3>Feature Categories</h3>
          <div className="features-grid">
            {mobileApps[activeApp].features.map((category, index) => (
              <div key={index} className="feature-category">
                <h4>{category.category}</h4>
                <ul>
                  {category.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="monetization-strategy">
          <h3>Monetization Strategy</h3>
          <div className="monetization-details">
            <div className="monetization-model">
              <strong>Business Model:</strong> {mobileApps[activeApp].monetization.model}
            </div>
            {mobileApps[activeApp].monetization.basicFeatures && (
              <div className="basic-features">
                <strong>Basic Features:</strong> {mobileApps[activeApp].monetization.basicFeatures}
              </div>
            )}
            {mobileApps[activeApp].monetization.premiumFeatures && (
              <div className="premium-features">
                <strong>Premium Features:</strong> {mobileApps[activeApp].monetization.premiumFeatures}
              </div>
            )}
            <div className="pricing">
              <strong>Pricing:</strong> {mobileApps[activeApp].monetization.pricing || mobileApps[activeApp].monetization.pricingTiers}
            </div>
            {mobileApps[activeApp].monetization.targetConversion && (
              <div className="conversion">
                <strong>Target Conversion:</strong> {mobileApps[activeApp].monetization.targetConversion}
              </div>
            )}
          </div>
        </div>

        <div className="technical-specifications">
          <h3>Technical Specifications</h3>
          <div className="tech-specs-grid">
            {Object.entries(mobileApps[activeApp].technicalSpecs).map(([key, value]) => (
              <div key={key} className="tech-spec">
                <strong>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:</strong>
                {Array.isArray(value) ? (
                  <ul>
                    {value.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <span>{value}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="development-roadmap">
        <h2>📅 Development Roadmap</h2>
        <div className="roadmap-timeline">
          {Object.entries(appDevelopmentRoadmap).map(([quarter, data]) => (
            <div key={quarter} className="roadmap-quarter">
              <h3>{quarter}</h3>
              <div className="milestone">{data.milestone}</div>
              <div className="roadmap-apps">
                <div className="roadmap-app">
                  <h4>Driver App</h4>
                  <ul>
                    {data.driverApp.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="roadmap-app">
                  <h4>Passenger App</h4>
                  <ul>
                    {data.passengerApp.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="roadmap-app">
                  <h4>Fleet App</h4>
                  <ul>
                    {data.fleetApp.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="marketing-strategy-section">
        <h2>📢 Marketing Strategy</h2>
        <div className="marketing-segments">
          <div className="marketing-segment">
            <h3>Driver Acquisition</h3>
            <div className="marketing-details">
              <div className="channels">
                <strong>Channels:</strong>
                <ul>
                  {marketingStrategy.driverAcquisition.channels.map((channel, i) => (
                    <li key={i}>{channel}</li>
                  ))}
                </ul>
              </div>
              <div className="messaging">
                <strong>Key Messages:</strong>
                <ul>
                  {marketingStrategy.driverAcquisition.messaging.map((message, i) => (
                    <li key={i}>{message}</li>
                  ))}
                </ul>
              </div>
              <div className="incentives">
                <strong>Incentives:</strong>
                <ul>
                  {marketingStrategy.driverAcquisition.incentives.map((incentive, i) => (
                    <li key={i}>{incentive}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="marketing-segment">
            <h3>Passenger Acquisition</h3>
            <div className="marketing-details">
              <div className="channels">
                <strong>Channels:</strong>
                <ul>
                  {marketingStrategy.passengerAcquisition.channels.map((channel, i) => (
                    <li key={i}>{channel}</li>
                  ))}
                </ul>
              </div>
              <div className="messaging">
                <strong>Key Messages:</strong>
                <ul>
                  {marketingStrategy.passengerAcquisition.messaging.map((message, i) => (
                    <li key={i}>{message}</li>
                  ))}
                </ul>
              </div>
              <div className="incentives">
                <strong>Incentives:</strong>
                <ul>
                  {marketingStrategy.passengerAcquisition.incentives.map((incentive, i) => (
                    <li key={i}>{incentive}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="marketing-segment">
            <h3>Enterprise Acquisition</h3>
            <div className="marketing-details">
              <div className="channels">
                <strong>Channels:</strong>
                <ul>
                  {marketingStrategy.enterpriseAcquisition.channels.map((channel, i) => (
                    <li key={i}>{channel}</li>
                  ))}
                </ul>
              </div>
              <div className="messaging">
                <strong>Key Messages:</strong>
                <ul>
                  {marketingStrategy.enterpriseAcquisition.messaging.map((message, i) => (
                    <li key={i}>{message}</li>
                  ))}
                </ul>
              </div>
              <div className="incentives">
                <strong>Incentives:</strong>
                <ul>
                  {marketingStrategy.enterpriseAcquisition.incentives.map((incentive, i) => (
                    <li key={i}>{incentive}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="competitive-analysis-section">
        <h2>⚔️ Competitive Analysis</h2>
        <div className="competitive-segments">
          <div className="competitive-segment">
            <h3>Driver App Competition</h3>
            <div className="competitors">
              <strong>Main Competitors:</strong> {competitiveAnalysis.driverApps.competitors.join(', ')}
            </div>
            <div className="advantages">
              <strong>Our Advantages:</strong>
              <ul>
                {competitiveAnalysis.driverApps.advantages.map((advantage, i) => (
                  <li key={i}>{advantage}</li>
                ))}
              </ul>
            </div>
            <div className="positioning">
              <strong>Positioning:</strong> {competitiveAnalysis.driverApps.pricing}
            </div>
          </div>

          <div className="competitive-segment">
            <h3>Passenger App Competition</h3>
            <div className="competitors">
              <strong>Main Competitors:</strong> {competitiveAnalysis.passengerApps.competitors.join(', ')}
            </div>
            <div className="advantages">
              <strong>Our Advantages:</strong>
              <ul>
                {competitiveAnalysis.passengerApps.advantages.map((advantage, i) => (
                  <li key={i}>{advantage}</li>
                ))}
              </ul>
            </div>
            <div className="positioning">
              <strong>Positioning:</strong> {competitiveAnalysis.passengerApps.pricing}
            </div>
          </div>

          <div className="competitive-segment">
            <h3>Fleet Management Competition</h3>
            <div className="competitors">
              <strong>Main Competitors:</strong> {competitiveAnalysis.fleetApps.competitors.join(', ')}
            </div>
            <div className="advantages">
              <strong>Our Advantages:</strong>
              <ul>
                {competitiveAnalysis.fleetApps.advantages.map((advantage, i) => (
                  <li key={i}>{advantage}</li>
                ))}
              </ul>
            </div>
            <div className="positioning">
              <strong>Positioning:</strong> {competitiveAnalysis.fleetApps.pricing}
            </div>
          </div>
        </div>
      </div>

      <div className="app-success-metrics">
        <h2>📊 Success Metrics & KPIs</h2>
        <div className="metrics-categories">
          <div className="metrics-category">
            <h3>User Acquisition</h3>
            <ul>
              <li>Monthly app downloads and installs</li>
              <li>User registration and onboarding completion</li>
              <li>Cost per acquisition by channel</li>
              <li>Organic vs paid user acquisition ratio</li>
            </ul>
          </div>
          <div className="metrics-category">
            <h3>User Engagement</h3>
            <ul>
              <li>Daily and monthly active users</li>
              <li>Session duration and frequency</li>
              <li>Feature adoption and usage patterns</li>
              <li>User retention rates (7-day, 30-day, 90-day)</li>
            </ul>
          </div>
          <div className="metrics-category">
            <h3>Revenue Metrics</h3>
            <ul>
              <li>Subscription conversion rates</li>
              <li>Average revenue per user (ARPU)</li>
              <li>Lifetime value (LTV) and churn rates</li>
              <li>Monthly recurring revenue (MRR) growth</li>
            </ul>
          </div>
          <div className="metrics-category">
            <h3>Performance Metrics</h3>
            <ul>
              <li>App store ratings and reviews</li>
              <li>App performance and crash rates</li>
              <li>Customer support ticket volume</li>
              <li>Net Promoter Score (NPS)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAppStrategy;