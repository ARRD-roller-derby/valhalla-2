# API Dolibarr - Création d'événements

## Configuration

Ajoutez les variables d'environnement suivantes dans votre fichier `.env` :

```env
DOLIBARR_URL=https://votre-instance-dolibarr.com
DOLIBARR_API_KEY=votre-clé-api-dolibarr
```

## Endpoint POST /api/dolibarr/event

### Description

Crée un nouvel événement dans Dolibarr via l'API REST.

### URL

```
POST /api/dolibarr/event
```

### Headers

```
Content-Type: application/json
```

### Corps de la requête

#### Champs obligatoires

- `label` (string) : Titre de l'événement
- `datep` (string) : Date et heure de l'événement (format: YYYY-MM-DD HH:MM:SS)
- `durationp` (number) : Durée de l'événement en secondes

#### Champs optionnels

- `note` (string) : Description de l'événement
- `location` (string) : Lieu de l'événement
- `type` (string) : Type d'événement (défaut: "event")
- `status` (number) : Statut de l'événement (défaut: 1 = actif)
- `fk_user_author` (number) : ID de l'utilisateur créateur (défaut: 1)
- `fk_user_mod` (number) : ID de l'utilisateur modificateur (défaut: 1)

### Exemple de requête

```javascript
const response = await fetch('/api/dolibarr/event', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    label: 'Réunion équipe',
    datep: '2024-01-15 14:00:00',
    durationp: 3600, // 1 heure
    note: "Réunion hebdomadaire de l'équipe",
    location: 'Salle de conférence A',
    type: 'meeting',
  }),
})

const result = await response.json()
```

### Réponse de succès

```json
{
  "success": true,
  "message": "Événement créé avec succès",
  "event": {
    "id": 123,
    "label": "Réunion équipe",
    "datep": "2024-01-15 14:00:00",
    "durationp": 3600,
    "note": "Réunion hebdomadaire de l'équipe",
    "location": "Salle de conférence A",
    "type": "meeting",
    "status": 1
  }
}
```

### Codes d'erreur

- `400` : Données manquantes ou invalides
- `500` : Erreur de configuration ou erreur interne du serveur
- `502` : Erreur de communication avec l'API Dolibarr

### Exemple d'erreur

```json
{
  "error": "Données manquantes: label, datep et durationp sont requis"
}
```

## Notes importantes

1. Assurez-vous que votre instance Dolibarr a l'API REST activée
2. La clé API doit avoir les permissions nécessaires pour créer des événements
3. Les dates doivent être au format ISO (YYYY-MM-DD HH:MM:SS)
4. La durée est exprimée en secondes
