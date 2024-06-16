import axios from 'axios';
import geoip from 'geoip-lite';

// Liste des adresses IP de différents pays pour simuler les clics
const ips = [
    '51.158.78.1', // France
  '81.2.69.160', // UK
  '139.130.4.5', // Australia
  '196.25.1.1',  // South Africa
  '64.233.160.0', // Canada
  '62.141.58.13',  // Germany
  '79.41.123.211' // Italy
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

// URL raccourcie à tester
const shortUrl = 'CeFc9y2Sw'; // Remplacez par votre short URL

// Simuler des clics à partir de différentes adresses IP
ips.forEach(ip => simulateClick(shortUrl, ip));
