import React, { useState, useEffect } from 'react';
import './PartnershipOutreach.css';

const PartnershipOutreach = () => {
  const [activePartnerType, setActivePartnerType] = useState('strategic');
  const [outreachMetrics, setOutreachMetrics] = useState({
    totalProspects: 47,
    activeDiscussions: 12,
    signedLOIs: 3,
    revenueOpportunity: 2.4
  });

  const partnershipOpportunities = {
    strategic: {
      title: 'Strategic Technology Partners',
      icon: '🤝',
      description: 'Major technology companies and platforms for integration partnerships',
      prospects: [
        {
          company: 'SoftBank Group',
          type: 'Technology Investment & Integration',
          opportunity: '¥50M+ investment + AI platform integration',
          status: 'Initial Contact',
          contact: 'Masayoshi Son - CEO',
          nextAction: 'Executive presentation scheduled',
          priority: 'High',
          timeline: 'Q4 2025',
          strategicValue: 'Major technology validation and scaling capital'
        },
        {
          company: 'NTT Data',
          type: 'Smart City Platform Integration',
          opportunity: '¥20M annual licensing + government partnerships',
          status: 'Active Discussion',
          contact: 'Toshiaki Higashihara - President',
          nextAction: 'Technical integration demo',
          priority: 'High',
          timeline: 'Q1 2026',
          strategicValue: 'Government contract access and credibility'
        },
        {
          company: 'Rakuten',
          type: 'Super App Integration',
          opportunity: '¥15M revenue sharing + 10M user access',
          status: 'LOI Signed',
          contact: 'Hiroshi Mikitani - Chairman',
          nextAction: 'API development planning',
          priority: 'Medium',
          timeline: 'Q2 2026',
          strategicValue: 'Massive consumer user base access'
        },
        {
          company: 'Toyota Motor Corporation',
          type: 'Mobility as a Service Partnership',
          opportunity: '¥100M joint venture + autonomous vehicle integration',
          status: 'Research Phase',
          contact: 'Akio Toyoda - President',
          nextAction: 'Research collaboration proposal',
          priority: 'Strategic',
          timeline: 'Q3 2026',
          strategicValue: 'Future mobility leadership positioning'
        }
      ]
    },
    transportation: {
      title: 'Transportation Industry Partners',
      icon: '🚕',
      description: 'Taxi companies, ride-sharing platforms, and transportation authorities',
      prospects: [
        {
          company: 'Japan Taxi',
          type: 'Fleet Management Integration',
          opportunity: '¥30M annual SaaS + 15,000 vehicle integration',
          status: 'Pilot Program Active',
          contact: 'Shinji Kawakami - CEO',
          nextAction: 'Expand pilot to 500 vehicles',
          priority: 'High',
          timeline: 'Q4 2025',
          strategicValue: 'Market validation and revenue acceleration'
        },
        {
          company: 'GO (Mobility Technologies)',
          type: 'AI Algorithm Licensing',
          opportunity: '¥25M licensing + revenue sharing',
          status: 'Technical Evaluation',
          contact: 'Keisuke Nakatani - CEO',
          nextAction: 'AI performance benchmarking',
          priority: 'High',
          timeline: 'Q1 2026',
          strategicValue: 'Direct competitive advantage integration'
        },
        {
          company: 'DiDi Japan',
          type: 'Weather Intelligence Integration',
          opportunity: '¥18M annual licensing + data sharing',
          status: 'Initial Discussion',
          contact: 'Hisayoshi Nogawa - General Manager',
          nextAction: 'Executive meeting arrangement',
          priority: 'Medium',
          timeline: 'Q2 2026',
          strategicValue: 'International expansion pathway'
        },
        {
          company: 'Tokyo Metropolitan Government',
          type: 'Smart City Transportation Initiative',
          opportunity: '¥40M government contract + policy influence',
          status: 'Proposal Submitted',
          contact: 'Yuriko Koike - Governor',
          nextAction: 'Policy presentation to transport committee',
          priority: 'Strategic',
          timeline: 'Q3 2026',
          strategicValue: 'Government endorsement and regulatory support'
        }
      ]
    },
    financial: {
      title: 'Financial & Investment Partners',
      icon: '💰',
      description: 'Venture capital, private equity, and strategic financial partners',
      prospects: [
        {
          company: 'SoftBank Vision Fund',
          type: 'Series A Lead Investor',
          opportunity: '¥50M Series A + global expansion support',
          status: 'Due Diligence',
          contact: 'Rajeev Misra - CEO',
          nextAction: 'Financial model deep dive',
          priority: 'Critical',
          timeline: 'Q4 2025',
          strategicValue: 'Massive scaling capital and network access'
        },
        {
          company: 'Japan Innovation Network',
          type: 'Strategic Investment',
          opportunity: '¥20M + corporate partnership facilitation',
          status: 'Term Sheet Review',
          contact: 'Akira Yamada - Managing Director',
          nextAction: 'Legal documentation',
          priority: 'High',
          timeline: 'Q4 2025',
          strategicValue: 'Corporate Japan network and credibility'
        },
        {
          company: 'Global Brain Corporation',
          type: 'AI/Transportation Focus Investment',
          opportunity: '¥15M + Silicon Valley connections',
          status: 'LOI Signed',
          contact: 'Masaki Sato - General Partner',
          nextAction: 'International expansion planning',
          priority: 'Medium',
          timeline: 'Q1 2026',
          strategicValue: 'US market entry and AI expertise'
        },
        {
          company: 'Development Bank of Japan',
          type: 'Infrastructure Investment',
          opportunity: '¥30M + government backing',
          status: 'Initial Review',
          contact: 'Yasushi Shiina - CEO',
          nextAction: 'Infrastructure impact assessment',
          priority: 'Medium',
          timeline: 'Q2 2026',
          strategicValue: 'Government support and infrastructure funding'
        }
      ]
    },
    academic: {
      title: 'Academic & Research Partners',
      icon: '🎓',
      description: 'Universities, research institutions, and academic collaborations',
      prospects: [
        {
          company: 'MIT Computer Science and Artificial Intelligence Laboratory',
          type: 'Joint Research Partnership',
          opportunity: '¥10M research funding + international credibility',
          status: 'MOU Signed',
          contact: 'Daniela Rus - Director',
          nextAction: 'Research project planning',
          priority: 'High',
          timeline: 'Q1 2026',
          strategicValue: 'Global AI research leadership and talent pipeline'
        },
        {
          company: 'Stanford University AI Lab',
          type: 'Transportation AI Research',
          opportunity: '¥8M joint research + student talent access',
          status: 'Active Discussion',
          contact: 'Fei-Fei Li - Professor',
          nextAction: 'Research proposal submission',
          priority: 'Medium',
          timeline: 'Q2 2026',
          strategicValue: 'Silicon Valley academic connections'
        },
        {
          company: 'Keio University SFC',
          type: 'Innovation Lab Partnership',
          opportunity: '¥5M + student startup incubation',
          status: 'Pilot Project',
          contact: 'Hideyuki Tanaka - Professor',
          nextAction: 'Expand research collaboration',
          priority: 'Medium',
          timeline: 'Q3 2026',
          strategicValue: 'Local innovation ecosystem and talent'
        }
      ]
    }
  };

  const outreachTemplates = {
    strategic: {
      subject: 'University of Tokyo Research: 30.2% Transportation Efficiency Breakthrough',
      template: `Dear [Name],

I'm Tatsuru Kikuchi, researcher at the University of Tokyo Faculty of Economics, reaching out regarding our breakthrough AI transportation optimization research.

Our recent study demonstrated 30.2% revenue improvements for taxi operations through weather-intelligent AI positioning - the first academic validation of this correlation in transportation.

Key Partnership Opportunity:
• Patent-pending weather-AI integration technology
• 94.7% prediction accuracy (vs 67% industry average)  
• ¥2.7B addressable market in Tokyo alone
• Ready for immediate commercial deployment

I'd welcome the opportunity to present our research findings and discuss strategic partnership opportunities that could position [Company] at the forefront of AI-driven transportation innovation.

Best regards,
Tatsuru Kikuchi
Faculty of Economics, University of Tokyo
📧 tatsuru.kikuchi@gmail.com | 📱 +81-80-3641-9973`
    },
    investment: {
      subject: 'Series A Opportunity: AI Transportation with 30.2% Proven ROI',
      template: `Dear [Name],

I'm seeking Series A investors for Tokyo Taxi AI Optimizer, a University of Tokyo research-validated transportation AI with proven 30.2% revenue improvements.

Investment Highlights:
• ¥50M Series A for ¥2.7B market opportunity
• Academic research validation reduces technology risk
• Clear path to ¥400M revenue by 2029
• Multiple exit opportunities with 10x+ potential

Our weather-intelligent AI represents the first commercially viable academic breakthrough in transportation optimization, with patent-pending technology and government data partnerships.

I'd appreciate the opportunity to present our investor deck and discuss how this fits your portfolio strategy.

Best regards,
Tatsuru Kikuchi`
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setOutreachMetrics(prev => ({
        ...prev,
        totalProspects: prev.totalProspects + Math.floor(Math.random() * 2),
        activeDiscussions: prev.activeDiscussions + Math.floor((Math.random() - 0.7) * 2),
        revenueOpportunity: prev.revenueOpportunity + (Math.random() - 0.5) * 0.1
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="partnership-outreach">
      <div className="outreach-header">
        <h1>🤝 Strategic Partnership Outreach</h1>
        <div className="outreach-metrics">
          <div className="metric">
            <span className="value">{outreachMetrics.totalProspects}</span>
            <span className="label">Total Prospects</span>
          </div>
          <div className="metric">
            <span className="value">{outreachMetrics.activeDiscussions}</span>
            <span className="label">Active Discussions</span>
          </div>
          <div className="metric">
            <span className="value">{outreachMetrics.signedLOIs}</span>
            <span className="label">Signed LOIs</span>
          </div>
          <div className="metric">
            <span className="value">¥{outreachMetrics.revenueOpportunity.toFixed(1)}B</span>
            <span className="label">Revenue Opportunity</span>
          </div>
        </div>
      </div>

      <div className="partner-type-tabs">
        {Object.keys(partnershipOpportunities).map((type) => (
          <button
            key={type}
            className={`partner-tab ${activePartnerType === type ? 'active' : ''}`}
            onClick={() => setActivePartnerType(type)}
          >
            {partnershipOpportunities[type].icon} {partnershipOpportunities[type].title}
          </button>
        ))}
      </div>

      <div className="partnership-content">
        <div className="partner-type-overview">
          <h2>{partnershipOpportunities[activePartnerType].title}</h2>
          <p>{partnershipOpportunities[activePartnerType].description}</p>
        </div>

        <div className="prospects-pipeline">
          <h3>Partnership Pipeline</h3>
          <div className="prospects-grid">
            {partnershipOpportunities[activePartnerType].prospects.map((prospect, index) => (
              <div key={index} className={`prospect-card ${prospect.priority.toLowerCase()}`}>
                <div className="prospect-header">
                  <h4>{prospect.company}</h4>
                  <span className={`status-badge ${prospect.status.toLowerCase().replace(' ', '-')}`}>
                    {prospect.status}
                  </span>
                </div>
                
                <div className="prospect-details">
                  <div className="partnership-type">
                    <strong>Type:</strong> {prospect.type}
                  </div>
                  <div className="opportunity-value">
                    <strong>Opportunity:</strong> {prospect.opportunity}
                  </div>
                  <div className="contact-info">
                    <strong>Contact:</strong> {prospect.contact}
                  </div>
                  <div className="next-action">
                    <strong>Next Action:</strong> {prospect.nextAction}
                  </div>
                  <div className="timeline">
                    <strong>Timeline:</strong> {prospect.timeline}
                  </div>
                </div>
                
                <div className="strategic-value">
                  <strong>Strategic Value:</strong>
                  <p>{prospect.strategicValue}</p>
                </div>
                
                <div className="prospect-actions">
                  <button className="action-btn primary">📧 Send Follow-up</button>
                  <button className="action-btn secondary">📅 Schedule Meeting</button>
                  <button className="action-btn tertiary">📋 Update Status</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="outreach-templates">
          <h3>Outreach Templates</h3>
          <div className="template-selector">
            <button className="template-btn">Strategic Partnerships</button>
            <button className="template-btn">Investment Opportunities</button>
            <button className="template-btn">Academic Collaborations</button>
          </div>
          
          <div className="template-content">
            <div className="template-card">
              <h4>Strategic Partnership Outreach</h4>
              <div className="template-subject">
                <strong>Subject:</strong> {outreachTemplates.strategic.subject}
              </div>
              <div className="template-body">
                <pre>{outreachTemplates.strategic.template}</pre>
              </div>
              <div className="template-actions">
                <button className="template-action">📋 Copy Template</button>
                <button className="template-action">✏️ Customize</button>
                <button className="template-action">📧 Send Now</button>
              </div>
            </div>
          </div>
        </div>

        <div className="partnership-strategy">
          <h3>Partnership Strategy Framework</h3>
          <div className="strategy-grid">
            <div className="strategy-card">
              <h4>🎯 Target Identification</h4>
              <ul>
                <li>Companies with AI/transportation focus</li>
                <li>Organizations seeking innovation partnerships</li>
                <li>Investors with Japanese market expertise</li>
                <li>Academic institutions with AI research</li>
              </ul>
            </div>
            <div className="strategy-card">
              <h4>💼 Value Proposition</h4>
              <ul>
                <li>University research validation reduces risk</li>
                <li>Patent-pending technology creates moats</li>
                <li>Proven 30.2% ROI with academic backing</li>
                <li>First-mover advantage in weather-AI integration</li>
              </ul>
            </div>
            <div className="strategy-card">
              <h4>🤝 Engagement Process</h4>
              <ul>
                <li>Research-first approach with academic credibility</li>
                <li>Executive-level presentations with data</li>
                <li>Pilot program opportunities for validation</li>
                <li>Strategic partnership structuring</li>
              </ul>
            </div>
            <div className="strategy-card">
              <h4>📈 Success Metrics</h4>
              <ul>
                <li>Partnership agreements signed per quarter</li>
                <li>Revenue pipeline generated from partnerships</li>
                <li>Strategic value creation beyond revenue</li>
                <li>Market validation and credibility building</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="immediate-actions">
        <h2>🚀 Immediate Action Items</h2>
        <div className="action-checklist">
          <div className="action-item priority-high">
            <input type="checkbox" defaultChecked />
            <span>Send SoftBank Vision Fund investment presentation</span>
            <span className="deadline">Due: This Week</span>
          </div>
          <div className="action-item priority-high">
            <input type="checkbox" />
            <span>Schedule Japan Taxi pilot program expansion meeting</span>
            <span className="deadline">Due: Next Week</span>
          </div>
          <div className="action-item priority-medium">
            <input type="checkbox" />
            <span>Submit Tokyo Metropolitan Government smart city proposal</span>
            <span className="deadline">Due: End of Month</span>
          </div>
          <div className="action-item priority-medium">
            <input type="checkbox" />
            <span>Finalize MIT CSAIL research collaboration MOU</span>
            <span className="deadline">Due: Q4 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnershipOutreach;