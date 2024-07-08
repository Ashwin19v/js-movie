const key = "c8d70e4d";
let movie_ip = document.getElementById("mip");
let movie_btn = document.getElementById("srh");
let result = document.getElementById("movie");

let movie_ratings = {};

function handle_rating_submit(event, movie_title) {
  event.preventDefault();
  const user_name_input = document.getElementById(`userName_${movie_title}`);
  const user_name = user_name_input.value.trim();
  const rating_input = document.getElementById(`rating_${movie_title}`);
  const user_rating = parseFloat(rating_input.value);
  if (
    isNaN(user_rating) ||
    user_rating < 1 ||
    user_rating > 10 ||
    user_name === ""
  ) {
    alert(
      "Please enter a valid rating between 1 and 10 and provide your name."
    );
    return;
  }

  if (!movie_ratings[movie_title]) {
    movie_ratings[movie_title] = {};
  }
  movie_ratings[movie_title][user_name] = user_rating;

  const rating_display = document.getElementById(
    `rating_display_${movie_title}`
  );
  if (rating_display) {
    let ratings_html = "";
    for (const user in movie_ratings[movie_title]) {
      ratings_html += `<div>${user}: ${movie_ratings[movie_title][user]}<button onclick=del(event)>X</button></div>`;
    }
    rating_display.innerHTML = ratings_html;
  }
}

let get_movie = () => {
  let movie_name = movie_ip.value;
  let url = `http://www.omdbapi.com/?t=${movie_name}&apikey=${key}`;
  if (movie_name.length <= 0) {
    result.innerHTML = `<h3>Enter a movie name</h3>`;
  } else {
    fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.Response === "False") {
          result.innerHTML = `<h3>${data.Error}</h3>`;
        } else {
          result.innerHTML = `<div class="dis">
                    <div class="dis1"><img src=${
                      data.Poster
                    } class="poster"></div>
                    <div class=dis2>
                    <h2>${data.Title}</h2>
                    <div class="rating">Rating:⭐ ${data.imdbRating}</div>
                    <div class="details">
                        <span>${data.Rated}</span>
                        <span>${data.Year}</span>
                        <span>${data.Runtime}</span>
                    </div>
                    <div class="genre">
                        <div>${data.Genre.split(",").join("</div><div>")}</div>
                    </div>
                    </div>
                    </div>
                    <div class="btm">
                        <h3>Plot:</h3>
                        <p>${data.Plot}</p>
                        <h3>Cast:</h3>
                        <p>${data.Actors}</p>
                    </div>
                    <div class="rating-input">
                        <form onsubmit="handle_rating_submit(event, '${
                          data.Title
                        }')">
                            <label for="userName_${
                              data.Title
                            }">Your Name:</label>
                            <input type="text" id="userName_${
                              data.Title
                            }" required>
                            <label for="rating_${
                              data.Title
                            }">Rate this movie out of 10:</label>
                            <input type="number" id="rating_${
                              data.Title
                            }" min="1" max="10" required>
                            <button type="submit">Submit Rating</button>
                        </form>
                        <div id="rating_display_${data.Title}"></div>
                    </div>
                    </div>`;

          if (movie_ratings[data.Title]) {
            const rating_display = document.getElementById(
              `rating_display_${data.Title}`
            );
            let ratings_html = "";
            for (const user in movie_ratings[data.Title]) {
              ratings_html += `<div >${user}: ${
                movie_ratings[data.Title][user]
              } <button onclick=del(event)>X</button></div>`;
            }
            rating_display.innerHTML = ratings_html;
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
};

function del(event) {
  event.target.parentElement.remove();
}

movie_btn.addEventListener("click", get_movie);
