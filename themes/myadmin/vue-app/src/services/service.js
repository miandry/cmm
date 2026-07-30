import { getDetails, getLists, saveItem } from './api'

export function getServices(params) {
  return getLists('node', 'service', params)
}

export function getService(id, params) {
  return getDetails('node', 'service', id, params)
}

export function saveService(data) {
  return saveItem(data)
}

export function getServiceCategories(params) {
  return getLists('taxonomy_term', 'categorie_service', params)
}

export function saveServiceCategory(name) {
  return saveItem({
    entity_type: 'taxonomy_term',
    bundle: 'categorie_service',
    name: name.trim(),
  })
}

export function getPraticiens(params) {
  return getLists('node', 'praticien', params)
}

export function savePraticien(data) {
  return saveItem(data)
}

export function getTypePraticien(params) {
  return getLists('taxonomy_term', 'type_praticien', params)
}

export function buildServiceCommandeLineItems(items = []) {
  return items.map((item) => {
    const line = {
      entity_type: 'paragraph',
      bundle: 'commande',
      field_article: item.nid,
      field_quantite: item.quantity,
      field_prix_d_achat: item.field_prix_unitaire,
      field_prix_unitaire: item.field_prix_unitaire,
    };

    if (item.field_praticien) {
      line.field_praticien = item.field_praticien;
    }

    return line;
  });
}
