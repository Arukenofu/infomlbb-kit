interface ParsedCommand {
  command: string | null;
  args: string[];
  parameters: string[];
}

export function parseInput(input: string): ParsedCommand {
  const parts = input.trim().split(/\s+/);

  let command: string | null = null;
  const args: string[] = [];
  const params: string[] = [];

  for (const part of parts) {
    if (!command && part.startsWith("/")) {
      command = part;
    } else if (part.startsWith("--")) {
      params.push(part);
    } else if (part) {
      args.push(part);
    }
  }

  return {
    command,
    args: args,
    parameters: params,
  };
}