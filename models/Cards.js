const mongoose = require('mongoose');
const { timeStamp } = require('node:console');
const fs = require('node:fs');
const Power= require('./subModels/Points');


  


const CardSchema = new mongoose.Schema({

    title: {
        required:[true,'please add a name '],
        type: String,
        // unique: [true,'duplicate article title'],
        // required: [true, 'Please add a title']
    },



    assets:{
        type:[String],
    },
    // arthur:{type: mongoose.Schema.objectId}
    
  
   
    createdAt: {
        type: Date,

        default: Date.now
    },
   


points:{
type:Power.schema,
default: () => {
    return Power({ attack:50 , defence: 50, speed: 50,control:50 });
  },

}
,
     

 

description:{
    type: String,

    required: true
},






}, {

    toJSON:{virtuals:true},
    toObject:{virtuals:true}


});



// RecordSchema.virtual('likes',{
//     ref:'Like',
//     localField:'_id',
//     foreignField:'record', 
//     justOne:false
//     ,  count: true // And only get the number of docs

// });

// RecordSchema.pre('find', function () {

//     this.populate('likes');
// });


// RecordSchema.pre('deleteOne', {document: true },  async function (next) {
//     console.log(this.title);       
//     const doc =  await Like.find({record:this.id});
//     console.log('likes')

//     console.log(doc)
//   doc.forEach((e)=>e.deleteOne());                    

// fs.unlink(`${process.env.AUDIO_UPLOAD_PATH}/${this.record}`,(function (err) {            
//     if (err) {        
//         console.log('File has been dolooo');                           
                                         
//         console.error(err);                                    
//     }                                                          
//    console.log('File has been Deleted');  

// }));
// next();




// });



module.exports = mongoose.model('Card', CardSchema);