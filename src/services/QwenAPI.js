export class QwenAPIService {
  constructor() {
    this.apiUrl = import.meta.env.VITE_CLAUDE_API_URL || 'https://api.anthropic.com/v1/messages';
    this.model = import.meta.env.VITE_CLAUDE_MODEL || 'claude-sonnet-4-20250514';
  }

  async sendMessage(prompt, maxTokens = 1500) {
    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_QWEN_API_KEY}`
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: maxTokens,
          messages: [
            { role: "user", content: prompt }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }

      const data = await response.json();
      let responseText = data.content[0].text;
      
      // 清理JSON响应
      responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      
      return JSON.parse(responseText);
    } catch (error) {
      console.error("Claude API调用失败:", error);
      throw error;
    }
  }
}

export const qwenAPI = new QwenAPIService();