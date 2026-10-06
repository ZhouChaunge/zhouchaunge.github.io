// Select collaborators from verified author roles, and fail rather than silently
// publishing a map that leaves out someone required by the owner's rule.
export function prepareCollaborationMap(data, publications, ownerName) {
  const rules = new Map();
  for (const paper of publications) {
    const names = String(paper.authors || '').split(',').map(name => name.trim()).filter(Boolean);
    const roles = paper.authorship;
    if (!names.includes(ownerName) || !roles || !Array.isArray(roles.firstAuthors) || !roles.firstAuthors.length || !Array.isArray(roles.correspondingAuthors)) {
      throw new Error(`Verified author roles are required for ${paper.id}.`);
    }
    for (const list of [roles.firstAuthors, roles.correspondingAuthors]) {
      if (new Set(list).size !== list.length || list.some(name => !names.includes(name))) {
        throw new Error(`Author-role names must match the author list for ${paper.id}.`);
      }
    }
    const ownerIsFirst = roles.firstAuthors.includes(ownerName);
    const expected = new Set((ownerIsFirst ? names : [...roles.firstAuthors, ...roles.correspondingAuthors]).filter(name => name !== ownerName));
    rules.set(paper.id, { names, roles, expected, found: new Set() });
  }

  const prepareLocation = location => {
    const institutions = (location.institutions || []).map(institution => {
      const collaborators = (institution.collaborators || []).map(person => {
        if (!Array.isArray(person.paperIds)) throw new Error(`Paper ids are required for ${person.name}.`);
        const papers = [...new Set(person.paperIds)].flatMap(id => {
          const rule = rules.get(id);
          if (!rule || !rule.names.includes(person.name)) throw new Error(`Unknown paper or author association: ${person.name} / ${id}.`);
          if (!rule.expected.has(person.name)) return [];
          rule.found.add(person.name);
          const roles = [];
          if (rule.roles.firstAuthors.includes(person.name)) roles.push('first');
          if (rule.roles.correspondingAuthors.includes(person.name)) roles.push('corresponding');
          if (!roles.length) roles.push('coauthor');
          return [{ id, roles }];
        });
        return { name: person.name, papers };
      }).filter(person => person.papers.length);
      if (new Set(collaborators.map(person => person.name)).size !== collaborators.length) {
        throw new Error(`Repeated collaborator within ${institution.name}.`);
      }
      return { ...institution, collaborators };
    }).filter(institution => institution.collaborators.length);
    return { ...location, institutions };
  };

  const home = prepareLocation(data.home);
  const locations = data.locations.map(prepareLocation).filter(location => location.institutions.length);
  for (const [id, rule] of rules) {
    const missing = [...rule.expected].filter(name => !rule.found.has(name));
    if (missing.length) throw new Error(`Missing required collaborators for ${id}: ${missing.join(', ')}.`);
  }
  return { ...data, home, locations };
}
