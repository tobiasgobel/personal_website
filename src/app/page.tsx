"use client";

import { useMemo, useState, useEffect } from "react";
import { Mail, Github, Linkedin, Globe, FileText, Moon, Sun, Calendar, MapPin, BookOpen, GraduationCap, FlaskConical, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import NextImage from "next/image";

// --- Types ---
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

export type EducationEntry = {
  degree: string;
  field: string;
  institution: string;
  location?: string;
  start: string;
  end?: string;
  thesisTitle?: string;
  supervisors?: string[];
  link?: string;
};

export type SocialLinks = {
  github?: string;
  linkedin?: string;
  website?: string;
};

const CONFIG = {
  name: "Tobias Göbel",
  tagline: "PhD Candidate in Physics and Artificial Intelligence",
  avatar: "/profielphoto.png",
  location: "Amsterdam, Nederland",
  affiliation: {
    role: "PhD Researcher",
    org: "University of Amsterdam",
    link: "https://www.uva.nl",
    start: "2025",
  },
  email: "tobiaspietergobel@gmail.com",
  socials: {
    github: "https://github.com/tobiasgobel",
    linkedin: "https://www.linkedin.com/in/tobias-göbel-560ab7151",
    website: "",
  },
  cvUrl: "/CV_Tobias_Gobel.pdf",
  researchAreas: [
    { name: "Physics-informed Machine Learning" },
    { name: "Quantum Field Theory & Computational Physics" },
    { name: "Geometric Deep Learning" },
    { name: "Flow-based Models" },
  ],
  publications: [] as Publication[],
  links: [],
  education: [
    {
      degree: "MSc",
      field: "Theoretical Physics",
      institution: "University of Amsterdam",
      location: "Amsterdam, NL",
      start: "2020",
      end: "2025",
      thesisTitle: "Tackling Topological Freezing with Normalizing Flows",
      supervisors: ["Miranda Cheng", "Mathis Gerdes"],
      link: "https://scripties.uba.uva.nl/search?id=record_56614"
    },
    {
      degree: "MSc",
      field: "Artificial Intelligence",
      institution: "University of Amsterdam",
      location: "Amsterdam, NL",
      start: "2022",
      end: "2024",
      thesisTitle: "On Conformally Equivariant Convolutional Networks",
      supervisors: ["Patrick Forré"],
      link: "https://scripties.uba.uva.nl/search?id=record_54918"
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
      degree: "BSc",
      field: "Physics",
      institution: "Leiden University",
      location: "Leiden, NL",
      start: "2017",
      end: "2020",
      thesisTitle: "On the Physics of Trotterization",
      supervisors: ["Vadim Cheianov", "Yaroslav Herasymenko"],
      link: "https://studenttheses.universiteitleiden.nl/handle/1887/133570"
    }
  ],
};

function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => 'light');
  useEffect(() => {
    try {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    } catch {}
  }, []);
  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  return { theme, toggle };
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
      <FileText className="h-4 w-4" />
    </Button>
  );
}

export default function PhDPortfolio() {
  const { theme, toggle } = useTheme();

  return (
    <main className={"min-h-dvh bg-background text-foreground " + (theme === "dark" ? "dark" : "") + " antialiased selection:bg-primary/20"}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <NextImage src={CONFIG.avatar} alt={`${CONFIG.name} headshot`} width={64} height={64} className="h-30 w-30 rounded-2xl object-cover shadow" unoptimized loader={({ src }) => src} />
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
              <Button className="rounded-xl gap-2" asChild>
                <a href={CONFIG.cvUrl} target="_blank" rel="noreferrer">
                  <FileText className="h-4 w-4" /> CV
                </a>
              </Button>
            )}
          </div>
        </header>

        {/* Intro */}
        <Card className="mb-8 rounded-2xl">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-[1.2fr_.8fr] gap-6 items-start">
              <div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  I am a PhD researcher at <a className="underline underline-offset-4" href={CONFIG.affiliation.link} target="_blank" rel="noreferrer">{CONFIG.affiliation.org}</a> working on machine learning and physics. My work focuses on {CONFIG.researchAreas.map((r) => r.name).join(", ")}.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-sm"><GraduationCap className="h-4 w-4"/> {CONFIG.affiliation.role} · {CONFIG.affiliation.org} · since {CONFIG.affiliation.start}</div>
                <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4"/> {CONFIG.location}</div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Socials socials={CONFIG.socials} />
                  {/* <EmailChip email={CONFIG.email} /> */}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
                      {e.supervisors && (
                        <p className="text-sm text-muted-foreground mt-1">
                          <span className="font-medium">Supervisors:</span> {e.supervisors.join(", ")}
                        </p>
                      )}
                    </div>
                    {e.link && (
                      <Button variant="outline" className="rounded-xl gap-2 text-xs" asChild>
                        <a href={e.link} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-4 w-4"/> Details
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Research & Publications */}
        <section className="mb-10">
          <SectionTitle icon={FlaskConical} title="Research" subtitle="Selected publications" />
          <div className="mt-4 grid gap-4">
            {CONFIG.publications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No publications yet.</p>
            ) : (
              CONFIG.publications.map((p: Publication) => (
                <motion.div key={p.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="rounded-2xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text/base font-semibold">{p.title}</CardTitle>
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
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Links (instead of teaching) */}
        <section className="mb-12">
          <SectionTitle icon={BookOpen} title="Links" subtitle="Resources and external pages" />
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            {CONFIG.links.map((link) => (
              <Card key={link.title} className="rounded-2xl">
                <CardContent className="p-6 flex items-center justify-between">
                  <h3 className="font-semibold leading-tight">{link.title}</h3>
                  <Button variant="outline" className="rounded-xl gap-2 text-xs" asChild>
                    <a href={link.url} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-4 w-4"/> Open
                    </a>
                  </Button>
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
  const IconLink: FC<{ href: string; label: string; children: ReactNode }> = ({ href, label, children }) => (
    <Button variant="ghost" className="rounded-xl" asChild>
      <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="inline-flex">
        {children}
      </a>
    </Button>
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
      {CONFIG.email &&(
        <IconLink href={`mailto:${CONFIG.email}`} label="Email">
          <Mail className="h-5 w-5" />
        </IconLink>
      )}
    </div>
  );
}
