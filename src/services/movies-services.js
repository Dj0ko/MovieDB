export default class MovieDbService {

  apiKey = '198993f9d1f84637e4e2e8449e1752fe';

  apiBase = 'https://api.themoviedb.org/3/';

  apiSearchMovie = `${this.apiBase}search/movie?api_key=${this.apiKey}`;

  apiGuestSession = `${this.apiBase}authentication/guest_session/new?api_key=${this.apiKey}`;
  
  async getResource(keyword, page) {
    const res = await fetch(`${this.apiSearchMovie}&page=${page}&query=${keyword}`);

    if(!res.ok) {
      throw new Error();
    }

    const body = await res.json();

    return body;
  }

  async getGuestSession() {
    const res = await fetch(this.apiGuestSession);

    if(!res.ok) {
      throw new Error();
    }

    const body = await res.json();

    return body;
  }

  async rateMovie(myRating, movieId, guestSessionId) {
    const rate = {
      "value": myRating
    }

    const res = await fetch(`${this.apiBase}movie/${movieId}/rating?api_key=${this.apiKey}&guest_session_id=${guestSessionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(rate)
    })

    const body = await res.json();

    return body; 
  }

  async getRatedMovies(guestSession) {
    const res = await fetch(`${this.apiBase}guest_session/${guestSession}/rated/movies?api_key=${this.apiKey}&language=en-US&sort_by=created_at.asc`);

    if(!res.ok) {
      throw new Error();
    }

    const body = await res.json();

    return body;
  }

  async getGenres() {
    const res = await fetch(`${this.apiBase}genre/movie/list?api_key=${this.apiKey}&language=en-US`);

    if(!res.ok) {
      throw new Error();
    }

    const body = await res.json();

    return body;
  }
}