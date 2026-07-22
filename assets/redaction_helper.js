(function (root) {
  "use strict";

  const PROTECTED_SOURCES = new Set([
    "standard",
    "standard_auto",
    "system_standard",
    "auto_standard",
    "protected_standard"
  ]);

  const CUSTOMER_VISIBLE_SOURCES = new Set([
    "user_custom",
    "customer_custom"
  ]);

  function isProtectedStandard(input) {
    if (!input) return false;
    if (typeof input === "string") return PROTECTED_SOURCES.has(input);
    const source = input.source || input.standardSource || input.effectiveSource || input.mode;
    const visibility = input.visibility || input.displayMode;
    return PROTECTED_SOURCES.has(source) || visibility === "protected";
  }

  function isCustomerVisible(input) {
    if (!input || typeof input === "string") return false;
    const source = input.source || input.standardSource || input.effectiveSource || input.mode;
    return CUSTOMER_VISIBLE_SOURCES.has(source) || input.visibility === "customer_visible";
  }

  function formatCustomerValue(value) {
    if (value == null) return "--";
    if (Array.isArray(value)) return value.join("-");
    return String(value);
  }

  function redactStandardValue(input, fallback = "--") {
    if (isCustomerVisible(input)) return formatCustomerValue(input.value ?? input.displayValue ?? input);
    if (isProtectedStandard(input)) return input.protectedValueLabel || "標準";
    if (input && typeof input === "object") {
      const source = input.source || input.standardSource || input.effectiveSource || input.mode;
      if (source) return input.protectedValueLabel || fallback;
    }
    if (input && typeof input === "object" && "value" in input) return formatCustomerValue(input.value);
    return input == null ? fallback : String(input);
  }

  function redactStandardRow(row) {
    if (!Array.isArray(row)) return row;
    const next = [...row];
    const sourceLabel = String(next[3] ?? "");
    const modeLabel = String(next[1] ?? "");
    const sourceLooksProtected = sourceLabel === "標準" || modeLabel === "自動";
    const sourceLooksCustom = sourceLabel === "自訂";

    if (sourceLooksCustom) return next;
    if (sourceLooksProtected) {
      next[1] = "自動";
      next[2] = "--";
      next[3] = "標準";
    }
    return next;
  }

  function redactStandardRows(rows) {
    return (rows || []).map(redactStandardRow);
  }

  const api = {
    isProtectedStandard,
    redactStandardValue,
    redactStandardRow,
    redactStandardRows
  };

  root.AIOTRedaction = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
}(typeof window !== "undefined" ? window : globalThis));
