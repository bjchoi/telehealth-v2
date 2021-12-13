#Telehealth v2 Working Repo 


## <a name="install"></a>Installation Information
___

This section details the requirements for a successful deployment and installation of the prototype application.

### Prerequisites

The following prerequisites must be satisfied prior to installing the application.

**Twilio account**

- Create a Twilio account by signing up [here](https://www.twilio.com/try-twilio)
- Once the Twilio account is created,
  please note the `ACCOUNT SID` and `AUTH TOKEN`
  from the [Twilio console](https://console.twilio.com/) for use below
- If you have multiple Twilio Projects under your account, make sure that you are logged into the Project that you want the application to be deployed to

**Twilio phone number**

- After provisioning your Twilio account,
  you will need to [purchase a phone number](https://www.twilio.com/console/phone-numbers/incoming)
  to use in the application for sending SMS texts
- Make sure the phone number is SMS enabled
- (This will be the phone number patients receive texts from)
- <em>Note: authentication is required in order to complete deployment via the application page,
  which will generate a nominal SMS charge to your connected Twilio account.
  Each authentication SMS sent will cost $0.0075,
  plus an additional $0.05 per successful authentication
  (multi-factor authentication leverages Twilio Verify).
  See Twilio SMS pricing and Twilio Verify pricing for more information.</em>

**Ensure unique application name**

In order to deploy correctly, it is important
that you do not have an existing Twilio Functions Service called ‘hls-telehealth.’
If you do, you will need to delete (or appropriately update the existing name of)
the existing functions service to ensure a conflict doesn’t occur during installation.

**Install Docker Desktop**

Docker desktop will be used to run the application installer locally on your machine.
Goto [Docker Desktop](https://www.docker.com/products/docker-desktop)
and install with default options.
After installation make sure to start Docker desktop.


###Installation Steps


*Installation of this application is supported on the browser that support
[WebRTC Video](https://www.twilio.com/docs/video/javascript#supported-browsers)*


**Ensure completed prerequisites** - ensure that you have completed all prerequisite steps listed above

1. Build docker image of installer by executing
    ```shell
    docker build --tag hls-installer https://github.com/bochoi-twlo/telehealth-v2.git#main
    ```
   This will build the docker image inclding building of the React components. 
2. Run the built docker image by executing below substituing your Twilio credentials from above
   (replace in the below shell command, `$(ACCOUNT_SID)` and `$(AUTH_TOKEN)` with your `ACCOUNT_SID` and `AUTH_TOKEN`, respectively).
    ```shell
    docker run --name hls-installer --rm -p 3000:3000 \
   -e ACCOUNT_SID=$(ACCOUNT_SID) -e AUTH_TOKEN=$(AUTH_TOKEN) -it hls-installer
    ```
3. Open http://localhost:3000/installer.html using a broswer.


4. Followig instructions in the installer to complete installation & configuration.


5Access the application - please reference the [Customer Implementation Guide](https://twilio-cms-prod.s3.amazonaws.com/documents/Telehealth_Implementation_Guide.pdf) for detailed steps.
