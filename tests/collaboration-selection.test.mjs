import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareCollaborationMap } from '../lib/collaboration-selection.mjs';

const owner = 'Owner';
const paper = (id, authors, firstAuthors, correspondingAuthors = []) => ({ id, authors, authorship: { firstAuthors, correspondingAuthors } });
const data = collaborators => ({ home: { id: 'home', institutions: [{ name: 'Home university', collaborators }] }, locations: [] });
const person = (name, ...paperIds) => ({ name, paperIds });

test('first-authored papers include every other author, including local collaborators', () => {
  const papers = [paper('one', 'Owner, Alice, Bob', ['Owner'], ['Bob'])];
  const result = prepareCollaborationMap(data([person('Alice', 'one'), person('Bob', 'one'), person('Owner', 'one')]), papers, owner);
  assert.deepEqual(result.home.institutions[0].collaborators, [
    { name: 'Alice', papers: [{ id: 'one', roles: ['coauthor'] }] },
    { name: 'Bob', papers: [{ id: 'one', roles: ['corresponding'] }] },
  ]);
});

test('coauthored papers retain co-first and corresponding authors, deduplicate roles and remove empty cities', () => {
  const papers = [paper('two', 'Alice, Bob, Owner, Carol, David', ['Alice', 'Bob'], ['Alice', 'David'])];
  const input = data([person('Alice', 'two', 'two'), person('Bob', 'two'), person('David', 'two')]);
  input.locations = [{ id: 'excluded-city', institutions: [{ name: 'Other institution', collaborators: [person('Carol', 'two')] }] }];
  const result = prepareCollaborationMap(input, papers, owner);
  assert.equal(result.locations.length, 0);
  assert.deepEqual(result.home.institutions[0].collaborators[0].papers, [{ id: 'two', roles: ['first', 'corresponding'] }]);
  assert.equal(result.home.institutions[0].collaborators.length, 3);
});

test('eligibility is evaluated per paper, not globally for each person', () => {
  const papers = [paper('one', 'Owner, Alice', ['Owner']), paper('two', 'Bob, Owner, Alice', ['Bob'], ['Bob'])];
  const result = prepareCollaborationMap(data([person('Alice', 'one', 'two'), person('Bob', 'two')]), papers, owner);
  assert.deepEqual(result.home.institutions[0].collaborators[0].papers, [{ id: 'one', roles: ['coauthor'] }]);
});

test('build fails on missing required people, unverified roles, or mismatched author records', () => {
  assert.throws(() => prepareCollaborationMap(data([]), [paper('one', 'Owner, Alice', ['Owner'])], owner), /Missing required collaborators.*Alice/);
  assert.throws(() => prepareCollaborationMap(data([]), [{ id: 'one', authors: 'Owner' }], owner), /Verified author roles/);
  assert.throws(() => prepareCollaborationMap(data([]), [paper('one', 'Owner, Alice', ['Someone else'])], owner), /must match/);
  assert.throws(() => prepareCollaborationMap(data([person('Bob', 'one')]), [paper('one', 'Owner, Alice', ['Owner'])], owner), /Unknown paper or author/);
});

test('one author can be represented at multiple paper-supported institutions without losing coverage', () => {
  const papers = [paper('one', 'Owner, Alice', ['Owner'])];
  const input = data([person('Alice', 'one')]);
  input.locations = [{ id: 'second-city', institutions: [{ name: 'Second university', collaborators: [person('Alice', 'one')] }] }];
  const result = prepareCollaborationMap(input, papers, owner);
  assert.equal(result.home.institutions[0].collaborators[0].name, 'Alice');
  assert.equal(result.locations[0].institutions[0].collaborators[0].name, 'Alice');
});
