import React from 'react';
import Image from 'next/image';
import { ProjectData } from '@/lib/projects/types';
import { VisualsSlider } from './VisualsSlider';

interface ProjectGeneralProps {
  project: ProjectData;
}

export const ProjectGeneral: React.FC<ProjectGeneralProps> = ({ project }) => {
  return (
    <section className="w-full py-20 px-6 sm:px-8 lg:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section heading */}
        <h2 className="font-heading text-3xl sm:text-4xl font-medium text-primary mb-2">
          What I Built
        </h2>
        <div className="rule-h mb-12" />

        {/* Two-column layout: tagline (left) + description + image (right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-16">
          {/* Left: 1-sentence tagline in mono */}
          <div className="md:col-span-3">
            <p className="annotation text-muted-foreground leading-loose">
              {project.tagline}
            </p>
          </div>

          {/* Right: description + image + visuals in paper-container panel */}
          <div className="md:col-span-9 bg-paper-container p-8 md:p-12">
            <p className="font-heading text-lg md:text-xl font-normal leading-relaxed text-foreground mb-8">
              {project.description}
            </p>

            {/* Image with caption */}
            {project.image && (
              <div className="mt-8">
                <div className="relative aspect-video bg-paper-dim overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.imageCaption || project.title}
                    fill
                    className="object-cover"
                  />
                </div>
                {project.imageCaption && (
                  <p className="annotation text-muted-foreground mt-3">
                    {project.imageCaption}
                  </p>
                )}
              </div>
            )}

            {/* Visuals slider — embedded in panel */}
            {project.visuals && project.visuals.length > 0 && (
              <div className="mt-8 pt-8 border-t border-rule/50">
                <VisualsSlider visuals={project.visuals} />
              </div>
            )}
          </div>
        </div>

        {/* Output stats strip below description */}
        {project.outputs && project.outputs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 rule-h">
            {project.outputs.map((output, idx) => (
              <div
                key={idx}
                className={`py-6 ${idx > 0 ? 'border-t border-rule/50 md:border-t-0 md:pl-8' : ''}`}
              >
                <p className="annotation text-muted-foreground mb-2">
                  {output.label}
                </p>
                <p className="font-heading text-lg md:text-xl font-normal italic text-foreground">
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
