import os

# This script runs a SQL file in the running PostgreSQL Docker container using psql
# Make sure docker-compose is up and the db service is running

sql_file = '../backend/bms_schema.sql'
container_name = 'hostinger-export-db-1'  # Default name, may need to adjust

# Compose the docker exec command
cmd = f'docker-compose exec db psql -U postgres -d bms -f {sql_file}'

print('Running:', cmd)
os.system(cmd)
