import {sql} from "../configs/db.js";


export const getUserCreations = async(req,res)=>{
    try {
       const {userId} = req.auth();

       const { rows: creations } = await sql.query(
  "SELECT * FROM creations WHERE user_id = $1 ORDER BY created_at DESC",
  [userId]
);

       res.json({success:true , content: creations})
        
    } catch (error) {
       res.json({success:false , message :error.message}) 
    }
}



export const getPublishedCreations = async(req,res)=>{
    try {
      
       const { rows: creations } = await sql.query(
  "SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC"
);

       return res.json({success:true , content: creations})
        
    } catch (error) {
       return res.json({success:false , message :error.message}) 
    }
}



export const toggleLikes = async(req,res)=>{
    try {

        const {userId} = req.auth();
        const {id} = req.body;

        const { rows } = await sql.query(
            "SELECT * FROM creations WHERE id = $1",
            [id]
            );
            const creations = rows[0];

        if(!creations){
            return res.json({success:false , message :"Creation not found"})
        }
        
        const currentLikes = creations.likes || [];
        const userIdStr = userId.toString();

        let updatedLikes;
        let message;

        if(currentLikes.includes(userIdStr)){
            updatedLikes= currentLikes.filter((user)=>user!==userIdStr);
            message='Creation Unliked';
        }
        else{
            updatedLikes=[...currentLikes,userId];
            message='Creation Liked';
        }

        await sql.query(
            "UPDATE creations SET likes = $1 WHERE id = $2",
            [updatedLikes, id]
            );


       res.json({success:true , message})
        
    } catch (error) {
       res.json({success:false , message :error.message}) 
    }
}

