// ============================================================
// DATA
// ============================================================
const CATEGORIES = {
  'Food & Dining':   { color: '#ff6b6b', emoji: '🍜' },
  'Shopping':        { color: '#ffb36b', emoji: '🛍️' },
  'Transport':       { color: '#6bb5ff', emoji: '🚌' },
  'Entertainment':   { color: '#b36bff', emoji: '🎬' },
  'Health':          { color: '#6bffe0', emoji: '💊' },
  'Utilities':       { color: '#6bffb8', emoji: '⚡' },
  'Salary':          { color: '#c8f56a', emoji: '💰' },
  'Freelance':       { color: '#a3d44f', emoji: '💻' },
  'Other':           { color: '#9a9a96', emoji: '📦' },
};

let transactions = JSON.parse(localStorage.getItem('ledger_txns') || 'null') || [
  { id:1,  merchant:'Monthly Salary',     category:'Salary',          type:'income',  amount:85000, date:'2026-03-01' },
  { id:2,  merchant:'Amazon Shopping',    category:'Shopping',        type:'expense', amount:3200,  date:'2026-03-02' },
  { id:3,  merchant:'Swiggy Order',       category:'Food & Dining',   type:'expense', amount:480,   date:'2026-03-03' },
  { id:4,  merchant:'Zomato',             category:'Food & Dining',   type:'expense', amount:650,   date:'2026-03-05' },
  { id:5,  merchant:'Uber',               category:'Transport',       type:'expense', amount:320,   date:'2026-03-06' },
  { id:6,  merchant:'Netflix',            category:'Entertainment',   type:'expense', amount:649,   date:'2026-03-07' },
  { id:7,  merchant:'Freelance Project',  category:'Freelance',       type:'income',  amount:22000, date:'2026-03-08' },
  { id:8,  merchant:'D-Mart Groceries',   category:'Food & Dining',   type:'expense', amount:1800,  date:'2026-03-10' },
  { id:9,  merchant:'Electricity Bill',   category:'Utilities',       type:'expense', amount:1240,  date:'2026-03-11' },
  { id:10, merchant:'Rapido',             category:'Transport',       type:'expense', amount:180,   date:'2026-03-12' },
  { id:11, merchant:'Pharmacy',           category:'Health',          type:'expense', amount:850,   date:'2026-03-13' },
  { id:12, merchant:'Myntra',             category:'Shopping',        type:'expense', amount:2100,  date:'2026-03-15' },
  { id:13, merchant:'Gym Membership',     category:'Health',          type:'expense', amount:1500,  date:'2026-03-16' },
  { id:14, merchant:'Spotify',            category:'Entertainment',   type:'expense', amount:119,   date:'2026-03-17' },
  { id:15, merchant:'Book - Figma Guide', category:'Other',           type:'expense', amount:299,   date:'2026-03-18' },
  { id:16, merchant:'Ola Cab',            category:'Transport',       type:'expense', amount:410,   date:'2026-03-19' },
  { id:17, merchant:'Internet Bill',      category:'Utilities',       type:'expense', amount:999,   date:'2026-03-20' },
  { id:18, merchant:'Freelance Payment',  category:'Freelance',       type:'income',  amount:15000, date:'2026-03-21' },
  { id:19, merchant:'Pizza Hut',          category:'Food & Dining',   type:'expense', amount:890,   date:'2026-03-22' },
  { id:20, merchant:'Flipkart',           category:'Shopping',        type:'expense', amount:4500,  date:'2026-03-23' },
  { id:21, merchant:'Monthly Salary',     category:'Salary',          type:'income',  amount:85000, date:'2026-02-01' },
  { id:22, merchant:'Rent',               category:'Utilities',       type:'expense', amount:18000, date:'2026-02-02' },
  { id:23, merchant:'Zomato',             category:'Food & Dining',   type:'expense', amount:720,   date:'2026-02-05' },
  { id:24, merchant:'Movie Tickets',      category:'Entertainment',   type:'expense', amount:1200,  date:'2026-02-08' },
  { id:25, merchant:'Freelance Project',  category:'Freelance',       type:'income',  amount:18000, date:'2026-02-10' },
  { id:26, merchant:'BigBasket',          category:'Food & Dining',   type:'expense', amount:2200,  date:'2026-02-14' },
  { id:27, merchant:'Amazon',             category:'Shopping',        type:'expense', amount:5600,  date:'2026-02-17' },
  { id:28, merchant:'Doctor Visit',       category:'Health',          type:'expense', amount:600,   date:'2026-02-20' },
  { id:29, merchant:'Monthly Salary',     category:'Salary',          type:'income',  amount:85000, date:'2026-01-01' },
  { id:30, merchant:'Electricity',        category:'Utilities',       type:'expense', amount:1100,  date:'2026-01-05' },
  { id:31, merchant:'Shopping Mall',      category:'Shopping',        type:'expense', amount:7200,  date:'2026-01-10' },
  { id:32, merchant:'Swiggy',             category:'Food & Dining',   type:'expense', amount:1100,  date:'2026-01-15' },
  { id:33, merchant:'Freelance',          category:'Freelance',       type:'income',  amount:12000, date:'2026-01-20' },
];

