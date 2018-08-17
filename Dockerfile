FROM mdillon/postgis:10-alpine

RUN adduser -s /bin/false -D app &&\
  npm install --global yarn
# installs git
RUN apk add --no-cache bash

# copy project file
COPY package.json package-lock.json /home/app/application/

RUN chown -R app:app /home/app/*

WORKDIR /home/app/application

# setup tini
RUN apk add --no-cache tini
# Tini is now available at /sbin/tini

# copy production node_modules
COPY --from=dependencies /home/app/application/prod_node_modules ./node_modules  
# copy in built docs
# COPY --from=build /shortener/docs ./  

# copy app sources
COPY . .  

RUN rm -r ./src

COPY --from=build /home/app/application/build ./src  

ENTRYPOINT ["/sbin/tini", "--"]

USER app

CMD yarn run prod