/**
 * Filters dashboard widgets by disabled widget keys.
 */
export function getDisabledDashboardKeys() {
  return window.APP_DATA?.dashboardDisabled || [];
}

export function isDashboardEnabled(key, disabledKeys = null) {
  if (!key) {
    return true;
  }
  const disabled = disabledKeys || getDisabledDashboardKeys();
  return !disabled.includes(key);
}

export function applyDashboardSettings(disabledKeys = []) {
  if (!window.APP_DATA) {
    window.APP_DATA = {};
  }
  window.APP_DATA.dashboardDisabled = disabledKeys;
}
