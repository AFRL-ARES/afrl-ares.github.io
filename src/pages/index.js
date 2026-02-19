import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Home`}
      description="AFRL-ARES Organization Home">
      <header style={{backgroundColor: '#003057', color: 'white', padding: '4rem 0', textAlign: 'center'}}>
        <div className="container">
          <h1 className="hero__title">Welcome to AFRL-ARES</h1>
          <img src={useBaseUrl('img/ARESLogo.png')} alt="AFRL-ARES Logo" style={{height: '150px', margin: '1.5rem 0'}} />
          <p className="hero__subtitle">The central hub for the ARES ecosystem, providing tools for advanced research.</p>
        </div>
      </header>
      <main>
        <div className="container" style={{padding: '2rem 0'}}>
            <section>
                <h2>Quick Start</h2>
                <p style={{marginBottom: '1.5rem'}}>For users looking to get ARES set up in their lab, we recommend using the <strong>ARES Launcher</strong>. It's the easiest way to get started and handles installation and updates.</p>
                <div style={{marginBottom: '1rem'}}>
                  <a className="button button--primary" href="../../docs/launcher/intro" target="_blank" rel="noopener noreferrer">Learn about the ARES Launcher</a>
                </div>
                
                <p>Interested in looking at the code? Get started by cloning our GitHub repository:</p>
                <div style={{backgroundColor: '#2d2d2d', color: '#f8f8f2', padding: '15px', borderRadius: '6px', overflowX: 'auto'}}>
                    <pre style={{margin: 0, background: 'transparent'}}><code>git clone https://github.com/AFRL-ARES/ARES.git</code></pre>
                </div>
            </section>
        </div>
      </main>
    </Layout>
  );
}