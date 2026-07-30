/**
 * Filters navigation menu by roles and disabled menu keys.
 */
export function getDisabledMenuKeys() {
  return window.APP_DATA?.menuDisabled || [];
}

export function isMenuEnabled(key, disabledKeys = null) {
  if (!key) {
    return true;
  }
  const disabled = disabledKeys || getDisabledMenuKeys();
  return !disabled.includes(key);
}

export function buildMenuItems(menu, userRoles, canUseDropdown, disabledKeys = null) {
  const disabled = disabledKeys || getDisabledMenuKeys();

  return menu
    .filter((item) => isMenuEnabled(item.key, disabled))
    .filter((item) => {
      if (!item.roles || item.roles.length === 0) {
        return true;
      }
      return item.roles.some((role) => userRoles.includes(role));
    })
    .reduce((acc, item) => {
      if (item.isDropdown && item.dropdownItems) {
        const dropdownItems = item.dropdownItems.filter(
          (dropdownItem) =>
            isMenuEnabled(dropdownItem.key, disabled) &&
            (!dropdownItem.roles || dropdownItem.roles.some((role) => userRoles.includes(role))),
        );

        if (!dropdownItems.length) {
          return acc;
        }

        if (!canUseDropdown) {
          dropdownItems.forEach((dropdownItem, index) => {
            acc.push({
              ...dropdownItem,
              id: `${item.id}-${index}`,
              isDropdown: false,
            });
          });
          return acc;
        }

        acc.push({
          ...item,
          dropdownItems,
        });
        return acc;
      }

      acc.push(item);
      return acc;
    }, []);
}

export function applyMenuSettings(disabledKeys = []) {
  if (!window.APP_DATA) {
    window.APP_DATA = {};
  }
  window.APP_DATA.menuDisabled = disabledKeys;
}
