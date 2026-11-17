export function getUser() {
  return window.APP_DATA || {};
}

export function getFrontendRoles(userRoles = []) {
  const roles = Array.isArray(userRoles) ? [...userRoles] : [];

  if (roles.includes("docteur")) {
    roles.push("administrator", "admin");
  }

  return [...new Set(roles)];
}

export function hasRole(role) {
  const roles = getFrontendRoles(window.APP_DATA?.roles);
  return roles.includes(role);
}

export function hasAnyRole(roles = []) {
  const userRoles = getFrontendRoles(window.APP_DATA?.roles);
  return roles.some(r => userRoles.includes(r));
}
