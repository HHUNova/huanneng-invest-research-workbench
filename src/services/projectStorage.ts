import type { SavedProject } from "../types";

const storageKey = "huanneng_saved_projects";

export function listSavedProjects(): SavedProject[] {
  const raw = window.localStorage.getItem(storageKey);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as SavedProject[];
  } catch {
    return [];
  }
}

export function saveProject(project: SavedProject) {
  const projects = listSavedProjects();
  const nextProjects = [project, ...projects.filter((item) => item.id !== project.id)].slice(0, 12);
  window.localStorage.setItem(storageKey, JSON.stringify(nextProjects));
  return nextProjects;
}

export function clearSavedProjects() {
  window.localStorage.removeItem(storageKey);
}
