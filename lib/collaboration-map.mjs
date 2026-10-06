import { readFileSync } from 'node:fs';

const WIDTH = 800;
const HEIGHT = 340;
const NORTH = 85;
const SOUTH = -68;
const land = JSON.parse(readFileSync(new URL('../assets/map/ne_110m_land.geojson', import.meta.url), 'utf8'));
const escape = (value = '') => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const idPattern = /^[a-z][a-z0-9-]*$/;
const authorRoles = new Set(['first', 'corresponding', 'coauthor']);
const selectableLocations = data => data.home.institutions?.length ? [data.home, ...data.locations] : data.locations;

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
  if (!data?.home || !Array.isArray(data.locations) || (!data.locations.length && !data.home.institutions?.length)) {
    throw new Error('Collaboration map needs a home and at least one location with collaborators.');
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
  for (const location of selectableLocations(data)) {
    if (!location.institutions?.length) throw new Error('Each collaboration location needs an institution.');
    for (const institution of location.institutions) {
      if (!institution.name || !institution.collaborators?.length) throw new Error('Collaboration institutions need a name and collaborators.');
      if (institution.url && !/^https:\/\//.test(institution.url)) throw new Error('Institution URLs must use HTTPS.');
      for (const collaborator of institution.collaborators) {
        if (!collaborator.name || !Array.isArray(collaborator.papers) || !collaborator.papers.length) throw new Error('Collaborators need a name and at least one paper.');
        const linkedIds = new Set();
        for (const { id, roles } of collaborator.papers) {
          if (!idPattern.test(id) || !paperIds.has(id)) throw new Error(`Unknown collaboration paper: ${id}`);
          if (linkedIds.has(id)) throw new Error(`Duplicate collaboration paper for ${collaborator.name}: ${id}`);
          linkedIds.add(id);
          if (!Array.isArray(roles) || !roles.length || roles.some(role => !authorRoles.has(role)) || new Set(roles).size !== roles.length) {
            throw new Error(`Collaboration paper roles must be distinct first, corresponding, or coauthor values: ${id}`);
          }
        }
      }
    }
  }
}

// These label positions separate neighbouring cities; geographic markers stay put.
const labelPositions = {
  melbourne: { wide: [700, 292], narrow: [700, 320] },
  singapore: { wide: [620, 212], narrow: [625, 240] },
  oslo: { wide: [422, 44], narrow: [420, 50] },
  hefei: { wide: [570, 91], narrow: [560, 85] },
  beijing: { wide: [690, 63], narrow: [700, 70] },
  shanghai: { wide: [735, 139], narrow: [720, 147] },
  chengdu: { wide: [540, 150], narrow: [545, 160] },
};

/** Render geographic points with native HTML controls, outside the static SVG. */
export function renderCollaborationMap(data, publications = []) {
  validate(data, publications);
  const home = data.home;
  const locations = selectableLocations(data);
  const [homeX, homeY] = projectCoordinate(home.longitude, home.latitude);
  const curves = data.locations.map(location => {
    const [x, y] = projectCoordinate(location.longitude, location.latitude);
    const controlX = (homeX + x) / 2 - Math.min(60, Math.abs(homeX - x) * 0.13);
    const controlY = (homeY + y) / 2 - Math.min(65, Math.abs(homeY - y) * 0.3);
    return `<path class="collaboration-route" data-map-location="${location.id}" d="M${homeX.toFixed(1)},${homeY.toFixed(1)} Q${controlX.toFixed(1)},${controlY.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}"/>`;
  }).join('');
  const markers = [home, ...data.locations].map(location => {
    const [x, y] = projectCoordinate(location.longitude, location.latitude);
    return `<g class="collaboration-marker${location === home ? ' collaboration-home' : ''}" data-map-location="${location.id}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><circle class="collaboration-marker-halo" r="9"/><circle class="collaboration-marker-dot" r="4"/></g>`;
  }).join('');
  const layout = locations.map(location => {
    const coordinate = projectCoordinate(location.longitude, location.latitude);
    const fallback = coordinate.map((value, index) => value + (location.labelOffset?.[index] || 0));
    return { location, coordinate, ...(labelPositions[location.id] || { wide: fallback, narrow: fallback }) };
  });
  const leaders = layout.map(({ location, coordinate: [x, y], wide, narrow }) => ['wide', 'narrow'].map(mode => {
    const [labelX, labelY] = mode === 'wide' ? wide : narrow;
    return `<line class="collaboration-label-line is-${mode}" data-map-location="${location.id}" x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${labelX}" y2="${labelY}"/>`;
  }).join('')).join('');
  const buttons = layout.map(({ location, wide: [x, y], narrow: [mobileX, mobileY] }) => `<button type="button" class="collaboration-map-pin" data-collaboration-location="${location.id}" aria-label="${escape(location.city)}, ${escape(location.country)}" aria-expanded="false" aria-controls="collaboration-popup-${location.id}" style="--pin-x:${(x / WIDTH * 100).toFixed(3)}%;--pin-y:${(y / HEIGHT * 100).toFixed(3)}%;--mobile-pin-x:${((mobileX - 300) / 500 * 100).toFixed(3)}%;--mobile-pin-y:${((mobileY + 25) / 400 * 100).toFixed(3)}%" hidden>${escape(location.city)}</button>`).join('');
  const popups = locations.map(location => `<div class="collaboration-map-popup" id="collaboration-popup-${location.id}" data-collaboration-popup="${location.id}" role="tooltip" hidden><h3>${escape(location.city)}<span class="collaboration-country">, ${escape(location.country)}</span></h3><ul>${location.institutions.map(institution => `<li>${escape(institution.name)}</li>`).join('')}</ul></div>`).join('');
  return `<div class="collaboration-map" data-collaboration-map>
    <div class="collaboration-map-stage">
      <svg class="collaboration-world" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-labelledby="collaboration-map-title collaboration-map-description">
        <title id="collaboration-map-title">Research collaboration locations</title>
        <desc id="collaboration-map-description">${data.locations.length ? `Lines connect ${escape(home.city)} to ${escape(data.locations.map(location => location.city).join(', '))}. ` : ''}Explore each labelled location to view its institutions.</desc>
        <rect class="collaboration-ocean" x="0" y="-25" width="800" height="400"/>
        <path class="collaboration-land" d="${landPath}" fill-rule="evenodd"/>
        <g class="collaboration-routes">${curves}</g>
        <g class="collaboration-label-lines">${leaders}</g>
        ${markers}
      </svg>
      <div class="collaboration-map-pins" role="group" aria-label="Explore research collaborations by city">${buttons}</div>
    </div>
    ${popups}
    <p class="collaboration-map-credit">Hover, focus or tap a location · <a href="https://github.com/ZhouChaunge/zhouchaunge.github.io/blob/main/docs/map-sources.md">Sources</a> · <a href="https://www.naturalearthdata.com/">Natural Earth</a></p>
    <noscript><p class="collaboration-map-credit">Enable JavaScript to explore the institutions on this map.</p></noscript>
  </div>`;
}
