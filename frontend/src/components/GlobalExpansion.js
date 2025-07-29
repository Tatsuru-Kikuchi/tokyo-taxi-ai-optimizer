import React, { useState, useEffect } from 'react';
import './GlobalExpansion.css';

const GlobalExpansion = () => {
  const [activeRegion, setActiveRegion] = useState('asia-pacific');
  const [expansionMetrics, setExpansionMetrics] = useState({
    totalMarkets: 15,
    readyForLaunch: 4,
    marketValue: 12.8,
    timeToLaunch: 8
  });

  const globalMarkets = {
    'asia-pacific': {
      title: 'Asia-Pacific Expansion',
      icon: '🌏',
      description: 'Strategic expansion across major Asian transportation markets',
      totalMarketValue: '¥8.4B',
      markets: [
        {
          country: 'South Korea (Seoul)',
          marketSize: '¥1.2B',
          taxiFleet: '70,000 vehicles',
          readiness: 92,
          launchDate: 'Q1 2026',
          keyPartners: ['Kakao Mobility', 'Seoul Metropolitan Government'],
          localizations: ['Korean language', 'Won currency', 'Local traffic patterns'],
          regulatoryStatus: 'Pre-approval discussions',
          competitiveAdvantage: 'First weather-AI system in Korean market',
          expectedROI: '¥180M by Year 3',
          riskFactors: ['Regulatory approval', 'Local competition'],
          successMetrics: ['5,000 drivers by Q4 2026', '15% market share by 2028']
        },
        {
          country: 'Singapore',
          marketSize: '¥800M',
          taxiFleet: '28,000 vehicles',
          readiness: 88,
          launchDate: 'Q2 2026',
          keyPartners: ['ComfortDelGro', 'Land Transport Authority'],
          localizations: ['Multi-language support', 'SGD currency', 'Tropical weather patterns'],
          regulatoryStatus: 'Smart Nation initiative alignment',
          competitiveAdvantage: 'Government smart city partnerships',
          expectedROI: '¥120M by Year 3',
          riskFactors: ['High tech competition', 'Regulatory compliance'],
          successMetrics: ['2,500 drivers by Q1 2027', '20% market share by 2029']
        },
        {
          country: 'Hong Kong',
          marketSize: '¥600M',
          taxiFleet: '18,000 vehicles',
          readiness: 75,
          launchDate: 'Q3 2026',
          keyPartners: ['Hong Kong Taxi Association', 'Transport Department'],
          localizations: ['Traditional Chinese', 'HKD currency', 'Dense urban patterns'],
          regulatoryStatus: 'Initial discussions',
          competitiveAdvantage: 'Weather intelligence for typhoon season',
          expectedROI: '¥90M by Year 3',
          riskFactors: ['Political environment', 'Space constraints'],
          successMetrics: ['1,800 drivers by Q2 2027', '25% market share by 2030']
        },
        {
          country: 'Taiwan (Taipei)',
          marketSize: '¥500M',
          taxiFleet: '32,000 vehicles',
          readiness: 68,
          launchDate: 'Q4 2026',
          keyPartners: ['Taiwan Taxi', 'Taipei City Government'],
          localizations: ['Traditional Chinese', 'TWD currency', 'Typhoon weather integration'],
          regulatoryStatus: 'Market research phase',
          competitiveAdvantage: 'University research credibility',
          expectedROI: '¥75M by Year 3',
          riskFactors: ['Market saturation', 'Local preferences'],
          successMetrics: ['3,200 drivers by Q1 2028', '18% market share by 2030']
        }
      ]
    },
    'north-america': {
      title: 'North America Strategy',
      icon: '🇺🇸',
      description: 'Premium market entry focusing on innovation-forward cities',
      totalMarketValue: '¥15.6B',
      markets: [
        {
          country: 'United States (San Francisco)',
          marketSize: '¥2.1B',
          taxiFleet: '8,500 vehicles + ride-share',
          readiness: 45,
          launchDate: 'Q2 2027',
          keyPartners: ['Uber Technologies', 'San Francisco MTA'],
          localizations: ['English language', 'USD currency', 'Tech-savvy market'],
          regulatoryStatus: 'Regulatory framework analysis',
          competitiveAdvantage: 'Academic research validation from MIT partnership',
          expectedROI: '¥420M by Year 5',
          riskFactors: ['Intense competition', 'Regulatory complexity'],
          successMetrics: ['AI platform integration', 'Tech industry recognition']
        },
        {
          country: 'United States (New York)',
          marketSize: '¥3.2B',
          taxiFleet: '13,587 yellow cabs + ride-share',
          readiness: 35,
          launchDate: 'Q4 2027',
          keyPartners: ['NYC Taxi & Limousine Commission', 'Metropolitan Transportation Authority'],
          localizations: ['Multi-language', 'USD currency', 'Complex urban patterns'],
          regulatoryStatus: 'Initial market assessment',
          competitiveAdvantage: 'Weather intelligence for extreme weather events',
          expectedROI: '¥640M by Year 5',
          riskFactors: ['Regulatory barriers', 'Established competition'],
          successMetrics: ['Yellow cab integration', 'City government partnership']
        },
        {
          country: 'Canada (Toronto)',
          marketSize: '¥680M',
          taxiFleet: '4,849 licensed vehicles',
          readiness: 42,
          launchDate: 'Q1 2028',
          keyPartners: ['Beck Taxi', 'City of Toronto'],
          localizations: ['English/French', 'CAD currency', 'Winter weather optimization'],
          regulatoryStatus: 'Market entry planning',
          competitiveAdvantage: 'Extreme weather AI capabilities',
          expectedROI: '¥102M by Year 5',
          riskFactors: ['Weather dependency', 'Market size'],
          successMetrics: ['Winter performance validation', 'Government endorsement']
        }
      ]
    },
    'europe': {
      title: 'European Market Entry',
      icon: '🇪🇺',
      description: 'Strategic entry into high-value European transportation markets',
      totalMarketValue: '¥11.2B',
      markets: [
        {
          country: 'United Kingdom (London)',
          marketSize: '¥1.8B',
          taxiFleet: '21,000 black cabs + ride-share',
          readiness: 38,
          launchDate: 'Q3 2027',
          keyPartners: ['Transport for London', 'Licensed Taxi Drivers Association'],
          localizations: ['English language', 'GBP currency', 'Historic city patterns'],
          regulatoryStatus: 'Brexit regulatory assessment',
          competitiveAdvantage: 'Rain prediction for London weather',
          expectedROI: '¥270M by Year 5',
          riskFactors: ['Brexit regulations', 'Traditional market resistance'],
          successMetrics: ['Black cab adoption', 'TfL partnership']
        },
        {
          country: 'Germany (Berlin)',
          marketSize: '¥920M',
          taxiFleet: '7,800 licensed taxis',
          readiness: 28,
          launchDate: 'Q1 2028',
          keyPartners: ['Taxi Deutschland', 'Berlin Senate'],
          localizations: ['German language', 'EUR currency', 'GDPR compliance'],
          regulatoryStatus: 'EU regulation compliance study',
          competitiveAdvantage: 'Academic research credibility',
          expectedROI: '¥138M by Year 5',
          riskFactors: ['Regulatory complexity', 'Data privacy requirements'],
          successMetrics: ['GDPR certification', 'Academic partnerships']
        },
        {
          country: 'France (Paris)',
          marketSize: '¥1.1B',
          taxiFleet: '17,000 licensed taxis',
          readiness: 25,
          launchDate: 'Q2 2028',
          keyPartners: ['G7 Taxi', 'Île-de-France Mobilités'],
          localizations: ['French language', 'EUR currency', 'Historic city navigation'],
          regulatoryStatus: 'Initial market research',
          competitiveAdvantage: 'Weather intelligence for tourist seasons',
          expectedROI: '¥165M by Year 5',
          riskFactors: ['Language barriers', 'Cultural adaptation'],
          successMetrics: ['Tourist season optimization', 'Government approval']
        }
      ]
    },
    'emerging-markets': {
      title: 'Emerging Markets',
      icon: '🌍',
      description: 'High-growth markets with significant transportation challenges',
      totalMarketValue: '¥6.8B',
      markets: [
        {
          country: 'India (Mumbai)',
          marketSize: '¥1.4B',
          taxiFleet: '45,000 vehicles',
          readiness: 22,
          launchDate: 'Q4 2028',
          keyPartners: ['Ola Cabs', 'Mumbai Metropolitan Region Development Authority'],
          localizations: ['Hindi/English', 'INR currency', 'Monsoon weather patterns'],
          regulatoryStatus: 'Partnership exploration',
          competitiveAdvantage: 'Monsoon prediction capabilities',
          expectedROI: '¥210M by Year 5',
          riskFactors: ['Infrastructure challenges', 'Price sensitivity'],
          successMetrics: ['Monsoon season performance', 'Local partnerships']
        },
        {
          country: 'Brazil (São Paulo)',
          marketSize: '¥980M',
          taxiFleet: '33,000 vehicles',
          readiness: 18,
          launchDate: 'Q2 2029',
          keyPartners: ['99 Taxis', 'São Paulo Municipal Government'],
          localizations: ['Portuguese language', 'BRL currency', 'Tropical weather'],
          regulatoryStatus: 'Market assessment',
          competitiveAdvantage: 'Weather-traffic correlation for rainy season',
          expectedROI: '¥147M by Year 5',
          riskFactors: ['Economic volatility', 'Infrastructure limitations'],
          successMetrics: ['Rainy season optimization', 'Local government support']
        }
      ]
    }
  };

  const expansionStrategy = {
    phaseApproach: [
      {
        phase: 'Phase 1: Regional Validation (2026)',
        focus: 'Asia-Pacific markets with cultural similarity',
        targets: ['Seoul', 'Singapore', 'Hong Kong'],
        investment: '¥80M',
        expectedRevenue: '¥45M by end of phase',
        keyMilestones: ['3 market launches', '8,000+ drivers', 'Localization framework']
      },
      {
        phase: 'Phase 2: Premium Markets (2027-2028)',
        focus: 'High-value Western markets',
        targets: ['San Francisco', 'London', 'Toronto'],
        investment: '¥150M',
        expectedRevenue: '¥180M by end of phase',
        keyMilestones: ['Premium market validation', 'Regulatory approvals', 'Brand recognition']
      },
      {
        phase: 'Phase 3: Scale Markets (2029+)',
        focus: 'Large-scale emerging markets',
        targets: ['Mumbai', 'São Paulo', 'Mexico City'],
        investment: '¥200M',
        expectedRevenue: '¥400M+ by end of phase',
        keyMilestones: ['Mass market penetration', 'Local partnerships', 'Market leadership']
      }
    ],
    localizationFramework: {
      technical: [
        'Multi-language AI processing',
        'Local currency integration',
        'Regional weather pattern analysis',
        'Local traffic data integration',
        'Cultural UX adaptations'
      ],
      business: [
        'Local partnership development',
        'Regulatory compliance frameworks',
        'Regional pricing strategies',
        'Local customer support',
        'Market-specific marketing'
      ],
      operational: [
        'Local team establishment',
        'Regional data centers',
        'Compliance monitoring',
        'Performance optimization',
        'Customer success programs'
      ]
    },
    riskMitigation: [
      'Phased approach reduces overall risk exposure',
      'Local partnerships provide market knowledge',
      'Academic validation reduces technology risk',
      'Multiple market diversification',
      'Regulatory pre-approval processes'
    ]
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setExpansionMetrics(prev => ({
        ...prev,
        totalMarkets: Math.min(prev.totalMarkets + 1, 20),
        readyForLaunch: Math.min(prev.readyForLaunch + (Math.random() > 0.8 ? 1 : 0), 8),
        marketValue: prev.marketValue + (Math.random() - 0.3) * 0.5,
        timeToLaunch: Math.max(prev.timeToLaunch - 0.1, 3)
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="global-expansion">
      <div className="expansion-header">
        <h1>🌍 Global Expansion Strategy</h1>
        <div className="expansion-metrics">
          <div className="metric">
            <span className="value">{expansionMetrics.totalMarkets}</span>
            <span className="label">Target Markets</span>
          </div>
          <div className="metric">
            <span className="value">{expansionMetrics.readyForLaunch}</span>
            <span className="label">Ready for Launch</span>
          </div>
          <div className="metric">
            <span className="value">¥{expansionMetrics.marketValue.toFixed(1)}B</span>
            <span className="label">Global Market Value</span>
          </div>
          <div className="metric">
            <span className="value">{expansionMetrics.timeToLaunch.toFixed(1)} months</span>
            <span className="label">First International Launch</span>
          </div>
        </div>
      </div>

      <div className="region-tabs">
        {Object.keys(globalMarkets).map((region) => (
          <button
            key={region}
            className={`region-tab ${activeRegion === region ? 'active' : ''}`}
            onClick={() => setActiveRegion(region)}
          >
            {globalMarkets[region].icon} {globalMarkets[region].title}
            <span className="market-value">{globalMarkets[region].totalMarketValue}</span>
          </button>
        ))}
      </div>

      <div className="expansion-content">
        <div className="region-overview">
          <h2>{globalMarkets[activeRegion].title}</h2>
          <p>{globalMarkets[activeRegion].description}</p>
          <div className="total-market-value">
            Total Market Value: {globalMarkets[activeRegion].totalMarketValue}
          </div>
        </div>

        <div className="markets-grid">
          {globalMarkets[activeRegion].markets.map((market, index) => (
            <div key={index} className="market-card">
              <div className="market-header">
                <h3>{market.country}</h3>
                <div className="readiness-indicator">
                  <div className="readiness-bar">
                    <div 
                      className="readiness-fill" 
                      style={{width: `${market.readiness}%`}}
                    ></div>
                  </div>
                  <span className="readiness-text">{market.readiness}% Ready</span>
                </div>
              </div>

              <div className="market-metrics">
                <div className="metric-row">
                  <span className="label">Market Size:</span>
                  <span className="value">{market.marketSize}</span>
                </div>
                <div className="metric-row">
                  <span className="label">Fleet Size:</span>
                  <span className="value">{market.taxiFleet}</span>
                </div>
                <div className="metric-row">
                  <span className="label">Launch Date:</span>
                  <span className="value">{market.launchDate}</span>
                </div>
                <div className="metric-row">
                  <span className="label">Expected ROI:</span>
                  <span className="value">{market.expectedROI}</span>
                </div>
              </div>

              <div className="market-details">
                <div className="detail-section">
                  <h4>Key Partners</h4>
                  <ul>
                    {market.keyPartners.map((partner, i) => (
                      <li key={i}>{partner}</li>
                    ))}
                  </ul>
                </div>

                <div className="detail-section">
                  <h4>Localizations Required</h4>
                  <ul>
                    {market.localizations.map((loc, i) => (
                      <li key={i}>{loc}</li>
                    ))}
                  </ul>
                </div>

                <div className="detail-section">
                  <h4>Competitive Advantage</h4>
                  <p>{market.competitiveAdvantage}</p>
                </div>

                <div className="detail-section">
                  <h4>Success Metrics</h4>
                  <ul>
                    {market.successMetrics.map((metric, i) => (
                      <li key={i}>{metric}</li>
                    ))}
                  </ul>
                </div>

                <div className="detail-section">
                  <h4>Risk Factors</h4>
                  <ul>
                    {market.riskFactors.map((risk, i) => (
                      <li key={i}>{risk}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="market-status">
                <span className={`status-badge ${market.regulatoryStatus.toLowerCase().replace(/\s+/g, '-')}`}>
                  {market.regulatoryStatus}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="expansion-strategy">
        <h2>🚀 Expansion Strategy Framework</h2>
        
        <div className="phase-approach">
          <h3>Phased Market Entry</h3>
          <div className="phases-timeline">
            {expansionStrategy.phaseApproach.map((phase, index) => (
              <div key={index} className="phase-card">
                <h4>{phase.phase}</h4>
                <div className="phase-focus">{phase.focus}</div>
                <div className="phase-details">
                  <div className="detail-item">
                    <strong>Targets:</strong> {phase.targets.join(', ')}
                  </div>
                  <div className="detail-item">
                    <strong>Investment:</strong> {phase.investment}
                  </div>
                  <div className="detail-item">
                    <strong>Expected Revenue:</strong> {phase.expectedRevenue}
                  </div>
                </div>
                <div className="milestones">
                  <strong>Key Milestones:</strong>
                  <ul>
                    {phase.keyMilestones.map((milestone, i) => (
                      <li key={i}>{milestone}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="localization-framework">
          <h3>Localization Framework</h3>
          <div className="framework-categories">
            <div className="framework-category">
              <h4>Technical Adaptations</h4>
              <ul>
                {expansionStrategy.localizationFramework.technical.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="framework-category">
              <h4>Business Adaptations</h4>
              <ul>
                {expansionStrategy.localizationFramework.business.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="framework-category">
              <h4>Operational Adaptations</h4>
              <ul>
                {expansionStrategy.localizationFramework.operational.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="risk-mitigation">
          <h3>Risk Mitigation Strategy</h3>
          <ul>
            {expansionStrategy.riskMitigation.map((strategy, index) => (
              <li key={index}>{strategy}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="expansion-roadmap">
        <h2>📅 Global Expansion Roadmap</h2>
        <div className="roadmap-timeline">
          <div className="timeline-item">
            <div className="timeline-date">Q1 2026</div>
            <div className="timeline-content">
              <h4>Seoul Market Launch</h4>
              <p>First international expansion with cultural similarity advantage</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-date">Q2 2026</div>
            <div className="timeline-content">
              <h4>Singapore Smart City Integration</h4>
              <p>Government partnership for smart city transportation initiative</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-date">Q2 2027</div>
            <div className="timeline-content">
              <h4>San Francisco Tech Hub Entry</h4>
              <p>Premium market validation with tech industry recognition</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-date">Q3 2027</div>
            <div className="timeline-content">
              <h4>London Black Cab Integration</h4>
              <p>European market entry with traditional taxi integration</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-date">Q4 2028</div>
            <div className="timeline-content">
              <h4>Mumbai Emerging Market Launch</h4>
              <p>Large-scale emerging market penetration with monsoon optimization</p>
            </div>
          </div>
        </div>
      </div>

      <div className="global-impact">
        <h2>🌟 Global Impact Projections</h2>
        <div className="impact-metrics">
          <div className="impact-card">
            <h3>Revenue Impact</h3>
            <div className="impact-value">¥2.1B</div>
            <p>Annual revenue by 2030 across all markets</p>
          </div>
          <div className="impact-card">
            <h3>Driver Network</h3>
            <div className="impact-value">150,000+</div>
            <p>Drivers empowered globally with AI optimization</p>
          </div>
          <div className="impact-card">
            <h3>Market Leadership</h3>
            <div className="impact-value">15 Cities</div>
            <p>Market leadership positions in major transportation hubs</p>
          </div>
          <div className="impact-card">
            <h3>Environmental Impact</h3>
            <div className="impact-value">30% Reduction</div>
            <p>Empty driving miles reduced through AI optimization</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalExpansion;