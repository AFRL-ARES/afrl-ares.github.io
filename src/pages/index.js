import React, { useState } from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useColorMode } from '@docusaurus/theme-common';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';

function HomepageHeader() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <header style={{
      backgroundColor: isDark ? '#001a33' : '#f8f9fa',
      color: isDark ? 'white' : '#1c1e21',
      padding: '4rem 1rem',
      textAlign: 'center',
      borderBottom: `1px solid ${isDark ? '#003057' : '#e3e8ee'}`
    }}>
      <div className="container">
        <div style={{
          display: 'inline-block',
          padding: '0.25rem 0.85rem',
          borderRadius: '20px',
          backgroundColor: isDark ? 'rgba(0, 210, 255, 0.1)' : 'rgba(0, 82, 204, 0.1)',
          color: isDark ? '#00d2ff' : '#0052cc',
          fontSize: '0.85rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          fontFamily: 'var(--ifm-font-family-monospace)'
        }}>
          Open-Source Laboratory Orchestration Suite
        </div>

        <h1 className="hero__title" style={{ fontSize: '2.75rem', fontWeight: 800, lineHeight: 1.2 }}>
          Turn Your Hardware into an <span style={{ color: '#00d2ff' }}>Autonomous Smart Lab</span>
        </h1>

        <img 
          src={useBaseUrl(isDark ? 'img/ARESLogo.png' : 'img/BlackARESLogo.png')} 
          alt="AFRL-ARES Logo" 
          style={{ height: '120px', margin: '1.5rem 0' }} 
        />

        <p className="hero__subtitle" style={{ maxWidth: '800px', margin: '0 auto 2rem auto', fontSize: '1.2rem', opacity: 0.9 }}>
          An <span style={{ fontWeight: 'bold' }}>MIT-licensed</span> software ecosystem for self-driving laboratories, instrument orchestration, and AI-driven experimental planning. Developed by the <span style={{ fontWeight: 'bold' }}>Air Force Research Laboratory.</span>
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <Link className="button button--primary button--lg" href={useBaseUrl('/docs/launcher/intro')}>
            Get Started with ARES Launcher
          </Link>
          <Link className="button button--secondary button--lg" href="https://github.com/AFRL-ARES" target="_blank" rel="noopener noreferrer">
            Explore GitHub
          </Link>
        </div>
      </div>
    </header>
  );
}

