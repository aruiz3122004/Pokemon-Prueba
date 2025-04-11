// Array con los nombres de los 15 Pokémon a mostrar
const pokemonList = [
    'pikachu', 'charizard', 'blastoise', 'venusaur', 'gengar',
    'machamp', 'alakazam', 'hypno', 'lapras', 'greninja',
    'snorlax', 'magikarp', 'eevee', 'vaporeon', 'lucario'
];

// Elementos del DOM
const pokemonContainer = document.getElementById('pokemon-container');
const pokemonFilter = document.querySelector('.pokemon-select');

// Función principal que carga los Pokémon
async function loadPokemons() {
    try {
        // Mostrar mensaje de carga
        pokemonContainer.innerHTML = '<div class="loading pixel-text">Cargando Pokémon...</div>';
        
        // Cargar datos de todos los Pokémon
        const pokemons = await Promise.all(
            pokemonList.map(name => fetchPokemonData(name))
        );
        
        // Mostrar todos los Pokémon
        displayPokemons(pokemons);
        
        // Llenar el select de filtrado
        populateFilterOptions(pokemons);
        
    } catch (error) {
        console.error('Error al cargar los Pokémon:', error);
        pokemonContainer.innerHTML = '<p class="error pixel-text">¡Oh no! Los Pokémon se han escapado. Por favor, inténtalo de nuevo más tarde.</p>';
    }
}

// Función para obtener datos de un Pokémon específico
async function fetchPokemonData(pokemonName) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
        if (!response.ok) {
            throw new Error(`Pokémon no encontrado: ${pokemonName}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al cargar ${pokemonName}:`, error);
        return null;
    }
}

// Función para determinar el tipo principal
function getMainType(pokemonData) {
    return pokemonData.types[0]?.type?.name || 'normal';
}

// Función para obtener color según tipo
function getTypeColor(type) {
    const typeColors = {
        fire: '#ff4422',
        water: '#3d7dca',
        grass: '#78c850',
        electric: '#ffcc00',
        psychic: '#f85888',
        ice: '#98d8d8',
        dragon: '#7038f8',
        dark: '#705848',
        fairy: '#ee99ac',
        normal: '#a8a878',
        fighting: '#c03028',
        flying: '#a890f0',
        poison: '#a040a0',
        ground: '#e0c068',
        rock: '#b8a038',
        bug: '#a8b820',
        ghost: '#705898',
        steel: '#b8b8d0'
    };
    return typeColors[type] || '#ffcb05';
}

// Función para mostrar los Pokémon en el DOM
function displayPokemons(pokemons, filter = 'all') {
    pokemonContainer.innerHTML = '';
    
    const filteredPokemons = filter === 'all' 
        ? pokemons 
        : pokemons.filter(p => p && p.name === filter);
    
    filteredPokemons.forEach(pokemon => {
        if (!pokemon) return;
        
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        const mainType = getMainType(pokemon);
        card.setAttribute('data-type', mainType);
        
        // Obtener la habilidad principal
        const mainAbility = pokemon.abilities[0]?.ability?.name || 'unknown';
        
        card.innerHTML = `
            <div class="pokemon-image">
                <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" 
                     alt="${pokemon.name}"
                     loading="lazy">
            </div>
            <div class="pokemon-info">
                <h3 class="pokemon-name">${pokemon.name}</h3>
                <p class="pokemon-ability">Habilidad: ${mainAbility.replace('-', ' ')}</p>
                <p class="pokemon-type" style="background-color: ${getTypeColor(mainType)}">
                    Tipo: ${mainType}
                </p>
            </div>
        `;
        
        pokemonContainer.appendChild(card);
    });
}

// Función para llenar las opciones del select de filtrado
function populateFilterOptions(pokemons) {
    // Ordenar los Pokémon alfabéticamente
    const sortedPokemons = [...pokemons].sort((a, b) => a.name.localeCompare(b.name));
    
    sortedPokemons.forEach(pokemon => {
        if (!pokemon) return;
        
        const option = document.createElement('option');
        option.value = pokemon.name;
        option.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        
        // Añadir tipo como data attribute
        const mainType = getMainType(pokemon);
        option.dataset.type = mainType;
        option.style.backgroundColor = getTypeColor(mainType) + '40'; // Añade transparencia
        
        pokemonFilter.appendChild(option);
    });

    // Cambiar color del borde según el tipo seleccionado
    pokemonFilter.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        if (selectedOption.dataset.type) {
            this.style.borderColor = getTypeColor(selectedOption.dataset.type);
        } else {
            this.style.borderColor = '#ffcb05';
        }
        
        displayPokemons(pokemons, this.value);
    });
}

// Cargar los Pokémon cuando la página esté lista
document.addEventListener('DOMContentLoaded', loadPokemons);

// Efecto especial al cargar
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});