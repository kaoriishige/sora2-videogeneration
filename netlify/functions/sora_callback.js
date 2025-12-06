exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const callbackData = JSON.parse(event.body);
        
        // 💡 APIから返された動画完成データ
        const taskId = callbackData.taskId; 
        const videoUrl = callbackData.videoUrl;
        
        console.log(`動画完成通知を受信しました。`);
        console.log(`Task ID: ${taskId}`);
        console.log(`動画URL: ${videoUrl}`);
        
        // --- ★ この後の処理 ★ ---
        // 1. データベース (Netlify環境に合わせたもの) に情報を保存
        // 2. ユーザーにメールで通知
        // 3. フロントエンド（ブラウザ）に通知するための仕組みをトリガー (WebSocketなど)
        // -----------------------

        return { 
            statusCode: 200, 
            body: JSON.stringify({ message: "Callback received and processed." }) 
        };

    } catch (error) {
        console.error("Callback Processing Error:", error);
        return { statusCode: 500, body: JSON.stringify({ error: "Error processing callback" }) };
    }
};