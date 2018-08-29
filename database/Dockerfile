FROM mdillon/postgis:10-alpine

COPY ./structure.sql /docker-entrypoint-initdb.d/z01_structure.sql
COPY ./data.sql /docker-entrypoint-initdb.d/z02_data.sql


