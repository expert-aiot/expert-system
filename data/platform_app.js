(function (root) {
  "use strict";

  var Settings = root.AIOT_CLIENT_SETTINGS;
  var lastRoot = null;
  var lastPage = "settings";
  var suppressNextConfigRemount = false;
  var DEMO_CONFIG = {
    industry: "fisheries",
    species: "whiteShrimp",
    breed: "Litopenaeus vannamei",
    cultureMode: "池塘養殖",
    targetSpec: "20/30",
    stockingDate: "2026-05-14",
    plannedHarvestDate: "2026-08-12",
    pondId: "C22-DEMO",
    stockingCount: "240000",
    pondAreaM2: "2400",
    waterVolumeM3: "2880",
    stockingDensityPerM2: 100,
    targetSpecUnit: "每磅尾數",
    targetCountPerLbMin: 20,
    targetCountPerLbMax: 30,
    targetWeightGMin: 15.1,
    targetWeightGMax: 22.7,
    targetWeightGMid: 18.9
  };
  var DEMO_RESULT = {
    mode: "DEMO",
    source: "mockup-demo-fixture",
    wqi: 72,
    wqiScore: 72,
    wqiLight: "yellow",
    wqiLabel: "注意",
    giScore: 84,
    giLight: "green",
    giLabel: "良好",
    rootCause: "DO 溶氧",
    coverage: 92,
    batchTiming: {
      stockingDate: "2026-05-14",
      plannedHarvestDate: "2026-08-12",
      today: "2026-07-17",
      daysAfterStocking: 65,
      plannedCultureDays: 91,
      daysToHarvest: 26,
      cultureProgressPct: 71,
      cultureDayLabelZh: "第 65 天"
    },
    weatherContext: {
      microWeather: {
        windSpeedMs: 1.8,
        heatIndexC: 44.4,
        humidityPct: 78,
        rainMm: 18
      },
      forecast72h: [
        { horizonDays: 1, rainProbabilityPct: 18, rainMm: 18, uvIndex: 8 }
      ],
      summary: {
        wind: "今晚風速 1.8 m/s，水面交換能力較弱",
        rain: "24h 降雨 18 mm，監控 pH 與鹽度波動",
        uv: "明日 UV 8，午後耗氧壓力增加",
        heat: "熱指數 44.4 C，注意高溫耗氧風險"
      },
      summaryEn: {
        wind: "Tonight wind speed 1.8 m/s; surface exchange capacity is weak",
        rain: "24h rainfall 18 mm; monitor pH and salinity fluctuation",
        uv: "Tomorrow UV 8; afternoon oxygen demand will increase",
        heat: "Heat index 44.4 C; monitor high-temperature oxygen-demand risk"
      },
      decisionHintEn: "Weak wind and high UV are included in DO risk assessment"
    },
    underwaterVision: {
      imageUrl: "assets/realistic_white_shrimp.png",
      bodyLengthCm: 10.3,
      bodyWeightG: 12.7,
      estimatedCountPerLb: 36,
      confidencePct: 92
    },
    parameters: {
      DO: { name: "DO 溶氧", unit: "mg/L", score: 48, value: "4.10 mg/L", light: "red", label: "異常", ratio: { blue: 5, green: 55, yellow: 30, orange: 5, red: 5 }, coverage: 92, isFresh: true, ageHours: 1, freshnessStatus: "fresh" },
      pH: { name: "pH 酸鹼值", unit: "", score: 92, value: "7.82", light: "green", label: "綠燈", ratio: { blue: 35, green: 55, yellow: 10, orange: 0, red: 0 }, coverage: 96, isFresh: true, ageHours: 1, freshnessStatus: "fresh" },
      orpMv: { name: "ORP 氧化還原電位", unit: "mV", score: 84, value: "312 mV", light: "green", label: "綠燈", ratio: { blue: 12, green: 66, yellow: 22, orange: 0, red: 0 }, coverage: 94, isFresh: true, ageHours: 1, freshnessStatus: "fresh" },
      salinityPpt: { name: "SC 鹽度", unit: "ppt", score: 88, value: "18.4 ppt", light: "green", label: "綠燈", ratio: { blue: 18, green: 68, yellow: 14, orange: 0, red: 0 }, coverage: 95, isFresh: true, ageHours: 1, freshnessStatus: "fresh" },
      waterTempC: { name: "水溫", unit: "C", score: 76, value: "30.8 C", light: "yellow", label: "黃燈", ratio: { blue: 10, green: 60, yellow: 30, orange: 0, red: 0 }, coverage: 93, isFresh: true, ageHours: 1, freshnessStatus: "fresh" }
    },
    trendSeries: {
      DO: { min: 0, max: 100, valueUnit: "mg/L", standard: [72, 76, 80, 88], actual: [68, 58, 42, 28], actualValues: [5.2, 4.8, 4.4, 4.1], forecast: [52, 76, 90], forecastValues: [4.5, 5.0, 5.6] },
      pH: { min: 0, max: 100, valueUnit: "", standard: [100, 100, 100, 100], actual: [88, 92, 95, 92], actualValues: [7.6, 7.7, 7.9, 7.82], forecast: [92, 90, 88, 86], forecastValues: [7.82, 7.85, 7.9, 8.0] },
      orpMv: { min: 0, max: 100, valueUnit: "mV", standard: [100, 100, 100, 100], actual: [82, 84, 83, 84], actualValues: [305, 310, 309, 312], forecast: [84, 86, 88, 90], forecastValues: [312, 318, 325, 330] },
      salinityPpt: { min: 0, max: 100, valueUnit: "ppt", standard: [100, 100, 100, 100], actual: [92, 90, 88, 88], actualValues: [18.8, 18.6, 18.4, 18.4], forecast: [88, 86, 84, 82], forecastValues: [18.4, 18.2, 18.0, 17.8] },
      waterTempC: { min: 0, max: 100, valueUnit: "C", standard: [100, 100, 100, 100], actual: [80, 82, 78, 76], actualValues: [29.8, 30.1, 30.5, 30.8], forecast: [76, 72, 68, 74], forecastValues: [30.8, 31.2, 31.5, 30.6] },
      WQI: { min: 0, max: 100, valueUnit: "", standard: [100, 100, 100, 100], actual: [86, 80, 74, 72], forecast: [72, 76, 82, 88] },
      GI: { min: 0, max: 100, valueUnit: "%", standard: [35, 55, 75, 100], actual: [38, 54, 70, 84], forecast: [84, 88, 92, 96] }
    },
    decisions: [
      ["today", "今日決策", "晚間減料 30%", "DO 24h 綠燈占比下降，今晚預測耗氧壓力升高。", "提前開水車，防止 DO 下降；晚間投餵量下修 30%。", "預估 2 小時回到安全區。", "影響：降低低氧與殘餌風險　信心：中", "yellow"],
      ["week", "本週決策", "本週觀察底質", "ORP 7d 黃燈時間比例略升。", "安排進水/排汙檢查，防止底質惡化。", "降低 H2S 與 NO2/NH3 風險。", "影響：增加少量管理成本　信心：中", "orange"],
      ["harvest", "收成決策", "維持原收成日", "GI 符合 20/30 目標曲線。", "維持原收成日，不提前改策略。", "預估收穫量 7,182 kg。", "信心：中", "green"],
      ["cost", "成本決策", "夜間水車成本上升", "低氧預測提高水車運轉時數。", "保留夜間水車，不做節能停機。", "維持 DO 安全區。", "影響：電費增加，降低死亡損失　信心：中", "yellow"],
      ["risk", "風險決策", "豪雨前預措", "24h 降雨預測升高。", "提前進水/排汙調整水位，減料 30-50%。", "降低 pH / 鹽度急變風險。", "影響：短期投餵降低　信心：中", "red"],
      ["device", "設備決策", "校正 DO 感測器", "DO2 與 DO1/DO3 偏差過大。", "派工校正 DO2，立即重新校正。", "提升 WQI 與預測可信度。", "影響：降低誤警報　信心：高", "cyan"]
    ],
    controlDevices: [
      { id: "ch01", channelId: "CH-01", channelName: "水車 #1", displayName: "水車 #1", code: "CH-01", mode: "手動", status: "OFF", speed: 0 },
      { id: "ch02", channelId: "CH-02", channelName: "水車 #2", displayName: "水車 #2", code: "CH-02", mode: "自動", status: "OFF", speed: 0 },
      { id: "ch03", channelId: "CH-03", channelName: "水車 #3", displayName: "水車 #3", code: "CH-03", mode: "自動", status: "ON", speed: 100 },
      { id: "ch05", channelId: "CH-05", channelName: "水車 #5", displayName: "水車 #5", code: "CH-05", mode: "自動", status: "ON", speed: 100 },
      { id: "ch06", channelId: "CH-06", channelName: "餵料機 #1", displayName: "餵料機 #1", code: "CH-06", mode: "晚間減量", status: "待確認", speed: null }
    ],
    controlActionRequest: { action: "increase_paddlewheel", status: "pending_review" }
  };

  function isDemoMode() {
    var cfg = Settings.loadConfig();
    return cfg.demoMode === true || cfg.demoMode === "on";
  }
  function runtime() { return isDemoMode() ? DEMO_RESULT : (root.AIOT_RUNTIME_RESULT || {}); }
  function config() { return isDemoMode() ? Object.assign({}, Settings.loadConfig(), DEMO_CONFIG) : Settings.loadConfig(); }
  function template(cfg) { return Settings.currentTemplate(cfg || config()); }
  function lang() { return config().language === "en" ? "en" : "zh"; }
  function isEn() { return lang() === "en"; }
  var I18N = {
    "設定": "Settings", "總覽": "Overview", "三線": "Trends", "回控": "Control", "決策": "Decisions",
    "客戶設定": "Settings", "參數三線": "Parameter Trends", "AI 回控": "AI Control", "決策艙": "Decision Cabin",
    "專家系統 | 設定": "Expert System | Settings",
    "完成後前往總覽": "Go to Overview", "回設定": "Settings", "返回總覽": "Back to Overview",
    "資料模式": "Data mode", "等待資料": "Waiting for data", "池別/批次": "Pond / batch", "生物": "Species", "未設定": "Not set", "未選定": "Not selected",
    "正式等待資料模式": "Live mode: waiting for data", "DEMO 展示模式": "DEMO mode", "啟用 DEMO": "Enable DEMO", "回復無資料狀態": "Back to no-data mode",
    "客戶設定": "Customer Settings", "選產業": "Select Industry", "選生物": "Select Species", "填場域": "Site Details", "可選生物": "Available Species", "種": "items",
    "產業分類": "Industry", "未選定產業": "No industry selected", "生物設定": "Species Setup", "未選定生物": "No species selected",
    "場域設定": "Site Settings", "儲存設定": "Save Settings", "清空設定": "Clear Settings",
    "自訂感測器參數": "Custom Sensor Parameters", "新增參數": "Add Parameter", "參數代碼": "Parameter ID", "顯示名稱": "Display Name", "單位": "Unit", "權重": "Weight", "感測器": "Sensor", "已安裝": "Installed", "未安裝": "Not installed", "刪除": "Delete",
    "WQI 水質環境指數": "WQI Water Quality Index", "GI 成長指數": "GI Growth Index", "AI 決策支援": "AI Decision Support", "微氣象站 / 72h 預測": "Micro Weather / 72h Forecast", "設備狀態": "Device Status", "水下影像 AI": "Underwater Vision AI",
    "尚未匯入水質資料": "No water quality data imported", "尚未匯入成長資料": "No growth data imported", "等待資料匯入": "Waiting for data import",
    "扣分來源": "Deduction Source", "燈號占比 24h": "Light Ratio 24h", "WQI 三線趨勢": "WQI Trend", "GI 成長三線": "GI Growth Trend",
    "覆蓋率": "Coverage", "來源": "Source", "即時值": "Current", "尚無扣分來源": "No deduction source", "尚無有效資料": "No valid data",
    "良好": "Good", "注意": "Caution", "已計算": "Calculated", "未計算": "Not calculated"
  };
  Object.assign(I18N, {
    "生物選單": "Species Profile",
    "設定現場資訊": "Site Settings",
    "產業": "Industry",
    "品種": "Breed",
    "養殖模式": "Culture Mode",
    "目標規格": "Target Size",
    "放苗日": "Stocking Date",
    "預估收成日": "Planned Harvest Date",
    "放養尾數": "Stocking Count",
    "放養密度": "Stocking Density",
    "池面積": "Pond Area",
    "水量": "Water Volume",
    "目標單尾重": "Target Weight",
    "養殖進度": "Culture Progress",
    "場域設定": "Site Settings",
    "白蝦 場域設定": "White Shrimp Site Settings",
    "WQI 整合分數背後的根因參數": "Root Parameters Behind WQI",
    "WQI 根因與燈號": "WQI Causes and Lights",
    "參數燈號占比": "Parameter Light Ratio",
    "目前自動處理": "Current Auto Handling",
    "尚無處理動作": "No active handling",
    "尚未計算": "Not calculated",
    "目前狀態": "Current Status",
    "等待即時資料": "Waiting for real-time data",
    "主要風險": "Primary Risk",
    "選取設備控制": "Selected Device Control",
    "尚未匯入設備頻道": "No device channels imported",
    "SCADA 設備控制台": "SCADA Device Console",
    "設備列表": "Device List",
    "設備控制說明": "Device Control Notes",
    "全部設備": "All Devices",
    "即時狀態": "Live Status",
    "已連線": "Connected",
    "待確認": "Pending",
    "目前": "Current",
    "轉速調整": "Speed Control",
    "氣象警報": "Weather Alert",
    "尚未匯入氣象資料": "No weather data imported",
    "尚未匯入影像資料": "No image data imported",
    "AI 體長": "AI Body Length",
    "轉換體重": "Converted Weight",
    "估計尾數": "Estimated Count",
    "影像可信度": "Image Confidence",
    "等待資料": "Waiting for data",
    "等待水質資料": "Waiting for water quality data",
    "等待成長資料": "Waiting for growth data",
    "資料待接": "Data pending",
    "預估收成": "Estimated Harvest",
    "剩餘": "Remaining",
    "天": "days",
    "第": "Day",
    "收成": "Harvest",
    "扣分來源": "Deduction Source",
    "燈號時間占比": "Light Time Ratio",
    "可切換": "Switchable",
    "每個參數各自計算燈號占比": "Each parameter has its own light ratio",
    "藍": "Blue",
    "綠": "Green",
    "黃": "Yellow",
    "橘": "Orange",
    "紅": "Red",
    "分數": "Score",
    "批次": "Batch",
    "即時值與預測同步": "Current and forecast are synchronized",
    "由五參數加權幾何平均": "Weighted geometric mean of five parameters",
    "尚無有效資料": "No valid data",
    "參數三線": "Parameter Trends",
    "參數事件": "Parameter Event",
    "AI 回復估算": "AI Recovery Estimate",
    "AI 智慧決策艙": "AI Decision Cabin",
    "原因": "Reason",
    "建議": "Recommendation",
    "效果": "Expected Effect",
    "影響": "Impact",
    "信心": "Confidence",
    "今日決策": "Today",
    "本週決策": "This Week",
    "收成決策": "Harvest",
    "成本決策": "Cost",
    "風險決策": "Risk",
    "設備決策": "Device",
    "自訂": "Custom",
    "客戶自訂參數": "Customer-defined parameter",
    "等待資料": "Waiting for data",
    "標準線": "Standard Line",
    "理想區": "Ideal",
    "警戒區": "Warning",
    "危險線": "Danger",
    "時段": "Time Window",
    "開始": "Start",
    "結束": "End",
    "使用者自訂": "User Custom",
    "系統預設": "System Default",
    "套用": "Apply",
    "新增": "Add",
    "移除": "Remove",
    "感測器設備需求": "Sensor Requirements",
    "必配": "Required",
    "選配": "Optional",
    "必配未安裝": "Required sensor not installed",
    "已安裝有資料": "Installed with live data",
    "已安裝等待資料": "Installed, waiting for data",
    "未安裝": "Not installed",
    "即時資料": "Live Data",
    "產品照片待補": "Product photo pending",
    "產品": "Product",
    "模板必配": "Template required",
    "模板選配": "Template optional"
  });
  function t(text) { return isEn() ? (I18N[text] || text) : text; }
  function labelOf(item) { return isEn() && item && item.labelEn ? item.labelEn : (item && item.label) || ""; }
  function templateLabel(tpl) { return isEn() && tpl && tpl.labelEn ? tpl.labelEn : (tpl && tpl.label) || ""; }
  function normalizeCustomParameter(param, index) {
    var id = String(param && param.id || "").trim();
    if (!id) id = "customParam" + (index + 1);
    id = id.replace(/[^\w.-]/g, "_");
    return {
      id: id,
      label: String(param && param.label || id).trim(),
      unit: String(param && param.unit || "").trim(),
      weight: String(param && param.weight || "自訂"),
      source: "customer",
      sensorInstalled: param && param.sensorInstalled === false ? false : true,
      custom: true
    };
  }
  function templateConfigKey(cfg) {
    var state = cfg || config();
    return (state.industry || "none") + "/" + (state.species || "none");
  }
  function scopedCustomParameterRows(cfg) {
    var state = cfg || config();
    var key = templateConfigKey(state);
    var scoped = state.customParametersByTemplate || {};
    if (Array.isArray(scoped[key])) return scoped[key];
    if (key === "fisheries/whiteShrimp" && Array.isArray(state.customParameters)) return state.customParameters;
    return [];
  }
  function scopedConfigPatch(rows, extra) {
    var cfg = config();
    var key = templateConfigKey(cfg);
    var scoped = Object.assign({}, cfg.customParametersByTemplate || {});
    scoped[key] = rows || [];
    return Object.assign({ customParametersByTemplate: scoped, customParameters: [] }, extra || {});
  }
  function customParameters(cfg) {
    var state = cfg || config();
    return scopedCustomParameterRows(state)
      .map(normalizeCustomParameter)
      .filter(function (param, index, list) {
        return list.findIndex(function (item) { return item.id === param.id; }) === index;
      });
  }
  function rawCustomParameterRows(cfg) {
    return scopedCustomParameterRows(cfg);
  }
  function templateParameters(cfg) {
    var state = cfg || config();
    var base = (template(state) || { parameters: [] }).parameters || [];
    var custom = customParameters(state);
    var baseIds = base.map(function (item) { return item.id; });
    return base.concat(custom.filter(function (item) { return baseIds.indexOf(item.id) < 0; }));
  }
  function sensorRequirements(cfg) {
    var state = cfg || config();
    var tpl = template(state);
    var base = (tpl && tpl.sensorRequirements) || [];
    var runtimeParams = runtime().parameters || {};
    var runtimeIds = Object.keys(runtimeParams).filter(function (id) {
      var param = runtimeParams[id] || {};
      return param.value != null && param.value !== "";
    });
    if (false && isDemoMode() && runtimeIds.length) {
      return runtimeIds.map(function (id) {
        var param = runtimeParams[id] || {};
        var existing = base.find(function (item) { return item.parameterId === id; }) || {};
        return Object.assign({}, existing, {
          id: existing.id || "demo-sensor-" + id,
          parameterId: id,
          requirement: existing.requirement || "required",
          label: existing.label || param.name || id,
          labelEn: existing.labelEn || param.nameEn || param.name || id,
          unit: existing.unit || param.unit || "",
          productImageUrl: existing.productImageUrl || "",
          productName: existing.productName || param.name || id,
          productNameEn: existing.productNameEn || param.nameEn || param.name || id,
          description: existing.description || "DEMO 實際資料參數",
          descriptionEn: existing.descriptionEn || "Parameter available in DEMO data",
          demoLinked: true
        });
      });
    }
    var customById = {};
    customParameters(state).forEach(function (param) { customById[param.id] = param; });
    base = base.map(function (item) {
      var custom = customById[item.parameterId];
      return custom ? Object.assign({}, item, {
        unit: custom.unit || item.unit || "",
        sensorInstalled: custom.sensorInstalled,
        customLinked: true
      }) : item;
    });
    var knownIds = base.map(function (item) { return item.parameterId; });
    var custom = customParameters(state).filter(function (param) {
      return knownIds.indexOf(param.id) < 0;
    }).map(function (param) {
      return {
        id: "custom-sensor-" + param.id,
        parameterId: param.id,
        requirement: "optional",
        label: param.label || param.id,
        labelEn: param.labelEn || param.label || param.id,
        unit: param.unit || "",
        productImageUrl: "",
        productName: param.label || param.id,
        productNameEn: param.labelEn || param.label || param.id,
        description: "客戶自訂參數",
        descriptionEn: "Customer-defined parameter",
        custom: true
      };
    });
    return base.concat(custom);
  }
  function parameterMeta(id) {
    return templateParameters().find(function (item) { return item.id === id; }) || { id: id, label: id };
  }
  function selectedParameterId(cfg) {
    var state = cfg || config();
    var ids = templateParameters(state).map(function (item) { return item.id; });
    return ids.indexOf(state.selectedParameterId) >= 0 ? state.selectedParameterId : (ids[0] || "DO");
  }
  function trendSeriesFor(id) {
    var data = runtime();
    var series = (data.trendSeries || {})[id];
    if (series) return applyConfiguredStandard(id, series);
    return id === "GI" && hasImport() ? derivedGiTrendSeries(data, config()) : null;
  }
  function derivedGiTrendSeries(data, cfg) {
    var batch = data.batchTiming || cultureMetrics(cfg);
    var progress = Number(batch.cultureProgressPct || 0);
    var score = Number(data.giScore || progress || 0);
    if (!score && !progress) return null;
    var actualNow = Math.max(0, Math.min(100, score || progress));
    var early = Math.max(0, Math.round(actualNow * 0.55));
    var mid = Math.max(0, Math.round((early + actualNow) / 2));
    var forecastEnd = Math.max(actualNow, Math.min(100, Math.round(actualNow + (100 - actualNow) * 0.55)));
    return {
      min: 0,
      max: 100,
      valueUnit: "%",
      standard: [35, 55, 75, 100],
      actual: [early, mid, actualNow],
      forecast: [actualNow, Math.round((actualNow + forecastEnd) / 2), forecastEnd],
      targetWeightG: cfg.targetWeightGMid || null
    };
  }
  function parameterStandardRows(id, cfg) {
    var state = cfg || config();
    var saved = ((state.parameterStandards || {})[id] || []);
    if (saved.length) return saved;
    var tpl = template(state);
    return tpl && tpl.standardProfiles && tpl.standardProfiles[id] ? tpl.standardProfiles[id] : [];
  }
  function customStandardRows(id, cfg) {
    var state = cfg || config();
    var rows = ((state.parameterStandards || {})[id] || []);
    if (!rows.length) return [];
    var tpl = template(state);
    var defaults = tpl && tpl.standardProfiles && tpl.standardProfiles[id] ? tpl.standardProfiles[id] : [];
    return standardsEqual(rows, defaults) ? [] : rows;
  }
  function standardsEqual(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    var keys = ["label", "start", "end", "idealMin", "idealMax", "warningMin", "warningMax", "dangerMin", "dangerMax"];
    return a.every(function (row, index) {
      var other = b[index] || {};
      return keys.every(function (key) { return String(row[key] == null ? "" : row[key]) === String(other[key] == null ? "" : other[key]); });
    });
  }
  function emptyStandardRow() {
    return { label: "", start: "", end: "", idealMin: "", idealMax: "", warningMin: "", warningMax: "", dangerMin: "", dangerMax: "" };
  }
  function emptyRuntimeParameter(meta) {
    return {
      name: meta.label || meta.id,
      unit: meta.unit || "",
      score: null,
      value: "",
      light: null,
      label: "",
      ratio: { blue: 0, green: 0, yellow: 0, orange: 0, red: 0 },
      coverage: 0,
      isFresh: false,
      freshnessStatus: "not_imported",
      sensorInstalled: meta.sensorInstalled !== false,
      custom: meta.custom === true
    };
  }
  function runtimeParameter(id) {
    return (runtime().parameters || {})[id] || emptyRuntimeParameter(parameterMeta(id));
  }
  function timeToMinutes(value) {
    var parts = String(value || "00:00").split(":");
    return Math.max(0, Math.min(1440, Number(parts[0] || 0) * 60 + Number(parts[1] || 0)));
  }
  function rowAtMinute(rows, minute) {
    return (rows || []).find(function (row) {
      var start = timeToMinutes(row.start);
      var end = timeToMinutes(row.end);
      if (start === end) return true;
      return start < end ? minute >= start && minute <= end : minute >= start || minute <= end;
    }) || (rows || [])[0] || null;
  }
  function standardScoreFor(id, row) {
    if (!row) return 100;
    var min = Number(row.idealMin);
    var max = Number(row.idealMax);
    var mid = Number.isFinite(max) && max > 0 ? (Number.isFinite(min) ? (min + max) / 2 : max) : min;
    if (!Number.isFinite(mid)) return 100;
    if (id === "DO") return Math.round(Math.max(45, Math.min(100, mid / 7 * 100)));
    if (id === "pH") return Math.round(Math.max(50, Math.min(100, 100 - Math.abs(mid - 8) * 18)));
    if (id === "orpMv") return Math.round(Math.max(50, Math.min(100, mid / 450 * 100)));
    if (id === "salinityPpt") return Math.round(Math.max(55, Math.min(100, 100 - Math.abs(mid - 20) * 2)));
    if (id === "waterTempC") return Math.round(Math.max(55, Math.min(100, 100 - Math.abs(mid - 28) * 5)));
    return 100;
  }
  function configuredStandardLine(id) {
    var rows = parameterStandardRows(id);
    if (!rows.length) return null;
    return [0, 480, 960, 1440].map(function (minute) {
      return standardScoreFor(id, rowAtMinute(rows, minute));
    });
  }
  function applyConfiguredStandard(id, series) {
    if (!series || id === "WQI" || id === "GI") return series;
    var line = configuredStandardLine(id);
    if (!line) return series;
    return Object.assign({}, series, { standard: line });
  }
  function isMobile() { return document.body && document.body.classList.contains("mobilePlatform"); }
  function resolveAssetUrl(url) {
    if (!url || /^(?:https?:|data:|blob:|\/)/i.test(url)) return url || "";
    var path = String(root.location && root.location.pathname || "");
    if ((path.indexOf("/desktop/") >= 0 || path.indexOf("/mobile/") >= 0) && url.indexOf("../") !== 0) return "../" + url;
    return url;
  }
  function hasImport() {
    var data = runtime();
    return Boolean(data.mode && data.mode !== "NO_DATA" && data.source && data.source !== "未匯入");
  }
  function hasDecisionOutput() {
    var data = runtime();
    return hasImport() && Array.isArray(data.decisions) && data.decisions.length > 0;
  }
  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch];
    });
  }
  function el(id) { return document.getElementById(id); }
  function val(id) { return el(id) ? el(id).value : ""; }
  function dot(light) { return '<span class="dot ' + esc(light || "none") + '"></span>'; }
  function showValue(value, suffix) {
    if (value == null || value === "") return t("未設定");
    return String(value) + (suffix || "");
  }
  function stockingDensity(cfg) {
    var count = Number(cfg.stockingCount || 0);
    var area = Number(cfg.pondAreaM2 || 0);
    if (!count || !area || area <= 0) return null;
    return Math.round((count / area) * 10) / 10;
  }
  function targetSpecRule(value) {
    var match = String(value || "").match(/^(\d+)\s*\/\s*(\d+)$/);
    if (!match) return {};
    var minCount = Number(match[1]);
    var maxCount = Number(match[2]);
    if (!minCount || !maxCount) return {};
    var poundG = 453.592;
    var minWeight = poundG / Math.max(minCount, maxCount);
    var maxWeight = poundG / Math.min(minCount, maxCount);
    var midWeight = (minWeight + maxWeight) / 2;
    return {
      targetSpecUnit: "每磅尾數",
      targetCountPerLbMin: Math.min(minCount, maxCount),
      targetCountPerLbMax: Math.max(minCount, maxCount),
      targetWeightGMin: Math.round(minWeight * 10) / 10,
      targetWeightGMax: Math.round(maxWeight * 10) / 10,
      targetWeightGMid: Math.round(midWeight * 10) / 10
    };
  }
  function todayDate() {
    return new Date(new Date().toDateString());
  }
  function cultureMetrics(cfg) {
    var stocking = cfg.stockingDate ? new Date(cfg.stockingDate + "T00:00:00") : null;
    var harvest = cfg.plannedHarvestDate ? new Date(cfg.plannedHarvestDate + "T00:00:00") : null;
    var today = todayDate();
    if (!stocking || !harvest || Number.isNaN(stocking.getTime()) || Number.isNaN(harvest.getTime())) {
      return {
        daysAfterStocking: null,
        plannedCultureDays: null,
        daysToHarvest: null,
        cultureProgressPct: 0,
        cultureDayLabelZh: "未設定"
      };
    }
    var plannedCultureDays = Math.floor((harvest.getTime() - stocking.getTime()) / 86400000) + 1;
    var rawDay = Math.floor((today.getTime() - stocking.getTime()) / 86400000) + 1;
    var daysToHarvest = Math.floor((harvest.getTime() - today.getTime()) / 86400000);
    var progress = plannedCultureDays > 0 ? Math.max(0, Math.min(100, Math.round(rawDay / plannedCultureDays * 100))) : 0;
    var label = rawDay < 1 ? "尚未放苗" : daysToHarvest < 0 ? "已超過預估收成日 " + Math.abs(daysToHarvest) + " 天" : "第 " + rawDay + " 天";
    return {
      daysAfterStocking: rawDay < 1 ? null : rawDay,
      plannedCultureDays: plannedCultureDays,
      daysToHarvest: daysToHarvest,
      cultureProgressPct: progress,
      cultureDayLabelZh: label
    };
  }

  function shell(page, content) {
    return isMobile() ? mobileShell(page, content) : desktopShell(page, content);
  }
  function desktopPageFromHash(fallback) {
    var hash = String(root.location && root.location.hash || "").replace(/^#/, "");
    var match = hash.match(/(?:^|&)page=([^&]+)/);
    var page = match ? decodeURIComponent(match[1]) : "";
    return ["settings", "overview", "parameter", "control", "decisions"].indexOf(page) >= 0 ? page : fallback;
  }
  function setDesktopPage(page) {
    if (root.location && root.location.hash !== "#page=" + page) root.location.hash = "#page=" + page;
    mount(lastRoot, page);
  }
  function enterTemplatePage(page) {
    var target = page || "overview";
    if (isMobile()) {
      if (root.location && root.location.hash) root.location.hash = "";
      mount(lastRoot, target);
      return;
    }
    setDesktopPage(target);
  }
  function cardClass() { return isMobile() ? "mobileCard" : "panel"; }
  function headClass() { return isMobile() ? "mobileCardHead" : "panelHeader"; }
  function bodyClass() { return isMobile() ? "mobileCardBody" : "panelBody"; }
  function wrap(html) { return isMobile() ? '<div class="mobilePageGrid">' + html + '</div>' : html; }

  function renderCustomParameterSettings(cfg) {
    var rows = rawCustomParameterRows(cfg);
    if (!rows.length) rows = [{ id: "", label: "", unit: "", weight: "", sensorInstalled: true }];
    return '<section class="standardSettings customParameterSettings"><div class="sectionTitle standardTitleRow"><div><h3>自訂感測器參數</h3><p>選填。可新增 NH4/NO2、濁度或其他案場參數；資料匯入時 parameterId 對應此代碼即可顯示。</p></div><button type="button" class="actionButton" id="addCustomParameter">新增參數</button></div>' +
      '<div class="customParamRows">' + rows.map(function (row, index) { return renderCustomParameterRow(row, index); }).join("") + '</div></section>';
  }
  function customParameterPresets() {
    return [
      { id: "NH4", label: "NH4/NH3", unit: "mg/L", weight: "選配" },
      { id: "NO2", label: "NO2", unit: "mg/L", weight: "選配" },
      { id: "turbidityNtu", label: "濁度", unit: "NTU", weight: "選配" }
    ];
  }
  function customPresetFor(row) {
    var id = String(row && row.id || "");
    return customParameterPresets().find(function (preset) { return preset.id === id; }) || null;
  }
  function customPresetOptions(selectedId) {
    return '<option value="">' + esc(l("請選擇", "Select")) + '</option>' + customParameterPresets().map(function (preset) {
      return '<option value="' + esc(preset.id) + '"' + (selectedId === preset.id ? " selected" : "") + '>' + esc(preset.label) + '</option>';
    }).join("");
  }
  function renderCustomParameterRow(row, index) {
    var base = "customParam_" + index + "_";
    var preset = customPresetFor(row);
    return '<div class="customParamRow" data-custom-param-index="' + index + '">' +
      '<label>預設選單<select id="' + base + 'preset" data-custom-param-preset="' + index + '">' + customPresetOptions(preset ? preset.id : "") + '</select></label>' +
      '<label>參數代碼<input id="' + base + 'id" value="' + esc(row.id || "") + '" placeholder="NH4 / NO2 / turbidity"></label>' +
      '<label>顯示名稱<input id="' + base + 'label" value="' + esc(row.label || "") + '" placeholder="氨氮 / 亞硝酸 / 濁度"></label>' +
      '<label>單位<input id="' + base + 'unit" value="' + esc(row.unit || "") + '" placeholder="mg/L / NTU"></label>' +
      '<label>權重<input id="' + base + 'weight" value="' + esc(row.weight || "") + '" placeholder="自訂"></label>' +
      '<label>感測器<select id="' + base + 'sensorInstalled"><option value="true"' + (row.sensorInstalled === false ? "" : " selected") + '>已安裝</option><option value="false"' + (row.sensorInstalled === false ? " selected" : "") + '>未安裝</option></select></label>' +
      '<button type="button" class="iconDanger" data-remove-custom-param="' + index + '">刪除</button>' +
    '</div>';
  }
  function renderStandardSettings(cfg, tpl) {
    var params = templateParameters(cfg).map(function (param) {
      var rows = customStandardRows(param.id, cfg);
      if (!rows.length) rows = [emptyStandardRow()];
      var stateLabel = customStandardRows(param.id, cfg).length ? "使用客戶自訂" : "選填，未填則套用系統標準";
      return '<details class="standardParam"><summary><strong>' + esc(param.label) + '</strong><span>' + esc(stateLabel) + '</span></summary><div class="standardRows">' + rows.map(function (row, index) {
        return renderStandardRow(param, row, index);
      }).join("") + '</div></details>';
    }).join("");
    return '<section class="standardSettings"><div class="sectionTitle standardTitleRow"><div><h3>參數標準線自訂</h3><p>選填。未填寫時，平台會自動套用白蝦系統標準；有填寫時，優先使用客戶自訂標準。</p></div><button type="button" class="actionButton danger" id="clearParameterStandards">清除自訂標準</button></div>' + params + '</section>';
  }
  function renderStandardRow(param, row, index) {
    var base = 'std_' + param.id + '_' + index + '_';
    return '<div class="standardRow" data-standard-param="' + esc(param.id) + '" data-standard-index="' + index + '">' +
      '<label>時段<input id="' + base + 'label" value="' + esc(row.label || "") + '"></label>' +
      '<label>開始<input type="time" id="' + base + 'start" value="' + esc(row.start || "") + '"></label>' +
      '<label>結束<input type="time" id="' + base + 'end" value="' + esc(row.end || "") + '"></label>' +
      '<label>理想低<input type="number" step="0.1" id="' + base + 'idealMin" value="' + esc(row.idealMin == null ? "" : row.idealMin) + '"></label>' +
      '<label>理想高<input type="number" step="0.1" id="' + base + 'idealMax" value="' + esc(row.idealMax == null ? "" : row.idealMax) + '"></label>' +
      '<label>警戒低<input type="number" step="0.1" id="' + base + 'warningMin" value="' + esc(row.warningMin == null ? "" : row.warningMin) + '"></label>' +
      '<label>警戒高<input type="number" step="0.1" id="' + base + 'warningMax" value="' + esc(row.warningMax == null ? "" : row.warningMax) + '"></label>' +
      '<label>危險低<input type="number" step="0.1" id="' + base + 'dangerMin" value="' + esc(row.dangerMin == null ? "" : row.dangerMin) + '"></label>' +
      '<label>危險高<input type="number" step="0.1" id="' + base + 'dangerMax" value="' + esc(row.dangerMax == null ? "" : row.dangerMax) + '"></label>' +
    '</div>';
  }
  function renderStockingDensityPreview(cfg) {
    var density = cfg.stockingDensityPerM2 != null ? cfg.stockingDensityPerM2 : stockingDensity(cfg);
    var targetWeight = formatTargetWeightFromSpec(cfg.targetSpec);
    return '<div class="derivedInfo"><span>' + esc(l("放養密度", "Stocking Density")) + '</span><strong>' + esc(showValue(density, isEn() ? " shrimp/m2" : " 尾/m2")) + '</strong></div><div class="derivedInfo"><span>' + esc(l("目標單尾重", "Target Weight")) + '</span><strong>' + esc(targetWeight) + '</strong></div>';
  }

  function bindSetup() {
    var industry = el("setupIndustry");
    var species = el("setupSpecies");
    function collectSiteConfig(tpl) {
      var next = {};
      if (!tpl || !tpl.siteFields) return next;
      tpl.siteFields.forEach(function (field) { next[field.id] = val("site_" + field.id); });
      if (!next.breed) next.breed = tpl.defaultBreed || tpl.scientificName || "";
      Object.assign(next, cultureMetrics(next));
      Object.assign(next, targetSpecRule(next.targetSpec));
      next.stockingDensityPerM2 = stockingDensity(next);
      Object.assign(next, scopedConfigPatch(collectCustomParameters()));
      next.parameterStandards = collectStandardConfig(tpl, next);
      return next;
    }
    function collectCustomParameters() {
      var rows = [];
      document.querySelectorAll("[data-custom-param-index]").forEach(function (row) {
        var index = row.dataset.customParamIndex;
        var id = val("customParam_" + index + "_id");
        var label = val("customParam_" + index + "_label");
        var unit = val("customParam_" + index + "_unit");
        var weight = val("customParam_" + index + "_weight");
        var sensorInstalled = val("customParam_" + index + "_sensorInstalled") !== "false";
        if (!id && !label && !unit && !weight) return;
        rows.push(normalizeCustomParameter({ id: id, label: label || id, unit: unit, weight: weight || "自訂", sensorInstalled: sensorInstalled }, rows.length));
      });
      return rows;
    }
    function collectStandardConfig(tpl, nextConfig) {
      var out = {};
      var nextState = Object.assign({}, config(), nextConfig || {});
      templateParameters(nextState).forEach(function (param) {
        var sourceRows = customStandardRows(param.id, nextState);
        if (!sourceRows.length) sourceRows = [emptyStandardRow()];
        var rows = sourceRows.map(function (row, index) {
          var base = "std_" + param.id + "_" + index + "_";
          return {
            label: val(base + "label") || "",
            start: val(base + "start") || "",
            end: val(base + "end") || "",
            idealMin: numberOrBlank(val(base + "idealMin")),
            idealMax: numberOrBlank(val(base + "idealMax")),
            warningMin: numberOrBlank(val(base + "warningMin")),
            warningMax: numberOrBlank(val(base + "warningMax")),
            dangerMin: numberOrBlank(val(base + "dangerMin")),
            dangerMax: numberOrBlank(val(base + "dangerMax"))
          };
        }).filter(hasCustomStandardValue);
        if (rows.length) out[param.id] = rows;
      });
      return out;
    }
    function hasCustomStandardValue(row) {
      return Boolean(row.label || row.start || row.end || row.idealMin !== "" || row.idealMax !== "" || row.warningMin !== "" || row.warningMax !== "" || row.dangerMin !== "" || row.dangerMax !== "");
    }
    function numberOrBlank(value) {
      var n = Number(value);
      return value === "" || !Number.isFinite(n) ? "" : n;
    }
    function persistSiteConfig(navigate) {
      var cfg = config();
      var tpl = template(cfg);
      if (!tpl) return;
      suppressNextConfigRemount = !navigate;
      Settings.saveConfig(collectSiteConfig(tpl));
      if (navigate) enterTemplatePage("overview");
    }
    if (industry) industry.onchange = function () { Settings.saveConfig({ industry: industry.value, species: "" }); mount(lastRoot, "settings"); };
    if (species) species.onchange = function () { Settings.saveConfig({ industry: val("setupIndustry"), species: species.value }); mount(lastRoot, "settings"); };
    document.querySelectorAll("[data-industry-choice]").forEach(function (button) {
      button.onclick = function () { Settings.saveConfig({ industry: button.dataset.industryChoice, species: "" }); mount(lastRoot, "settings"); };
    });
    document.querySelectorAll("[data-template]").forEach(function (button) {
      button.onclick = function () { Settings.saveConfig({ industry: val("setupIndustry"), species: button.dataset.template }); mount(lastRoot, "settings"); };
    });
    var save = el("saveSiteConfig");
    (template(config()) || { siteFields: [] }).siteFields.forEach(function (field) {
      var input = el("site_" + field.id);
      if (input) input.onchange = function () { persistSiteConfig(false); };
    });
    document.querySelectorAll(".standardRow input").forEach(function (input) {
      input.onchange = function () { persistSiteConfig(false); };
    });
    document.querySelectorAll("[data-custom-param-preset]").forEach(function (select) {
      select.onchange = function () {
        var index = select.dataset.customParamPreset;
        var preset = customParameterPresets().find(function (item) { return item.id === select.value; });
        if (!preset) return;
        var idInput = el("customParam_" + index + "_id");
        var labelInput = el("customParam_" + index + "_label");
        var unitInput = el("customParam_" + index + "_unit");
        var weightInput = el("customParam_" + index + "_weight");
        if (idInput) idInput.value = preset.id;
        if (labelInput) labelInput.value = preset.label;
        if (unitInput) unitInput.value = preset.unit;
        if (weightInput) weightInput.value = preset.weight;
        persistSiteConfig(false);
        mount(lastRoot, "settings");
      };
    });
    document.querySelectorAll(".customParamRow input, .customParamRow select").forEach(function (input) {
      if (input.matches("[data-custom-param-preset]")) return;
      input.onchange = function () { persistSiteConfig(false); };
    });
    var addCustom = el("addCustomParameter");
    if (addCustom) addCustom.onclick = function () {
      var rows = collectCustomParameters();
      rows.push({ id: "", label: "", unit: "", weight: "", sensorInstalled: true });
      Settings.saveConfig(scopedConfigPatch(rows));
      mount(lastRoot, "settings");
    };
    document.querySelectorAll("[data-remove-custom-param]").forEach(function (button) {
      button.onclick = function () {
        var removeIndex = Number(button.dataset.removeCustomParam);
        var rows = collectCustomParameters().filter(function (_, index) { return index !== removeIndex; });
        var standards = Object.assign({}, config().parameterStandards || {});
        customParameters(config()).forEach(function (param, index) {
          if (index === removeIndex) delete standards[param.id];
        });
        Settings.saveConfig(scopedConfigPatch(rows, { parameterStandards: standards }));
        mount(lastRoot, "settings");
      };
    });
    ["site_stockingDate", "site_plannedHarvestDate"].forEach(function (id) {
      var input = el(id);
      if (input) input.onchange = function () {
        persistSiteConfig(false);
        var preview = el("cultureProgressPreview");
        if (!preview) return;
        var previewCfg = Object.assign({}, config(), {
          stockingDate: val("site_stockingDate"),
          plannedHarvestDate: val("site_plannedHarvestDate")
        });
        preview.innerHTML = renderCultureProgress(previewCfg, {}) + renderStockingDensityPreview(previewCfg);
      };
    });
    if (save) save.onclick = function () {
      var targetPage = save.dataset && save.dataset.templateEnter ? save.dataset.templateEnter : "";
      if (targetPage) {
        Settings.saveConfig(collectSiteConfig(template(config())));
        enterTemplatePage(targetPage);
        return;
      }
      persistSiteConfig(true);
    };
    var clear = el("clearPlatform");
    if (clear) clear.onclick = function () { Settings.clearPlatformState(); mount(lastRoot, "settings"); };
    var clearStandards = el("clearParameterStandards");
    if (clearStandards) clearStandards.onclick = function () {
      Settings.saveConfig({ parameterStandards: {} });
      mount(lastRoot, "settings");
    };
  }
  function isEditingSetupField() {
    if (lastPage !== "settings") return false;
    var node = document.activeElement;
    if (!node || !node.matches) return false;
    return node.matches("input, select, textarea");
  }

  function renderOverview() {
    if (!isMobile()) return '<div class="desktopOverview"><div class="desktopColumn">' + renderSitePanel() + renderWqiPanel() + '</div><div class="desktopColumn desktopMain">' + renderGiPanel() + renderVisionPanel() + '</div><div class="desktopColumn">' + renderAiPanel() + renderWeatherPanel() + renderDeviceStatusPanel() + '</div></div>';
    var selected = config().mobileOverviewMetric === "GI" ? "GI" : "WQI";
    return wrap('<section class="' + cardClass() + '"><div class="' + headClass() + '"><h2>' + esc(l("總覽", "Overview")) + '</h2><span class="badge">' + esc(config().pondId || l("未設定", "Not set")) + '</span></div><div class="' + bodyClass() + ' stack"><div class="mobileMetricGrid">' + metricCard("WQI", hasImport() ? runtime().wqi : "--", hasImport() ? runtimeLabel(runtime(), "wqiLabel", l("已計算", "Calculated")) : l("未計算", "Not calculated"), hasImport() ? l("扣分來源", "Deduction Source") + ": " + runtimeLabel(runtime(), "rootCause", l("無", "None")) : l("等待水質資料", "Waiting for water quality data"), selected === "WQI", "WQI") + metricCard("GI", hasImport() ? (runtime().giScore || "--") : "--", hasImport() ? l("資料待接", "Data pending") : l("未計算", "Not calculated"), giNote(), selected === "GI", "GI") + '</div>' + renderAiSummary() + renderMobileOverviewDetail(selected) + '</div></section>');
  }
  function renderDemoToggle() {
    var active = isDemoMode();
    return '<section class="demoControlBar"><div><strong>' + esc(active ? l("DEMO 展示模式", "DEMO mode") : l("正式等待資料模式", "Live mode: waiting for data")) + '</strong></div><button class="actionButton ' + (active ? "danger" : "primary") + '" id="toggleDemoMode">' + esc(active ? l("回復無資料狀態", "Back to no-data mode") : l("啟用 DEMO", "Enable DEMO")) + '</button></section>';
  }

  function lightForScore(score, fallback) {
    var n = Number(score);
    if (!Number.isFinite(n)) return fallback || "yellow";
    if (n >= 80) return "green";
    if (n >= 60) return "yellow";
    return "red";
  }
  function scoreRing(title, score, light, label, lines) {
    var n = Number(score);
    var pct = Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0;
    var display = Number.isFinite(n) ? Math.round(n) : "--";
    var safeLight = light || lightForScore(score, "yellow");
    return '<div class="scoreRingBlock"><div class="scoreRing ' + esc(safeLight) + '" style="--ring-pct:' + pct + '%"><span>' + esc(display) + '</span></div><div class="scoreRingInfo"><h3>' + esc(title) + '</h3><span class="statusPill ' + esc(safeLight) + '">' + dot(safeLight) + esc(label || "已計算") + '</span>' + (lines || []).map(function (line) { return '<p>' + esc(line) + '</p>'; }).join("") + '</div></div>';
  }

  function metricCard(title, value, label, note, active, detailKey) {
    var light = title === "WQI" ? lightForScore(value, runtime().wqiLight) : title === "GI" ? lightForScore(value, runtime().giLight || "green") : lightForScore(value, "yellow");
    var scoreHtml = hasImport() && (title === "WQI" || title === "GI") ? '<span class="miniScoreRing ' + esc(light) + '" style="--ring-pct:' + Math.max(0, Math.min(100, Number(value) || 0)) + '%"><b>' + esc(value) + '</b></span>' : '<strong>' + esc(value) + '</strong>';
    return '<article class="mobileMetric ' + (active ? "active" : "") + '"' + (detailKey ? ' data-mobile-overview="' + esc(detailKey) + '"' : "") + '><div class="row"><h3>' + esc(title) + '</h3><span class="badge">' + dot(hasImport() ? light : "yellow") + esc(label) + '</span></div>' + scoreHtml + '<p class="muted">' + esc(note) + '</p></article>';
  }
  function renderMobileOverviewDetail(selected) {
    if (!hasImport()) return "";
    if (selected === "GI") {
      return renderMobileGiDetail();
    }
    return renderMobileWqiDetail();
  }
  function renderMobileWqiDetail() {
    return '<div class="mobileOverviewDetail">' + renderDeductionRatio() + renderLightRatio(runtime().parameters) + renderChartPanel("WQI", "WQI 三線趨勢") + '</div>';
  }
  function renderMobileGiDetail() {
    var batch = runtime().batchTiming || {};
    var cfg = config();
    return '<div class="mobileOverviewDetail"><article class="' + cardClass() + '"><div class="' + headClass() + '"><h2>GI 成長資料</h2></div><div class="' + bodyClass() + ' stack"><p>預估收成：剩餘 ' + esc(hasImport() && batch.daysToHarvest != null ? batch.daysToHarvest : "--") + ' 天</p>' + renderCultureProgress(cfg, runtime()) + '<p class="muted">成長影像與估重資料匯入後，GI 會同步更新。</p></div></article>' + renderChartPanel("GI", "GI 成長三線", { score: runtime().giScore }) + renderVisionPanel() + '</div>';
  }
  function giNote() {
    var batch = runtime().batchTiming || {};
    if (hasImport() && batch.daysToHarvest != null) return "預估收成：剩餘 " + batch.daysToHarvest + " 天";
    return "等待成長資料";
  }
  function renderSitePanel() {
    var cfg = config();
    var tpl = template(cfg);
    var industry = industryLabel(cfg.industry);
    var density = cfg.stockingDensityPerM2 != null ? cfg.stockingDensityPerM2 : stockingDensity(cfg);
    var targetWeight = formatTargetWeightFromSpec(cfg.targetSpec);
    return '<section class="panel"><div class="panelHeader"><h2>' + esc(l("生物選單", "Species Profile")) + '</h2><button class="linkButton muted" type="button" data-desktop-page="settings">' + esc(l("設定現場資訊", "Site Settings")) + '</button></div><div class="panelBody stack">' +
      '<div class="confirmGrid">' +
      '<p><span>' + esc(l("產業", "Industry")) + '</span><strong>' + esc(industry) + '</strong></p>' +
      '<p><span>' + esc(l("生物", "Species")) + '</span><strong>' + esc(tpl ? templateLabel(tpl) : l("未設定", "Not set")) + '</strong></p>' +
      '<p><span>' + esc(l("品種", "Breed")) + '</span><strong>' + esc(siteFieldValue(tpl, "breed", cfg.breed)) + '</strong></p>' +
      '<p><span>' + esc(l("養殖模式", "Culture Mode")) + '</span><strong>' + esc(siteFieldValue(tpl, "cultureMode", cfg.cultureMode)) + '</strong></p>' +
      '<p><span>' + esc(l("目標規格", "Target Size")) + '</span><strong>' + esc(showValue(cfg.targetSpec)) + '</strong></p>' +
      '<p><span>' + esc(l("目標單尾重", "Target Weight")) + '</span><strong>' + esc(targetWeight) + '</strong></p>' +
      '<p><span>' + esc(l("池別 / 批次", "Pond / batch")) + '</span><strong>' + esc(showValue(cfg.pondId)) + '</strong></p>' +
      '<p><span>' + esc(l("放苗日", "Stocking Date")) + '</span><strong>' + esc(showValue(cfg.stockingDate)) + '</strong></p>' +
      '<p><span>' + esc(l("預估收成日", "Planned Harvest Date")) + '</span><strong>' + esc(showValue(cfg.plannedHarvestDate)) + '</strong></p>' +
      '<p><span>' + esc(l("放養尾數", "Stocking Count")) + '</span><strong>' + esc(showValue(cfg.stockingCount, isEn() ? " shrimp" : " 尾")) + '</strong></p>' +
      '<p><span>' + esc(l("放養密度", "Stocking Density")) + '</span><strong>' + esc(showValue(density, isEn() ? " shrimp/m2" : " 尾/m2")) + '</strong></p>' +
      '<p><span>' + esc(l("池面積", "Pond Area")) + '</span><strong>' + esc(showValue(cfg.pondAreaM2, " m2")) + '</strong></p>' +
      '<p><span>' + esc(l("水量", "Water Volume")) + '</span><strong>' + esc(showValue(cfg.waterVolumeM3, " m3")) + '</strong></p>' +
      '</div>' + renderCultureProgress(cfg, runtime()) + '</div></section>';
  }
  function renderWqiPanel() {
    var data = runtime();
    if (!hasImport()) return emptyPanel("WQI 水質環境指數", "尚未匯入水質資料");
    return '<section class="panel"><div class="panelHeader"><h2>' + esc(l("WQI 水質環境指數", "WQI Water Quality Index")) + '</h2></div><div class="panelBody stack">' + scoreRing("WQI", data.wqi, data.wqiLight, runtimeLabel(data, "wqiLabel", l("已計算", "Calculated")), [l("扣分來源", "Deduction Source") + ": " + runtimeLabel(data, "rootCause", l("無", "None")), l("覆蓋率", "Coverage") + " " + (data.coverage || 0) + "%"]) + renderDeductionRatio() + renderLightRatio(data.parameters) + renderChartPanel("WQI", l("WQI 三線趨勢", "WQI Trend")) + '</div></section>';
  }
  function renderGiPanel() {
    var data = runtime();
    if (!hasImport()) return emptyPanel("GI 成長指數", "尚未匯入成長資料");
    var batch = data.batchTiming || {};
    var targetWeight = formatTargetWeightFromSpec(config().targetSpec);
    return '<section class="panel"><div class="panelHeader"><h2>' + esc(l("GI 成長指數", "GI Growth Index")) + '</h2></div><div class="panelBody stack">' + scoreRing("GI", data.giScore || "--", data.giLight || "green", runtimeLabel(data, "giLabel", l("已計算", "Calculated")), [l("目標單尾重", "Target Weight") + ": " + targetWeight, l("預估收成", "Estimated Harvest") + ": " + (batch.daysToHarvest == null ? "--" : batch.daysToHarvest + " " + l("天", "days"))]) + renderChartPanel("GI", l("GI 成長三線", "GI Growth Trend"), { score: data.giScore, light: data.giLight || "green" }) + '</div></section>';
  }
  function renderVisionPanel() {
    var vision = runtime().underwaterVision || runtime().vision || {};
    var imageUrl = hasImport() ? resolveAssetUrl(vision.imageUrl || vision.frameUrl || vision.previewUrl || "") : "";
    var media = imageUrl
      ? '<img src="' + esc(imageUrl) + '" alt="水下即時影像">'
      : '<div class="visionPlaceholder"><strong>尚未匯入影像資料</strong></div>';
    return '<section class="panel"><div class="panelHeader"><h2>水下影像 AI</h2></div><div class="panelBody desktopVision"><div class="visionBox">' + media + '</div><div class="stack"><p>AI 體長：' + esc(hasImport() && vision.bodyLengthCm != null ? vision.bodyLengthCm + " cm" : "--") + '</p><p>轉換體重：' + esc(hasImport() && vision.bodyWeightG != null ? vision.bodyWeightG + " g" : "--") + '</p><p>估計尾數：' + esc(hasImport() && vision.estimatedCountPerLb != null ? vision.estimatedCountPerLb + " 尾/磅" : "--") + '</p><p>影像可信度：' + esc(hasImport() && vision.confidencePct != null ? vision.confidencePct + "%" : "等待資料") + '</p></div></div></section>';
  }
  function renderWeatherPanel() {
    var w = runtime().weatherContext;
    if (!hasImport() || !w) return emptyPanel(l("微氣象站 / 72h 預測", "Micro Weather / 72h Forecast"), l("尚未匯入氣象資料", "No weather data imported"));
    var rows = localizedWeatherSummary(w);
    return '<section class="panel"><div class="panelHeader"><h2>' + esc(l("微氣象站 / 72h 預測", "Micro Weather / 72h Forecast")) + '</h2></div><div class="panelBody stack">' + rows.map(function (row) { return '<p>' + esc(row) + '</p>'; }).join("") + '</div></section>';
  }
  function renderAiPanel() {
    var decisions = runtime().decisions || [];
    if (!hasDecisionOutput()) return emptyPanel("AI 決策支援", "等待資料匯入");
    return '<section class="panel"><div class="panelHeader"><h2>AI 決策支援</h2></div><div class="panelBody">' + renderDecisionCard(decisions[0]) + '</div></section>';
  }
  function renderAiSummary() {
    var decisions = runtime().decisions || [];
    if (!hasDecisionOutput()) return '<article class="mobileCard warn"><div class="mobileCardBody"><h3>AI 決策支援</h3><p>等待資料匯入</p></div></article>';
    return '<article class="mobileCard warn"><div class="mobileCardBody">' + renderDecisionCard(decisions[0]) + '</div></article>';
  }
  function renderDeviceStatusPanel() {
    var devices = runtime().controlDevices || [];
    if (!hasImport() || !devices.length) return emptyPanel("設備狀態", "尚未匯入設備頻道");
    return '<section class="panel"><div class="panelHeader"><h2>設備狀態</h2></div><div class="panelBody stack">' + devices.slice(0, 3).map(function (device) {
      return '<p>' + dot(String(device.status).toUpperCase() === "ON" ? "green" : "none") + ' ' + esc(device.displayName || device.channelName || device.id) + '：' + esc(device.status || "--") + '</p>';
    }).join("") + '</div></section>';
  }
  function renderControlPage() {
    if (!isMobile()) return '<div class="desktopControl"><div class="desktopColumn">' + renderCurrentStatePanel() + renderWeatherPanel() + renderSelectedDevicePanel() + '</div><div class="desktopColumn desktopMain">' + renderDevicePanel() + '</div><div class="desktopColumn">' + renderControlForecast() + '</div></div>';
    return wrap('<section class="' + cardClass() + '"><div class="' + headClass() + '"><h2>AI 回控</h2></div><div class="' + bodyClass() + ' stack">' + renderDevicePanel() + renderControlForecast() + '</div></section>');
  }
  function renderDecisionsPage() {
    var decisions = runtime().decisions || [];
    var html = hasDecisionOutput() ? '<div class="' + (isMobile() ? "decisionList" : "desktopDecisionGrid") + '">' + decisions.map(renderDecisionCard).join("") + '</div>' : '<div class="emptyState"><h3>等待資料匯入</h3></div>';
    if (!isMobile()) return '<section class="panel desktopDecisionCabin"><div class="panelHeader"><h2>AI 智慧決策艙</h2></div><div class="panelBody">' + html + '</div></section>';
    return wrap('<section class="' + cardClass() + '"><div class="' + headClass() + '"><h2>AI 智慧決策艙</h2></div><div class="' + bodyClass() + '">' + html + '</div></section>');
  }
  function renderDevicePanel() {
    var devices = runtime().controlDevices || [];
    if (!hasImport() || !devices.length) return emptyPanel("SCADA 設備控制台", "尚未匯入設備頻道");
    return '<article class="' + cardClass() + '"><div class="' + headClass() + '"><h2>SCADA 設備控制台</h2><span class="badge">' + devices.length + ' 頻道</span></div><div class="' + bodyClass() + '"><div class="deviceList">' + devices.map(renderDeviceRow).join("") + '</div></div></article>';
  }
  function renderCurrentStatePanel() {
    if (!hasImport()) return emptyPanel(l("目前狀態", "Current Status"), l("等待即時資料", "Waiting for real-time data"));
    var data = runtime();
    return '<section class="panel"><div class="panelHeader"><h2>' + esc(l("目前狀態", "Current Status")) + '</h2></div><div class="panelBody stack"><p>WQI: ' + esc(data.wqi == null ? "--" : data.wqi) + '　' + esc(runtimeLabel(data, "wqiLabel", "")) + '</p><p>GI: ' + esc(data.giScore == null ? "--" : data.giScore) + '　' + esc(runtimeLabel(data, "giLabel", "")) + '</p><p>' + esc(l("主要風險", "Primary Risk")) + ': ' + esc(runtimeLabel(data, "rootCause", l("無", "None"))) + '</p></div></section>';
  }
  function renderSelectedDevicePanel() {
    var device = (runtime().controlDevices || []).find(function (item) { return String(item.status || "").toUpperCase() === "ON"; }) || (runtime().controlDevices || [])[0];
    if (!hasImport() || !device) return emptyPanel("選取設備控制", "尚未匯入設備頻道");
    var speed = Number(device.speed || 0);
    var buttons = [0, 20, 40, 60, 80, 100].map(function (value) {
      return '<button class="speedButton ' + (speed === value ? "active" : "") + '" data-demo-speed="' + value + '" data-device-id="' + esc(device.id) + '">' + value + '%</button>';
    }).join("");
    return '<section class="panel"><div class="panelHeader"><h2>選取設備控制</h2><span class="statusPill ' + (String(device.status || "").toUpperCase() === "ON" ? "green" : "") + '">' + dot(String(device.status || "").toUpperCase() === "ON" ? "green" : "none") + esc(device.status || "--") + '</span></div><div class="panelBody stack"><h3>' + esc(device.displayName || device.channelName || device.id) + '</h3><p>' + esc(device.channelId || device.code || "") + ' | ' + esc(device.mode || "") + ' | 目前 ' + esc(speed) + '%</p><div class="progressTrack speedTrack"><div class="progressBar" style="width:' + speed + '%"></div></div><div class="speedButtons">' + buttons + '</div></div></section>';
  }
  function renderControlForecast() {
    if (!hasImport()) return emptyPanel("參數事件回復預測", "尚未產生預測");
    return '<article class="' + cardClass() + '"><div class="' + headClass() + '"><h2>參數事件回復預測</h2></div><div class="' + bodyClass() + ' stack"><canvas class="chartCanvas" data-chart="DO"></canvas></div></article>';
  }
  function renderChartPanel(id, title, param) {
    var series = trendSeriesFor(id);
    var hasData = hasImport() && series && Array.isArray(series.actual) && series.actual.length;
    var score = id === "WQI" ? runtime().wqi : (hasData && param ? param.score : "--");
    var light = id === "WQI" ? runtime().wqiLight : (param && param.light) || lightForScore(score, "green");
    var alertClass = hasData && (light === "red" || light === "yellow" || (id === "DO" && Number(score) < 60)) ? " alertGlow " + light : "";
    var parameterMode = !isMobile() && lastPage === "parameter";
    var side = parameterMode ? '<span class="chartNote">' + esc(chartNote(id, param)) + '</span>' : '<span class="scoreCapsule ' + esc(light) + '">' + esc(id === "WQI" ? "WQI " + (hasImport() ? runtime().wqi : "--") : "分數 " + score) + '</span>';
    return '<article class="' + cardClass() + ' chartCard' + alertClass + '"><div class="chartHeader"><h3>' + esc(title) + '</h3>' + side + '</div>' + (hasData ? '<canvas class="chartCanvas" data-chart="' + esc(id) + '"></canvas>' : '<div class="emptyState"><h3>' + esc(l("尚無有效資料", "No valid data")) + '</h3></div>') + '</article>';
  }
  function chartNote(id, param) {
    var p = param || {};
    if (id === "DO") return hasImport() ? "目前 " + (p.value || "--") + "，預測回升至 5.0" : "等待 DO 資料";
    if (id === "pH") return "理想 7.2-7.8";
    if (id === "orpMv") return "後期理想線會提高";
    if (id === "salinityPpt") return "重點：每日變化 < 3 ppt";
    if (id === "waterTempC") return "理想 28-32 C";
    if (id === "WQI") return "由五參數加權幾何平均";
    return "即時值與預測同步";
  }
  function renderRootCausePanel() {
    if (!hasImport()) return emptyPanel("WQI 根因與燈號", "尚未計算");
    return '<article class="' + cardClass() + '"><div class="' + headClass() + '"><h2>WQI 根因與燈號</h2></div><div class="' + bodyClass() + '">' + renderLightRatio(runtime().parameters) + '</div></article>';
  }
  function renderAutoHandlingPanel() {
    var decisions = runtime().decisions || [];
    if (!hasDecisionOutput()) return emptyPanel("目前自動處理", "尚無處理動作");
    return '<section class="panel"><div class="panelHeader"><h2>目前自動處理</h2></div><div class="panelBody">' + renderDecisionCard(decisions[0]) + '</div></section>';
  }
  function renderParameterAsidePanel() {
    if (!hasImport()) return renderRootCausePanel() + renderParameterRatioPanel() + renderAutoHandlingPanel();
    return renderParameterCausePanel() + renderParameterRatioPanel() + renderParameterAutoPanel();
  }
  function renderParameterCausePanel() {
    var params = runtime().parameters || {};
    var rows = templateParameters(config()).map(function (param) {
      var p = params[param.id] || {};
      var score = Number(p.score);
      var fallbackStatus = param.custom ? "客戶自訂參數" : "等待資料";
      var status = p.label || p.freshnessStatus || fallbackStatus;
      if (Number.isFinite(score)) {
        if (score < 60) status = "主要扣分";
        else if (score < 80) status = "需注意";
        else status = "穩定";
      }
      return {
        id: param.id,
        label: param.shortLabel || param.label || param.id,
        status: status
      };
    });
    return '<article class="panel parameterAsidePanel compactCausePanel"><div class="panelHeader"><h2>WQI 根因狀態</h2></div><div class="panelBody"><div class="causeCompactList">' + rows.map(function (row) {
      var p = params[row.id] || {};
      var light = p.light || "none";
      return '<div class="causeCompactRow"><span>' + dot(light) + '</span><strong>' + esc(row.label) + '</strong><em>' + esc(isEn() ? translateStaticPhrase(row.status) : row.status) + '</em></div>';
    }).join("") + '</div></div></article>';
  }
  function renderParameterRatioPanel() {
    var params = runtime().parameters || {};
    var cfg = config();
    var ids = templateParameters(cfg).map(function (item) { return item.id; });
    var selected = selectedParameterId(cfg);
    if (ids.indexOf(selected) < 0) selected = ids[0] || "DO";
    var selectedParam = params[selected] || runtimeParameter(selected);
    var tabs = ids.map(function (id) {
      var meta = parameterMeta(id);
      return '<button class="miniSwitch ' + (id === selected ? "active" : "") + '" data-ratio-param="' + esc(id) + '">' + esc(meta.shortLabel || meta.label || id) + '</button>';
    }).join("");
    return '<article class="panel parameterAsidePanel"><div class="panelHeader"><h2>參數燈號占比</h2><span class="badge">24h</span></div><div class="panelBody stack"><div class="miniSwitchRow">' + tabs + '</div>' + renderLightRatio(selectedParam ? (function () { var map = {}; map[selected] = selectedParam; return map; })() : {}, (parameterMeta(selected).shortLabel || parameterMeta(selected).label || selected) + " 燈號時間占比") + '<p class="muted">可切換：24h / 7d / 30d；每個參數各自計算燈號占比。</p></div></article>';
  }
  function renderParameterAutoPanel() {
    var devices = runtime().controlDevices || [];
    var cfg = config();
    var selectedId = cfg.selectedControlDeviceId || (devices.find(function (item) { return String(item.status || "").toUpperCase() === "ON"; }) || devices[0] || {}).id;
    var device = devices.find(function (item) { return item.id === selectedId; }) || devices[0];
    if (!device) return emptyPanel("目前自動處理", "尚未匯入設備頻道");
    var speed = Number(device.speed || 0);
    var tabs = devices.map(function (item) {
      return '<button class="miniSwitch ' + (item.id === device.id ? "active" : "") + '" data-control-device="' + esc(item.id) + '">' + esc(item.displayName || item.channelName || item.id) + '</button>';
    }).join("");
    return '<article class="panel parameterAsidePanel"><div class="panelHeader"><h2>目前自動處理</h2><span class="statusPill ' + (String(device.status || "").toUpperCase() === "ON" ? "green" : "") + '">' + dot(String(device.status || "").toUpperCase() === "ON" ? "green" : "none") + esc(device.status || "--") + '</span></div><div class="panelBody stack"><div class="miniSwitchRow deviceSwitchRow">' + tabs + '</div><p>事件：DO 預測下降</p><p>設備：' + esc(device.displayName || device.channelName || device.id) + '</p><p>模式：' + esc(device.mode || "--") + '　目前 ' + esc(speed) + '%</p><div class="progressTrack"><div class="progressBar" style="width:' + speed + '%"></div></div><p class="muted">切換設備後，可檢視各頻道目前作動與回復狀態。</p></div></article>';
  }
  function renderCultureProgress(cfg, data) {
    var batch = hasImport() && data && data.batchTiming ? data.batchTiming : cultureMetrics(cfg);
    var pct = Number(batch.cultureProgressPct || 0);
    var endLabel = batch.plannedCultureDays ? "第 " + batch.plannedCultureDays + " 天" : "收成";
    var midLabel = batch.plannedCultureDays ? "第 " + Math.ceil(Number(batch.plannedCultureDays) / 2) + " 天" : "--";
    return '<div><p>養殖進度：' + esc(batch.cultureDayLabelZh || "未設定") + '</p><div class="progressTrack"><div class="progressBar" style="width:' + pct + '%"></div></div><div class="progressLabels"><span>0</span><span>' + esc(midLabel) + '</span><span>' + esc(endLabel) + '</span></div></div>';
  }
  function renderDecisionCard(d) {
    var item = normalizeDecisionCard(d);
    return '<article class="decisionCard ' + esc(item.light || "yellow") + '"><div class="decisionMeta">' + esc(item.typeLabel || l("決策", "Decision")) + '</div><h3>' + esc(item.title || l("等待資料", "Waiting for data")) + '</h3><p>' + esc(l("原因", "Reason")) + ': ' + esc(item.reason || "--") + '</p><p>' + esc(l("建議", "Recommendation")) + ': ' + esc(item.action || "--") + '</p><p>' + esc(l("效果", "Expected Effect")) + ': ' + esc(item.effect || "--") + '</p><div class="decisionMeta">' + esc(item.impact || "") + '</div></article>';
  }
  function normalizeDecisionCard(d) {
    if (!d) return {};
    if (Array.isArray(d)) {
      var demoEn = {
        "今日決策": "Today",
        "本週決策": "This Week",
        "收成決策": "Harvest",
        "成本決策": "Cost",
        "風險決策": "Risk",
        "設備決策": "Device",
        "晚間減料 30%": "Reduce night feeding by 30%",
        "本週觀察底質": "Monitor bottom condition this week",
        "維持原收成日": "Keep planned harvest date",
        "夜間水車成本上升": "Night paddlewheel cost increase",
        "豪雨前預措": "Prepare before heavy rain",
        "校正 DO 感測器": "Calibrate DO sensor",
        "DO 24h 綠燈占比下降，今晚預測耗氧壓力升高。": "DO green-light ratio declined over 24h; oxygen demand is forecast to increase tonight.",
        "ORP 7d 黃燈時間比例略升。": "ORP yellow-light duration rose slightly over 7 days.",
        "GI 符合 20/30 目標曲線。": "GI matches the 20/30 target curve.",
        "低氧預測提高水車運轉時數。": "Low-oxygen forecast increases paddlewheel runtime.",
        "24h 降雨預測升高。": "24h rainfall forecast is rising.",
        "DO2 與 DO1/DO3 偏差過大。": "DO2 deviates too much from DO1/DO3.",
        "提前開水車，防止 DO 下降；晚間投餵量下修 30%。": "Start paddlewheels early to prevent DO decline; reduce night feeding by 30%.",
        "安排進水/排汙檢查，防止底質惡化。": "Check inlet/drainage to prevent bottom deterioration.",
        "維持原收成日，不提前改策略。": "Keep the planned harvest date and do not change strategy early.",
        "保留夜間水車，不做節能停機。": "Keep night paddlewheels running; do not stop for energy saving.",
        "提前進水/排汙調整水位，減料 30-50%。": "Adjust water level in advance and reduce feeding by 30-50%.",
        "派工校正 DO2，立即重新校正。": "Dispatch calibration for DO2 and recalibrate immediately.",
        "預估 2 小時回到安全區。": "Estimated return to safe range in 2 hours.",
        "降低 H2S 與 NO2/NH3 風險。": "Reduce H2S and NO2/NH3 risk.",
        "預估收穫量 7,182 kg。": "Estimated harvest: 7,182 kg.",
        "維持 DO 安全區。": "Keep DO in the safe range.",
        "降低 pH / 鹽度急變風險。": "Reduce pH and salinity shock risk.",
        "提升 WQI 與預測可信度。": "Improve WQI and forecast reliability.",
        "影響：降低低氧與殘餌風險　信心：中": "Impact: reduced low-oxygen and leftover-feed risk. Confidence: medium",
        "影響：增加少量管理成本　信心：中": "Impact: small increase in management cost. Confidence: medium",
        "信心：中": "Confidence: medium",
        "影響：電費增加，降低死亡損失　信心：中": "Impact: higher electricity cost, lower mortality loss. Confidence: medium",
        "影響：短期投餵降低　信心：中": "Impact: short-term feeding reduction. Confidence: medium",
        "影響：降低誤警報　信心：高": "Impact: fewer false alarms. Confidence: high"
      };
      var pick = function (text) { return isEn() ? (demoEn[text] || translateStaticPhrase(text)) : text; };
      return { typeLabel: pick(d[1]), title: pick(d[2]), reason: pick(d[3]), action: pick(d[4]), effect: pick(d[5]), impact: pick(d[6]), light: d[7] };
    }
    return {
      typeLabel: localDecisionType(d.type),
      title: langField(d, "title") || d.ruleId,
      reason: langField(d, "triggerReason") || langField(d, "message") || langField(d, "rootCause"),
      action: langField(d, "recommendedAction") || d.primaryAction,
      effect: langField(d, "expectedEffect"),
      impact: langField(d, "businessImpact") || confidenceText(d.confidence),
      light: d.light || d.severity || "yellow"
    };
  }
  function langField(obj, base) {
    if (!obj) return "";
    return isEn() ? (obj[base + "En"] || obj[base + "Zh"] || obj[base] || "") : (obj[base + "Zh"] || obj[base] || obj[base + "En"] || "");
  }
  function runtimeLabel(obj, base, fallback) {
    if (!obj) return fallback || "";
    return isEn() ? (obj[base + "En"] || obj[base] || fallback || "") : (obj[base] || obj[base + "Zh"] || fallback || obj[base + "En"] || "");
  }
  function paramLabel(param, meta, fallback) {
    if (param && isEn() && param.nameEn) return param.nameEn;
    if (param && param.name) return param.name;
    if (isEn() && meta && meta.labelEn) return meta.labelEn;
    return (meta && (meta.label || meta.shortLabel)) || fallback || "";
  }
  function statusLabel(item, fallback) {
    return runtimeLabel(item, "label", fallback);
  }
  function siteFieldValue(tpl, fieldId, value) {
    if (value == null || value === "") return l("未設定", "Not set");
    var field = tpl && (tpl.siteFields || []).find(function (item) { return item.id === fieldId; });
    if (field && field.options && field.optionsEn && isEn()) {
      var index = field.options.indexOf(value);
      if (index >= 0) return field.optionsEn[index] || value;
    }
    return value;
  }
  function formatTargetWeightFromSpec(targetSpec) {
    var spec = targetSpecRule(targetSpec);
    if (spec.targetWeightGMin == null) return l("未設定", "Not set");
    return spec.targetWeightGMin + "-" + spec.targetWeightGMax + " g/" + l("尾", "shrimp");
  }
  function industryLabel(industryId) {
    var industry = Settings.TEMPLATE_CATALOG[industryId] || null;
    if (!industry) return l("未設定", "Not set");
    return isEn() && industry.labelEn ? industry.labelEn : industry.label;
  }
  function localizedWeatherSummary(weather) {
    var source = weather || {};
    var summary = isEn() ? (source.summaryEn || {}) : (source.summary || {});
    if (summary.wind || summary.rain || summary.uv || summary.heat) {
      return [summary.wind, summary.rain, summary.uv, summary.heat].filter(Boolean);
    }
    var micro = source.microWeather || {};
    var day1 = (source.forecast72h || []).find(function (item) { return Number(item.horizonDays) === 1; }) || {};
    if (isEn()) {
      return [
        micro.windSpeedMs == null ? "Wind speed not provided" : "Current wind speed " + micro.windSpeedMs + " m/s",
        day1.rainProbabilityPct == null ? "Rain probability not provided" : "Tomorrow rain probability " + day1.rainProbabilityPct + "%",
        day1.uvIndex == null ? "UV not provided" : "Tomorrow UV " + day1.uvIndex,
        micro.heatIndexC == null ? "Heat index not provided" : "Heat index " + micro.heatIndexC + " C"
      ];
    }
    return [
      micro.windSpeedMs == null ? "風速未提供" : "目前風速 " + micro.windSpeedMs + " m/s",
      day1.rainProbabilityPct == null ? "降雨機率未提供" : "明日降雨機率 " + day1.rainProbabilityPct + "%",
      day1.uvIndex == null ? "UV 未提供" : "明日 UV " + day1.uvIndex,
      micro.heatIndexC == null ? "熱指數未提供" : "熱指數 " + micro.heatIndexC + " C"
    ];
  }
  function localDecisionType(type) {
    var zh = { today: "今日決策", week: "本週決策", harvest: "收成決策", cost: "成本決策", risk: "風險決策", device: "設備決策" };
    var en = { today: "Today", week: "This Week", harvest: "Harvest", cost: "Cost", risk: "Risk", device: "Device" };
    return (isEn() ? en : zh)[type] || l("決策", "Decision");
  }
  function confidenceText(confidence) {
    if (!confidence) return "";
    var zh = { low: "信心：低", medium: "信心：中", high: "信心：高" };
    var en = { low: "Confidence: low", medium: "Confidence: medium", high: "Confidence: high" };
    return (isEn() ? en : zh)[confidence] || confidence;
  }
  function renderDeviceRow(device) {
    var on = String(device.status || "").toUpperCase() === "ON";
    return '<div class="deviceRow ' + (on ? "on" : "") + '"><strong>' + esc(device.displayName || device.channelName || device.id) + '</strong><span>' + esc(device.channelId || device.code || "") + '</span><span>' + esc(device.mode || "") + (device.speed != null ? " | " + esc(device.speed) + "%" : "") + '</span><button class="actionButton ' + (on ? "primary" : "") + '" data-toggle-device="' + esc(device.id) + '">' + esc(device.status || "OFF") + '</button></div>';
  }
  function renderLightRatio(parameters, title) {
    var ratio = { blue: 0, green: 0, yellow: 0, orange: 0, red: 0 };
    var count = 0;
    Object.keys(parameters || {}).forEach(function (key) {
      var p = parameters[key];
      if (!p || p.sensorInstalled === false || !p.ratio) return;
      count += 1;
      Object.keys(ratio).forEach(function (color) { ratio[color] += Number(p.ratio[color] || 0); });
    });
    if (count) Object.keys(ratio).forEach(function (color) { ratio[color] = Math.round(ratio[color] / count); });
    var values = [["blue", "藍"], ["green", "綠"], ["yellow", "黃"], ["orange", "橘"], ["red", "紅"]];
    return '<div class="ratioBlock"><h3>' + esc(title || "燈號占比 24h") + '</h3><div class="donutRow"><div class="donut" style="background:' + donutGradient(values.map(function (item) { return ratio[item[0]]; })) + '"></div><div class="legend">' + values.map(function (item) { return '<div class="legendItem">' + dot(item[0]) + item[1] + ' ' + ratio[item[0]] + '%</div>'; }).join("") + '</div></div></div>';
  }
  function renderDeductionRatio() {
    var params = runtime().parameters || {};
    var weightedParams = templateParameters(config()).map(function (meta, index) {
      var p = params[meta.id] || {};
      if (p.sensorInstalled === false) return null;
      var score = Number(p.score);
      var weight = Number(String(meta.weight || "").replace(/[^\d.]/g, ""));
      if (!Number.isFinite(score) || !Number.isFinite(weight) || weight <= 0) return null;
      return { meta: meta, index: index, score: score, weight: weight };
    }).filter(Boolean);
    var weightTotal = weightedParams.reduce(function (sum, item) { return sum + item.weight; }, 0) || 1;
    var items = weightedParams.map(function (item) {
      var meta = item.meta;
      var normalizedWeight = item.weight / weightTotal * 100;
      var deduction = Math.max(0, 100 - item.score) * normalizedWeight;
      if (deduction <= 0) return null;
      return {
        label: meta.shortLabel || meta.label || meta.id,
        value: deduction,
        color: ["var(--red)", "var(--yellow)", "var(--cyan)", "var(--green)", "var(--orange)", "#b9c7d3"][item.index % 6]
      };
    }).filter(Boolean);
    if (!items.length && runtime().rootCause) {
      items = [{ label: runtime().rootCause, value: 1, color: "var(--red)" }];
    }
    var total = items.reduce(function (sum, item) { return sum + item.value; }, 0);
    if (!total) return '<div class="ratioBlock deductionRatio"><h3>扣分來源</h3><div class="emptyState"><h3>尚無扣分來源</h3></div></div>';
    var values = items.map(function (item) { return item.value; });
    var pcts = normalizedPercentages(values);
    return '<div class="ratioBlock deductionRatio"><h3>扣分來源</h3><div class="donutRow"><div class="donut deductionDonut" style="background:' + donutGradient(values, items.map(function (item) { return item.color; })) + '"></div><div class="legend">' + items.map(function (item, index) {
      var pct = pcts[index] || 0;
      return '<div class="legendItem"><span class="dot" style="background:' + esc(item.color) + '"></span>' + esc(item.label) + ' ' + pct + '%</div>';
    }).join("") + '</div></div></div>';
  }
  function normalizedPercentages(values) {
    var total = values.reduce(function (sum, value) { return sum + Number(value || 0); }, 0);
    if (!total) return values.map(function () { return 0; });
    var rows = values.map(function (value, index) {
      var exact = Number(value || 0) / total * 100;
      return { index: index, base: Math.floor(exact), rest: exact - Math.floor(exact) };
    });
    var diff = 100 - rows.reduce(function (sum, row) { return sum + row.base; }, 0);
    rows.slice().sort(function (a, b) { return b.rest - a.rest; }).slice(0, diff).forEach(function (row) { row.base += 1; });
    return rows.sort(function (a, b) { return a.index - b.index; }).map(function (row) { return row.base; });
  }
  function donutGradient(values, customColors) {
    var colors = customColors || ["var(--blue)", "var(--green)", "var(--yellow)", "var(--orange)", "var(--red)"];
    var total = values.reduce(function (sum, value) { return sum + value; }, 0) || 1;
    var at = 0;
    return "conic-gradient(" + values.map(function (value, index) {
      var start = at;
      at += value / total * 360;
      return colors[index] + " " + start + "deg " + at + "deg";
    }).join(", ") + ")";
  }
  function emptyPanel(title, heading) {
    return '<article class="' + cardClass() + '"><div class="' + headClass() + '"><h2>' + esc(title) + '</h2></div><div class="' + bodyClass() + '"><div class="emptyState"><h3>' + esc(heading) + '</h3></div></div></article>';
  }

  function renderParameterPage() {
    var cfg = config();
    var tpl = template(cfg);
    var params = runtime().parameters || {};
    var ids = tpl ? templateParameters(cfg).map(function (p) { return p.id; }) : ["DO", "pH", "orpMv", "salinityPpt", "waterTempC"];
    var charts = ids.map(function (id) {
      var meta = parameterMeta(id);
      var p = params[id] || runtimeParameter(id);
      return renderChartPanel(id, paramLabel(p, meta, id), p);
    }).join("") + renderChartPanel("WQI", "WQI", { score: runtime().wqi });
    if (!isMobile()) {
      return '<div class="desktopParameter"><section class="panel desktopParameterMain"><div class="panelHeader"><div><h2>WQI 整合分數背後的根因參數</h2><p class="muted">批次：' + esc(config().pondId || "--") + '　目標規格：' + esc(config().targetSpec || "--") + '　DAS：' + esc((runtime().batchTiming || {}).daysAfterStocking || "--") + '</p></div><span class="scoreCapsule">WQI ' + esc(hasImport() ? runtime().wqi : "--") + '</span></div><div class="panelBody"><div class="chartGrid">' + charts + '</div></div></section><aside class="desktopAside parameterAside">' + renderParameterAsidePanel() + '</aside></div>';
    }
    var selected = selectedParameterId(cfg);
    var meta = parameterMeta(selected);
    var selectedParam = params[selected] || runtimeParameter(selected);
    var options = ids.map(function (id) {
      var item = parameterMeta(id);
      return '<option value="' + esc(id) + '"' + (id === selected ? " selected" : "") + '>' + esc(isEn() && item.labelEn ? item.labelEn : (item.label || id)) + '</option>';
    }).join("");
    return wrap('<section class="' + cardClass() + '"><div class="' + headClass() + '"><h2>' + esc(l("參數三線", "Parameter Trends")) + '</h2><select class="paramSelector" id="mobileParamSelect">' + options + '</select></div><div class="' + bodyClass() + ' stack"><div class="mobileMetricGrid">' + metricCard(paramLabel(selectedParam, meta, selected), hasImport() ? (selectedParam.score || "--") : "--", hasImport() ? statusLabel(selectedParam, l("已計算", "Calculated")) : l("未計算", "Not calculated"), hasImport() ? (l("即時值", "Current") + ": " + (selectedParam.value || "--")) : l("等待感測資料", "Waiting for sensor data")) + metricCard("WQI", hasImport() ? runtime().wqi : "--", hasImport() ? runtimeLabel(runtime(), "wqiLabel", l("已計算", "Calculated")) : l("未計算", "Not calculated"), hasImport() ? (l("來源", "Source") + ": " + runtimeLabel(runtime(), "rootCause", l("無", "None"))) : l("等待水質資料", "Waiting for water quality data")) + '</div>' + renderChartPanel(selected, paramLabel(selectedParam, meta, selected), selectedParam) + renderRootCausePanel() + '</div></section>');
  }

  function bindNav() {
    var languageSelect = el("languageSelect");
    if (languageSelect) languageSelect.onchange = function () {
      Settings.saveConfig({ language: languageSelect.value });
      mount(lastRoot, lastPage);
    };
    var demoButton = el("toggleDemoMode");
    if (demoButton) demoButton.onclick = function () {
      Settings.saveConfig({ demoMode: !isDemoMode() });
      mount(lastRoot, lastPage);
    };
    document.querySelectorAll("[data-mobile-page]").forEach(function (button) {
      button.onclick = function (event) {
        event.preventDefault();
        if (Settings.syncConfigFromServer) Settings.syncConfigFromServer().then(function () { mount(lastRoot, button.dataset.mobilePage || "overview"); });
        else mount(lastRoot, button.dataset.mobilePage || "overview");
      };
    });
    document.querySelectorAll("[data-desktop-page]").forEach(function (button) {
      button.onclick = function (event) {
        event.preventDefault();
        setDesktopPage(button.dataset.desktopPage || "overview");
      };
    });
    var mobileParamSelect = el("mobileParamSelect");
    if (mobileParamSelect) mobileParamSelect.onchange = function () {
      Settings.saveConfig({ selectedParameterId: mobileParamSelect.value });
      mount(lastRoot, "parameter");
    };
    document.querySelectorAll("[data-mobile-overview]").forEach(function (card) {
      card.onclick = function () {
        Settings.saveConfig({ mobileOverviewMetric: card.dataset.mobileOverview });
        mount(lastRoot, "overview");
      };
    });
    document.querySelectorAll("[data-ratio-param]").forEach(function (button) {
      button.onclick = function () {
        Settings.saveConfig({ selectedParameterId: button.dataset.ratioParam });
        mount(lastRoot, lastPage);
      };
    });
    document.querySelectorAll("[data-control-device]").forEach(function (button) {
      button.onclick = function () {
        Settings.saveConfig({ selectedControlDeviceId: button.dataset.controlDevice });
        mount(lastRoot, lastPage);
      };
    });
  }
  function bindDevices() {
    document.querySelectorAll("[data-toggle-device]").forEach(function (button) {
      button.onclick = function () {
        var device = (runtime().controlDevices || []).find(function (item) { return item.id === button.dataset.toggleDevice; });
        if (!device) return;
        var next = String(device.status).toUpperCase() === "ON" ? "OFF" : "ON";
        if (root.updateRuntimeControlDevice) root.updateRuntimeControlDevice(device.id, { status: next, speed: next === "ON" ? (device.speed || 100) : 0 });
        else { device.status = next; device.speed = next === "ON" ? (device.speed || 100) : 0; }
        mount(lastRoot, lastPage);
      };
    });
    document.querySelectorAll("[data-demo-speed]").forEach(function (button) {
      button.onclick = function () {
        var device = (runtime().controlDevices || []).find(function (item) { return item.id === button.dataset.deviceId; });
        if (!device) return;
        var speed = Number(button.dataset.demoSpeed || 0);
        if (root.updateRuntimeControlDevice) root.updateRuntimeControlDevice(device.id, { status: speed > 0 ? "ON" : "OFF", speed: speed });
        else { device.status = speed > 0 ? "ON" : "OFF"; device.speed = speed; }
        mount(lastRoot, lastPage);
      };
    });
  }
  function drawCharts() {
    document.querySelectorAll("canvas[data-chart]").forEach(function (canvas) { drawTrendCanvas(canvas, canvas.dataset.chart); });
  }
  function drawTrendCanvas(canvas, id) {
    var dpr = root.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(320, rect.width * dpr);
    canvas.height = Math.max(180, rect.height * dpr);
    var ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    var w = canvas.width / dpr;
    var h = canvas.height / dpr;
    ctx.fillStyle = "#071827"; ctx.fillRect(0, 0, w, h);
    var m = { l: 46, r: 18, t: 18, b: 32 };
    var pw = w - m.l - m.r;
    var ph = h - m.t - m.b;
    ctx.strokeStyle = "#1d3d54"; ctx.lineWidth = 1;
    [0, .25, .5, .75, 1].forEach(function (p) { line(ctx, m.l, m.t + ph * p, m.l + pw, m.t + ph * p); });
    ctx.strokeStyle = "#668da3"; line(ctx, m.l, m.t, m.l, m.t + ph); line(ctx, m.l, m.t + ph, m.l + pw, m.t + ph);
    ctx.fillStyle = "#dff8ff"; ctx.font = "13px Microsoft JhengHei, Arial";
    ["100", "75", "50", "25", "0"].forEach(function (label, i) { ctx.fillText(label, 8, m.t + ph * i / 4 + 4); });
    var series = trendSeriesFor(id);
    if (!hasImport() || !series || !Array.isArray(series.actual) || !series.actual.length) { ctx.fillText("尚未匯入有效資料", m.l + 12, m.t + ph / 2); return; }
    var param = (runtime().parameters || {})[id] || {};
    var score = id === "WQI" ? runtime().wqi : param.score;
    var actualColor = (id === "DO" && Number(score) < 60) || param.light === "red" ? "#ff5d73" : "#35e67d";
    var actual = series.actual || [];
    var forecast = connectedForecast(actual, series.forecast || []);
    var nowRatio = actualEndRatio(actual, forecast);
    drawSmoothLine(ctx, series.standard || [], m, pw, ph, "#35caff", [8, 6], 3, 0, 1);
    drawSmoothLine(ctx, actual, m, pw, ph, actualColor, [], 4, 0, nowRatio);
    drawSmoothLine(ctx, forecast, m, pw, ph, "#ffd166", [4, 6], 4, nowRatio, 1);
    drawEndpoint(ctx, actual, m, pw, ph, actualColor, 0, nowRatio);
    drawEndpoint(ctx, forecast, m, pw, ph, "#ffd166", nowRatio, 1);
    drawTimeLabels(ctx, m, pw, h);
  }
  function line(ctx, x1, y1, x2, y2) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
  function connectedForecast(actual, forecast) {
    if (!forecast.length) return [];
    if (!actual.length) return forecast;
    var lastActual = Number(actual[actual.length - 1]);
    var firstForecast = Number(forecast[0]);
    if (Number.isFinite(firstForecast) && Math.abs(firstForecast - lastActual) < 0.001) return forecast;
    return [lastActual].concat(forecast);
  }
  function actualEndRatio(actual, forecast) {
    if (!forecast || !forecast.length) return 1;
    var actualCount = Math.max(2, (actual || []).length);
    var forecastCount = Math.max(2, forecast.length);
    var totalSegments = (actualCount - 1) + (forecastCount - 1);
    return Math.max(.45, Math.min(.82, (actualCount - 1) / totalSegments));
  }
  function pointsFor(values, m, pw, ph, startRatio, endRatio) {
    var start = startRatio == null ? 0 : startRatio;
    var end = endRatio == null ? 1 : endRatio;
    var span = Math.max(0, end - start);
    return values.map(function (value, index) {
      return {
        x: m.l + pw * (start + span * index / Math.max(1, values.length - 1)),
        y: m.t + ph * (1 - Math.max(0, Math.min(100, Number(value))) / 100)
      };
    });
  }
  function drawSmoothLine(ctx, values, m, pw, ph, color, dash, width, startRatio, endRatio) {
    if (!values.length) return;
    var pts = pointsFor(values, m, pw, ph, startRatio, endRatio);
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = width || 3; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.setLineDash(dash || []); ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (var i = 1; i < pts.length - 1; i += 1) {
      var midX = (pts[i].x + pts[i + 1].x) / 2;
      var midY = (pts[i].y + pts[i + 1].y) / 2;
      ctx.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
    }
    if (pts.length > 1) ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
    ctx.stroke(); ctx.restore();
  }
  function drawEndpoint(ctx, values, m, pw, ph, color, startRatio, endRatio) {
    if (!values.length) return;
    var pts = pointsFor(values, m, pw, ph, startRatio, endRatio);
    var p = pts[pts.length - 1];
    ctx.save();
    ctx.fillStyle = color;
    ctx.strokeStyle = "#dff8ff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  function drawTimeLabels(ctx, m, pw, h) {
    ctx.save();
    ctx.fillStyle = "#dff8ff";
    ctx.font = "12px Microsoft JhengHei, Arial";
    [["00:00", 0], ["12:00", .5], ["24:00", 1]].forEach(function (item) {
      ctx.fillText(item[0], m.l + pw * item[1] - (item[1] === 1 ? 30 : 0), h - 10);
    });
    ctx.restore();
  }
  function l(zh, en) {
    return isEn() ? en : zh;
  }
  function translateStaticPhrase(text) {
    if (!isEn() || !text) return text;
    var out = text;
    Object.keys(I18N)
      .sort(function (a, b) { return b.length - a.length; })
      .forEach(function (key) {
        if (!key || out.indexOf(key) < 0) return;
        out = out.split(key).join(I18N[key]);
      });
    out = out
      .replace(/：/g, ": ")
      .replace(/第\s*(\d+)\s*天/g, "Day $1")
      .replace(/剩餘\s*(\d+)\s*天/g, "$1 days remaining")
      .replace(/(\d+)\s*尾\/m2/g, "$1 shrimp/m2")
      .replace(/尾\/磅/g, "count/lb")
      .replace(/尾\/m2/g, "shrimp/m2")
      .replace(/尾/g, "shrimp");
    return out;
  }
  function translateStaticDom(rootEl) {
    if (!isEn() || !rootEl || !document.createTreeWalker) return;
    var skip = { SCRIPT: true, STYLE: true, CANVAS: true, INPUT: true, TEXTAREA: true, OPTION: true };
    var walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var parent = node.parentElement;
        if (!parent || skip[parent.tagName]) return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      node.nodeValue = translateStaticPhrase(node.nodeValue);
    });
    rootEl.querySelectorAll("[placeholder]").forEach(function (el) {
      el.setAttribute("placeholder", translateStaticPhrase(el.getAttribute("placeholder")));
    });
    rootEl.querySelectorAll("option").forEach(function (el) {
      el.textContent = translateStaticPhrase(el.textContent);
    });
  }
  function cleanPageTitle(page) {
    return ({
      settings: l("客戶設定", "Settings"),
      overview: l("總覽", "Overview"),
      parameter: l("參數三線", "Parameter Trends"),
      control: l("AI 回控", "AI Control"),
      decisions: l("決策艙", "Decision Cabin")
    })[page] || l("總覽", "Overview");
  }
  function pageTitle(page) {
    return cleanPageTitle(page);
  }
  function systemTitle(page, tpl) {
    if (page === "settings" || !tpl) return l("專家系統 | 設定", "Expert System | Settings");
    if (isConceptTemplate(tpl)) return l("專家系統 | ", "Expert System | ") + templateLabel(tpl);
    return l("專家系統 | ", "Expert System | ") + templateLabel(tpl) + " - " + cleanPageTitle(page);
  }
  function templateRoutes(tpl) {
    if (tpl && Array.isArray(tpl.routes) && tpl.routes.length) return tpl.routes;
    return [
      { id: "overview", label: "總覽", labelEn: "Overview" },
      { id: "parameter", label: "參數三線", labelEn: "Parameter Trends" },
      { id: "control", label: "AI 回控", labelEn: "AI Control" },
      { id: "decisions", label: "決策艙", labelEn: "Decision Cabin" }
    ];
  }
  function routeLabel(route) {
    return route && route.labelEn && isEn() ? route.labelEn : route && route.label ? route.label : cleanPageTitle(route && route.id);
  }
  function pageAllowedForTemplate(page, tpl) {
    if (page === "settings") return true;
    return templateRoutes(tpl).some(function (route) { return route.id === page; });
  }
  function desktopNav(page, tpl) {
    if (page === "settings" || !tpl) return "";
    var templatePageRoutes = templateRoutes(tpl);
    var routes = [{ id: "settings", label: l("回設定", "Settings"), labelEn: "Settings" }].concat(templatePageRoutes);
    return '<nav class="navBar routeNav">' + routes.map(function (route) {
      return '<button class="navButton ' + (page === route.id ? "active" : "") + '" type="button" data-desktop-page="' + esc(route.id) + '">' + esc(routeLabel(route)) + '</button>';
    }).join("") + '</nav>';
  }
  function mobileTabs(page, tpl) {
    if (page === "settings" || !tpl) return "";
    var tabs = [{ id: "settings", label: l("設定", "Settings"), labelEn: "Settings" }].concat(templateRoutes(tpl));
    return '<nav class="mobileTabs">' + tabs.map(function (tab, index) {
      return '<button class="mobileTab ' + (page === tab.id ? "active" : "") + '" data-mobile-page="' + esc(tab.id) + '"><strong>' + String(index + 1).padStart(2, "0") + '</strong><span>' + esc(routeLabel(tab)) + '</span></button>';
    }).join("") + '</nav>';
  }
  function languageSwitch() {
    return '<label class="languageSwitch"><span>' + l("語言", "Language") + '</span><select id="languageSelect"><option value="zh"' + (!isEn() ? " selected" : "") + '>繁中</option><option value="en"' + (isEn() ? " selected" : "") + '>English</option></select></label>';
  }
  function desktopShell(page, content) {
    var cfg = config();
    var tpl = template(cfg);
    return '<div class="platformShell"><header class="platformTop"><div class="brand">JNC Bio-AIoT</div><div class="pageTitle">' + esc(systemTitle(page, tpl)) + '</div><div class="topMeta">' + languageSwitch() + '<br>' + esc(l("資料模式", "Data mode")) + ': ' + esc(hasImport() ? runtime().mode : l("等待資料", "Waiting")) + '<br>' + esc(l("池別/批次", "Pond / batch")) + ': ' + esc(cfg.pondId || l("未設定", "Not set")) + '<br>' + esc(l("生物", "Species")) + ': ' + esc(tpl ? templateLabel(tpl) : l("未選定", "Not selected")) + '</div></header>' + desktopNav(page, tpl) + content + '</div>';
  }
  function mobileShell(page, content) {
    var tpl = template(config());
    return '<div class="mobileApp"><header class="mobileHeader"><div><h1>' + esc(systemTitle(page, tpl)) + '</h1><p>JNC Bio-AIoT</p></div><div class="mobileHeaderTools">' + languageSwitch() + '<span class="badge">' + esc(hasImport() ? runtime().mode : l("等待資料", "Waiting")) + '</span></div></header><main class="mobileMain">' + content + '</main>' + mobileTabs(page, tpl) + '</div>';
  }
  function localizedOptionHtml(items, selected, emptyLabel) {
    var html = '<option value="">' + esc(emptyLabel || l("未設定", "Not set")) + '</option>';
    items.forEach(function (item) {
      var value = item && item.id != null ? item.id : item;
      var label = item && item.labelEn && isEn() ? item.labelEn : (item && item.label != null ? item.label : item);
      html += '<option value="' + esc(value) + '"' + (String(selected || "") === String(value) ? " selected" : "") + '>' + esc(label) + '</option>';
    });
    return html;
  }
  function localizedFieldOptions(field) {
    if (!isEn() || !field.optionsEn) return field.options || [];
    return (field.options || []).map(function (value, index) {
      return { id: value, label: value, labelEn: field.optionsEn[index] || value };
    });
  }
  function renderSensorRequirementPanel(cfg, tpl) {
    var rows = sensorRequirements(cfg);
    if (!rows.length) return "";
    var params = runtime().parameters || {};
    function weatherParam(id) {
      var weather = runtime().weatherContext || {};
      var micro = weather.microWeather || {};
      var day1 = (weather.forecast72h || []).find(function (item) { return Number(item.horizonDays) === 1; }) || {};
      var map = {
        windSpeedMs: micro.windSpeedMs != null ? micro.windSpeedMs + " m/s" : null,
        airTempC: micro.airTempC != null ? micro.airTempC + " C" : (micro.heatIndexC != null ? "熱指數 " + micro.heatIndexC + " C" : null),
        heatIndexC: micro.heatIndexC != null ? micro.heatIndexC + " C" : null,
        rainMm: micro.rainMm != null ? micro.rainMm + " mm" : (day1.rainMm != null ? day1.rainMm + " mm" : null),
        uvIndex: day1.uvIndex != null ? String(day1.uvIndex) : null,
        humidityPct: micro.humidityPct != null ? micro.humidityPct + "%" : null,
        airPressureHpa: micro.airPressureHpa != null ? micro.airPressureHpa + " hPa" : null
      };
      return map[id] != null ? { value: map[id], isInstalled: true, sensorInstalled: true } : null;
    }
    function runtimeForSensor(sensor) {
      if (params[sensor.parameterId]) return params[sensor.parameterId];
      var weather = weatherParam(sensor.parameterId);
      if (weather) return weather;
      if (sensor.parameterId === "vision") {
        var vision = runtime().underwaterVision || {};
        if (vision.bodyLengthCm != null || vision.bodyWeightG != null) {
          return {
            value: [vision.bodyLengthCm != null ? vision.bodyLengthCm + " cm" : null, vision.bodyWeightG != null ? vision.bodyWeightG + " g" : null].filter(Boolean).join(" / "),
            unit: "",
            isInstalled: true,
            sensorInstalled: true
          };
        }
      }
      return {};
    }
    var cards = rows.map(function (sensor) {
      var runtimeParam = runtimeForSensor(sensor);
      var meta = parameterMeta(sensor.parameterId);
      var hasValue = runtimeParam.value != null && runtimeParam.value !== "";
      var installed = hasValue || !(runtimeParam.sensorInstalled === false || runtimeParam.isInstalled === false || sensor.sensorInstalled === false);
      var required = sensor.requirement === "required";
      var statusText = !installed && required
        ? l("必配未安裝", "Required sensor not installed")
        : !installed
          ? l("未安裝", "Not installed")
          : hasValue
            ? l("已安裝有資料", "Installed with live data")
            : l("已安裝等待資料", "Installed, waiting for data");
      var statusColor = !installed ? "none" : hasValue ? "green" : "red";
      var title = isEn() && sensor.labelEn ? sensor.labelEn : sensor.label || paramLabel(runtimeParam, meta, sensor.parameterId);
      var requirementLabel = required ? l("必配", "Required") : l("選配", "Optional");
      var productName = isEn() && sensor.productNameEn ? sensor.productNameEn : sensor.productName || title;
      var desc = isEn() && sensor.descriptionEn ? sensor.descriptionEn : sensor.description || "";
      var unit = sensor.unit || runtimeParam.unit || meta.unit || "";
      var image = sensor.productImageUrl
        ? '<img src="' + esc(sensor.productImageUrl) + '" alt="' + esc(productName) + '">'
        : '<div class="sensorPhotoPlaceholder"><span>' + esc(l("產品照片待補", "Product photo pending")) + '</span></div>';
      return '<article class="sensorRequirementCard ' + (!installed ? "notInstalled" : "") + ' ' + (required ? "required" : "optional") + '">' +
        '<div class="sensorPhoto">' + image + '</div>' +
        '<div class="sensorInfo"><div class="sensorTitleRow"><h4>' + esc(title) + '</h4><span class="requirementPill ' + (required ? "required" : "optional") + '">' + esc(requirementLabel) + '</span></div>' +
        '<p class="muted">' + esc(sensor.parameterId) + (unit ? ' · ' + esc(unit) : '') + '</p>' +
        '<p>' + esc(l("產品", "Product")) + ': ' + esc(productName) + '</p>' +
        (desc ? '<p class="muted">' + esc(desc) + '</p>' : '') + '</div>' +
        '<div class="sensorRuntime"><span class="statusPill ' + esc(statusColor) + '">' + dot(statusColor) + esc(statusText) + '</span>' +
        '<strong>' + esc(hasValue ? runtimeParam.value : "--") + '</strong>' +
        '<small>' + esc(hasValue ? l("即時資料", "Live Data") : l("等待資料", "Waiting for data")) + '</small></div>' +
      '</article>';
    }).join("");
    return '<section class="sensorRequirementPanel"><div class="sectionTitle"><h3>' + esc(l("感測器設備需求", "Sensor Requirements")) + '</h3></div><div class="sensorRequirementGrid">' + cards + '</div></section>';
  }
  function isConceptTemplate(tpl) {
    return Boolean(tpl && (tpl.conceptUiUrl || tpl.conceptUiUrlDesktop || tpl.conceptUiUrlMobile));
  }
  function renderConceptUiFrame(tpl) {
    var url = tpl ? (isMobile() ? (tpl.conceptUiUrlMobile || tpl.conceptUiUrl) : (tpl.conceptUiUrlDesktop || tpl.conceptUiUrl)) : "";
    var path = String(root.location && root.location.pathname || "");
    if (/\/[^\/]+\.html$/i.test(path) && path.indexOf("/desktop/") < 0 && path.indexOf("/mobile/") < 0) {
      url = url.replace(/^\.\.\//, "");
    }
    return '<iframe class="conceptUiFrame conceptUiStandalone" src="' + esc(url) + '" title="' + esc(templateLabel(tpl)) + '"></iframe>';
  }
  function renderWhiteShrimpTemplatePage(page) {
    return page === "parameter" ? renderParameterPage() : page === "control" ? renderControlPage() : page === "decisions" ? renderDecisionsPage() : renderOverview();
  }
  function renderSelectedTemplatePage(page, tpl) {
    if (isConceptTemplate(tpl)) return renderConceptUiFrame(tpl);
    return renderWhiteShrimpTemplatePage(page);
  }
  function renderSetup() {
    var cfg = config();
    var industries = Object.keys(Settings.TEMPLATE_CATALOG).map(function (id) {
      var item = Settings.TEMPLATE_CATALOG[id];
      return { id: id, label: item.label, labelEn: item.labelEn };
    });
    var selectedIndustry = Settings.TEMPLATE_CATALOG[cfg.industry];
    var species = selectedIndustry ? Object.keys(selectedIndustry.templates).map(function (id) {
      var item = selectedIndustry.templates[id];
      return { id: id, label: item.label, labelEn: item.labelEn, template: item };
    }) : [];
    var tpl = template(cfg);
    var totalTemplates = industries.reduce(function (sum, item) {
      return sum + Object.keys((Settings.TEMPLATE_CATALOG[item.id].templates || {})).length;
    }, 0);
    var industryHtml = industries.map(function (item) {
      var count = Object.keys((Settings.TEMPLATE_CATALOG[item.id].templates || {})).length;
      return '<button type="button" class="setupChoice ' + (cfg.industry === item.id ? "active" : "") + '" data-industry-choice="' + esc(item.id) + '"><strong>' + esc(labelOf(item)) + '</strong><span>' + count + ' ' + esc(l("種生物", "species")) + '</span></button>';
    }).join("");
    var templateHtml = species.length ? species.map(function (item) {
      return '<button type="button" class="templateChoice ' + (cfg.species === item.id ? "active" : "") + '" data-template="' + esc(item.id) + '"><strong>' + esc(labelOf(item)) + '</strong><span>' + esc(item.template.scientificName || item.template.commonName || "") + '</span></button>';
    }).join("") : '<div class="emptyState"><h3>' + esc(l("未選定產業", "No industry selected")) + '</h3></div>';
    var templateFields = tpl ? renderTemplateFields(cfg, tpl) : '<section class="' + cardClass() + '"><div class="' + headClass() + '"><h2>' + esc(l("生物設定", "Species Setup")) + '</h2></div><div class="' + bodyClass() + '"><div class="emptyState"><h3>' + esc(l("未選定生物", "No species selected")) + '</h3></div></div></section>';
    return wrap(renderDemoToggle() + '<section class="' + cardClass() + ' setupDesigner"><div class="' + headClass() + '"><h2>' + esc(l("客戶設定", "Customer Settings")) + '</h2><span class="statusPill ' + (tpl ? "green" : "yellow") + '">' + dot(tpl ? "green" : "yellow") + esc(tpl ? templateLabel(tpl) : l("未選定", "Not selected")) + '</span></div><div class="' + bodyClass() + '"><div class="setupWorkspace">' +
      '<aside class="setupRail"><div class="step active"><b>1</b><span>' + esc(l("選產業", "Industry")) + '</span></div><div class="step ' + (cfg.industry ? "active" : "") + '"><b>2</b><span>' + esc(l("選生物", "Species")) + '</span></div><div class="step ' + (tpl ? "active" : "") + '"><b>3</b><span>' + esc(l("填場域", "Site details")) + '</span></div><div class="setupSummary"><strong>' + esc(l("可選生物", "Available")) + '</strong><span>' + totalTemplates + ' ' + esc(l("種", "items")) + '</span></div></aside>' +
      '<section class="setupStage"><div class="stageTitle"><h3>' + esc(l("產業分類", "Industry")) + '</h3></div><select id="setupIndustry" class="hiddenSelect">' + localizedOptionHtml(industries, cfg.industry, l("未設定", "Not set")) + '</select><div class="choiceGrid">' + industryHtml + '</div></section>' +
      '<section class="setupStage"><div class="stageTitle"><h3>' + esc(l("選生物", "Species")) + '</h3></div><select id="setupSpecies" class="hiddenSelect" ' + (selectedIndustry ? "" : "disabled") + '>' + (selectedIndustry ? localizedOptionHtml(species, cfg.species, l("未設定", "Not set")) : '<option value="">' + esc(l("未設定", "Not set")) + '</option>') + '</select><div class="templateGrid">' + templateHtml + '</div></section>' +
      '</div>' + templateFields + '</div></section>');
  }
  function renderTemplateFields(cfg, tpl) {
    if (isConceptTemplate(tpl)) {
      return '<section class="' + cardClass() + ' nestedClean"><div class="' + headClass() + '"><h2>' + esc(templateLabel(tpl)) + ' ' + esc(l("設備需求設定", "Sensor Requirement Settings")) + '</h2></div><div class="' + bodyClass() + ' stack">' + renderSensorRequirementPanel(cfg, tpl) + '<div class="buttonRow"><button class="actionButton primary" id="saveSiteConfig" data-template-enter="overview" type="button">' + esc(l("儲存設定", "Save Settings")) + '</button></div></div></section>';
    }
    var fields = tpl.siteFields.map(function (field) {
      var current = cfg[field.id] || "";
      var displayValue = current || (field.id === "breed" ? (tpl.defaultBreed || tpl.scientificName || "") : "");
      if (field.type === "select") {
        return '<div class="field"><label>' + esc(isEn() && field.labelEn ? field.labelEn : field.label) + '</label><select id="site_' + esc(field.id) + '">' + localizedOptionHtml(localizedFieldOptions(field), displayValue, l("未設定", "Not set")) + '</select></div>';
      }
      return '<div class="field"><label>' + esc(isEn() && field.labelEn ? field.labelEn : field.label) + '</label><input id="site_' + esc(field.id) + '" type="' + esc(field.type || "text") + '" value="' + esc(displayValue) + '" placeholder="' + esc(l("未設定", "Not set")) + '"></div>';
    }).join("");
    return '<section class="' + cardClass() + ' nestedClean"><div class="' + headClass() + '"><h2>' + esc(templateLabel(tpl)) + ' ' + esc(l("場域設定", "Site Settings")) + '</h2></div><div class="' + bodyClass() + ' stack"><div class="grid2">' + fields + '</div><div id="cultureProgressPreview">' + renderCultureProgress(cfg, runtime()) + renderStockingDensityPreview(cfg) + '</div>' + renderSensorRequirementPanel(cfg, tpl) + renderCustomParameterSettings(cfg) + renderStandardSettings(cfg, tpl) + '<div class="buttonRow"><button class="actionButton primary" id="saveSiteConfig">' + esc(l("儲存設定", "Save Settings")) + '</button><button class="actionButton danger" id="clearPlatform">' + esc(l("清空設定", "Clear Settings")) + '</button></div></div></section>';
  }
  function mount(rootEl, page) {
    if (!rootEl) return;
    lastRoot = rootEl;
    if (!isMobile()) {
      var requestedPage = page || rootEl.dataset.page || "overview";
      page = page && page !== rootEl.dataset.page ? page : desktopPageFromHash(requestedPage);
    }
    lastPage = page || rootEl.dataset.page || (isMobile() ? "settings" : "overview");
    var tpl = template(config());
    if (tpl && !pageAllowedForTemplate(lastPage, tpl)) lastPage = "overview";
    if (!tpl || lastPage === "settings") {
      rootEl.innerHTML = shell("settings", renderSetup());
      translateStaticDom(rootEl);
      bindSetup(); bindNav(); return;
    }
    if (isConceptTemplate(tpl)) {
      rootEl.innerHTML = renderConceptUiFrame(tpl);
      bindNav();
      return;
    }
    var content = renderSelectedTemplatePage(lastPage, tpl);
    rootEl.innerHTML = shell(lastPage, content);
    translateStaticDom(rootEl);
    bindNav(); bindDevices(); drawCharts();
  }

  root.PlatformApp = { mount: mount, drawTrendCanvas: drawTrendCanvas };
  root.addEventListener("hashchange", function () {
    if (lastRoot && !isMobile()) mount(lastRoot, desktopPageFromHash(lastPage));
  });
  root.addEventListener("AIOT_RUNTIME_UPDATED", function () { mount(lastRoot, lastPage); });
  root.addEventListener("AIOT_CLIENT_CONFIG_UPDATED", function () {
    if (suppressNextConfigRemount) {
      suppressNextConfigRemount = false;
      return;
    }
    if (isEditingSetupField()) return;
    mount(lastRoot, lastPage);
  });
  root.addEventListener("message", function (event) {
    if (!event || !event.data || event.data.type !== "AIOT_NAVIGATE") return;
    var target = event.data.page || "settings";
    if (["settings", "overview", "parameter", "control", "decisions"].indexOf(target) >= 0) {
      setDesktopPage(target);
    }
  });
})(window);
