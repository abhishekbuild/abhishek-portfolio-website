---
name: r3f-component
description: >
  Use this skill when creating any 3D scene, animation, or WebGL component
  using React Three Fiber. Triggers on: "create a 3D scene", "add the hero animation",
  "build the particle effect", "make [thing] 3D", "add WebGL", "Three.js component",
  "scroll-triggered animation", or any request for 3D/WebGL work.
---

# r3f-component

Creates React Three Fiber (R3F) 3D components for the portfolio.
3D is a core visual differentiator of this site — but it must be purposeful,
performant, and never decorative for its own sake. Every scene tells a story.

## Before Writing Any Code

Ask if not already clear:
1. **Scene** — What should it look like? (particles, neural network, geometric, etc.)
2. **Page** — Which page/section does it live in?
3. **Trigger** — Static on mount, scroll-driven, or mouse-interactive?
4. **Story** — What narrative role does it play? (It should mean something)
5. **Fallback** — What shows if WebGL is unavailable? (CSS gradient, static image)

## File Structure

```
/src/components/3d/
  {SceneName}Scene.tsx      ← the R3F Canvas + scene content
  {SceneName}Wrapper.tsx    ← dynamic() wrapper used by the page
  index.ts                  ← barrel export
```

Split into two files because `dynamic()` with `ssr: false` must wrap at import,
not inside the file itself.

## SceneName.tsx Template (The Canvas)

```tsx
// /src/components/3d/{SceneName}Scene.tsx
'use client'   // ← R3F always needs client context

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Float,
  Stars,
  OrbitControls,
  useScroll,
} from '@react-three/drei'
import { useTransform, useMotionValue } from 'framer-motion'
import * as THREE from 'three'

// ─── Inner mesh component ──────────────────────────────────────────────────
// Separate from Canvas so hooks (useFrame, useScroll) work correctly

function SceneContent() {
  const meshRef = useRef<THREE.Mesh>(null)
  const scroll = useScroll()   // only works inside ScrollControls

  useFrame((state, delta) => {
    if (!meshRef.current) return
    // Animate on every frame — keep this CHEAP
    // delta = time since last frame (use for frame-rate independence)
    meshRef.current.rotation.y += delta * 0.2
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color="#7C3AED"
        wireframe
        transparent
        opacity={0.6}
      />
    </mesh>
  )
}

// ─── Canvas component (exported) ──────────────────────────────────────────

interface {SceneName}SceneProps {
  className?: string
}

export function {SceneName}Scene({ className }: {SceneName}SceneProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,        // ← transparent background
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}          // ← cap pixel ratio at 2x for performance
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />

        {/* Scene content */}
        <SceneContent />
      </Canvas>
    </div>
  )
}
```

## Wrapper.tsx Template (The Dynamic Import)

```tsx
// /src/components/3d/{SceneName}Wrapper.tsx
import dynamic from 'next/dynamic'

// Three.js cannot run server-side — always ssr: false
const {SceneName}Scene = dynamic(
  () =>
    import('./{SceneName}Scene').then((mod) => ({
      default: mod.{SceneName}Scene,
    })),
  {
    ssr: false,
    // Fallback while WebGL loads or if unavailable
    loading: () => (
      <div className="w-full h-full bg-gradient-to-br from-violet-950/20 to-transparent rounded-xl" />
    ),
  }
)

export { {SceneName}Scene as {SceneName}Wrapper }
// Usage in pages: import { {SceneName}Wrapper } from '@/components/3d'
```

## Scroll-Driven Animation Pattern

This is the main animation style for the portfolio — 3D reacts to scroll.

