export const confirmAlert = (config) => {
  const event = new CustomEvent('show-confirm-dialog', { detail: config });
  window.dispatchEvent(event);
};
