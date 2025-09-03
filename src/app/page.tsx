"use client";

import { useMemo, useState } from "react";
import { Mail, Github, Linkedin, Globe, FileText, Moon, Sun, Calendar, MapPin, BookOpen, GraduationCap, FlaskConical, ChevronRight, Filter, Copy, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

/**
 * One‑file personal website for a PhD student.
 *
 * How to use
 * 1) Edit the CONFIG object below with your real info.
 * 2) Replace placeholder assets (photo, CV link, etc.).
 * 3) Deploy this single component anywhere (Vite/Next.js). Tailwind + shadcn/ui recommended.
 *
 * Design goals
 * - Clean academic aesthetic with soft shadows & rounded corners
 * - Mobile‑first, fully responsive
 * - Accessible (labels, focus rings, semantic landmarks)
 * - Quick customization via CONFIG
 */

const CONFIG = {
  name: "Your Name, MSc",
  tagline: "PhD Candidate in Artificial Intelligence",
  avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&crop=faces", // replace with your headshot URL
  location: "Amsterdam, NL",
  affiliation: {
    role: "PhD Researcher",
    org: "University of Somewhere",
    link: "https://example.edu",
    start: "2023",
  },
  email: "you@example.com",
  socials: {
    github: "https://github.com/yourhandle",
    linkedin: "https://www.linkedin.com/in/yourhandle/",
    website: "https://yourdomain.com",
    googleScholar: "https://scholar.google.com/citations?user=XXXXX",
  },
  cvUrl: "/cv.pdf", // replace with your CV path
  researchAreas: [
    { name: "Representation Learning" },
    { name: "Scientific ML" },
    { name: "Optimization" },
  ],
  highlights: [
    { label: "Papers", value: 6 },
    { label: "Citations", value: 214 },
    { label: "Talks", value: 9 },
  ],
  // Publications: minimal schema; extend as needed
  publications: [
    {
      title: "Learning Geometric Priors for Scientific Discovery",
      authors: ["Your Name", "A. Collaborator", "B. Mentor"],
      venue: "ICML 2025",
      year: 2025,
      links: {
        paper: "#",
        code: "#",
        poster: "#",
      },
      tags: ["Geometric DL", "Physics‑informed"],
      abstract:
        "We introduce a framework that embeds symplectic inductive biases into deep architectures, improving generalization on chaotic dynamics.",
    },
    {
      title: "Spectral Weighting for CP^N Lattice Models",
      authors: ["Your Name", "C. Coauthor"],
      venue: "NeurIPS 2024 Workshop",
      year: 2024,
      links: {
        paper: "#",
        code: "#",
      },
      tags: ["CP^N", "Lattice", "Fourier"],
      abstract:
        "A fast method for density correction using Fourier transforms with projection and stability guarantees.",
    },
  ],
  projects: [],
  education: [
    {
      degree: "MSc",
      field: "Artificial Intelligence",
      institution: "Your University",
      location: "City, Country",
      start: "2022",
      end: "2024",
      thesisTitle: "Your thesis title",
      link: "#"
    },
    {
      degree: "BSc",
      field: "Physics",
      institution: "Your University",
      location: "City, Country",
      start: "2018",
      end: "2022"
    }
  ],
  teaching: [
    {
      course: "Machine Learning",
      role: "TA",
      term: "Spring 2025",
      link: "#",
    },
    {
      course: "Numerical Methods",
      role: "Guest Lecturer",
      term: "Fall 2024",
      link: "#",
    },
  ],
  talks: [
    {
      title: "Symplectic Neural Nets",
      event: "ML Research Seminar",
      date: "2025‑05‑10",
      link: "#",
    },
  ],
};

function useTheme() {
  const [theme, setTheme] = useState(
    typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  );
  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return { theme, toggle };
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex flex-col items-start">
      <div className="text-3xl font-bold leading-none">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5" aria-hidden />
      <div>
        <h2 className="text-xl font-semibold leading-snug">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function EmailChip({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="secondary"
      className="gap-2"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {}
      }}
      aria-label={copied ? "Email copied" : "Copy email"}
    >
      <Mail className="h-4 w-4" />
      {copied ? "Copied" : email}
      <Copy className="h-4 w-4" />
    </Button>
  );
}

