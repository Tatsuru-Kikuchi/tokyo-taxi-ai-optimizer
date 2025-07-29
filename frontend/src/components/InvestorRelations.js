import React, { useState, useEffect } from 'react';
import './InvestorRelations.css';

const InvestorRelations = () => {
  const [activeInvestorTab, setActiveInvestorTab] = useState('series-a');
  const [investorMetrics, setInvestorMetrics] = useState({
    totalInvestorMeetings: 23,
    activeNegotiations: 8,
    termSheetsReceived: 3,
    totalFundingPipeline: 125
  });

  const investorCategories = {
    'series-a': {
      title: 'Series A Lead Investors',
      icon: '💰',
      targetAmount: '¥50M',
      description: 'Premium venture capital firms for Series A lead investment',
      investors: [
        {
          firm: 'SoftBank Vision Fund',
          contact: 'Rajeev Misra - CEO',
          status: 'Due Diligence Active',
          investmentSize: '¥30M (60% of round)',
          valuation: '¥250M pre-money',
          timeline: 'Term sheet expected Q4 2025',
          strengths: ['Global network access', 'AI/transportation expertise', 'Massive scaling capital'],
          concerns: ['Portfolio conflicts', 'Control preferences', 'Execution timeline'],
          lastMeeting: '2025-07-25 - Technology deep dive',
          nextAction: 'Financial model review meeting',
          probability: '85%',
          strategicValue: 'Global expansion acceleration and technology validation',
          terms: 'Lead investor with board seat, 2x liquidation preference, anti-dilution protection'
        },
        {
          firm: 'Sequoia Capital Japan',
          contact: 'Tetsuo Ohta - Managing Partner',
          status: 'Initial Review',
          investmentSize: '¥25M (50% of round)',
          valuation: '¥200M pre-money',
          timeline: 'Initial meeting scheduled Q4 2025',
          strengths: ['Strong Japan network', 'Enterprise expertise', 'Hands-on support'],
          concerns: ['Market size questions', 'Competitive landscape', 'International expansion'],
          lastMeeting: 'Initial pitch presentation',
          nextAction: 'Market analysis presentation',
          probability: '65%',
          strategicValue: 'Local market expertise and enterprise connections',
          terms: 'Co-lead with board observer, 1.5x liquidation preference'
        },
        {
          firm: 'Andreessen Horowitz (a16z)',
          contact: 'Frank Chen - General Partner',
          status: 'Technology Evaluation',
          investmentSize: '¥35M (70% of round)',
          valuation: '¥300M pre-money',
          timeline: 'Decision expected Q1 2026',
          strengths: ['AI expertise', 'US market access', 'Technical validation'],
          concerns: ['Japan market understanding', 'Regulatory complexity', 'Team scaling'],
          lastMeeting: 'AI technology demonstration',
          nextAction: 'Team scaling discussion',
          probability: '70%',
          strategicValue: 'US market entry and AI technology credibility',
          terms: 'Lead with significant board control, founder-friendly terms'
        }
      ]
    },
    'strategic': {
      title: 'Strategic Corporate Investors',
      icon: '🏢',
      targetAmount: '¥30M',
      description: 'Corporate venture arms and strategic partnerships with equity participation',
      investors: [
        {
          firm: 'Toyota Ventures',
          contact: 'Jim Adler - Founding Managing Director',
          status: 'Partnership Discussions',
          investmentSize: '¥15M + strategic partnership',
          valuation: 'Strategic round at premium',
          timeline: 'MOU expected Q1 2026',
          strengths: ['Automotive expertise', 'Autonomous vehicle integration', 'Global reach'],
          concerns: ['Technology integration complexity', 'Timeline alignment'],
          lastMeeting: 'Autonomous vehicle integration workshop',
          nextAction: 'Joint development planning',
          probability: '75%',
          strategicValue: 'Future mobility positioning and automotive industry access',
          terms: 'Strategic investment with technology licensing and joint development'
        },
        {
          firm: 'NTT DOCOMO Ventures',
          contact: 'Takeshi Natsuno - Executive Vice President',
          status: 'Active Negotiation',
          investmentSize: '¥10M + 5G infrastructure partnership',
          valuation: 'Market rate with strategic premium',
          timeline: 'Term sheet review in progress',
          strengths: ['5G infrastructure', 'Japan market access', 'Telecom partnerships'],
          concerns: ['Technology dependencies', 'Exclusive partnership terms'],
          lastMeeting: '5G integration technical review',
          nextAction: 'Partnership terms negotiation',
          probability: '80%',
          strategicValue: '5G infrastructure access and telecom industry validation',
          terms: 'Minority investment with preferred partnership status'
        },
        {
          firm: 'Rakuten Capital',
          contact: 'Hiroshi Mikitani - Chairman & CEO',
          status: 'LOI Signed',
          investmentSize: '¥8M + super app integration',
          valuation: 'Aligned with Series A terms',
          timeline: 'Final documentation Q4 2025',
          strengths: ['Consumer platform access', 'Japan e-commerce leader', 'Fintech integration'],
          concerns: ['Platform dependency', 'Revenue sharing terms'],
          lastMeeting: 'Super app integration planning',
          nextAction: 'Legal documentation completion',
          probability: '90%',
          strategicValue: 'Consumer platform access and fintech integration',
          terms: 'Convertible note with app integration rights'
        }
      ]
    },
    'government': {
      title: 'Government & Institutional',
      icon: '🏛️',
      targetAmount: '¥20M',
      description: 'Government funds and institutional investors supporting innovation',
      investors: [
        {
          firm: 'Japan Innovation Network (JIN)',
          contact: 'Akira Yamada - Managing Director',
          status: 'Term Sheet Received',
          investmentSize: '¥12M government backing',
          valuation: 'Below market for strategic support',
          timeline: 'Final approval Q4 2025',
          strengths: ['Government endorsement', 'Regulatory support', 'Policy influence'],
          concerns: ['Bureaucratic processes', 'Performance requirements'],
          lastMeeting: 'Government impact assessment',
          nextAction: 'Ministry of Transportation presentation',
          probability: '85%',
          strategicValue: 'Government backing and regulatory advantage',
          terms: 'Preferred equity with government reporting requirements'
        },
        {
          firm: 'Development Bank of Japan',
          contact: 'Yasushi Shiina - CEO',
          status: 'Infrastructure Assessment',
          investmentSize: '¥15M infrastructure investment',
          valuation: 'Infrastructure development terms',
          timeline: 'Infrastructure impact study Q1 2026',
          strengths: ['Infrastructure funding', 'Long-term support', 'Government connections'],
          concerns: ['Infrastructure requirements', 'Public benefit obligations'],
          lastMeeting: 'Smart city infrastructure discussion',
          nextAction: 'Infrastructure development proposal',
          probability: '70%',
          strategicValue: 'Infrastructure support and government validation',
          terms: 'Convertible debt with infrastructure development milestones'
        }
      ]
    },
    'international': {
      title: 'International Expansion Investors',
      icon: '🌍',
      targetAmount: '¥40M',
      description: 'Global investors focused on international expansion and scaling',
      investors: [
        {
          firm: 'GGV Capital',
          contact: 'Jenny Lee - Managing Partner',
          status: 'Asia Expansion Review',
          investmentSize: '¥20M for Asia expansion',
          valuation: 'Series A+ terms',
          timeline: 'Asia strategy review Q1 2026',
          strengths: ['Asia network', 'Cross-border expertise', 'Scaling experience'],
          concerns: ['Market competition', 'Regulatory variations'],
          lastMeeting: 'Asia expansion strategy session',
          nextAction: 'Seoul market entry planning',
          probability: '75%',
          strategicValue: 'Asia-Pacific expansion expertise and network',
          terms: 'Series A extension with Asia expansion milestones'
        },
        {
          firm: 'Balderton Capital',
          contact: 'Bernard Liautaud - Managing Partner',
          status: 'Europe Strategy Discussion',
          investmentSize: '¥18M for European expansion',
          valuation: 'European market entry terms',
          timeline: 'Europe feasibility study Q2 2026',
          strengths: ['European network', 'Regulatory expertise', 'B2B scaling'],
          concerns: ['GDPR compliance', 'Market adaptation'],
          lastMeeting: 'European regulatory landscape review',
          nextAction: 'London market entry assessment',
          probability: '65%',
          strategicValue: 'European market entry and regulatory navigation',
          terms: 'Convertible preferred with geographic expansion triggers'
        }
      ]
    }
  };

  const fundingStrategy = {
    totalTargetRaise: '¥50M Series A + ¥30M strategic extensions',
    timeline: 'Q4 2025 - Q2 2026',
    useOfFunds: [
      { category: 'Technology Development', percentage: 35, amount: '¥17.5M', focus: 'AI enhancement, platform scaling, international localization' },
      { category: 'Market Expansion', percentage: 30, amount: '¥15M', focus: 'Seoul launch, Singapore entry, US market preparation' },
      { category: 'Team Building', percentage: 20, amount: '¥10M', focus: 'Engineering talent, sales team, international management' },
      { category: 'Strategic Partnerships', percentage: 10, amount: '¥5M', focus: 'Partnership development, integration costs, pilot programs' },
      { category: 'Operations & Infrastructure', percentage: 5, amount: '¥2.5M', focus: 'Legal, compliance, office expansion, systems' }
    ],
    exitStrategy: [
      'Strategic acquisition by ride-sharing platform (5-7 years, ¥8-15B valuation)',
      'Automotive industry acquisition by Toyota/Honda (4-6 years, ¥6-12B valuation)',
      'IPO on Tokyo Stock Exchange (7-10 years, ¥20B+ market cap)',
      'Technology licensing to multiple platforms (ongoing revenue model)'
    ]
  };

  const investorRelationsActivities = [
    {
      date: '2025-08-05',
      activity: 'SoftBank Vision Fund - Financial Model Deep Dive',
      participants: ['Rajeev Misra', 'Investment Committee'],
      agenda: ['Revenue projections', 'Unit economics', 'International scaling costs'],
      deliverables: ['Updated financial model', 'Risk assessment', 'Scaling timeline'],
      outcome: 'Expected: Term sheet within 2 weeks'
    },
    {
      date: '2025-08-12',
      activity: 'Sequoia Japan - Market Analysis Presentation',
      participants: ['Tetsuo Ohta', 'Investment Team'],
      agenda: ['Japan market size', 'Competitive landscape', 'Government regulations'],
      deliverables: ['Market research report', 'Competitive analysis', 'Regulatory framework'],
      outcome: 'Target: Investment committee presentation'
    },
    {
      date: '2025-08-18',
      activity: 'Toyota Ventures - Joint Development Workshop',
      participants: ['Jim Adler', 'Autonomous Vehicle Team'],
      agenda: ['AV integration roadmap', 'Technology partnerships', 'Commercial timeline'],
      deliverables: ['Integration timeline', 'Technical requirements', 'Partnership terms'],
      outcome: 'Goal: MOU for strategic partnership'
    },
    {
      date: '2025-08-25',
      activity: 'Ministry of Transportation - Government Impact Presentation',
      participants: ['Policy Directors', 'Innovation Committee'],
      agenda: ['Smart city benefits', 'Transportation efficiency', 'Economic impact'],
      deliverables: ['Impact assessment', 'Policy recommendations', 'Implementation plan'],
      outcome: 'Objective: Government endorsement'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setInvestorMetrics(prev => ({
        ...prev,
        totalInvestorMeetings: prev.totalInvestorMeetings + Math.floor(Math.random() * 2),
        activeNegotiations: prev.activeNegotiations + Math.floor((Math.random() - 0.6) * 2),
        totalFundingPipeline: prev.totalFundingPipeline + (Math.random() - 0.3) * 10
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="investor-relations">
      <div className="investor-header">
        <h1>💰 Investor Relations & Funding Strategy</h1>
        <div className="investor-metrics">
          <div className="metric">
            <span className="value">{investorMetrics.totalInvestorMeetings}</span>
            <span className="label">Total Investor Meetings</span>
          </div>
          <div className="metric">
            <span className="value">{investorMetrics.activeNegotiations}</span>
            <span className="label">Active Negotiations</span>
          </div>
          <div className="metric">
            <span className="value">{investorMetrics.termSheetsReceived}</span>
            <span className="label">Term Sheets Received</span>
          </div>
          <div className="metric">
            <span className="value">¥{investorMetrics.totalFundingPipeline.toFixed(0)}M</span>
            <span className="label">Funding Pipeline</span>
          </div>
        </div>
      </div>

      <div className="investor-tabs">
        {Object.keys(investorCategories).map((category) => (
          <button
            key={category}
            className={`investor-tab ${activeInvestorTab === category ? 'active' : ''}`}
            onClick={() => setActiveInvestorTab(category)}
          >
            {investorCategories[category].icon} {investorCategories[category].title}
            <span className="target-amount">{investorCategories[category].targetAmount}</span>
          </button>
        ))}
      </div>

      <div className="investor-content">
        <div className="category-overview">
          <h2>{investorCategories[activeInvestorTab].title}</h2>
          <p>{investorCategories[activeInvestorTab].description}</p>
          <div className="target-amount-display">
            Target Amount: {investorCategories[activeInvestorTab].targetAmount}
          </div>
        </div>

        <div className="investors-grid">
          {investorCategories[activeInvestorTab].investors.map((investor, index) => (
            <div key={index} className="investor-card">
              <div className="investor-header">
                <h3>{investor.firm}</h3>
                <div className="probability-indicator">
                  <div className="probability-bar">
                    <div 
                      className="probability-fill" 
                      style={{width: investor.probability}}
                    ></div>
                  </div>
                  <span className="probability-text">{investor.probability} Probability</span>
                </div>
              </div>

              <div className="investor-details">
                <div className="detail-row">
                  <span className="label">Contact:</span>
                  <span className="value">{investor.contact}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Status:</span>
                  <span className={`status ${investor.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {investor.status}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Investment Size:</span>
                  <span className="value">{investor.investmentSize}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Valuation:</span>
                  <span className="value">{investor.valuation}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Timeline:</span>
                  <span className="value">{investor.timeline}</span>
                </div>
              </div>

              <div className="investor-analysis">
                <div className="strengths">
                  <h4>Strengths</h4>
                  <ul>
                    {investor.strengths.map((strength, i) => (
                      <li key={i}>{strength}</li>
                    ))}
                  </ul>
                </div>

                <div className="concerns">
                  <h4>Concerns</h4>
                  <ul>
                    {investor.concerns.map((concern, i) => (
                      <li key={i}>{concern}</li>
                    ))}
                  </ul>
                </div>

                <div className="strategic-value">
                  <h4>Strategic Value</h4>
                  <p>{investor.strategicValue}</p>
                </div>

                <div className="investment-terms">
                  <h4>Investment Terms</h4>
                  <p>{investor.terms}</p>
                </div>

                <div className="next-steps">
                  <div className="last-meeting">
                    <strong>Last Meeting:</strong> {investor.lastMeeting}
                  </div>
                  <div className="next-action">
                    <strong>Next Action:</strong> {investor.nextAction}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="funding-strategy">
        <h2>📊 Comprehensive Funding Strategy</h2>
        
        <div className="funding-overview">
          <div className="funding-targets">
            <div className="target-card primary">
              <h3>Primary Target</h3>
              <div className="amount">{fundingStrategy.totalTargetRaise}</div>
              <div className="timeline">{fundingStrategy.timeline}</div>
            </div>
          </div>

          <div className="use-of-funds">
            <h3>Use of Funds Breakdown</h3>
            <div className="funds-breakdown">
              {fundingStrategy.useOfFunds.map((fund, index) => (
                <div key={index} className="fund-category">
                  <div className="category-header">
                    <span className="category-name">{fund.category}</span>
                    <span className="category-percentage">{fund.percentage}%</span>
                    <span className="category-amount">{fund.amount}</span>
                  </div>
                  <div className="category-focus">{fund.focus}</div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{width: `${fund.percentage}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="exit-strategy">
            <h3>Exit Strategy Options</h3>
            <ul>
              {fundingStrategy.exitStrategy.map((strategy, index) => (
                <li key={index}>{strategy}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="investor-activities">
        <h2>📅 Upcoming Investor Relations Activities</h2>
        <div className="activities-timeline">
          {investorRelationsActivities.map((activity, index) => (
            <div key={index} className="activity-card">
              <div className="activity-date">{activity.date}</div>
              <div className="activity-content">
                <h4>{activity.activity}</h4>
                <div className="participants">
                  <strong>Participants:</strong> {activity.participants.join(', ')}
                </div>
                <div className="agenda">
                  <strong>Agenda:</strong>
                  <ul>
                    {activity.agenda.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="deliverables">
                  <strong>Deliverables:</strong>
                  <ul>
                    {activity.deliverables.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="expected-outcome">
                  <strong>Expected Outcome:</strong> {activity.outcome}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="funding-milestones">
        <h2>🎯 Funding Milestones & Timeline</h2>
        <div className="milestones-grid">
          <div className="milestone">
            <h3>Q4 2025</h3>
            <ul>
              <li>Close Series A lead investor (SoftBank/Sequoia)</li>
              <li>Finalize strategic partnerships (Toyota/NTT)</li>
              <li>Complete government funding approval</li>
              <li>Legal documentation and closing</li>
            </ul>
          </div>
          <div className="milestone">
            <h3>Q1 2026</h3>
            <ul>
              <li>Deploy capital for Seoul market entry</li>
              <li>Expand engineering and sales teams</li>
              <li>Launch international partnerships</li>
              <li>Begin Series B preparation</li>
            </ul>
          </div>
          <div className="milestone">
            <h3>Q2 2026</h3>
            <ul>
              <li>Validate international market success</li>
              <li>Prepare for next funding round</li>
              <li>Establish market leadership metrics</li>
              <li>Plan strategic exit opportunities</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="investor-value-proposition">
        <h2>💎 Investor Value Proposition</h2>
        <div className="value-props">
          <div className="value-prop">
            <h3>🎓 De-risked Technology</h3>
            <p>University of Tokyo research validation reduces technology and market risk</p>
          </div>
          <div className="value-prop">
            <h3>📈 Proven ROI</h3>
            <p>30.2% revenue improvement with academic backing demonstrates clear value</p>
          </div>
          <div className="value-prop">
            <h3>🏛️ Government Support</h3>
            <p>Official data partnerships and government backing provide regulatory advantage</p>
          </div>
          <div className="value-prop">
            <h3>🌍 Global Scalability</h3>
            <p>Multi-city AI transfer technology enables rapid international expansion</p>
          </div>
          <div className="value-prop">
            <h3>⚖️ Patent Protection</h3>
            <p>Patent-pending weather-AI integration creates strong competitive moats</p>
          </div>
          <div className="value-prop">
            <h3>🚀 Multiple Exit Paths</h3>
            <p>Strategic acquisition, IPO, or licensing opportunities provide investor flexibility</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorRelations;