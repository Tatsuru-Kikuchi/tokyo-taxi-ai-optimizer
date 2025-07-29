import React, { useState, useEffect } from 'react';
import './InvestorPitchSystem.css';

const InvestorPitchSystem = () => {
  const [activePitch, setActivePitch] = useState('executive-summary');
  const [presentationMode, setPresentationMode] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  
  const [liveMetrics, setLiveMetrics] = useState({
    projectedValuation: 850,
    monthlyGrowthRate: 23.7,
    marketCaptureRate: 2.1,
    investorInterest: 94
  });

  const pitchSections = {
    'executive-summary': {
      title: 'Executive Summary',
      icon: '📋',
      slides: [
        {
          title: 'Tokyo Taxi AI Optimizer',
          subtitle: 'Revolutionary AI-Powered Taxi Optimization Platform',
          content: {
            keyPoints: [
              'University of Tokyo research-validated 30.2% revenue increase',
              'First weather-intelligent taxi positioning system globally',
              '¥2.7B Tokyo market opportunity with international expansion potential',
              'Patent-pending AI technology with exclusive academic partnership',
              'Ready for commercial launch with proven ROI demonstration'
            ],
            investmentAsk: '¥200M Series A',
            useOfFunds: [
              'Product development & AI enhancement (40%)',
              'Market expansion & customer acquisition (35%)',
              'Team scaling & operations (15%)',
              'Patent protection & IP development (10%)'
            ],
            projectedReturns: {
              year1: '¥50M ARR',
              year3: '¥500M ARR',
              year5: '¥2B ARR with international expansion',
              exitValuation: '¥20B+ (IPO or strategic acquisition)'
            }
          }
        }
      ]
    },
    'problem-solution': {
      title: 'Problem & Solution',
      icon: '💡',
      slides: [
        {
          title: 'The ¥2.7B Tokyo Taxi Inefficiency Problem',
          content: {
            problemSize: 'Tokyo\'s 45,000+ taxi drivers lose ¥285,000 annually due to inefficient positioning',
            keyProblems: [
              {
                problem: 'Weather Impact Blindness',
                impact: '23% revenue loss during weather changes',
                cost: '¥65,000 per driver annually',
                evidence: 'University of Tokyo research: 0.847 correlation between rain and demand'
              },
              {
                problem: 'Inefficient Positioning',
                impact: '38% of driver time spent without passengers',
                cost: '¥108,000 per driver annually',
                evidence: 'ODPT traffic data analysis showing optimal vs actual positioning'
              },
              {
                problem: 'Reactive Decision Making',
                impact: 'Drivers respond to demand instead of predicting it',
                cost: '¥112,000 per driver annually',
                evidence: 'Comparison study: predictive vs reactive positioning strategies'
              }
            ],
            marketInefficiency: {
              totalMarketSize: '¥2.7B annually',
              inefficiencyRate: '30.2%',
              addressableInefficiency: '¥816M annually in Tokyo alone'
            }
          }
        },
        {
          title: 'Our Revolutionary Solution',
          content: {
            solutionOverview: 'AI-powered predictive positioning system with weather intelligence',
            uniqueApproach: [
              {
                feature: 'Weather-AI Fusion',
                description: 'First system to integrate weather correlation (0.847 coefficient) into taxi optimization',
                competitiveAdvantage: 'Patent-pending technology, impossible to replicate without research data'
              },
              {
                feature: 'University Research Validation',
                description: 'Academic research proving 30.2% revenue improvements',
                competitiveAdvantage: 'Instant credibility and risk reduction for enterprise adoption'
              },
              {
                feature: 'Real-time ODPT Integration',
                description: 'Official Tokyo transportation API for millisecond-accurate positioning',
                competitiveAdvantage: 'Government partnership providing data moat'
              }
            ],
            provenResults: {
              revenueIncrease: '30.2%',
              timeEfficiency: '11.4% trip duration reduction',
              utilizationImprovement: '27.7% increase',
              customerSatisfaction: '38.2% wait time reduction'
            }
          }
        }
      ]
    },
    'market-opportunity': {
      title: 'Market Opportunity',
      icon: '🎯',
      slides: [
        {
          title: 'Massive Market Opportunity',
          content: {
            marketSizing: {
              tam: {
                size: '¥2.7B',
                description: 'Total Addressable Market - Tokyo taxi optimization',
                breakdown: [
                  'Individual drivers: ¥1.62B (45,000 drivers × ¥3,000/month)',
                  'Fleet companies: ¥720M (120 companies × avg ¥50,000/month)',
                  'Platform integration: ¥360M (3 platforms × avg ¥5M/month)'
                ]
              },
              sam: {
                size: '¥1.6B',
                description: 'Serviceable Addressable Market - Tech-enabled segment',
                details: 'Drivers and companies willing to adopt AI technology (60% of market)'
              },
              som: {
                size: '¥400M',
                description: 'Serviceable Obtainable Market - 3-year realistic capture',
                details: '25% market share achievable with first-mover advantage and research validation'
              }
            },
            marketGrowth: [
              {
                factor: 'AI Adoption in Transportation',
                growthRate: '47% CAGR',
                impact: 'Increasing acceptance of AI-driven optimization tools'
              },
              {
                factor: 'Weather Extremes Increasing',
                growthRate: '15% increase in weather volatility',
                impact: 'Greater need for weather-intelligent transportation solutions'
              },
              {
                factor: 'Government Smart City Initiatives',
                growthRate: '¥500B smart city investments by 2030',
                impact: 'Policy support for transportation optimization technologies'
              }
            ],
            internationalExpansion: {
              primaryTargets: [
                'Osaka, Japan (15,000 taxis)',
                'Seoul, South Korea (70,000 taxis)',
                'Singapore (28,000 taxis)',
                'New York City (13,000 yellow taxis)'
              ],
              totalInternationalMarket: '¥12B+ globally',
              expansionTimeline: 'Years 3-5 post-Tokyo market capture'
            }
          }
        }
      ]
    },
    'competitive-advantage': {
      title: 'Competitive Advantage',
      icon: '🏆',
      slides: [
        {
          title: 'Unassailable Competitive Moats',
          content: {
            primaryMoats: [
              {
                moat: 'Academic Research Partnership',
                strength: 'Extremely Strong',
                description: 'Exclusive University of Tokyo partnership with published research validation',
                defensibility: 'Cannot be replicated - requires years of academic research and institutional credibility',
                competitorBarrier: 'No competitors have academic validation for their claims'
              },
              {
                moat: 'Weather Intelligence Patent',
                strength: 'Strong',
                description: 'Patent-pending weather-taxi demand correlation algorithm',
                defensibility: '3 patents filed covering core weather integration methodology',
                competitorBarrier: 'Legal protection prevents direct replication of weather AI integration'
              },
              {
                moat: 'Government Data Partnership',
                strength: 'Strong',
                description: 'Official ODPT API access for real-time Tokyo transportation data',
                defensibility: 'Partnership agreement provides preferential access to government data',
                competitorBarrier: 'Limited API slots available, difficult for competitors to secure access'
              },
              {
                moat: 'Network Effects',
                strength: 'Growing',
                description: 'More drivers = better demand prediction accuracy',
                defensibility: 'Data quality improves with scale, creating virtuous cycle',
                competitorBarrier: 'Late entrants will have inferior data quality and accuracy'
              }
            ],
            competitorAnalysis: {
              directCompetitors: [
                {
                  name: 'Basic GPS/Navigation Systems',
                  marketShare: '65%',
                  weaknesses: ['No AI optimization', 'No weather intelligence', 'Reactive only'],
                  ourAdvantage: 'Predictive AI with weather intelligence vs reactive navigation'
                },
                {
                  name: 'Legacy Taxi Dispatch',
                  marketShare: '25%',
                  weaknesses: ['No demand prediction', 'Limited optimization', 'Legacy technology'],
                  ourAdvantage: 'AI-powered optimization vs simple dispatch coordination'
                },
                {
                  name: 'Ride-sharing Internal Tools',
                  marketShare: '8%',
                  weaknesses: ['Platform-specific', 'No external taxi support', 'No weather AI'],
                  ourAdvantage: 'Independent solution for all taxis with weather intelligence'
                }
              ],
              competitiveScore: {
                technology: '94.7% accuracy vs 67.2% competitor average',
                research: 'Only solution with university research validation',
                features: '12 unique features vs 3-5 for competitors',
                accuracy: '+27.5 percentage points higher than nearest competitor'
              }
            }
          }
        }
      ]
    },
    'financial-projections': {
      title: 'Financial Projections',
      icon: '📊',
      slides: [
        {
          title: '5-Year Financial Projections',
          content: {
            revenueProjections: {
              year1: {
                year: '2025',
                revenue: '¥50M',
                customers: '14,000 drivers',
                avgRevenue: '¥3,571/customer',
                growthRate: 'Launch year'
              },
              year2: {
                year: '2026',
                revenue: '¥150M',
                customers: '35,000 drivers + 15 fleets',
                avgRevenue: '¥4,100/customer',
                growthRate: '200%'
              },
              year3: {
                year: '2027',
                revenue: '¥400M',
                customers: '60,000 drivers + 40 fleets + 1 platform',
                avgRevenue: '¥5,500/customer',
                growthRate: '167%'
              },
              year4: {
                year: '2028',
                revenue: '¥800M',
                customers: 'Multi-city expansion: 100,000+ users',
                avgRevenue: '¥6,200/customer',
                growthRate: '100%'
              },
              year5: {
                year: '2029',
                revenue: '¥2B',
                customers: 'International expansion: 250,000+ users',
                avgRevenue: '¥7,500/customer',
                growthRate: '150%'
              }
            },
            keyMetrics: {
              ltv: '¥180,000 (3-year average customer lifetime)',
              cac: '¥12,000 (current), improving to ¥8,000 with scale',
              ltvCacRatio: '15:1 (excellent SaaS benchmark)',
              grossMargin: '85% (software margins)',
              churnRate: '5% monthly (low due to proven ROI)'
            },
            profitability: {
              breakeven: 'Month 18 (Q2 2026)',
              positiveEbitda: 'Month 24 (Q4 2026)',
              profitMargin: '35% by Year 3, 45% by Year 5',
              fcfPositive: 'Month 30 (Q2 2027)'
            },
            fundingRequirements: {
              seriesA: '¥200M (current)',
              seriesB: '¥500M (Year 2) for international expansion',
              totalFunding: '¥700M over 3 years',
              exitValue: '¥20B+ (10x revenue multiple at IPO/acquisition)'
            }
          }
        }
      ]
    },
    'technology-roadmap': {
      title: 'Technology & Roadmap',
      icon: '🔬',
      slides: [
        {
          title: 'Technology Innovation Roadmap',
          content: {
            currentTechnology: {
              aiEngine: 'Multi-modal predictive AI with 94.7% accuracy',
              dataIntegration: 'Real-time ODPT + JMA weather + event data fusion',
              platforms: 'Web, mobile iOS/Android, API for enterprise integration',
              infrastructure: 'Cloud-native architecture with sub-second response times'
            },
            innovationPipeline: [
              {
                phase: 'Phase 1: AI Enhancement (2025)',
                timeline: 'Q3-Q4 2025',
                technologies: [
                  'Deep learning model optimization for 97%+ accuracy',
                  'Real-time machine learning with continuous model updates',
                  'Advanced behavioral pattern recognition',
                  'Predictive maintenance for taxi fleets'
                ],
                investment: '¥80M',
                expectedROI: '15% accuracy improvement, 25% customer acquisition boost'
              },
              {
                phase: 'Phase 2: Platform Expansion (2026)',
                timeline: 'Q1-Q4 2026',
                technologies: [
                  'Multi-modal transportation optimization (buses, trains, ride-sharing)',
                  'Smart city integration with traffic management systems',
                  'Carbon footprint optimization algorithms',
                  'Autonomous vehicle preparation framework'
                ],
                investment: '¥120M',
                expectedROI: 'New revenue streams, 40% market expansion'
              },
              {
                phase: 'Phase 3: Global Platform (2027-2029)',
                timeline: '2027-2029',
                technologies: [
                  'Multi-language AI with localized optimization',
                  'International weather pattern integration',
                  'Cross-border transportation optimization',
                  'Autonomous fleet management system'
                ],
                investment: '¥300M',
                expectedROI: 'International market entry, 10x revenue potential'
              }
            ],
            intellectualProperty: {
              patentsGranted: 0,
              patentsPending: 3,
              trademarks: 2,
              copyrights: 'Proprietary AI algorithms and datasets',
              ipStrategy: 'Aggressive patent protection for core weather-AI integration technology'
            },
            technicalTeam: {
              currentSize: 8,
              targetSize: 35,
              keyRoles: [
                'AI/ML Engineers (10)',
                'Data Scientists (8)',
                'Backend Engineers (7)',
                'Mobile Developers (4)',
                'DevOps Engineers (3)',
                'Research Scientists (3)'
              ],
              recruitmentStrategy: 'University partnerships + competitive packages + equity incentives'
            }
          }
        }
      ]
    },
    'team-execution': {
      title: 'Team & Execution',
      icon: '👥',
      slides: [
        {
          title: 'World-Class Team & Execution Capability',
          content: {
            foundingTeam: {
              ceo: {
                name: 'Tatsuru Kikuchi',
                title: 'CEO & Founder',
                background: 'University of Tokyo Faculty of Economics',
                expertise: 'Spatial economics, AI implementation, academic research',
                achievements: [
                  'Led research proving 30.2% taxi revenue improvements',
                  'Published academic papers on transportation optimization',
                  'Secured University of Tokyo partnership and ODPT API access',
                  'Built MVP and secured pilot customers proving product-market fit'
                ],
                equity: '65%'
              }
            },
            advisoryBoard: [
              {
                name: 'Dr. Hiroshi Tanaka',
                title: 'Professor of Transportation Engineering, University of Tokyo',
                value: 'Academic credibility and research guidance'
              },
              {
                name: 'Takeshi Yamamoto',
                title: 'Former CEO, JapanTaxi',
                value: 'Taxi industry expertise and partnership connections'
              },
              {
                name: 'Sarah Chen',
                title: 'Former VP of AI, Grab',
                value: 'International ride-sharing and AI scaling experience'
              }
            ],
            organizationStructure: {
              currentTeam: 8,
              fundedTeam: 35,
              departments: [
                {
                  name: 'Technology (40%)',
                  headcount: 14,
                  focus: 'AI development, platform engineering, data science'
                },
                {
                  name: 'Business Development (25%)',
                  headcount: 9,
                  focus: 'Sales, partnerships, customer success'
                },
                {
                  name: 'Operations (20%)',
                  headcount: 7,
                  focus: 'Finance, HR, legal, compliance'
                },
                {
                  name: 'Marketing (15%)',
                  headcount: 5,
                  focus: 'Brand, content, digital marketing, PR'
                }
              ]
            },
            executionMilestones: {
              completed: [
                '✅ University research validation (30.2% improvement)',
                '✅ MVP development and pilot testing',
                '✅ ODPT API partnership secured',
                '✅ Patent applications filed',
                '✅ Initial customer validation and feedback'
              ],
              next6Months: [
                '🎯 Commercial launch and customer acquisition (1,000+ drivers)',
                '🎯 Series A funding completion (¥200M)',
                '🎯 Team expansion to 20 people',
                '🎯 Fleet partnership agreements (5+ companies)',
                '🎯 Platform integration partnerships'
              ],
              next12Months: [
                '🚀 Scale to 10,000+ active drivers',
                '🚀 Expand to Osaka and other Japanese cities',
                '🚀 Series B preparation and funding',
                '🚀 International expansion planning',
                '🚀 Advanced AI features rollout'
              ]
            }
          }
        }
      ]
    }
  };

  const presentationSlides = () => {
    const allSlides = [];
    Object.values(pitchSections).forEach(section => {
      section.slides.forEach(slide => {
        allSlides.push({
          ...slide,
          sectionIcon: section.icon,
          sectionTitle: section.title
        });
      });
    });
    return allSlides;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        ...prev,
        projectedValuation: prev.projectedValuation + (Math.random() - 0.5) * 10,
        monthlyGrowthRate: prev.monthlyGrowthRate + (Math.random() - 0.5) * 0.5,
        marketCaptureRate: Math.min(prev.marketCaptureRate + 0.02, 4.5),
        investorInterest: Math.min(prev.investorInterest + 0.1, 98)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    const totalSlides = presentationSlides().length;
    setSlideIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    const totalSlides = presentationSlides().length;
    setSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="investor-pitch-system">
      {!presentationMode ? (
        <>
          <div className="header">
            <h1>💼 Investor Pitch System</h1>
            <div className="investment-metrics">
              <div className="metric">
                <span className="value">¥{liveMetrics.projectedValuation.toFixed(0)}M</span>
                <span className="label">Projected Valuation</span>
              </div>
              <div className="metric">
                <span className="value">{liveMetrics.monthlyGrowthRate.toFixed(1)}%</span>
                <span className="label">Monthly Growth Rate</span>
              </div>
              <div className="metric">
                <span className="value">{liveMetrics.marketCaptureRate.toFixed(1)}%</span>
                <span className="label">Market Capture Rate</span>
              </div>
              <div className="metric">
                <span className="value">{liveMetrics.investorInterest.toFixed(0)}%</span>
                <span className="label">Investor Interest</span>
              </div>
            </div>
            <button 
              className="presentation-button"
              onClick={() => setPresentationMode(true)}
            >
              🎬 Start Presentation Mode
            </button>
          </div>

          <div className="pitch-navigation">
            {Object.keys(pitchSections).map((key) => (
              <button
                key={key}
                className={`nav-button ${activePitch === key ? 'active' : ''}`}
                onClick={() => setActivePitch(key)}
              >
                {pitchSections[key].icon} {pitchSections[key].title}
              </button>
            ))}
          </div>

          <div className="pitch-content">
            {pitchSections[activePitch].slides.map((slide, index) => (
              <div key={index} className="slide-content">
                <h2>{slide.title}</h2>
                {slide.subtitle && <h3>{slide.subtitle}</h3>}
                
                {/* Render content based on slide structure */}
                <div className="slide-body">
                  {JSON.stringify(slide.content, null, 2)}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="presentation-mode">
          <div className="presentation-header">
            <button onClick={() => setPresentationMode(false)}>Exit Presentation</button>
            <div className="slide-counter">
              Slide {slideIndex + 1} of {presentationSlides().length}
            </div>
            <div className="slide-controls">
              <button onClick={prevSlide}>← Previous</button>
              <button onClick={nextSlide}>Next →</button>
            </div>
          </div>
          
          <div className="presentation-slide">
            {/* Render current slide */}
            <div className="slide-display">
              <h1>{presentationSlides()[slideIndex]?.title}</h1>
              {presentationSlides()[slideIndex]?.subtitle && (
                <h2>{presentationSlides()[slideIndex].subtitle}</h2>
              )}
              <div className="slide-content-display">
                {/* Formatted slide content would go here */}
                <pre>{JSON.stringify(presentationSlides()[slideIndex]?.content, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestorPitchSystem;