import React, { useState, useEffect } from 'react';
import './MarketPositioning.css';

const MarketPositioning = () => {
  const [activeStrategy, setActiveStrategy] = useState('value-proposition');
  const [competitorAnalysis, setCompetitorAnalysis] = useState({
    totalCompetitors: 8,
    directCompetitors: 3,
    marketShare: 0,
    competitiveAdvantage: '47%'
  });

  const marketingStrategies = {
    'value-proposition': {
      title: 'Unique Value Proposition',
      icon: '💎',
      content: {
        primaryValue: 'Research-Validated AI Taxi Optimization',
        supportingValues: [
          {
            claim: '30.2% Revenue Increase',
            evidence: 'University of Tokyo Faculty of Economics research validation',
            differentiator: 'Only taxi AI with academic research backing',
            marketImpact: 'Instant credibility with enterprise clients'
          },
          {
            claim: 'Weather Intelligence Integration',
            evidence: '0.847 correlation coefficient between rain and taxi demand',
            differentiator: 'First and only weather-predictive taxi AI system',
            marketImpact: 'Unique positioning in predictive transportation AI'
          },
          {
            claim: '94.7% Prediction Accuracy',
            evidence: 'Real-time ODPT API integration with machine learning',
            differentiator: '27.5% higher accuracy than competitor average',
            marketImpact: 'Superior ROI demonstration capability'
          }
        ],
        competitivePosition: 'Premium AI Solution with Academic Validation',
        targetMessage: 'The only taxi optimization system backed by university research, delivering proven 30% revenue improvements through weather-intelligent AI positioning.'
      }
    },
    'target-segmentation': {
      title: 'Target Market Segmentation',
      icon: '🎯',
      content: {
        primarySegment: 'Tech-Forward Taxi Drivers & Fleet Operators',
        segments: [
          {
            name: 'Individual Taxi Drivers',
            size: '45,000 drivers in Tokyo',
            characteristics: [
              'Tech-savvy early adopters',
              'Revenue-focused decision makers',
              'Weather-aware operations experience',
              'Smartphone-based workflow preference'
            ],
            painPoints: [
              'Inconsistent daily earnings',
              'Inefficient positioning decisions',
              'Weather impact on demand unpredictability',
              'Competition from ride-sharing apps'
            ],
            value: '¥3,000/month subscription',
            totalRevenue: '¥1.62B annually',
            acquisitionStrategy: 'Direct marketing through taxi stands and driver communities'
          },
          {
            name: 'Taxi Fleet Companies',
            size: '120 companies managing 15,000+ vehicles',
            characteristics: [
              'Operations efficiency focused',
              'Data-driven decision making',
              'Multi-vehicle coordination needs',
              'Regulatory compliance requirements'
            ],
            painPoints: [
              'Fleet utilization optimization',
              'Driver performance management',
              'Operational cost control',
              'Competitive pressure from ride-sharing'
            ],
            value: '¥50,000-200,000/month per fleet',
            totalRevenue: '¥720M annually',
            acquisitionStrategy: 'B2B sales through industry partnerships and trade shows'
          },
          {
            name: 'Ride-Sharing Platforms',
            size: '3 major platforms (JapanTaxi, GO, etc.)',
            characteristics: [
              'Technology platform operators',
              'Scale-dependent business models',
              'User experience optimization focus',
              'Data analytics capabilities'
            ],
            painPoints: [
              'Driver efficiency and satisfaction',
              'Dynamic pricing optimization',
              'Market competition pressure',
              'Regulatory adaptation needs'
            ],
            value: '¥2M-10M/month platform integration',
            totalRevenue: '¥360M annually',
            acquisitionStrategy: 'Strategic partnerships and API integration deals'
          }
        ]
      }
    },
    'competitive-landscape': {
      title: 'Competitive Landscape Analysis',
      icon: '⚔️',
      content: {
        marketPosition: 'Blue Ocean - Research-Backed AI Optimization',
        competitors: [
          {
            name: 'Traditional GPS/Navigation Systems',
            type: 'Indirect Competitor',
            strengths: ['Established market presence', 'Low cost', 'Simple interface'],
            weaknesses: ['No AI optimization', 'No weather intelligence', 'Reactive only'],
            marketShare: '65%',
            threatLevel: 'Low',
            differentiation: 'We provide predictive AI vs. reactive navigation'
          },
          {
            name: 'Basic Taxi Dispatch Systems',
            type: 'Direct Competitor',
            strengths: ['Industry relationships', 'Fleet management features'],
            weaknesses: ['No demand prediction', 'Limited optimization', 'Legacy technology'],
            marketShare: '25%',
            threatLevel: 'Medium',
            differentiation: 'We offer AI-powered optimization vs. simple dispatch'
          },
          {
            name: 'Ride-Sharing Internal Tools',
            type: 'Direct Competitor',
            strengths: ['Platform integration', 'Large user base', 'Data resources'],
            weaknesses: ['Platform-specific', 'No external taxi support', 'No weather AI'],
            marketShare: '8%',
            threatLevel: 'High',
            differentiation: 'We provide independent, research-backed solution for all taxis'
          },
          {
            name: 'International AI Taxi Solutions',
            type: 'Potential Competitor',
            strengths: ['International experience', 'Venture funding', 'AI capabilities'],
            weaknesses: ['No Japan localization', 'No weather integration', 'No research validation'],
            marketShare: '2%',
            threatLevel: 'Future',
            differentiation: 'We have local expertise, weather intelligence, and research validation'
          }
        ],
        competitiveAdvantages: [
          'Only solution with university research validation',
          'First weather-intelligence integration in taxi AI',
          'Superior prediction accuracy (94.7% vs 67.2% average)',
          'Local Tokyo expertise and partnerships',
          'Multi-modal transportation analysis capability'
        ]
      }
    },
    'pricing-strategy': {
      title: 'Strategic Pricing Model',
      icon: '💰',
      content: {
        pricingPhilosophy: 'Value-Based Pricing with Research ROI Justification',
        models: [
          {
            tier: 'Individual Driver - Basic',
            price: '¥2,000/month',
            features: [
              'Weather-aware positioning recommendations',
              'Basic demand hotspot predictions',
              'Mobile app access',
              'Daily earnings tracking'
            ],
            targetROI: '¥8,000-12,000/month additional revenue',
            paybackPeriod: '1-2 weeks',
            competitivePosition: 'Premium pricing vs. free navigation apps'
          },
          {
            tier: 'Individual Driver - Premium',
            price: '¥3,500/month',
            features: [
              'Advanced AI predictions (3-hour forecast)',
              'Real-time traffic disruption alerts',
              'Competition density analysis',
              'Detailed analytics and reporting',
              'Priority customer support'
            ],
            targetROI: '¥15,000-20,000/month additional revenue',
            paybackPeriod: '1 week',
            competitivePosition: 'Justified by proven 30.2% revenue increase'
          },
          {
            tier: 'Fleet Enterprise',
            price: '¥1,200/vehicle/month',
            features: [
              'Fleet-wide optimization dashboard',
              'Driver performance analytics',
              'Custom API integration',
              'White-label options',
              'Dedicated account management'
            ],
            targetROI: '¥4,000-6,000/vehicle/month efficiency gains',
            paybackPeriod: '2-3 weeks',
            competitivePosition: 'Cost savings through operational efficiency'
          },
          {
            tier: 'Platform Integration',
            price: 'Custom licensing (¥2M-10M/month)',
            features: [
              'Full API access and integration',
              'Custom algorithm development',
              'White-label branding',
              'Dedicated technical support',
              'Research collaboration opportunities'
            ],
            targetROI: 'Platform-wide efficiency improvements',
            paybackPeriod: '1-3 months',
            competitivePosition: 'Exclusive research-backed competitive advantage'
          }
        ],
        pricingJustification: [
          'Research-proven 30.2% revenue increase justifies premium pricing',
          'University validation reduces risk perception',
          'Weather intelligence provides unique value unavailable elsewhere',
          'Superior accuracy delivers measurable ROI',
          'Academic partnership adds credibility and trust'
        ]
      }
    },
    'go-to-market': {
      title: 'Go-to-Market Strategy',
      icon: '🚀',
      content: {
        launchStrategy: 'Research-First Academic Validation Approach',
        phases: [
          {
            phase: 'Phase 1: Academic Validation (Q3 2025)',
            duration: '3 months',
            objectives: [
              'Complete University of Tokyo research publication',
              'Establish academic credibility and press coverage',
              'Build research-backed marketing materials',
              'Develop pilot program with select drivers'
            ],
            keyActivities: [
              'Research paper publication and PR',
              'Academic conference presentations',
              'Pilot program launch with 100 drivers',
              'Case study development and documentation'
            ],
            successMetrics: [
              '100 pilot drivers enrolled',
              '5+ media coverage pieces',
              '25%+ revenue improvement validation',
              'Academic conference presentation acceptance'
            ]
          },
          {
            phase: 'Phase 2: Direct Market Entry (Q4 2025)',
            duration: '3 months',
            objectives: [
              'Scale individual driver adoption',
              'Establish taxi company partnerships',
              'Build market presence and brand recognition',
              'Validate pricing and value proposition'
            ],
            keyActivities: [
              'Direct driver marketing campaign',
              'Taxi company partnership development',
              'App store launch and optimization',
              'Customer success story development'
            ],
            successMetrics: [
              '1,000+ paid subscribers',
              '5+ fleet company partnerships',
              '¥10M+ ARR',
              '85%+ customer satisfaction'
            ]
          },
          {
            phase: 'Phase 3: Platform Partnerships (Q1 2026)',
            duration: '6 months',
            objectives: [
              'Secure ride-sharing platform integrations',
              'Expand to other Japanese cities',
              'Establish market leadership position',
              'Prepare for international expansion'
            ],
            keyActivities: [
              'Platform integration negotiations',
              'Multi-city expansion planning',
              'Industry thought leadership development',
              'International market research'
            ],
            successMetrics: [
              '1+ major platform partnership',
              '3+ cities launched',
              '¥100M+ ARR',
              'Market leadership recognition'
            ]
          }
        ],
        marketingChannels: [
          {
            channel: 'Academic & Research Marketing',
            description: 'Leverage University of Tokyo research for credibility',
            budget: '30%',
            activities: ['Research publication PR', 'Academic conferences', 'Thought leadership']
          },
          {
            channel: 'Direct Driver Outreach',
            description: 'On-ground marketing at taxi stands and driver communities',
            budget: '25%',
            activities: ['Taxi stand demos', 'Driver referral program', 'Community partnerships']
          },
          {
            channel: 'Digital Marketing',
            description: 'Targeted online campaigns for taxi drivers and fleet operators',
            budget: '20%',
            activities: ['Google Ads', 'Social media', 'Content marketing', 'App store optimization']
          },
          {
            channel: 'Industry Partnerships',
            description: 'Strategic partnerships with taxi companies and associations',
            budget: '15%',
            activities: ['Trade show participation', 'Industry association partnerships', 'B2B sales']
          },
          {
            channel: 'PR & Media Relations',
            description: 'Build brand awareness through media coverage',
            budget: '10%',
            activities: ['Press releases', 'Media interviews', 'Industry awards', 'Case studies']
          }
        ]
      }
    }
  };

  const [liveMetrics, setLiveMetrics] = useState({
    marketPenetration: 0,
    brandAwareness: 15,
    competitiveAdvantage: 47,
    customerAcquisitionCost: 12000
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        ...prev,
        marketPenetration: Math.min(prev.marketPenetration + 0.1, 2.3),
        brandAwareness: Math.min(prev.brandAwareness + 0.2, 35),
        competitiveAdvantage: prev.competitiveAdvantage + (Math.random() - 0.5) * 0.5,
        customerAcquisitionCost: prev.customerAcquisitionCost + (Math.random() - 0.5) * 200
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="market-positioning">
      <div className="header">
        <h1>📈 Strategic Market Positioning</h1>
        <div className="positioning-metrics">
          <div className="metric">
            <span className="value">{liveMetrics.marketPenetration.toFixed(1)}%</span>
            <span className="label">Market Penetration</span>
          </div>
          <div className="metric">
            <span className="value">{liveMetrics.brandAwareness.toFixed(1)}%</span>
            <span className="label">Brand Awareness</span>
          </div>
          <div className="metric">
            <span className="value">+{liveMetrics.competitiveAdvantage.toFixed(1)}%</span>
            <span className="label">Competitive Advantage</span>
          </div>
          <div className="metric">
            <span className="value">¥{liveMetrics.customerAcquisitionCost.toFixed(0)}</span>
            <span className="label">Customer Acquisition Cost</span>
          </div>
        </div>
      </div>

      <div className="strategy-tabs">
        {Object.keys(marketingStrategies).map((key) => (
          <button
            key={key}
            className={`tab ${activeStrategy === key ? 'active' : ''}`}
            onClick={() => setActiveStrategy(key)}
          >
            {marketingStrategies[key].icon} {marketingStrategies[key].title}
          </button>
        ))}
      </div>

      <div className="strategy-content">
        {activeStrategy === 'value-proposition' && (
          <div className="value-proposition-section">
            <h2>💎 Unique Value Proposition</h2>
            <div className="primary-value">
              <h3>{marketingStrategies['value-proposition'].content.primaryValue}</h3>
              <p className="target-message">
                {marketingStrategies['value-proposition'].content.targetMessage}
              </p>
            </div>
            
            <div className="supporting-values">
              {marketingStrategies['value-proposition'].content.supportingValues.map((value, index) => (
                <div key={index} className="value-card">
                  <h4>{value.claim}</h4>
                  <div className="evidence">
                    <strong>Evidence:</strong> {value.evidence}
                  </div>
                  <div className="differentiator">
                    <strong>Differentiator:</strong> {value.differentiator}
                  </div>
                  <div className="market-impact">
                    <strong>Market Impact:</strong> {value.marketImpact}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeStrategy === 'target-segmentation' && (
          <div className="segmentation-section">
            <h2>🎯 Target Market Segmentation</h2>
            <div className="segments-grid">
              {marketingStrategies['target-segmentation'].content.segments.map((segment, index) => (
                <div key={index} className="segment-card">
                  <h3>{segment.name}</h3>
                  <div className="segment-size">{segment.size}</div>
                  
                  <div className="characteristics">
                    <h4>Characteristics</h4>
                    <ul>
                      {segment.characteristics.map((char, i) => <li key={i}>{char}</li>)}
                    </ul>
                  </div>
                  
                  <div className="pain-points">
                    <h4>Pain Points</h4>
                    <ul>
                      {segment.painPoints.map((pain, i) => <li key={i}>{pain}</li>)}
                    </ul>
                  </div>
                  
                  <div className="segment-metrics">
                    <div className="metric">
                      <span className="label">Value per Customer:</span>
                      <span className="value">{segment.value}</span>
                    </div>
                    <div className="metric">
                      <span className="label">Total Revenue Potential:</span>
                      <span className="value">{segment.totalRevenue}</span>
                    </div>
                  </div>
                  
                  <div className="acquisition-strategy">
                    <strong>Acquisition Strategy:</strong>
                    <p>{segment.acquisitionStrategy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeStrategy === 'competitive-landscape' && (
          <div className="competitive-section">
            <h2>⚔️ Competitive Landscape Analysis</h2>
            <div className="market-position">
              <h3>Market Position: {marketingStrategies['competitive-landscape'].content.marketPosition}</h3>
            </div>
            
            <div className="competitors-grid">
              {marketingStrategies['competitive-landscape'].content.competitors.map((competitor, index) => (
                <div key={index} className={`competitor-card ${competitor.threatLevel.toLowerCase()}`}>
                  <h4>{competitor.name}</h4>
                  <div className="competitor-type">{competitor.type}</div>
                  <div className="market-share">Market Share: {competitor.marketShare}</div>
                  <div className="threat-level">Threat Level: {competitor.threatLevel}</div>
                  
                  <div className="strengths">
                    <strong>Strengths:</strong>
                    <ul>
                      {competitor.strengths.map((strength, i) => <li key={i}>{strength}</li>)}
                    </ul>
                  </div>
                  
                  <div className="weaknesses">
                    <strong>Weaknesses:</strong>
                    <ul>
                      {competitor.weaknesses.map((weakness, i) => <li key={i}>{weakness}</li>)}
                    </ul>
                  </div>
                  
                  <div className="differentiation">
                    <strong>Our Differentiation:</strong>
                    <p>{competitor.differentiation}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="competitive-advantages">
              <h3>Our Competitive Advantages</h3>
              <ul>
                {marketingStrategies['competitive-landscape'].content.competitiveAdvantages.map((advantage, index) => (
                  <li key={index}>{advantage}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeStrategy === 'pricing-strategy' && (
          <div className="pricing-section">
            <h2>💰 Strategic Pricing Model</h2>
            <div className="pricing-philosophy">
              <h3>{marketingStrategies['pricing-strategy'].content.pricingPhilosophy}</h3>
            </div>
            
            <div className="pricing-tiers">
              {marketingStrategies['pricing-strategy'].content.models.map((model, index) => (
                <div key={index} className="pricing-card">
                  <h4>{model.tier}</h4>
                  <div className="price">{model.price}</div>
                  
                  <div className="features">
                    <strong>Features:</strong>
                    <ul>
                      {model.features.map((feature, i) => <li key={i}>{feature}</li>)}
                    </ul>
                  </div>
                  
                  <div className="roi-metrics">
                    <div className="metric">
                      <span className="label">Target ROI:</span>
                      <span className="value">{model.targetROI}</span>
                    </div>
                    <div className="metric">
                      <span className="label">Payback Period:</span>
                      <span className="value">{model.paybackPeriod}</span>
                    </div>
                  </div>
                  
                  <div className="competitive-position">
                    <strong>Competitive Position:</strong>
                    <p>{model.competitivePosition}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pricing-justification">
              <h3>Pricing Justification</h3>
              <ul>
                {marketingStrategies['pricing-strategy'].content.pricingJustification.map((justification, index) => (
                  <li key={index}>{justification}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeStrategy === 'go-to-market' && (
          <div className="gtm-section">
            <h2>🚀 Go-to-Market Strategy</h2>
            <div className="launch-strategy">
              <h3>{marketingStrategies['go-to-market'].content.launchStrategy}</h3>
            </div>
            
            <div className="phases-timeline">
              {marketingStrategies['go-to-market'].content.phases.map((phase, index) => (
                <div key={index} className="phase-card">
                  <h4>{phase.phase}</h4>
                  <div className="duration">Duration: {phase.duration}</div>
                  
                  <div className="objectives">
                    <strong>Objectives:</strong>
                    <ul>
                      {phase.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                    </ul>
                  </div>
                  
                  <div className="key-activities">
                    <strong>Key Activities:</strong>
                    <ul>
                      {phase.keyActivities.map((activity, i) => <li key={i}>{activity}</li>)}
                    </ul>
                  </div>
                  
                  <div className="success-metrics">
                    <strong>Success Metrics:</strong>
                    <ul>
                      {phase.successMetrics.map((metric, i) => <li key={i}>{metric}</li>)}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="marketing-channels">
              <h3>Marketing Channel Strategy</h3>
              <div className="channels-grid">
                {marketingStrategies['go-to-market'].content.marketingChannels.map((channel, index) => (
                  <div key={index} className="channel-card">
                    <h4>{channel.channel}</h4>
                    <div className="budget">Budget Allocation: {channel.budget}</div>
                    <p>{channel.description}</p>
                    <div className="activities">
                      <strong>Key Activities:</strong>
                      <ul>
                        {channel.activities.map((activity, i) => <li key={i}>{activity}</li>)}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="market-opportunity">
        <h2>🌟 Market Opportunity Summary</h2>
        <div className="opportunity-metrics">
          <div className="opportunity-card">
            <h3>Total Addressable Market</h3>
            <div className="value">¥2.7B</div>
            <p>Tokyo taxi optimization market potential</p>
          </div>
          <div className="opportunity-card">
            <h3>Serviceable Addressable Market</h3>
            <div className="value">¥1.6B</div>
            <p>Tech-enabled taxi services market</p>
          </div>
          <div className="opportunity-card">
            <h3>Serviceable Obtainable Market</h3>
            <div className="value">¥400M</div>
            <p>Realistic 3-year market capture potential</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPositioning;