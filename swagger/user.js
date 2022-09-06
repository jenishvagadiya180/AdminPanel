

//............... signUp.......
/**
* @swagger
* /admin/user/add:
*   post:
*     summary: add new user
*     tags: [admin]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               firstName:
*                 type: string
*                 example: Jenish
*               lastName:
*                 type: string
*                 example: Vagadiya
*               mobileNumber:
*                 type: integer
*                 example: 9157078963
*               email:
*                 type: string
*                 example: jenishvagadiya125@gmail.com
*               password:
*                 type: string
*                 example: jenish@125
*     responses:
*       '200':
*         description: registered successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: integer
*                   example: 200
*                 message:
*                   type: string
*                   example: registered successfully
*                 data:
*                   type: object
*                   properties:
*                     category_Id:
*                       type: string
*                       example: 62e7b9d8096f51eb5b00f22e
*       '500':
*         description: some error occurred
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: number
*                   example: 500
*                 message:
*                   type: string
*                   example: server is not responding
*/


// .....................login with email............

/**
* @swagger
* /admin/user/login:
*   post:
*     summary: login with email
*     tags: [admin]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               email:
*                 type: string
*                 example: jenishvagadiya125@gmail.com
*               password:
*                 type: string
*                 example: jenish@125
*     responses:
*       '200':
*         description: login success
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: integer
*                   example: 200
*                 message:
*                   type: string
*                   example: login successfully
*                 data:
*                   type: object
*                   properties:
*                     firstName:
*                       type: string
*                       example: jenish
*                     id:
*                       type: string
*                       example: 62de869762480966b1948847
*                     token:
*                       type: string
*                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmRlNmQxOTUyYjIyMDFjYzY1YmFkMzkiLCJpYXQiOjE2NTg4MTk4Mjl9.m-seFKvI10ktdubq5bKtTqE0YcT2LTTdI4hCdVeUsOk
*       '500':
*         description: some error occurred
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: number
*                   example: 500
*                 message:
*                   type: string
*                   example: server is not responding
*/


// .....................get all List............

/**
* @swagger
* /admin/user/list:
*   get:
*     summary: get list
*     parameters:
*       - in: query
*         name: pageNumber
*         schema:
*           type: integer
*         required: false
*         description: put page number
*       - in: query
*         name: perPage
*         schema:
*           type: integer
*         required: false
*         description: number of list items per page
*       - in: query
*         name: sortType
*         schema:
*           type: string
*         description: asc for ascending and desc for descending
*       - in: query
*         name: sortField
*         schema:
*           type: string
*         description: put the field name
*       - in: query
*         name: search
*         schema:
*           type: string
*         description:  put the word whichever you want to search
*     tags: [admin]
*     responses:
*       '200':
*         description: success
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: integer
*                   example: 200
*                 message:
*                   type: string
*                   example: success
*                 data:
*                   type: object
*                   properties:
*                     list:
*                       type: array
*                       items:
*                         type: object
*                         properties:
*                           userId:
*                             type: string
*                             example: 62f354c736bad2b96aa2f1f5
*                           firstName:
*                             type: string
*                             example: jenish
*                           lastName:
*                             type: string
*                             example: vagadiya
*                           mobileNumber:
*                             type: number
*                             example: 9157078963
*                           email:
*                             type: string
*                             example: jenishvagadiya125@gmail.com
*                           password:
*                             type: sting
*                             example: jenish@123
*       '500':
*         description: some error occurred
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: number
*                   example: 500
*                 message:
*                   type: string
*                   example: server is not responding
*/

//update user
/**
* @swagger
* /admin/user/update/{userId}:
*   put:
*     summary: update user by id
*     tags: [admin]
*     parameters:
*       - name: userId
*         in: path
*         required: true
*         description: update user by id
*         schema:
*           type: string
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               firstName:
*                 type: string
*                 example: Jenish
*               lastName:
*                 type: string
*                 example: Vagadiya
*               mobileNumber:
*                 type: integer
*                 example: 9157078963
*               email:
*                 type: string
*                 example: jenishvagadiya125@gmail.com
*               password:
*                 type: string
*                 example: jenish@125
*     responses:
*       '201':
*         description: updated successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: integer
*                   example: 200
*                 message:
*                   type: string
*                   example: updated successfully
*                 data:
*                   type: object
*                   properties:
*                     Id:
*                       type: string
*                       example: 62e7b9d8096f51eb5b00f22e
*       '500':
*         description: some error occurred
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: number
*                   example: 500
*                 message:
*                   type: string
*                   example: server is not responding
*/


//delete user
/**
* @swagger
* /admin/user/delete/{userId}:
*   delete:
*     summary: delete user by id
*     tags: [admin]
*     parameters:
*       - name: userId
*         in: path
*         required: true
*         description: delete user by id
*         schema:
*           type: string
*     responses:
*       '200':
*         description: deleted successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: integer
*                   example: 204
*                 message:
*                   type: string
*                   example: deleted successfully
*       '500':
*         description: Some error occurred
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: number
*                   example: 500
*                 message:
*                   type: string
*                   example: server is not responding
*/

//............... forgot Password.......
/**
* @swagger
* /admin/user/forgotPassword:
*   post:
*     summary: add email id
*     tags: [admin]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               email:
*                 type: string
*                 example: jenishvagadiya125@gmail.com
*     responses:
*       '200':
*         description: mail sent successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: integer
*                   example: 200
*                 message:
*                   type: string
*                   example: mail sent successfully
*                 data:
*                   type: object
*                   properties:
*                     email:
*                       type: string
*                       example: jenishvagadiya125@gmail.com
*       '500':
*         description: some error occurred
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: number
*                   example: 500
*                 message:
*                   type: string
*                   example: server is not responding
*/


//............... recover Password.......
/**
* @swagger
* /admin/user/recoverPassword/{token}:
*   put:
*     summary: update password
*     tags: [admin]
*     parameters:
*       - name: token
*         in: path
*         required: true
*         description: update password
*         schema:
*           type: string
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:     
*             type: object
*             properties:
*               newPassword:
*                 type: string
*                 example: jenish@123
*               confirmPassword:
*                 type: string
*                 example: jenish@123
*     responses:
*       '200':
*         description: password set successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: integer
*                   example: 200
*                 message:
*                   type: string
*                   example: password set successfully
*       '500':
*         description: Some error occurred
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:  
*                 status: 
*                   type: number   
*                   example: 500
*                 message: 
*                   type: string
*                   example: server is not responding 
*/

