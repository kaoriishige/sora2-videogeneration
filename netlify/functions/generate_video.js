// Node.jsの標準fetchを使用するため、依存関係のインストールは不要です (Node v18+の場合)

exports.handler = async (event, context) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    // 環境変数からAPIキーを取得
    const API_KEY = process.env.SORA_API_KEY; 
    const BASE_URL = "https://api.sora2api.ai/api/v1";

    try {
        const { prompt } = JSON.parse(event.body);
        
        // コールバックURLを動的に設定 (Netlify Functionsのエンドポイント)
        // 例: https://[あなたのサイト名].netlify.app/.netlify/functions/sora_callback
        const callbackURL = `${process.env.URL}/.netlify/functions/sora_callback`;
        
        const response = await fetch(`${BASE_URL}/sora2api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                prompt: prompt,
                callBackUrl: callbackURL, // 💡 ここにFunction BのURLを指定
                aspectRatio: "16:9"       // 必須ではないが推奨
            })
        });

        // 200 OK が返るため、リクエスト成功と見なす
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "動画生成リクエストを送信しました。数分後に通知が届きます。", callback_endpoint: callbackURL })
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};