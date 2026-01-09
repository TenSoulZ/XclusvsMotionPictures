@echo off
echo Starting setup... > setup_log.txt
echo Checking Python... >> setup_log.txt
python --version >> setup_log.txt 2>&1
echo Checking Node... >> setup_log.txt
node --version >> setup_log.txt 2>&1

echo Installing Django... >> setup_log.txt
cd backend
pip install django djangorestframework django-cors-headers >> setup_log.txt 2>&1
echo Creating Django Project... >> setup_log.txt
python -m django startproject xmp_backend . >> setup_log.txt 2>&1
echo Creating Django App... >> setup_log.txt
python manage.py startapp portfolio >> setup_log.txt 2>&1

echo Setup Backend Complete. >> setup_log.txt

cd ..
echo Creating Vite App... >> setup_log.txt
call npx -y create-vite@latest frontend --template react >> setup_log.txt 2>&1

echo Installing Frontend Deps... >> setup_log.txt
cd frontend
call npm install >> setup_log.txt 2>&1
call npm install bootstrap react-bootstrap react-router-dom axios react-icons framer-motion >> setup_log.txt 2>&1
echo Setup Complete. >> setup_log.txt
