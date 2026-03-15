
import SectionHeader from "@/components/SectionHeader";
import ProjectCard from "@/components/ProjectCard";

const categories = [
  {
    label: "WEB PLATFORMS",
    projects: [
      { title: "DataVault Platform", description: "Enterprise data management system with real-time sync and RBAC for 2M+ records.", tags: ["React", "Node.js", "PostgreSQL"], year: "2025" },
      { title: "InvenTrack Dashboard", description: "Real-time inventory management platform for multi-warehouse logistics operations.", tags: ["Next.js", "GraphQL", "Redis"], year: "2024" },
    ],
  },
  {
    label: "BACKEND SYSTEMS",
    projects: [
      { title: "FlowSync API", description: "High-throughput API gateway processing 50K req/min with automatic failover.", tags: ["TypeScript", "Redis", "Docker"], year: "2025" },
      { title: "AuthCore Engine", description: "Multi-tenant authentication service with OAuth2, SAML, and MFA support.", tags: ["Go", "PostgreSQL", "JWT"], year: "2024" },
    ],
  },
  {
    label: "AUTOMATION TOOLS",
    projects: [
      { title: "DeployBot", description: "CI/CD automation tool reducing deployment time by 80% across 15 microservices.", tags: ["GitHub Actions", "Docker", "Bash"], year: "2025" },
      { title: "DataPipe ETL", description: "Automated data pipeline processing 10GB daily across 8 data sources.", tags: ["Python", "Airflow", "BigQuery"], year: "2024" },
    ],
  },
  {
    label: "API INTEGRATIONS",
    projects: [
      { title: "PayBridge", description: "Unified payment gateway integrating Stripe, PayPal, and regional providers.", tags: ["Node.js", "Stripe API", "Webhooks"], year: "2025" },
    ],
  },
  {
    label: "SOFTWARE SOLUTIONS",
    projects: [
      { title: "TaskForge Extension", description: "Chrome extension automating project management across 12 platforms.", tags: ["Chrome API", "React", "WebSocket"], year: "2024" },
      { title: "SecureVault", description: "End-to-end encrypted document management system for legal firms.", tags: ["React", "AES-256", "AWS S3"], year: "2024" },
    ],
  },
];

const Work = () => (
  <>
    <div className="container py-24 md:py-32">
      <SectionHeader index="00" label="ALL WORK" title="Projects & Systems" description="A selection of systems engineered for performance, reliability, and scale." />
      {categories.map((cat, ci) => (
        <div key={cat.label} className="mb-20 last:mb-0">
          <span className="font-mono-label text-xs text-muted-foreground uppercase tracking-widest mb-8 block">{String(ci + 1).padStart(2, "0")} // {cat.label}</span>
          <div className="grid md:grid-cols-2 gap-6">
            {cat.projects.map((p) => (
              <ProjectCard key={p.title} {...p} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </>
);

export default Work;
