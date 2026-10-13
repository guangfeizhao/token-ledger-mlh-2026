/* UI written by dot. Calculation-core attribution is recorded separately. */
'use strict';
(function () {
  const scenario = [
    { key: 'inputTokens', label: '平均输入 token / 次', value: 2000, unit: 'token', max: 1000000000 },
    { key: 'outputTokens', label: '平均输出 token / 次', value: 500, unit: 'token', max: 1000000000 },
    { key: 'cacheHit', label: '输入缓存命中比例', value: 40, unit: '%', max: 100, step: 0.1, help: '仅对命中的输入 token 使用缓存读取单价' },
    { key: 'tasksPerDay', label: '每天初始任务数', value: 1000, unit: '次', max: 1000000000 },
    { key: 'retries', label: '最大重试次数', value: 2, unit: '次', max: 10, help: '不含首次调用；0 表示不重试' },
    { key: 'days', label: '每月计费天数', value: 30, unit: '天', min: 1, max: 366 },
    { key: 'budget', label: '月度预算', value: 150, unit: 'USD', max: 1000000000000, step: 0.01, help: '可填 0；非零预算至少为 0.01 USD' },
  ];
  const modelFields = [
    { key: 'inputPrice', label: '输入单价', unit: '$ / M', max: 1000000, step: 0.01 },
    { key: 'cachePrice', label: '缓存读取单价', unit: '$ / M', max: 1000000, step: 0.01 },
    { key: 'outputPrice', label: '输出单价', unit: '$ / M', max: 1000000, step: 0.01 },
    { key: 'successRate', label: '单次成功率', unit: '%', max: 100, step: 0.1 },
  ];
  const models = [
    { name: '轻量方案', kind: '方案 A / 假设示例', color: '#087c68', values: [0.2, 0.02, 0.8, 85] },
    { name: '均衡方案', kind: '方案 B / 假设示例', color: '#56848e', values: [1, 0.1, 4, 95] },
    { name: '进阶方案', kind: '方案 C / 假设示例', color: '#a1ab58', values: [3, 0.3, 12, 99] },
  ];
  const $ = id => document.getElementById(id);
  function fieldHTML(field, prefix, value) {
    const id = prefix + field.key;
    return `<div class="field"><label for="${id}">${field.label}</label><div class="input-wrap"><input id="${id}" name="${id}" type="number" inputmode="decimal" min="${field.min ?? 0}" max="${field.max}" step="${field.step ?? 1}" value="${value}" required aria-describedby="${id}-error${field.help ? ' ' + id + '-help' : ''}"><span class="input-suffix" aria-hidden="true">${field.unit}</span></div>${field.help ? `<p class="field-help" id="${id}-help">${field.help}</p>` : ''}<p class="field-error" id="${id}-error"></p></div>`;
  }
  $('scenario-fields').innerHTML = scenario.map(f => fieldHTML(f, '', f.value)).join('');
  $('model-cards').innerHTML = models.map((m, i) => `<article class="model-card" style="--model-color:${m.color}" aria-label="${m.kind}"><div class="model-title"><span class="model-dot" aria-hidden="true"></span><input id="model-${i}-name" type="text" maxlength="24" value="${m.name}" aria-label="方案 ${String.fromCharCode(65 + i)} 名称"></div><p class="model-kind">${m.kind}</p><div class="model-fields">${modelFields.map((f, k) => fieldHTML(f, 'model-' + i + '-', m.values[k])).join('')}</div><div class="model-results" id="model-${i}-results"></div></article>`).join('');
  $('cost-bars').innerHTML = models.map((m, i) => `<div class="bar-row"><div class="bar-label"><span id="bar-${i}-name"></span><strong id="bar-${i}-value">—</strong></div><div class="bar-track"><div class="bar-fill" id="bar-${i}" style="background:${m.color};width:0%"></div></div><p class="bar-caption" id="bar-${i}-caption"></p></div>`).join('');
  const money = (number, detailed = false) => {
    if (number === null || !Number.isFinite(number)) return '—';
    if (number > 0 && number < (detailed ? 0.000001 : 0.01)) return detailed ? '< $0.000001' : '< $0.01';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: detailed ? 4 : 2, maximumFractionDigits: detailed ? 6 : 2 }).format(number);
  };
  const percentage = n => Number.isFinite(n) ? new Intl.NumberFormat('zh-CN', { style: 'percent', maximumFractionDigits: 2 }).format(n) : '—';
  function clearErrors() {
    document.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
    document.querySelectorAll('.field-error').forEach(el => { el.textContent = ''; });
  }
  function metric(label, value) {
    const row = document.createElement('div'); row.className = 'metric';
    const dt = document.createElement('dt'); dt.textContent = label;
    const dd = document.createElement('dd'); dd.textContent = value;
    row.append(dt, dd); return row;
  }
  function renderModel(i, result) {
    const target = $('model-' + i + '-results'); target.replaceChildren();
    const label = document.createElement('p'); label.className = 'result-label'; label.textContent = '预计每月成本';
    const amount = document.createElement('p'); amount.className = 'month-value'; amount.textContent = result ? money(result.monthCost) : '—';
    const unit = document.createElement('small'); unit.textContent = '/ 月'; amount.append(unit);
    const badge = document.createElement('span'); badge.className = 'budget-pill';
    badge.textContent = result ? (result.budgetRemaining >= 0 ? '预算内 · 余 ' + money(result.budgetRemaining) : '超预算 · ' + money(-result.budgetRemaining)) : '请检查输入';
    if (result && result.budgetRemaining < 0) badge.classList.add('over');
    const metrics = document.createElement('dl'); metrics.className = 'metrics';
    [['单次调用', result && money(result.attemptCost, true)], ['每个初始任务', result && money(result.taskCost, true)], ['每天成本', result && money(result.dayCost)], ['每次成功任务', result && money(result.costPerSuccess, true)], ['最终成功率', result && percentage(result.eventualSuccess)], ['平均尝试次数', result && result.expectedAttempts.toFixed(3) + ' 次']].forEach(([key, value]) => metrics.append(metric(key, value || '—')));
    target.append(label, amount, badge, metrics);
  }
  function update() {
    clearErrors();
    const shared = Object.fromEntries(scenario.map(f => [f.key, $(f.key).value]));
    const errors = new Set();
    const results = models.map((model, i) => {
      const data = { ...shared, ...Object.fromEntries(modelFields.map(f => [f.key, $('model-' + i + '-' + f.key).value])) };
      let result = null;
      if (window.CostMath) {
        const output = window.CostMath.calculate(data);
        if (output.errors) {
          for (const [key, message] of Object.entries(output.errors)) {
            const id = scenario.some(f => f.key === key) ? key : 'model-' + i + '-' + key;
            $(id).setAttribute('aria-invalid', 'true'); $(id + '-error').textContent = message; errors.add(id);
          }
        } else result = output;
      }
      renderModel(i, result); return result;
    });
    $('calculation-status').textContent = !window.CostMath ? '开发预览：计算核心等待 GitHub Copilot 协作，当前不输出估算。' : errors.size ? `有 ${errors.size} 个输入需要修正；对应方案暂不计算。` : '';
    const validDays = Number(shared.days); $('period-label').textContent = shared.days.trim() && Number.isInteger(validDays) && validDays >= 1 && validDays <= 366 ? validDays + ' 天估算' : '请填写有效天数';
    const max = Math.max(...results.map(r => r ? r.monthCost : 0), 0);
    results.forEach((r, i) => {
      $('bar-' + i + '-name').textContent = $('model-' + i + '-name').value.trim() || '未命名方案 ' + String.fromCharCode(65 + i);
      $('bar-' + i + '-value').textContent = r ? money(r.monthCost) : '—';
      $('bar-' + i).style.width = r && max > 0 ? (r.monthCost / max * 100) + '%' : '0%';
      $('bar-' + i + '-caption').textContent = !r ? '请检查此方案输入' : Number(shared.budget) === 0 ? (r.monthCost === 0 ? '零预算 · 零支出' : '零预算 · 已超预算') : '占月度预算 ' + percentage(r.monthCost / Number(shared.budget));
    });
  }
  $('scenario-form').addEventListener('submit', event => event.preventDefault());
  document.querySelectorAll('input').forEach(el => el.addEventListener('input', update));
  $('reset').addEventListener('click', () => {
    scenario.forEach(f => { $(f.key).value = f.value; });
    models.forEach((m, i) => { $('model-' + i + '-name').value = m.name; modelFields.forEach((f, k) => { $('model-' + i + '-' + f.key).value = m.values[k]; }); });
    update();
  });
  update();
}());
