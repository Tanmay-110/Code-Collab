@echo off
echo === Building client ===
cd client
call npm run build
cd ..

echo === Building server ===
cd server
call npm run build
cd ..

echo === Preparing deployment package ===
if not exist deploy mkdir deploy
if not exist deploy\server mkdir deploy\server
if not exist deploy\client mkdir deploy\client

echo === Copying server files ===
xcopy /E /Y server\dist deploy\server\dist\
copy server\package.json deploy\server\
copy server\package-lock.json deploy\server\

echo === Copying client files ===
xcopy /E /Y client\dist deploy\client\dist\

echo === Copying root files ===
copy package.json deploy\
copy vercel.json deploy\

echo === DONE! ===
echo Your deployment package is ready in the 'deploy' folder
echo Upload the 'deploy' folder to Vercel for faster deployments 