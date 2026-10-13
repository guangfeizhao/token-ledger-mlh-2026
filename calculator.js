/* Token Ledger calculation core.
 * Independently implemented by dot after an actual GitHub Copilot consultation.
 * Copilot's visible explanation and validation schema were reviewed; its complete
 * generated source file was NOT imported. See AI_CONTRIBUTIONS.md for provenance.
 */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.CostMath = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const rules = Object.freeze({
    inputTokens: { min: 0, max: 1e9, integer: true },
    outputTokens: { min: 0, max: 1e9, integer: true },
    tasksPerDay: { min: 0, max: 1e9, integer: true },
    inputPrice: { min: 0, max: 1e6 },
    cachePrice: { min: 0, max: 1e6 },
    outputPrice: { min: 0, max: 1e6 },
    cacheHit: { min: 0, max: 100 },
    successRate: { min: 0, max: 100 },
    retries: { min: 0, max: 10, integer: true },
    days: { min: 1, max: 366, integer: true },
    budget: { min: 0, max: 1e12 },
  });
  const decimal = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;
  function calculate(input) {
    const data = input && typeof input === 'object' && !Array.isArray(input) ? input : {};
    const errors = {}, values = {};
    for (const [key, rule] of Object.entries(rules)) {
      const raw = data[key];
      if (raw === undefined || raw === null || (typeof raw === 'string' && raw.trim() === '')) {
        errors[key] = '请填写数值'; continue;
      }
      if (!['number', 'string'].includes(typeof raw) || (typeof raw === 'string' && !decimal.test(raw.trim()))) {
        errors[key] = '请输入有效数字'; continue;
      }
      const n = Number(raw);
      if (!Number.isFinite(n)) errors[key] = '请输入有限数字';
      else if (n < rule.min || n > rule.max) errors[key] = `请输入 ${rule.min}–${rule.max} 范围内的数值`;
      else if (rule.integer && !Number.isSafeInteger(n)) errors[key] = '请填写整数';
      else if (key === 'successRate' && n > 0 && n < 0.000001) errors[key] = '非零成功率至少为 0.000001%';
      else if (key === 'budget' && n > 0 && n < 0.01) errors[key] = '非零月预算至少为 0.01 USD';
      else values[key] = n;
    }
    if (Object.keys(errors).length) return { errors };
    const v = values, p = v.successRate / 100, h = v.cacheHit / 100;
    const attemptCost = (v.inputTokens * ((1 - h) * v.inputPrice + h * v.cachePrice) + v.outputTokens * v.outputPrice) / 1e6;
    let expectedAttempts = 0, failureProbability = 1;
    for (let attempt = 0; attempt <= v.retries; attempt++) {
      expectedAttempts += failureProbability;
      failureProbability *= 1 - p;
    }
    // log1p/expm1 preserve precision for small nonzero probabilities.
    const eventualSuccess = p === 0 ? 0 : p === 1 ? 1 : -Math.expm1((v.retries + 1) * Math.log1p(-p));
    const taskCost = attemptCost * expectedAttempts;
    const dayCost = taskCost * v.tasksPerDay;
    const monthCost = dayCost * v.days;
    const costPerSuccess = eventualSuccess === 0 ? null : taskCost / eventualSuccess;
    return { attemptCost, expectedAttempts, eventualSuccess, taskCost, dayCost, monthCost, costPerSuccess, budgetRemaining: v.budget - monthCost };
  }
  return Object.freeze({ calculate });
}));
