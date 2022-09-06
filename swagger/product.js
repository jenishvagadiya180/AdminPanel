// add product list
/**
* @swagger
* /admin/product/add:
*   post:
*     summary: add new product
*     tags: [product]
*     requestBody:
*       required: true
*       content:
*        multipart/form-data:
*           schema:
*             type: object
*             properties:
*               name:
*                 type: string
*                 example: Samsung galaxy A52s
*               description:
*                 type: string
*                 example: Tough Armor Back Cover Case Compatible with Samsung Galaxy A52s 5G, A52 5G and A52 4G
*               categoryId:
*                 type: string
*                 example: 62e7b9d8096f51eb5b00f22e
*               image:
*                 type: array
*                 items:
*                   type: string
*                   format: binary
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
*                     productId:
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

//  product list
/**
* @swagger
* /admin/product/list:
*   get:
*     summary: Get Product List
*     tags: [product]
*     parameters:
*       - in: query
*         name: page_no
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
*                     list:
*                       type: array
*                       items:
*                         type: object
*                         properties:
*                           productId:
*                             type: string
*                             example: 62f354c736bad2b96aa2f1f5
*                           name:
*                             type: string
*                             example: Samsung galaxy A52s
*                           description:
*                             type: string
*                             example: Tough Armor Back Cover Case Compatible with Samsung Galaxy A52s 5G, A52 5G and A52 4G
*                           categoryId:
*                             type: string
*                             example: 62e7b9d8096f51eb5b00f22e
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


//  product list by Id
/**
* @swagger
* /admin/product/list/{productId}:
*   get:
*     summary: get product by id
*     tags: [product]
*     parameters:
*       - name: productId
*         in: path
*         required: true
*         description: get product by id
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
*                     productId:
*                       type: string
*                       example: 62f354c736bad2b96aa2f1f5
*                     name:
*                       type: string
*                       example: Samsung galaxy A52s
*                     description:
*                       type: string
*                       example: Tough Armor Back Cover Case Compatible with Samsung Galaxy A52s 5G, A52 5G and A52 4G
*                     categoryId:
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

//update product using put method
/**
* @swagger
* /admin/product/update/{productId}:
*   put:
*     summary: update product
*     tags: [product]
*     parameters:
*       - name: productId
*         in: path
*         required: true
*         description: update product
*         schema:
*           type: string
*     requestBody:
*       required: true
*       content:
*         multipart/form-data:
*           schema:
*             type: object
*             properties:
*               name:
*                 type: string
*                 example: Samsung galaxy A52s
*               description:
*                 type: string
*                 example: Tough Armor Back Cover Case Compatible with Samsung Galaxy A52s 5G, A52 5G and A52 4G
*               categoryId:
*                 type: string
*                 example: 62e7b9d8096f51eb5b00f22e
*               image:
*                 type: array
*                 items:
*                   type: string
*                   format: binary
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
*                     categoryId:
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


//delete product by id
//delete category
/**
* @swagger
* /admin/product/delete/{productId}:
*   delete:
*     summary: delete product by id
*     tags: [product]
*     parameters:
*       - name: productId
*         in: path
*         required: true
*         description: delete product by id
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




//delete productImage by id
//delete category
/**
* @swagger
* /admin/product/image/delete/{imageId}:
*   delete:
*     summary: delete product image by imageId
*     tags: [product]
*     parameters:
*       - name: imageId
*         in: path
*         required: true
*         description: delete productImage by id
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



