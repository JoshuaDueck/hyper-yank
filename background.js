chrome.commands.onCommand.addListener((command) => {
  if (command === "copy_hyperlink") {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: copySelectedTextAsLink,
        args: [tab.url]
      });
    });
  }
});

function copySelectedTextAsLink(url) {
  const selection = window.getSelection().toString().trim();
  if (!selection) return;

  const markdown = `[${selection}](${url})`;
  const html = `<a href="${url}">${selection}</a>`;

  const blobInput = [
    new ClipboardItem({
      "text/plain": new Blob([markdown], { type: "text/plain" }),
      "text/html": new Blob([html], { type: "text/html" })
    })
  ];

  navigator.clipboard.write(blobInput).catch((err) =>
    console.error("Clipboard write failed:", err)
  );
}

