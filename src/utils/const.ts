import * as http from 'http';
import axios from 'axios';

export const MAX_TTY_LENGTH = 120;
export const UNKNOWN_VALUE = 'N/A';
export const DEFAULT_PROCESS_ITERATION = 1;
export const DEFAULT_MONGO_PROTOCOL = 'mongodb';
export const PROCESS_ITERATION_OPTION = 'process-iteration';
export const MONGO_PROTOCOL_OPTION = 'mongo-protocol';
export const MONGO_HOST_OPTION = 'mongo-host';
export const MONGO_DATABASE_OPTION = 'mongo-database';
export const MONGO_USERNAME_OPTION = 'mongo-username';
export const MONGO_PASSWORD_OPTION = 'mongo-password';

// Force ipv4 for Axios client
axios.defaults.httpAgent = new http.Agent({family: 4});

export const CRAWDL_HEADER = `
\u25CF       _____ _____       __          _______  _      
\u25CF      / ____|  __ \\     /\\ \\        / /  __ \\| |     
\u25CF     | |    | |__) |   /  \\ \\  /\\  / /| |  | | |     
\u25CF     | |    |  _  /   / /\\ \\ \\/  \\/ / | |  | | |     
\u25CF     | |____| | \\ \\  / ____ \\  /\\  /  | |__| | |____ 
\u25CF      \\_____|_|  \\_\\/_/    \\_\\/  \\/   |_____/|______|
`;

export const CLI_USAGE = `${CRAWDL_HEADER}
Usage: $0 [options]`;
