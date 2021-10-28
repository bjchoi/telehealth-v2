# --------------------------------------------------------------------------------
# Dockerfile for local installer
#
# To run,
#
# - install Docker desktop on your machine
# - run 'docker build --tag hls-installer https://github.com/twilio/hls-telehealth.git#main'
# - run 'docker run -p 3000:3000 -it hls-installer'
# - open in browser, http://localhost:3000/installer.html
#
# --------------------------------------------------------------------------------
FROM twilio/twilio-cli:latest

RUN twilio plugins:install @twilio-labs/plugin-serverless

# directory to copy/run application
WORKDIR /hls-installer

# copy github files needed for running locally
COPY Dockerfile package.json .env assets functions /hls-installer
COPY assets /hls-installer/assets
COPY functions /hls-installer/functions

# install node dependencies in package.json
RUN npm install

# expose default port for running locally
EXPOSE 3000

CMD ["twilio", "serverless:start"]
