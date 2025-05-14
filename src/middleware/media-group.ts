import { MediaGroup } from '@dietime/telegraf-media-group';

export const mediaGroupMiddleware = new MediaGroup({timeout: 1000}).middleware();