let nextId = Math.max(...transactions.map(t => t.id)) + 1;
let currentRole = 'admin';
let typeFilter = 'all';
let catFilter = 'all';
let sortMode = 'date-desc';
let currentPage = 1;
let editingId = null;
const PER_PAGE = 10;

let trendChart, donutChart, barChart, trendRange = '3m';

// ============================================================
// SAVE / LOAD
// ============================================================
function save() { localStorage.setItem('ledger_txns', JSON.stringify(transactions)); }

// ============================================================
// INIT
// ============================================================
window.onload = () => {
  document.getElementById('dashDate').textContent =
    new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  setTodayDate();
  buildCatFilters();
  updateAll();
  document.getElementById('txnBadge').textContent = transactions.length;
};

function setTodayDate() {
  const d = new Date();
  document.getElementById('fDate').value = d.toISOString().split('T')[0];
}

// ============================================================
// NAVIGATION
// ============================================================
function showPage(id, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  el.classList.add('active');
  document.getElementById('topbarTitle').textContent = el.textContent.trim().replace(/\d+$/, '').trim();
  if (id === 'transactions') renderTransactions();
  if (id === 'insights') renderInsights();
  closeSidebar();
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('show');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('show');
}

// ============================================================
// THEME
// ============================================================
function toggleTheme() {
  document.body.classList.toggle('light');
  localStorage.setItem('ledger_theme', document.body.classList.contains('light') ? 'light' : 'dark');
  rebuildCharts();
}
if (localStorage.getItem('ledger_theme') === 'light') document.body.classList.add('light');

// ============================================================
// ROLE
// ============================================================
function switchRole(role) {
  currentRole = role;
  const badge = document.getElementById('roleBadge');
  badge.textContent = role === 'admin' ? '● Admin Access' : '● Viewer Mode';
  badge.className = 'role-badge' + (role === 'viewer' ? ' viewer' : '');
  document.getElementById('addTxnBtn').classList.toggle('hidden', role === 'viewer');
  document.getElementById('actionsHeader').textContent = role === 'admin' ? 'Actions' : '';
  renderTransactions();
}

// ============================================================
// CALCULATIONS
// ============================================================
function fmt(n) { return '₹' + Math.abs(n).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }); }
function fmtSigned(n) { return (n >= 0 ? '+' : '-') + '₹' + Math.abs(n).toLocaleString('en-IN', { minimumFractionDigits: 0 }); }

function getMonthTxns(month) {
  // month: 'YYYY-MM'
  return transactions.filter(t => t.date.startsWith(month));
}

function getStats() {
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s,t) => s+t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s,t) => s+t.amount, 0);
  const balance = totalIncome - totalExpense;

  const curMonth = '2026-03';
  const prevMonth = '2026-02';
  const curTxns = getMonthTxns(curMonth);
  const prevTxns = getMonthTxns(prevMonth);
  const curBalance = curTxns.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0) - curTxns.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
  const prevBalance = prevTxns.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0) - prevTxns.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);

  return { totalIncome, totalExpense, balance, curBalance, prevBalance };
}

function getCatBreakdown() {
  const exp = transactions.filter(t => t.type === 'expense');
  const total = exp.reduce((s,t) => s+t.amount, 0);
  const cats = {};
  exp.forEach(t => { cats[t.category] = (cats[t.category]||0) + t.amount; });
  return Object.entries(cats).map(([name,amt]) => ({ name, amt, pct: total ? (amt/total*100).toFixed(1) : 0 }))
    .sort((a,b) => b.amt - a.amt);
}

