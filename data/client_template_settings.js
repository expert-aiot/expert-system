(function (root) {
  "use strict";

  var CONFIG_KEY = "AIOT_CLIENT_CONFIG_V1";
  var CHANNEL_NAME = "AIOT_CLIENT_CONFIG_CHANNEL";
  var API_PATH = "/api/client-config";
  var syncChannel = null;
  var pendingServerWrite = false;

  try {
    syncChannel = "BroadcastChannel" in root ? new BroadcastChannel(CHANNEL_NAME) : null;
  } catch (error) {
    syncChannel = null;
  }

  var TEMPLATE_CATALOG = {
    fisheries: {
      label: "漁業",
      labelEn: "Aquaculture",
      templates: {
        whiteShrimp: {
          label: "白蝦",
          labelEn: "White Shrimp",
          commonName: "白蝦",
          commonNameEn: "White shrimp",
          scientificName: "Litopenaeus vannamei",
          defaultBreed: "Litopenaeus vannamei",
          siteFields: [
            { id: "breed", label: "品種", labelEn: "Breed", type: "text", placeholder: "Litopenaeus vannamei" },
            { id: "cultureMode", label: "養殖模式", labelEn: "Culture mode", type: "select", options: ["池塘養殖"], optionsEn: ["Pond culture"] },
            { id: "targetSpec", label: "目標規格（每磅尾數）", labelEn: "Target size (count/lb)", type: "select", options: ["10/20", "20/30", "30/40", "40/50"] },
            { id: "stockingDate", label: "放苗日", labelEn: "Stocking date", type: "date" },
            { id: "plannedHarvestDate", label: "預估收成日", labelEn: "Planned harvest date", type: "date" },
            { id: "pondId", label: "池別 / 批次", labelEn: "Pond / batch", type: "text", placeholder: "C22" },
            { id: "stockingCount", label: "放養尾數", labelEn: "Stocking count", type: "number" },
            { id: "pondAreaM2", label: "池面積 m2", labelEn: "Pond area m2", type: "number" },
            { id: "waterVolumeM3", label: "水量 m3", labelEn: "Water volume m3", type: "number" }
          ],
          parameters: [
            { id: "DO", label: "DO 溶氧", labelEn: "DO", shortLabel: "DO", unit: "mg/L", ideal: "5.0 mg/L 以上", warning: "4.0-5.0 mg/L", danger: "低於 4.0 mg/L", weight: "55%" },
            { id: "pH", label: "pH 酸鹼值", labelEn: "pH", shortLabel: "pH", unit: "", ideal: "7.5-8.5", warning: "7.0-7.5 / 8.5-9.0", danger: "低於 7.0 或高於 9.0", weight: "15%" },
            { id: "orpMv", label: "ORP 氧化還原電位", labelEn: "ORP", shortLabel: "ORP", unit: "mV", ideal: "300-450 mV", warning: "250-300 mV", danger: "低於 250 mV", weight: "15%" },
            { id: "salinityPpt", label: "SC 鹽度", labelEn: "SC / Salinity", shortLabel: "SC", unit: "ppt", ideal: "15-25 ppt", warning: "10-15 / 25-30 ppt", danger: "低於 10 或高於 30 ppt", weight: "15%" },
            { id: "waterTempC", label: "水溫", labelEn: "Water Temp", shortLabel: "Temp", unit: "C", ideal: "26-30 C", warning: "24-26 / 30-32 C", danger: "低於 24 或高於 32 C", weight: "20%" }
          ],
          sensorRequirements: [
            { id: "sensor-do", parameterId: "DO", requirement: "required", label: "DO 溶氧感測器", labelEn: "DO Sensor", unit: "mg/L", productImageUrl: "../assets/sensors/水質感測器.png", productName: "JNC DO 感測器", productNameEn: "JNC DO Sensor", description: "白蝦低氧風險與水車控制核心資料。", descriptionEn: "Core input for low-oxygen risk and paddlewheel control." },
            { id: "sensor-ph", parameterId: "pH", requirement: "required", label: "pH 酸鹼值感測器", labelEn: "pH Sensor", unit: "", productImageUrl: "../assets/sensors/水質感測器.png", productName: "JNC pH 感測器", productNameEn: "JNC pH Sensor", description: "追蹤酸鹼波動、雨後跌酸與藻相變化。", descriptionEn: "Tracks pH fluctuation, post-rain drops, and algae-related changes." },
            { id: "sensor-orp", parameterId: "orpMv", requirement: "required", label: "ORP 氧化還原電位感測器", labelEn: "ORP Sensor", unit: "mV", productImageUrl: "../assets/sensors/水質感測器.png", productName: "JNC ORP 感測器", productNameEn: "JNC ORP Sensor", description: "輔助判斷底質惡化與還原性風險。", descriptionEn: "Supports bottom-condition and reductive-risk assessment." },
            { id: "sensor-salinity", parameterId: "salinityPpt", requirement: "required", label: "SC / 鹽度感測器", labelEn: "SC / Salinity Sensor", unit: "ppt", productImageUrl: "../assets/sensors/水質感測器.png", productName: "JNC 鹽度感測器", productNameEn: "JNC Salinity Sensor", description: "監控鹽度變化與滲透壓壓力。", descriptionEn: "Monitors salinity change and osmotic stress." },
            { id: "sensor-water-temp", parameterId: "waterTempC", requirement: "required", label: "水溫感測器", labelEn: "Water Temperature Sensor", unit: "C", productImageUrl: "../assets/sensors/水質感測器.png", productName: "JNC 水溫感測器", productNameEn: "JNC Water Temperature Sensor", description: "納入耗氧、攝食與成長風險判斷。", descriptionEn: "Feeds oxygen-demand, feeding, and growth-risk assessment." },
            { id: "sensor-nh4", parameterId: "NH4", requirement: "optional", sensorInstalled: false, label: "NH4/NH3：氨氮計", labelEn: "NH4/NH3: Ammonia Nitrogen Meter", unit: "mg/L", productImageUrl: "../assets/sensors/水質感測器.png", productName: "JNC 氨氮計", productNameEn: "JNC Ammonia Nitrogen Meter", description: "選配，強化氨毒性與水質惡化判斷。", descriptionEn: "Optional input for ammonia toxicity and water-quality deterioration." },
            { id: "sensor-no2", parameterId: "NO2", requirement: "optional", sensorInstalled: false, label: "NO2：亞硝酸鹽感測器", labelEn: "NO2: Nitrite Sensor", unit: "mg/L", productImageUrl: "../assets/sensors/水質感測器.png", productName: "JNC 亞硝酸鹽感測器", productNameEn: "JNC Nitrite Sensor", description: "選配，強化亞硝酸鹽風險判斷。", descriptionEn: "Optional input for nitrite-risk assessment." },
            { id: "sensor-turbidity", parameterId: "turbidityNtu", requirement: "optional", sensorInstalled: false, label: "濁度感測器", labelEn: "Turbidity Sensor", unit: "NTU", productImageUrl: "../assets/sensors/濁度計.png", productName: "JNC 濁度感測器", productNameEn: "JNC Turbidity Sensor", description: "選配，輔助判斷水體懸浮物與透明度變化。", descriptionEn: "Optional input for suspended solids and clarity changes." },
            { id: "sensor-air-temp", parameterId: "airTempC", requirement: "optional", sensorInstalled: false, label: "環境溫度感測器", labelEn: "Air Temperature Sensor", unit: "C", productImageUrl: "../assets/sensors/戶外氣體感測器OA4.png", productName: "JNC 環境溫度感測器", productNameEn: "JNC Air Temperature Sensor", description: "選配，納入高溫耗氧、午後低氧與熱壓力判斷。", descriptionEn: "Optional input for heat stress and afternoon oxygen-demand assessment." },
            { id: "sensor-humidity", parameterId: "humidityPct", requirement: "optional", sensorInstalled: false, label: "環境濕度感測器", labelEn: "Humidity Sensor", unit: "%", productImageUrl: "../assets/sensors/戶外氣體感測器OA4.png", productName: "JNC 環境濕度感測器", productNameEn: "JNC Humidity Sensor", description: "選配，輔助判斷蒸散、悶熱與水面交換條件。", descriptionEn: "Optional input for humidity, heat index, and surface-exchange assessment." },
            { id: "sensor-wind", parameterId: "windSpeedMs", requirement: "optional", sensorInstalled: false, label: "風速風向計", labelEn: "Wind Speed / Direction Sensor", unit: "m/s", productImageUrl: "../assets/sensors/風速風向計.png", productName: "JNC 風速風向計", productNameEn: "JNC Wind Sensor", description: "選配，納入水面交換能力、低風速低氧風險與氣象預測。", descriptionEn: "Optional input for surface exchange, low-wind DO risk, and weather forecasting." },
            { id: "sensor-rain", parameterId: "rainMm", requirement: "optional", sensorInstalled: false, label: "雨量計", labelEn: "Rain Gauge", unit: "mm", productImageUrl: "../assets/sensors/雨量紀錄計.png", productName: "JNC 雨量計", productNameEn: "JNC Rain Gauge", description: "選配，納入雨後 pH、鹽度波動與排水管理判斷。", descriptionEn: "Optional input for post-rain pH/salinity fluctuation and drainage decisions." },
            { id: "sensor-uv", parameterId: "uvIndex", requirement: "optional", sensorInstalled: false, label: "UV / 光照感測器", labelEn: "UV / Light Sensor", unit: "UV", productImageUrl: "../assets/sensors/紫外線感測器UV.png", productName: "JNC UV / 光照感測器", productNameEn: "JNC UV / Light Sensor", description: "選配，輔助判斷午後藻相、耗氧與高溫壓力。", descriptionEn: "Optional input for afternoon algae activity, oxygen demand, and heat pressure." },
            { id: "sensor-pressure", parameterId: "airPressureHpa", requirement: "optional", sensorInstalled: false, label: "大氣壓感測器", labelEn: "Barometric Pressure Sensor", unit: "hPa", productImageUrl: "../assets/sensors/戶外氣體感測器OA4.png", productName: "JNC 大氣壓感測器", productNameEn: "JNC Barometric Pressure Sensor", description: "選配，輔助判斷天氣變化與低壓系統風險。", descriptionEn: "Optional input for weather changes and low-pressure-system risk." },
            { id: "sensor-camera", parameterId: "vision", requirement: "required", sensorInstalled: false, label: "水下攝影機", labelEn: "Underwater Camera", unit: "", productImageUrl: "../assets/sensors/水下攝影機IWC.png", productName: "JNC 水下攝影機", productNameEn: "JNC Underwater Camera", description: "必配，提供蝦體影像、活動狀態與 AI 體長/成長估算資料。", descriptionEn: "Required input for shrimp imagery, activity status, and AI growth estimation." }
          ],
          standardProfiles: {
            DO: [
              { label: "白天時段", start: "06:00", end: "18:00", idealMin: 5.0, idealMax: 7.0, warningMin: 4.0, warningMax: 5.0, dangerMin: 0, dangerMax: 4.0 },
              { label: "夜間時段", start: "18:00", end: "06:00", idealMin: 5.5, idealMax: 7.0, warningMin: 4.5, warningMax: 5.5, dangerMin: 0, dangerMax: 4.5 }
            ],
            pH: [
              { label: "全日時段", start: "00:00", end: "23:59", idealMin: 7.5, idealMax: 8.5, warningMin: 7.0, warningMax: 9.0, dangerMin: 0, dangerMax: 7.0 }
            ],
            orpMv: [
              { label: "全日時段", start: "00:00", end: "23:59", idealMin: 300, idealMax: 450, warningMin: 250, warningMax: 300, dangerMin: 0, dangerMax: 250 }
            ],
            salinityPpt: [
              { label: "全日時段", start: "00:00", end: "23:59", idealMin: 15, idealMax: 25, warningMin: 10, warningMax: 30, dangerMin: 0, dangerMax: 10 }
            ],
            waterTempC: [
              { label: "白天時段", start: "06:00", end: "18:00", idealMin: 26, idealMax: 30, warningMin: 24, warningMax: 32, dangerMin: 0, dangerMax: 24 },
              { label: "夜間時段", start: "18:00", end: "06:00", idealMin: 25, idealMax: 29, warningMin: 23, warningMax: 31, dangerMin: 0, dangerMax: 23 }
            ]
          }
        }
      }
    },
    agriculture: {
      label: "農業",
      labelEn: "Agriculture",
      templates: {
        hydroponicVegetables: {
          label: "水耕蔬菜",
          labelEn: "Hydroponic Vegetables",
          commonName: "水耕蔬菜",
          commonNameEn: "Hydroponic vegetables",
          scientificName: "Lactuca sativa / Brassica oleracea",
          conceptUiUrl: "../lettuce/desktop/index.html",
          conceptUiUrlDesktop: "../lettuce/desktop/index.html",
          conceptUiUrlMobile: "../lettuce/mobile/index.html",
          routes: [
            { id: "overview", label: "總覽", labelEn: "Overview" }
          ],
          siteFields: [],
          parameters: [],
          sensorRequirements: [
            { id: "hydro-ec", parameterId: "EC", requirement: "required", label: "EC 營養液感測器", labelEn: "EC Sensor", unit: "mS/cm", productImageUrl: "../assets/sensors/水質感測器.png", productName: "JNC EC 感測器", productNameEn: "JNC EC Sensor", description: "監控營養液濃度與肥培穩定度。", descriptionEn: "Monitors nutrient strength and fertigation stability." },
            { id: "hydro-ph", parameterId: "pH", requirement: "required", label: "pH 酸鹼值感測器", labelEn: "pH Sensor", unit: "", productImageUrl: "../assets/sensors/水質感測器.png", productName: "JNC pH 感測器", productNameEn: "JNC pH Sensor", description: "監控營養液酸鹼與吸收風險。", descriptionEn: "Monitors nutrient-solution acidity and uptake risk." },
            { id: "hydro-water-temp", parameterId: "waterTempC", requirement: "required", label: "水溫感測器", labelEn: "Water Temperature Sensor", unit: "C", productImageUrl: "../assets/sensors/水質感測器.png", productName: "JNC 水溫感測器", productNameEn: "JNC Water Temperature Sensor", description: "納入根區吸收、溶氧與病害風險判斷。", descriptionEn: "Supports root uptake, DO, and disease-risk assessment." },
            { id: "hydro-do", parameterId: "DO", requirement: "required", label: "DO 溶氧感測器", labelEn: "DO Sensor", unit: "mg/L", productImageUrl: "../assets/sensors/水質感測器.png", productName: "JNC DO 感測器", productNameEn: "JNC DO Sensor", description: "監控根區溶氧與缺氧風險。", descriptionEn: "Monitors root-zone DO and hypoxia risk." },
            { id: "hydro-air-temp", parameterId: "airTempC", requirement: "required", label: "環境溫度感測器", labelEn: "Air Temperature Sensor", unit: "C", productImageUrl: "../assets/sensors/戶外氣體感測器OA4.png", productName: "JNC 環境溫度感測器", productNameEn: "JNC Air Temperature Sensor", description: "監控溫度壓力與抽苔/葉燒風險。", descriptionEn: "Monitors temperature stress, bolting, and tipburn risk." },
            { id: "hydro-humidity", parameterId: "humidityPct", requirement: "required", label: "環境濕度感測器", labelEn: "Humidity Sensor", unit: "%", productImageUrl: "../assets/sensors/戶外氣體感測器OA4.png", productName: "JNC 濕度感測器", productNameEn: "JNC Humidity Sensor", description: "支援 VPD 與蒸散壓力判斷。", descriptionEn: "Supports VPD and transpiration-stress assessment." },
            { id: "hydro-dli", parameterId: "DLI", requirement: "required", label: "光照 / DLI 感測器", labelEn: "Light / DLI Sensor", unit: "mol/m2/d", productImageUrl: "../assets/sensors/光照度感測器.png", productName: "JNC 光照感測器", productNameEn: "JNC Light Sensor", description: "監控光積量、補光與生長品質。", descriptionEn: "Monitors light integral, supplemental lighting, and growth quality." },
            { id: "hydro-co2", parameterId: "CO2", requirement: "optional", sensorInstalled: false, label: "CO2 感測器", labelEn: "CO2 Sensor", unit: "ppm", productImageUrl: "../assets/sensors/戶外氣體感測器OA4.png", productName: "JNC CO2 感測器", productNameEn: "JNC CO2 Sensor", description: "選配，輔助判斷光合效率。", descriptionEn: "Optional input for photosynthesis-efficiency assessment." },
            { id: "hydro-vpd", parameterId: "VPD", requirement: "optional", sensorInstalled: false, label: "VPD 感測器/計算參數", labelEn: "VPD Sensor / Derived Parameter", unit: "kPa", productImageUrl: "../assets/sensors/戶外氣體感測器OA4.png", productName: "JNC VPD 模組", productNameEn: "JNC VPD Module", description: "選配，整合溫濕度推估蒸散壓力。", descriptionEn: "Optional module deriving transpiration pressure from temperature and humidity." },
            { id: "hydro-camera", parameterId: "vision", requirement: "required", sensorInstalled: false, label: "影像鏡頭", labelEn: "Vision Camera", unit: "", productImageUrl: "../assets/sensors/雲端環境影像攝影機.png", productName: "JNC 影像模組", productNameEn: "JNC Vision Module", description: "必配，支援葉燒、黃化、根區與生長影像判讀。", descriptionEn: "Required input for tipburn, yellowing, root-zone, and growth-image assessment." },
            { id: "hydro-level", parameterId: "waterLevel", requirement: "optional", sensorInstalled: false, label: "液位 / 水位感測器", labelEn: "Liquid Level Sensor", unit: "cm", productImageUrl: "", productName: "JNC 液位感測器", productNameEn: "JNC Liquid Level Sensor", description: "選配，監控水位與循環異常。", descriptionEn: "Optional input for water level and circulation anomalies." }
          ]
        }
      }
    }
  };

  var SITE_FIELD_IDS = ["industry", "species", "breed", "cultureMode", "targetSpec", "stockingDate", "plannedHarvestDate", "pondId", "stockingCount", "pondAreaM2", "waterVolumeM3", "stockingDensityPerM2", "targetSpecUnit", "targetCountPerLbMin", "targetCountPerLbMax", "targetWeightGMin", "targetWeightGMax", "targetWeightGMid"];
  var PARAM_FIELD_IDS = ["paramId", "sensorInstalled", "standardSource", "idealRange", "warningRange", "dangerRange", "weight", "idealApply", "warningApply", "dangerApply", "weightApply", "ratioWindow", "yellowPct", "redPct"];
  var DECISION_FIELD_IDS = ["decisionTrigger", "decisionAction", "executionMode", "approvalRole", "deviceChannels"];

  function loadConfig() {
    try {
      return JSON.parse(root.localStorage.getItem(CONFIG_KEY) || "{}") || {};
    } catch (error) {
      return {};
    }
  }

  function emitConfigUpdated(next, source) {
    var state = next || loadConfig();
    root.dispatchEvent(new CustomEvent("AIOT_CLIENT_CONFIG_UPDATED", { detail: state }));
    if (syncChannel && source !== "channel") {
      syncChannel.postMessage({ type: "client-config", config: state });
    }
  }

  function pushConfigToServer(next) {
    if (!root.fetch) return Promise.resolve(next || {});
    try {
      return root.fetch(API_PATH, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ config: next || {} })
      }).then(function (response) { return response.ok ? response.json() : { ok: false }; }).catch(function () { return { ok: false }; });
    } catch (error) {
      return Promise.resolve({ ok: false });
    }
  }

  function syncConfigFromServer() {
    if (!root.fetch) return Promise.resolve(loadConfig());
    if (pendingServerWrite) return Promise.resolve(loadConfig());
    return root.fetch(API_PATH, { cache: "no-store" })
      .then(function (response) { return response.ok ? response.json() : { config: loadConfig() }; })
      .then(function (payload) {
        var next = payload && payload.config && typeof payload.config === "object" ? payload.config : {};
        var current = loadConfig();
        if (JSON.stringify(current || {}) !== JSON.stringify(next || {})) {
          root.localStorage.setItem(CONFIG_KEY, JSON.stringify(next));
          emitConfigUpdated(next, "server");
        }
        return next;
      })
      .catch(function () { return loadConfig(); });
  }

  function saveConfig(partial) {
    var next = Object.assign({}, loadConfig(), partial || {}, { updatedAt: new Date().toISOString() });
    root.localStorage.setItem(CONFIG_KEY, JSON.stringify(next));
    emitConfigUpdated(next, "local");
    pendingServerWrite = true;
    pushConfigToServer(next).then(function () {
      pendingServerWrite = false;
    });
    return next;
  }

  function currentTemplate(cfg) {
    var state = cfg || loadConfig();
    return (((TEMPLATE_CATALOG[state.industry] || {}).templates || {})[state.species]) || null;
  }

  function isTemplateSelected(cfg) {
    return Boolean(currentTemplate(cfg || loadConfig()));
  }

  function clearPlatformState() {
    [root.localStorage, root.sessionStorage].forEach(function (store) {
      if (!store) return;
      Object.keys(store).forEach(function (key) {
        if (/^(AIOT_|JNC_|WHITE_SHRIMP_|runtime|mockup)/i.test(key)) store.removeItem(key);
      });
    });
    root.localStorage.setItem(CONFIG_KEY, "{}");
    emitConfigUpdated({}, "local");
    pendingServerWrite = true;
    pushConfigToServer({}).then(function () { pendingServerWrite = false; });
  }

  if (syncChannel) {
    syncChannel.onmessage = function (event) {
      var next = event.data && event.data.type === "client-config" ? event.data.config : null;
      if (!next || typeof next !== "object") return;
      root.localStorage.setItem(CONFIG_KEY, JSON.stringify(next));
      emitConfigUpdated(next, "channel");
    };
  }

  root.addEventListener("storage", function (event) {
    if (event.key !== CONFIG_KEY) return;
    emitConfigUpdated(loadConfig(), "storage");
  });

  setTimeout(syncConfigFromServer, 0);
  root.addEventListener("focus", syncConfigFromServer);
  root.document && root.document.addEventListener("visibilitychange", function () {
    if (!root.document.hidden) syncConfigFromServer();
  });

  function daysBetweenInclusive(start, end) {
    var a = start ? new Date(start + "T00:00:00") : null;
    var b = end ? new Date(end + "T00:00:00") : null;
    if (!a || !b || Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return null;
    return Math.floor((b.getTime() - a.getTime()) / 86400000) + 1;
  }

  function optionHtml(items, selected, emptyLabel) {
    var html = '<option value="">' + (emptyLabel || "未設定") + "</option>";
    items.forEach(function (item) {
      var value = item && item.id != null ? item.id : item;
      var label = item && item.label != null ? item.label : item;
      html += '<option value="' + String(value).replace(/"/g, "&quot;") + '"' + (String(selected || "") === String(value) ? " selected" : "") + ">" + label + "</option>";
    });
    return html;
  }

  root.AIOT_CLIENT_SETTINGS = {
    CONFIG_KEY: CONFIG_KEY,
    TEMPLATE_CATALOG: TEMPLATE_CATALOG,
    SITE_FIELD_IDS: SITE_FIELD_IDS,
    PARAM_FIELD_IDS: PARAM_FIELD_IDS,
    DECISION_FIELD_IDS: DECISION_FIELD_IDS,
    loadConfig: loadConfig,
    saveConfig: saveConfig,
    syncConfigFromServer: syncConfigFromServer,
    pushConfigToServer: pushConfigToServer,
    currentTemplate: currentTemplate,
    isTemplateSelected: isTemplateSelected,
    clearPlatformState: clearPlatformState,
    daysBetweenInclusive: daysBetweenInclusive,
    optionHtml: optionHtml
  };
})(window);
