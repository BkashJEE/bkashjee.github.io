import { useEffect } from 'react'
import Lenis from 'lenis'
import { caseStudies } from './content/projects'
import { useMotionPref } from './motion/useMotionPref'
import { PointerGlow } from './motion/PointerGlow'
import { ScrollProgress } from './motion/ScrollProgress'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { SectionHeading } from './components/SectionHeading'
import { CaseStudy } from './components/CaseStudy'
import { Plugins } from './components/Plugins'
import { LabGrid } from './components/LabGrid'
import { Skills } from './components/Skills'
import { Writing } from './components/Writing'
import { About } from './components/About'
import { Footer } from './components/Footer'

export default function App() {
  const reduced = useMotionPref()

  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ lerp: 0.12, anchors: true })
    let frame: number
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [reduced])

  return (
    <div className="grain">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-md focus:bg-white focus:px-4 focus:text-zinc-900 focus:outline-2 focus:outline-offset-2 focus:outline-zinc-900">Skip to content</a>
      <ScrollProgress />
      <PointerGlow />
      <Nav />
      <main id="main" tabIndex={-1}>
        <Hero />
        <section id="work" className="overflow-clip pt-8">
          <SectionHeading eyebrow="Selected work" title="Projects, built and shipped" ghost="Work" />
          {caseStudies.map((study, i) => (
            <CaseStudy key={study.id} study={study} flip={i % 2 === 1} />
          ))}
        </section>
        <Plugins />
        <Skills />
        <LabGrid />
        <Writing />
        <About />
      </main>
      <Footer />
    </div>
  )
}
