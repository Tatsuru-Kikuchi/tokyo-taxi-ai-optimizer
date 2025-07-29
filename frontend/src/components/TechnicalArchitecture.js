import React, { useState, useEffect } from 'react';
import './TechnicalArchitecture.css';

const TechnicalArchitecture = () => {
  const [activeArchitecture, setActiveArchitecture] = useState('ai-engine');
  const [systemMetrics, setSystemMetrics] = useState({
    uptime: 99.97,
    throughput: 127834,
    latency: 12.3,
    activeConnections: 4567
  });

  const architectureComponents = {
    'ai-engine': {
      title: 'AI Processing Engine',
      icon: '🧠',
      description: 'Core artificial intelligence processing system with advanced neural networks',
      components: [
        {
          name: 'Weather Intelligence Processor',
          type: 'Neural Network',
          technology: 'LSTM + Transformer Architecture',
          performance: '96.3% accuracy, 50ms latency',
          scalability: 'Horizontal scaling to 100K+ requests/second',
          specifications: {
            model: 'Custom Weather-Transport Correlation Model',
            training: '3+ years Tokyo meteorological data',
            parameters: '2.4B neural network parameters',
            memory: '16GB GPU memory requirement',
            processing: 'Real-time inference with batch optimization'
          },
          dataFlow: [
            'JMA weather API → Data normalization → Feature extraction',
            'Historical correlation analysis → Pattern recognition',
            'Real-time prediction → Confidence scoring → Output delivery'
          ],
          apiEndpoints: [
            'POST /ai/weather/predict - Weather demand prediction',
            'GET /ai/weather/correlation - Historical correlation data',
            'POST /ai/weather/batch - Batch prediction processing'
          ]
        },
        {
          name: 'Traffic Prediction System',
          type: 'Graph Neural Network',
          technology: 'Spatio-Temporal GNN + Attention Mechanisms',
          performance: '93.8% accuracy, 30ms latency',
          scalability: 'Real-time processing for entire Tokyo metro area',
          specifications: {
            model: 'Graph-based Traffic Flow Prediction',
            training: 'ODPT real-time traffic data + historical patterns',
            parameters: '1.8B graph neural network parameters',
            memory: '12GB GPU memory requirement',
            processing: 'Continuous learning with online adaptation'
          },
          dataFlow: [
            'ODPT API → Traffic graph construction → Node feature extraction',
            'Temporal pattern analysis → Spatial correlation mapping',
            'Real-time prediction → Route optimization → Driver recommendations'
          ],
          apiEndpoints: [
            'POST /ai/traffic/predict - Traffic condition prediction',
            'GET /ai/traffic/routes - Optimal route suggestions',
            'POST /ai/traffic/analyze - Traffic pattern analysis'
          ]
        },
        {
          name: 'Behavioral Analytics Engine',
          type: 'Deep Reinforcement Learning',
          technology: 'Multi-Agent RL + Behavioral Clustering',
          performance: '91.2% pattern recognition accuracy',
          scalability: 'Handles 100K+ concurrent user profiles',
          specifications: {
            model: 'Multi-Agent Behavioral Prediction Model',
            training: 'Anonymized passenger behavior patterns',
            parameters: '1.2B reinforcement learning parameters',
            memory: '8GB GPU memory requirement',
            processing: 'Continuous learning from user interactions'
          },
          dataFlow: [
            'User interaction data → Behavior vectorization → Pattern clustering',
            'Preference learning → Demand prediction → Personalization',
            'Real-time adaptation → User experience optimization'
          ],
          apiEndpoints: [
            'POST /ai/behavior/analyze - User behavior analysis',
            'GET /ai/behavior/predict - Demand prediction based on behavior',
            'POST /ai/behavior/learn - Continuous learning updates'
          ]
        }
      ]
    },
    'data-infrastructure': {
      title: 'Data Infrastructure',
      icon: '🗄️',
      description: 'Scalable data processing and storage infrastructure for real-time operations',
      components: [
        {
          name: 'Real-Time Data Pipeline',
          type: 'Streaming Architecture',
          technology: 'Apache Kafka + Apache Flink + Redis',
          performance: '1M+ events/second processing capacity',
          scalability: 'Auto-scaling based on traffic load',
          specifications: {
            streaming: 'Kafka clusters with 99.9% uptime SLA',
            processing: 'Flink for real-time stream processing',
            caching: 'Redis clusters for sub-millisecond data access',
            storage: 'Time-series database for historical analytics',
            backup: 'Multi-region replication with 3-2-1 backup strategy'
          },
          dataFlow: [
            'External APIs → Kafka ingestion → Data validation',
            'Flink processing → Real-time analytics → Cache updates',
            'Historical storage → Batch analytics → ML training updates'
          ],
          apiEndpoints: [
            'POST /data/ingest - Real-time data ingestion',
            'GET /data/stream - Live data streaming',
            'POST /data/batch - Batch data processing'
          ]
        },
        {
          name: 'Multi-Source Data Integration',
          type: 'ETL/ELT Pipeline',
          technology: 'Apache Airflow + Kubernetes + MongoDB',
          performance: 'Process 50TB+ daily data volume',
          scalability: 'Kubernetes auto-scaling for peak loads',
          specifications: {
            orchestration: 'Airflow DAGs for complex data workflows',
            storage: 'MongoDB clusters for flexible document storage',
            compute: 'Kubernetes pods for distributed processing',
            monitoring: 'Comprehensive data quality monitoring',
            governance: 'Data lineage tracking and compliance'
          },
          dataFlow: [
            'Weather APIs + Traffic APIs + Government data → Ingestion',
            'Data cleansing → Transformation → Quality validation',
            'Unified data model → Analytics-ready datasets'
          ],
          apiEndpoints: [
            'POST /data/sources/weather - Weather data integration',
            'POST /data/sources/traffic - Traffic data integration',
            'GET /data/quality - Data quality metrics'
          ]
        }
      ]
    },
    'cloud-infrastructure': {
      title: 'Cloud Infrastructure',
      icon: '☁️',
      description: 'Enterprise-grade cloud infrastructure with global scalability',
      components: [
        {
          name: 'Multi-Cloud Architecture',
          type: 'Hybrid Cloud',
          technology: 'AWS + Azure + Google Cloud + Edge Computing',
          performance: '99.99% uptime SLA across all regions',
          scalability: 'Global auto-scaling with edge optimization',
          specifications: {
            primary: 'AWS for core AI processing and data storage',
            secondary: 'Azure for enterprise integrations and analytics',
            tertiary: 'Google Cloud for ML training and research',
            edge: 'Edge computing nodes in major cities for low latency',
            networking: 'Global CDN with intelligent routing'
          },
          dataFlow: [
            'User requests → Global load balancer → Regional edge nodes',
            'Edge processing → Core cloud services → Response optimization',
            'Multi-region backup → Disaster recovery protocols'
          ],
          apiEndpoints: [
            'GET /infrastructure/health - System health monitoring',
            'POST /infrastructure/scale - Manual scaling triggers',
            'GET /infrastructure/metrics - Performance metrics'
          ]
        },
        {
          name: 'Kubernetes Orchestration',
          type: 'Container Orchestration',
          technology: 'Kubernetes + Istio Service Mesh + Prometheus',
          performance: 'Auto-scaling from 10 to 10,000+ pods',
          scalability: 'Multi-cluster deployment across regions',
          specifications: {
            orchestration: 'Kubernetes 1.28+ with custom operators',
            serviceMesh: 'Istio for traffic management and security',
            monitoring: 'Prometheus + Grafana for comprehensive monitoring',
            security: 'Network policies and RBAC for isolation',
            deployment: 'GitOps with ArgoCD for automated deployments'
          },
          dataFlow: [
            'Code commits → CI/CD pipeline → Container builds',
            'Automated testing → Staging deployment → Production rollout',
            'Health monitoring → Auto-scaling → Performance optimization'
          ],
          apiEndpoints: [
            'GET /k8s/clusters - Cluster status and health',
            'POST /k8s/deploy - Application deployment',
            'GET /k8s/metrics - Resource utilization metrics'
          ]
        }
      ]
    },
    'security-compliance': {
      title: 'Security & Compliance',
      icon: '🔒',
      description: 'Enterprise-grade security and regulatory compliance framework',
      components: [
        {
          name: 'Zero Trust Security Architecture',
          type: 'Security Framework',
          technology: 'OAuth 2.0 + JWT + mTLS + Zero Trust Network',
          performance: 'Sub-100ms authentication and authorization',
          scalability: 'Handles 1M+ concurrent authenticated sessions',
          specifications: {
            authentication: 'Multi-factor authentication with biometrics',
            authorization: 'Role-based access control with fine-grained permissions',
            encryption: 'AES-256 encryption at rest and in transit',
            network: 'Zero trust network with micro-segmentation',
            monitoring: '24/7 SOC with AI-powered threat detection'
          },
          dataFlow: [
            'User authentication → Token validation → Permission checks',
            'Request authorization → Resource access → Audit logging',
            'Continuous monitoring → Threat detection → Incident response'
          ],
          apiEndpoints: [
            'POST /auth/login - User authentication',
            'POST /auth/refresh - Token refresh',
            'GET /auth/permissions - User permissions'
          ]
        },
        {
          name: 'Data Privacy & Compliance',
          type: 'Compliance Framework',
          technology: 'GDPR + CCPA + Personal Data Protection + SOC 2',
          performance: 'Real-time privacy compliance validation',
          scalability: 'Global compliance across all jurisdictions',
          specifications: {
            privacy: 'Data minimization and purpose limitation',
            consent: 'Granular consent management system',
            retention: 'Automated data retention and deletion',
            rights: 'Data subject rights management portal',
            auditing: 'Comprehensive audit trails and reporting'
          },
          dataFlow: [
            'Data collection → Consent validation → Purpose verification',
            'Data processing → Privacy impact assessment → Compliance check',
            'Data retention → Automated deletion → Audit reporting'
          ],
          apiEndpoints: [
            'POST /privacy/consent - Consent management',
            'GET /privacy/data - Personal data retrieval',
            'DELETE /privacy/data - Data deletion requests'
          ]
        }
      ]
    },
    'integration-apis': {
      title: 'Integration APIs',
      icon: '🔗',
      description: 'Comprehensive API ecosystem for seamless third-party integrations',
      components: [
        {
          name: 'Partner Integration Platform',
          type: 'API Gateway',
          technology: 'Kong Gateway + GraphQL + OpenAPI 3.0',
          performance: '10K+ requests/second per endpoint',
          scalability: 'Auto-scaling API gateway clusters',
          specifications: {
            gateway: 'Kong API Gateway with rate limiting and authentication',
            protocols: 'REST, GraphQL, and WebSocket support',
            documentation: 'Interactive OpenAPI documentation',
            testing: 'Automated API testing and validation',
            versioning: 'Semantic versioning with backward compatibility'
          },
          dataFlow: [
            'Partner requests → API gateway → Authentication & rate limiting',
            'Request routing → Service processing → Response transformation',
            'Analytics collection → Usage monitoring → Billing integration'
          ],
          apiEndpoints: [
            'GET /api/docs - API documentation',
            'POST /api/partners/register - Partner registration',
            'GET /api/usage - API usage analytics'
          ]
        },
        {
          name: 'Government Data Integrations',
          type: 'Official Data Connectors',
          technology: 'ODPT API + JMA API + Custom Government Connectors',
          performance: 'Real-time data synchronization',
          scalability: 'Handles all Tokyo metropolitan data sources',
          specifications: {
            odpt: 'Real-time Tokyo transportation data integration',
            jma: 'Japan Meteorological Agency weather data',
            government: 'Municipal traffic and planning data',
            compliance: 'Government data usage compliance',
            reliability: '99.9% data availability SLA'
          },
          dataFlow: [
            'Government APIs → Data validation → Normalization',
            'Real-time processing → Quality assurance → System integration',
            'Analytics processing → Insights generation → Decision support'
          ],
          apiEndpoints: [
            'GET /gov/odpt/realtime - Real-time ODPT data',
            'GET /gov/jma/weather - JMA weather data',
            'GET /gov/traffic/municipal - Municipal traffic data'
          ]
        }
      ]
    }
  };

  const performanceMetrics = {
    systemReliability: {
      uptime: '99.97%',
      mtbf: '8,760 hours',
      mttr: '4.2 minutes',
      availability: '99.99% SLA'
    },
    processingCapacity: {
      requests: '127,834/second peak',
      latency: '12.3ms average',
      throughput: '50TB/day data processing',
      concurrent: '100K+ simultaneous users'
    },
    scalabilityMetrics: {
      autoScaling: '10x capacity in under 2 minutes',
      globalRegions: '15 deployment regions',
      edgeNodes: '47 edge computing locations',
      redundancy: '3x redundancy across all systems'
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        ...prev,
        uptime: Math.min(prev.uptime + (Math.random() - 0.1) * 0.01, 99.99),
        throughput: prev.throughput + Math.floor((Math.random() - 0.5) * 1000),
        latency: Math.max(prev.latency + (Math.random() - 0.5) * 2, 8),
        activeConnections: prev.activeConnections + Math.floor((Math.random() - 0.5) * 100)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="technical-architecture">
      <div className="architecture-header">
        <h1>⚙️ Technical Architecture</h1>
        <div className="system-metrics">
          <div className="metric">
            <span className="value">{systemMetrics.uptime.toFixed(2)}%</span>
            <span className="label">System Uptime</span>
          </div>
          <div className="metric">
            <span className="value">{systemMetrics.throughput.toLocaleString()}</span>
            <span className="label">Requests/Second</span>
          </div>
          <div className="metric">
            <span className="value">{systemMetrics.latency.toFixed(1)}ms</span>
            <span className="label">Average Latency</span>
          </div>
          <div className="metric">
            <span className="value">{systemMetrics.activeConnections.toLocaleString()}</span>
            <span className="label">Active Connections</span>
          </div>
        </div>
      </div>

      <div className="architecture-tabs">
        {Object.keys(architectureComponents).map((arch) => (
          <button
            key={arch}
            className={`arch-tab ${activeArchitecture === arch ? 'active' : ''}`}
            onClick={() => setActiveArchitecture(arch)}
          >
            {architectureComponents[arch].icon} {architectureComponents[arch].title}
          </button>
        ))}
      </div>

      <div className="architecture-content">
        <div className="architecture-overview">
          <h2>{architectureComponents[activeArchitecture].title}</h2>
          <p>{architectureComponents[activeArchitecture].description}</p>
        </div>

        <div className="components-grid">
          {architectureComponents[activeArchitecture].components.map((component, index) => (
            <div key={index} className="component-card">
              <div className="component-header">
                <h3>{component.name}</h3>
                <div className="component-type">{component.type}</div>
              </div>
              
              <div className="component-overview">
                <div className="tech-stack">
                  <strong>Technology:</strong> {component.technology}
                </div>
                <div className="performance">
                  <strong>Performance:</strong> {component.performance}
                </div>
                <div className="scalability">
                  <strong>Scalability:</strong> {component.scalability}
                </div>
              </div>

              <div className="technical-specifications">
                <h4>Technical Specifications</h4>
                <div className="specs-grid">
                  {Object.entries(component.specifications).map(([key, value], i) => (
                    <div key={i} className="spec-item">
                      <span className="spec-key">{key}:</span>
                      <span className="spec-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {component.dataFlow && (
                <div className="data-flow">
                  <h4>Data Flow</h4>
                  <div className="flow-steps">
                    {component.dataFlow.map((step, i) => (
                      <div key={i} className="flow-step">
                        <span className="step-number">{i + 1}</span>
                        <span className="step-description">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {component.apiEndpoints && (
                <div className="api-endpoints">
                  <h4>API Endpoints</h4>
                  <div className="endpoints-list">
                    {component.apiEndpoints.map((endpoint, i) => (
                      <div key={i} className="endpoint-item">
                        <code>{endpoint}</code>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="performance-dashboard">
        <h2>📊 Performance Dashboard</h2>
        <div className="performance-categories">
          <div className="performance-category">
            <h3>System Reliability</h3>
            <div className="metrics-grid">
              {Object.entries(performanceMetrics.systemReliability).map(([key, value], index) => (
                <div key={index} className="performance-metric">
                  <span className="metric-label">{key.toUpperCase()}:</span>
                  <span className="metric-value">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="performance-category">
            <h3>Processing Capacity</h3>
            <div className="metrics-grid">
              {Object.entries(performanceMetrics.processingCapacity).map(([key, value], index) => (
                <div key={index} className="performance-metric">
                  <span className="metric-label">{key.toUpperCase()}:</span>
                  <span className="metric-value">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="performance-category">
            <h3>Scalability Metrics</h3>
            <div className="metrics-grid">
              {Object.entries(performanceMetrics.scalabilityMetrics).map(([key, value], index) => (
                <div key={index} className="performance-metric">
                  <span className="metric-label">{key.toUpperCase()}:</span>
                  <span className="metric-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="architecture-diagram">
        <h2>🏗️ System Architecture Diagram</h2>
        <div className="diagram-container">
          <div className="architecture-layers">
            <div className="layer user-layer">
              <h3>User Layer</h3>
              <div className="layer-components">
                <div className="component">Mobile Apps</div>
                <div className="component">Web Dashboard</div>
                <div className="component">API Clients</div>
              </div>
            </div>
            
            <div className="layer gateway-layer">
              <h3>API Gateway</h3>
              <div className="layer-components">
                <div className="component">Load Balancer</div>
                <div className="component">Authentication</div>
                <div className="component">Rate Limiting</div>
              </div>
            </div>
            
            <div className="layer services-layer">
              <h3>Microservices</h3>
              <div className="layer-components">
                <div className="component">AI Engine</div>
                <div className="component">User Service</div>
                <div className="component">Analytics</div>
                <div className="component">Notifications</div>
              </div>
            </div>
            
            <div className="layer data-layer">
              <h3>Data Layer</h3>
              <div className="layer-components">
                <div className="component">MongoDB</div>
                <div className="component">Redis Cache</div>
                <div className="component">Time-Series DB</div>
                <div className="component">Data Lake</div>
              </div>
            </div>
            
            <div className="layer external-layer">
              <h3>External APIs</h3>
              <div className="layer-components">
                <div className="component">Weather API</div>
                <div className="component">ODPT Traffic</div>
                <div className="component">Government Data</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="technology-stack">
        <h2>💻 Technology Stack</h2>
        <div className="stack-categories">
          <div className="stack-category">
            <h3>Frontend Technologies</h3>
            <div className="tech-list">
              <span className="tech-item">React 18+ with Hooks</span>
              <span className="tech-item">TypeScript for type safety</span>
              <span className="tech-item">Material-UI components</span>
              <span className="tech-item">Progressive Web App (PWA)</span>
              <span className="tech-item">WebSocket real-time updates</span>
            </div>
          </div>
          
          <div className="stack-category">
            <h3>Backend Technologies</h3>
            <div className="tech-list">
              <span className="tech-item">Node.js + Express.js</span>
              <span className="tech-item">Python + FastAPI for AI</span>
              <span className="tech-item">Go for high-performance services</span>
              <span className="tech-item">GraphQL + REST APIs</span>
              <span className="tech-item">gRPC for internal communication</span>
            </div>
          </div>
          
          <div className="stack-category">
            <h3>AI/ML Technologies</h3>
            <div className="tech-list">
              <span className="tech-item">TensorFlow + PyTorch</span>
              <span className="tech-item">NVIDIA CUDA + cuDNN</span>
              <span className="tech-item">Apache Spark for big data</span>
              <span className="tech-item">MLflow for model management</span>
              <span className="tech-item">Kubernetes for ML workflows</span>
            </div>
          </div>
          
          <div className="stack-category">
            <h3>Infrastructure</h3>
            <div className="tech-list">
              <span className="tech-item">Kubernetes + Docker</span>
              <span className="tech-item">Terraform for IaC</span>
              <span className="tech-item">Prometheus + Grafana</span>
              <span className="tech-item">ElasticSearch + Kibana</span>
              <span className="tech-item">Multi-cloud deployment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="development-practices">
        <h2>🔧 Development Practices</h2>
        <div className="practices-grid">
          <div className="practice-card">
            <h3>🔄 CI/CD Pipeline</h3>
            <ul>
              <li>GitOps workflow with ArgoCD</li>
              <li>Automated testing at every stage</li>
              <li>Blue-green deployments</li>
              <li>Canary releases for AI models</li>
              <li>Automated rollback mechanisms</li>
            </ul>
          </div>
          
          <div className="practice-card">
            <h3>🧪 Testing Strategy</h3>
            <ul>
              <li>Unit tests with 90%+ coverage</li>
              <li>Integration testing for APIs</li>
              <li>Load testing for scalability</li>
              <li>A/B testing for AI models</li>
              <li>Security penetration testing</li>
            </ul>
          </div>
          
          <div className="practice-card">
            <h3>📊 Monitoring & Observability</h3>
            <ul>
              <li>Real-time system monitoring</li>
              <li>Application performance monitoring</li>
              <li>AI model performance tracking</li>
              <li>Business metrics dashboard</li>
              <li>Alerting and incident response</li>
            </ul>
          </div>
          
          <div className="practice-card">
            <h3>🔐 Security Practices</h3>
            <ul>
              <li>Security by design principles</li>
              <li>Regular security audits</li>
              <li>Vulnerability scanning</li>
              <li>Compliance monitoring</li>
              <li>Incident response procedures</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalArchitecture;