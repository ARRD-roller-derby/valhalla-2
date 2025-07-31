import { json } from "@solidjs/router";
import { serverEnv } from "~/env/server";
import { getSession } from "@solid-mediakit/auth";
import { authOptions } from "~/server/auth";

export async function GET({ request }: { request: Request }) {
  try {
    // Récupérer la session utilisateur
    const session = await getSession(request, authOptions);

    if (!session?.user) {
      return json(
        { error: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }

    // Configuration de l'API Dolibarr
    const dolibarrUrl = serverEnv.DOLIBARR_URL;
    const apiKey = serverEnv.DOLIBARR_API_KEY;

    if (!dolibarrUrl || !apiKey) {
      return json(
        { error: "Configuration Dolibarr manquante" },
        { status: 500 }
      );
    }

    const params = new URLSearchParams({
      DOLAPIKEY: apiKey,
      limit: "100", // Limiter à 100 événements
      sortfield: "datep",
      sortorder: "DESC"
    });

    // Récupérer tous les événements
    const response = await fetch(`${dolibarrUrl}/agendaevents?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "DOLAPIKEY": apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur API Dolibarr:", errorText);
      return json(
        { error: "Erreur lors de la récupération des événements", details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();

    // Filtrer les événements créés par cet utilisateur Discord
    const userEvents = result.filter((event: any) => {
      return event.extrafields?.discord_id === session.user.discordId ||
        event.note_private?.includes(session.user.discordId) ||
        event.ref?.includes(session.user.discordId);
    });

    return json({
      success: true,
      message: "Événements récupérés avec succès",
      events: userEvents,
      total: userEvents.length,
      userDiscordId: session.user.discordId
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des événements:", error);
    return json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 