function HomepageMain() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const accentColor = isDark ? '#00d2ff' : '#0052cc';

  return (
    <main>
      {/* Section 1: Smart Lab Value Proposition */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ color: '#00d2ff', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.85rem' }}>
              Modernize Your Research
            </span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '0.5rem' }}>From Isolated Instruments to an Autonomous Research System</h2>
            <p style={{ maxWidth: '750px', margin: '0 auto', opacity: 0.8 }}>
              Legacy labs rely on manual transfers and disconnected controllers. ARES OS 2.0 transforms standalone hardware into an integrated, digitalized lab ecosystem.
            </p>
          </div>

          <div className="row">
            <div className="col col--4 margin-bottom--lg">
              <div className="card" style={{ height: '100%', border: isDark ? '1px solid #003057' : '1px solid #e3e8ee' }}>
                <div className="card__header">
                  <h3>Universal Device Control</h3>
                </div>
                <div className="card__body">
                  <p>Integrate legacy sensors and modern hardware without the fear of proprietary software lock-in, streamlined by our Python library PyAres.</p>
                </div>
              </div>
            </div>

            <div className="col col--4 margin-bottom--lg">
              <div className="card" style={{ height: '100%', border: isDark ? '1px solid #003057' : '1px solid #e3e8ee' }}>
                <div className="card__header">
                  <h3>Autonomous Execution</h3>
                </div>
                <div className="card__body">
                  <p>Eliminate data collection bottlenecks with automated multi-step experimental runs designed for safe, closed-loop execution.</p>
                </div>
              </div>
            </div>

            <div className="col col--4 margin-bottom--lg">
              <div className="card" style={{ height: '100%', border: isDark ? '1px solid #003057' : '1px solid #e3e8ee' }}>
                <div className="card__header">
                  <h3>Centralized Data Management</h3>
                </div>
                <div className="card__body">
                  <p>Ingest, monitor, and archive raw experiment metrics automatically in real time across all connected laboratory modules.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Closed-Loop Autonomous Workflow */}
      <section style={{ 
        padding: '4rem 0', 
        backgroundColor: isDark ? 'rgba(0, 48, 87, 0.2)' : '#f0f4f8',
        borderTop: `1px solid ${isDark ? '#003057' : '#e3e8ee'}`,
        borderBottom: `1px solid ${isDark ? '#003057' : '#e3e8ee'}`
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ color: '#00d2ff', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.85rem' }}>
              Self-Driving Lab Capabilities
            </span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '0.5rem' }}>Power Closed-Loop Autonomous Experimentation</h2>
            <p style={{ maxWidth: '750px', margin: '0 auto', opacity: 0.8 }}>
              Pair physical instruments with machine learning planners and custom analysis routines to allow your experiments to self-optimize in real time.
            </p>
          </div>

          <div className="row text--center margin-bottom--lg">
            <div className="col col--4 margin-bottom--md">
              <div style={{ padding: '1.5rem', borderRadius: '8px', backgroundColor: isDark ? '#001a33' : 'white', border: `1px solid ${isDark ? '#003057' : '#ccc'}`, minHeight: '10rem' }}>
                <div style={{ fontSize: '0.8rem', fontFamily: 'monospace', opacity: 0.6 }}>01. AI PLANNING</div>
                <strong>Bayesian Optimization & ML</strong>
                <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.8 }}>Leverage leading AI and machine learning techniques to select your next optimal experimental parameters</div>
              </div>
            </div>

            <div className="col col--4 margin-bottom--md">
              <div style={{ padding: '1.5rem', borderRadius: '8px', backgroundColor: isDark ? '#001a33' : 'white', border: `1px solid ${isDark ? '#003057' : '#ccc'}`, minHeight: '10rem' }}>
                <div style={{ fontSize: '0.8rem', fontFamily: 'monospace', opacity: 0.6 }}>02. HARDWARE CONTROL</div>
                <strong>Physical Execution</strong>
                <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.8 }}>Execute commands across your scientific hardware to create your next sample</div>
              </div>
            </div>

            <div className="col col--4 margin-bottom--md">
              <div style={{ padding: '1.5rem', borderRadius: '8px', backgroundColor: isDark ? '#001a33' : 'white', border: `1px solid ${isDark ? '#003057' : '#ccc'}`, minHeight: '10rem' }}>
                <div style={{ fontSize: '0.8rem', fontFamily: 'monospace', opacity: 0.6 }}>03. EVALUATION</div>
                <strong>Custom Analysis</strong>
                <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.8, paddingBottom: '1rem' }}>Evaluate the results of the experiment to update your AI decision loop</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Tech Stack Breakdown */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2.2rem' }}>Modular Software Architecture</h2>
            <p style={{ opacity: 0.8 }}>Decoupled services engineered for high performance, language flexibility, and scale.</p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', maxWidth: '900px', margin: '0 auto', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${isDark ? '#003057' : '#e3e8ee'}` }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Component</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Technology</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Role in System</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'ARES Core', tech: 'ASP.NET Core / C#', role: 'Coordinates hardware, planners, and analyzers; orchestrates workflows and manages database interactions.' },
                  { name: 'ARES Datamodel', tech: 'gRPC & Protobuf', role: 'Fast, language-agnostic streaming across distributed lab devices packaged as a version controlled datamodel.' },
                  { name: 'PyAres', tech: 'Python', role: 'Lightweight Python interface for researchers to rapidly prototype devices, planners and analyzers.' },
                  { name: 'ARES UI', tech: 'Blazor Web UI', role: 'Web-based UI for real-time visual monitoring, device status, and manual overrides.' }
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: `1px solid ${isDark ? '#002244' : '#f0f0f0'}` }}>
                    <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>{row.name}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--ifm-font-family-monospace)', color: accentColor }}>{row.tech}</td>
                    <td style={{ padding: '12px 16px' }}>{row.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section 4: Quickstart & Launcher CTA */}
      <section style={{ 
        padding: '4rem 0', 
        backgroundColor: isDark ? '#001020' : '#f8f9fa', 
        borderTop: `1px solid ${isDark ? '#003057' : '#e3e8ee'}` 
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Ready to Automate Your Lab?</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 2rem auto', opacity: 0.8 }}>
            Set up ARES OS 2.0 in minutes using the official <strong>ARES Launcher</strong>, or clone the repository to start developing custom hardware drivers.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <Link className="button button--primary button--lg" href="../../docs/launcher/intro" target="_blank" rel="noopener noreferrer">
              Launch with ARES Launcher
            </Link>
            <Link className="button button--secondary button--lg" href="../../docs/ares/developer-setup" target="_blank" rel="noopener noreferrer">
              Explore the Architecture & Developer Setup Docs
            </Link>
            <Link className="button button--outline button--primary button--lg" href="https://arxiv.org/abs/2604.03440" target="_blank" rel="noopener noreferrer">
              Read the Paper
            </Link>
          </div>

          

          <div style={{ maxWidth: '650px', margin: '0 auto', textAlign: 'left' }}>
            <p style={{ marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Clone the Repository:</p>
            <div style={{ backgroundColor: '#1e1e1e', color: '#f8f8f2', padding: '12px 16px', borderRadius: '6px', overflowX: 'auto', fontFamily: 'monospace' }}>
              <pre style={{ margin: 0, background: 'transparent' }}><code>git clone https://github.com/AFRL-ARES/ARES.git</code></pre>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function Home() {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ARES OS 2.0",
    "alternateName": "AFRL-ARES Autonomous Research System",
    "operatingSystem": "Windows, Linux, macOS",
    "applicationCategory": "DeveloperApplication",
    "applicationSubCategory": "Self-Driving Lab Orchestration Framework",
    "downloadUrl": "https://afrl-ares.github.io/docs/launcher/intro/",
    "license": "MIT",
    "keywords": "ARES OS 2.0, smart lab, self-driving lab, PyAres, autonomous experimentation, laboratory automation, gRPC",
    "provider": {
      "@type": "GovernmentOrganization",
      "name": "Air Force Research Laboratory (AFRL)"
    },
    "description": "An open-source, modular software suite for self-driving laboratories, connecting lab hardware, Python (PyAres), and AI for closed-loop autonomous experimentation."
  };

  return (
    <Layout
      title={`ARES OS 2.0 | Autonomous Smart Lab Orchestration`}
      description="The open-source software framework for smart labs, closed-loop autonomous experimentation, and hardware orchestration. Built by AFRL.">
      
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Head>

      <HomepageHeader />
      <HomepageMain />
    </Layout>
  );
}