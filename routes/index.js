const router= require('express').Router()
const swaggerUi=require('swagger-ui-express')
const swaggerDocument=require('../swagger.json')


router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));
router.use('/', require('../routes/user'))
router.use('/',require('../routes/post'))
router.use('/',require('../routes/comment'))

module.exports = router;


