import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Définition du schéma pour les URL
const urlSchema = new mongoose.Schema({
  url: String,
});

const Url = mongoose.model('Url', urlSchema);

async function deleteUrls() {
  try {
    // Cette fonction supprime tous les documents de la collection "urls".
    const result = await Url.deleteMany({});
    console.log(`Nombre de documents supprimés : ${result.deletedCount}`);
  } catch (error) {
    console.error('Erreur lors de la suppression :', error);
  } finally {
    await mongoose.connection.close();
  }
}

// Exécuter la fonction pour supprimer les urls
deleteUrls();