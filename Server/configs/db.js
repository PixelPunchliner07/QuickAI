// import { neon , neonConfig } from '@neondatabase/serverless';
// import ws from 'ws';


// neonConfig.webSocketConstructor = ws;
// const sql = neon(`${process.env.DATABASE_URL}`);

// export default sql;


// import { neon } from '@neondatabase/serverless';

//  const sql = neon(process.env.DATABASE_URL);
//  console.log('DB HOST:', new URL(process.env.DATABASE_URL).hostname);


// export default sql;

import pkg from 'pg';
const { Pool } = pkg;

export const sql = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

