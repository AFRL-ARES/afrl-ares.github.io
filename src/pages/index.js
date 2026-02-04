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
                <p>To get started with the ARES platform, clone the repository and install the dependencies:</p>
                <div style={{backgroundColor: '#2d2d2d', color: '#f8f8f2', padding: '15px', borderRadius: '6px', overflowX: 'auto'}}>
                    <pre style={{margin: 0, background: 'transparent'}}><code>git clone https://github.com/AFRL-ARES/ares-core.git{'\n'}cd ares-core{'\n'}./install.sh</code></pre>
                </div>
            </section>
        </div>
      </main>
    </Layout>
  );
}