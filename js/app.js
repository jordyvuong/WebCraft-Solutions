const API_URL = 'https://gabistam.github.io/Demo_API/data/projects.json';

// Variables globales pour stocker les données
let allProjects = [];
let allTechnologies = [];
let currentFilter = 'all';

// Chargement des projets via AJAX (Axios)
async function loadProjects() {
    const loader = document.getElementById('loader');
    const errorDiv = document.getElementById('error');
    const errorMessage = document.getElementById('error-message');

    try {
        // Afficher le loader pendant la requête
        loader.style.display = 'block';
        errorDiv.style.display = 'none';

        const response = await axios.get(API_URL);

        console.log('Données reçues:', response.data);

        allProjects = response.data.projects;
        allTechnologies = response.data.technologies;

        displayProjects(allProjects);
        createFilters();

    } catch (error) {
        // Gestion d'erreur avec try/catch
        console.error('Erreur:', error);
        errorMessage.textContent = 'Impossible de charger les projets. Veuillez réessayer.';
        errorDiv.style.display = 'block';
    } finally {
        loader.style.display = 'none';
    }
}

// Création dynamique des boutons de filtre
function createFilters() {
    const filtersContainer = document.getElementById('filters');
    const allButton = filtersContainer.querySelector('[data-tech="all"]');

    // Manipulation du DOM : création d'éléments
    allTechnologies.forEach(function(tech) {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.textContent = tech;
        button.setAttribute('data-tech', tech);
        button.addEventListener('click', function() {
            filterProjects(tech);
        });
        filtersContainer.appendChild(button);
    });

    allButton.addEventListener('click', function() {
        filterProjects('all');
    });
}

// Filtrage dynamique des projets
function filterProjects(technology) {
    currentFilter = technology;
    const filtersContainer = document.getElementById('filters');

    // Mise à jour visuelle des boutons actifs
    const buttons = filtersContainer.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    const activeBtn = filtersContainer.querySelector(`[data-tech="${technology}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    // Filtrage avec ES6+ (arrow function)
    let filtered;
    if (technology === 'all') {
        filtered = allProjects;
    } else {
        filtered = allProjects.filter(p => p.technologies.includes(technology));
    }

    displayProjects(filtered);
}

// Affichage des projets dans le DOM
function displayProjects(projects) {
    const projectsGrid = document.getElementById('projects-grid');
    const noResults = document.getElementById('no-results');

    projectsGrid.innerHTML = '';

    if (projects.length === 0) {
        noResults.style.display = 'block';
        projectsGrid.style.display = 'none';
        return;
    }

    noResults.style.display = 'none';
    projectsGrid.style.display = 'grid';

    projects.forEach(project => {
        const card = createCard(project);
        projectsGrid.appendChild(card);
    });
}

// Création d'une carte projet
function createCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';

    const img = document.createElement('img');
    img.src = project.image;
    img.alt = project.title;

    const cardBody = document.createElement('div');
    cardBody.className = 'project-card-body';

    const title = document.createElement('h3');
    title.className = 'project-card-title';
    title.textContent = project.title;

    const client = document.createElement('p');
    client.className = 'project-card-client';
    client.textContent = `Client: ${project.client}`; 

    // Création des badges de technologies
    const techContainer = document.createElement('div');
    techContainer.className = 'flex flex-wrap mt-2';
    for (let i = 0; i < project.technologies.length; i++) {
        const badge = document.createElement('span');
        badge.className = 'tech-badge';
        badge.textContent = project.technologies[i];
        techContainer.appendChild(badge);
    }

    const button = document.createElement('button');
    button.className = 'project-card-btn';
    button.textContent = 'Voir détails';
    // Événement click pour ouvrir le modal
    button.addEventListener('click', function() {
        showModal(project);
    });

    cardBody.appendChild(title);
    cardBody.appendChild(client);
    cardBody.appendChild(techContainer);
    cardBody.appendChild(button);

    card.appendChild(img);
    card.appendChild(cardBody);

    return card;
}

// Ouverture du modal avec les détails du projet
function showModal(project) {
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');

    // Construction de HTML avec template literals
    let techBadges = '';
    project.technologies.forEach(function(tech) {
        techBadges += `<span class="tech-badge">${tech}</span>`;
    });

    let featuresList = '';
    project.features.forEach(function(feature) {
        featuresList += `<li>${feature}</li>`;
    });

    // Mise à jour du DOM avec innerHTML
    modalBody.innerHTML = `
        <img src="${project.image}" alt="${project.title}" class="w-full h-72 object-cover rounded-lg mb-6">
        <h2 class="text-3xl font-bold text-gray-800 mb-4">${project.title}</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div class="flex flex-col">
                <span class="text-sm font-semibold text-gray-600 mb-1">Client</span>
                <span class="text-gray-800 font-medium">${project.client}</span>
            </div>
            <div class="flex flex-col">
                <span class="text-sm font-semibold text-gray-600 mb-1">Catégorie</span>
                <span class="text-gray-800 font-medium">${project.category}</span>
            </div>
            <div class="flex flex-col">
                <span class="text-sm font-semibold text-gray-600 mb-1">Année</span>
                <span class="text-gray-800 font-medium">${project.year}</span>
            </div>
            <div class="flex flex-col">
                <span class="text-sm font-semibold text-gray-600 mb-1">Durée</span>
                <span class="text-gray-800 font-medium">${project.duration}</span>
            </div>
        </div>
        <div class="mb-6">
            <strong class="block mb-2 text-gray-800">Technologies utilisées:</strong>
            <div class="flex flex-wrap">${techBadges}</div>
        </div>
        <div class="mb-6 text-gray-700 leading-relaxed">
            <p>${project.description}</p>
        </div>
        <div class="mb-6 modal-features">
            <h4 class="text-xl font-semibold text-gray-800 mb-3">Fonctionnalités principales</h4>
            <ul class="list-none p-0">${featuresList}</ul>
        </div>
        <div class="text-center mt-8">
            <a href="${project.url}" target="_blank" class="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all hover:-translate-y-0.5">Visiter le site</a>
        </div>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('project-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Événements au chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('project-modal');

    const closeButton = modal.querySelector('.modal-close');
    closeButton.addEventListener('click', closeModal);

    const overlay = modal.querySelector('.modal-overlay');
    overlay.addEventListener('click', closeModal);

    // Fermeture au clavier (touche Escape)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });

    // Menu mobile toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            if (mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.remove('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    loadProjects();
});
