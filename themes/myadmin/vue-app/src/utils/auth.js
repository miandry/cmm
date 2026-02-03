export function getUser() {
  return window.APP_DATA || {};
}

export function hasRole(role) {
  const roles = window.APP_DATA?.roles || [];
  return roles.includes(role);
}

export function hasAnyRole(roles = []) {
  const userRoles = window.APP_DATA?.roles || [];
  return roles.some(r => userRoles.includes(r));
}
