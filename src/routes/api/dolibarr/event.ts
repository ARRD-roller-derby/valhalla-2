import { json } from "@solidjs/router";
import { serverEnv } from "~/env/server";
import { getSession } from "@solid-mediakit/auth";
import { authOptions } from "~/server/auth";

export async function POST({ request }: { request: Request }) {
  try {
    // Récupérer la session utilisateur
    const session = await getSession(request, authOptions);

    if (!session?.user) {
      return json(
        { error: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validation des données d'entrée
    if (!body.label || !body.datep || !body.datef) {
      return json(
        { error: "Données manquantes: label, datep et datef sont requis" },
        { status: 400 }
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
    })

    // Appel à l'API Dolibarr pour créer un projet
    const response = await fetch(`${dolibarrUrl}/projects?${params.toString()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "DOLAPIKEY": apiKey,
      },
      body: JSON.stringify({
        "label": body.label || "Événement créé via API",
        "type_id": 40,
        "code": "AC_OTH_AUTO",
        "datep": Math.floor(new Date(body.datep).getTime() / 1000),
        "datef": Math.floor(new Date(body.datef).getTime() / 1000),
        "userownerid": 1,
        "location": body.location || "",
        "fulldayevent": 0,
        "percentage": -1,
        "priority": 0,
        "transparency": 0,
        "extrafields": {
          "event_type": "rien",
          "discord_id": session.user.discordId,
          "discord_user": session.user.name
        },
        "note_private": `Événement créé par ${session.user.name} (Discord ID: ${session.user.discordId})`,
        "ref": `DISCORD_${session.user.discordId}_${Date.now()}`
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur API Dolibarr:", errorText);
      return json(
        { error: "Erreur lors de la création de l'événement", details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();

    return json({
      success: true,
      message: "Projet créé avec succès",
      project: result,
    });

  } catch (error) {
    console.error("Erreur lors de la création de l'événement:", error);
    return json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
} 