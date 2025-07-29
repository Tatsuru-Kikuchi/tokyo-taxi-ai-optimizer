import React, { useState, useEffect } from 'react';
import './RegulatorySuite.css';

const RegulatorySuite = () => {
  const [activeRegion, setActiveRegion] = useState('japan');
  const [complianceMetrics, setComplianceMetrics] = useState({
    totalCompliance: 94,
    activeSubmissions: 7,
    approvedMarkets: 3,
    pendingApprovals: 4
  });

  const regulatoryFramework = {
    japan: {
      title: 'Japan Regulatory Framework',
      icon: '🇯🇵',
      overallCompliance: '95%',
      description: 'Comprehensive compliance with Japanese transportation and AI regulations',
      keyRegulations: [
        {
          regulation: 'Personal Information Protection Act (PIPA)',
          status: 'Compliant',
          lastReview: '2025-07-15',
          nextReview: '2025-10-15',
          requirements: [
            'Data encryption and anonymization protocols',
            'User consent management systems',
            'Data retention and deletion policies',
            'Cross-border data transfer agreements'
          ],
          complianceActions: [
            'Implemented end-to-end encryption for all user data',
            'Deployed anonymization algorithms for analytics',
            'Established data governance committee',
            'Regular privacy impact assessments'
          ],
          riskLevel: 'Low',
          regulatoryContact: 'Personal Information Protection Commission'
        },
        {
          regulation: 'Road Transport Vehicle Act',
          status: 'Approved',
          lastReview: '2025-06-20',
          nextReview: '2025-12-20',
          requirements: [
            'Vehicle safety system integration',
            'Driver assistance technology standards',
            'Emergency response protocols',
            'Insurance and liability frameworks'
          ],
          complianceActions: [
            'Safety protocol integration with taxi systems',
            'Emergency response API development',
            'Insurance partnership agreements',
            'Driver safety training programs'
          ],
          riskLevel: 'Medium',
          regulatoryContact: 'Ministry of Land, Infrastructure, Transport and Tourism (MLIT)'
        },
        {
          regulation: 'AI Ethics Guidelines',
          status: 'Exemplary',
          lastReview: '2025-07-01',
          nextReview: '2025-09-01',
          requirements: [
            'Algorithmic transparency and explainability',
            'Bias detection and mitigation',
            'Human oversight and control',
            'Ethical AI development practices'
          ],
          complianceActions: [
            'Published AI transparency reports',
            'Implemented bias detection algorithms',
            'Established AI ethics committee',
            'Regular algorithmic audits'
          ],
          riskLevel: 'Low',
          regulatoryContact: 'AI Strategy Council'
        },
        {
          regulation: 'Cybersecurity Management Guidelines',
          status: 'Certified',
          lastReview: '2025-07-10',
          nextReview: '2025-10-10',
          requirements: [
            'Security incident response procedures',
            'Vulnerability assessment and penetration testing',
            'Employee security training',
            'Third-party security audits'
          ],
          complianceActions: [
            'ISO 27001 certification achieved',
            'Regular penetration testing',
            'Security awareness training programs',
            'Incident response team establishment'
          ],
          riskLevel: 'Low',
          regulatoryContact: 'National Center of Incident Readiness and Strategy for Cybersecurity (NISC)'
        }
      ]
    },
    korea: {
      title: 'South Korea Regulatory Framework',
      icon: '🇰🇷',
      overallCompliance: '78%',
      description: 'Preparation for Seoul market entry with Korean regulatory compliance',
      keyRegulations: [
        {
          regulation: 'Personal Information Protection Act (K-PIPA)',
          status: 'In Progress',
          lastReview: '2025-07-25',
          nextReview: '2025-09-25',
          requirements: [
            'Korean language privacy policies',
            'Local data residency requirements',
            'Korean Personal Information Protection Committee registration',
            'Cross-border data transfer notifications'
          ],
          complianceActions: [
            'Korean language legal documentation in progress',
            'Local data center partnership negotiations',
            'PIPC preliminary consultations',
            'Data localization assessment'
          ],
          riskLevel: 'Medium',
          regulatoryContact: 'Personal Information Protection Committee (PIPC)'
        },
        {
          regulation: 'Transportation Technology Innovation Act',
          status: 'Under Review',
          lastReview: '2025-07-20',
          nextReview: '2025-08-20',
          requirements: [
            'Transportation innovation sandbox participation',
            'Safety certification for AI systems',
            'Local partnership requirements',
            'Technology transfer agreements'
          ],
          complianceActions: [
            'Sandbox application submitted',
            'Safety documentation preparation',
            'Local partner identification (Kakao Mobility)',
            'Technology assessment with K-ICT'
          ],
          riskLevel: 'High',
          regulatoryContact: 'Ministry of Land, Infrastructure and Transport (MOLIT)'
        },
        {
          regulation: 'AI Industry Development Act',
          status: 'Preparing',
          lastReview: '2025-07-18',
          nextReview: '2025-08-18',
          requirements: [
            'AI system registration and certification',
            'Algorithm transparency requirements',
            'Local AI development partnerships',
            'Innovation hub participation'
          ],
          complianceActions: [
            'AI system documentation development',
            'Transparency framework design',
            'Seoul AI Hub partnership discussions',
            'Regulatory compliance roadmap'
          ],
          riskLevel: 'Medium',
          regulatoryContact: 'Korea Intelligence Information Society Agency (K-IISA)'
        }
      ]
    },
    singapore: {
      title: 'Singapore Regulatory Framework',
      icon: '🇸🇬',
      overallCompliance: '85%',
      description: 'Smart Nation compliance for Singapore market entry',
      keyRegulations: [
        {
          regulation: 'Personal Data Protection Act (PDPA)',
          status: 'Compliant',
          lastReview: '2025-07-12',
          nextReview: '2025-10-12',
          requirements: [
            'Data protection officer appointment',
            'Consent management systems',
            'Data breach notification procedures',
            'Data protection impact assessments'
          ],
          complianceActions: [
            'DPO appointed and certified',
            'Consent management platform deployed',
            'Breach notification protocols established',
            'DPIA framework implemented'
          ],
          riskLevel: 'Low',
          regulatoryContact: 'Personal Data Protection Commission (PDPC)'
        },
        {
          regulation: 'Smart Mobility 2030 Guidelines',
          status: 'Aligned',
          lastReview: '2025-07-08',
          nextReview: '2025-09-08',
          requirements: [
            'Smart mobility ecosystem integration',
            'Autonomous vehicle readiness',
            'Sustainable transportation metrics',
            'Innovation sandbox participation'
          ],
          complianceActions: [
            'Smart mobility partnership with LTA',
            'AV integration roadmap development',
            'Sustainability reporting framework',
            'Sandbox pilot program design'
          ],
          riskLevel: 'Low',
          regulatoryContact: 'Land Transport Authority (LTA)'
        },
        {
          regulation: 'Model AI Governance Framework',
          status: 'Exemplary',
          lastReview: '2025-07-05',
          nextReview: '2025-08-05',
          requirements: [
            'AI governance structure establishment',
            'Risk management frameworks',
            'Stakeholder engagement processes',
            'Continuous monitoring systems'
          ],
          complianceActions: [
            'AI governance committee established',
            'Risk assessment methodology deployed',
            'Stakeholder advisory board created',
            'Continuous monitoring dashboard'
          ],
          riskLevel: 'Low',
          regulatoryContact: 'Infocomm Media Development Authority (IMDA)'
        }
      ]
    },
    europe: {
      title: 'European Union Regulatory Framework',
      icon: '🇪🇺',
      overallCompliance: '72%',
      description: 'EU market preparation with GDPR and AI Act compliance',
      keyRegulations: [
        {
          regulation: 'General Data Protection Regulation (GDPR)',
          status: 'Preparing',
          lastReview: '2025-07-22',
          nextReview: '2025-08-22',
          requirements: [
            'EU representative appointment',
            'Data processing record maintenance',
            'Right to be forgotten implementation',
            'Privacy by design architecture'
          ],
          complianceActions: [
            'EU representative selection in progress',
            'Data processing inventory creation',
            'Data deletion system development',
            'Privacy-first system redesign'
          ],
          riskLevel: 'High',
          regulatoryContact: 'European Data Protection Board (EDPB)'
        },
        {
          regulation: 'AI Act (EU)',
          status: 'Monitoring',
          lastReview: '2025-07-15',
          nextReview: '2025-08-15',
          requirements: [
            'High-risk AI system classification',
            'Conformity assessment procedures',
            'Risk management systems',
            'Human oversight mechanisms'
          ],
          complianceActions: [
            'AI risk classification assessment',
            'Conformity assessment preparation',
            'Risk management framework design',
            'Human oversight protocol development'
          ],
          riskLevel: 'High',
          regulatoryContact: 'European Commission AI Office'
        }
      ]
    },
    usa: {
      title: 'United States Regulatory Framework',
      icon: '🇺🇸',
      overallCompliance: '68%',
      description: 'US market preparation with federal and state compliance',
      keyRegulations: [
        {
          regulation: 'California Consumer Privacy Act (CCPA)',
          status: 'Planning',
          lastReview: '2025-07-20',
          nextReview: '2025-08-20',
          requirements: [
            'Consumer rights implementation',
            'Data sale opt-out mechanisms',
            'Privacy policy updates',
            'Consumer request handling systems'
          ],
          complianceActions: [
            'Consumer rights framework design',
            'Opt-out system architecture',
            'Privacy policy drafting',
            'Request handling workflow'
          ],
          riskLevel: 'Medium',
          regulatoryContact: 'California Privacy Protection Agency (CPPA)'
        },
        {
          regulation: 'Federal Motor Vehicle Safety Standards',
          status: 'Research',
          lastReview: '2025-07-18',
          nextReview: '2025-08-18',
          requirements: [
            'Vehicle safety system integration',
            'Driver assistance technology standards',
            'Automated vehicle guidelines',
            'State-specific regulations'
          ],
          complianceActions: [
            'FMVSS requirements analysis',
            'State regulation mapping',
            'Safety standard gap analysis',
            'Compliance roadmap development'
          ],
          riskLevel: 'High',
          regulatoryContact: 'National Highway Traffic Safety Administration (NHTSA)'
        }
      ]
    }
  };

  const complianceAutomation = {
    monitoringSystems: [
      {
        system: 'Regulatory Change Detection',
        description: 'AI-powered monitoring of regulatory updates across all target markets',
        coverage: 'Global regulatory databases and government sources',
        alertFrequency: 'Real-time notifications',
        accuracy: '94%',
        integrations: ['Legal database APIs', 'Government notification systems', 'Industry alerts']
      },
      {
        system: 'Compliance Gap Analysis',
        description: 'Automated assessment of compliance gaps and remediation planning',
        coverage: 'All regulatory frameworks and requirements',
        alertFrequency: 'Weekly reports',
        accuracy: '91%',
        integrations: ['Internal compliance systems', 'Legal management tools', 'Risk assessment platforms']
      },
      {
        system: 'Documentation Management',
        description: 'Centralized compliance documentation and audit trail management',
        coverage: 'All compliance documents and certifications',
        alertFrequency: 'Document expiry alerts',
        accuracy: '98%',
        integrations: ['Document management systems', 'Certification tracking', 'Audit platforms']
      }
    ],
    riskAssessment: {
      high: [
        'EU AI Act compliance for high-risk AI systems',
        'US federal transportation safety standards',
        'Korean transportation innovation sandbox approval'
      ],
      medium: [
        'GDPR implementation for EU market entry',
        'Korean K-PIPA data localization requirements',
        'California CCPA consumer rights implementation'
      ],
      low: [
        'Japan AI ethics guidelines maintenance',
        'Singapore PDPA ongoing compliance',
        'Japan cybersecurity certification renewal'
      ]
    }
  };

  const legalStrategy = {
    legalTeam: [
      {
        role: 'Chief Legal Officer',
        name: 'Hiring in Progress',
        expertise: 'International regulatory compliance, transportation law',
        location: 'Tokyo',
        responsibilities: ['Legal strategy', 'Regulatory relationships', 'Risk management']
      },
      {
        role: 'Data Privacy Counsel',
        name: 'Yuki Tanaka',
        expertise: 'GDPR, CCPA, PDPA, data protection',
        location: 'Tokyo',
        responsibilities: ['Privacy compliance', 'Data governance', 'Cross-border transfers']
      },
      {
        role: 'AI Ethics & Compliance Manager',
        name: 'Dr. Sarah Chen',
        expertise: 'AI governance, algorithmic transparency',
        location: 'Remote',
        responsibilities: ['AI ethics', 'Algorithm audits', 'Transparency reporting']
      }
    ],
    externalCounsel: [
      {
        firm: 'Anderson Mori & Tomotsune',
        location: 'Tokyo',
        expertise: 'Japanese regulatory and corporate law',
        retainer: '¥2M annually',
        keyProjects: ['Regulatory approvals', 'Corporate structuring', 'IP protection']
      },
      {
        firm: 'Kim & Chang',
        location: 'Seoul',
        expertise: 'Korean transportation and technology law',
        retainer: '¥1.5M annually',
        keyProjects: ['Market entry', 'Regulatory sandbox', 'Local partnerships']
      },
      {
        firm: 'Rajah & Tann',
        location: 'Singapore',
        expertise: 'ASEAN regulatory and data protection',
        retainer: '¥1M annually',
        keyProjects: ['Smart Nation compliance', 'Regional expansion', 'Data governance']
      }
    ]
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setComplianceMetrics(prev => ({
        ...prev,
        totalCompliance: Math.min(prev.totalCompliance + (Math.random() - 0.3) * 0.5, 100),
        activeSubmissions: prev.activeSubmissions + Math.floor((Math.random() - 0.7) * 2),
        approvedMarkets: Math.min(prev.approvedMarkets + (Math.random() > 0.95 ? 1 : 0), 8),
        pendingApprovals: Math.max(prev.pendingApprovals + Math.floor((Math.random() - 0.6) * 2), 0)
      }));
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="regulatory-suite">
      <div className="regulatory-header">
        <h1>⚖️ Global Regulatory Compliance Suite</h1>
        <div className="compliance-metrics">
          <div className="metric">
            <span className="value">{complianceMetrics.totalCompliance.toFixed(1)}%</span>
            <span className="label">Overall Compliance</span>
          </div>
          <div className="metric">
            <span className="value">{complianceMetrics.activeSubmissions}</span>
            <span className="label">Active Submissions</span>
          </div>
          <div className="metric">
            <span className="value">{complianceMetrics.approvedMarkets}</span>
            <span className="label">Approved Markets</span>
          </div>
          <div className="metric">
            <span className="value">{complianceMetrics.pendingApprovals}</span>
            <span className="label">Pending Approvals</span>
          </div>
        </div>
      </div>

      <div className="region-tabs">
        {Object.keys(regulatoryFramework).map((region) => (
          <button
            key={region}
            className={`region-tab ${activeRegion === region ? 'active' : ''}`}
            onClick={() => setActiveRegion(region)}
          >
            {regulatoryFramework[region].icon} {regulatoryFramework[region].title}
            <span className="compliance-badge">{regulatoryFramework[region].overallCompliance}</span>
          </button>
        ))}
      </div>

      <div className="regulatory-content">
        <div className="region-overview">
          <h2>{regulatoryFramework[activeRegion].title}</h2>
          <p>{regulatoryFramework[activeRegion].description}</p>
          <div className="overall-compliance">
            Overall Compliance: {regulatoryFramework[activeRegion].overallCompliance}
          </div>
        </div>

        <div className="regulations-grid">
          {regulatoryFramework[activeRegion].keyRegulations.map((regulation, index) => (
            <div key={index} className="regulation-card">
              <div className="regulation-header">
                <h3>{regulation.regulation}</h3>
                <span className={`status-badge ${regulation.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {regulation.status}
                </span>
              </div>

              <div className="regulation-details">
                <div className="detail-row">
                  <span className="label">Last Review:</span>
                  <span className="value">{regulation.lastReview}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Next Review:</span>
                  <span className="value">{regulation.nextReview}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Risk Level:</span>
                  <span className={`risk-level ${regulation.riskLevel.toLowerCase()}`}>
                    {regulation.riskLevel}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Regulatory Contact:</span>
                  <span className="value">{regulation.regulatoryContact}</span>
                </div>
              </div>

              <div className="requirements-section">
                <h4>Key Requirements</h4>
                <ul>
                  {regulation.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="compliance-actions">
                <h4>Compliance Actions Taken</h4>
                <ul>
                  {regulation.complianceActions.map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="compliance-automation">
        <h2>🤖 Compliance Automation Systems</h2>
        
        <div className="monitoring-systems">
          <h3>Automated Monitoring & Compliance</h3>
          <div className="systems-grid">
            {complianceAutomation.monitoringSystems.map((system, index) => (
              <div key={index} className="system-card">
                <h4>{system.system}</h4>
                <p>{system.description}</p>
                
                <div className="system-details">
                  <div className="detail-item">
                    <strong>Coverage:</strong> {system.coverage}
                  </div>
                  <div className="detail-item">
                    <strong>Alert Frequency:</strong> {system.alertFrequency}
                  </div>
                  <div className="detail-item">
                    <strong>Accuracy:</strong> {system.accuracy}
                  </div>
                </div>

                <div className="integrations">
                  <strong>Integrations:</strong>
                  <ul>
                    {system.integrations.map((integration, i) => (
                      <li key={i}>{integration}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="risk-assessment">
          <h3>Regulatory Risk Assessment</h3>
          <div className="risk-categories">
            <div className="risk-category high">
              <h4>High Risk</h4>
              <ul>
                {complianceAutomation.riskAssessment.high.map((risk, i) => (
                  <li key={i}>{risk}</li>
                ))}
              </ul>
            </div>
            <div className="risk-category medium">
              <h4>Medium Risk</h4>
              <ul>
                {complianceAutomation.riskAssessment.medium.map((risk, i) => (
                  <li key={i}>{risk}</li>
                ))}
              </ul>
            </div>
            <div className="risk-category low">
              <h4>Low Risk</h4>
              <ul>
                {complianceAutomation.riskAssessment.low.map((risk, i) => (
                  <li key={i}>{risk}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="legal-strategy">
        <h2>👩‍⚖️ Legal Strategy & Team</h2>
        
        <div className="legal-team">
          <h3>Internal Legal Team</h3>
          <div className="team-grid">
            {legalStrategy.legalTeam.map((member, index) => (
              <div key={index} className="team-member-card">
                <h4>{member.role}</h4>
                <div className="member-name">{member.name}</div>
                <div className="member-details">
                  <div className="detail-row">
                    <span className="label">Expertise:</span>
                    <span className="value">{member.expertise}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Location:</span>
                    <span className="value">{member.location}</span>
                  </div>
                </div>
                <div className="responsibilities">
                  <strong>Responsibilities:</strong>
                  <ul>
                    {member.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="external-counsel">
          <h3>External Legal Counsel</h3>
          <div className="counsel-grid">
            {legalStrategy.externalCounsel.map((counsel, index) => (
              <div key={index} className="counsel-card">
                <h4>{counsel.firm}</h4>
                <div className="counsel-details">
                  <div className="detail-row">
                    <span className="label">Location:</span>
                    <span className="value">{counsel.location}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Expertise:</span>
                    <span className="value">{counsel.expertise}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Retainer:</span>
                    <span className="value">{counsel.retainer}</span>
                  </div>
                </div>
                <div className="key-projects">
                  <strong>Key Projects:</strong>
                  <ul>
                    {counsel.keyProjects.map((project, i) => (
                      <li key={i}>{project}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="compliance-roadmap">
        <h2>📋 Regulatory Compliance Roadmap</h2>
        <div className="roadmap-timeline">
          <div className="timeline-item">
            <div className="timeline-date">Q3 2025</div>
            <div className="timeline-content">
              <h4>Japan Market Compliance Completion</h4>
              <ul>
                <li>Complete all regulatory certifications</li>
                <li>Finalize government partnership agreements</li>
                <li>Achieve exemplary compliance status</li>
              </ul>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-date">Q4 2025</div>
            <div className="timeline-content">
              <h4>Korea & Singapore Regulatory Approval</h4>
              <ul>
                <li>Complete Korean sandbox approval process</li>
                <li>Finalize Singapore Smart Nation integration</li>
                <li>Launch market entry compliance</li>
              </ul>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-date">Q1 2026</div>
            <div className="timeline-content">
              <h4>EU Market Preparation</h4>
              <ul>
                <li>GDPR compliance implementation</li>
                <li>AI Act conformity assessment</li>
                <li>EU representative establishment</li>
              </ul>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-date">Q2 2026</div>
            <div className="timeline-content">
              <h4>US Market Regulatory Framework</h4>
              <ul>
                <li>CCPA compliance implementation</li>
                <li>Federal transportation standards alignment</li>
                <li>State-by-state regulatory mapping</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="compliance-advantages">
        <h2>🏆 Regulatory Competitive Advantages</h2>
        <div className="advantages-grid">
          <div className="advantage-card">
            <h3>🎓 Academic Validation</h3>
            <p>University research backing provides regulatory credibility and reduces compliance barriers</p>
          </div>
          <div className="advantage-card">
            <h3>🏛️ Government Partnerships</h3>
            <p>Direct relationships with transportation authorities facilitate regulatory approval</p>
          </div>
          <div className="advantage-card">
            <h3>🤖 Proactive AI Ethics</h3>
            <p>Leading AI transparency and ethics standards exceed regulatory requirements</p>
          </div>
          <div className="advantage-card">
            <h3>🔒 Privacy by Design</h3>
            <p>Built-in privacy protection architecture simplifies data protection compliance</p>
          </div>
          <div className="advantage-card">
            <h3>📊 Automated Compliance</h3>
            <p>AI-powered compliance monitoring ensures continuous regulatory alignment</p>
          </div>
          <div className="advantage-card">
            <h3>🌍 Global Framework</h3>
            <p>Standardized compliance architecture accelerates international expansion</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegulatorySuite;