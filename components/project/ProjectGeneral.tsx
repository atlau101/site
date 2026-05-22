import React from 'react';
import Image from 'next/image';
import { ProjectData } from '@/lib/projects/types';
import { VisualsSlider } from './VisualsSlider';
import { ProjectDescription } from './ProjectDescription';

interface ProjectGeneralProps {
  project: ProjectData;
}

const palette = {
  base: 'oklch(0.9337 0.004688 142)',
  paper: 'oklch(0.978 0.002 106)',
  paperInset: 'oklch(0.949 0.004 108)',
  green: 'oklch(0.31 0.082 142)',
  ink: 'oklch(0.19 0.016 35)',
  line: 'oklch(0.79 0.008 110)',
};

export const ProjectGeneral: React.FC<ProjectGeneralProps> = ({ project }) => {
  return (
    <section
      className="w-full px-6 py-20 sm:px-8 lg:px-12"
      style={{ background: palette.base }}
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className="mb-2 font-heading text-3xl font-medium sm:text-4xl"
          style={{ color: palette.green }}
        >
          What I Built
        </h2>
        <div
          className="mb-12 h-px w-full"
          style={{ background: palette.line }}
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-16">
          <div className="md:col-span-3">
            <p
              className="annotation leading-[2.05] text-[0.92rem]"
              style={{ color: palette.ink, opacity: 0.72 }}
            >
              {project.tagline}
            </p>
          </div>

          <div
            className="md:col-span-9 border p-8 md:p-10"
            style={{ background: palette.paper, borderColor: palette.line }}
          >
            <div className="mb-8">
              <ProjectDescription
                lead={project.descriptionLead}
                body={project.description}
              />
            </div>

            {project.image && (
              <div className="mt-8">
                <div
                  className="relative aspect-video overflow-hidden border"
                  style={{
                    background: palette.paperInset,
                    borderColor: palette.line,
                  }}
                >
                  <Image
                    src={project.image}
                    alt={project.imageCaption || project.title}
                    fill
                    className="object-cover"
                  />
                </div>
                {project.imageCaption && (
                  <p
                    className="annotation mt-4 text-[0.8rem]"
                    style={{ color: palette.ink, opacity: 0.72 }}
                  >
                    {project.imageCaption}
                  </p>
                )}
              </div>
            )}

            {project.visuals && project.visuals.length > 0 && (
              <div
                className="mt-8 border-t pt-8"
                style={{ borderColor: palette.line }}
              >
                <VisualsSlider key={project.slug} visuals={project.visuals} />
              </div>
            )}
          </div>
        </div>

        {project.outputs && project.outputs.length > 0 && (
          <div
            className="grid grid-cols-1 gap-0 border-y md:grid-cols-3"
            style={{ borderColor: palette.line }}
          >
            {project.outputs.map((output, idx) => (
              <div
                key={idx}
                className={`py-6 ${idx > 0 ? 'border-t md:border-t-0 md:pl-8' : ''}`}
                style={idx > 0 ? { borderColor: palette.line } : undefined}
              >
                <p
                  className="mb-2 font-heading text-sm font-medium md:text-base"
                  style={{ color: palette.ink, opacity: 0.68 }}
                >
                  {output.label}
                </p>
                <p
                  className="font-heading text-lg font-normal italic md:text-xl"
                  style={{ color: palette.ink }}
                >
                  {output.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
