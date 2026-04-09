document.addEventListener("DOMContentLoaded", () => {
  const diagnosisForm = document.getElementById("diagnosisForm");
  const applicationForm = document.getElementById("applicationForm");

  // 汎用的なメールバリデーション
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // フォーム送信時の共通処理
  function setupForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    const formMessage = form.querySelector(".form-message");

    form.addEventListener("submit", (e) => {
      if (formMessage) {
        formMessage.textContent = "";
        formMessage.className = "form-message";
      }

      const formData = new FormData(form);
      const email = (formData.get("email") || "").toString().trim();
      const terms = form.querySelector('input[name="consent_terms"]');

      // バリデーション
      if (!isValidEmail(email)) {
        e.preventDefault();
        if (formMessage) {
          formMessage.textContent = "メールアドレスの形式をご確認ください。";
          formMessage.classList.add("error");
        }
        return;
      }

      // 注意事項があるフォーム（申し込み用）の場合のチェック
      if (terms && !terms.checked) {
        e.preventDefault();
        if (formMessage) {
          formMessage.textContent = "注意事項への同意をお願いいたします。";
          formMessage.classList.add("error");
        }
        return;
      }

      // 成功時はSSGformへ送信（e.preventDefaultしない）
      if (formMessage) {
        formMessage.textContent = "送信中...";
        formMessage.classList.add("success");
      }
    });
  }

  setupForm("diagnosisForm");
  setupForm("applicationForm");
});
