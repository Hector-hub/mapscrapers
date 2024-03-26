export const combineObjects = (objectA, objectB) => {
    let objectC = {};
    if (objectB) {
      const allKeys = new Set([...Object.keys(objectA), ...Object.keys(objectB)]);
  
      for (const key of allKeys) {
        const combinedList = [...(objectA[key] || []), ...(objectB[key] || [])];
        objectC[key] = [...new Set(combinedList)];
      }
    } else {
      objectC = { ...objectA };
    }
    return objectC;
};