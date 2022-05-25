const generateCode = () => {
  const head = Date.now().toString(36).toLocaleUpperCase();
  const tail = Math.random().toString(36).substring(3, 5).toLocaleUpperCase();
  return head + tail;
};

module.exports = { generateCode };
