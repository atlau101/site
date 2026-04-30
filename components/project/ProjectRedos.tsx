import React from 'react';
import { ProjectData } from '@/lib/projects/types';
import { RichProjectText } from './RichProjectText';

interface ProjectRedosProps {
  project: ProjectData;
}

export const ProjectRedos: React.FC<ProjectRedosProps> = ({ project }) => {
  if (!project.redos || project.redos.length === 0) return null;

  return (
    <section className="w-full py-20 px-6 sm:px-8 lg:px-12 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Section heading with annotation */}
        <div className="mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-medium text-primary mb-2">
            What I&apos;d Do Differently
          </h2>
          <p className="annotation text-muted-foreground">POST-PROJECT REFLECTION</p>
        </div>

        {/* Redos items */}
        <div className="space-y-0">
          {project.redos.map((redo, idx) => (
            <div key={idx} className={idx > 0 ? 'rule-h-faint pt-8' : ''}>
              <div className="pb-8 grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Number label */}
                <div className="md:col-span-1">
                  <p className="annotation text-primary font-semibold">
                    {String(idx + 1).padStart(2, '0')}
                  </p>
                </div>

                {/* Content */}
                <div className="md:col-span-11">
                  <RichProjectText
                    text={redo}
                    className="space-y-4 max-w-3xl"
                    paragraphClassName="text-[1.02rem] leading-8 text-foreground"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
