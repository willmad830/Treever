# Treever

**Найди корень ошибки за 30 секунд - учись без пробелов в знаниях.**

Трек **Social Impact** · Future Minds Hackathon 2026

Школьник фотографирует решение. Система не ставит «неверно», а разворачивает цепочку тем от текущей программы вниз по классам и показывает первопричину на живом дереве пробелов.

---

## Архитектура и стек

| Слой | Технология | Роль |
| --- | --- | --- |
| Фреймворк | Next.js 16 (App Router) | Страницы кабинетов, `POST /api/scan` |
| UI | React 19, TypeScript | Клиентские сценарии ученика и учителя |
| Стили | Tailwind CSS 4, Geist | Светлый UI, кириллица |
| Анимация | Framer Motion | Прорастание SVG-веток, spring UI |
| Формулы | KaTeX | Условие / решение / разбор |
| Иконки | lucide-react | Сканер, навигация |
| AI | Gemini (`@google/generative-ai`) | Разбор фото/текста → JSON-граф пробелов |
| Persist (MVP) | `localStorage` | Сканы, профиль диагностики, материалы учителя |

**Паттерн:** тонкий AI-gateway + доменный маппинг JSON → фиксированная SVG-геометрия дерева. Граф **не** на React Flow.

**Маршруты:** `/` · `/diagnostic` · `/dashboard` · `/scan/[id]` · `/modules/[slug]` · `/teacher` · `/teacher/student/[id]`

---

## Ссылка на рабочий продукт

**Live:** https://treever.vercel.app

---

## Документирование 20% AI-кода (Шаг 5.1.3)

Правило 8.1: модель используется как распознающий контур. Раскладка дерева, кабинеты и геометрический движок — handwritten.

### Handwritten Logic

| Модуль | Зачем |
| --- | --- |
| `src/lib/nativeLimbPaths.ts` | Семпл кубических SVG-путей, цепочки tip→trunk |
| `src/lib/treeTips.ts` | `mapAnalysisToTreeNodes`: класс / root-cause → слоты на ветке |
| `src/components/KnowledgeTree.tsx` | Ствол, pathLength-рост, орбы, HTML hit-area |
| `src/components/MathText.tsx` | LaTeX-острова в русском тексте |
| `src/lib/scanStorage.ts` + кабинеты | История сканов, учитель/ученик, цели |
| `src/lib/goalsBuilder.ts`, `goalProgressSync.ts` | Дедлайны и прогресс после скана |
| `src/app/diagnostic/page.tsx` + `diagnosticMock.ts` | Входной тест без модели |

### AI-Core (~20%)

| Модуль | Зачем |
| --- | --- |
| `src/services/geminiScan.ts` | Серверный вызов Gemini, разбор JSON |
| `src/app/api/scan/route.ts` | HTTP-вход: image data URL и/или text |
| `src/config/aiConfig.ts` | Ключ, модель, system/user prompt из env |
| `src/services/aiService.ts` | Клиентский `fetch("/api/scan")` |
| Каркас Next | Бутстрап приложения, не предметная логика |

ИИ **не** генерирует path `d` и **не** считает x/y узлов. Он возвращает `nodes[]` / `edges[]` / `target_topic` / `root_error_node_id`; клиент сажает узлы на заранее заданные конечности дерева.

---
