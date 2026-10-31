const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

function workspace(filename) {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => {
    if (!error.message.includes('window.scrollTo')) errors.push(error);
  });
  const dom = new JSDOM(readFileSync(join(__dirname, '..', filename), 'utf8'), {
    runScripts: 'dangerously', virtualConsole,
    beforeParse(window) { window.scrollTo = () => {}; }
  });
  assert.deepEqual(errors, [], 'the prototype must initialize without script errors');
  return dom;
}

const names = doc => Array.from(doc.querySelectorAll('#case-list-container .ct-name'), node => node.textContent);

for (const filename of ['EZ-Follow-Prototype.html', 'EZ-Follow-App-Final-EN.html']) {
test(filename + ': ' + 'HR sees all eight cases; partner sees exactly their three assigned cases', () => {
  const dom = workspace(filename), w = dom.window, d = w.document;
  try {
    assert.equal(names(d).length, 8);
    d.getElementById('prototype-view-select').value = 'law-firm';
    d.getElementById('prototype-view-select').dispatchEvent(new w.Event('change'));
    assert.deepEqual(names(d), ['Michael Zhang', 'Sarah Johnson', 'Kevin Park']);
    assert.match(d.getElementById('cases-count').textContent, /3 cases assigned to Alex Morgan/);
    assert.equal(d.querySelector('.screen.active').id, 'screen-cases');
    assert.match(d.querySelector('.prototype-view small').textContent, /No backend access control/);
  } finally { dom.window.close(); }
});

test(filename + ': ' + 'search and type/status filters cannot expand the partner scope', () => {
  const dom = workspace(filename), w = dom.window, d = w.document;
  try {
    w.setPrototypeView('law-firm');
    const search = d.getElementById('case-search');
    search.value = 'David';
    search.dispatchEvent(new w.Event('input', { bubbles: true }));
    assert.deepEqual(names(d), []);
    assert.match(d.getElementById('case-list-container').textContent, /No matching cases/);
    search.value = '';
    search.dispatchEvent(new w.Event('input', { bubbles: true }));
    d.getElementById('case-filter-type').value = 'I-140';
    d.getElementById('case-filter-type').dispatchEvent(new w.Event('change', { bubbles: true }));
    assert.deepEqual(names(d), ['Sarah Johnson']);
    d.getElementById('case-filter-status').value = 'approved';
    d.getElementById('case-filter-status').dispatchEvent(new w.Event('change', { bubbles: true }));
    assert.deepEqual(names(d), []);
    w.setPrototypeView('hr');
    assert.equal(names(d).length, 8, 'returning to HR clears demo filters and restores all cases');
  } finally { dom.window.close(); }
});

test(filename + ': ' + 'switching from an unassigned open case leaves its details; direct opening is rejected', () => {
  const dom = workspace(filename), w = dom.window, d = w.document;
  try {
    w.openCase('c3');
    assert.equal(d.getElementById('cd-name').textContent, 'David Lee');
    w.setPrototypeView('law-firm');
    assert.equal(d.querySelector('.screen.active').id, 'screen-cases');
    w.openCase('c3');
    assert.equal(d.querySelector('.screen.active').id, 'screen-cases');
    assert.match(d.getElementById('prototype-view-status').textContent, /not assigned/);
    w.openCase('c2');
    assert.equal(d.querySelector('.screen.active').id, 'screen-case-detail');
    assert.equal(d.getElementById('cd-name').textContent, 'Sarah Johnson');
    assert.match(d.getElementById('cd-info-grid').textContent, /Alex Morgan/);
    assert.match(d.getElementById('cd-na-meta').textContent, /Assigned to Emily/, 'HR action owner is separate from law firm assignment');
    w.openCase('missing-case');
    assert.equal(d.querySelector('.screen.active').id, 'screen-cases');
  } finally { dom.window.close(); }
});

test(filename + ': ' + 'Today and its activity are scoped; unrelated modules are outside the partner demo', () => {
  const dom = workspace(filename), w = dom.window, d = w.document;
  try {
    w.setPrototypeView('law-firm');
    w.showScreen('dashboard');
    const today = d.getElementById('screen-dashboard').textContent;
    for (const hidden of ['David Lee', 'Emily Davis', 'James Wilson', 'Anna Wu']) {
      assert.ok(!today.includes(hidden), hidden + ' must not appear in partner Today');
    }
    assert.match(today, /Sarah Johnson/);
    assert.match(d.getElementById('today-sub').textContent, /1 item needs your attention/);
    w.showScreen('reports');
    assert.equal(d.querySelector('.screen.active').id, 'screen-cases');
    w.showScreen('settings');
    assert.equal(d.querySelector('.settings-section.active').id, 'set-roles');
    assert.equal(d.querySelector('[data-nav="tasks"]').hidden, true);
    w.openWizard();
    assert.equal(d.getElementById('wizard-overlay').style.display, 'none');
    w.setPrototypeView('hr');
    assert.equal(d.querySelector('[data-nav="tasks"]').hidden, false);
    w.showScreen('dashboard');
    assert.match(d.getElementById('dash-needs-attention').textContent, /David Lee/);
  } finally { dom.window.close(); }
});

}

test('mobile More keeps Settings reachable while hiding unrelated modules', () => {
  const dom = workspace('EZ-Follow-App-Final-EN.html'), w = dom.window, d = w.document;
  try {
    w.setPrototypeView('law-firm');
    assert.equal(d.getElementById('bnav-more').hidden, false);
    assert.equal(d.querySelector('.app-topbar .bell-btn').hidden, true);
    w.toggleMoreSheet(true);
    assert.ok(d.getElementById('more-sheet-overlay').classList.contains('open'));
    for (const name of ['documents', 'reports', 'contacts']) {
      assert.equal(d.querySelector('.more-item[data-nav="'+name+'"]').hidden, true);
    }
    d.querySelector('.more-item[data-nav="settings"]').click();
    assert.equal(d.querySelector('.screen.active').id, 'screen-settings');
    assert.equal(d.querySelector('.settings-section.active').id, 'set-roles');
    assert.equal(d.getElementById('more-sheet-overlay').classList.contains('open'), false);
    w.setPrototypeView('hr');
    assert.equal(d.querySelector('.app-topbar .bell-btn').hidden, false);
    assert.equal(names(d).length, 8);
  } finally { dom.window.close(); }
});
