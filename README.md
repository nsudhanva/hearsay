# hearsay
Platform to aggregate information received from social media that one can substantiate but inadequately.

## Setting Up Environment Variables

Create the following files at the root of the repository

1. ```.env.client.dev```

```yaml
CHOKIDAR_USEPOLLING=true
```

2. ```.env.db.dev```

```yaml
PGADMIN_DEFAULT_EMAIL=admin@hearsay.ai
PGADMIN_DEFAULT_PASSWORD=hearsay
POSTGRES_USER=hearsay
POSTGRES_PASSWORD=hearsay
POSTGRES_DB=hearsay
```

3. ```.env.server.dev```

```yaml
DATABASE_URL=postgresql://hearsay:hearsay@db:5432/hearsay
DEBUG=1
```

## Running

- `docker-compose build`
- `docker-compose up`

## Usage

### Download and install [Insomnia](https://insomnia.rest/)

- Create a [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) on GitHub
- Enter your github credentials in the UI
- Click on import project and import the `.insomnia` folder from the root.
- Make changes to the API yaml file if required and push changes from insomnia.

### Open your browser and visit the following:

- `hearsay.localhost` - Frontend (React App)
- `api.hearsay.localhost` - Backend (Django App)
- `pgadmin.hearsay.localhost` - PG Admin (Database)