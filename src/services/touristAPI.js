// touristAPI.js
import axios from 'axios';

const API_KEY = 'fsq3AmBm5Fzcb0pG3U+VwIG7r5y9OcScU97UbvWjsi1vHE4=';
const BASE_URL = 'https://api.foursquare.com/v3/places';

// Função para buscar pontos turísticos próximos
export const fetchTouristSpots = async (latitude, longitude) => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      headers: {
        Authorization: API_KEY,
      },
      params: {
        ll: `${latitude},${longitude}`, // Coordenadas no formato `latitude,longitude`
        radius: 5000, // Raio de busca em metros
        categories: '16000', // Categoria para "pontos turísticos"
        limit: 20, // Limita o número de resultados retornados
      },
    });
    return response.data.results || []; // Retorna os pontos turísticos ou uma lista vazia se não houver dados
  } catch (error) {
    console.error('Erro ao buscar pontos turísticos:', error);
    throw new Error('Falha ao buscar pontos turísticos');
  }
};