// ============================================================
// UPDATE ALL
// ============================================================
function updateAll() {
  const { totalIncome, totalExpense, balance, curBalance, prevBalance } = getStats();
  const diff = curBalance - prevBalance;

  document.getElementById('cardBalance').textContent = fmt(balance);
  document.getElementById('cardIncome').textContent = fmt(totalIncome);
  document.getElementById('cardExpense').textContent = fmt(totalExpense);
  document.getElementById('cardBalanceChg').textContent = fmtSigned(diff);
  document.getElementById('cardBalanceChg').className = 'chg-val ' + (diff >= 0 ? 'up' : 'down');

  const curIncome = transactions.filter(t=>t.date.startsWith('2026-03')&&t.type==='income').reduce((s,t)=>s+t.amount,0);
  const prevIncome = transactions.filter(t=>t.date.startsWith('2026-02')&&t.type==='income').reduce((s,t)=>s+t.amount,0);
  const incDiff = curIncome - prevIncome;
  document.getElementById('cardIncomeChg').textContent = fmtSigned(incDiff);
  document.getElementById('cardIncomeChg').className = 'chg-val ' + (incDiff >= 0 ? 'up' : 'down');

  const curExp = transactions.filter(t=>t.date.startsWith('2026-03')&&t.type==='expense').reduce((s,t)=>s+t.amount,0);
  const prevExp = transactions.filter(t=>t.date.startsWith('2026-02')&&t.type==='expense').reduce((s,t)=>s+t.amount,0);
  const expDiff = curExp - prevExp;
  document.getElementById('cardExpenseChg').textContent = fmtSigned(expDiff);
  document.getElementById('cardExpenseChg').className = 'chg-val ' + (expDiff <= 0 ? 'up' : 'down');

  document.getElementById('txnBadge').textContent = transactions.length;

  renderTrendChart();
  renderDonutChart();
  renderCatProgress();
}

// ============================================================
// CHARTS
// ============================================================
const gridColor = () => 'rgba(255,255,255,0.06)';
const textColor2 = () => '#9a9a96';

function renderTrendChart() {
  const months = ['2025-04','2025-05','2025-06','2025-07','2025-08','2025-09','2025-10','2025-11','2025-12','2026-01','2026-02','2026-03'];
  // Base running balances (simulated history for earlier months)
  const baseBalances = [12000,18500,25000,19000,31000,38000,42000,37000,50000,null,null,null];

  const labels3m = ['Jan', 'Feb', 'Mar'];
  const labels6m = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const labels1y = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'];

  let labelSet, monthSet, startIdx;
  if (trendRange === '3m') { labelSet = labels3m; monthSet = months.slice(9); startIdx = 9; }
  else if (trendRange === '6m') { labelSet = labels6m; monthSet = months.slice(6); startIdx = 6; }
  else { labelSet = labels1y; monthSet = months; startIdx = 0; }

  const data = monthSet.map((m, i) => {
    const absIdx = startIdx + i;
    if (baseBalances[absIdx] !== null) return baseBalances[absIdx];
    // compute from transactions
    const inc = transactions.filter(t=>t.date.startsWith(m)&&t.type==='income').reduce((s,t)=>s+t.amount,0);
    const exp = transactions.filter(t=>t.date.startsWith(m)&&t.type==='expense').reduce((s,t)=>s+t.amount,0);
    return inc - exp + (i > 0 ? 0 : 50000); // starting balance context
  });

  // running cumulative
  for (let i = 1; i < data.length; i++) {
    if (startIdx + i >= 9) data[i] += data[i-1];
  }

  const ctx = document.getElementById('trendChart').getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 220);
  grad.addColorStop(0, 'rgba(200,245,106,0.2)');
  grad.addColorStop(1, 'rgba(200,245,106,0)');

  if (trendChart) trendChart.destroy();
  trendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labelSet,
      datasets: [{ data, borderColor: '#c8f56a', backgroundColor: grad, borderWidth: 2, pointRadius: 4, pointBackgroundColor: '#c8f56a', tension: 0.4, fill: true }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: {
        backgroundColor: '#1e2128', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1,
        titleColor: '#9a9a96', bodyColor: '#f0f0ee', padding: 10,
        callbacks: { label: ctx => fmt(ctx.parsed.y) }
      }},
      scales: {
        x: { grid: { color: gridColor() }, ticks: { color: textColor2(), font: { family: 'DM Mono', size: 11 } } },
        y: { grid: { color: gridColor() }, ticks: { color: textColor2(), font: { family: 'DM Mono', size: 11 }, callback: v => '₹'+Number(v/1000).toFixed(0)+'k' } }
      }
    }
  });
}

