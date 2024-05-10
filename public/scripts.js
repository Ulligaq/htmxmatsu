

document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('date');
    const movieInput = document.getElementById('movie');
    const timeInput = document.getElementById('time');
    const addMovieBtn = document.getElementById('add-movie');
    const getAllMoviesBtn = document.getElementById('get-all-movies');
    const movieList = document.getElementById('movie-list');
  
    const firebaseConfig = {
        apiKey: "AIzaSyAz_MvwmM_DyQyRm5ZtKTBdrA1p_S8qAmA",
        authDomain: "matsuvideo-e23d8.firebaseapp.com",
        projectId: "matsuvideo-e23d8",
        storageBucket: "matsuvideo-e23d8.appspot.com",
        messagingSenderId: "830254770157",
        appId: "1:830254770157:web:fb37477a7e3ab70cb3e9e4"
    };
  
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    const movietimeRef = db.collection('movietime');

    let movies = [];
  
    addMovieBtn.addEventListener('click', function() {
        const date = dateInput.value.trim();
        const movie = movieInput.value.trim();
        const time = timeInput.value.trim();
  
        if (date && movie && time) {
            movietimeRef.add({
                Date: date,
                Movie: movie,
                Time: time
            })
            .then(() => {
                console.log('Movie added successfully');
                renderMovies();
                clearInputs();
            })
            .catch(error => {
                console.error('Error adding movie: ', error);
            });
        } else {
            alert('Please enter Date, Movie, and Time.');
        }
    });
  
    getAllMoviesBtn.addEventListener('click', function() {
        movies = [];
        movietimeRef.get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    movies.push(doc.data());
                });
                renderMovies();
            })
            .catch(error => {
                console.error('Error getting movies: ', error);
            });
    });
  
    function renderMovies() {
        movieList.innerHTML = '';
        movies.forEach((movie, index) => {
            const card = document.createElement('div');
            card.classList.add('movie-card');
            card.innerHTML = `
                <p>Date: ${movie.Date}</p>
                <p>${movie.Movie} at ${movie.Time}</p>
                <button class="delete-btn" data-index="${index}">Delete</button>
            `;
            movieList.appendChild(card);
  
            const deleteBtn = card.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', function() {
                const indexToDelete = parseInt(this.dataset.index);
                const docId = movies[indexToDelete].id;
                movietimeRef.doc(docId).delete()
                    .then(() => {
                        console.log('Movie deleted successfully');
                        movies.splice(indexToDelete, 1);
                        renderMovies();
                    })
                    .catch(error => {
                        console.error('Error deleting movie: ', error);
                    });
            });
        });
    }
  
    function clearInputs() {
        dateInput.value = '';
        movieInput.value = '';
        timeInput.value = '';
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const nowPlayingList = document.getElementById('now-playing-list');
    const upcomingList = document.getElementById('upcoming-list');
    const apiKey = 'e3330843b55bf27874a3a58513eba7f6';
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${apiKey}`
      }
    };
  
    fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1&api_key=' + apiKey, options)
      .then(response => response.json())
      .then(data => {
        displayMovies(data.results, nowPlayingList);
      })
      .catch(err => console.error('Error fetching now playing movies:', err));
  
    fetch('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1&api_key=' + apiKey, options)
      .then(response => response.json())
      .then(data => {
        displayMovies(data.results, upcomingList);
      })
      .catch(err => console.error('Error fetching upcoming movies:', err));
  
    function displayMovies(movies, targetElement) {
      targetElement.innerHTML = '';
      movies.forEach(movie => {
        const li = document.createElement('li');
        li.innerHTML = `
          <h3>${movie.title}</h3>
          <p>${movie.overview}</p>
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} Poster" class="center">
        `;
        targetElement.appendChild(li);
      });
    }
  });