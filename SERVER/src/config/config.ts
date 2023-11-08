import dotenv from "dotenv"

type Tconfig = {
    [key: string]: EnvironmentConfig
}

type EnvironmentConfig = {
    app: Appconfig
}

type Appconfig = {
    PORT: string | number,
    MONGO_DB_URL?: string
}

if (process.env.NODE_ENV === "production"){
    dotenv.config({ path: '.env.production'})
} else {
    dotenv.config({ path: '.env.development'})
}

const ENV = process.env.NODE_ENV ?? 'development'

const CONFIG: Tconfig = {
    development: {
        app:{
            PORT: process.env.PORT || 4001,
            MONGO_DB_URL: process.env.MONGO_DB_URL
        },
    },
    production: {
        app:{
            PORT: process.env.PORT || 4002
        }
    }
}

export default CONFIG[ENV]