function renderDonutChart() {
  const cats = getCatBreakdown();
  const ctx = document.getElementById('donutChart').getContext('2d');
  if (donutChart) donutChart.destroy();
  donutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: cats.map(c=>c.name),
      datasets: [{ data: cats.map(c=>c.amt), backgroundColor: cats.map(c=>CATEGORIES[c.name]?.color||'#9a9a96'), borderWidth: 0, hoverOffset: 6 }]
    },
    options: {
      responsive: true, cutout: '72%',
      plugins: { legend: { display: false }, tooltip: {
        backgroundColor: '#1e2128', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1,
        titleColor: '#9a9a96', bodyColor: '#f0f0ee', padding: 10,
        callbacks: { label: ctx => fmt(ctx.parsed) + ' (' + cats[ctx.dataIndex].pct + '%)' }
      }}
    }
  });

  const legend = document.getElementById('catLegend');
  legend.innerHTML = cats.slice(0,5).map(c => `
    <div class="cat-row">
      <div class="cat-dot" style="background:${CATEGORIES[c.name]?.color||'#9a9a96'}"></div>
      <span class="cat-name">${c.name}</span>
      <span class="cat-pct">${c.pct}%</span>
      <span class="cat-amt">${fmt(c.amt)}</span>
    </div>`).join('');
}

function renderCatProgress() {
  const cats = getCatBreakdown();
  const max = cats[0]?.amt || 1;
  document.getElementById('catProgress').innerHTML = cats.map(c => `
    <div class="spend-prog-item">
      <div class="spend-prog-header">
        <span class="spend-prog-name">${CATEGORIES[c.name]?.emoji||''} ${c.name}</span>
        <span class="spend-prog-amt">${fmt(c.amt)}</span>
      </div>
      <div class="prog-bar-wrap">
        <div class="prog-bar" style="width:${(c.amt/max*100).toFixed(1)}%;background:${CATEGORIES[c.name]?.color||'#9a9a96'}"></div>
      </div>
    </div>`).join('');
}

