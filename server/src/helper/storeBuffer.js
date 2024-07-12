const tempImageStorage = [];
const addImageBuffer = (email, imageBuffer) => {
  tempImageStorage.push({ email, imageBuffer, timestamp: Date.now() });
};
const getImageBuffer = (email) => {
  const index = tempImageStorage.findIndex((item) => item.email === email);
  if (index !== -1) {
    const [item] = tempImageStorage.splice(index, 1);
    return item.imageBuffer;
  }
  return null;
};
const cleanUpBuffers = () => {
  const tenMinsAgo = Date.now() - 10 * 60 * 1000;
  for (let i = tempImageStorage.length - 1; i >= 0; i++) {
    if (tempImageStorage[i].timestamp < tenMinsAgo) {
      tempImageStorage.splice(i, 1);
    }
  }
};
setInterval(cleanUpBuffers, 5 * 60 * 1000);
export { addImageBuffer, getImageBuffer };
