import { type VoidComponent, createSignal, Show, onMount, For } from "solid-js";
import { useAuth } from "@solid-mediakit/auth/client";

interface ProjectFormData {
  title: string;
  description: string;
  date_start: string;
  date_end: string;
  socid: string;
  user_author_id: number;
  public: number;
  budget_amount: string;
  statut: number;
  opp_status: number;
  opp_percent: number;
  opp_amount: string;
  note_public: string;
  note_private: string;
  ref: string;
}

interface DolibarrEvent {
  id: string;
  label: string;
  datep: number;
  datef: number;
  extrafields?: {
    discord_id?: string;
    discord_user?: string;
  };
  note_private?: string;
  ref?: string;
}

const DolibarrPage: VoidComponent = () => {
  const auth = useAuth();
  const [formData, setFormData] = createSignal<ProjectFormData>({
    title: "",
    description: "",
    date_start: "",
    date_end: "",
    socid: "1",
    user_author_id: 1,
    public: 1,
    budget_amount: "0",
    statut: 1,
    opp_status: 1,
    opp_percent: 0,
    opp_amount: "0",
    note_public: "",
    note_private: "",
    ref: ""
  });

  const [isLoading, setIsLoading] = createSignal(false);
  const [message, setMessage] = createSignal<{ type: 'success' | 'error', text: string } | null>(null);
  const [userEvents, setUserEvents] = createSignal<DolibarrEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = createSignal(false);

  const handleInputChange = (field: keyof ProjectFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/dolibarr/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData()),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: result.message });
        // Reset form
        setFormData({
          title: "",
          description: "",
          date_start: "",
          date_end: "",
          socid: "1",
          user_author_id: 1,
          public: 1,
          budget_amount: "0",
          statut: 1,
          opp_status: 1,
          opp_percent: 0,
          opp_amount: "0",
          note_public: "",
          note_private: "",
          ref: ""
        });
      } else {
        setMessage({ type: 'error', text: result.error || 'Erreur lors de la création du projet' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const loadUserEvents = async () => {
    setLoadingEvents(true);
    try {
      const response = await fetch('/api/dolibarr/events');
      const result = await response.json();

      if (response.ok) {
        setUserEvents(result.events || []);
      } else {
        console.error('Erreur lors du chargement des événements:', result.error);
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
    } finally {
      setLoadingEvents(false);
    }
  };

  // Charger les événements au montage du composant
  onMount(() => {
    if (auth.status() === "authenticated") {
      loadUserEvents();
    }
  });

  return (
    <main class="min-h-screen bg-gradient-to-b from-[#026d56] to-[#152a2c] py-8">
      <div class="container mx-auto px-4">
        <div class="mx-auto max-w-2xl">
          <h1 class="mb-8 text-center text-4xl font-bold text-white">
            Créer un projet Dolibarr
          </h1>

          <Show when={auth.status() === "authenticated"}>
            <div class="rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              {/* Informations utilisateur */}
              <div class="mb-6 rounded-md bg-white/5 p-4">
                <h3 class="text-lg font-semibold text-white mb-2">Informations utilisateur</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-white/70">Nom :</span>
                    <span class="text-white ml-2">{auth.session()?.user?.name}</span>
                  </div>
                  <div>
                    <span class="text-white/70">Discord ID :</span>
                    <span class="text-white ml-2 font-mono">{auth.session()?.user?.discordId}</span>
                  </div>
                  <div>
                    <span class="text-white/70">Email :</span>
                    <span class="text-white ml-2">{auth.session()?.user?.email}</span>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit} class="space-y-6">
                {/* Titre du projet */}
                <div>
                  <label for="title" class="block text-sm font-medium text-white">
                    Titre du projet *
                  </label>
                  <input
                    type="text"
                    id="title"
                    required
                    value={formData().title}
                    onInput={(e) => handleInputChange('title', e.currentTarget.value)}
                    class="mt-1 block w-full rounded-md border border-gray-300 bg-white/90 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    placeholder="Ex: Développement application web"
                  />
                </div>

                {/* Date de début */}
                <div>
                  <label for="date_start" class="block text-sm font-medium text-white">
                    Date de début *
                  </label>
                  <input
                    type="datetime-local"
                    id="date_start"
                    required
                    value={formData().date_start}
                    onInput={(e) => handleInputChange('date_start', e.currentTarget.value)}
                    min={getCurrentDateTime()}
                    class="mt-1 block w-full rounded-md border border-gray-300 bg-white/90 px-3 py-2 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>

                {/* Date de fin */}
                <div>
                  <label for="date_end" class="block text-sm font-medium text-white">
                    Date de fin *
                  </label>
                  <input
                    type="datetime-local"
                    id="date_end"
                    required
                    value={formData().date_end}
                    onInput={(e) => handleInputChange('date_end', e.currentTarget.value)}
                    min={getCurrentDateTime()}
                    class="mt-1 block w-full rounded-md border border-gray-300 bg-white/90 px-3 py-2 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>

                {/* Budget */}
                <div>
                  <label for="budget_amount" class="block text-sm font-medium text-white">
                    Budget (€)
                  </label>
                  <input
                    type="number"
                    id="budget_amount"
                    value={formData().budget_amount}
                    onInput={(e) => handleInputChange('budget_amount', e.currentTarget.value)}
                    class="mt-1 block w-full rounded-md border border-gray-300 bg-white/90 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    placeholder="0"
                  />
                </div>

                {/* Référence */}
                <div>
                  <label for="ref" class="block text-sm font-medium text-white">
                    Référence
                  </label>
                  <input
                    type="text"
                    id="ref"
                    value={formData().ref}
                    onInput={(e) => handleInputChange('ref', e.currentTarget.value)}
                    class="mt-1 block w-full rounded-md border border-gray-300 bg-white/90 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    placeholder="Ex: PRJ-2024-001"
                  />
                </div>

                {/* Description */}
                <div>
                  <label for="description" class="block text-sm font-medium text-white">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={formData().description}
                    onInput={(e) => handleInputChange('description', e.currentTarget.value)}
                    class="mt-1 block w-full rounded-md border border-gray-300 bg-white/90 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    placeholder="Description détaillée du projet..."
                  />
                </div>

                {/* Message de statut */}
                <Show when={message()}>
                  <div class={`rounded-md p-4 ${message()?.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                    {message()?.text}
                  </div>
                </Show>

                {/* Bouton de soumission */}
                <div class="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading()}
                    class="rounded-md bg-green-600 px-6 py-3 text-white font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Show when={isLoading()} fallback="Créer le projet">
                      Création en cours...
                    </Show>
                  </button>
                </div>
              </form>
            </div>

            {/* Section des événements de l'utilisateur */}
            <div class="mt-8 rounded-lg bg-white/10 p-6 backdrop-blur-sm">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-semibold text-white">Mes événements</h3>
                <button
                  onClick={loadUserEvents}
                  disabled={loadingEvents()}
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  <Show when={loadingEvents()} fallback="Actualiser">
                    Chargement...
                  </Show>
                </button>
              </div>

              <Show when={loadingEvents()} fallback={
                <Show when={userEvents().length > 0} fallback={
                  <p class="text-white/70 text-center py-8">Aucun événement trouvé</p>
                }>
                  <div class="space-y-4">
                    <For each={userEvents()}>
                      {(event) => (
                        <div class="bg-white/5 rounded-md p-4">
                          <div class="flex justify-between items-start">
                            <div>
                              <h4 class="text-white font-medium">{event.label}</h4>
                              <p class="text-white/70 text-sm">
                                {new Date(event.datep * 1000).toLocaleString('fr-FR')}
                              </p>
                              <p class="text-white/60 text-xs">ID: {event.id}</p>
                            </div>
                            <div class="text-right">
                              <span class="text-xs text-white/50">Discord ID: {event.extrafields?.discord_id}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                </Show>
              }>
                <div class="text-center py-8">
                  <p class="text-white/70">Chargement des événements...</p>
                </div>
              </Show>
            </div>
          </Show>

          <Show when={auth.status() === "unauthenticated"}>
            <div class="text-center">
              <div class="rounded-lg bg-white/10 p-8 backdrop-blur-sm">
                <h2 class="text-2xl font-bold text-white mb-4">
                  Connexion requise
                </h2>
                <p class="text-white/80 mb-6">
                  Vous devez être connecté pour créer des projets Dolibarr.
                </p>
                <button
                  onClick={() => auth.signIn("discord", { redirectTo: "/dolibarr" })}
                  class="rounded-full bg-white/10 px-8 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                >
                  Se connecter avec Discord
                </button>
              </div>
            </div>
          </Show>

          <Show when={auth.status() === "loading"}>
            <div class="text-center">
              <div class="rounded-lg bg-white/10 p-8 backdrop-blur-sm">
                <p class="text-white">Chargement...</p>
              </div>
            </div>
          </Show>
        </div>
      </div>
    </main>
  );
};

export default DolibarrPage; 