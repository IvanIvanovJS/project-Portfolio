'use client';

import { GlassContainer } from '../components/ui/glass-container/GlassContainer';
import { GlassButton } from '../components/ui/glass-button/GlassButton';
import { useTheme } from '../hooks/useTheme';

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      <main
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-lg)',
          alignItems: 'center',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
          <h1
            style={{
              fontSize: 'var(--font-size-6xl)',
              fontWeight: '700',
              marginBottom: 'var(--spacing-4)',
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Portfolio Site
          </h1>
          <p
            style={{
              fontSize: 'var(--font-size-xl)',
              color: 'var(--fg-secondary)',
              maxWidth: '600px',
            }}
          >
            A modern portfolio with glassmorphism design, theme switching, and
            responsive components.
          </p>
        </div>

        {/* Theme Toggle */}
        <GlassContainer
          variant="card"
          style={{ padding: 'var(--spacing-md)', textAlign: 'center' }}
        >
          <h2 style={{ marginBottom: 'var(--spacing-4)' }}>
            Theme System Demo
          </h2>
          <p
            style={{
              marginBottom: 'var(--spacing-4)',
              color: 'var(--fg-secondary)',
            }}
          >
            Current theme: <strong>{theme}</strong>
          </p>
          <GlassButton variant="cta" onClick={toggleTheme}>
            Toggle Theme
          </GlassButton>
        </GlassContainer>

        {/* Component Showcase */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--spacing-lg)',
            width: '100%',
          }}
        >
          {/* Glass Container Variants */}
          <GlassContainer variant="card">
            <h3 style={{ marginBottom: 'var(--spacing-3)' }}>Glass Card</h3>
            <p
              style={{
                color: 'var(--fg-secondary)',
                marginBottom: 'var(--spacing-4)',
              }}
            >
              A glassmorphism card with blur effects and transparency.
            </p>
            <GlassButton variant="primary" size="sm">
              Learn More
            </GlassButton>
          </GlassContainer>

          <GlassContainer variant="panel">
            <h3 style={{ marginBottom: 'var(--spacing-3)' }}>Glass Panel</h3>
            <p
              style={{
                color: 'var(--fg-secondary)',
                marginBottom: 'var(--spacing-4)',
              }}
            >
              Enhanced glassmorphism with stronger blur and elevated appearance.
            </p>
            <GlassButton variant="secondary" size="sm">
              Explore
            </GlassButton>
          </GlassContainer>

          <GlassContainer variant="button" style={{ cursor: 'pointer' }}>
            <h3 style={{ marginBottom: 'var(--spacing-3)' }}>
              Interactive Glass
            </h3>
            <p style={{ color: 'var(--fg-secondary)' }}>
              Clickable glassmorphism container with hover effects.
            </p>
          </GlassContainer>
        </div>

        {/* Button Variants */}
        <GlassContainer
          variant="card"
          style={{ width: '100%', textAlign: 'center' }}
        >
          <h2 style={{ marginBottom: 'var(--spacing-4)' }}>Button Variants</h2>
          <div
            style={{
              display: 'flex',
              gap: 'var(--spacing-4)',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <GlassButton variant="primary" size="sm">
              Small Primary
            </GlassButton>
            <GlassButton variant="primary" size="md">
              Medium Primary
            </GlassButton>
            <GlassButton variant="primary" size="lg">
              Large Primary
            </GlassButton>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 'var(--spacing-4)',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 'var(--spacing-4)',
            }}
          >
            <GlassButton variant="secondary">Secondary</GlassButton>
            <GlassButton variant="cta">Call to Action</GlassButton>
            <GlassButton disabled>Disabled</GlassButton>
          </div>
        </GlassContainer>

        {/* Custom Properties Demo */}
        <GlassContainer
          variant="card"
          blur={20}
          highlightOpacity={0.4}
          style={{ width: '100%', textAlign: 'center' }}
        >
          <h2 style={{ marginBottom: 'var(--spacing-4)' }}>
            Custom Properties
          </h2>
          <p
            style={{
              color: 'var(--fg-secondary)',
              marginBottom: 'var(--spacing-4)',
            }}
          >
            This container uses custom blur (20px) and highlight opacity (0.4)
            values.
          </p>
          <GlassButton
            variant="primary"
            glowColor="#ff6b6b"
            onClick={() => alert('Custom glow color!')}
          >
            Custom Glow Button
          </GlassButton>
        </GlassContainer>
      </main>
    </div>
  );
}
