const openMemo = async () => {
  const url = chrome.runtime.getURL('index.html');
  // TODO: Chrome 拡張のページは tabs.query() に引っかからない説
  const tabs = await chrome.tabs.query({ url });
  if (tabs.length >= 1) {
    await chrome.windows.update(tabs[0].windowId ?? 0, { focused: true });
    await chrome.tabs.update(tabs[0].id ?? 0, { active: true });
    return;
  }
  chrome.tabs.create({ url });
};

// chrome.runtime.onInstalled.addListener(() => openMemo());
chrome.action.onClicked.addListener(() => openMemo());