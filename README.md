## FIT GPX Editor

This project was created as part of bachelor thesis at FIT BUT. It is simple web editor to edit your GPX files.

Frontend of project is made with React library, backend is written in Django using GeoDjango modul for saving spatial data and doing spatial operations. For database is used PostgreSQL with PostGIS extension.

To run this application you have to have installed following things:

- Python
- Virtualenv
- Django
- PostgreSQL with PostGIS extension
- Node.js
- npm

### Backend installation


For more information how to setup backend and platform-specific informations visit this page: <https://docs.djangoproject.com/en/3.0/ref/contrib/gis/install/>.

Don't forget to setup your own local database. Follow instructions from link above and change needed data in `settings.py` file.


### Frontend installation

After cloning repository run `npm install` in frontend directory to install needed packages.
