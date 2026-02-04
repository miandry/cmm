// Construction parametre url
// field a utiliser
// filter, sort, pager

export function buildQueryParams(options) {
  const params = new URLSearchParams();

  // Fields
  if (options.fields?.length) {
    options.fields.forEach((f) => params.append("fields[]", f));
  }

  // Sort
  if (options.sort?.val && options.sort?.op) {
    params.append("sort[val]", options.sort.val);
    params.append("sort[op]", options.sort.op);
  }

  // Filters
  if (options.filters && Object.keys(options.filters).length > 0) {
    for (const [key, filter] of Object.entries(options.filters)) {
      if (
        filter?.val !== null &&
        filter?.val !== undefined &&
        filter?.val !== ""
      ) {
        // 👉 CAS TABLEAU (ex: BETWEEN)
        if (Array.isArray(filter.val)) {
          filter.val.forEach((v) => {
            params.append(`filters[${key}][val][]`, v);
          });
        }
        // 👉 CAS SIMPLE
        else {
          params.append(`filters[${key}][val]`, filter.val);
        }

        if (filter.op) {
          params.append(`filters[${key}][op]`, filter.op);
        }
      }
    }
  }

  // Pagination
  if (options.pager !== undefined) params.append("pager", options.pager);
  if (options.offset !== undefined) params.append("offset", options.offset);

  return params.toString();
}
