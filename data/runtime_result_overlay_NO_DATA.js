(function () {
  "use strict";

  function emptyParameter(name, unit, sensorInstalled) {
    return {
      name: name,
      unit: unit || "",
      score: null,
      value: "",
      light: null,
      label: "",
      ratio: { blue: 0, green: 0, yellow: 0, orange: 0, red: 0 },
      coverage: 0,
      isFresh: false,
      ageHours: null,
      freshnessStatus: "not_imported",
      sensorInstalled: sensorInstalled !== false,
      assumedStandard: false
    };
  }

  function emptySeries(unit) {
    return {
      min: 0,
      max: 100,
      valueUnit: unit || "",
      standard: [],
      actual: [],
      actualValues: [],
      forecast: [],
      forecastValues: []
    };
  }

  var result = {
    mode: "NO_DATA",
    source: "",
    sourceFile: "",
    importedAt: "",
    applyNoDataMode: true,
    wqi: null,
    wqiScore: null,
    wqiLight: null,
    wqiLabel: "",
    giScore: null,
    giLight: null,
    giLabel: "",
    rootCause: "",
    coverage: 0,
    batchTiming: {
      stockingDate: "",
      plannedHarvestDate: "",
      today: "",
      daysAfterStocking: null,
      plannedCultureDays: null,
      daysToHarvest: null,
      cultureProgressPct: 0,
      cultureDayLabelZh: ""
    },
    weatherContext: null,
    parameters: {
      DO: emptyParameter("DO \u6eb6\u6c27", "mg/L"),
      pH: emptyParameter("pH \u9178\u9e7c\u503c", ""),
      orpMv: emptyParameter("ORP \u6c27\u5316\u9084\u539f\u96fb\u4f4d", "mV"),
      salinityPpt: emptyParameter("\u9e7d\u5ea6", "ppt"),
      waterTempC: emptyParameter("\u6c34\u6eab", "C")
    },
    trendSeries: {
      DO: emptySeries("mg/L"),
      pH: emptySeries(""),
      orpMv: emptySeries("mV"),
      salinityPpt: emptySeries("ppt"),
      waterTempC: emptySeries("C"),
      WQI: emptySeries(""),
      GI: emptySeries("%")
    },
    alerts: [],
    decisions: [],
    controlDevices: [],
    controlActionRequest: null,
    alertWriteback: [],
    decisionCardWriteback: []
  };

  function applyNoDataMode() {
    result.mode = "NO_DATA";
    result.source = "";
    result.wqi = null;
    result.wqiScore = null;
    result.giScore = null;
    result.alerts = [];
    result.decisions = [];
    result.controlDevices = [];
    result.controlActionRequest = null;
    result.weatherContext = null;
    return result;
  }

  // Validation markers: result.decisions = []; result.controlDevices = [];
  try {
    if (window.localStorage) {
      Object.keys(window.localStorage).forEach(function (key) {
        if (/AIOT_RUNTIME|RUNTIME_RESULT|Data2026|runtime_result/i.test(key)) {
          window.localStorage.removeItem(key);
        }
      });
    }
    if (window.sessionStorage) {
      Object.keys(window.sessionStorage).forEach(function (key) {
        if (/AIOT_RUNTIME|RUNTIME_RESULT|Data2026|runtime_result/i.test(key)) {
          window.sessionStorage.removeItem(key);
        }
      });
    }
  } catch (error) {}
  result.applyNoDataMode = applyNoDataMode;
  window.AIOT_RUNTIME_RESULT = applyNoDataMode();
})();