```tsx
'use client'
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll } from '@react-three/drei'
import * as THREE from 'three'

function AnimatedMesh() {
  const ref = useRef<THREE.Group>(null)
  const scroll = useScroll()

  useFrame(() => {
    if (!ref.current) return
    const t = scroll.offset   // 0 = top, 1 = bottom of scroll area

    // Map scroll to rotation
    ref.current.rotation.y = t * Math.PI * 2

    // Map scroll to position
    ref.current.position.y = THREE.MathUtils.lerp(0, -3, t)

    // Map scroll to scale
    const s = THREE.MathUtils.lerp(1, 0.5, t)
    ref.current.scale.setScalar(s)
  })

  return (
    <group ref={ref}>
      {/* scene content */}
    </group>
  )
}

export function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ScrollControls pages={3} damping={0.1}>
        <AnimatedMesh />
      </ScrollControls>
    </Canvas>
  )
}
```

## Mouse-Interactive Pattern (Hover/Follow)

```tsx
'use client'
import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function MouseFollower() {
  const ref = useRef<THREE.Mesh>(null)
  const { pointer } = useThree()  // pointer.x, pointer.y normalized -1 to 1

  useFrame(() => {
    if (!ref.current) return
    // Smooth follow with lerp
    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      pointer.x * 0.5,
      0.05
    )
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      -pointer.y * 0.3,
      0.05
    )
  })

  return <mesh ref={ref}>{/* ... */}</mesh>
}
```

## Particle System Pattern (Neural Network / Data Aesthetic)

```tsx
'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 200   // keep low on mobile

function Particles() {
  const ref = useRef<THREE.Points>(null)

  // Generate positions once — useMemo prevents recreation on re-render
  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 10   // x
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10   // y
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10   // z
    }
    return arr
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.03
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#7C3AED"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  )
}
```

## Performance Rules — Non-Negotiable

```tsx
// ✅ Cap pixel ratio — prevents burning mobile GPU
dpr={[1, 2]}

// ✅ Transparent canvas — use CSS for background color
gl={{ alpha: true }}

// ✅ Memoize geometry, positions, materials
const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 1), [])

// ✅ Use delta in useFrame for frame-rate independence
useFrame((state, delta) => {
  ref.current.rotation.y += delta * speed   // NOT += 0.01
})

// ✅ Limit particle count — test on a real mobile device
const PARTICLES = 150   // not 10000

// ✅ ssr: false on the dynamic import wrapper — always

// ❌ Never use THREE.OrbitControls directly (use drei's version)
// ❌ Never create new THREE objects inside useFrame (memory leak)
// ❌ Never put Canvas inside a Suspense without fallback
// ❌ Never use CapsuleGeometry (not in Three.js r128)
//    Use CylinderGeometry or SphereGeometry instead
```

## Useful @react-three/drei Helpers

```tsx
import {
  Float,           // gentle floating animation
  Stars,           // star field background
  Sphere,          // pre-made sphere mesh
  Box,             // pre-made box mesh
  Torus,           // pre-made torus mesh
  OrbitControls,   // mouse-controlled camera (disable in prod)
  ScrollControls,  // scroll-driven scenes
  useScroll,       // access scroll offset inside ScrollControls
  Html,            // render HTML inside 3D scene
  Text,            // 3D text
  Line,            // draw lines between points (for neural net edges)
  Sparkles,        // particle sparkle effect
} from '@react-three/drei'

// Float — subtle hover effect, great for hero objects
<Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
  <mesh>{/* ... */}</mesh>
</Float>
```

## Quality Checklist

- [ ] Wrapped in `dynamic()` with `ssr: false` in the Wrapper file
- [ ] Canvas has `dpr={[1, 2]}` cap
- [ ] Canvas has `gl={{ alpha: true }}` for transparent background
- [ ] `useFrame` uses `delta` for frame-rate independence
- [ ] Geometry/positions created with `useMemo`, not inline
- [ ] No new THREE objects created inside `useFrame`
- [ ] Mobile tested (or at least low-particle-count mode considered)
- [ ] Fallback defined in `dynamic()` loading prop
- [ ] `viewport={{ once: true }}` on any Framer Motion wrappers outside Canvas
