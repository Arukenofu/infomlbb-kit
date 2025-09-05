import {MediaGroupHandler} from "grammy-media-group";

const mediaGroupHandler = new MediaGroupHandler(2000);

export default mediaGroupHandler.middleware();