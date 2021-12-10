1) Clone/ Extract the file in local
2) Run command: npm i
3) Change the port number / mongoDB uri , if required
4) Run the application on local port using comand: npm run start / npm run start:dev
5) Use the swagger endpoint '/api' or the postman to access the end-points
6) To Access the VIEW use the end-point '/view/dashboard' in browser
7)Please find the below end-points and their purpose as follows
-@Post('url')- takes in long URLS, shortens it and stores in data base
-@Get('url/:shortUrl')- Fetch the record from the databases based on the short URL given in the params
-@Get('url/get-all')- Fetch all the records present in the database
-@Get(':shortUrl')- Redirects the user to the long URL based on the short URL provided, can be directly used in a browser, Eg: http://localhost:3000/Erklyf , this will redirect to the corresponding long URL
-@Get('view/dashboard')- To build a UI for hashing URLs and tables to dispaly all URLs hashed and the analytics - (Additional Feature)
8) Comments have been added in the code for better understanding
