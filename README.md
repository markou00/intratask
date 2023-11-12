# IntraTask - Prosjektdokumentasjon

## Om IntraTask

IntraTask er en innovativ webapplikasjon utviklet for Reknes for å bistå i deres kontinuerlige forbedringsprosesser. 
Applikasjonen tilbyr avanserte funksjoner for visualisering og håndtering av avvik basert på data innhentet og analysert gjennom et komplekst system.

## Hovedfunksjoner

- **Data Visualisering:** Presentasjon av avviksdata gjennom ulike typer grafer (Area, Pie, Stacked bar charts) og stats cards.
- **Detaljert Avvikshåndtering:** Omfattende tabellvisning for individuelle avvik, inkludert muligheter for modifikasjon og detaljert visning.

## Teknologier og Verktøy

- **Backend:** NextJS, Azure Functions
- **Frontend:** React, Mantine UI
- **Database:** Azure SQL Server, Prisma ORM
- **Autentisering:** Microsoft Entra ID
- **Version Control og CI/CD:** Git, GitHub, Docker, Azure App Service, Azure Container Registry, GitHub Actions

## Forberedelser før Installering

Før du installerer og kjører applikasjonen, må du opprette følgende ressurser:

1. **Azure SQL Server:**
   - Opprett en SQL Server i Azure.
   - Du vil trenge `DATABASE_URL` og `SHADOW_DATABASE_URL` for din `.env` fil.

2. **Applikasjon i Azure Entra ID:**
   - Opprett en applikasjon i Azure Entra ID.
   - Du vil trenge `NEXT_PUBLIC_AZURE_AD_APPLICATION_ID`, `NEXT_PUBLIC_AZURE_AD_DIRECTORY_ID`, og `AZURE_AD_CLIENT_SECRET` for din `.env` fil.
  
3. **Zendesk konto:**
   - Opprett en API token i Zendesk kontoen din
   - Du vil trenge `ZENDESK_EMAIL_ADDRESS`, `ZENDESK_API_TOKEN`, og `ZENDESK_SUBDOMAIN` for din `.env` fil.

## Bruk

### Initialisering

Ved første kjøring henter og analyserer systemet historiske data fra Zendesk for å etablere en grunnleggende avviksdatabase.

### Daglig Oppdatering

Nye tickets som kommer inn hver dag behandles og sammenlignes med eksisterende data for å identifisere nye avvik.

## Installering og Kjøring

1. **Klon Repositoriet:**
   ```bash
   git clone [repository-url]

2. **Installer avhengigheter:**
   ```bash
   cd web
   yarn

3. **Kjøre appen lokalt:**
   ```bash
   yarn dev
