const express= require('express');
const Stadium=require('../models/Stadium');


const { protect,authorize}=require('../middlewares/protect')

const{deleteStadium,getStadium,getStadiums,UpdateStadium,createStadium,checkStadiumAvail}= require('../controllers/stadiumC');
const advanceResults = require('../middlewares/advanceResults');

const router=express.Router();

//redirect to comments route
// router.use('/:articleId/comments',commentRoute);
// router.use('/:articleId/photos',articlePhtRoute);


router.route('/').get(advanceResults(Stadium),getStadiums);
router.route('/').post(protect,authorize('user'),createStadium);

router.route('/:id').put(protect,authorize('user'),UpdateStadium).delete(protect,authorize('user'),deleteStadium).get(getStadium);
router.route('/check').post(protect,checkStadiumAvail);





module.exports= router;
