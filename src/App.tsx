import { useEffect } from 'react'
import Lenis from 'lenis'
import { caseStudies } from './content/projects'
import { useMotionPref } from './motion/useMotionPref'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { SectionHeading } from './components/SectionHeading'
import { CaseStudy } from './components/CaseStudy'
import { LabGrid } from './components/LabGrid'
import { Skills } from './components/Skills'
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
      <Nav />
      <main>
        <Hero />
        <section id="work" className="pt-8">
          <SectionHeading eyebrow="Selected work" title="Three things I built and ship" />
          {caseStudies.map((study, i) => (
            <CaseStudy key={study.id} study={study} flip={i % 2 === 1} />
          ))}
        </section>
        <Skills />
        <LabGrid />
        <About />
        <ResumeCard />
      </main>
      <Footer />
    </div>
  )
}
