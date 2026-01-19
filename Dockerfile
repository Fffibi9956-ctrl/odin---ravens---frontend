FROM httpd:alpine
COPY index.html style.css game.js /usr/local/apache2/htdocs/
