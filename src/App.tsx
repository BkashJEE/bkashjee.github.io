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
import { ResumeCard } from './components/ResumeCard'
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
      <ScrollProgress />
      <PointerGlow />
      <Nav />
      <main>
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
        <ResumeCard />
      </main>
      <Footer />
    </div>
  )
}
