'use strict';
// Test requirements authored by dot before Copilot collaboration.
// Execute only after calculator.js exports CostMath.calculate.
const test = require('node:test');
const assert = require('node:assert/strict');
const { calculate } = require('./calculator.js');
const base = {inputTokens:2000,outputTokens:500,cacheHit:40,inputPrice:1,cachePrice:0.1,outputPrice:4,successRate:80,retries:2,tasksPerDay:1000,days:30,budget:150};
function close(actual, expected) { assert.ok(Math.abs(actual-expected) <= Math.max(1e-12,Math.abs(expected)*1e-12), `${actual} != ${expected}`); }
test('reference calculation includes cache, retries and eventual success', () => {
  const r=calculate(base); assert.equal(r.errors, undefined);
  close(r.attemptCost,0.00328); close(r.expectedAttempts,1.24); close(r.eventualSuccess,0.992);
  close(r.taskCost,0.0040672); close(r.dayCost,4.0672); close(r.monthCost,122.016);
  close(r.costPerSuccess,0.0041); close(r.budgetRemaining,27.984);
});
test('success 100% uses one attempt even with retries', () => {
  const r=calculate({...base,successRate:100,retries:10}); close(r.expectedAttempts,1); close(r.eventualSuccess,1); close(r.taskCost,r.attemptCost);
});
test('success 0% spends all allowed attempts; cost per success is undefined', () => {
  const r=calculate({...base,successRate:0}); close(r.expectedAttempts,3); close(r.eventualSuccess,0); assert.equal(r.costPerSuccess,null); close(r.monthCost,295.2);
});
test('no retries means exactly one attempt', () => {
  const r=calculate({...base,retries:0}); close(r.expectedAttempts,1); close(r.eventualSuccess,0.8); close(r.taskCost,r.attemptCost);
});
test('zero tokens, prices, volume and budget are valid', () => {
  for(const data of [{inputTokens:0,outputTokens:0},{inputPrice:0,cachePrice:0,outputPrice:0},{tasksPerDay:0}]) {
    const r=calculate({...base,...data,budget:0}); assert.equal(r.errors,undefined); close(r.monthCost,0); close(r.budgetRemaining,0);
  }
});
test('cache endpoints use correct input price', () => {
  close(calculate({...base,cacheHit:0}).attemptCost,0.004);
  close(calculate({...base,cacheHit:100}).attemptCost,0.0022);
});
test('numeric strings match numbers without mutating data', () => {
  const input=Object.fromEntries(Object.entries(base).map(([k,v])=>[k,String(v)])); const before=JSON.stringify(input);
  close(calculate(input).monthCost,122.016); assert.equal(JSON.stringify(input),before);
});
test('reject blank, missing, nonfinite and negative numeric values', () => {
  for(const key of Object.keys(base)) for(const value of ['', '  ', undefined, null, NaN, Infinity, -1, 'invalid']) {
    const r=calculate({...base,[key]:value}); assert.ok(r.errors?.[key], `${key} must reject ${String(value)}`);
  }
});
test('reject out-of-range percentages, days, retries and fractional integers', () => {
  for(const [key,value] of [['cacheHit',100.1],['successRate',100.1],['days',0],['days',367],['retries',11],['retries',0.5],['tasksPerDay',1.1],['inputTokens',1.1],['outputTokens',1.1],['days',30.5]]) assert.ok(calculate({...base,[key]:value}).errors?.[key],`${key} ${value}`);
});
test('reject unsafe magnitudes before overflow', () => {
  for(const key of Object.keys(base)) assert.ok(calculate({...base,[key]:1e308}).errors?.[key],key);
});
test('budget can be exceeded without changing cost', () => { const r=calculate({...base,budget:1}); close(r.monthCost,122.016); close(r.budgetRemaining,-121.016); });
test('sub-cent nonzero budgets are rejected before percentage overflow', () => {
  for(const budget of [5e-324,1e-100,0.001,0.009999]) assert.ok(calculate({...base,budget}).errors?.budget);
  for(const budget of [0,0.01,150]) assert.equal(calculate({...base,budget}).errors,undefined);
  assert.ok(Number.isFinite(calculate({...base,budget:0.01}).monthCost/0.01));
});
test('reject booleans, objects, arrays and non-decimal coercions', () => {
  for(const value of [true,false,{},[],[1],'0x10','0b10']) assert.ok(calculate({...base,inputPrice:value}).errors?.inputPrice);
  for(const value of [null,undefined,[],false]) assert.ok(calculate(value).errors);
});
test('very small success rates are stable or explicitly rejected', () => {
  assert.ok(calculate({...base,successRate:0.0000001}).errors?.successRate);
  const r=calculate({...base,successRate:0.000001,retries:10});
  close(r.eventualSuccess,1.0999999450000016e-7); assert.ok(r.costPerSuccess>0); assert.ok(Number.isFinite(r.costPerSuccess));
});
test('browser global export is usable without CommonJS', () => {
  const vm=require('node:vm'), fs=require('node:fs'); const context={window:{}};
  vm.runInNewContext(fs.readFileSync(require.resolve('./calculator.js'),'utf8'),context);
  close(context.window.CostMath.calculate(base).monthCost,122.016);
});
test('retry expectation and success probability stay within mathematical bounds', () => {
  for(let retries=0;retries<=10;retries++) for(const successRate of [0,0.001,1,20,50,80,99.9,100]) {
    const r=calculate({...base,retries,successRate}); assert.equal(r.errors,undefined);
    assert.ok(r.expectedAttempts>=1 && r.expectedAttempts<=retries+1+1e-12);
    assert.ok(r.eventualSuccess>=0 && r.eventualSuccess<=1);
    assert.ok(r.taskCost>=r.attemptCost-1e-12);
    for(const value of Object.values(r)) if(typeof value==='number') assert.ok(Number.isFinite(value));
  }
});
