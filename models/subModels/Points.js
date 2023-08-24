const mongoose= require('mongoose');






const pointSchemma = new mongoose.Schema({
    attack: {
      type: Number,
      default:50,
    
      min:1,
      max:100
    },
    defence: {
        type: Number,
        default:50,
     
        min:1,
        max:100

    },
    speed:{
        type:Number,
        default:50,
       
        min:1,
        max:100

    },
    control:{
        default:50,
        type:Number,

        min:1,
        max:100



    }
  });



  module.exports = mongoose.model("Point", pointSchemma);
