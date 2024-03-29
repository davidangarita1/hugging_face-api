import {HfInference} from "@huggingface/inference";
import {config} from "dotenv";
import fs from 'fs';

config()

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

const imageURL = "https://th.bing.com/th/id/OIP.IloRiBicRGO722X08Q4uxgHaE8?rs=1&pid=ImgDetMain"

const getImageDescription = async (image) => {
    const model = "Salesforce/blip-image-captioning-large";
    try {
        const response = await fetch(image);
        const blob = await response.blob();

        const result = await hf.imageToText({
            data: blob,
            model
        });
        console.log(result);
    }catch (error){
        console.error(error);
    }
}

const getImageFromtext = async (text) => {
    const model = "stabilityai/stable-diffusion-2";
    try {
        const result = await hf.textToImage({
            inputs: text,
            model,
            parameters: {
                negative_prompt: 'blurry',
            }
        });
        await saveImage(result);
    }catch (error){
        console.error(error);
    }
}

const saveImage = async (image) => {
    const buffer = Buffer.from(await image.arrayBuffer());

    const dir = './src/images';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    const imageName = `generated_image_${Date.now()}.png`;
    const imagePath = `${dir}/${imageName}`;

    fs.writeFileSync(imagePath, buffer);
    console.log("Imagen guardada en:", imagePath);
}

const text = "henry cavill talking with Emma Watson"
await getImageFromtext(text);