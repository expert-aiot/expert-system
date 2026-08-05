(function (root) {
  "use strict";
  root.AIOT_DEMO_FIXTURE = {
    contractVersion: "1.0.0",
    fixtureId: "white-shrimp-low-oxygen-v1",
    dataMode: "demo",
    syntheticData: true,
    generatedAt: "2026-07-10T10:00:00+08:00",
    sourceStatementZh: "虛擬展示資料；欄位、單位、狀態與正式資料契約一致。",
    identity: { siteId: "TJIANG", unitId: "C22", pondId: "C22", batchId: "C22-2026A" },
    batch: {
      speciesId: "litopenaeus_vannamei", targetSpec: "20/30",
      stockingDate: "2026-05-14", plannedHarvestDate: "2026-08-12",
      pondAreaM2: 2400, waterVolumeM3: 2880, daysAfterStocking: 57
    },
    indices: {
      WQI: { score: 72, light: "green", rootCauseParameterId: "DO", dataCoveragePct: 92 },
      GI: { score: 84, light: "green", currentBodyLengthCm: 10.3, estimatedBodyWeightG: 12.7,
        modelMetadata: { modelId: "gi-demo-v1", modelType: "estimate", provider: "demo_fixture", inputWindow: "DAS_to_date", sampleCount: 126, dataCoveragePct: 88, confidence: "medium", calibrationStatus: "demo_not_calibrated", lastCalibratedAt: null, fallbackUsed: false } }
    },
    scenario: {
      parameterId: "DO", unit: "mg/L", currentValue: 4.1, currentLight: "yellow",
      currentSubScore: 62, timeToWarningMinutes: 180, timeToCriticalMinutes: null,
      timeToSafeBandMinutes: 120, timeToIdealBandMinutes: 240,
      forecast: {
        status: "fallback_used", confidence: "low",
        modelMetadata: { modelId: "do-fallback-demo-v1", modelType: "forecast", provider: "system_fallback", inputWindow: "24h", sampleCount: 24, dataCoveragePct: 92, confidence: "low", calibrationStatus: "demo_not_calibrated", lastCalibratedAt: null, fallbackUsed: true },
        series: [
          { offsetHours: 0, value: 4.1, light: "yellow" },
          { offsetHours: 1, value: 3.8, light: "yellow" },
          { offsetHours: 2, value: 3.6, light: "yellow" },
          { offsetHours: 3, value: 4.0, light: "yellow" },
          { offsetHours: 4, value: 4.6, light: "yellow" },
          { offsetHours: 6, value: 5.2, light: "green" }
        ]
      },
      alert: { alertId: "ALT-C22-DO-001", severity: "warning", status: "open", messageZh: "C22 溶氧偏低，清晨低氧風險升高。" },
      controlAction: { actionId: "ACT-C22-AIR-001", deviceType: "aerator", command: "increase_output", authority: "requires_confirmation", status: "awaiting_confirmation", safetyInterlockPassed: true }
    },
    ui: { standards: {
      DO: { light: ["yellow", "注意"], rows: [["理想區","自動","--","標準"],["警戒區","自動","4.0-5.0","自訂"],["危險線","自動","--","標準"],["權重","自動","--","標準"]], ratio: { green: 60, yellow: 35, red: 5 }, coveragePct:92, card:{title:"夜間餵料調整",badge:"低氧警報",reason:"DO 低於警戒，清晨低氧風險升高。",action:"提前開水車，防止 DO 下降；晚間投餵量下修 30%。",effect:"預估 2 小時回到安全區。",impact:"降低低氧與殘餌風險。信心：低（fallback）"}},
      pH: { light:["green","最佳"], rows:[["理想區","自動","--","標準"],["可接受","自動","--","標準"],["危險線","自動","--","標準"],["權重","自動","--","標準"]], ratio: { green: 90, yellow: 10, red: 0 },coveragePct:96,card:{title:"維持 pH 管理",badge:"",reason:"pH 24h 大多位於理想區。",action:"維持目前設定，依例行頻率巡檢 pH 變化。",effect:"水體緩衝狀態穩定。",impact:"不增加額外成本。信心：高"}},
      orpMv: { light:["green","最佳"], rows:[["理想下限","自動","--","標準"],["後期理想","自動","--","標準"],["危險線","自動","--","標準"],["權重","自動","--","標準"]],ratio: { green: 78, yellow: 22, red: 0 },coveragePct:94,card:{title:"本週觀察底質",badge:"",reason:"ORP 7d 注意占比略升。",action:"安排進水/排汙檢查，防止底質惡化。",effect:"降低底質惡化風險。",impact:"增加少量管理成本。信心：中"}},
      salinityPpt: { light:["green","最佳"],rows:[["理想區","自動","--","標準"],["偏好區","自動","--","標準"],["日變動","自動","--","標準"],["權重","自動","--","標準"]],ratio: { green: 86, yellow: 14, red: 0 },coveragePct:95,card:{title:"雨前監控鹽度",badge:"",reason:"24h 有降雨預測。",action:"維持水位並加密鹽度監測，防止鹽度急變。",effect:"降低鹽度急變風險。",impact:"暫無額外成本。信心：中"}},
      waterTempC: { light:["yellow","注意"],rows:[["理想區","自動","--","標準"],["警戒區","自動","--","標準"],["危險線","自動","--","標準"],["權重","自動","--","標準"]],ratio: { green: 70, yellow: 30, red: 0 },coveragePct:93,card:{title:"午後水溫注意",badge:"",reason:"水溫預測接近標準上緣。",action:"午後加開水車並觀察水位，防止耗氧升高。",effect:"降低耗氧壓力。",impact:"少量增加電力成本。信心：中"}}
    }}
  };
}(typeof window !== "undefined" ? window : globalThis));
