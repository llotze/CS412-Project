# Personal Budgeting App — CS412 Final Project

Author: Lucas Lotze  
Date: December 2025

Overview
--------
A simple personal budgeting app with a Django + DRF backend and a React (Next.js) frontend.  
You can create accounts, categories, transactions and goals, sign up / log in with JWT, and filter transactions by category.

What’s implemented
-----------------
- Models: Account, Category (global), Transaction, Goal  
- Full CRUD endpoints (create/edit/delete/list)  
- JWT auth (SimpleJWT): register, login  
- Server-side transactions filter: GET /project/api/transactions/?category=<id>  
- React pages: /, /login, /register, /accounts, /categories, /goals, /transactions

API endpoints
-----------------------
- POST /project/api/register/        
- POST /api/token/                    
- POST /api/token/refresh/           
- GET/POST /project/api/categories/
- GET/PUT/DELETE /project/api/category/<id>/
- GET/POST /project/api/accounts/
- GET/PUT/DELETE /project/api/account/<id>/
- GET/POST /project/api/transactions/?category=<id>
- GET/PUT/DELETE /project/api/transaction/<id>/
- GET/POST /project/api/goals/
- GET/PUT/DELETE /project/api/goal/<id>/

Notes
------------
- Category is global (no user FK). Editing/deleting a category affects all users. If you want only admins to manage categories, change the Category detail view permission to IsAdminUser.
- The frontend stores the JWT access token in localStorage under key `access`.

Contact
-------
Lucas Lotze — llotze@bu.edu