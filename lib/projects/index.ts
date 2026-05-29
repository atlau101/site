import { ProjectData } from './types';
import { chambergptProject } from './chambergpt';
import { fillmoreProject } from './fillmore';
import { bus315Project } from './bus315-data-mining';
import { uberAnalyticsProject } from './uber-analytics';
import { wildfireMLProject } from './wildfire-ml';
import { malloyRebrandlyProject } from './malloy-rebrandly';
import { malloyAmalProject } from './malloy-amal';
import { malloyNobleNoteProject } from './malloy-noble-note';
import { lmuDatathonProject } from './lmu-datathon';
import { sbaCreditDesertsProject } from './sba-credit-deserts';
import { vibeCodingProject } from './vibe-coding';

export const projectRegistry: Record<string, ProjectData> = {
  'sba-credit-deserts': sbaCreditDesertsProject,
  chambergpt: chambergptProject,
  fillmore: fillmoreProject,
  'bus315-data-mining': bus315Project,
  'uber-analytics': uberAnalyticsProject,
  'wildfire-ml': wildfireMLProject,
  'lmu-datathon': lmuDatathonProject,
  'vibe-coding': vibeCodingProject,
  'malloy-rebrandly': malloyRebrandlyProject,
  'malloy-amal': malloyAmalProject,
  'malloy-noble-note': malloyNobleNoteProject,
};

export function getProject(slug: string): ProjectData | null {
  return projectRegistry[slug] ?? null;
}

export function getProjectSlugs(): string[] {
  return Object.keys(projectRegistry);
}
