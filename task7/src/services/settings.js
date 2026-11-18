// ключ, под которым книги хранятся в localStorage (свой для task7, чтобы не мешать прошлым заданиям)
export const DATA_KEY = "task7-library-books";

// настройки fake API: задержка ответа и шанс ошибки
export const API_CONFIG = {
  minDelay: 300,
  maxDelay: 1500,
  errorChance: 0.1, // 10% запросов падают с ошибкой (0 - ошибок не будет совсем)
};
