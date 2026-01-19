FROM nginx:alpine
COPY index.html style.css game.js /usr/share/nginx/html/
RUN chmod -R 755 /usr/share/nginx/html && chown -R nginx:nginx /usr/share/nginx/html
