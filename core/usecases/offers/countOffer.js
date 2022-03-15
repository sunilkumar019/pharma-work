//import model
const model = require("../../models/offers");

//get offers  count
module.exports = async (filters) => {
    filters.valid_upto = {$gte: Date.now() }

  let repId = null;
  if(filters.rep_id){
    repId = filters.rep_id;
    delete filters.rep_id;
  }


  let rs =  await model.find(filters).populate({ path:'reps', select: 'name'}).exec();
  let response = [];
  if(rs.length>0){
    if(repId != null){
      for(let i=0; i< rs.length; i++){
        let row = rs[i];
        if(row.reps)
        {
          if((row.reps.length > 0)){
            for(let j=0; j< (row.reps).length; j++){
              let rep = (row.reps)[j];
              if(rep._id == repId){
                response.push(row);
                break;
              }
            }
          }
          else response.push(row);
        }
        else response.push(row);
      }
    }
    else{
      response = rs;
    }
  }
  return response.length;
}