function setTrendRange(r, el) {
  trendRange = r;
  document.querySelectorAll('.chart-actions .chart-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  renderTrendChart();
}

function rebuildCharts() {
  updateAll();
  if (document.getElementById('page-insights').classList.contains('active')) renderInsights();
}

// ============================================================
// TRANSACTIONS
// ============================================================
function buildCatFilters() {
  const cats = [...new Set(transactions.map(t => t.category))];
  const wrap = document.getElementById('catFilters');
  wrap.innerHTML = `<button class="filter-btn active" onclick="setCatFilter('all',this)">All Cats</button>` +
    cats.map(c => `<button class="filter-btn" onclick="setCatFilter('${c}',this)">${CATEGORIES[c]?.emoji||''} ${c}</button>`).join('');
}

function setTypeFilter(v, el) {
  typeFilter = v;
  document.querySelectorAll('#typeFilters .filter-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  currentPage = 1;
  renderTransactions();
}
function setCatFilter(v, el) {
  catFilter = v;
  document.querySelectorAll('#catFilters .filter-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  currentPage = 1;
  renderTransactions();
}

let sortField = 'date', sortDir = -1;
function toggleSort(field) {
  if (sortField === field) sortDir *= -1; else { sortField = field; sortDir = -1; }
  renderTransactions();
}

function handleGlobalSearch(val) {
  // Switch to transactions page if not there
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-transactions').classList.add('active');
  const navItems = document.querySelectorAll('.nav-item');
  navItems[1].classList.add('active');
  document.getElementById('topbarTitle').textContent = 'Transactions';
  renderTransactions(val);
}

function getFiltered(search) {
  let list = [...transactions];
  if (typeFilter !== 'all') list = list.filter(t => t.type === typeFilter);
  if (catFilter !== 'all') list = list.filter(t => t.category === catFilter);
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(t => t.merchant.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
  }
  const sort = document.getElementById('sortSelect')?.value || 'date-desc';
  if (sort === 'date-desc') list.sort((a,b) => b.date.localeCompare(a.date));
  else if (sort === 'date-asc') list.sort((a,b) => a.date.localeCompare(b.date));
  else if (sort === 'amount-desc') list.sort((a,b) => b.amount - a.amount);
  else list.sort((a,b) => a.amount - b.amount);
  return list;
}

function renderTransactions(search) {
  const filtered = getFiltered(search || document.getElementById('globalSearch').value);
  const total = filtered.length;
  const pages = Math.ceil(total / PER_PAGE);
  if (currentPage > pages) currentPage = 1;
  const slice = filtered.slice((currentPage-1)*PER_PAGE, currentPage*PER_PAGE);

  const tbody = document.getElementById('txnBody');
  if (!slice.length) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><div class="empty-icon">◎</div><div class="empty-text">No transactions match your filters</div></div></td></tr>`;
  } else {
    tbody.innerHTML = slice.map(t => {
      const catInfo = CATEGORIES[t.category] || {};
      const actions = currentRole === 'admin' ? `
        <div class="txn-actions">
          <button class="txn-edit-btn" onclick="openModal(${t.id})">Edit</button>
          <button class="txn-del-btn" onclick="deleteTransaction(${t.id})">✕</button>
        </div>` : '';
      return `<tr>
        <td><div class="txn-date">${formatDate(t.date)}</div></td>
        <td><div class="txn-merchant">${t.merchant}</div></td>
        <td><span class="txn-cat-badge"><span class="txn-cat-dot" style="background:${catInfo.color||'#9a9a96'}"></span>${t.category}</span></td>
        <td><div class="txn-amount ${t.type}">${t.type==='income'?'+':'-'}${fmt(t.amount)}</div></td>
        <td>${actions}</td>
      </tr>`;
    }).join('');
  }

  // Pagination
  const pag = document.getElementById('pagination');
  if (pages <= 1) { pag.innerHTML = ''; return; }
  let html = `<button class="page-btn" onclick="goPage(${currentPage-1})" ${currentPage===1?'disabled':''}>‹</button>`;
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - currentPage) <= 1) {
      html += `<button class="page-btn ${i===currentPage?'active':''}" onclick="goPage(${i})">${i}</button>`;
    } else if (Math.abs(i - currentPage) === 2) {
      html += `<span class="page-info">…</span>`;
    }
  }
  html += `<button class="page-btn" onclick="goPage(${currentPage+1})" ${currentPage===pages?'disabled':''}>›</button>`;
  html += `<span class="page-info">${(currentPage-1)*PER_PAGE+1}–${Math.min(currentPage*PER_PAGE,total)} of ${total}</span>`;
  pag.innerHTML = html;
}

function goPage(p) { currentPage = p; renderTransactions(); }

function formatDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
}

function deleteTransaction(id) {
  if (!confirm('Delete this transaction?')) return;
  transactions = transactions.filter(t => t.id !== id);
  save(); updateAll(); renderTransactions();
  buildCatFilters();
  toast('Transaction deleted', 'success');
}

// ============================================================
// MODAL
// ============================================================
function openModal(id) {
  editingId = id || null;
  document.getElementById('modalTitle').textContent = id ? 'Edit Transaction' : 'Add Transaction';
  if (id) {
    const t = transactions.find(x => x.id === id);
    document.getElementById('fMerchant').value = t.merchant;
    document.getElementById('fAmount').value = t.amount;
    document.getElementById('fType').value = t.type;
    document.getElementById('fCategory').value = t.category;
    document.getElementById('fDate').value = t.date;
  } else {
    document.getElementById('fMerchant').value = '';
    document.getElementById('fAmount').value = '';
    document.getElementById('fType').value = 'expense';
    document.getElementById('fCategory').value = 'Food & Dining';
    setTodayDate();
  }
  document.getElementById('modalOverlay').classList.add('open');
}
function closeModal() { document.getElementById('modalOverlay').classList.remove('open'); }

function saveTransaction() {
  const merchant = document.getElementById('fMerchant').value.trim();
  const amount = parseFloat(document.getElementById('fAmount').value);
  const type = document.getElementById('fType').value;
  const category = document.getElementById('fCategory').value;
  const date = document.getElementById('fDate').value;

  if (!merchant || !amount || !date) { toast('Please fill all fields', 'error'); return; }

  if (editingId) {
    const t = transactions.find(x => x.id === editingId);
    Object.assign(t, { merchant, amount, type, category, date });
    toast('Transaction updated', 'success');
  } else {
    transactions.unshift({ id: nextId++, merchant, amount, type, category, date });
    toast('Transaction added', 'success');
  }

  save(); closeModal(); updateAll(); renderTransactions(); buildCatFilters();
  document.getElementById('txnBadge').textContent = transactions.length;
}

// ============================================================
// INSIGHTS
// ============================================================
function renderInsights() {
  const cats = getCatBreakdown();
  const top = cats[0];
  document.getElementById('topCatName').textContent = top ? top.name : '—';
  document.getElementById('topCatStat').textContent = top ? `${fmt(top.amt)} · ${top.pct}% of expenses` : '';

  const totalIncome = transactions.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
  const totalExp = transactions.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
  const savings = totalIncome - totalExp;
  const savRate = totalIncome ? (savings / totalIncome * 100).toFixed(1) : 0;
  document.getElementById('savingsRate').textContent = savRate + '%';
  document.getElementById('savingsStat').textContent = `Saved ${fmt(savings)} of ${fmt(totalIncome)} total income`;

  const days = [...new Set(transactions.filter(t=>t.type==='expense').map(t=>t.date))].length || 1;
  const avgDay = totalExp / days;
  document.getElementById('avgDaily').textContent = fmt(avgDay);
  document.getElementById('avgDailyStat').textContent = `Based on ${days} active days`;

  const largest = transactions.reduce((m,t) => t.amount > m.amount ? t : m, transactions[0]);
  document.getElementById('largestTxn').textContent = fmt(largest?.amount || 0);
  document.getElementById('largestTxnStat').textContent = largest ? `${largest.merchant} · ${formatDate(largest.date)}` : '';

  renderBarChart();
  renderMonthlyComp();
}

function renderBarChart() {
  const months = ['2026-01','2026-02','2026-03'];
  const labels = ['January','February','March'];
  const incomes = months.map(m => transactions.filter(t=>t.date.startsWith(m)&&t.type==='income').reduce((s,t)=>s+t.amount,0));
  const expenses = months.map(m => transactions.filter(t=>t.date.startsWith(m)&&t.type==='expense').reduce((s,t)=>s+t.amount,0));

  const ctx = document.getElementById('barChart').getContext('2d');
  if (barChart) barChart.destroy();
  barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Income', data: incomes, backgroundColor: 'rgba(107,255,184,0.7)', borderRadius: 6 },
        { label: 'Expenses', data: expenses, backgroundColor: 'rgba(255,107,107,0.7)', borderRadius: 6 },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#9a9a96', font: { family: 'DM Sans' } } }, tooltip: {
        backgroundColor: '#1e2128', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1,
        titleColor: '#9a9a96', bodyColor: '#f0f0ee', padding: 10,
        callbacks: { label: ctx => ctx.dataset.label + ': ' + fmt(ctx.parsed.y) }
      }},
      scales: {
        x: { grid: { color: gridColor() }, ticks: { color: textColor2(), font: { family: 'DM Sans', size: 12 } } },
        y: { grid: { color: gridColor() }, ticks: { color: textColor2(), font: { family: 'DM Mono', size: 11 }, callback: v => '₹'+Number(v/1000).toFixed(0)+'k' } }
      }
    }
  });
}

function renderMonthlyComp() {
  const months = [
    { key: '2026-01', name: 'January 2026' },
    { key: '2026-02', name: 'February 2026' },
    { key: '2026-03', name: 'March 2026' },
  ];
  document.getElementById('monthlyComp').innerHTML = months.map(m => {
    const inc = transactions.filter(t=>t.date.startsWith(m.key)&&t.type==='income').reduce((s,t)=>s+t.amount,0);
    const exp = transactions.filter(t=>t.date.startsWith(m.key)&&t.type==='expense').reduce((s,t)=>s+t.amount,0);
    const net = inc - exp;
    return `<div class="month-col">
      <div class="month-name">${m.name}</div>
      <div class="month-income">↑ ${fmt(inc)}</div>
      <div class="month-expense">↓ ${fmt(exp)}</div>
      <div class="month-net" style="color:${net>=0?'#6bffb8':'#ff6b6b'}">${net>=0?'Net +':'Net -'}${fmt(Math.abs(net))}</div>
    </div>`;
  }).join('');
}

// ============================================================
// TOAST
// ============================================================
function toast(msg, type='success') {
  const wrap = document.getElementById('toastWrap');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span class="toast-icon">${type==='success'?'✓':'✕'}</span> ${msg}`;
  wrap.appendChild(el);
  setTimeout(() => el.classList.add('show'), 10);
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 2800);
}