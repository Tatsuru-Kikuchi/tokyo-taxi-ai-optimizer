import React, { useState, useEffect } from 'react';
import './StrategicRoadmap.css';

const StrategicRoadmap = () => {
  const [activeQuarter, setActiveQuarter] = useState('Q3-2025');
  const [progressMetrics, setProgressMetrics] = useState({
    overallCompletion: 73,
    currentQuarterProgress: 89,
    nextMilestoneProgress: 45,
    investorReadiness: 92
  });

  const roadmapData = {
    'Q3-2025': {
      title: 'Commercial Launch Foundation',
      status: 'Active',
      completion: 89,
      objectives: [
        'Complete enterprise-grade platform development',
        'Finalize University of Tokyo research publication',
        'Launch Series A investor outreach campaign',
        'Establish first enterprise partnerships'
      ],
      milestones: [
        {
          milestone: 'Advanced Analytics System Deployment',
          status: 'Completed',
          date: '2025-07-25',
          impact: 'Enterprise demonstration capability achieved'
        },
        {
          milestone: 'Competitive Differentiation Analysis',
          status: 'Completed',
          date: '2025-07-28',
          impact: 'Clear market positioning established'
        },
        {
          milestone: 'Investor Presentation Development',
          status: 'Completed',
          date: '2025-07-29',
          impact: 'Series A readiness achieved'
        },
        {
          milestone: 'Strategic Partnership Outreach',
          status: 'In Progress',
          date: '2025-08-15',
          impact: 'Market validation and revenue pipeline'
        }
      ],
      keyDeliverables: [
        '✅ Enterprise Analytics Dashboard',
        '✅ Competitive Analysis Framework',
        '✅ Market Positioning Strategy',
        '✅ Investor Pitch Deck (¥50M Series A)',
        '🔄 Partnership Development Pipeline',
        '🎯 Patent Application Submissions'
      ]
    },
    'Q4-2025': {
      title: 'Market Entry & Validation',
      status: 'Planned',
      completion: 0,
      objectives: [
        'Launch commercial pilot with 500 drivers',
        'Secure first enterprise customers',
        'Complete Series A funding round',
        'Establish Tokyo market presence'
      ],
      milestones: [
        {
          milestone: 'Commercial Platform Launch',
          status: 'Planned',
          date: '2025-10-01',
          impact: 'Customer acquisition begins'
        },
        {
          milestone: 'First 500 Paid Subscribers',
          status: 'Planned',
          date: '2025-11-15',
          impact: 'Product-market fit validation'
        },
        {
          milestone: 'Series A Funding Close',
          status: 'Planned',
          date: '2025-12-01',
          impact: '¥50M capital for scale operations'
        }
      ],
      keyDeliverables: [
        '🎯 Mobile app store launch (iOS/Android)',
        '🎯 Customer onboarding system',
        '🎯 Payment processing integration',
        '🎯 Series A investor presentations'
      ]
    },
    'Q1-2026': {
      title: 'Scale & Optimization',
      status: 'Future',
      completion: 0,
      objectives: [
        'Scale to 2,500 active users',
        'Expand to 3 additional Tokyo districts',
        'Launch B2B enterprise platform',
        'Achieve operational profitability'
      ],
      successMetrics: [
        '2,500+ active users',
        '¥65M annual recurring revenue',
        '15+ enterprise customers',
        'Positive EBITDA'
      ]
    }
  };

  const strategicInitiatives = [
    {
      initiative: 'Technology Excellence',
      description: 'Maintain AI prediction accuracy leadership',
      currentStatus: '94.7% accuracy vs 67% competitor average',
      nextActions: ['Algorithm optimization', 'Data source expansion', 'Real-time processing enhancement']
    },
    {
      initiative: 'Market Penetration',
      description: 'Capture 25% of Tokyo taxi optimization market',
      currentStatus: '0.1% market share, targeting 5% by Q4 2025',
      nextActions: ['Driver acquisition campaign', 'Fleet partnerships', 'Ride-sharing platform integration']
    },
    {
      initiative: 'Financial Growth',
      description: 'Achieve ¥400M revenue by 2029',
      currentStatus: 'Pre-revenue, targeting ¥15M in 2025',
      nextActions: ['Series A funding', 'Revenue diversification', 'Unit economics optimization']
    },
    {
      initiative: 'Competitive Moats',
      description: 'Build defensible competitive advantages',
      currentStatus: '3 patent applications, university research validation',
      nextActions: ['Patent portfolio expansion', 'Exclusive partnerships', 'Data network effects']
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgressMetrics(prev => ({
        ...prev,
        currentQuarterProgress: Math.min(prev.currentQuarterProgress + 0.1, 95),
        nextMilestoneProgress: Math.min(prev.nextMilestoneProgress + 0.2, 100),
        overallCompletion: Math.min(prev.overallCompletion + 0.05, 100)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="strategic-roadmap">
      <div className="roadmap-header">
        <h1>🗺️ Strategic Roadmap</h1>
        <div className="progress-overview">
          <div className="progress-metric">
            <span className="value">{progressMetrics.overallCompletion.toFixed(1)}%</span>
            <span className="label">Overall Progress</span>
          </div>
          <div className="progress-metric">
            <span className="value">{progressMetrics.currentQuarterProgress.toFixed(1)}%</span>
            <span className="label">Q3 2025 Progress</span>
          </div>
          <div className="progress-metric">
            <span className="value">{progressMetrics.investorReadiness.toFixed(1)}%</span>
            <span className="label">Series A Readiness</span>
          </div>
        </div>
      </div>

      <div className="quarter-tabs">
        {Object.keys(roadmapData).map((quarter) => (
          <button
            key={quarter}
            className={`quarter-tab ${activeQuarter === quarter ? 'active' : ''} ${roadmapData[quarter].status.toLowerCase()}`}
            onClick={() => setActiveQuarter(quarter)}
          >
            <span className="quarter-name">{quarter}</span>
            <span className="quarter-title">{roadmapData[quarter].title}</span>
            <span className="completion-badge">{roadmapData[quarter].completion}%</span>
          </button>
        ))}
      </div>

      <div className="roadmap-content">
        <div className="quarter-overview">
          <h2>{roadmapData[activeQuarter].title}</h2>
          <div className="quarter-status">
            <span className={`status-badge ${roadmapData[activeQuarter].status.toLowerCase()}`}>
              {roadmapData[activeQuarter].status}
            </span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{width: `${roadmapData[activeQuarter].completion}%`}}
              ></div>
            </div>
          </div>
        </div>

        <div className="quarter-details">
          <div className="objectives-section">
            <h3>🎯 Key Objectives</h3>
            <ul>
              {roadmapData[activeQuarter].objectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </div>

          <div className="milestones-section">
            <h3>🏁 Major Milestones</h3>
            <div className="milestones-timeline">
              {roadmapData[activeQuarter].milestones.map((milestone, index) => (
                <div key={index} className={`milestone-card ${milestone.status.toLowerCase().replace(' ', '-')}`}>
                  <div className="milestone-header">
                    <h4>{milestone.milestone}</h4>
                    <span className="milestone-date">{milestone.date}</span>
                  </div>
                  <div className="milestone-status">{milestone.status}</div>
                  <div className="milestone-impact">
                    <strong>Impact:</strong> {milestone.impact}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="deliverables-section">
            <h3>📋 Key Deliverables</h3>
            <div className="deliverables-grid">
              {roadmapData[activeQuarter].keyDeliverables.map((deliverable, index) => (
                <div key={index} className="deliverable-item">
                  {deliverable}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="strategic-initiatives">
        <h2>🚀 Strategic Initiatives</h2>
        <div className="initiatives-grid">
          {strategicInitiatives.map((initiative, index) => (
            <div key={index} className="initiative-card">
              <h3>{initiative.initiative}</h3>
              <p>{initiative.description}</p>
              <div className="current-status">
                <strong>Current Status:</strong> {initiative.currentStatus}
              </div>
              <div className="next-actions">
                <strong>Next Actions:</strong>
                <ul>
                  {initiative.nextActions.map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="success-trajectory">
        <h2>📈 Success Trajectory</h2>
        <div className="trajectory-metrics">
          <div className="metric-card">
            <h3>Revenue Growth</h3>
            <div className="trajectory-data">
              <span className="current">Current: Pre-revenue</span>
              <span className="target-2025">2025: ¥15M</span>
              <span className="target-2027">2027: ¥180M</span>
              <span className="target-2029">2029: ¥400M</span>
            </div>
          </div>
          <div className="metric-card">
            <h3>Market Share</h3>
            <div className="trajectory-data">
              <span className="current">Current: 0%</span>
              <span className="target-2025">2025: 2%</span>
              <span className="target-2027">2027: 15%</span>
              <span className="target-2029">2029: 25%</span>
            </div>
          </div>
          <div className="metric-card">
            <h3>User Base</h3>
            <div className="trajectory-data">
              <span className="current">Current: 0</span>
              <span className="target-2025">2025: 500</span>
              <span className="target-2027">2027: 8,000</span>
              <span className="target-2029">2029: 25,000</span>
            </div>
          </div>
        </div>
      </div>

      <div className="roadmap-footer">
        <div className="contact-cta">
          <h3>Ready to Join the Transportation Revolution?</h3>
          <p>Contact Tatsuru Kikuchi for partnership opportunities and investment discussions</p>
          <div className="contact-buttons">
            <button className="contact-btn primary">📧 tatsuru.kikuchi@gmail.com</button>
            <button className="contact-btn secondary">📱 +81-80-3641-9973</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategicRoadmap;