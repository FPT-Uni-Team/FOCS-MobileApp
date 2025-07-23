export const objectMapper = (data: any[], fieldMap: Record<string, string>) => {
  return data.map((item) => {
    const mappedItem: Record<string, any> = {};
    Object.keys(fieldMap).forEach((key) => {
      const backendKey = fieldMap[key];
      mappedItem[key] = item[backendKey];
    });
    return mappedItem;
  });
}; 