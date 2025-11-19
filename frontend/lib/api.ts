import axios from 'axios';
import { Pokemon, Review, Category, Owner, Reviewer, Country } from '@/types';

// Backend API URL - defaults to https://localhost:7177/api
// To use a different URL, set NEXT_PUBLIC_API_URL in .env.local
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7177/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Handle errors better
  validateStatus: function (status) {
    return status < 500; // Don't throw for 4xx errors
  },
});

// Add response interceptor for better error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      console.error('Network Error: Make sure the backend API is running on', API_BASE_URL);
    }
    return Promise.reject(error);
  }
);

// Pokemon API
export const pokemonApi = {
  getAll: async (): Promise<Pokemon[]> => {
    const response = await api.get<Pokemon[]>('/pokemon');
    return response.data;
  },
  getById: async (id: number): Promise<Pokemon> => {
    const response = await api.get<Pokemon>(`/pokemon/${id}`);
    return response.data;
  },
  getRating: async (id: number): Promise<number> => {
    const response = await api.get<number>(`/pokemon/rating/${id}`);
    return response.data;
  },
  create: async (pokemon: Omit<Pokemon, 'id'>, ownerId: number, categoryId: number): Promise<void> => {
    await api.post(`/pokemon?ownerId=${ownerId}&catId=${categoryId}`, pokemon);
  },
  update: async (id: number, pokemon: Pokemon, ownerId: number, categoryId: number): Promise<void> => {
    await api.put(`/pokemon/${id}?ownerId=${ownerId}&catId=${categoryId}`, pokemon);
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/pokemon/${id}`);
  },
};

// Review API
export const reviewApi = {
  getAll: async (): Promise<Review[]> => {
    const response = await api.get<Review[]>('/review');
    return response.data;
  },
  getById: async (id: number): Promise<Review> => {
    const response = await api.get<Review>(`/review/${id}`);
    return response.data;
  },
  getByPokemon: async (pokemonId: number): Promise<Review[]> => {
    const response = await api.get<Review[]>(`/review/pokemon/${pokemonId}`);
    return response.data;
  },
  create: async (review: Omit<Review, 'id'>, reviewerId: number, pokemonId: number): Promise<void> => {
    await api.post(`/review?reviewerId=${reviewerId}&pokeId=${pokemonId}`, review);
  },
  update: async (id: number, review: Review): Promise<void> => {
    await api.put(`/review/${id}`, review);
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/review/${id}`);
  },
};

// Category API
export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/category');
    return response.data;
  },
  getById: async (id: number): Promise<Category> => {
    const response = await api.get<Category>(`/category/${id}`);
    return response.data;
  },
  getPokemonByCategory: async (categoryId: number): Promise<Pokemon[]> => {
    const response = await api.get<Pokemon[]>(`/category/pokemon/${categoryId}`);
    return response.data;
  },
  create: async (category: Omit<Category, 'id'>): Promise<void> => {
    await api.post('/category', category);
  },
  update: async (id: number, category: Category): Promise<void> => {
    await api.put(`/category/${id}`, category);
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/category/${id}`);
  },
};

// Owner API
export const ownerApi = {
  getAll: async (): Promise<Owner[]> => {
    const response = await api.get<Owner[]>('/owner');
    return response.data;
  },
  getById: async (id: number): Promise<Owner> => {
    const response = await api.get<Owner>(`/owner/${id}`);
    return response.data;
  },
  create: async (owner: Omit<Owner, 'id'>, countryId: number): Promise<void> => {
    await api.post(`/owner?countryId=${countryId}`, owner);
  },
  update: async (id: number, owner: Owner, countryId: number): Promise<void> => {
    await api.put(`/owner/${id}?countryId=${countryId}`, owner);
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/owner/${id}`);
  },
};

// Reviewer API
export const reviewerApi = {
  getAll: async (): Promise<Reviewer[]> => {
    const response = await api.get<Reviewer[]>('/reviewer');
    return response.data;
  },
  getById: async (id: number): Promise<Reviewer> => {
    const response = await api.get<Reviewer>(`/reviewer/${id}`);
    return response.data;
  },
  create: async (reviewer: Omit<Reviewer, 'id'>, countryId: number): Promise<void> => {
    await api.post(`/reviewer?countryId=${countryId}`, reviewer);
  },
  update: async (id: number, reviewer: Reviewer, countryId: number): Promise<void> => {
    await api.put(`/reviewer/${id}?countryId=${countryId}`, reviewer);
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/reviewer/${id}`);
  },
};

// Country API
export const countryApi = {
  getAll: async (): Promise<Country[]> => {
    const response = await api.get<Country[]>('/country');
    return response.data;
  },
  getById: async (id: number): Promise<Country> => {
    const response = await api.get<Country>(`/country/${id}`);
    return response.data;
  },
  create: async (country: Omit<Country, 'id'>): Promise<void> => {
    await api.post('/country', country);
  },
  update: async (id: number, country: Country): Promise<void> => {
    await api.put(`/country/${id}`, country);
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/country/${id}`);
  },
};

