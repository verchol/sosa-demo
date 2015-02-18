
# Pull base image.
FROM dockerfile/nodejs


# Bundle app source
COPY . /src
# RUN cd /src;npm install;bower install
# Install app dependencies
# RUN cd /src;npm install;npm install bower;bower install
WORKDIR /src
EXPOSE 9000
CMD ["node", "/src/server/app.js"]
