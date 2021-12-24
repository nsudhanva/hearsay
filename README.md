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

Open your browser and visit the following:

- `hearsay.localhost` - Frontend (React App)
- `api.hearsay.localhost` - Backend (Django App)
- `pgadmin.hearsay.localhost` - PG Admin (Database)