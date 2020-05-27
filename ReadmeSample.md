**README FILE & GENERAL INFORMATION**

**GENERAL INFO**

    1.  The KATS platform by Readbee ltd. is designed to monitor and track physical inventory across the globe.
        The folowing information includes explanation of the local libraries and functions throughout the platform.

        Please read carefully and contact info@read-bee.com for any inquries.

    
**A. INSTALLATION STEPS**

      1. Install: Ubuntu, Git, Nodejs, libpq-dev, psql 11, xdotool, chromium, pgadmin.
      2. Clone repos: cdm, kats.
      3. User in psql: username: postgres, pass: adminrfid2019.
      4. Import db.
      5. Optional: Nginx.
      6. Install pm2 from npm.
      7. Done.

**B. FOLDERS & FILES**

    B.1 bin

        B.1.1 www
              Linux sh file where port is set and app is run.

    B.2 db

        B.2.1 index.js
              Pool module is set and path to db config secert is set.

    B.3 local_modules

        B.3.1 adminReport.js
              Pdf report is sent to admin email list at 22:30 PM CDT.

        B.3.2 alarmNotification.js
              Alarm buzzer wav file path set.

        B.3.3 emailNotification.js
              Email notification with sensor ID sent to list when 'missing', which is stored in db table emails.

        B.3.4 emailReport.js
              Email report sent to email list at 22:30 PM CDT.

        B.3.5 pdfCreate.js
              Pdf report created for missing items at 22:00 PM CDT.

    B.4 node_modules
        all library modules from the web for the project.

    B.5 secrets

        B.5.1 db_config.js
              database access data i.e user, host etc.

    B.6 static

        B.6.1 backup
              postgreSQL backup files for each location.
              Gets updated every time push is done from client to server.

        B.6.2 css
