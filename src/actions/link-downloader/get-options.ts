import {ParseLinkResult} from "./types";
import {parseAlignCommands} from "../watermark/align";
import {has} from "../../shared/helpers/object-has";

async function parseLinkDownloaderOptions(
  args: string[],
  parameters: string[],
): Promise<ParseLinkResult | {}> {
  const applyWatermark = !parameters.includes('--no');
  const result = parseAlignCommands(args);

  if (has(result, 'error')) {
    return {};
  }

  return {
    ...result,
    applyWatermark,
  };
}

export {parseLinkDownloaderOptions};