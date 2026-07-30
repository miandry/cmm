export function getArticleType(line) {
  const article = line?.field_article;
  if (!article) return 'article';
  return article.type || article.bundle || 'article';
}

export function isServiceLine(line) {
  return getArticleType(line) === 'service';
}

export function isMedicamentLine(line) {
  return getArticleType(line) === 'article';
}

export function getLineItemLabel(line) {
  return isServiceLine(line) ? 'Service' : 'Médicament';
}

export function getPraticienName(line) {
  const praticien = line?.field_praticien;
  if (!praticien) return '';
  if (typeof praticien === 'object') {
    return praticien.title || praticien.name || '';
  }
  return '';
}

export function getLineItemBadgeClass(line) {
  return isServiceLine(line)
    ? 'bg-teal-100 text-teal-800'
    : 'bg-blue-100 text-blue-800';
}

export function getLineItemBorderClass(line) {
  return isServiceLine(line) ? 'border-teal-500' : 'border-blue-500';
}

export function getLineItemBgClass(line) {
  return isServiceLine(line) ? 'bg-teal-50/60' : 'bg-blue-50/60';
}
