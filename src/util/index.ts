import fs from 'fs';

export const deleteFile =(path)=>{
[`${path}.mp3`,`${path}.mp4`].map( async (el)=>{
        try{
          await fs.unlink(el, (err) => {
            if (err) throw err;
            console.log('path/file was deleted');
          });
        }catch(err){
          console.log(err)
        }
      })
}