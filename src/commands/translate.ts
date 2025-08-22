import { Context } from 'telegraf';
import { getPhotolink } from '../shared/helpers/get-photolink';
import { AIService } from '../services/AI';
import { fetchImageAsBase64 } from '../shared/helpers/base64';
import { splitAndSendMessage } from '../shared/helpers/split-message';

const scenario = `
Ты получаешь скриншот с текстом патч-нотов.
Твоя задача — перевести текст на русский язык и оформить его строго по формату:

{{Усиление|Ослабление|Изменение}} {{Имя героя в родительном падеже}}
{{Пассивный|[число] Навык|Ультимейт|Атрибуты|Базовая Атака|Уникальная Пассивная}} - {{Усиление|Ослабление|Изменение}}
{{краткие данные изменения}}

Правила:
- Имя героя всегда переводи на русский язык и используй в родительном падеже.
- Используй только голый текст, без HTML, Markdown или других форматов.
- Убирай лишние вводные и пояснительные фразы вроде:
  - "Based on ongoing evaluations..."
  - "to help players make judgments..."
  - "Это предотвращает..."
  - Оставляй только суть изменения.
- Если изменение описывает отмену прошлых правок, пиши в стиле:
  "Отменено снижение бонуса щита..."
- Перед уникальными пассивными 'n: ' (без ')
- Если уникальных пассивок несколько, то нумеруй типо: 
  Уникальная пассивная 1 - Изменение
  // что-то
  Уникальная пассивная 2 - Усиление
  // что-то

Пример правильного результата:

Ослабление Минотавра
Пассивный - Ослабление
Соотношение восстановления здоровья: 20% >> 10% + (1% * Уровень Героя)

Усиление Бэйна
2 Навык - Усиление
Урон яда: 100-300 + 130% магической силы >> 150-350 + 130% магической силы
Ультимейт - Усиление
Уменьшили время замаха на 20%

Изменение Ангелы
2 Навык - Усиление
Добавлен индикатор круга эффективной дальности после попадания 2 Навыком по врагам
Ультимейт - Усиление
Отменено снижение бонуса щита от общей магической силы
Оптимизирована логика авто-выбора цели: Ультимейт теперь нацеливается на союзника с наименьшим процентом здоровья, если он участвовал в бою последние 3 секунды
`;

const translateCommand = () => async (
  context: Context,
) => {
  if (!context.message || !('photo' in context.message)) return;

  const link = await getPhotolink(context.message.photo, context.telegram);
  const ai = new AIService(process.env.AI_SERVICE_KEY, { scenario });

  const base64 = await fetchImageAsBase64(link, 'image/jpeg');

  const data = await ai.sendImage(base64);
  const response = data.candidates[0].content.parts[0].text;

  splitAndSendMessage(response, context);
}

export { translateCommand };