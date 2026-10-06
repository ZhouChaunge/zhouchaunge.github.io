import { readFileSync } from 'node:fs';

const WIDTH = 800;
const HEIGHT = 340;
const NORTH = 85;
const SOUTH = -68;
const land = JSON.parse(readFileSync(new URL('../assets/map/ne_110m_land.geojson', import.meta.url), 'utf8'));
const escape = (value = '') => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const idPattern = /^[a-z][a-z0-9-]*$/;

export function projectCoordinate(longitude, latitude) {
  if (!Number.isFinite(longitude) || !Number.isFinite(latitude) || longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
    throw new Error('Collaboration map coordinates must be valid numeric longitude and latitude.');
  }
  return [(longitude + 180) / 360 * WIDTH, (NORTH - latitude) / (NORTH - SOUTH) * HEIGHT];
}

const point = coordinate => projectCoordinate(...coordinate).map(value => value.toFixed(1)).join(',');
const ringPath = ring => `${ring.map((coordinate, index) => `${index ? 'L' : 'M'}${point(coordinate)}`).join('')}Z`;
const landPath = land.features.map(feature => {
  const polygons = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;
  return polygons.map(polygon => polygon.map(ringPath).join('')).join('');
}).join('');

function validate(data, publications) {
  if (!data?.home || !Array.isArray(data.locations) || data.locations.length === 0) {
    throw new Error('Collaboration map needs a home and at least one location.');
  }
  const ids = new Set();
  for (const location of [data.home, ...data.locations]) {
    if (typeof location.id !== 'string' || !idPattern.test(location.id) || ids.has(location.id)) throw new Error('Collaboration map location ids must be unique slugs.');
    ids.add(location.id);
    if (!location.city || !location.country) throw new Error('Collaboration map locations need a city and country.');
    projectCoordinate(location.longitude, location.latitude);
    if (location.latitude < SOUTH || location.latitude > NORTH) throw new Error('Collaboration location lies outside the map latitude range.');
    if (location.labelOffset !== undefined && (!Array.isArray(location.labelOffset) || location.labelOffset.length !== 2 || !location.labelOffset.every(Number.isFinite))) {
      throw new Error('Collaboration map labelOffset must be an array of two finite numbers.');
    }
  }
  const paperIds = new Set(publications.map(paper => paper.id));
  for (const location of data.locations) {
    if (!location.institutions?.length) throw new Error('Each collaboration location needs an institution.');
    for (const institution of location.institutions) {
      if (!institution.name || !institution.collaborators?.length) throw new Error('Collaboration institutions need a name and collaborators.');
      if (institution.url && !/^https:\/\//.test(institution.url)) throw new Error('Institution URLs must use HTTPS.');
      for (const collaborator of institution.collaborators) {
        if (!collaborator.name || !collaborator.paperIds?.length) throw new Error('Collaborators need a name and at least one paper.');
        for (const id of collaborator.paperIds) {
          if (!idPattern.test(id) || !paperIds.has(id)) throw new Error(`Unknown collaboration paper: ${id}`);
        }
      }
    }
  }
}

/** Render a fully readable static map; collaboration-map.js adds city selection. */
export function renderCollaborationMap(data, publications = []) {
  validate(data, publications);
  const papers = new Map(publications.map(paper => [paper.id, paper]));
  const home = data.home;
  const [homeX, homeY] = projectCoordinate(home.longitude, home.latitude);
  const curves = data.locations.map(location => {
    const [x, y] = projectCoordinate(location.longitude, location.latitude);
    const controlX = (homeX + x) / 2 - Math.min(60, Math.abs(homeX - x) * 0.13);
    const controlY = (homeY + y) / 2 - Math.min(65, Math.abs(homeY - y) * 0.3);
    return `<path class="collaboration-route" data-map-location="${location.id}" d="M${homeX.toFixed(1)},${homeY.toFixed(1)} Q${controlX.toFixed(1)},${controlY.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}"/>`;
  }).join('');
  const markers = data.locations.map((location, index) => {
    const [x, y] = projectCoordinate(location.longitude, location.latitude);
    const [labelX, labelY] = location.labelOffset ?? [10, 4];
    const labelAnchor = labelX < 0 ? 'end' : labelX > 0 ? 'start' : 'middle';
    return `<g class="collaboration-marker" data-map-location="${location.id}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><title>${escape(location.city)}, ${escape(location.country)}</title><circle class="collaboration-marker-halo" r="11"/><circle class="collaboration-marker-dot" r="5"/><text class="collaboration-marker-number" x="${labelX}" y="${labelY}" text-anchor="${labelAnchor}">${index + 1}</text></g>`;
  }).join('');
  const buttons = data.locations.map((location, index) => `<button type="button" class="collaboration-location-button" data-collaboration-location="${location.id}" aria-controls="collaboration-detail-${location.id}" aria-pressed="false"><span class="collaboration-number" aria-hidden="true">${index + 1}</span>${escape(location.city)}</button>`).join('');
  const details = data.locations.map((location, index) => `<article class="collaboration-detail" id="collaboration-detail-${location.id}" data-collaboration-detail="${location.id}" aria-labelledby="collaboration-heading-${location.id}">
    <h3 id="collaboration-heading-${location.id}"><span class="collaboration-detail-number">${index + 1} · </span>${escape(location.city)}<span class="collaboration-country">, ${escape(location.country)}</span></h3>
    ${location.institutions.map(institution => `<div class="collaboration-institution"><p class="collaboration-institution-name">${institution.url ? `<a href="${escape(institution.url)}">${escape(institution.name)}</a>` : escape(institution.name)}</p>
      <p class="collaboration-person">${institution.collaborators.map(person => escape(person.name)).join(', ')}</p>
      <ul class="collaboration-papers">${[...new Set(institution.collaborators.flatMap(person => person.paperIds))].map(id => `<li><a href="#pub-${id}">${escape(papers.get(id).title)}</a></li>`).join('')}</ul>
    </div>`).join('')}
  </article>`).join('');
  return `<div class="collaboration-map" data-collaboration-map>
    <figure class="collaboration-figure">
      <svg class="collaboration-world" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-labelledby="collaboration-map-title collaboration-map-description">
        <title id="collaboration-map-title">Coauthor affiliations</title>
        <desc id="collaboration-map-description">Lines connect ${escape(home.city)} to ${escape(data.locations.map(location => location.city).join(', '))}. Numbered locations and their coauthored papers are listed below.</desc>
        <defs><clipPath id="collaboration-map-clip"><rect width="${WIDTH}" height="${HEIGHT}" rx="12"/></clipPath></defs>
        <g clip-path="url(#collaboration-map-clip)">
          <rect class="collaboration-ocean" width="${WIDTH}" height="${HEIGHT}"/>
          <path class="collaboration-land" d="${landPath}" fill-rule="evenodd"/>
          <g class="collaboration-routes">${curves}</g>
          ${markers}
          <g class="collaboration-home" transform="translate(${homeX.toFixed(1)} ${homeY.toFixed(1)})"><circle r="9"/><circle class="collaboration-home-dot" r="4"/><text x="-13" y="5" text-anchor="end">${escape(home.city)}</text></g>
        </g>
      </svg>
      <figcaption>Based in ${escape(home.city)} · ${escape(home.institution || '')}</figcaption>
    </figure>
    <div class="collaboration-controls" role="group" aria-label="Explore coauthor affiliations by city" hidden>${buttons}</div>
    <p class="collaboration-selection-status" role="status" aria-live="polite" aria-atomic="true" hidden></p>
    <div class="collaboration-details">${details}</div>
    <p class="collaboration-map-credit">Institutions represented in selected coauthored papers. Map: <a href="https://www.naturalearthdata.com/">Natural Earth</a>.</p>
  </div>`;
}
