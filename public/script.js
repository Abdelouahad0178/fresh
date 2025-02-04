// Importer les modules Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getFirestore, collection, addDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDFcrId5gBvP-wRUh5Qd8ZtRA6lYLR1ZCM",
    authDomain: "lustreshop.firebaseapp.com",
    databaseURL: "https://lustreshop-default-rtdb.firebaseio.com",
    projectId: "lustreshop",
    storageBucket: "lustreshop.firebasestorage.app",
    messagingSenderId: "114153471561",
    appId: "1:114153471561:web:5726950a3d15d8a4160998",
    measurementId: "G-9L60YDTKQX"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Détails des admin pour la modale
const adminDetails = {
    "ananas": { description: "Une Ananas fresh.", image: "images/Ananas.webp" },
    "banana": { description: "Banana géant pour les grandes cuisines.", image: "images/banana.png" },
    "tanjale": { description: "Tanjale fresh naturel.", image: "images/tanjale.png" },
    "touma": { description: "Notre spécialité premium.", image: "images/touma.png" },
    "khizou": { description: "légume principale pour les grandes Maisons.", image: "images/khizou.png" },
    "menthe": { description: "menthe principale pour les grandes Maisons.", image: "images/menthe.png" },
    "ouarga": { description: "ouarga naturel.", image: "images/ouarga.png" }
};

// Fonction d'ouverture de la modale
const openModal = (category) => {
    const details = adminDetails[category];
    if (details) {
        document.getElementById('modal-title').textContent = category;
        document.getElementById('modal-description').textContent = details.description;
        document.getElementById('modal-image').src = details.image;
        document.getElementById('modal').style.display = 'flex';
    }
};

// Fonction pour calculer le total
const prices = {
    'ananas': 50,
    'banana': 80,
    'orange': 20,
    'chiba': 10,
    'khoussa': 10,
    'khizou': 20,
    'nectarine': 20,
    'touma': 20,
    'menthe': 15,
    'ouarga': 20,
    'patate':20,
    'tomate':20,
    'onion':20
};

const updateTotal = () => {
    let total = 0;

    // Calcul du total pour les admin
    document.querySelectorAll('.admin-quantity').forEach(input => {
        const category = input.dataset.category;
        const quantity = parseInt(input.value, 10) || 0;
        if (prices[category]) {
            total += quantity * prices[category];
        } else {
            console.error(`Prix non trouvé pour la catégorie : ${category}`);
        }
    });

    // Calcul du total pour les boissons
    document.querySelectorAll('.boisson-quantity').forEach(input => {
        const category = input.dataset.category;
        const quantity = parseInt(input.value, 10) || 0;
        if (prices[category]) {
            total += quantity * prices[category];
        } else {
            console.error(`Prix non trouvé pour la catégorie : ${category}`);
        }
    });

    // Mise à jour des éléments du DOM
    const totalDisplay = document.getElementById('total-display');
    const totalDisplayHeader = document.getElementById('total-display-header');

    if (totalDisplay) {
        totalDisplay.textContent = `Total à payer : ${total} DHS`;
    } else {
        console.error("Élément 'total-display' non trouvé.");
    }

    if (totalDisplayHeader) {
        totalDisplayHeader.textContent = `Total à payer : ${total} DHS`;
    } else {
        console.error("Élément 'total-display-header' non trouvé.");
    }
};


// Fonction pour envoyer la commande à Firebase
const sendOrderToFirebase = async (orderData) => {
    try {
        const ordersRef = collection(db, 'orders');
        await addDoc(ordersRef, orderData);
        alert('Commande passée avec succès !');
    } catch (error) {
        console.error("Erreur lors de l'envoi de la commande :", error);
        alert("Une erreur est survenue lors de l'envoi de la commande.");
    }
};

// Fonction pour récupérer la localisation de l'utilisateur
const getLocation = () => {
    const addressInput = document.getElementById('client-address');
    const getLocationBtn = document.getElementById('get-location-btn');
    const loadingSpinner = document.getElementById('loading-spinner');

    if (!addressInput || !getLocationBtn || !loadingSpinner) {
        console.error("Un ou plusieurs éléments du DOM sont manquants.");
        return;
    }

    // Vérifier si la géolocalisation est supportée par le navigateur
    if (!navigator.geolocation) {
        alert("La géolocalisation n'est pas supportée par votre navigateur.");
        return;
    }

    // Afficher le spinner de chargement
    loadingSpinner.style.display = 'block';
    addressInput.value = "";

    // Récupérer la position de l'utilisateur
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;

            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

            try {
                const apiKey = "AIzaSyBb7csOUmRUXI787W9c2q9EtYVOQPYtH2c"; // Remplacez par votre clé API Google Maps
                const response = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
                );
                const data = await response.json();

                if (data.results && data.results.length > 0) {
                    addressInput.value = data.results[0].formatted_address;
                } else {
                    console.error("Aucune adresse trouvée pour ces coordonnées.");
                    alert("Impossible de récupérer l'adresse. Veuillez la saisir manuellement.");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de l'adresse :", error);
                alert("Impossible de récupérer l'adresse. Veuillez la saisir manuellement.");
            } finally {
                // Masquer le spinner de chargement
                loadingSpinner.style.display = 'none';
            }
        },
        (error) => {
            console.error("Erreur de géolocalisation :", error);
            alert("Vous devez autoriser l'accès à votre localisation pour utiliser cette fonctionnalité.");
            loadingSpinner.style.display = 'none';
        }
    );
};

