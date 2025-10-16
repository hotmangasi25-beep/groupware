import SftpClient from "ssh2-sftp-client";

export const sftpRepository = {
    async connectSFTP(){
        const sftp = new SftpClient();

        try {
            await sftp.connect({
                host: process.env.SFTP_HOST ?? '',
                port: process.env.SFTP_PORT ? parseInt(process.env.SFTP_PORT, 10) : 22,
                username: process.env.SFTP_USER ?? '',
                password: process.env.SFTP_PASS ?? '',
                });
                await sftp.end();
                return { 
                    success: true, message: "Connected successfully"
                 };
            
        } catch (error: unknown) {
            if(error instanceof Error){
                return { success: false, error: error.message };
            }
            return { success: false, error: String(error) };
        }
    },
};

