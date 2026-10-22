// Симулированный API.
// Работает как настоящий сервер: функции возвращают Promise, ответ приходит с задержкой,
// данные хранятся в localStorage (это наша "база данных").
import initialMovies from '../data/movies.json';

const STORAGE_KEY = 'movie-tracker-movies';
export const PAGE_SIZE = 12;

// Ждём ms миллисекунд. Так имитируем сетевую задержку.
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Случайная задержка 300–1000 мс: ответы приходят в разном порядке,
// поэтому видно, зачем нужна защита от гонок (флаг ignore в useEffect).
function randomDelay() {
  return delay(300 + Math.random() * 700);
}

// Читаем все фильмы из localStorage.
// При первом запуске там пусто, поэтому кладём туда фильмы из movies.json.
function readMovies() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMovies));
  }
  // JSON.parse каждый раз создаёт новые объекты, поэтому наружу всегда уходит копия
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

function saveMovies(movies) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
}

export const GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Drama', 'Fantasy',
  'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western',
];

export const STATUSES = [
  { value: 'want', label: 'Want to watch' },
  { value: 'watching', label: 'Watching' },
  { value: 'watched', label: 'Watched' },
];

// GET /movies?search=&genre=&status=&sortBy=&page=
export async function getMovies({ search, genre, status, sortBy, page }) {
  await randomDelay();

  // Специальное слово, чтобы показать error state на защите
  if (search.trim().toLowerCase() === 'error') {
    throw new Error('Server error. Please try again.');
  }

  let movies = readMovies();

  // 1. Поиск по названию и режиссёру
  const text = search.trim().toLowerCase();
  if (text !== '') {
    movies = movies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(text) ||
        movie.director.toLowerCase().includes(text),
    );
  }

  // 2. Фильтры
  if (genre !== 'all') {
    movies = movies.filter((movie) => movie.genre === genre);
  }
  if (status !== 'all') {
    movies = movies.filter((movie) => movie.status === status);
  }

  // 3. Сортировка. filter уже вернул новый массив, но делаем копию [...movies],
  // потому что sort меняет массив, на котором его вызвали.
  const sorted = [...movies];
  if (sortBy === 'rating') {
    sorted.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'year-new') {
    sorted.sort((a, b) => b.year - a.year);
  } else if (sortBy === 'year-old') {
    sorted.sort((a, b) => a.year - b.year);
  } else {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  }

  // 4. Пагинация: берём только нужную страницу
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const items = sorted.slice(start, start + PAGE_SIZE);

  return { items, total: sorted.length, totalPages };
}

// GET /movies/:id
export async function getMovieById(id) {
  await randomDelay();
  const movie = readMovies().find((m) => m.id === Number(id));
  if (!movie) {
    throw new Error('Movie not found.');
  }
  return movie;
}

// POST /movies
export async function createMovie(data) {
  await randomDelay();
  const movies = readMovies();
  // Новый id = самый большой id + 1
  const maxId = Math.max(...movies.map((m) => m.id));
  const newMovie = { ...data, id: maxId + 1 };
  // Не меняем старый массив (push), а создаём новый
  saveMovies([...movies, newMovie]);
  return newMovie;
}

// PATCH /movies/:id  { status }
export async function updateMovieStatus(id, status) {
  await randomDelay();
  const movies = readMovies();
  // map возвращает новый массив; нужный фильм заменяем копией с новым статусом
  const updated = movies.map((m) => (m.id === id ? { ...m, status } : m));
  saveMovies(updated);
  return updated.find((m) => m.id === id);
}