export default function PhDPortfolio() {
  const { theme, toggle } = useTheme();
  const [pubQuery, setPubQuery] = useState("");
  const [pubScope, setPubScope] = useState<string>("all");

  const filteredPubs = useMemo(() => {
    return CONFIG.publications.filter((p) => {
      const matchesQuery = (p.title + p.venue + p.authors.join(" ") + (p.abstract ?? "") + (p.tags ?? []).join(" ")).toLowerCase().includes(pubQuery.toLowerCase());
      const scopeOk = pubScope === "all" || String(p.year) === pubScope;
      return matchesQuery && scopeOk;
    });
  }, [pubQuery, pubScope]);

  const years = useMemo(() => {
    const y = Array.from(new Set(CONFIG.publications.map((p) => p.year))).sort((a, b) => b - a);
    return y.map(String);
  }, []);

  return (
    <main className={"min-h-dvh bg-background text-foreground " + (theme === "dark" ? "dark" : "") + " antialiased selection:bg-primary/20"}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img src={CONFIG.avatar} alt={`${CONFIG.name} headshot`} className="h-16 w-16 rounded-2xl object-cover shadow" />
            <div>
              <h1 className="text-2xl font-bold leading-tight">{CONFIG.name}</h1>
              <p className="text-muted-foreground text-sm">{CONFIG.tagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={toggle} aria-label="Toggle theme" className="rounded-xl">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <a href={CONFIG.cvUrl} target="_blank" rel="noreferrer" className="inline-flex">
              <Button className="rounded-xl gap-2">
                <FileText className="h-4 w-4" /> CV
              </Button>
            </a>
          </div>
        </header>

        {/* Intro */}
        <Card className="mb-8 rounded-2xl">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-[1.2fr_.8fr] gap-6 items-start">
              <div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  I am a PhD researcher at <a className="underline underline-offset-4" href={CONFIG.affiliation.link} target="_blank" rel="noreferrer">{CONFIG.affiliation.org}</a> working on machine learning for scientific discovery. My work focuses on {CONFIG.researchAreas.map((r) => r.name).join(", ")}. I like building open‑source tools and collaborating across physics and AI.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <EmailChip email={CONFIG.email} />
                  <Socials socials={CONFIG.socials} />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-sm"><GraduationCap className="h-4 w-4"/> {CONFIG.affiliation.role} · {CONFIG.affiliation.org} · since {CONFIG.affiliation.start}</div>
                <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4"/> {CONFIG.location}</div>
                <Separator />
                <div className="grid grid-cols-3 gap-4">
                  {CONFIG.highlights.map((h) => (
                    <Card key={h.label} className="rounded-xl">
                      <CardContent className="p-4">
                        <Stat label={h.label} value={h.value} />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Research & Publications */}
        <section className="mb-10">
          <SectionTitle icon={FlaskConical} title="Research" subtitle="Selected publications, code, and artifacts" />
          <Tabs defaultValue="publications" className="mt-4">
            <TabsList className="rounded-xl">
              <TabsTrigger value="publications">Publications</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="talks">Talks</TabsTrigger>
            </TabsList>

            <TabsContent value="publications" className="mt-4">
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 md:justify-between">
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Filter className="h-4 w-4" />
                  <Input
                    placeholder="Search title, author, venue, tag…"
                    value={pubQuery}
                    onChange={(e) => setPubQuery(e.target.value)}
                    className="rounded-xl"
                    aria-label="Search publications"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <TabsList className="rounded-xl">
                    <TabsTrigger value="all" onClick={() => setPubScope("all")} data-state={pubScope === "all" ? "active" : "inactive"}>All</TabsTrigger>
                    {years.map((y) => (
                      <TabsTrigger key={y} value={y} onClick={() => setPubScope(y)} data-state={pubScope === y ? "active" : "inactive"}>{y}</TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </div>
              <div className="mt-4 grid gap-4">
                {filteredPubs.map((p) => (
                  <motion.div key={p.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="rounded-2xl">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold">{p.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <span>{p.authors.join(", ")}</span>
                          <span>·</span>
                          <span>{p.venue} {p.year}</span>
                        </div>
                        {p.abstract && <p className="mt-3 text-sm text-muted-foreground">{p.abstract}</p>}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {p.tags?.map((t) => (
                            <Badge key={t} variant="secondary" className="rounded-lg">{t}</Badge>
                          ))}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {p.links?.paper && (
                            <a className="inline-flex" href={p.links.paper} target="_blank" rel="noreferrer">
                              <Button variant="outline" className="rounded-xl gap-2 text-xs">
                                <BookOpen className="h-4 w-4" /> Paper <ExternalLink className="h-3 w-3"/>
                              </Button>
                            </a>
                          )}
                          {p.links?.code && (
                            <a className="inline-flex" href={p.links.code} target="_blank" rel="noreferrer">
                              <Button variant="outline" className="rounded-xl gap-2 text-xs">
                                <Github className="h-4 w-4" /> Code <ExternalLink className="h-3 w-3"/>
                              </Button>
                            </a>
                          )}
                          {p.links?.poster && (
                            <a className="inline-flex" href={p.links.poster} target="_blank" rel="noreferrer">
                              <Button variant="outline" className="rounded-xl gap-2 text-xs">
                                <FileText className="h-4 w-4" /> Poster <ExternalLink className="h-3 w-3"/>
                              </Button>
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                {filteredPubs.length === 0 && (
                  <p className="text-sm text-muted-foreground">No publications match your search.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="projects" className="mt-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {CONFIG.projects.map((proj) => (
                  <Card key={proj.title} className="rounded-2xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold">{proj.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">{proj.description}</p>
                      <div className="mt-3 flex items-center gap-2 flex-wrap">
                        {proj.tags?.map((t) => (
                          <Badge key={t} variant="secondary" className="rounded-lg">{t}</Badge>
                        ))}
                      </div>
                      <a href={proj.link} target="_blank" rel="noreferrer" className="inline-flex mt-4">
                        <Button variant="outline" className="rounded-xl gap-2 text-xs">
                          <ChevronRight className="h-4 w-4"/> View <ExternalLink className="h-3 w-3"/>
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="talks" className="mt-4">
              <div className="grid gap-4">
                {CONFIG.talks.map((t) => (
                  <Card key={t.title} className="rounded-2xl">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <h3 className="font-semibold">{t.title}</h3>
                          <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                            <Calendar className="h-4 w-4"/> {t.event} · {t.date}
                          </div>
                        </div>
                        <a href={t.link} target="_blank" rel="noreferrer" className="inline-flex">
                          <Button variant="outline" className="rounded-xl gap-2 text-xs">
                            <ExternalLink className="h-4 w-4"/> Details
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Education */}
        <section className="mb-12">
          <SectionTitle icon={GraduationCap} title="Education" subtitle="Previous degrees and thesis work" />
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            {CONFIG.education.map((e) => (
              <Card key={`${e.degree}-${e.institution}-${e.start}`} className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold leading-tight">
                        {e.degree} in {e.field}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {e.institution}
                        {e.location ? (
                          <>
                            {" "}·{" "}
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" /> {e.location}
                            </span>
                          </>
                        ) : null}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> {e.start}–{e.end ?? "present"}
                      </p>
                      {e.thesisTitle && (
                        <p className="text-sm text-muted-foreground mt-3">
                          <span className="font-medium">Thesis:</span> {e.thesisTitle}
                        </p>
                      )}
                    </div>
                    {e.link && (
                      <a href={e.link} target="_blank" rel="noreferrer" className="inline-flex">
                        <Button variant="outline" className="rounded-xl gap-2 text-xs">
                          <ExternalLink className="h-4 w-4"/> Details
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Teaching */}
        <section className="mb-12">
          <SectionTitle icon={BookOpen} title="Teaching" subtitle="Courses, mentoring, and outreach" />
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            {CONFIG.teaching.map((c) => (
              <Card key={`${c.course}-${c.term}`} className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold leading-tight">{c.course}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{c.role} · {c.term}</p>
                    </div>
                    <a href={c.link} target="_blank" rel="noreferrer" className="inline-flex">
                      <Button variant="outline" className="rounded-xl gap-2 text-xs">
                        <ExternalLink className="h-4 w-4"/> Syllabus
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 text-center text-sm text-muted-foreground">
          <div className="flex justify-center mb-3">
            <Socials socials={CONFIG.socials} />
          </div>
          <p>
            © {new Date().getFullYear()} {CONFIG.name}. Built with ❤️. <span className="sr-only">End of page</span>
          </p>
        </footer>
      </div>
    </main>
  );
}

function Socials({ socials }: { socials: typeof CONFIG.socials }) {
  const IconLink = ({ href, label, children }: any) => (
    <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="inline-flex">
      <Button variant="ghost" className="rounded-xl">
        {children}
      </Button>
    </a>
  );
  return (
    <div className="flex items-center gap-1">
      {socials.github && (
        <IconLink href={socials.github} label="GitHub">
          <Github className="h-5 w-5" />
        </IconLink>
      )}
      {socials.linkedin && (
        <IconLink href={socials.linkedin} label="LinkedIn">
          <Linkedin className="h-5 w-5" />
        </IconLink>
      )}
      {socials.website && (
        <IconLink href={socials.website} label="Website">
          <Globe className="h-5 w-5" />
        </IconLink>
      )}
    </div>
  );
}

