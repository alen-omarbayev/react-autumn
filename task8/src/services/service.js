// Все запросы к API лежат здесь. Компоненты и страницы не трогают localStorage напрямую,
// они только вызывают функции из этого файла.
import { API_CONFIG, DATA_KEY } from "./settings.js";
import { initialData } from "./initialData.js";

// Имитация запроса к серверу: случайная задержка и иногда ошибка
function fakeRequest(operation) {
  const { minDelay, maxDelay, errorChance } = API_CONFIG;

  return new Promise((resolve, reject) => {
    const delayMS = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

    setTimeout(() => {
      if (Math.random() < errorChance) {
        reject(new Error("Simulated server Error"));
        return;
      }

      try {
        resolve(operation());
      } catch (error) {
        reject(error);
      }
    }, delayMS);
  });
}

function initializeDatabase() {
  if (!localStorage.getItem(DATA_KEY)) {
    localStorage.setItem(DATA_KEY, JSON.stringify(initialData));
  }
}

function readData() {
  return JSON.parse(localStorage.getItem(DATA_KEY) || "[]");
}

function writeData(items) {
  localStorage.setItem(DATA_KEY, JSON.stringify(items));
}

initializeDatabase();

// Список книг. query - строка вида "?search=dune&genre=Sci-Fi&page=2"
export async function getItemsList(query = "") {
  return fakeRequest(() => {
    const params = new URLSearchParams(query);
    const search = params.get("search") || "";
    const genre = params.get("genre") || "";
    const status = params.get("status") || "";
    const sort = params.get("sort") || "name";
    const page = Number(params.get("page")) || 1;
    const limit = Number(params.get("limit")) || 10;

    let items = readData();

    // ПОИСК по названию, автору и описанию
    if (search) {
      const text = search.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(text) ||
          item.author.toLowerCase().includes(text) ||
          item.description.toLowerCase().includes(text),
      );
    }

    // ФИЛЬТР 1: жанр
    if (genre) {
      items = items.filter((item) => item.genre === genre);
    }

    // ФИЛЬТР 2: статус (available / borrowed)
    if (status) {
      items = items.filter((item) => item.status === status);
    }

    // СОРТИРОВКА
    items = [...items].sort((a, b) => {
      switch (sort) {
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "rating-desc":
          return b.rating - a.rating;
        case "year-desc":
          return b.year - a.year;
        case "year":
          return a.year - b.year;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    // ПАГИНАЦИЯ
    const total = items.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;

    // в списке отдаём только поля для карточки, описание грузится через getItem
    const data = items.slice(start, start + limit).map((item) => ({
      id: item.id,
      name: item.name,
      author: item.author,
      genre: item.genre,
      year: item.year,
      pages: item.pages,
      rating: item.rating,
      status: item.status,
    }));

    return { data, total, page, limit, totalPages };
  });
}

// Список всех жанров (для выпадающего фильтра)
export async function getGenres() {
  return fakeRequest(() => {
    const genres = readData().map((item) => item.genre);
    // new Set убирает повторы
    return [...new Set(genres)].sort();
  });
}

export async function getItem(id) {
  return fakeRequest(() => {
    const item = readData().find((item) => item.id === Number(id));

    if (!item) {
      throw new Error("Item not found");
    }

    return item;
  });
}

export async function createItem(data) {
  return fakeRequest(() => {
    const items = readData();
    const nextId = items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
    const newItem = { ...data, id: nextId };

    writeData([...items, newItem]);
    return newItem;
  });
}

export async function updateItem(id, changes) {
  return fakeRequest(() => {
    const numericId = Number(id);
    const items = readData();

    if (!items.some((item) => item.id === numericId)) {
      throw new Error("Item not found");
    }

    const updatedItems = items.map((item) =>
      item.id === numericId ? { ...item, ...changes, id: numericId } : item,
    );

    writeData(updatedItems);
    return updatedItems.find((item) => item.id === numericId);
  });
}

export async function deleteItem(id) {
  return fakeRequest(() => {
    const numericId = Number(id);
    const items = readData();

    if (!items.some((item) => item.id === numericId)) {
      throw new Error("Item not found");
    }

    writeData(items.filter((item) => item.id !== numericId));
    return { success: true, id: numericId };
  });
}
