/**
 * Bridgeling Widget
 * Embeddable text → text AI assistant for institutional Q&A
 *
 * Usage:
 * <script src="https://bridgeling.com/widget.js"></script>
 * <script>
 *   Bridgeling.init({
 *     tenantId: "uw",
 *     apiUrl: "https://api.bridgeling.com"
 *   });
 * </script>
 */

interface WidgetConfig {
  tenantId: string;
  apiUrl?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

interface QueryResponse {
  answer: string;
  language: string;
  sources: Array<{ url: string; title: string }>;
}

class BridgelingWidget {
  private config: WidgetConfig;
  private container: HTMLElement | null = null;
  private isOpen = false;

  constructor(config: WidgetConfig) {
    this.config = {
      apiUrl: "https://api.bridgeling.com",
      position: "bottom-right",
      ...config,
    };
  }

  init() {
    this.createWidget();
    this.attachEventListeners();
  }

  private createWidget() {
    // Create container
    const container = document.createElement("div");
    container.id = "bridgeling-widget";
    container.className = "bridgeling-widget";

    // Create toggle button
    const toggleBtn = document.createElement("button");
    toggleBtn.className = "bridgeling-toggle";
    toggleBtn.innerHTML = "💬 Ask";
    toggleBtn.onclick = () => this.toggleWidget();

    // Create chat panel
    const panel = document.createElement("div");
    panel.className = "bridgeling-panel";
    panel.style.display = "none";

    panel.innerHTML = `
      <div class="bridgeling-header">
        <h3>Bridgeling</h3>
        <button class="bridgeling-close">✕</button>
      </div>
      <div class="bridgeling-messages"></div>
      <div class="bridgeling-input-area">
        <input type="text" class="bridgeling-input" placeholder="Ask anything..." />
        <button class="bridgeling-send">Send</button>
      </div>
    `;

    container.appendChild(toggleBtn);
    container.appendChild(panel);

    // Inject styles
    this.injectStyles();

    document.body.appendChild(container);
    this.container = container;
  }

  private injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .bridgeling-widget {
        position: fixed;
        bottom: 20px;
        right: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        z-index: 10000;
      }

      .bridgeling-toggle {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: transform 0.2s;
      }

      .bridgeling-toggle:hover {
        transform: scale(1.1);
      }

      .bridgeling-panel {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 380px;
        height: 500px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
        display: flex;
        flex-direction: column;
      }

      .bridgeling-header {
        padding: 16px;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .bridgeling-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }

      .bridgeling-close {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 20px;
        color: #6b7280;
      }

      .bridgeling-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .bridgeling-message {
        display: flex;
        gap: 8px;
        animation: slideIn 0.2s ease-out;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .bridgeling-message.user {
        justify-content: flex-end;
      }

      .bridgeling-message-content {
        max-width: 80%;
        padding: 12px;
        border-radius: 8px;
        line-height: 1.4;
        font-size: 14px;
      }

      .bridgeling-message.user .bridgeling-message-content {
        background: #667eea;
        color: white;
      }

      .bridgeling-message.assistant .bridgeling-message-content {
        background: #f3f4f6;
        color: #1f2937;
      }

      .bridgeling-sources {
        margin-top: 8px;
        font-size: 12px;
        color: #6b7280;
      }

      .bridgeling-sources a {
        color: #667eea;
        text-decoration: none;
      }

      .bridgeling-sources a:hover {
        text-decoration: underline;
      }

      .bridgeling-input-area {
        padding: 12px;
        border-top: 1px solid #e5e7eb;
        display: flex;
        gap: 8px;
      }

      .bridgeling-input {
        flex: 1;
        padding: 10px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 14px;
        outline: none;
      }

      .bridgeling-input:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .bridgeling-send {
        padding: 10px 16px;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        transition: background 0.2s;
      }

      .bridgeling-send:hover {
        background: #5568d3;
      }

      .bridgeling-send:disabled {
        background: #d1d5db;
        cursor: not-allowed;
      }

      .bridgeling-loading {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        color: #6b7280;
      }

      .bridgeling-spinner {
        width: 16px;
        height: 16px;
        border: 2px solid #e5e7eb;
        border-top-color: #667eea;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;

    document.head.appendChild(style);
  }

  private attachEventListeners() {
    if (!this.container) return;

    const closeBtn = this.container.querySelector(".bridgeling-close");
    const sendBtn = this.container.querySelector(".bridgeling-send");
    const input = this.container.querySelector(
      ".bridgeling-input"
    ) as HTMLInputElement;

    closeBtn?.addEventListener("click", () => this.toggleWidget());
    sendBtn?.addEventListener("click", () => this.sendQuery(input.value));
    input?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.sendQuery(input.value);
    });
  }

