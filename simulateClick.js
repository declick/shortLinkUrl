import axios from 'axios';
import geoip from 'geoip-lite';

// Liste des adresses IP de différents pays pour simuler les clics
const ips = [
  '51.158.78.1', // F
  '51.158.78.1', // France
  '81.2.69.160', // UK
  '139.130.4.5', // Australia
  '91.198.174.192', // Netherlands
  '196.25.1.1',  // South Africa
  '100.42.20.0', // Canada
  '62.141.58.13',  // Germany
  '79.41.123.211', // Italy
  '1.178.32.0' // Brazil
];

// Fonction pour simuler un clic
const simulateClick = async (shortUrl, ip) => {
  try {
    // Utiliser une adresse IP spécifique pour la requête
    const response = await axios.get(`http://localhost:5000/${shortUrl}`, {
      headers: {
        'X-Forwarded-For': ip,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    console.log(`Click from ${ip} (Country: ${geoip.lookup(ip)?.country || 'Unknown'}) was successful.`);
  } catch (error) {
    console.error(`Error simulating click from ${ip}:`, error.message);
  }
};

// Fonction pour attendre un certain temps (en millisecondes)
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// URL raccourcie à tester
const shortUrl = 'v5_WIvqya'; // Remplacez par votre short URL

// Simuler des clics à partir de différentes adresses IP avec un délai entre chaque clic
const simulateClicks = async () => {
  for (const ip of ips) {
    await simulateClick(shortUrl, ip);
    await delay(1000); // Attendre 1 seconde entre chaque clic
  }
};

simulateClicks();
