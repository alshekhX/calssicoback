const mongoose= require('mongoose');






const slotSchemma = new mongoose.Schema({
    start: {
      type: Date,
    },
    finish: {
        type: Date,
        require:true,
    },
    state:{
        type:Boolean,
        require:true

    }
  });



  module.exports = mongoose.model("Slot", slotSchemma);

  
