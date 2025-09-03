"use client";

import { useMemo, useState, useEffect } from "react";
import { Mail, Github, Linkedin, Globe, FileText, Moon, Sun, Calendar, MapPin, BookOpen, GraduationCap, FlaskConical, ChevronRight, Filter, Copy, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import NextImage from "next/image";



// --- Types ---
import Image from "next/image";
import type { ReactNode, FC } from "react";

export type Publication = {
  title: string;
  authors?: string[];
  venue?: string;
  year?: number;
  links?: { paper?: string; code?: string; poster?: string };
  tags?: string[];
  abstract?: string;
};

export type Project = {
  title: string;
  description: string;
  link: string;
  tags?: string[];
};

export type Talk = {
  title: string;
  event: string;
  date: string; // ISO YYYY-MM-DD or free text
  link?: string;
};

export type Teaching = {
  course: string;
  role: string;
  term: string;
  link?: string;
};

export type EducationEntry = {
  degree: string;
  field: string;
  institution: string;
  location?: string;
  start: string;
  end?: string;
  thesisTitle?: string;
  link?: string;
};

export type SocialLinks = {
  github?: string;
  linkedin?: string;
  website?: string;
};

const CONFIG = {
  name: "Tobias Pieter Göbel, MSc",
  tagline: "PhD Candidate in Physics and Artificial Intelligence",
  avatar: "/profielphoto.png", // replace when you have a real headshot
  location: "Amsterdam, NL",
  affiliation: {
    role: "PhD Researcher",
    org: "University of Amsterdam",
    link: "https://www.uva.nl",
    start: "2025",
  },
  email: "tobiaspietergobel@gmail.com",
  socials: {
    github: "https://github.com/tobiasgobel",
    linkedin: "",
    website: "",
  },
  cvUrl: "/CV_Tobias_Gobel.pdf",
  researchAreas: [
    { name: "Physics-informed Machine Learning" },
    { name: "Quantum Field Theory & Computational Physics" },
    { name: "Statistical Mechanics in Neural Networks" },
    { name: "Representation Learning" },
  ],
  highlights: [
    { label: "Papers", value: 0 },
    { label: "Citations", value: 0 },
    { label: "Talks", value: 0 },
  ],
  publications: [] as Publication[],
  projects: [],
  education: [
    {
      degree: "MSc",
      field: "Theoretical Physics",
      institution: "University of Amsterdam",
      location: "Amsterdam, NL",
      start: "2020",
      end: "2025",
      thesisTitle: "Tackling Topological Freezing with Normalizing Flows",
      link: "https://scripties.uba.uva.nl/search?id=record_54918"
    },
    {
      degree: "MSc (cum laude)",
      field: "Artificial Intelligence",
      institution: "University of Amsterdam",
      location: "Amsterdam, NL",
      start: "2022",
      end: "2024",
      thesisTitle: "On Conformally Equivariant Convolutional Networks"
    },
    {
      degree: "Minor",
      field: "Physics",
      institution: "University of British Columbia",
      location: "Vancouver, Canada",
      start: "2019",
      end: "2020"
    },
    {
      degree: "BSc (cum laude)",
      field: "Physics",
      institution: "Leiden University",
      location: "Leiden, NL",
      start: "2017",
      end: "2020",
      thesisTitle: "On the Physics of Trotterization",
      link: "https://studenttheses.universiteitleiden.nl/handle/1887/133570"
    }
  ],
  teaching: [],
  talks: [],
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

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Render a minimal shell that matches the server HTML (no handlers)
    return (
      <main className="min-h-dvh bg-background text-foreground antialiased">
        {/* Optional: simple header/skeleton so layout doesn't jump */}
      </main>
    );
  }
  const filteredPubs = useMemo(() => {
    const pubs = (CONFIG.publications ?? []) as Publication[];
    return pubs.filter((pub) => {
      const hay = (
        (pub.title ?? "") +
        (pub.venue ?? "") +
        ((pub.authors ?? []).join(" ")) +
        (pub.abstract ?? "") +
        ((pub.tags ?? []).join(" "))
      ).toLowerCase();
      const matchesQuery = hay.includes(pubQuery.toLowerCase());
      const scopeOk = pubScope === "all" || String(pub.year ?? "") === pubScope;
      return matchesQuery && scopeOk;
    });
  }, [pubQuery, pubScope]);

  const years = useMemo(() => {
    const y = Array.from(
      new Set(
        CONFIG.publications
          .map((p: Publication) => p.year)
          .filter((n): n is number => typeof n === "number")
      )
    ).sort((a, b) => b - a);
    return y.map(String);
  }, []);

  return (
    <main className={"min-h-dvh bg-background text-foreground " + (theme === "dark" ? "dark" : "") + " antialiased selection:bg-primary/20"}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <NextImage src={CONFIG.avatar} alt={`${CONFIG.name} headshot`} width={64} height={64} className="h-16 w-16 rounded-2xl object-cover shadow" unoptimized loader={({ src }) => src} />
            <div>
              <h1 className="text-2xl font-bold leading-tight">{CONFIG.name}</h1>
              <p className="text-muted-foreground text-sm">{CONFIG.tagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={toggle} aria-label="Toggle theme" className="rounded-xl">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            {CONFIG.cvUrl && (
              <a href={CONFIG.cvUrl} target="_blank" rel="noreferrer" className="inline-flex">
                <Button className="rounded-xl gap-2">
                  <FileText className="h-4 w-4" /> CV
                </Button>
              </a>
            )}
          </div>
        </header>

        {/* Intro */}
        <Card className="mb-8 rounded-2xl">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-[1.2fr_.8fr] gap-6 items-start">
              <div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  I am a PhD researcher at <a className="underline underline-offset-4" href={CONFIG.affiliation.link} target="_blank" rel="noreferrer">{CONFIG.affiliation.org}</a> working on machine learning and physics. My work focuses on {CONFIG.researchAreas.map((r) => r.name).join(", ")}. I enjoy building open‑source tools and collaborating across physics and AI.
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
                {filteredPubs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No publications yet.</p>
                ) : (
                  filteredPubs.map((p: Publication) => (
                    <motion.div key={p.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      <Card className="rounded-2xl">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-semibold">{p.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            {p.authors && <span>{p.authors.join(", ")}</span>}
                            {p.venue && (
                              <>
                                <span>·</span>
                                <span>{p.venue} {p.year}</span>
                              </>
                            )}
                          </div>
                          {p.abstract && <p className="mt-3 text-sm text-muted-foreground">{p.abstract}</p>}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {p.tags?.map((t: string) => (
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
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="projects" className="mt-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {CONFIG.projects.length === 0 && (
                  <p className="text-sm text-muted-foreground">No projects yet.</p>
                )}
                {CONFIG.projects.map((proj: Project) => (
                  <Card key={proj.title} className="rounded-2xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold">{proj.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">{proj.description}</p>
                      <div className="mt-3 flex items-center gap-2 flex-wrap">
                        {proj.tags?.map((t: string) => (
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
                {CONFIG.talks.length === 0 && (
                  <p className="text-sm text-muted-foreground">No talks yet.</p>
                )}
                {CONFIG.talks.map((t: Talk) => (
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
            {CONFIG.teaching.length === 0 && (
              <p className="text-sm text-muted-foreground">No teaching entries yet.</p>
            )}
            {CONFIG.teaching.map((c: Teaching) => (
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
            © {new Date().getFullYear()} {CONFIG.name}.
          </p>
        </footer>
      </div>
    </main>
  );
}

function Socials({ socials }: { socials: SocialLinks }) {
  const IconLink: React.FC<{ href: string; label: string; children: React.ReactNode }> = ({ href, label, children }) => (
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

