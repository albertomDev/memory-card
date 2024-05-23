import { useEffect, useState } from 'react';

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const abortController = new AbortController();
    function getPokemonURL(url) {
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('API error');
          }
          return response.json();
        })
        .then(url => {
          console.log(url);
          setPokemon(prev => [
            ...prev,
            { img: url.sprites.front_default, clicked: false, name: url.name },
          ]);
        })
        .catch(error => console.log(error));
    }

    fetch('https://pokeapi.co/api/v2/pokemon/?limit=6', {
      signal: abortController.signal,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('API error');
        }
        return response.json();
      })
      .then(data => {
        data.results.forEach(pokemon => {
          getPokemonURL(pokemon.url);
        });
      })
      .catch(error => console.log(error));

    return () => {
      // this will cancel the fetch request when the effect is unmounted
      abortController.abort();
    };
  }, []);

  function shufflePokemon(event) {
    console.log(event.currentTarget.dataset);
    if (event.currentTarget.dataset.clicked === 'true') {
      console.log('game over');
    } else {
      setScore(prev => prev + 1);
      const updatePokemon = pokemon.map(poke => {
        if (event.currentTarget.dataset.name === poke.name) {
          return { ...poke, clicked: true };
        }
        return poke;
      });
      setPokemon(updatePokemon);

      const shuffledPokemon = [...updatePokemon];
      shuffledPokemon.sort((a, b) => 0.5 - Math.random());
      setPokemon(shuffledPokemon);
      console.log(pokemon);
    }
  }

  return (
    <>
      <h1>{score}</h1>
      <div>
        {pokemon.map(poke => (
          <img
            key={poke.name}
            src={poke.img}
            alt={`Pokemon ${poke.name}`}
            data-clicked={poke.clicked}
            data-name={poke.name}
            onClick={shufflePokemon}
          />
        ))}
      </div>
    </>
  );
}

export default App;
