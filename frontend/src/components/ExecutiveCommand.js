import React, { useState, useEffect } from 'react';
import './ExecutiveCommand.css';

const ExecutiveCommand = () => {
  const [activeCommand, setActiveCommand] = useState('revenue-operations');
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    globalRevenue: 127.3,
    activeDrivers: 12847,
    partnershipsActive: 23,
    marketCap: 2.4,
    aiAccuracy: 96.8,
    citiesLive: 8
  });

  const commandCenters = {
    'revenue-operations': {
      title: 'Global Revenue Operations',
      icon: '💰',
      description: 'Real-time revenue optimization and financial command center',
      dashboards: [
        {
          name: 'Live Revenue Streams',
          metrics: [
            { label: 'Driver Subscriptions', value: '¥67.2M', growth: '+34%', projection: '¥89M Q4' },
            { label: 'Enterprise Partnerships', value: '¥42.1M', growth: '+67%', projection: '¥71M Q4' },
            { label: 'Platform Licensing', value: '¥18.0M', growth: '+156%', projection: '¥46M Q4' },
            { label: 'Data Analytics Revenue', value: '¥8.7M', growth: '+89%', projection: '¥16M Q4' }
          ],
          alerts: [
            'SoftBank payment ¥12M confirmed - Q3 target exceeded',
            'Japan Taxi contract renewal +¥15M annual value',
            'Seoul market launch generating ¥2.1M monthly recurring revenue'
          ]
        },
        {
          name: 'Global Financial Performance',
          metrics: [
            { label: 'Monthly Recurring Revenue', value: '¥24.7M', growth: '+45%', forecast: '¥35M by Dec' },
            { label: 'Customer Acquisition Cost', value: '¥8,420', trend: '-23%', target: '¥6,500' },
            { label: 'Lifetime Value', value: '¥127,000', growth: '+31%', ratio: '15:1 LTV:CAC' },
            { label: 'Gross Margin', value: '87.3%', trend: '+2.1%', industry: 'Top 5%' }
          ],
          projections: [
            'Q4 2025: ¥180M revenue (vs ¥120M target)',
            '2026 Full Year: ¥520M revenue projection',
            'Break-even achieved Q2 2026 (6 months early)',
            'Series B opportunity: ¥150M at ¥1.2B valuation Q3 2026'
          ]
        }
      ]
    },
    'strategic-intelligence': {
      title: 'Strategic Intelligence Center',
      icon: '🎯',
      description: 'Market intelligence, competitive analysis, and strategic decision support',
      dashboards: [
        {
          name: 'Competitive Intelligence',
          insights: [
            {
              competitor: 'Uber Technologies',
              threat: 'Medium',
              action: 'Partner opportunity - weather AI licensing discussion initiated',
              timeline: 'Q1 2026',
              value: '¥45M annual potential'
            },
            {
              competitor: 'DiDi Global',
              threat: 'Low',
              action: 'Expansion conflict in Seoul - negotiate market territories',
              timeline: 'Q4 2025',
              value: 'Market share protection'
            },
            {
              competitor: 'Traditional taxi companies',
              threat: 'Minimal',
              action: 'Convert to partners - technology adoption acceleration',
              timeline: 'Ongoing',
              value: 'Customer acquisition channel'
            }
          ]
        },
        {
          name: 'Market Intelligence',
          opportunities: [
            {
              market: 'European Union - GDPR Compliance AI',
              size: '¥2.8B',
              readiness: '78%',
              entry: 'Q2 2026',
              advantage: 'Privacy-first AI architecture'
            },
            {
              market: 'India - Monsoon Transportation AI',
              size: '¥4.1B',
              readiness: '65%',
              entry: 'Q3 2026',
              advantage: 'Weather prediction specialization'
            },
            {
              market: 'USA - Autonomous Vehicle Integration',
              size: '¥8.7B',
              readiness: '45%',
              entry: 'Q1 2027',
              advantage: 'Academic research partnerships'
            }
          ]
        }
      ]
    },
    'technology-command': {
      title: 'Technology Command Center',
      icon: '🤖',
      description: 'AI performance monitoring, technology development, and innovation pipeline',
      dashboards: [
        {
          name: 'AI Performance Monitoring',
          systems: [
            {
              system: 'Weather Prediction Engine',
              accuracy: '98.1%',
              status: 'Optimal',
              lastUpdate: '2 minutes ago',
              improvement: '+1.4% this quarter'
            },
            {
              system: 'Traffic Flow Analysis',
              accuracy: '94.7%',
              status: 'Optimal',
              lastUpdate: '15 seconds ago',
              improvement: '+2.1% this quarter'
            },
            {
              system: 'Demand Forecasting',
              accuracy: '92.3%',
              status: 'Learning',
              lastUpdate: '1 minute ago',
              improvement: '+5.2% this quarter'
            },
            {
              system: 'Multi-City Transfer Learning',
              accuracy: '89.6%',
              status: 'Expanding',
              lastUpdate: '30 seconds ago',
              improvement: 'New system - baseline established'
            }
          ]
        },
        {
          name: 'Innovation Pipeline',
          projects: [
            {
              project: 'Autonomous Vehicle Integration Alpha',
              progress: '67%',
              team: 'MIT Partnership',
              completion: 'Q1 2026',
              impact: 'Future mobility leadership'
            },
            {
              project: 'Quantum Weather Modeling',
              progress: '23%',
              team: 'University of Tokyo + IBM',
              completion: 'Q3 2026',
              impact: '99.5% weather accuracy target'
            },
            {
              project: 'Global Language AI Localization',
              progress: '89%',
              team: 'Internal + Google Translate',
              completion: 'Q4 2025',
              impact: '15 language market expansion'
            }
          ]
        }
      ]
    },
    'partnership-command': {
      title: 'Strategic Partnership Command',
      icon: '🤝',
      description: 'Partnership execution, relationship management, and alliance optimization',
      dashboards: [
        {
          name: 'Active Partnership Performance',
          partnerships: [
            {
              partner: 'SoftBank Vision Fund',
              type: 'Investment + Strategic',
              value: '¥50M investment + network access',
              status: 'Due Diligence Phase',
              nextMilestone: 'Term sheet signing Q4 2025',
              kpis: ['Technology validation complete', 'Market expansion plan approved']
            },
            {
              partner: 'Toyota Motor Corporation',
              type: 'Technology Integration',
              value: '¥100M joint venture potential',
              status: 'Research Collaboration',
              nextMilestone: 'Autonomous vehicle pilot Q2 2026',
              kpis: ['AI integration testing', 'Safety protocol development']
            },
            {
              partner: 'University of Tokyo',
              type: 'Academic Research',
              value: '¥15M research funding + credibility',
              status: 'Active Research',
              nextMilestone: 'Publication submission Q1 2026',
              kpis: ['Research paper completion', 'Patent applications filed']
            }
          ]
        },
        {
          name: 'Partnership Pipeline',
          prospects: [
            {
              prospect: 'Google Cloud Platform',
              stage: 'Negotiation',
              potential: '¥30M infrastructure credits + AI tools',
              probability: '85%',
              timeline: 'Q4 2025'
            },
            {
              prospect: 'Microsoft Azure AI',
              stage: 'Initial Discussion',
              potential: '¥25M partnership + enterprise sales',
              probability: '65%',
              timeline: 'Q1 2026'
            },
            {
              prospect: 'Seoul Metropolitan Government',
              stage: 'Pilot Planning',
              potential: '¥40M smart city contract',
              probability: '78%',
              timeline: 'Q1 2026'
            }
          ]
        }
      ]
    },
    'global-operations': {
      title: 'Global Operations Command',
      icon: '🌍',
      description: 'International market management, expansion coordination, and operational excellence',
      dashboards: [
        {
          name: 'Live Market Performance',
          markets: [
            {
              market: 'Tokyo (Headquarters)',
              revenue: '¥89.2M',
              drivers: '8,420',
              growth: '+23%',
              status: 'Market Leader',
              share: '28%'
            },
            {
              market: 'Seoul (Alpha Launch)',
              revenue: '¥12.7M',
              drivers: '1,240',
              growth: '+340%',
              status: 'Rapid Expansion',
              share: '8%'
            },
            {
              market: 'Singapore (Beta)',
              revenue: '¥6.1M',
              drivers: '420',
              growth: '+156%',
              status: 'Early Adoption',
              share: '12%'
            },
            {
              market: 'Hong Kong (Planning)',
              revenue: '¥0.8M',
              drivers: '67',
              growth: 'New',
              status: 'Pilot Phase',
              share: '2%'
            }
          ]
        },
        {
          name: 'Expansion Readiness Matrix',
          targets: [
            {
              city: 'San Francisco',
              readiness: '67%',
              launch: 'Q2 2026',
              investment: '¥45M',
              roi: '¥120M by 2028'
            },
            {
              city: 'London',
              readiness: '54%',
              launch: 'Q3 2026',
              investment: '¥38M',
              roi: '¥95M by 2028'
            },
            {
              city: 'Mumbai',
              readiness: '34%',
              launch: 'Q1 2027',
              investment: '¥28M',
              roi: '¥85M by 2029'
            }
          ]
        }
      ]
    }
  };

  const executiveAlerts = [
    {
      priority: 'Critical',
      message: 'SoftBank term sheet ready for signature - ¥50M Series A',
      action: 'Schedule executive meeting within 48 hours',
      deadline: 'End of week'
    },
    {
      priority: 'High',
      message: 'Seoul market exceeding projections by 180%',
      action: 'Accelerate Singapore and Hong Kong expansion',
      deadline: 'Q4 2025'
    },
    {
      priority: 'High',
      message: 'MIT partnership delivering breakthrough results',
      action: 'Prepare technology showcase for investors',
      deadline: 'November 2025'
    },
    {
      priority: 'Medium',
      message: 'European GDPR compliance certification approved',
      action: 'Initiate London market entry planning',
      deadline: 'Q1 2026'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeMetrics(prev => ({
        ...prev,
        globalRevenue: prev.globalRevenue + (Math.random() - 0.3) * 2.5,
        activeDrivers: prev.activeDrivers + Math.floor((Math.random() - 0.3) * 100),
        partnershipsActive: prev.partnershipsActive + (Math.random() > 0.9 ? 1 : 0),
        marketCap: prev.marketCap + (Math.random() - 0.4) * 0.1,
        aiAccuracy: Math.min(prev.aiAccuracy + (Math.random() - 0.8) * 0.1, 99.9),
        citiesLive: prev.citiesLive + (Math.random() > 0.95 ? 1 : 0)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="executive-command">
      <div className="command-header">
        <h1>👑 Executive Command Center</h1>
        <div className="real-time-metrics">
          <div className="metric-card critical">
            <span className="value">¥{realTimeMetrics.globalRevenue.toFixed(1)}M</span>
            <span className="label">Global Revenue</span>
          </div>
          <div className="metric-card success">
            <span className="value">{realTimeMetrics.activeDrivers.toLocaleString()}</span>
            <span className="label">Active Drivers</span>
          </div>
          <div className="metric-card info">
            <span className="value">{realTimeMetrics.partnershipsActive}</span>
            <span className="label">Active Partnerships</span>
          </div>
          <div className="metric-card warning">
            <span className="value">¥{realTimeMetrics.marketCap.toFixed(1)}B</span>
            <span className="label">Market Cap</span>
          </div>
          <div className="metric-card primary">
            <span className="value">{realTimeMetrics.aiAccuracy.toFixed(1)}%</span>
            <span className="label">AI Accuracy</span>
          </div>
          <div className="metric-card secondary">
            <span className="value">{realTimeMetrics.citiesLive}</span>
            <span className="label">Cities Live</span>
          </div>
        </div>
      </div>

      <div className="executive-alerts">
        <h2>🚨 Executive Alerts</h2>
        <div className="alerts-container">
          {executiveAlerts.map((alert, index) => (
            <div key={index} className={`alert-card ${alert.priority.toLowerCase()}`}>
              <div className="alert-header">
                <span className="priority-badge">{alert.priority}</span>
                <span className="deadline">{alert.deadline}</span>
              </div>
              <div className="alert-message">{alert.message}</div>
              <div className="alert-action">
                <strong>Action Required:</strong> {alert.action}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="command-tabs">
        {Object.keys(commandCenters).map((command) => (
          <button
            key={command}
            className={`command-tab ${activeCommand === command ? 'active' : ''}`}
            onClick={() => setActiveCommand(command)}
          >
            {commandCenters[command].icon} {commandCenters[command].title}
          </button>
        ))}
      </div>

      <div className="command-content">
        <div className="command-overview">
          <h2>{commandCenters[activeCommand].title}</h2>
          <p>{commandCenters[activeCommand].description}</p>
        </div>

        {activeCommand === 'revenue-operations' && (
          <div className="revenue-operations">
            {commandCenters[activeCommand].dashboards.map((dashboard, index) => (
              <div key={index} className="dashboard-section">
                <h3>{dashboard.name}</h3>
                {dashboard.metrics && (
                  <div className="metrics-grid">
                    {dashboard.metrics.map((metric, i) => (
                      <div key={i} className="metric-detail-card">
                        <div className="metric-value">{metric.value}</div>
                        <div className="metric-label">{metric.label}</div>
                        <div className="metric-growth">{metric.growth}</div>
                        <div className="metric-projection">{metric.projection}</div>
                      </div>
                    ))}
                  </div>
                )}
                {dashboard.alerts && (
                  <div className="revenue-alerts">
                    <h4>Recent Achievements</h4>
                    <ul>
                      {dashboard.alerts.map((alert, i) => (
                        <li key={i}>{alert}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {dashboard.projections && (
                  <div className="financial-projections">
                    <h4>Financial Projections</h4>
                    <ul>
                      {dashboard.projections.map((projection, i) => (
                        <li key={i}>{projection}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeCommand === 'strategic-intelligence' && (
          <div className="strategic-intelligence">
            {commandCenters[activeCommand].dashboards.map((dashboard, index) => (
              <div key={index} className="dashboard-section">
                <h3>{dashboard.name}</h3>
                {dashboard.insights && (
                  <div className="intelligence-grid">
                    {dashboard.insights.map((insight, i) => (
                      <div key={i} className="intelligence-card">
                        <h4>{insight.competitor}</h4>
                        <div className="threat-level">Threat Level: {insight.threat}</div>
                        <div className="recommended-action">{insight.action}</div>
                        <div className="timeline">Timeline: {insight.timeline}</div>
                        <div className="value">Value: {insight.value}</div>
                      </div>
                    ))}
                  </div>
                )}
                {dashboard.opportunities && (
                  <div className="opportunities-grid">
                    {dashboard.opportunities.map((opp, i) => (
                      <div key={i} className="opportunity-card">
                        <h4>{opp.market}</h4>
                        <div className="market-size">Market Size: {opp.size}</div>
                        <div className="readiness">Readiness: {opp.readiness}</div>
                        <div className="entry-date">Entry: {opp.entry}</div>
                        <div className="advantage">Advantage: {opp.advantage}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeCommand === 'technology-command' && (
          <div className="technology-command">
            {commandCenters[activeCommand].dashboards.map((dashboard, index) => (
              <div key={index} className="dashboard-section">
                <h3>{dashboard.name}</h3>
                {dashboard.systems && (
                  <div className="systems-grid">
                    {dashboard.systems.map((system, i) => (
                      <div key={i} className="system-card">
                        <h4>{system.system}</h4>
                        <div className="system-accuracy">Accuracy: {system.accuracy}</div>
                        <div className={`system-status ${system.status.toLowerCase()}`}>
                          Status: {system.status}
                        </div>
                        <div className="last-update">Updated: {system.lastUpdate}</div>
                        <div className="improvement">Improvement: {system.improvement}</div>
                      </div>
                    ))}
                  </div>
                )}
                {dashboard.projects && (
                  <div className="projects-grid">
                    {dashboard.projects.map((project, i) => (
                      <div key={i} className="project-card">
                        <h4>{project.project}</h4>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{width: `${project.progress}`}}
                          ></div>
                          <span className="progress-text">{project.progress}</span>
                        </div>
                        <div className="project-team">Team: {project.team}</div>
                        <div className="completion-date">Completion: {project.completion}</div>
                        <div className="project-impact">Impact: {project.impact}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeCommand === 'partnership-command' && (
          <div className="partnership-command">
            {commandCenters[activeCommand].dashboards.map((dashboard, index) => (
              <div key={index} className="dashboard-section">
                <h3>{dashboard.name}</h3>
                {dashboard.partnerships && (
                  <div className="partnerships-grid">
                    {dashboard.partnerships.map((partnership, i) => (
                      <div key={i} className="partnership-card">
                        <h4>{partnership.partner}</h4>
                        <div className="partnership-type">{partnership.type}</div>
                        <div className="partnership-value">{partnership.value}</div>
                        <div className="partnership-status">{partnership.status}</div>
                        <div className="next-milestone">{partnership.nextMilestone}</div>
                        <div className="kpis">
                          <strong>KPIs:</strong>
                          <ul>
                            {partnership.kpis.map((kpi, j) => (
                              <li key={j}>{kpi}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {dashboard.prospects && (
                  <div className="prospects-grid">
                    {dashboard.prospects.map((prospect, i) => (
                      <div key={i} className="prospect-card">
                        <h4>{prospect.prospect}</h4>
                        <div className="prospect-stage">{prospect.stage}</div>
                        <div className="prospect-potential">{prospect.potential}</div>
                        <div className="prospect-probability">{prospect.probability}</div>
                        <div className="prospect-timeline">{prospect.timeline}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeCommand === 'global-operations' && (
          <div className="global-operations">
            {commandCenters[activeCommand].dashboards.map((dashboard, index) => (
              <div key={index} className="dashboard-section">
                <h3>{dashboard.name}</h3>
                {dashboard.markets && (
                  <div className="markets-grid">
                    {dashboard.markets.map((market, i) => (
                      <div key={i} className="market-card">
                        <h4>{market.market}</h4>
                        <div className="market-revenue">Revenue: {market.revenue}</div>
                        <div className="market-drivers">Drivers: {market.drivers}</div>
                        <div className="market-growth">Growth: {market.growth}</div>
                        <div className="market-status">{market.status}</div>
                        <div className="market-share">Market Share: {market.share}</div>
                      </div>
                    ))}
                  </div>
                )}
                {dashboard.targets && (
                  <div className="targets-grid">
                    {dashboard.targets.map((target, i) => (
                      <div key={i} className="target-card">
                        <h4>{target.city}</h4>
                        <div className="target-readiness">
                          <div className="readiness-bar">
                            <div 
                              className="readiness-fill" 
                              style={{width: `${target.readiness}`}}
                            ></div>
                          </div>
                          <span>{target.readiness} Ready</span>
                        </div>
                        <div className="target-launch">Launch: {target.launch}</div>
                        <div className="target-investment">Investment: {target.investment}</div>
                        <div className="target-roi">ROI: {target.roi}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="executive-actions">
        <h2>🎯 Executive Action Items</h2>
        <div className="action-items">
          <div className="action-item urgent">
            <span className="action-icon">🔥</span>
            <span className="action-text">Sign SoftBank term sheet - ¥50M Series A funding</span>
            <button className="action-btn">Execute Now</button>
          </div>
          <div className="action-item high">
            <span className="action-icon">🚀</span>
            <span className="action-text">Approve Seoul expansion acceleration - Double investment</span>
            <button className="action-btn">Review & Approve</button>
          </div>
          <div className="action-item medium">
            <span className="action-icon">🤝</span>
            <span className="action-text">Finalize Toyota autonomous vehicle partnership</span>
            <button className="action-btn">Schedule Meeting</button>
          </div>
          <div className="action-item medium">
            <span className="action-icon">🌍</span>
            <span className="action-text">Initiate San Francisco market entry planning</span>
            <button className="action-btn">Assign Team</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveCommand;