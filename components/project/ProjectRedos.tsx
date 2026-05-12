import React from 'react';
import { ProjectData } from '@/lib/projects/types';
import { RichProjectText } from './RichProjectText';

interface ProjectRedosProps {
  project: ProjectData;
}

const palette = {
  base: 'oklch(0.9337 0.004688 142)',
  paper: 'oklch(0.978 0.002 106)',
  paperShadow: 'oklch(0.905 0.006 100)',
  contrast: 'oklch(0.30 0.075 348)',
  ink: 'oklch(0.19 0.016 35)',
  line: 'oklch(0.79 0.008 110)',
  ruleBlue: 'oklch(0.78 0.02 235)',
};

export const ProjectRedos: React.FC<ProjectRedosProps> = ({ project }) => {
  if (!project.redos || project.redos.length === 0) return null;

  return (
    <section
      className="w-full px-6 py-20 sm:px-8 lg:px-12"
      style={{ background: palette.base }}
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[20rem_1fr] lg:gap-12">
        <div className="space-y-3 lg:pt-2">
          <p className="annotation" style={{ color: palette.contrast }}>
            POST-PROJECT REFLECTION
          </p>
          <h2
            className="font-heading text-3xl font-medium leading-[0.98] sm:text-4xl md:text-5xl"
            style={{ color: palette.ink }}
          >
            What I&apos;d Do Differently
          </h2>
          <p
            className="max-w-[16rem] text-[0.92rem] uppercase leading-[2.05] tracking-[0.08em]"
            style={{ color: palette.ink, opacity: 0.68 }}
          >
            Redos of project parts I was unsatisfied with, or simply things I would've done differently.
          </p>
        </div>

        <div className="space-y-8">
          {project.redos.map((redo, idx) => (
            <article key={idx} className="relative">
              <div
                className="relative overflow-hidden border"
                style={{
                  background: palette.paper,
                  borderColor: palette.line,
                  boxShadow: `7px 7px 0 ${palette.paperShadow}`,
                }}
              >
                <div
                  className="absolute inset-y-0 left-0 w-[4.6rem] border-r"
                  style={{
                    borderColor: palette.line,
                    background: 'rgba(255, 255, 255, 0.48)',
                  }}
                />
                <div
                  className="pointer-events-none absolute inset-y-0 left-[4.6rem] w-[2px]"
                  style={{ background: palette.contrast }}
                />
                <div className="pointer-events-none absolute left-[1.38rem] top-[2.15rem] flex flex-col gap-[4.45rem]">
                  {[0, 1, 2].map((item) => (
                    <span
                      key={item}
                      className="h-5 w-5 rounded-full border"
                      style={{
                        background: palette.base,
                        borderColor: palette.line,
                      }}
                    />
                  ))}
                </div>

                <div
                  className="pl-[6.25rem] pr-8"
                  style={{
                    paddingTop: "1.75rem",
                    paddingBottom: "3.5rem",
                    backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent calc(1.75rem - 1px), ${palette.ruleBlue} calc(1.75rem - 1px), ${palette.ruleBlue} 1.75rem)`,
                    backgroundPositionY: "0.2rem",
                  }}
                >
                  <div
                    className="font-mono text-[10px] uppercase tracking-[0.22em]"
                    style={{ color: palette.contrast }}
                  >
                    Redo {String(idx + 1).padStart(2, '0')}
                  </div>
                  <RichProjectText
                    text={redo}
                    className="mt-5 max-w-[44rem] space-y-[1.75rem]"
                    paragraphClassName="text-[1.02rem] leading-[1.75rem] text-foreground"
                    strongClassName="font-semibold text-foreground"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
