import fs, { readFileSync } from "fs";
import youtubedl from "youtube-dl";
import ffmpeg from "fluent-ffmpeg";
import { bot } from "../index";
import { app } from "../firebase/index";

(global as any).XMLHttpRequest = require("xhr2");

export const downloadAndConvert = async (query) => {
  try {
    let file;
    let newName;
    const randomString = Math.random().toString(20).substr(2, 6)

    const video = await youtubedl(
      query.update.callback_query.data,
      ["--format=18"],
      {
        cwd: __dirname,
      }
    );

    await video.pipe(fs.createWriteStream(`${randomString}.mp4`));

    await video.on("info", (info) => {
      console.log("Download started");
      console.log("filename: " + info._filename);
      console.log("size: " + info.size);
      const name = info._filename;
      name.replace(".mp4", ".mp3");
      const arr = name.split(".");
      arr[arr.length - 1] = "mp3";
      newName = arr.join(".");
    });

    video.on("end", async () => {
      console.log("finished downloading!");

      await ffmpeg(`/app/${randomString}.mp4`)
        .withAudioCodec("libmp3lame")
        .toFormat("mp3")
        .saveToFile(`/app/${randomString}.mp3`)
        .on("end", async () => {
          
          file = readFileSync(`/app/${randomString}.mp3`);
          const storageRef = await app.storage().ref();
          const fileRef = storageRef.child(newName).put(file);

         await fileRef.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                 console.log("Upload is " + progress + "% done");
            },
            null,
             () => {
              fileRef.snapshot.ref.getDownloadURL().then((downloadURL) => {
               bot.telegram.sendAudio(query.from.id, downloadURL);
              });
            }

          );
          
          [`${randomString}.mp3`,`${randomString}.mp4`].map( async (el)=>{
            try{
              await fs.unlink(el, (err) => {
                if (err) throw err;
                console.log('path/file was deleted');
              });
            }catch(err){
              console.log(err)
            }
          })
       });
    });
    
  } catch (err) {
    console.log(err);
  }
};
