
// function inside a function
const advanceResults=  (model,populate)=> async(req,res,next)=>{



    let query;
    //copy of req.query
      let reqQuery={...req.query}
      //exxlude fields
      const removFields=['select','sort','limit','page'];
    
      //loop over removefields and delete them from reqQuery 
      removFields.forEach(param=> delete reqQuery[param]);
    
    
      //make req.query string
      let queryStr= JSON.stringify(reqQuery);
    
      //apply oprators to the string
      queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/,match=>`$${match}`);
    
    //find values based on oprators
    query=model.find(JSON.parse(queryStr));


    
    //select specific fields
    if(req.query.select){
    
      //extract selection value
    const selectedFields=req.query.select.split(',').join(' ');
    //use the in mongo select method ,the point is we make it easyer for us and the frontend developer to use this
    query =query.select(selectedFields);
    
    
    }
    
    //sort by specific fields
    if(req.query.sort){
    
      //extract selection value
    const sortBy=req.query.sort.split(',').join(' ');
    //use the in mongo select method ,the point is we make it easyer for us and the frontend developer to use this
    query=query.sort(sortBy);
    
    
    }else{
      query=query.sort('-createdAt');
    
    
    }
    
    //what page ,pagenation
    const page = parseInt(req.query.page,10) ||1;
    //number of resource per page
    const limit= parseInt(req.query.limit,10) ||10;
    //how many record skip also index of the first resource in the page
    const startIndex=(page-1)*limit;
    //obvious
    const endIndex=page*limit;
    
    
    //total number of the schema document in the  database 
    const total=await model.countDocuments();
    
    //nice piece of code, 
    query=query.skip(startIndex).limit(limit);
    
    
if(populate){

   query = query.populate(populate);
}

    
    const result=await query;
    
    // adding next and prev page 
    //pagination object
    const pagination={}
    
    
    if(endIndex<total){
    
    pagination.next={
      page:page+1,
      limit:limit
    }
    }
    if(startIndex>0){
    
      pagination.prev={
        page:page-1,
        limit:limit
      }}


res.advanceResults={

sucess:true,
count:result.length,
pagination,
data: result

}

next();

}
module.exports=advanceResults;