  private toggleWidget() {
    if (!this.container) return;

    const panel = this.container.querySelector(".bridgeling-panel") as HTMLElement;
    const toggle = this.container.querySelector(".bridgeling-toggle") as HTMLElement;

    this.isOpen = !this.isOpen;
    panel.style.display = this.isOpen ? "flex" : "none";

    if (this.isOpen) {
      const input = this.container.querySelector(
        ".bridgeling-input"
      ) as HTMLInputElement;
      input?.focus();
    }
  }

  private async sendQuery(query: string) {
    if (!query.trim() || !this.container) return;

    const input = this.container.querySelector(
      ".bridgeling-input"
    ) as HTMLInputElement;
    const sendBtn = this.container.querySelector(".bridgeling-send") as HTMLButtonElement;
    const messagesDiv = this.container.querySelector(".bridgeling-messages");

    if (!messagesDiv) return;

    // Add user message
    const userMsg = document.createElement("div");
    userMsg.className = "bridgeling-message user";
    userMsg.innerHTML = `<div class="bridgeling-message-content">${escapeHtml(query)}</div>`;
    messagesDiv.appendChild(userMsg);

    // Clear input
    input.value = "";

    // Show loading state
    sendBtn.disabled = true;
    const loadingMsg = document.createElement("div");
    loadingMsg.className = "bridgeling-message assistant";
    loadingMsg.innerHTML = `
      <div class="bridgeling-message-content">
        <div class="bridgeling-loading">
          <div class="bridgeling-spinner"></div>
          Processing...
        </div>
      </div>
    `;
    messagesDiv.appendChild(loadingMsg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    try {
      const response = await fetch(`${this.config.apiUrl}/api/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: this.config.tenantId,
          query,
          preferredLanguage: "auto",
        }),
      });

      const data: QueryResponse = await response.json();

      // Remove loading message
      messagesDiv.removeChild(loadingMsg);

      // Add assistant message
      const assistantMsg = document.createElement("div");
      assistantMsg.className = "bridgeling-message assistant";

      let sourcesHtml = "";
      if (data.sources && data.sources.length > 0) {
        sourcesHtml = `
          <div class="bridgeling-sources">
            <strong>Sources:</strong>
            ${data.sources
              .map(
                (s) => `<div><a href="${escapeHtml(s.url)}" target="_blank">${escapeHtml(s.title)}</a></div>`
              )
              .join("")}
          </div>
        `;
      }

      assistantMsg.innerHTML = `
        <div class="bridgeling-message-content">
          ${escapeHtml(data.answer)}
          ${sourcesHtml}
        </div>
      `;
      messagesDiv.appendChild(assistantMsg);
    } catch (error) {
      messagesDiv.removeChild(loadingMsg);

      const errorMsg = document.createElement("div");
      errorMsg.className = "bridgeling-message assistant";
      errorMsg.innerHTML = `
        <div class="bridgeling-message-content">
          Sorry, I couldn't process your request. Please try again.
        </div>
      `;
      messagesDiv.appendChild(errorMsg);
    }

    sendBtn.disabled = false;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Global API
declare global {
  interface Window {
    Bridgeling: {
      init: (config: WidgetConfig) => void;
    };
  }
}

window.Bridgeling = {
  init(config: WidgetConfig) {
    const widget = new BridgelingWidget(config);
    widget.init();
  },
};

// Auto-initialize if script has data attributes
document.addEventListener("DOMContentLoaded", () => {
  const script = document.currentScript as HTMLScriptElement | null;
  if (script?.dataset.tenantId) {
    window.Bridgeling.init({
      tenantId: script.dataset.tenantId,
      apiUrl: script.dataset.apiUrl,
    });
  }
});