// Fonction pour initialiser le slider
const initSlider = () => {
    const slidesContainer = document.querySelector('.slides');
    const slides = document.querySelectorAll('.slide');
    const paginationContainer = document.querySelector('.pagination');
    let currentIndex = 0;

    // Générer les icônes de pagination
    if (paginationContainer) {
        slides.forEach((slide, index) => {
            const dot = document.createElement('div');
            dot.classList.add('pagination-dot');
            if (index === 0) dot.classList.add('active'); // Activer la première icône
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
            paginationContainer.appendChild(dot);
        });
    }

    // Fonction pour aller à une slide spécifique
    const goToSlide = (index) => {
        currentIndex = index;
        const offset = -currentIndex * 100;
        slidesContainer.style.transform = `translateX(${offset}%)`;

        // Mettre à jour les icônes de pagination
        updatePagination();
    };

    // Fonction pour mettre à jour les icônes de pagination
    const updatePagination = () => {
        const dots = document.querySelectorAll('.pagination-dot');
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    // Défilement automatique du slider
    setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        goToSlide(currentIndex);
    }, 3000);
};

// DOMContentLoaded pour gérer les événements
document.addEventListener('DOMContentLoaded', () => {
    console.log("Script chargé !"); // Debug

    // Initialiser le slider
    initSlider();

    // Gestion de la modal
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close-btn');
    const orderForm = document.getElementById('new-order-form');

    // Afficher la modale lorsqu'une image est cliquée
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        slide.addEventListener('click', () => {
            const category = slide.dataset.category;
            openModal(category);
        });
    });

    // Fermer la modale
    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.style.display = 'none');
    }
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    // Ajout d'une unité au clic sur les images des admin dans le formulaire
    const adminImages = document.querySelectorAll('#admin-categories img');
    adminImages.forEach(img => {
        img.addEventListener('click', (e) => {
            const category = e.target.alt;
            const input = document.querySelector(`.admin-quantity[data-category="${category}"]`);
            if (input) {
                input.value = parseInt(input.value || "0", 10) + 1;
                input.dispatchEvent(new Event('input')); // Met à jour le total
            }
        });
    });

    // Ajout d'une unité au clic sur les images des boissons dans le formulaire
    const boissonsImages = document.querySelectorAll('#boissons-list img');
    boissonsImages.forEach(img => {
        img.addEventListener('click', (e) => {
            const category = e.target.alt;
            const input = document.querySelector(`.boisson-quantity[data-category="${category}"]`);
            if (input) {
                input.value = parseInt(input.value || "0", 10) + 1;
                input.dispatchEvent(new Event('input'));
            }
        });
    });

    // Calcul et mise à jour du total lors de la modification des quantités
    document.querySelectorAll('.admin-quantity, .boisson-quantity').forEach(input => {
        input.addEventListener('input', updateTotal);
    });

    // Soumettre la commande
    if (orderForm) {
        orderForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const clientName = document.getElementById('client-name').value || '';
            const clientPhone = document.getElementById('client-phone').value || '';
            const clientAddress = document.getElementById('client-address').value || '';
            const admin = [];
            const boissons = [];
            let total = 0;

            // Récupérer les admin commandés
            document.querySelectorAll('.admin-quantity').forEach(input => {
                const category = input.dataset.category;
                const quantity = parseInt(input.value, 10) || 0;
                if (quantity > 0) {
                    admin.push({ category, quantity });
                    total += quantity * prices[category];
                }
            });

            // Récupérer les boissons commandées
            document.querySelectorAll('.boisson-quantity').forEach(input => {
                const category = input.dataset.category;
                const quantity = parseInt(input.value, 10) || 0;
                if (quantity > 0) {
                    boissons.push({ category, quantity });
                    total += quantity * prices[category];
                }
            });

            const orderData = {
                clientName,
                clientPhone,
                clientAddress,
                admin,
                boissons,
                total,
                orderStatus: "En traitement",
                timestamp: new Date().getTime(), // Stocker le timestamp
                commercialPhone: "" // Numéro de téléphone du livreur (vide par défaut)
            };

            // Envoi de la commande à Firebase
            await sendOrderToFirebase(orderData);

            // Réinitialisation du formulaire et du total
            orderForm.reset();
            updateTotal();
        });
    }

    // Gestion de la flèche de retour en haut
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Ajouter un écouteur d'événements au bouton "Utiliser ma localisation"
    const getLocationBtn = document.getElementById('get-location-btn');
    if (getLocationBtn) {
        getLocationBtn.addEventListener('click', getLocation);
    } else {
        console.error("Le bouton 'Utiliser ma localisation' est introuvable.");
    }
});











