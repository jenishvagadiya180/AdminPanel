
// add category list
/**
* @swagger
* /admin/category/add:
*   post:
*     summary: add a new category
*     tags: [category]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               name:
*                 type: string
*                 example: electronics
*     responses:
*       '200':
*         description: added successfully
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
*                   example: added successfully
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

// get list
/**
* @swagger
* /admin/category/list:
*   get:
*     summary: get list
*     tags: [category]
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
*     responses:
*       '200':
*         description: Successful
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
*                   example: Successful
*                 data:
*                   type: object
*                   properties:
*                     list:
*                       type: array
*                       items:
*                         type: object
*                         properties:
*                           categoryId:
*                             type: string
*                             example: 62f354c736bad2b96aa2f1f5
*                           name:
*                             type: string
*                             example: electronics
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


// get list by Id
/**
* @swagger
* /admin/category/list/{categoryId}:
*   get:
*     summary: get data by id
*     tags: [category]
*     parameters:
*       - name: categoryId
*         in: path
*         required: true
*         description: get data by id
*         schema:
*           type: string
*     responses:
*       '200':
*         description: successful
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
*                   example: successful
*                 data:
*                   type: object
*                   properties:
*                     categoryId:
*                       type: string
*                       example: 62f354c736bad2b96aa2f1f5
*                     name:
*                       type: string
*                       example: electronics
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

//update category
/**
* @swagger
* /admin/category/update/{categoryId}:
*   put:
*     summary: update data by id
*     tags: [category]
*     parameters:
*       - name: categoryId
*         in: path
*         required: true
*         description: update data by id
*         schema:
*           type: string
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               name:
*                 type: string
*                 example: electronics
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



//delete category
/**
* @swagger
* /admin/category/delete/{categoryId}:
*   delete:
*     summary: delete data by id
*     tags: [category]
*     parameters:
*       - name: categoryId
*         in: path
*         required: true
*         description: delete data by id
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
*                   example:  deleted successfully
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