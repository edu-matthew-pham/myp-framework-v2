import type { SubjectData } from '$lib/state/subject.svelte';

const cache = new Map<string, SubjectData>();

export async function loadSubject(file: string): Promise<SubjectData> {
  if (cache.has(file)) return cache.get(file)!;
  const res = await fetch(`/data/${file}`);
  if (!res.ok) throw new Error(`Failed to load ${file}`);
  const data: SubjectData = await res.json();
  cache.set(file, data);
  return data;
}
