export default class MovieDbService {

  apiBase = 'https://api.themoviedb.org/3/search/movie?api_key=198993f9d1f84637e4e2e8449e1752fe&query=';
  
  async getResource(keyword) {
    const res = await fetch(`${this.apiBase}${keyword}`);

    if(!res.ok) {
      throw new Error();
    }

    const body = await res.json();

    return body;
  }
}