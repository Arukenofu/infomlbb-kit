import 'dotenv/config.js'

// setting environment variables type
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      BOT_TOKEN: string;
      SUPABASE_URL: string;
    }
  }
}

// setting custom String methods
declare global {
  interface String {
    toCapitalize(): string;
    toCapitalizeWords(): string;
  }
}

if (!String.prototype.toCapitalize) {
  String.prototype.toCapitalize = function (): string {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
  };
}

if (!String.prototype.toCapitalizeWords) {
  String.prototype.toCapitalizeWords = function (): string {
    return this.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };
}

export {};