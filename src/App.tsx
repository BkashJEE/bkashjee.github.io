import { HomeDivider } from './components/HomeDivider'
import { caseStudies } from './content/projects'
import { ScrollProgress } from './motion/ScrollProgress'
import { SiteNav } from './components/SiteNav'
import { Hero } from './components/Hero'
import { SectionHeading } from './components/SectionHeading'
import { CaseStudy } from './components/CaseStudy'
import { Plugins } from './components/Plugins'
import { LabGrid } from './components/LabGrid'
import { Skills } from './components/Skills'
import { Writing } from './components/Writing'
import { About } from './components/About'
import { ClosingBlock } from './components/Footer'
import { SiteFooter } from './components/SiteFooter'

export default function App() {
  return (
    <div>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-md focus:bg-white focus:px-4 focus:text-zinc-900 focus:outline-2 focus:outline-offset-2 focus:outline-zinc-900">Skip to content</a>
      <ScrollProgress />
      <SiteNav />
      <main id="main" tabIndex={-1}>
        <Hero />
        <section id="work" className="relative overflow-clip pt-8">
          <HomeDivider />
          <SectionHeading eyebrow="Selected work" title="Projects, built and shipped" />
          {caseStudies.map((study, i) => (
            <CaseStudy key={study.id} study={study} flip={i % 2 === 1} eagerImage={i < 2} />
          ))}
        </section>
        <Plugins />
        <Skills />
        <LabGrid />
        <Writing />
        <About />
        <ClosingBlock />
      </main>
      <div className="relative">
        <HomeDivider />
        <SiteFooter />
      </div>
    </div>
  )
}
