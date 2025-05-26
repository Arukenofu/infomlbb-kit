  function detectScript(text: string) {
    return /[а-яё]/i.test(text) || /[А-ЯЁ]/.test(text) ? 'ru' : 'en';
  }

export { detectScript };