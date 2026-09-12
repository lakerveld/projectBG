# Locaties en quizzen beheren

## Inhoud

Bewerk [content/locatiequizzen.md](../content/locatiequizzen.md). Het nummer is het
nummer op de kaart. Elke locatie heeft een naam, vraag, vier antwoorden, één juist
antwoord (A–D) en een bonus. Alleen locatie 1 is al ingevuld. Vul de lege regels in
voor de overige locaties; de beheerpagina laat vrijgeven pas toe als alles compleet is.
Houd iedere waarde op één regel. Publiceer een nieuwe deployment na een wijziging.
Lokaal leest de server wijzigingen meteen. Reeds vrijgegeven quizzen blijven gelijk.

## Lokaal starten

1. Start `npm run dev` en open `/beheer`. Er is geen wachtwoord nodig.
2. Open `/journey` in een tweede venster. Geef locatie 1 vrij in het beheervenster.
3. Binnen ongeveer vijf seconden verschijnt de ontgrendelmelding. Klik op hexagon 1,
   kies **Activeren**, beantwoord de vraag en bekijk de verdiende kaart.

Zonder Redis gebruikt de ontwikkelserver `.journey-data/state.json`. Dit bestand
staat buiten Git en overleeft het herstarten. Deze fallback is alleen voor één lokale
Next-server; productie weigert verzoeken als de gedeelde opslag ontbreekt.

## Gedeeld gebruik op telefoons

Maak een Redis-database met een Upstash-compatible REST API en stel op de hosting in:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN` (schrijftoken, uitsluitend op de server)
- `JOURNEY_GAME_ID` (bijvoorbeeld `matthew`; dezelfde waarde op alle serverinstanties)

De Vercel-integratie mag ook `KV_REST_API_URL` en `KV_REST_API_TOKEN` gebruiken.
Deze worden gebruikt als de overeenkomstige `UPSTASH_`-variabelen leeg zijn.

De implementatie gebruikt de [Upstash Redis SDK](https://upstash.com/docs/redis/sdks/ts/overview)
en een atomische compare-and-set via EVAL om gelijktijdige antwoorden en unlocks
zonder verloren updates te verwerken. De inhoud van het Markdown-bestand wordt
via Next output file tracing meegenomen in de serverdeployment.

Gebruik de HTTPS-URL van dezelfde deployment voor `/beheer` en `/journey`.
Er is één gedeelde speler: Matthew. Iedereen met toegang tot de app kan namens deze
speler antwoorden. `/beheer` is vrij toegankelijk: iedereen die deze pagina opent
kan locaties vrijgeven. Er is geen wachtwoord of geheime sleutel nodig.
Een bestaande `JOURNEY_ADMIN_PASSWORD` in `.env.local` wordt niet meer gebruikt en kan weg.

## Spelgedrag

- Iedere locatie begint **op slot**.
- Een begeleider kiest **Locatie vrijgeven**: de locatie wordt **beschikbaar**.
- Matthew kiest **Activeren**: de quiz wordt **gestart**. Teruggaan of verversen
  bewaart deze status; via dezelfde hexagon kan hij hervatten.
- Het eerste bevestigde antwoord maakt de locatie **afgerond**, ook bij een fout
  antwoord. Alleen bij een goed antwoord verdient hij de bijbehorende kaart.
- Antwoorden en beloningen worden op de server gecontroleerd en opgeslagen.
  Een herhaald verzoek geeft hetzelfde resultaat en kan geen extra kaart verdienen.
- De verzameling ontwikkelingskaarten toont deze serverkaarten plus bestaande lokale
  kaarten; de oude Bierpaleis-kaart wordt niet dubbel getoond.
- Dobbelworpen en de struikrover keren terug naar de kaart. Quizzen starten via locaties.
- De geopende app ververst iedere vijf seconden en bij terugkeer naar het tabblad of
  herstel van de verbinding. Nieuwe unlocks geven een melding en, indien ondersteund,
  een korte trilling. Dit is geen pushmelding als de app gesloten is.
- Bij verbindingsverlies blijven bekende statussen zichtbaar, maar activeren en een
  antwoord bevestigen vereisen een geslaagde serveropslag. Een melding geeft aan dat
  de verbinding weg is; verzoeken kunnen veilig opnieuw worden geprobeerd.

De resources na dobbelworpen blijven zoals voorheen lokaal op Matthews telefoon.
Dit onderdeel synchroniseert locaties, quizresultaten en de bijbehorende kaarten.
Er is bewust geen resetknop die tijdens het spel resultaten kan wissen. Gebruik voor
een nieuwe productiegame een andere `JOURNEY_GAME_ID`; lokaal kan na stoppen van de
server het ontwikkelbestand worden verwijderd.

## Beheer laadt niet

- Gebruik `http://localhost:3000/beheer` bij de lokale ontwikkelserver.
- Het bestand moet `.env.local` heten, inclusief de eerste punt, in de projectroot.
- Herstart `npm run dev` na het toevoegen of wijzigen van de omgevingsinstellingen.
  Een al draaiende `npm run start` moet ook opnieuw worden gestart.
- Redis mag lokaal bij `npm run dev` leeg blijven. Bij `npm run start` zijn de
  Redis-instellingen verplicht omdat die opdracht de productieversie start.
- Als de pagina blijft laden of knoppen niet reageren: herstart de ontwikkelserver,
  open de `localhost`-URL en ververs de browser volledig.
